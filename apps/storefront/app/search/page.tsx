import type { Metadata } from 'next';
import { ProductListingClient } from '@/app/products/product-listing-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Search',
  robots: { index: false, follow: false },
};

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Search Results</h1>
      <ProductListingClient />
    </div>
  );
}
