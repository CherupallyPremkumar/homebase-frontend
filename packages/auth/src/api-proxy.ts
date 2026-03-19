/**
 * Creates a fetch wrapper that injects the Bearer token from the session.
 * Use this in Server Components and API routes.
 */
export function createAuthenticatedFetch(accessToken: string) {
  return function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${accessToken}`);

    return fetch(url, {
      ...options,
      headers,
    });
  };
}
