'use client';

import { useState } from 'react';
import {
  Truck, CheckCircle2, Clock, AlertTriangle,
  Download, Inbox,
} from 'lucide-react';
import { Skeleton } from '@homebase/ui';
import { cn } from '@homebase/ui/src/lib/utils';

import {
  useSellerSlaStats,
  useSellerSla,
  useSellersAtRisk,
  useSlaTrend,
  useViolationBreakdown,
  useSellerSlaViolations,
} from '../hooks/use-seller-sla';
import type { SlaStatus, RiskLevel } from '../services/sla-mock';

// ----------------------------------------------------------------
// Constants (i18n-ready)
// ----------------------------------------------------------------

const TEXT = {
  pageTitle: 'Seller SLA Performance',
  pageSubtitle: 'Monitor dispatch, delivery, and response SLAs across all sellers',
  exportReport: 'Export Report',
  avgDispatchSla: 'Avg Dispatch SLA',
  avgDeliverySla: 'Avg Delivery SLA',
  avgResponseTime: 'Avg Response Time',
  totalViolations: 'Total Violations',
  trendTitle: 'Dispatch SLA Trend (Last 6 Months)',
  trendSummary: 'Trending up +5.2% over 6 months',
  violationTitle: 'Violation Breakdown (This Month)',
  violationFooter: 'Total violations this month',
  atRiskTitle: 'Sellers at Risk',
  atRiskBadge: '5 Approaching Threshold',
  sendWarning: 'Send Warning',
  rankingsTitle: 'Seller SLA Rankings',
  searchPlaceholder: 'Search sellers...',
  colSeller: 'Seller Name',
  colDispatchSla: 'Dispatch SLA',
  colDeliverySla: 'Delivery SLA',
  colResponseTime: 'Response Time',
  colRating: 'Rating',
  colViolations: 'Violations',
  colStatus: 'Status',
  colRiskDispatchSla: 'Dispatch SLA',
  colRiskDeliverySla: 'Delivery SLA',
  colRiskViolations: 'Violations',
  colRiskLevel: 'Risk Level',
  colAction: 'Action',
  recentViolationsTitle: 'Recent SLA Violations',
  emptyTitle: 'No SLA data found',
  emptySubtitle: 'SLA metrics will appear once sellers have order activity.',
  errorTitle: 'Failed to load SLA data',
  retry: 'Retry',
  last30Days: 'Last 30 Days',
  last7Days: 'Last 7 Days',
  last90Days: 'Last 90 Days',
} as const;

const TIME_PERIODS = [TEXT.last30Days, TEXT.last7Days, TEXT.last90Days] as const;

// ----------------------------------------------------------------
// Status color helpers
// ----------------------------------------------------------------

function slaValueColor(value: number): string {
  if (value >= 90) return 'text-green-600';
  if (value >= 75) return 'text-yellow-600';
  return 'text-red-600';
}

const STATUS_STYLES: Record<SlaStatus, { bg: string; text: string }> = {
  Good: { bg: 'bg-green-50', text: 'text-green-600' },
  Warning: { bg: 'bg-yellow-50', text: 'text-yellow-600' },
  Critical: { bg: 'bg-red-50', text: 'text-red-600' },
};

const RISK_STYLES: Record<RiskLevel, { bg: string; text: string; btnBg: string; btnHover: string; btnText: string }> = {
  Critical: { bg: 'bg-red-50', text: 'text-red-600', btnBg: 'bg-red-500', btnHover: 'hover:bg-red-600', btnText: 'text-white' },
  Warning: { bg: 'bg-yellow-50', text: 'text-yellow-600', btnBg: 'bg-yellow-100', btnHover: 'hover:bg-yellow-200', btnText: 'text-yellow-700' },
};

