'use client';

import {
  ShieldCheck, Clock, Users, Bug,
  AlertTriangle, Inbox,
} from 'lucide-react';
import { Skeleton } from '@homebase/ui';
import { cn } from '@homebase/ui/src/lib/utils';

import { useHealthDashboard } from '../hooks/use-health';
import type {
  ServiceStatus,
  AlertSeverity,
  BarColor,
  UptimeBar,
  InfraService,
} from '../types';

// ----------------------------------------------------------------
// Constants
// ----------------------------------------------------------------

const TEXT = {
  pageTitle: 'Platform Health',
  pageSubtitle: 'Real-time monitoring of system performance and services',
  infraServices: 'Infrastructure Services',
  appServices: 'Application Services',
  activeAlerts: 'Active Alerts',
  recentErrors: 'Recent Errors',
  errorTitle: 'Failed to load health data',
  retry: 'Retry',
  colTimestamp: 'Timestamp',
  colEndpoint: 'Endpoint',
  colError: 'Error',
  colCount: 'Count',
  tableLabel: 'Recent errors list',
  statsUptime: 'Uptime',
  statsResponse: 'Response Time',
  statsSessions: 'Active Sessions',
  statsErrorRate: 'Error Rate',
  last30Days: 'Last 30 days',
  avgP95: 'Avg. P95 latency',
  currentLive: 'Current live users',
  last24Hours: 'Last 24 hours',
  latency: 'Latency',
  lastChecked: 'Last checked:',
  noRecentErrors: 'No recent errors',
  sevenDay: '7d',
  active: 'Active',
} as const;

const STATUS_DOT: Record<ServiceStatus, string> = {
  Operational: 'bg-green-500',
  Degraded: 'bg-yellow-500',
  Down: 'bg-red-500',
};

const STATUS_TEXT: Record<ServiceStatus, string> = {
  Operational: 'text-green-600',
  Degraded: 'text-yellow-600',
  Down: 'text-red-600',
};

const BAR_BG: Record<BarColor, string> = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  red: 'bg-red-500',
};

const SEVERITY_STYLES: Record<AlertSeverity, {
  icon: string;
  badge: string;
  badgeLabel: string;
  title: string;
  desc: string;
  time: string;
  btnText: string;
  btnBorder: string;
  btnHover: string;
}> = {
  critical: {
    icon: 'bg-red-100',
    badge: 'bg-red-100 text-red-700',
    badgeLabel: 'Critical',
    title: 'text-red-800',
    desc: 'text-gray-600',
    time: 'text-gray-400',
    btnText: 'text-red-600',
    btnBorder: 'border-red-200',
    btnHover: 'hover:bg-red-50',
  },
  warning: {
    icon: 'bg-yellow-100',
    badge: 'bg-yellow-100 text-yellow-700',
    badgeLabel: 'Warning',
    title: 'text-yellow-800',
    desc: 'text-gray-600',
    time: 'text-gray-400',
    btnText: 'text-yellow-600',
    btnBorder: 'border-yellow-200',
    btnHover: 'hover:bg-yellow-50',
  },
};

const ERROR_STYLES: Record<string, string> = {
  '502': 'bg-red-100 text-red-700',
  '500': 'bg-red-100 text-red-700',
  '503': 'bg-red-100 text-red-700',
  '504': 'bg-yellow-100 text-yellow-700',
  '429': 'bg-yellow-100 text-yellow-700',
};

// ----------------------------------------------------------------
// Skeleton
// ----------------------------------------------------------------

function HealthSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading health dashboard">
      <div className="flex items-center justify-between">
        <div><Skeleton className="h-8 w-48" /><Skeleton className="mt-2 h-4 w-80" /></div>
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-24 rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-72 rounded-xl" />
    </div>
  );
}

// ----------------------------------------------------------------
// Uptime Mini-Bar Chart
// ----------------------------------------------------------------

