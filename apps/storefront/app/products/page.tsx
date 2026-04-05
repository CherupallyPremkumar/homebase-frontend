import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { buildMetadata } from '@homebase/shared';
import { ProductListing } from '@/features/product/ui';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMetadata({
  title: 'Electronics — Shop Online',
  description:
    'Browse our complete collection of electronics. Best prices, fast delivery.',
  path: '/products',
});

export default function ProductsPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-gray-500 transition hover:text-brand-500"
            >
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
            <span className="font-medium text-navy-900">Electronics</span>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <ProductListing />
      </div>
    </>
  );
}
