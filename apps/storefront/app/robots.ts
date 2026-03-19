import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://homebase.com';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cart', '/checkout', '/profile', '/api/', '/orders'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
