import { type NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { randomUUID } from 'crypto';

/**
 * Known query module path prefixes.
 * POST requests to these prefixes are query calls → rewrite to /q/ with queryName in body.
 * All other requests (GET/PUT/PATCH/DELETE) are mutation calls → forward as-is.
 */
const QUERY_PREFIXES = new Set([
  'dashboard', 'storefront', 'oms', 'wms',
  'user', 'product', 'order', 'cart', 'inventory', 'shipping', 'supplier',
  'payment', 'settlement', 'returnrequest', 'return-processing', 'fulfillment',
  'warehouse', 'promo', 'checkout', 'notification', 'support', 'review',
  'offer', 'pricing', 'catalog', 'search', 'recommendation', 'disputes',
  'cms', 'cconfig', 'compliance', 'tax', 'organisation', 'media',
  'rules-engine', 'onboarding', 'seller', 'analytics', 'reconciliation',
  'reporting', 'clickstream', 'wishlist', 'invoice',
]);

/**
 * Server-side API proxy.
 * Reads JWT from encrypted session cookie (httpOnly — browser never sees it).
 * Injects Chenile-required headers and forwards to backend.
 *
 * Query routing:
 * - POST /api/proxy/{module}/{queryName} → POST /q/ with {"queryName": "{queryName}", ...body}
 * - All other requests forwarded as-is to BACKEND_URL
 *
 * Security:
 * - Rejects unauthenticated mutation requests (PUT/PATCH/DELETE)
 * - Validates target URL stays on the configured backend origin (SSRF protection)
 * - Timeouts: 5s for GET, 30s for mutations
 */
export function createApiProxy() {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8081';
  const tenantId = process.env.TENANT_ID || 'homebase';
  const backendOrigin = new URL(backendUrl).origin;

  return async function handler(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> },
  ) {
    const { path } = await context.params;
    const targetPath = '/' + path.join('/');

    // Check if this is a query call: POST to /{module}/{queryName}
    const isPost = request.method === 'POST';
    const pathPrefix = path[0];
    const queryName = path[1];
    const isQueryCall = isPost && pathPrefix && QUERY_PREFIXES.has(pathPrefix) && queryName;

    const targetUrl = isQueryCall
      ? new URL('/q/', backendUrl)
      : new URL(targetPath, backendUrl);

    // SSRF protection — ensure target stays on configured backend
    if (targetUrl.origin !== backendOrigin) {
      return NextResponse.json(
        { success: false, code: 400, description: 'Invalid proxy target' },
        { status: 400 },
      );
    }

    // Preserve query parameters
    request.nextUrl.searchParams.forEach((value, key) => {
      targetUrl.searchParams.set(key, value);
    });

    // Read JWT from encrypted session cookie (server-side only)
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    const isMutation = !['GET', 'HEAD', 'OPTIONS'].includes(request.method);

    // Chenile uses POST for search queries — these are safe and may be unauthenticated.
    // Only reject unauthenticated true mutations (PUT/PATCH/DELETE).
    // POST requests are allowed without auth (backend enforces per-query ACLs).
    const requiresAuth = isMutation && request.method !== 'POST';
    if (requiresAuth && !token?.accessToken) {
      return NextResponse.json(
        { success: false, code: 401, description: 'Authentication required' },
        { status: 401 },
      );
    }

    // Build Chenile-required headers + standard API headers
    const correlationId = request.headers.get('x-correlation-id') || randomUUID();
    const requestId = request.headers.get('x-request-id') || randomUUID();
    const headers: Record<string, string> = {
      'Content-Type': request.headers.get('content-type') || 'application/json',
      'Accept': 'application/json',
      // Chenile identity & routing
      'x-chenile-tenant-id': tenantId,
      // Tracing
      'X-Correlation-Id': correlationId,
      'X-Request-Id': requestId,
      // Geo & locale — forwarded from browser or defaults
      'X-Country': request.headers.get('x-country') || 'IN',
      'X-Currency': request.headers.get('x-currency') || 'INR',
      'X-Timezone': request.headers.get('x-timezone') || 'Asia/Kolkata',
      'Accept-Language': request.headers.get('accept-language') || 'en-IN',
      // Client context
      'X-Channel': request.headers.get('x-channel') || 'platform-web',
      'X-Device-Type': request.headers.get('x-device-type') || 'desktop',
      'X-App-Version': request.headers.get('x-app-version') || '1.0.0',
    };

    // Forward session & client IP if present
    const sessionId = request.headers.get('x-session-id');
    if (sessionId) headers['X-Session-Id'] = sessionId;
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-client-ip');
    if (clientIp) headers['X-Client-Ip'] = clientIp;
    // Idempotency key for mutations
    const idempotencyKey = request.headers.get('x-idempotency-key');
    if (idempotencyKey) headers['X-Idempotency-Key'] = idempotencyKey;

    // Only send Bearer token if it exists, hasn't failed refresh, and isn't expired
    const isTokenValid = token?.accessToken
      && !token.error
      && (!token.expiresAt || Date.now() / 1000 < (token.expiresAt as number));

    if (isTokenValid) {
      headers['Authorization'] = `Bearer ${token!.accessToken as string}`;
    }

    // Forward request body — inject queryName for query calls
    let body: string | undefined;
    if (isMutation) {
      const rawBody = await request.text();
      if (isQueryCall) {
        // Rewrite: inject queryName into the JSON body for /q/ endpoint
        try {
          const parsed = rawBody ? JSON.parse(rawBody) : {};
          parsed.queryName = queryName;
          body = JSON.stringify(parsed);
        } catch {
          body = JSON.stringify({ queryName });
        }
      } else {
        body = rawBody;
      }
    }

    try {
      const response = await fetch(targetUrl.toString(), {
        method: request.method,
        headers,
        body,
        signal: AbortSignal.timeout(isMutation ? 30000 : 5000),
      });

      const responseBody = await response.text();

      const responseHeaders = new Headers();
      responseHeaders.set(
        'Content-Type',
        response.headers.get('content-type') || 'application/json',
      );
      responseHeaders.set('X-Correlation-Id', correlationId);

      return new NextResponse(responseBody, {
        status: response.status,
        headers: responseHeaders,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'TimeoutError') {
        return NextResponse.json(
          { success: false, code: 504, description: 'Backend request timed out' },
          { status: 504 },
        );
      }

      console.error('[API Proxy] Backend request failed:', error);
      return NextResponse.json(
        { success: false, code: 502, description: 'Backend unavailable' },
        { status: 502 },
      );
    }
  };
}
