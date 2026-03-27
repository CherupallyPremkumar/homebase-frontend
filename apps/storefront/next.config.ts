import type { NextConfig } from 'next';
import { createSecurityHeaders } from '@homebase/shared/src/lib/security-headers';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@homebase/ui', '@homebase/shared', '@homebase/api-client', '@homebase/types'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.homebase.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'http', hostname: 'localhost' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536],
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
