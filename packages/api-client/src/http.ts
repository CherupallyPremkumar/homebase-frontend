import type { GenericResponse } from '@homebase/types';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors: Array<{ errorNum: number; subErrorNum: number; description: string; field?: string }> = [],
    public code?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
}

const DEFAULT_TIMEOUT = 5000;
const MAX_RETRIES = 2;
const RETRY_DELAYS = [200, 400];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class HttpClient {
  private inflight = new Map<string, Promise<unknown>>();

  constructor(
    private baseUrl: string,
    private defaultHeaders: Record<string, string> = {},
  ) {}

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    const key = `GET:${path}`;
    const existing = this.inflight.get(key);
    if (existing) return existing as Promise<T>;

    const promise = this.requestWithRetry<T>('GET', path, undefined, options).finally(() => {
      this.inflight.delete(key);
    });
    this.inflight.set(key, promise);
    return promise;
  }

  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', path, body, options);
  }

  async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', path, body, options);
  }

  async patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', path, body, options);
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', path, undefined, options);
  }

  private async requestWithRetry<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions,
    attempt = 0,
  ): Promise<T> {
    try {
      return await this.request<T>(method, path, body, options);
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.status >= 400 &&
        error.status < 500
      ) {
        throw error;
      }
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAYS[attempt]!);
        return this.requestWithRetry<T>(method, path, body, options, attempt + 1);
      }
      throw error;
    }
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const timeout = options?.timeout ?? DEFAULT_TIMEOUT;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const signal = options?.signal
      ? anySignal(options.signal, controller.signal)
      : controller.signal;

    try {
      const correlationId =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : Math.random().toString(36).substring(2);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-chenile-tenant-id': 'homebase',
        'X-Correlation-Id': correlationId,
        ...this.defaultHeaders,
        ...options?.headers,
      };

      const response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal,
      });

      const json: GenericResponse<T> = await response.json();

      if (!response.ok) {
        throw new ApiError(
          json.description || `HTTP ${response.status}`,
          response.status,
          json.errors?.map((e) => ({
            errorNum: e.errorNum,
            subErrorNum: e.subErrorNum,
            description: e.description,
            field: e.field,
          })) ?? [],
          json.code,
        );
      }

      if (!json.success && json.errors?.length) {
        throw new ApiError(
          json.description || 'Request failed',
          response.status,
          json.errors.map((e) => ({
            errorNum: e.errorNum,
            subErrorNum: e.subErrorNum,
            description: e.description,
            field: e.field,
          })),
          json.code,
        );
      }

      return json.data;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

function anySignal(...signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort(signal.reason);
      return controller.signal;
    }
    signal.addEventListener('abort', () => controller.abort(signal.reason), {
      once: true,
    });
  }
  return controller.signal;
}

export function createHttpClient(baseUrl: string, defaultHeaders?: Record<string, string>): HttpClient {
  return new HttpClient(baseUrl, defaultHeaders);
}
