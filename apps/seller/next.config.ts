import type { NextConfig } from 'next';
import { createSecurityHeaders } from '@homebase/shared/src/lib/security-headers';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@homebase/ui', '@homebase/shared', '@homebase/api-client', '@homebase/types'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.homebase.com' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: createSecurityHeaders(),
      },
    ];
  },
};

export default nextConfig;
