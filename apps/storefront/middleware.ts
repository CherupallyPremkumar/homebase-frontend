import { createAuthMiddleware } from '@homebase/auth';

const middleware = createAuthMiddleware({
  publicPaths: ['/', '/products', '/search', '/categories'],
  loginUrl: '/api/auth/signin',
});

export default middleware;

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml|.*\\.png$).*)'],
};
