import { createHttpClient, type HttpClient } from './http';

let browserClient: HttpClient | null = null;
let serverClient: HttpClient | null = null;

function getServerBaseUrl(): string {
  const url = process.env.BACKEND_URL;
  if (!url) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('BACKEND_URL environment variable is required in production');
    }
    return 'http://localhost:8081';
  }
  return url;
}

/**
 * Returns the shared API client.
 *
 * Browser: routes through /api/proxy (Next.js server injects JWT + Chenile headers).
 * Server (SSR/ISR): calls backend directly via BACKEND_URL.
 */
export function getApiClient(): HttpClient {
  if (typeof window !== 'undefined') {
    if (!browserClient) {
      browserClient = createHttpClient('/api/proxy');
    }
    return browserClient;
  }

  if (!serverClient) {
    serverClient = createHttpClient(getServerBaseUrl());
  }
  return serverClient;
}

export function createApiClient(baseUrl: string, defaultHeaders?: Record<string, string>): HttpClient {
  return createHttpClient(baseUrl, defaultHeaders);
}
