'use client';

import { BarChart, Skeleton } from '@homebase/ui';

import { useDateRange } from '../context/date-range-context';
import { useDashboardRevenue } from '../hooks/use-dashboard';
import { adaptRevenue } from '../services/revenue-adapter';

// ----------------------------------------------------------------
// Skeleton (loading state for the chart section)
// ----------------------------------------------------------------

export function ChartSkeleton() {
  return <Skeleton className="h-[340px] w-full rounded-xl" />;
}

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export function DashboardRevenue() {
  const { dateRange } = useDateRange();
  const { data: revenue, isLoading } = useDashboardRevenue(dateRange);

  const chartData = adaptRevenue(revenue);

  return (
    <section aria-label="Revenue overview">
      <article className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Monthly platform revenue for FY 2025-26
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-orange-500" aria-hidden="true" />
              <span className="text-xs text-gray-500">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="h-0.5 w-3 border-t-2 border-dashed border-gray-400"
                aria-hidden="true"
              />
              <span className="text-xs text-gray-500">Target</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-[280px] w-full rounded-xl" />
        ) : (
          <BarChart data={chartData} height={280} />
        )}
      </article>
    </section>
  );
}
