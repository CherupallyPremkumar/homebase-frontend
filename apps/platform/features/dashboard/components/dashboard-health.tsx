'use client';

import { Server, Zap, Users } from 'lucide-react';
import { Skeleton } from '@homebase/ui';
import { cn } from '@homebase/ui/src/lib/utils';

import { useDashboardHealth } from '../hooks/use-dashboard';

// ----------------------------------------------------------------
// Skeleton (loading state for health section)
// ----------------------------------------------------------------

export function HealthSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-5">
            <Skeleton className="h-8 w-8 rounded-lg mb-4" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="mt-3 h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Internal: Health metric card
// ----------------------------------------------------------------

interface HealthCardProps {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  progress: number;
  progressColor: string;
  unit: string;
  detail: string;
}

function HealthCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  progress,
  progressColor,
  unit,
  detail,
}: HealthCardProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', iconBg)}>
            <Icon className={cn('h-4 w-4', iconColor)} aria-hidden="true" />
          </div>
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span
          className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-400"
          aria-hidden="true"
        />
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <div className="mt-3 flex items-center gap-2">
        <div
          className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200"
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={cn('h-full rounded-full', progressColor)}
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
        <span className="text-[10px] font-medium text-gray-400">{unit}</span>
      </div>
      <p className="mt-2 text-xs text-gray-500">{detail}</p>
    </div>
  );
}

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export function DashboardHealth() {
  const { data: health, isLoading } = useDashboardHealth();

  if (isLoading) return <HealthSkeleton />;

  return (
    <section aria-label="Platform health">
      <article className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Platform Health</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Real-time infrastructure monitoring
            </p>
          </div>
          <span className="text-xs font-medium text-gray-400">
            Last updated: 2 mins ago
          </span>
        </div>

        {health ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {/* Server Uptime */}
            <HealthCard
              icon={Server}
              iconBg="bg-green-100"
              iconColor="text-green-600"
              label="Server Uptime"
              value={`${health.serverUptime.value}%`}
              progress={health.serverUptime.value}
              progressColor="bg-green-500"
              unit="30d avg"
              detail={`Last downtime: 14 days ago (${Math.floor(health.serverUptime.lastDowntimeDuration / 60)}m ${health.serverUptime.lastDowntimeDuration % 60}s)`}
            />
            {/* API Response */}
            <HealthCard
              icon={Zap}
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
              label="API Response"
              value={`${health.apiResponse.value}ms`}
              progress={Math.round(
                (health.apiResponse.value / health.apiResponse.target) * 100,
              )}
              progressColor="bg-blue-500"
              unit={health.apiResponse.percentile}
              detail={`Target: <${health.apiResponse.target}ms -- Status: ${health.apiResponse.status === 'healthy' ? 'Healthy' : 'Degraded'}`}
            />
            {/* Active Sessions */}
            <HealthCard
              icon={Users}
              iconBg="bg-violet-100"
              iconColor="text-violet-600"
              label="Active Sessions"
              value={health.activeSessions.value.toLocaleString('en-IN')}
              progress={Math.round(
                (health.activeSessions.value / health.activeSessions.capacity) * 100,
              )}
              progressColor="bg-violet-500"
              unit={`of ${(health.activeSessions.capacity / 1000).toFixed(0)}K cap`}
              detail={`Buyers: ${health.activeSessions.breakdown.buyers.toLocaleString('en-IN')} | Sellers: ${health.activeSessions.breakdown.sellers} | Admin: ${health.activeSessions.breakdown.admin}`}
            />
          </div>
        ) : (
          <div className="text-center text-sm text-gray-400 py-8">
            Health data unavailable
          </div>
        )}
      </article>
    </section>
  );
}
