'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import { Skeleton } from '@homebase/ui';

import { useDashboardCustomerHealth } from '../hooks/use-dashboard';

const TEXT = {
  title: 'Customer Health Snapshot',
  viewCustomers: 'View Customers',
  retentionRate: 'Retention Rate',
  churnCount: 'Churn (This Cohort)',
  revenuePerUser: 'Revenue / User',
  repeatRate: 'Repeat Purchase Rate',
  cartAbandon: 'Cart Abandonment',
  ticketsToday: 'Support Tickets Today',
  breached: 'breached SLA',
  avgRating: 'Avg. Rating (30 days)',
} as const;

export function CustomerHealthSkeleton() {
  return <Skeleton className="h-[380px] w-full rounded-xl" />;
}

export function CustomerHealthPanel() {
  const { data, isLoading } = useDashboardCustomerHealth();

  if (isLoading || !data) return <CustomerHealthSkeleton />;

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">{TEXT.title}</h2>
        <Link href="/users" className="text-xs font-medium text-brand-500 transition hover:text-brand-600">
          {TEXT.viewCustomers}
        </Link>
      </div>
      <div className="px-6 py-5">
        {/* Metrics Grid */}
        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-emerald-50 p-3 text-center">
            <p className="text-lg font-bold text-emerald-700">{data.retentionRate}</p>
            <p className="text-[10px] text-emerald-600">{TEXT.retentionRate}</p>
          </div>
          <div className="rounded-lg bg-red-50 p-3 text-center">
            <p className="text-lg font-bold text-red-700">{data.churnCount}</p>
            <p className="text-[10px] text-red-600">{TEXT.churnCount}</p>
          </div>
          <div className="rounded-lg bg-violet-50 p-3 text-center">
            <p className="text-lg font-bold text-violet-700">{data.revenuePerUser}</p>
            <p className="text-[10px] text-violet-600">{TEXT.revenuePerUser}</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-3 text-center">
            <p className="text-lg font-bold text-blue-700">{data.repeatPurchaseRate}</p>
            <p className="text-[10px] text-blue-600">{TEXT.repeatRate}</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-3 text-center">
            <p className="text-lg font-bold text-amber-700">{data.cartAbandonment}</p>
            <p className="text-[10px] text-amber-600">{TEXT.cartAbandon}</p>
          </div>
        </div>

        {/* Support Stats */}
        <div className="space-y-2.5 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{TEXT.ticketsToday}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">{data.supportTicketsToday}</span>
              <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                {data.slaBreach} {TEXT.breached}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{TEXT.avgRating}</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-gray-900">{data.avgRating}</span>
              <span className="text-sm text-gray-400">/ 5.0</span>
              <div className="ml-1 flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < Math.round(data.avgRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
