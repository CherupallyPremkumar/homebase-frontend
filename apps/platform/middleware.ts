import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const ALLOWED_ROLES = ['ADMIN', 'AGENT'];

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  // Not authenticated → redirect to login
  if (!token?.accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check roles — platform app requires ADMIN or AGENT
  const roles = (token.roles as string[]) || [];
  const hasAccess = ALLOWED_ROLES.some((r) => roles.includes(r));
  if (!hasAccess) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth|api/proxy|login|unauthorized|.*\\.png$).*)'],
};
