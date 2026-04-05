'use client';

import Link from 'next/link';
import { Skeleton } from '@homebase/ui';
import { cn } from '@homebase/ui/src/lib/utils';


import { useDashboardTopSellers } from '../hooks/use-dashboard';
import { adaptSellers } from '../services/sellers-adapter';

// ----------------------------------------------------------------
// Skeleton (loading state for the sellers table)
// ----------------------------------------------------------------

export function SellersSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <Skeleton className="h-4 w-32 flex-1" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export function DashboardSellers() {
  const { data: rawSellers, isLoading } = useDashboardTopSellers();

  const rows = adaptSellers(rawSellers);

  return (
    <section aria-label="Top sellers">
      <article className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Top Sellers</h2>
          <Link
            href="/suppliers"
            className="text-xs font-medium text-orange-500 hover:text-orange-600"
          >
            View All Sellers
          </Link>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <Skeleton className="h-4 w-32 flex-1" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : rows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Seller
                  </th>
                  <th className="px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Products
                  </th>
                  <th className="px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Orders
                  </th>
                  <th className="px-3 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((seller) => (
                  <tr key={seller.id} className="transition-colors hover:bg-orange-50/40">
                    <td className="px-6 py-3.5">
                      <Link href={`/suppliers/${seller.id}`} className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white',
                            seller.gradient,
                          )}
                          aria-hidden="true"
                        >
                          {seller.initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {seller.storeName}
                          </p>
                          <p className="text-[10px] text-gray-400">{seller.tier}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-3 py-3.5 text-center text-sm text-gray-700">
                      {seller.products}
                    </td>
                    <td className="px-3 py-3.5 text-center text-sm text-gray-700">
                      {seller.orders}
                    </td>
                    <td className="px-3 py-3.5 text-right text-sm font-semibold text-gray-800">
                      {seller.revenue}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <svg
                          className="h-3.5 w-3.5 text-amber-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">
                          {seller.rating}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-8 text-center text-sm text-gray-400">
            No seller data available
          </div>
        )}
      </article>
    </section>
  );
}
