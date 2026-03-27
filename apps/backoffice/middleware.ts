import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './auth';
import { buildCsp, generateNonce, nextWithCsp, withCsp } from '@homebase/auth';

// Role → allowed path prefixes (root / is always allowed for authenticated users)
const ROLE_ROUTES: Record<string, string[]> = {
  AGENT:     ['/oms'],
  ADMIN:     ['/oms', '/finance', '/warehouse'],
  WAREHOUSE: ['/warehouse'],
};

// Default landing page per role
const ROLE_HOME: Record<string, string> = {
  AGENT:     '/',
  ADMIN:     '/',
  WAREHOUSE: '/',
};

// Priority order: highest privilege first — ADMIN wins over AGENT wins over WAREHOUSE
const ROLE_PRIORITY = ['ADMIN', 'AGENT', 'WAREHOUSE'] as const;

export default auth((req: NextRequest & { auth: { user?: { roles?: string[]; email?: string | null } } | null }) => {
  const { pathname } = req.nextUrl;

  // Generate nonce + CSP for every response
  const nonce = generateNonce();
  const isWarehouse = pathname.startsWith('/warehouse');
  const keycloakOrigin = (process.env.KEYCLOAK_ISSUER || 'http://localhost:8180/realms/homebase').replace(/\/realms\/.*$/, '');
  const csp = buildCsp(nonce, {
    imgSrc: ['http://localhost:*'],
    mediaSrc: isWarehouse ? "'self' blob:" : undefined,
    formAction: [keycloakOrigin],
  });

  // req.auth is the session — null when unauthenticated (NextAuth v5 pattern)
  if (!req.auth) {
    const response = NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url)
    );
    return withCsp(response, nonce, csp);
  }

  const roles: string[] = req.auth.user?.roles ?? [];
  const userEmail = req.auth.user?.email ?? 'unknown';

  // Authenticated but no backoffice roles (e.g. CUSTOMER, SUPPLIER) — deny access
  const BACKOFFICE_ROLES = ['ADMIN', 'AGENT', 'WAREHOUSE'];
  const hasBackofficeRole = roles.some((r) => BACKOFFICE_ROLES.includes(r));
  if (!hasBackofficeRole) {
    console.warn(`[ACCESS_DENIED] user=${userEmail} roles=[${roles.join(',')}] path=${pathname} reason=no_backoffice_role`);
    const response = NextResponse.redirect(new URL('/no-access', req.url));
    return withCsp(response, nonce, csp);
  }

  // Resolve home by priority — ADMIN > AGENT > WAREHOUSE, ignore Keycloak default roles
  const roleHome = ROLE_PRIORITY.find((r) => roles.includes(r));
  const home = roleHome ? ROLE_HOME[roleHome] : null;

  // Root — everyone sees the dashboard (role-filtered cards)
  if (pathname === '/') {
    return nextWithCsp(req, nonce, csp);
  }

  // Check if the user's roles allow the requested path
  const allowed = roles.some((role) =>
    (ROLE_ROUTES[role] ?? []).some((prefix) => pathname.startsWith(prefix))
  );

  if (!allowed) {
    console.warn(`[ACCESS_DENIED] user=${userEmail} roles=[${roles.join(',')}] path=${pathname} reason=role_path_mismatch`);
    if (home) {
      const response = NextResponse.redirect(new URL(home, req.url));
      return withCsp(response, nonce, csp);
    }
    return new NextResponse('Access Denied', { status: 403 });
  }

  return nextWithCsp(req, nonce, csp);
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth|api/proxy|login|signed-out|session-expired|no-access|\\.well-known|.*\\.png$).*)'],
};
