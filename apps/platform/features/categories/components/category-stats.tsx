'use client';

import { Layers, CheckCircle2, XCircle } from 'lucide-react';
import { StatCard, Skeleton } from '@homebase/ui';

import { useCategoryStats } from '../hooks/use-categories';

// ----------------------------------------------------------------
// Text constants (i18n-ready)
// ----------------------------------------------------------------

const TEXT = {
  sectionLabel: 'Category statistics',
  totalTitle: 'Total Categories',
  activeTitle: 'Active Categories',
  inactiveTitle: 'Inactive Categories',
  inactiveSubtitle: 'Disabled or archived',
} as const;

// ----------------------------------------------------------------
// Skeleton
// ----------------------------------------------------------------

export function CategoryStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-9 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-16" />
          <Skeleton className="mt-2 h-3 w-40" />
        </div>
      ))}
    </div>
  );
}

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export function CategoryStats() {
  const { data: stats, isLoading } = useCategoryStats();

  if (isLoading) return <CategoryStatsSkeleton />;

  return (
    <section aria-label={TEXT.sectionLabel}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title={TEXT.totalTitle}
          value={stats ? String(stats.totalCategories) : '--'}
          icon={<Layers className="h-5 w-5 text-blue-600" />}
          subtitle={
            stats
              ? `${stats.rootCount} root, ${stats.subCount} sub, ${stats.leafCount} leaf`
              : ''
          }
        />
        <StatCard
          title={TEXT.activeTitle}
          value={stats ? String(stats.activeCategories) : '--'}
          icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
          subtitle={stats ? `${stats.activePercent}% active` : ''}
          trend={stats?.activePercent}
          trendDirection="up"
        />
        <StatCard
          title={TEXT.inactiveTitle}
          value={stats ? String(stats.inactiveCategories) : '--'}
          icon={<XCircle className="h-5 w-5 text-red-600" />}
          subtitle={TEXT.inactiveSubtitle}
        />
      </div>
    </section>
  );
}
