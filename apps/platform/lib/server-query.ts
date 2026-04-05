import { QueryClient, dehydrate } from '@tanstack/react-query';
import { getToken } from 'next-auth/jwt';
import { cookies, headers } from 'next/headers';
import { createApiClient, type HttpClient } from '@homebase/api-client';

export { dehydrate };

/**
 * Creates a fresh QueryClient for server-side prefetching.
 * Each request gets its own instance -- never share across requests.
 */
export async function createServerQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000 },
    },
  });
}

/**
 * Reads the access token from the encrypted NextAuth session cookie.
 * Works only in Server Components, Route Handlers, and Server Actions.
 */
async function getServerToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const headerStore = await headers();
    const token = await getToken({
      req: {
        cookies: Object.fromEntries(
          cookieStore.getAll().map((c) => [c.name, c.value]),
        ),
        headers: Object.fromEntries(headerStore.entries()),
      } as Parameters<typeof getToken>[0]['req'],
      secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    });
    return (token?.accessToken as string) || null;
  } catch {
    return null;
  }
}

/**
 * Server-side API client that calls the backend directly (no proxy needed).
 * Injects the bearer token and Chenile tenant header automatically.
 */
export async function getAuthenticatedApiClient(): Promise<HttpClient> {
  const accessToken = await getServerToken();
  const defaultHeaders: Record<string, string> = {
    'x-chenile-tenant-id': process.env.TENANT_ID || 'homebase',
    'X-Channel': 'platform-web',
  };
  if (accessToken) {
    defaultHeaders['Authorization'] = `Bearer ${accessToken}`;
  }
  return createApiClient(
    process.env.BACKEND_URL || 'http://localhost:8081',
    defaultHeaders,
  );
}

/**
 * Executes a Chenile query on the server side.
 *
 * On the client, queries go through the proxy which rewrites
 * POST /{module}/{queryName} to POST /q/ with queryName in body.
 * This helper replicates that rewriting for direct server-to-backend calls.
 */
export async function serverQuery<T>(
  api: HttpClient,
  queryName: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  return api.post<T>('/q/', { queryName, ...params });
}
