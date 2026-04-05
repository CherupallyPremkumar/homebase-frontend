'use client';

import { Skeleton } from '@homebase/ui';

import { useDashboardKpis } from '../hooks/use-dashboard';
import { KpiCard } from './kpi-card';

export function KpiGridSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[140px] rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[140px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function DashboardKpiGrid() {
  const { data: cards, isLoading } = useDashboardKpis();

  if (isLoading || !cards) return <KpiGridSkeleton />;

  const row1 = cards.slice(0, 4);
  const row2 = cards.slice(4, 8);

  return (
    <section aria-label="Key performance indicators">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {row1.map((card) => (
            <KpiCard key={card.key} card={card} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {row2.map((card) => (
            <KpiCard key={card.key} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
