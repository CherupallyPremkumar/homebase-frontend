'use client';

import { TrendingUp } from 'lucide-react';
import { Skeleton } from '@homebase/ui';

import { useDashboardRevenueComparison } from '../hooks/use-dashboard';
import type { ComparisonValue } from '../types';

const TEXT = {
  todayLabel: "Today's Revenue",
  yesterday: 'Yesterday',
  lastWeek: 'Last Week',
  lastMonthAvg: 'Last Month Avg',
} as const;

function ComparisonCard({ label, data }: { label: string; data: ComparisonValue }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-2.5 text-center">
      <p className="text-[10px] uppercase tracking-wider text-gray-400">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-gray-700">{data.value}</p>
      <p className="mt-0.5 text-[10px] font-semibold text-green-600">
        {data.changePercent}
      </p>
    </div>
  );
}

export function RevenueComparisonSkeleton() {
  return <Skeleton className="h-24 w-full rounded-xl" />;
}

export function DashboardRevenueComparison() {
  const { data, isLoading } = useDashboardRevenueComparison();

  if (isLoading || !data) return <RevenueComparisonSkeleton />;

  return (
    <section aria-label="Revenue comparison">
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50">
              <TrendingUp className="h-6 w-6 text-brand-500" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                {TEXT.todayLabel}
              </p>
              <p className="mt-0.5 text-3xl font-bold text-gray-900">
                {data.todayRevenue}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ComparisonCard label={TEXT.yesterday} data={data.yesterday} />
            <ComparisonCard label={TEXT.lastWeek} data={data.lastWeek} />
            <ComparisonCard label={TEXT.lastMonthAvg} data={data.lastMonthAvg} />
          </div>
        </div>
      </div>
    </section>
  );
}
