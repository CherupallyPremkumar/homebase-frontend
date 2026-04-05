'use client';

import Link from 'next/link';
import { Star, ShoppingBag } from 'lucide-react';
import { Skeleton } from '@homebase/ui';
import { cn } from '@homebase/ui/src/lib/utils';

import { useDashboardTopProducts } from '../hooks/use-dashboard';
import type { StockStatus } from '../types';

const TEXT = {
  title: 'Top Selling Products Today',
  viewAll: 'View All Products',
} as const;

const STOCK_BADGE: Record<StockStatus, { bg: string; text: string; label: string }> = {
  'in-stock': { bg: 'bg-green-50', text: 'text-green-600', label: 'In Stock' },
  'low-stock': { bg: 'bg-amber-50', text: 'text-amber-600', label: 'Low Stock' },
  'out-of-stock': { bg: 'bg-red-50', text: 'text-red-600', label: 'Out of Stock' },
};

export function TopProductsSkeleton() {
  return <Skeleton className="h-[340px] w-full rounded-xl" />;
}

export function DashboardTopProducts() {
  const { data: products, isLoading } = useDashboardTopProducts();

  if (isLoading || !products) return <TopProductsSkeleton />;

  return (
    <section aria-label="Top selling products">
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{TEXT.title}</h2>
          <Link href="/products" className="text-xs font-medium text-brand-500 transition hover:text-brand-600">
            {TEXT.viewAll}
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Product</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">SKU</th>
                <th className="px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">Units</th>
                <th className="px-3 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500">Revenue</th>
                <th className="px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">Conv %</th>
                <th className="px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">Reviews</th>
                <th className="px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">Stock</th>
                <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Seller</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => {
                const badge = STOCK_BADGE[p.stockStatus];
                return (
                  <tr key={p.id} className="transition-colors hover:bg-brand-50/40">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                          <ShoppingBag className="h-5 w-5 text-gray-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-xs text-gray-500">{p.sku}</td>
                    <td className="px-3 py-3.5 text-center text-sm font-semibold text-gray-800">{p.unitsSold}</td>
                    <td className="px-3 py-3.5 text-right text-sm font-semibold text-gray-800">{p.revenue}</td>
                    <td className="px-3 py-3.5 text-center text-sm font-medium text-green-600">{p.conversion}</td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium text-gray-700">{p.rating}</span>
                        <span className="text-[10px] text-gray-400">({p.reviewCount})</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      <span className={cn('rounded-full px-2 py-1 text-[10px] font-medium', badge.bg, badge.text)}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-600">{p.sellerName}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
