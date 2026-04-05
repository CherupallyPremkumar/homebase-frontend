import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { formatNumber } from '@homebase/shared';
import type { ProductDetailData } from '../types';

interface ProductDetailSellerProps {
  seller: ProductDetailData['seller'];
}

export function ProductDetailSeller({ seller }: ProductDetailSellerProps) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Seller information">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">Seller Information</h3>
      <div className="mb-3 flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${seller.avatarBg}`}>
          {seller.initials}
        </div>
        <div>
          <p className="text-sm font-medium">{seller.name}</p>
          <p className="text-xs text-gray-400">{seller.tier} &middot; Since {seller.since}</p>
        </div>
      </div>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between"><dt className="text-gray-500">Rating</dt><dd className="font-medium">{seller.rating} &#9733;</dd></div>
        <div className="flex justify-between"><dt className="text-gray-500">Products</dt><dd className="font-medium">{formatNumber(seller.productCount)}</dd></div>
        <div className="flex justify-between"><dt className="text-gray-500">Orders</dt><dd className="font-medium">{formatNumber(seller.orderCount)}</dd></div>
      </dl>
      <Link href={`/suppliers/${seller.id}`} className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-orange-500 hover:underline">
        View Seller Profile <ChevronRight className="h-3 w-3" />
      </Link>
    </section>
  );
}
