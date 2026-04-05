'use client';

import Link from 'next/link';
import { Skeleton } from '@homebase/ui';
import { cn } from '@homebase/ui/src/lib/utils';

import { useDashboardCategories } from '../hooks/use-dashboard';

const TEXT = {
  title: 'Top Categories by GMV',
  viewAll: 'View All',
} as const;

const RETURN_COLOR = { low: 'text-green-600', medium: 'text-amber-600', high: 'text-red-600' } as const;

export function CategorySkeleton() {
  return <Skeleton className="h-[380px] w-full rounded-xl" />;
}

export function CategoryPerformancePanel() {
  const { data: categories, isLoading } = useDashboardCategories();

  if (isLoading || !categories) return <CategorySkeleton />;

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">{TEXT.title}</h2>
        <Link href="/analytics" className="text-xs font-medium text-brand-500 transition hover:text-brand-600">
          {TEXT.viewAll}
        </Link>
      </div>
      <div className="space-y-4 px-6 py-5">
        {categories.map((cat) => (
          <div key={cat.name}>
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                <span className="text-[10px] text-gray-400">{cat.units}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900">{cat.revenue}</span>
                <span className={cn('text-[10px] font-medium', RETURN_COLOR[cat.returnSeverity])}>
                  {cat.returnPercent} returns
                </span>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full ${cat.barColor}`}
                style={{ width: `${cat.barPercent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
