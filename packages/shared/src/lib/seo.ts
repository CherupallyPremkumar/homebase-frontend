import type { Metadata } from 'next';

const SITE_NAME = 'HomeBase';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://homebase.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

export function buildMetadata(options: {
  title: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}): Metadata {
  const url = options.path ? `${SITE_URL}${options.path}` : SITE_URL;

  return {
    title: options.title,
    description: options.description,
    openGraph: {
      title: options.title,
      description: options.description,
      url,
      siteName: SITE_NAME,
      images: [{ url: options.ogImage || DEFAULT_OG_IMAGE }],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: options.title,
      description: options.description,
      images: [options.ogImage || DEFAULT_OG_IMAGE],
    },
    alternates: {
      canonical: url,
    },
    ...(options.noIndex && {
      robots: { index: false, follow: false },
    }),
  };
}

export function buildProductMetadata(product: {
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  id: string;
}): Metadata {
  return buildMetadata({
    title: `${product.name} — Buy at \u20B9${product.price.toLocaleString('en-IN')}`,
    description: product.description || `Buy ${product.name} online at HomeBase. Best prices, fast delivery.`,
    path: `/products/${product.id}`,
    ogImage: product.imageUrl,
  });
}
