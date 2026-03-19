import type { Metadata } from 'next';
import { buildMetadata } from '@homebase/shared';
import { ProductListingClient } from '@/app/products/product-listing-client';

export const revalidate = 120;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return buildMetadata({
    title: `${name} — Shop Online at HomeBase`,
    description: `Browse ${name} products at HomeBase. Best prices and fast delivery.`,
    path: `/categories/${slug}`,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{name}</h1>
      <ProductListingClient />
    </div>
  );
}
