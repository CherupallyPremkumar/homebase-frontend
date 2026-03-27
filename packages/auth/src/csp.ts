import { NextResponse } from 'next/server';

export interface CspOptions {
  /** Extra img-src origins (e.g. 'https://images.unsplash.com') */
  imgSrc?: string[];
  /** Extra connect-src origins */
  connectSrc?: string[];
  /** Extra form-action origins (e.g. Keycloak issuer for OAuth redirects) */
  formAction?: string[];
  /** Extra media-src directives (e.g. "'self' blob:") */
  mediaSrc?: string;
  /** Allow camera access (for barcode scanning) */
  allowCamera?: boolean;
}

/**
 * Build a Content-Security-Policy string with a per-request nonce.
 *
 * - Production: nonce replaces unsafe-inline, strict-dynamic propagates trust
 * - Development: unsafe-eval still required for Next.js HMR
 */
export function buildCsp(nonce: string, options: CspOptions = {}): string {
  const isProd = process.env.NODE_ENV === 'production';

  const scriptSrc = isProd
    ? `'self' 'nonce-${nonce}' 'strict-dynamic'`
    : `'self' 'nonce-${nonce}' 'unsafe-eval'`;

  const imgSources = ["'self'", 'data:', 'blob:', 'https://*.homebase.com', ...(options.imgSrc ?? [])];
  const connectSources = ["'self'", 'https://*.homebase.com'];

  if (!isProd) {
    connectSources.push('http://localhost:*');
  }

  if (options.connectSrc) {
    connectSources.push(...options.connectSrc);
  }

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "font-src 'self' fonts.gstatic.com",
    `img-src ${imgSources.join(' ')}`,
    `connect-src ${connectSources.join(' ')}`,
    options.mediaSrc ? `media-src ${options.mediaSrc}` : '',
    "frame-ancestors 'none'",
    "base-uri 'self'",
    `form-action 'self' ${(options.formAction ?? []).join(' ')}`.trim(),
  ].filter(Boolean).join('; ');
}

/**
 * Generate a cryptographic nonce for CSP.
 */
export function generateNonce(): string {
  return Buffer.from(crypto.randomUUID()).toString('base64');
}

/**
 * Apply CSP + nonce to a NextResponse, passing the nonce to server components
 * via the x-nonce request header.
 */
export function withCsp(
  response: NextResponse,
  nonce: string,
  csp: string,
): NextResponse {
  response.headers.set('Content-Security-Policy', csp);
  return response;
}

/**
 * Create a NextResponse.next() with CSP and nonce header forwarded to server components.
 */
export function nextWithCsp(
  request: { headers: Headers },
  nonce: string,
  csp: string,
): NextResponse {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', csp);
  return response;
}
