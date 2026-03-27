import type { NextConfig } from 'next';
import { createSecurityHeaders } from '@homebase/shared/src/lib/security-headers';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@homebase/ui', '@homebase/shared', '@homebase/api-client', '@homebase/types'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.homebase.com' },
      { protocol: 'http', hostname: 'localhost' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: createSecurityHeaders(),
      },
      {
        source: '/warehouse(.*)',
        headers: createSecurityHeaders([
          { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=()' },
        ]),
      },
    ];
  },
};

export default nextConfig;
