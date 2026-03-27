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

/**
 * Transforms frontend SearchRequest fields to Chenile's expected format.
 * Frontend uses: pageSize, sortCriteria[{ field, order }]
 * Chenile expects: numRowsInPage, sortCriteria[{ name, ascendingOrder }]
 */
function transformSearchRequest(body: unknown): unknown {
  if (!body || typeof body !== 'object') return body;
  const obj = body as Record<string, unknown>;

  // Only transform if this looks like a SearchRequest (has pageSize or queryName)
  if (!('pageSize' in obj) && !('queryName' in obj)) return body;

  const transformed: Record<string, unknown> = { ...obj };

  // Map pageSize → numRowsInPage
  if ('pageSize' in transformed) {
    transformed.numRowsInPage = transformed.pageSize;
    delete transformed.pageSize;
  }

  // Map sortCriteria[{ field, order }] → [{ name, ascendingOrder }]
  if (Array.isArray(transformed.sortCriteria)) {
    transformed.sortCriteria = transformed.sortCriteria.map(
      (criterion: Record<string, unknown>) => {
        if ('field' in criterion) {
          return {
            name: criterion.field,
            ascendingOrder: criterion.order === 'ASC',
          };
        }
        return criterion;
      },
    );
  }

  return transformed;
}

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
    return this.request<T>('POST', path, transformSearchRequest(body), options);
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
        'x-chenile-tenant-id': process.env.CHENILE_TENANT_ID || 'homebase',
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

      return json.payload;
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
    signal.addEventListener(
      'abort',
      () => controller.abort(signal.reason),
      { once: true, signal: controller.signal },
    );
  }
  return controller.signal;
}

export function createHttpClient(baseUrl: string, defaultHeaders?: Record<string, string>): HttpClient {
  return new HttpClient(baseUrl, defaultHeaders);
}
