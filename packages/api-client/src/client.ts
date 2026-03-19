import { createHttpClient, type HttpClient } from './http';

let client: HttpClient | null = null;

export function getApiClient(): HttpClient {
  if (!client) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    client = createHttpClient(baseUrl);
  }
  return client;
}

export function createApiClient(baseUrl: string): HttpClient {
  return createHttpClient(baseUrl);
}
