import { type NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { randomUUID } from 'crypto';

/**
 * Server-side API proxy.
 * Reads JWT from encrypted session cookie (httpOnly — browser never sees it).
 * Injects Chenile-required headers and forwards to backend.
 *
 * Flow: Browser → /api/proxy/v1/orders/123 → this proxy → backend:8080/api/v1/orders/123
 *
 * Headers injected:
 * - Authorization: Bearer {Keycloak access token}
 * - x-chenile-tenant-id: homebase
 * - X-Correlation-Id: {uuid}
 * - Content-Type: application/json
 */
export function createApiProxy() {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
  const tenantId = process.env.TENANT_ID || 'homebase';

  return async function handler(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> },
  ) {
    const { path } = await context.params;
    const targetPath = '/api/' + path.join('/');
    const targetUrl = new URL(targetPath, backendUrl);

    // Preserve query parameters from the original request
    request.nextUrl.searchParams.forEach((value, key) => {
      targetUrl.searchParams.set(key, value);
    });

    // Read the JWT from the encrypted session cookie (server-side only).
    // getToken decrypts the NextAuth cookie and returns the JWT payload,
    // which includes accessToken from the jwt callback in config.ts.
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    // Build Chenile-required headers
    const correlationId = request.headers.get('x-correlation-id') || randomUUID();
    const headers: Record<string, string> = {
      'Content-Type': request.headers.get('content-type') || 'application/json',
      'Accept': 'application/json',
      'x-chenile-tenant-id': tenantId,
      'X-Correlation-Id': correlationId,
    };

    // Inject Bearer token if authenticated
    if (token?.accessToken) {
      headers['Authorization'] = `Bearer ${token.accessToken as string}`;
    }

    // Forward request body for mutation methods
    let body: string | undefined;
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      body = await request.text();
    }

    try {
      const response = await fetch(targetUrl.toString(), {
        method: request.method,
        headers,
        body,
        signal: AbortSignal.timeout(request.method === 'GET' ? 5000 : 30000),
      });

      const responseBody = await response.text();

      // Build response — forward content type and correlation ID
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
