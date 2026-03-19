import { createAuthMiddleware } from '@homebase/auth';

const middleware = createAuthMiddleware({
  publicPaths: [],
  loginUrl: '/api/auth/signin',
});

export default middleware;

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
