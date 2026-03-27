type Header = { key: string; value: string };

const BASE_SECURITY_HEADERS: Header[] = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

export function createSecurityHeaders(overrides?: Header[]): Header[] {
  if (!overrides?.length) return [...BASE_SECURITY_HEADERS];
  const overrideKeys = new Set(overrides.map((h) => h.key));
  return [
    ...BASE_SECURITY_HEADERS.filter((h) => !overrideKeys.has(h.key)),
    ...overrides,
  ];
}
