import { createHttpClient, type HttpClient } from './http';

let client: HttpClient | null = null;

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('NEXT_PUBLIC_API_URL environment variable is required in production');
    }
    return 'http://localhost:8080';
  }
  return url;
}

export function getApiClient(): HttpClient {
  if (!client) {
    client = createHttpClient(getBaseUrl());
  }
  return client;
}

export function createApiClient(baseUrl: string): HttpClient {
  return createHttpClient(baseUrl);
}
