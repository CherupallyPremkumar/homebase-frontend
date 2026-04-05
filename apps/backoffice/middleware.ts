import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Auth disabled for local development
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth|api/proxy|login|signed-out|session-expired|no-access|\\.well-known|.*\\.png$).*)'],
};
