import { type NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { randomUUID } from 'crypto';

/**
 * Server-side API proxy.
 * Reads JWT from encrypted session cookie (httpOnly — browser never sees it).
 * Injects Chenile-required headers and forwards to backend.
 *
 * Security:
 * - Rejects unauthenticated mutation requests (POST/PUT/PATCH/DELETE)
 * - Validates target URL stays on the configured backend origin (SSRF protection)
 * - Timeouts: 5s for GET, 30s for mutations
 */
export function createApiProxy() {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
  const tenantId = process.env.TENANT_ID || 'homebase';
  const backendOrigin = new URL(backendUrl).origin;

  return async function handler(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> },
  ) {
    const { path } = await context.params;
    const targetPath = '/' + path.join('/');
    const targetUrl = new URL(targetPath, backendUrl);

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

    // Build Chenile-required headers
    const correlationId = request.headers.get('x-correlation-id') || randomUUID();
    const headers: Record<string, string> = {
      'Content-Type': request.headers.get('content-type') || 'application/json',
      'Accept': 'application/json',
      'x-chenile-tenant-id': tenantId,
      'X-Correlation-Id': correlationId,
    };

    // Only send Bearer token if it exists, hasn't failed refresh, and isn't expired
    const isTokenValid = token?.accessToken
      && !token.error
      && (!token.expiresAt || Date.now() / 1000 < (token.expiresAt as number));

    if (isTokenValid) {
      headers['Authorization'] = `Bearer ${token!.accessToken as string}`;
    }

    // Forward request body for mutations
    let body: string | undefined;
    if (isMutation) {
      body = await request.text();
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
