'use client';

import Link from 'next/link';
import {
  IndianRupee,
  ShoppingBag,
  Store,
  Users,
  Package,
  AlertTriangle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { StatCard, Skeleton } from '@homebase/ui';

import { useDateRange } from '../context/date-range-context';
import { useDashboardStats } from '../hooks/use-dashboard';
import { adaptStats, type AdaptedStatCard } from '../services/stats-adapter';

const STAT_ICON_MAP: Record<string, LucideIcon> = {
  'indian-rupee': IndianRupee,
  'shopping-bag': ShoppingBag,
  'store': Store,
  'users': Users,
  'package': Package,
  'alert-triangle': AlertTriangle,
};

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-8 w-24" />
          <Skeleton className="mt-2 h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

export function DashboardStats() {
  const { dateRange } = useDateRange();
  const { data: stats, isLoading } = useDashboardStats(dateRange);

  if (isLoading) return <StatsSkeleton />;

  const cards: AdaptedStatCard[] = adaptStats(stats);

  return (
    <section aria-label="Platform statistics">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => {
          const Icon = STAT_ICON_MAP[card.iconKey] ?? AlertTriangle;

          return (
            <Link key={card.key} href={card.href} className="block">
              <StatCard
                title={card.title}
                value={card.value}
                icon={<Icon className={`h-5 w-5 ${card.iconColor}`} />}
                subtitle={card.subtitle}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