// Bar chart color: gradual blue-to-green from oldest to newest
const TREND_BAR_COLORS = [
  'bg-blue-200', 'bg-blue-300', 'bg-blue-300', 'bg-blue-400', 'bg-blue-500', 'bg-green-500',
];
const TREND_VALUE_COLORS = [
  'text-gray-600', 'text-gray-600', 'text-gray-600', 'text-gray-600', 'text-gray-600', 'text-green-600',
];

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export function SellerSla() {
  const [searchQuery, setSearchQuery] = useState('');
  const [timePeriod, setTimePeriod] = useState<string>(TEXT.last30Days);

  const statsQuery = useSellerSlaStats();
  const entriesQuery = useSellerSla();
  const atRiskQuery = useSellersAtRisk();
  const trendQuery = useSlaTrend();
  const breakdownQuery = useViolationBreakdown();
  const violationsQuery = useSellerSlaViolations();

  const isLoading =
    statsQuery.isLoading || entriesQuery.isLoading || atRiskQuery.isLoading ||
    trendQuery.isLoading || breakdownQuery.isLoading || violationsQuery.isLoading;

  const isError =
    statsQuery.isError || entriesQuery.isError || atRiskQuery.isError ||
    trendQuery.isError || breakdownQuery.isError || violationsQuery.isError;

  /* Loading state */
  if (isLoading) return <SellerSlaSkeleton />;

  /* Error state */
  if (isError) {
    const firstError = statsQuery.error ?? entriesQuery.error ?? atRiskQuery.error ??
      trendQuery.error ?? breakdownQuery.error ?? violationsQuery.error;
    return (
      <section className="flex flex-col items-center justify-center py-32" role="alert">
        <AlertTriangle className="h-12 w-12 text-red-400" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">{TEXT.errorTitle}</h2>
        <p className="mt-1 text-sm text-gray-500">{firstError?.message}</p>
        <button
          onClick={() => {
            statsQuery.refetch(); entriesQuery.refetch(); atRiskQuery.refetch();
            trendQuery.refetch(); breakdownQuery.refetch(); violationsQuery.refetch();
          }}
          className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          {TEXT.retry}
        </button>
      </section>
    );
  }

  const stats = statsQuery.data;
  const entries = entriesQuery.data ?? [];
  const atRisk = atRiskQuery.data ?? [];
  const trend = trendQuery.data ?? [];
  const breakdown = breakdownQuery.data ?? [];
  const violations = violationsQuery.data ?? [];
  const totalViolationCount = breakdown.reduce((sum, b) => sum + b.count, 0);

  const filteredEntries = searchQuery
    ? entries.filter((e) => e.sellerName.toLowerCase().includes(searchQuery.toLowerCase()))
    : entries;

  const isEmpty = filteredEntries.length === 0 && !searchQuery;

  /* Empty state */
  if (isEmpty) {
    return (
      <div className="space-y-8">
        <PageHeader timePeriod={timePeriod} onTimePeriodChange={setTimePeriod} />
        <div className="flex flex-col items-center justify-center py-24">
          <Inbox className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-base font-semibold text-gray-900">{TEXT.emptyTitle}</h3>
          <p className="mt-1 text-sm text-gray-500">{TEXT.emptySubtitle}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader timePeriod={timePeriod} onTimePeriodChange={setTimePeriod} />

      {/* Stat Cards */}
      {stats && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCardCustom
            label={TEXT.avgDispatchSla}
            value={stats.avgDispatchSla.value}
            trend={stats.avgDispatchSla.trend}
            trendPositive={stats.avgDispatchSla.trendUp}
            valueColor="text-green-600"
            iconBg="bg-green-50"
            icon={<Truck className="h-5 w-5 text-green-500" />}
          />
          <StatCardCustom
            label={TEXT.avgDeliverySla}
            value={stats.avgDeliverySla.value}
            trend={stats.avgDeliverySla.trend}
            trendPositive={stats.avgDeliverySla.trendUp}
            valueColor="text-blue-600"
            iconBg="bg-blue-50"
            icon={<CheckCircle2 className="h-5 w-5 text-blue-500" />}
          />
          <StatCardCustom
            label={TEXT.avgResponseTime}
            value={stats.avgResponseTime.value}
            trend={stats.avgResponseTime.trend}
            trendPositive={stats.avgResponseTime.trendUp}
            valueColor="text-gray-900"
            iconBg="bg-orange-50"
            icon={<Clock className="h-5 w-5 text-orange-500" />}
          />
          <StatCardCustom
            label={TEXT.totalViolations}
            value={stats.totalViolations.value}
            trend={stats.totalViolations.subtitle}
            trendPositive={false}
            trendNeutral
            valueColor="text-red-600"
            iconBg="bg-red-50"
            icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
          />
        </div>
      )}

      {/* SLA Trend + Violation Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Dispatch SLA Trend */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">{TEXT.trendTitle}</h3>
          <div className="flex h-32 items-end gap-3">
            {trend.map((m, i) => {
              const minVal = 88;
              const range = 100 - minVal;
              const barHeight = Math.max(10, ((m.value - minVal) / range) * 100);
              return (
                <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className={cn('w-full rounded-t', TREND_BAR_COLORS[i] ?? 'bg-blue-300')}
                    style={{ height: `${barHeight}%` }}
                  />
                  <span className="text-[10px] text-gray-400">{m.month}</span>
                  <span className={cn('text-[10px] font-semibold', TREND_VALUE_COLORS[i] ?? 'text-gray-600')}>
                    {m.value}%
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-center text-xs font-medium text-green-600">{TEXT.trendSummary}</p>
        </div>

        {/* Violation Breakdown */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">{TEXT.violationTitle}</h3>
          <div className="space-y-4">
            {breakdown.map((v) => {
              const pct = totalViolationCount > 0 ? Math.round((v.count / totalViolationCount) * 100) : 0;
              return (
                <div key={v.type}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn('h-2.5 w-2.5 rounded-full', v.color)} />
                      <span className="text-sm font-medium text-gray-700">{v.type}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{v.count}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div
                      className={cn('h-2 rounded-full', v.color)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-xs text-gray-400">{TEXT.violationFooter}</span>
            <span className="text-sm font-bold text-red-600">{totalViolationCount}</span>
          </div>
        </div>
      </div>

      {/* Sellers at Risk */}
      {atRisk.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-white">
          <div className="flex items-center justify-between rounded-t-xl border-b border-red-100 bg-red-50/50 px-6 py-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <h2 className="text-base font-semibold text-red-800">{TEXT.atRiskTitle}</h2>
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                {TEXT.atRiskBadge}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <th className="px-6 py-3">Seller</th>
                  <th className="px-4 py-3">{TEXT.colRiskDispatchSla}</th>
                  <th className="px-4 py-3">{TEXT.colRiskDeliverySla}</th>
                  <th className="px-4 py-3">{TEXT.colRiskViolations}</th>
                  <th className="px-4 py-3">{TEXT.colRiskLevel}</th>
                  <th className="px-4 py-3">{TEXT.colAction}</th>
                </tr>
              </thead>
              <tbody>
                {atRisk.map((r, i) => {
                  const risk = RISK_STYLES[r.riskLevel];
                  const isLast = i === atRisk.length - 1;
                  return (
                    <tr
                      key={r.id}
                      className={cn('transition-colors hover:bg-orange-50/40', !isLast && 'border-b border-gray-50')}
                    >
                      <td className="px-6 py-3.5 font-medium">{r.sellerName}</td>
                      <td className={cn('px-4 py-3.5 font-semibold', slaValueColor(r.dispatchSla))}>{r.dispatchSla}%</td>
                      <td className={cn('px-4 py-3.5 font-semibold', slaValueColor(r.deliverySla))}>{r.deliverySla}%</td>
                      <td className="px-4 py-3.5 font-semibold">{r.violations}</td>
                      <td className="px-4 py-3.5">
                        <span className={cn('rounded-full px-2 py-1 text-xs font-semibold', risk.bg, risk.text)}>
                          {r.riskLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => alert(`Sending warning to ${r.sellerName}`)}
                          className={cn(
                            'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                            risk.btnBg, risk.btnHover, risk.btnText,
                          )}
                        >
                          {TEXT.sendWarning}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Seller SLA Rankings */}
      <div className="rounded-xl border border-gray-100 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">{TEXT.rankingsTitle}</h2>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={TEXT.searchPlaceholder}
            className="w-56 rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            aria-label="Search sellers"
          />
        </div>
        {filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Inbox className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-base font-semibold text-gray-900">{TEXT.emptyTitle}</h3>
            <p className="mt-1 text-sm text-gray-500">{TEXT.emptySubtitle}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Seller SLA rankings">
              <thead>
                <tr className="border-b border-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <th className="px-6 py-3">{TEXT.colSeller}</th>
                  <th className="px-4 py-3">{TEXT.colDispatchSla}</th>
                  <th className="px-4 py-3">{TEXT.colDeliverySla}</th>
                  <th className="px-4 py-3">{TEXT.colResponseTime}</th>
                  <th className="px-4 py-3">{TEXT.colRating}</th>
                  <th className="px-4 py-3">{TEXT.colViolations}</th>
                  <th className="px-4 py-3">{TEXT.colStatus}</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((e, i) => {
                  const st = STATUS_STYLES[e.status];
                  const isLast = i === filteredEntries.length - 1;
                  return (
                    <tr
                      key={e.id}
                      className={cn('transition-colors hover:bg-orange-50/40', !isLast && 'border-b border-gray-50')}
                    >
                      <td className="px-6 py-3.5 font-medium">{e.sellerName}</td>
                      <td className={cn('px-4 py-3.5 font-semibold', slaValueColor(e.dispatchSla))}>{e.dispatchSla}%</td>
                      <td className={cn('px-4 py-3.5 font-semibold', slaValueColor(e.deliverySla))}>{e.deliverySla}%</td>
                      <td className="px-4 py-3.5">{e.responseTime}</td>
                      <td className="px-4 py-3.5 font-semibold">{e.rating}</td>
                      <td className="px-4 py-3.5">{e.violations}</td>
                      <td className="px-4 py-3.5">
                        <span className={cn('rounded-full px-2 py-1 text-xs font-semibold', st.bg, st.text)}>
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent SLA Violations */}
      {violations.length > 0 && (
        <div className="rounded-xl border border-gray-100 bg-white">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">{TEXT.recentViolationsTitle}</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {violations.map((v) => (
              <div key={v.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full',
                    v.severity === 'critical' ? 'bg-red-100' : 'bg-yellow-100',
                  )}>
                    <AlertTriangle className={cn(
                      'h-4 w-4',
                      v.severity === 'critical' ? 'text-red-600' : 'text-yellow-600',
                    )} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {v.sellerName} - {v.type}
                    </p>
                    <p className="text-xs text-gray-500">{v.description}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{v.timeAgo}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------
// Page Header
// ----------------------------------------------------------------

interface PageHeaderProps {
  timePeriod: string;
  onTimePeriodChange: (period: string) => void;
}

function PageHeader({ timePeriod, onTimePeriodChange }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{TEXT.pageTitle}</h1>
        <p className="mt-1 text-sm text-gray-500">{TEXT.pageSubtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <select
          value={timePeriod}
          onChange={(e) => onTimePeriodChange(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
        >
          {TIME_PERIODS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <button
          onClick={() => alert('Export SLA report')}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-gray-50"
        >
          <Download className="h-4 w-4" />
          {TEXT.exportReport}
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Custom Stat Card (matches prototype exactly)
// ----------------------------------------------------------------

interface StatCardCustomProps {
  label: string;
  value: string;
  trend: string;
  trendPositive: boolean;
  trendNeutral?: boolean;
  valueColor: string;
  iconBg: string;
  icon: React.ReactNode;
}

function StatCardCustom({
  label,
  value,
  trend,
  trendPositive,
  trendNeutral,
  valueColor,
  iconBg,
  icon,
}: StatCardCustomProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</span>
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', iconBg)}>
          {icon}
        </div>
      </div>
      <p className={cn('text-2xl font-bold', valueColor)}>{value}</p>
      <p className={cn(
        'mt-1 text-xs font-medium',
        trendNeutral ? 'text-gray-400' : trendPositive ? 'text-green-600' : 'text-red-600',
      )}>
        {trend}
      </p>
    </div>
  );
}

// ----------------------------------------------------------------
// Loading skeleton
// ----------------------------------------------------------------

function SellerSlaSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-2 h-4 w-96" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-[400px] rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}
