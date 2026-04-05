'use client';

import {
  Archive, CheckCircle, Clock, AlertTriangle,
  FileText, ShieldAlert,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { StatCard, Skeleton } from '@homebase/ui';

import { useEnhancedProductStats } from '../hooks/use-product';

const ICON_MAP: Record<string, LucideIcon> = {
  archive: Archive,
  'check-circle': CheckCircle,
  clock: Clock,
  'alert-triangle': AlertTriangle,
  'file-text': FileText,
  'shield-alert': ShieldAlert,
};

export function ProductStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton key={i} className="h-[100px] rounded-xl" />
      ))}
    </div>
  );
}

export function ProductListStats() {
  const { data: stats, isLoading } = useEnhancedProductStats();

  if (isLoading || !stats) return <ProductStatsSkeleton />;

  return (
    <section aria-label="Product statistics">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        {stats.map((stat) => {
          const Icon = ICON_MAP[stat.iconKey] ?? Archive;
          return (
            <div
              key={stat.key}
              className={`stat-card rounded-xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ${stat.borderColor ?? 'border-gray-100'}`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className={`text-sm font-medium ${stat.valueColor ? stat.valueColor.replace('text-', 'text-') : 'text-gray-500'}`}>
                  {stat.label}
                </span>
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.iconBgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </div>
              <p className={`text-2xl font-bold ${stat.valueColor ?? 'text-gray-900'}`}>{stat.value}</p>
              {stat.subtitle && (
                <p className={`mt-0.5 text-[10px] ${stat.valueColor ? stat.valueColor.replace('600', '400') : 'text-gray-400'}`}>
                  {stat.subtitle}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
