'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '../lib/utils';
import { formatPrice, formatNumber, formatPercent } from '../display/format';

// --- Types ---

export interface DashboardStat {
  label: string;
  queryKey: string;
  queryFn: () => Promise<{ value: number; change?: number }>;
  icon: React.ReactNode;
  format?: 'number' | 'price' | 'percent' | 'rating';
}

export interface DashboardSection {
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  span?: 1 | 2;
}

export interface EntityDashboardProps {
  title: string;
  subtitle?: string;

  // Stats row
  stats: DashboardStat[];

  // Chart slots (dynamic import responsibility of the caller)
  charts?: {
    title: string;
    content: React.ReactNode;
    span?: 1 | 2;
  }[];

  // Content sections
  sections?: DashboardSection[];

  // Refresh
  refreshInterval?: number;

  className?: string;
}

export function EntityDashboard({
  title,
  subtitle,
  stats,
  charts,
  sections,
  refreshInterval = 30_000,
  className,
}: EntityDashboardProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
      </div>

      {/* Stats row */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.queryKey} stat={stat} refreshInterval={refreshInterval} />
        ))}
      </div>

      {/* Charts */}
      {charts && charts.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          {charts.map((chart, i) => (
            <div
              key={i}
              className={cn(
                'rounded-md border border-gray-200 bg-white p-4',
                chart.span === 2 && 'lg:col-span-2',
              )}
            >
              <h2 className="mb-3 text-sm font-semibold text-gray-700">{chart.title}</h2>
              <div className="h-64">{chart.content}</div>
            </div>
          ))}
        </div>
      )}

      {/* Sections */}
      {sections && sections.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          {sections.map((section, i) => (
            <div
              key={i}
              className={cn(
                'rounded-md border border-gray-200 bg-white',
                section.span === 2 && 'lg:col-span-2',
              )}
            >
              <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                {section.icon}
                <h2 className="text-sm font-semibold text-gray-700">{section.title}</h2>
              </div>
              <div className="p-4">{section.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Internal: Stat Card with its own query ---

function StatCard({ stat, refreshInterval }: { stat: DashboardStat; refreshInterval: number }) {
  const { data, isLoading, error } = useQuery({
    queryKey: [stat.queryKey],
    queryFn: stat.queryFn,
    staleTime: refreshInterval / 2,
    refetchInterval: refreshInterval,
  });

  if (error) {
    return (
      <div className="rounded-md border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-500">{stat.label}</p>
        <p className="mt-1 text-sm text-error-500">Error</p>
      </div>
    );
  }

  const formattedValue = isLoading
    ? null
    : data
      ? formatStatValue(data.value, stat.format)
      : null;

  return (
    <div className="rounded-md border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{stat.label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {isLoading ? (
              <span className="inline-block h-7 w-20 animate-pulse rounded bg-gray-100" />
            ) : (
              formattedValue ?? '—'
            )}
          </p>
          {data?.change != null && (
            <p className={cn('mt-0.5 text-xs font-medium', data.change >= 0 ? 'text-success-600' : 'text-error-600')}>
              {formatPercent(data.change)} vs last period
            </p>
          )}
        </div>
        <div className="rounded-full bg-primary-50 p-2.5 text-primary-600">{stat.icon}</div>
      </div>
    </div>
  );
}

function formatStatValue(value: number, format?: string): string {
  switch (format) {
    case 'price':
      return formatPrice(value);
    case 'percent':
      return `${value.toFixed(1)}%`;
    case 'rating':
      return `${value.toFixed(1)} \u2605`;
    default:
      return formatNumber(value);
  }
}
