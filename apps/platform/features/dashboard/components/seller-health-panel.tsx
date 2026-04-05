'use client';

import Link from 'next/link';
import { Skeleton } from '@homebase/ui';

import { useDashboardSellerHealth } from '../hooks/use-dashboard';
import { StackedBar } from './stacked-bar';

const TEXT = {
  title: 'Seller Health',
  viewDetails: 'View Details',
  healthy: 'Healthy',
  atRisk: 'At Risk',
  unhealthy: 'Unhealthy',
  pendingApps: 'New seller applications',
  suspended: 'Suspended this month',
  avgScore: 'Avg. health score',
  viewAtRisk: 'View At-Risk',
  reviewSuspensions: 'Review Suspensions',
} as const;

export function SellerHealthSkeleton() {
  return <Skeleton className="h-[380px] w-full rounded-xl" />;
}

export function SellerHealthPanel() {
  const { data, isLoading } = useDashboardSellerHealth();

  if (isLoading || !data) return <SellerHealthSkeleton />;

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">{TEXT.title}</h2>
        <Link href="/suppliers" className="text-xs font-medium text-brand-500 transition hover:text-brand-600">
          {TEXT.viewDetails}
        </Link>
      </div>
      <div className="px-6 py-5">
        {/* Distribution Bar */}
        <StackedBar
          segments={[
            { label: `${data.distribution.healthyPercent}% Healthy`, percentage: data.distribution.healthyPercent, color: 'bg-green-500' },
            { label: `${data.distribution.atRiskPercent}%`, percentage: data.distribution.atRiskPercent, color: 'bg-amber-400' },
            { label: `${data.distribution.unhealthyPercent}%`, percentage: data.distribution.unhealthyPercent, color: 'bg-red-500' },
          ]}
          height="h-10"
        />

        {/* Counts */}
        <div className="mb-5 mt-5 grid grid-cols-3 gap-4">
          {[
            { label: TEXT.healthy, count: data.counts.healthy, color: 'text-green-600', dot: 'bg-green-500' },
            { label: TEXT.atRisk, count: data.counts.atRisk, color: 'text-amber-600', dot: 'bg-amber-500' },
            { label: TEXT.unhealthy, count: data.counts.unhealthy, color: 'text-red-600', dot: 'bg-red-500' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="mb-1 flex items-center justify-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
                <span className="text-[10px] text-gray-500">{item.label}</span>
              </div>
              <p className={`text-lg font-bold ${item.color}`}>{item.count}</p>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="space-y-2.5 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{TEXT.pendingApps}</span>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
              {data.quickStats.pendingApplications} pending
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{TEXT.suspended}</span>
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
              {data.quickStats.suspendedThisMonth} sellers
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{TEXT.avgScore}</span>
            <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-600">
              {data.quickStats.avgHealthScore} / 1000
            </span>
          </div>
        </div>

        {/* Action Links */}
        <div className="mt-4 flex items-center gap-3">
          <Link href="/suppliers" className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 transition hover:bg-amber-100">
            {TEXT.viewAtRisk}
          </Link>
          <Link href="/suppliers" className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-100">
            {TEXT.reviewSuspensions}
          </Link>
        </div>
      </div>
    </div>
  );
}
