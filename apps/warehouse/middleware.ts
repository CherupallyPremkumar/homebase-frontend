import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const ALLOWED_ROLES = ['WAREHOUSE', 'ADMIN'];

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!token) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(request.nextUrl.pathname)}`, request.url));
  }

  const roles = (token.roles as string[]) || [];
  const hasAccess = ALLOWED_ROLES.some((r) => roles.includes(r));

  if (!hasAccess) {
    return new NextResponse('Access Denied — you do not have the required role for this application.', {
      status: 403,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth|api/proxy|login|.*\.png$).*)'],
};