function UptimeBarChart({ bars }: { bars: UptimeBar[] }) {
  return (
    <div className="flex items-center gap-1">
      {bars.map((bar, i) => (
        <div
          key={i}
          className={cn('h-4 w-full rounded-sm', BAR_BG[bar.color])}
          style={{ opacity: bar.opacity, minWidth: 6 }}
        />
      ))}
    </div>
  );
}

// ----------------------------------------------------------------
// Infrastructure Service Card
// ----------------------------------------------------------------

function InfraServiceCard({ service }: { service: InfraService }) {
  const isDegraded = service.status === 'Degraded';
  const isDown = service.status === 'Down';

  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition hover:-translate-y-0.5 hover:shadow-lg',
        isDegraded && 'border-yellow-200 bg-yellow-50/30',
        isDown && 'border-red-200 bg-red-50/30',
        !isDegraded && !isDown && 'border-gray-100',
      )}
    >
      {/* Header: dot + name + uptime % */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className={cn('h-2.5 w-2.5 rounded-full', STATUS_DOT[service.status])}
            aria-hidden="true"
          />
          <span className="text-sm font-semibold text-gray-900">{service.name}</span>
        </div>
        <span
          className={cn(
            'text-xs font-bold',
            service.status === 'Operational' && 'text-green-600',
            service.status === 'Degraded' && 'text-yellow-600',
            service.status === 'Down' && 'text-red-600',
          )}
        >
          {service.uptimePercent}
        </span>
      </div>

      {/* Latency */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-gray-500">{TEXT.latency}</span>
        <span
          className={cn(
            'text-xs font-semibold',
            isDegraded ? 'text-yellow-700' : 'text-gray-700',
          )}
        >
          {service.latency}
        </span>
      </div>

      {/* 7-day uptime bars */}
      <div className="flex items-center gap-1">
        <span className="mr-1 text-[10px] text-gray-400">{TEXT.sevenDay}</span>
        <UptimeBarChart bars={service.uptimeBars} />
      </div>
      <div className="mt-1 flex justify-between">
        <span className="text-[10px] text-gray-300">{service.dateRange.start}</span>
        <span className="text-[10px] text-gray-300">{service.dateRange.end}</span>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------

export function HealthDashboard() {
  const healthQuery = useHealthDashboard();

  // ------ LOADING STATE ------
  if (healthQuery.isLoading) {
    return <HealthSkeleton />;
  }

  // ------ ERROR STATE ------
  if (healthQuery.isError) {
    return (
      <section className="flex flex-col items-center justify-center py-32" role="alert">
        <AlertTriangle className="h-12 w-12 text-red-400" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">{TEXT.errorTitle}</h2>
        <p className="mt-1 text-sm text-gray-500">{healthQuery.error?.message}</p>
        <button
          onClick={() => healthQuery.refetch()}
          className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          {TEXT.retry}
        </button>
      </section>
    );
  }

  const data = healthQuery.data;
  if (!data) return null;

  const {
    stats,
    infraServices,
    appServices,
    alerts,
    recentErrors,
    overallStatus,
    lastChecked,
  } = data;

  const errorsEmpty = recentErrors.length === 0;

  return (
    <div className="space-y-6">
      {/* ===== Page Header ===== */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{TEXT.pageTitle}</h1>
          <p className="mt-1 text-sm text-gray-500">{TEXT.pageSubtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" aria-hidden="true" />
          <span className="text-sm font-medium text-green-600">{overallStatus}</span>
        </div>
      </header>

      {/* ===== Stat Cards ===== */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Health statistics">
        {/* Uptime */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.statsUptime}</p>
              <p className="mt-1 text-2xl font-bold text-green-600">{stats.uptime}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <ShieldCheck className="h-5 w-5 text-green-600" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-400">{TEXT.last30Days}</p>
        </div>

        {/* Response Time */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.statsResponse}</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">{stats.responseTime}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Clock className="h-5 w-5 text-blue-600" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-400">{TEXT.avgP95}</p>
        </div>

        {/* Active Sessions */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.statsSessions}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.activeSessions}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
              <Users className="h-5 w-5 text-orange-600" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-400">{TEXT.currentLive}</p>
        </div>

        {/* Error Rate */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.statsErrorRate}</p>
              <p className="mt-1 text-2xl font-bold text-green-600">{stats.errorRate}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Bug className="h-5 w-5 text-green-600" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-400">{TEXT.last24Hours}</p>
        </div>
      </section>

      {/* ===== Infrastructure Services Grid ===== */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm" aria-label="Infrastructure services">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">{TEXT.infraServices}</h2>
          <span className="text-xs text-gray-400">{TEXT.lastChecked} {lastChecked}</span>
        </div>
        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {infraServices.map((svc) => (
            <InfraServiceCard key={svc.name} service={svc} />
          ))}
        </div>
      </section>

      {/* ===== Application Services ===== */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm" aria-label="Application services">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">{TEXT.appServices}</h2>
        </div>
        <div className="grid grid-cols-2 divide-x divide-gray-100 sm:grid-cols-3 lg:grid-cols-6">
          {appServices.map((svc) => (
            <div key={svc.name} className="px-6 py-5 text-center">
              <div className="mb-1 flex items-center justify-center gap-2">
                <span
                  className={cn('h-2.5 w-2.5 rounded-full', STATUS_DOT[svc.status])}
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-gray-900">{svc.name}</span>
              </div>
              <p className={cn('text-xs', STATUS_TEXT[svc.status])}>{svc.status}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Active Alerts ===== */}
      {alerts.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm" aria-label="Active alerts">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">{TEXT.activeAlerts}</h2>
            <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-bold text-yellow-700">
              {alerts.length} {TEXT.active}
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {alerts.map((alert) => {
              const s = SEVERITY_STYLES[alert.severity];
              return (
                <div key={alert.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                          s.icon,
                        )}
                      >
                        <AlertTriangle
                          className={cn(
                            'h-4 w-4',
                            alert.severity === 'critical' ? 'text-red-600' : 'text-yellow-600',
                          )}
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={cn('text-sm font-semibold', s.title)}>{alert.title}</h3>
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                              s.badge,
                            )}
                          >
                            {s.badgeLabel}
                          </span>
                        </div>
                        <p className={cn('mt-1 text-xs', s.desc)}>
                          {alert.descriptionBold
                            ? renderDescriptionWithBold(alert.description, alert.descriptionBold)
                            : alert.description}
                        </p>
                        <p className={cn('mt-1.5 text-xs', s.time)}>{alert.detectedAt}</p>
                      </div>
                    </div>
                    <button
                      className={cn(
                        'ml-4 shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition',
                        s.btnText,
                        s.btnBorder,
                        s.btnHover,
                      )}
                    >
                      {alert.actionLabel}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ===== Recent Errors Table ===== */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm" aria-label="Recent errors">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">{TEXT.recentErrors}</h2>
        </div>
        {errorsEmpty ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Inbox className="h-10 w-10 text-gray-300" aria-hidden="true" />
            <p className="mt-3 text-sm text-gray-500">{TEXT.noRecentErrors}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label={TEXT.tableLabel}>
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colTimestamp}</th>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colEndpoint}</th>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colError}</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colCount}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentErrors.map((err) => (
                  <tr key={err.id} className="transition hover:bg-orange-50/40">
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">{err.timestamp}</td>
                    <td className="px-6 py-4 font-mono text-xs font-medium text-gray-900">{err.endpoint}</td>
                    <td className="px-6 py-4">
                      <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', ERROR_STYLES[err.errorCode] ?? 'bg-gray-100 text-gray-700')}>
                        {err.error}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">{err.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

/**
 * Renders alert description with a bold segment matching the given text.
 */
function renderDescriptionWithBold(description: string, boldText: string) {
  const idx = description.indexOf(boldText);
  if (idx === -1) return description;
  const before = description.slice(0, idx);
  const after = description.slice(idx + boldText.length);
  return (
    <>
      {before}<strong>{boldText}</strong>{after}
    </>
  );
}
