import type { Metadata } from 'next';
import { buildMetadata } from '@homebase/shared';
import { ProductListing } from '@/features/product/ui';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMetadata({
  title: 'All Products — Shop Online',
  description: 'Browse our complete collection of products. Best prices, fast delivery.',
  path: '/products',
});

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">All Products</h1>
      <ProductListing />
    </div>
  );
}
