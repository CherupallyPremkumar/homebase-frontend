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
  const publicPrefixes = config.publicPaths || [];

  return function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Always skip: auth routes, API proxy, static assets, Next.js internals
    if (
      pathname.startsWith('/api/auth') ||
      pathname.startsWith('/api/proxy') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/auth') ||
      pathname.includes('.')
    ) {
      return NextResponse.next();
    }

    // Skip public paths (prefix match — /products matches /products/123)
    const isPublic = publicPrefixes.some(
      (p) => pathname === p || pathname.startsWith(p + '/'),
    );
    if (isPublic) {
      return NextResponse.next();
    }

    // Check for session cookie (NextAuth v5 uses __Secure- prefix in production)
    const sessionCookie =
      request.cookies.get('__Secure-authjs.session-token') ||
      request.cookies.get('authjs.session-token');

    if (!sessionCookie) {
      // Redirect to NextAuth's Keycloak sign-in
      const signInUrl = new URL('/api/auth/signin/keycloak', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Add security headers
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');

    return response;
  };
}
