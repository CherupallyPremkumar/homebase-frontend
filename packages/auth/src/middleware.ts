import { type NextRequest, NextResponse } from 'next/server';

export interface MiddlewareConfig {
  publicPaths?: string[];
  loginUrl: string;
}

/**
 * Creates auth middleware that checks for session cookie.
 * NextAuth handles the actual token validation — this just checks if the cookie exists
 * and redirects to login if not.
 */
export function createAuthMiddleware(config: MiddlewareConfig) {
  const publicPaths = new Set(config.publicPaths || []);

  return function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip public paths
    if (publicPaths.has(pathname) || pathname.startsWith('/api/auth') || pathname.startsWith('/_next') || pathname.includes('.')) {
      return NextResponse.next();
    }

    // Check for session cookie (NextAuth v5 uses __Secure- prefix in production)
    const sessionCookie =
      request.cookies.get('__Secure-authjs.session-token') ||
      request.cookies.get('authjs.session-token');

    if (!sessionCookie) {
      const signInUrl = new URL(config.loginUrl, request.url);
      signInUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(signInUrl);
    }

    // Add security headers
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');

    return response;
  };
}
