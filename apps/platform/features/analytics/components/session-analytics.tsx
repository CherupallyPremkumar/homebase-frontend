'use client';

import { useState } from 'react';
import {
  Eye, Users, Flag, Clock, Smartphone, Monitor, Tablet,
  TrendingUp, Download, AlertTriangle, ArrowUpRight,
  Send, X, Plus,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';

// ----------------------------------------------------------------
// Text constants (i18n-ready)
// ----------------------------------------------------------------

const TEXT = {
  pageTitle: 'Session Analytics',
  pageDescription: 'Traffic overview, device breakdown, geographic data, and user session insights',
  exportLabel: 'Export',
  rangeLast7: 'Last 7 Days',
  rangeLast30: 'Last 30 Days',
  rangeLast90: 'Last 90 Days',
  statPageViews: 'Page Views',
  statSessions: 'Sessions',
  statBounceRate: 'Bounce Rate',
  statAvgDuration: 'Avg Session Duration',
  deviceBreakdownTitle: 'Device Breakdown',
  deviceTotalSessions: '456K total sessions',
  mobile: 'Mobile',
  desktop: 'Desktop',
  tablet: 'Tablet',
  topCitiesTitle: 'Top 5 Cities by Traffic',
  viewAll: 'View All',
  topCitiesFooter: 'Top 5 cities account for',
  topCitiesPercent: '73.8% of all sessions',
  hourlyTitle: 'Hourly Traffic Pattern (Today)',
  peakHours: 'Peak hours',
  offPeak: 'Off-peak',
  morningPeak: '10AM-2PM',
  eveningPeak: '7PM-10PM',
  hourlyHighest: 'Highest: 8 PM (32,400 sessions)',
  trafficByPageTitle: 'Traffic by Page',
  colPage: 'Page',
  colViews: 'Views',
  colUnique: 'Unique',
  colBounce: 'Bounce',
  colAvgTime: 'Avg Time',
  sessionQualityTitle: 'Session Quality Funnel',
  engagementTitle: 'Engagement Metrics',
  loadingLabel: 'Loading session analytics',
  errorTitle: 'Failed to load session analytics',
  errorDescription: 'Please try refreshing the page or contact support.',
  retryLabel: 'Retry',
  emptyTitle: 'No session data',
  emptyDescription: 'Session analytics will appear once user traffic is recorded.',
} as const;

// ----------------------------------------------------------------
// Mock data (matching prototype exactly)
// ----------------------------------------------------------------

const STATS = [
  { label: TEXT.statPageViews, value: '1.2M', trend: '+18% vs last week', trendUp: true, iconBg: 'bg-blue-50', iconColor: 'text-blue-500', icon: Eye },
  { label: TEXT.statSessions, value: '456K', trend: '+12% vs last week', trendUp: true, iconBg: 'bg-green-50', iconColor: 'text-green-500', icon: Users },
  { label: TEXT.statBounceRate, value: '42%', trend: '+3.2% vs last week', trendUp: false, iconBg: 'bg-orange-50', iconColor: 'text-orange-500', icon: Flag },
  { label: TEXT.statAvgDuration, value: '4m 32s', trend: '+0.8 min vs last week', trendUp: true, iconBg: 'bg-purple-50', iconColor: 'text-purple-500', icon: Clock },
] as const;

const DEVICES = [
  { name: TEXT.mobile, pct: 68, count: '310,080', icon: Smartphone, cardBg: 'bg-orange-50/50', cardBorder: 'border-orange-100', circleBg: 'bg-orange-100', iconColor: 'text-orange-600', barColor: 'bg-orange-500' },
  { name: TEXT.desktop, pct: 24, count: '109,440', icon: Monitor, cardBg: 'bg-blue-50/50', cardBorder: 'border-blue-100', circleBg: 'bg-blue-100', iconColor: 'text-blue-600', barColor: 'bg-blue-500' },
  { name: TEXT.tablet, pct: 8, count: '36,480', icon: Tablet, cardBg: 'bg-purple-50/50', cardBorder: 'border-purple-100', circleBg: 'bg-purple-100', iconColor: 'text-purple-600', barColor: 'bg-purple-500' },
] as const;

const CITIES = [
  { rank: 1, name: 'Mumbai', sessions: '98,450', pct: 100, rankBg: 'bg-orange-500', rankText: 'text-white', barColor: 'bg-orange-500' },
  { rank: 2, name: 'Delhi', sessions: '80,120', pct: 81, rankBg: 'bg-orange-400', rankText: 'text-white', barColor: 'bg-orange-400' },
  { rank: 3, name: 'Bangalore', sessions: '67,200', pct: 68, rankBg: 'bg-orange-300', rankText: 'text-white', barColor: 'bg-orange-300' },
  { rank: 4, name: 'Hyderabad', sessions: '51,340', pct: 52, rankBg: 'bg-orange-200', rankText: 'text-gray-700', barColor: 'bg-orange-200' },
  { rank: 5, name: 'Chennai', sessions: '39,890', pct: 40, rankBg: 'bg-orange-100', rankText: 'text-gray-700', barColor: 'bg-orange-100' },
] as const;

const HOURLY_DATA = [
  { hour: '0', pct: 12, peak: false },
  { hour: '1', pct: 8, peak: false },
  { hour: '2', pct: 5, peak: false },
  { hour: '3', pct: 3, peak: false },
  { hour: '4', pct: 4, peak: false },
  { hour: '5', pct: 8, peak: false },
  { hour: '6', pct: 15, peak: false },
  { hour: '7', pct: 22, peak: false },
  { hour: '8', pct: 35, peak: false },
  { hour: '9', pct: 52, peak: false },
  { hour: '10', pct: 78, peak: true },
  { hour: '11', pct: 85, peak: true },
  { hour: '12', pct: 82, peak: true },
  { hour: '13', pct: 75, peak: true },
  { hour: '14', pct: 62, peak: false },
  { hour: '15', pct: 48, peak: false },
  { hour: '16', pct: 42, peak: false },
  { hour: '17', pct: 50, peak: false },
  { hour: '18', pct: 65, peak: false },
  { hour: '19', pct: 88, peak: true },
  { hour: '20', pct: 100, peak: true },
  { hour: '21', pct: 92, peak: true },
  { hour: '22', pct: 60, peak: false },
  { hour: '23', pct: 28, peak: false },
] as const;

function getHourlyBarColor(hour: number, pct: number): string {
  if (pct >= 85) return 'bg-orange-600';
  if (pct >= 75) return 'bg-orange-500';
  if (pct >= 60) return 'bg-orange-400';
  if (pct >= 45) return 'bg-orange-300';
  if (pct >= 30) return 'bg-orange-200';
  return 'bg-gray-200';
}

const PAGE_TRAFFIC = [
  { page: 'Home', views: '320K', unique: '245K', bounce: '28%', avgTime: '1.8 min' },
  { page: 'Product Listing', views: '280K', unique: '198K', bounce: '35%', avgTime: '2.4 min' },
  { page: 'Product Detail', views: '245K', unique: '180K', bounce: '22%', avgTime: '4.1 min' },
  { page: 'Cart', views: '120K', unique: '95K', bounce: '38%', avgTime: '2.8 min' },
  { page: 'Checkout', views: '85K', unique: '72K', bounce: '18%', avgTime: '5.2 min' },
  { page: 'Search Results', views: '150K', unique: '112K', bounce: '42%', avgTime: '1.5 min' },
] as const;

const FUNNEL_STEPS = [
  { label: 'Total Sessions', value: '456,000', pct: 100, pctLabel: '100%', color: 'bg-blue-500' },
  { label: 'Engaged (2+ pages)', value: '264,480', pct: 58, pctLabel: '58%', color: 'bg-green-500' },
  { label: 'Added to Cart', value: '120,000', pct: 26.3, pctLabel: '26%', color: 'bg-orange-500' },
  { label: 'Completed Purchase', value: '45,600', pct: 10, pctLabel: '10%', color: 'bg-purple-500' },
] as const;

const ENGAGEMENT_METRICS = [
  { label: 'Bounce Rate', value: '42%', trend: '+3.2% vs last week', valueColor: 'text-red-600', bg: 'bg-red-50/50', border: 'border-red-100', barBg: 'bg-red-100', barFill: 'bg-red-400', barPct: 42, trendColor: 'text-red-500' },
  { label: 'Avg Session', value: '4m 32s', trend: '+48s vs last week', valueColor: 'text-green-600', bg: 'bg-green-50/50', border: 'border-green-100', barBg: 'bg-green-100', barFill: 'bg-green-400', barPct: 68, trendColor: 'text-green-600' },
  { label: 'Pages / Session', value: '4.8', trend: '+0.3 vs last week', valueColor: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100', barBg: 'bg-blue-100', barFill: 'bg-blue-400', barPct: 60, trendColor: 'text-green-600' },
  { label: 'Return Visitors', value: '38%', trend: '+2.1% vs last week', valueColor: 'text-purple-600', bg: 'bg-purple-50/50', border: 'border-purple-100', barBg: 'bg-purple-100', barFill: 'bg-purple-400', barPct: 38, trendColor: 'text-green-600' },
] as const;

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export function SessionAnalytics() {
  const [isLoading] = useState(false);
  const [isError] = useState(false);
  const [isEmpty] = useState(false);

  /* Loading state */
  if (isLoading) {
    return (
      <div className="space-y-6" role="status" aria-label={TEXT.loadingLabel}>
        <div className="h-8 w-64 animate-pulse rounded-lg bg-gray-200" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-80 animate-pulse rounded-xl bg-gray-200" />
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
        </div>
      </div>
    );
  }

  /* Error state */
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24" role="alert">
        <AlertTriangle className="h-12 w-12 text-red-400" />
        <h2 className="text-lg font-semibold text-gray-900">{TEXT.errorTitle}</h2>
        <p className="text-sm text-gray-500">{TEXT.errorDescription}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          {TEXT.retryLabel}
        </button>
      </div>
    );
  }

  /* Empty state */
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <Users className="h-12 w-12 text-gray-300" />
        <h2 className="text-lg font-semibold text-gray-900">{TEXT.emptyTitle}</h2>
        <p className="text-sm text-gray-500">{TEXT.emptyDescription}</p>
      </div>
    );
  }

  return (
    <section className="space-y-8" aria-label={TEXT.pageTitle}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{TEXT.pageTitle}</h1>
          <p className="mt-1 text-sm text-gray-500">{TEXT.pageDescription}</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
            <option>{TEXT.rangeLast7}</option>
            <option>{TEXT.rangeLast30}</option>
            <option>{TEXT.rangeLast90}</option>
          </select>
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-gray-50">
            <Download className="h-4 w-4" />
            {TEXT.exportLabel}
          </button>
        </div>
      </div>

      {/* Traffic Overview Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-100 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{stat.label}</span>
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', stat.iconBg)}>
                  <Icon className={cn('h-5 w-5', stat.iconColor)} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className={cn('mt-1 text-xs font-medium', stat.trendUp ? 'text-green-600' : 'text-red-500')}>
                {stat.trend}
              </p>
            </div>
          );
        })}
      </div>

      {/* Device Breakdown + Top Cities */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Device Breakdown */}
        <div className="rounded-xl border border-gray-100 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">{TEXT.deviceBreakdownTitle}</h2>
            <span className="text-xs text-gray-400">{TEXT.deviceTotalSessions}</span>
          </div>
          <div className="p-6">
            {/* Device Summary Cards */}
            <div className="mb-6 grid grid-cols-3 gap-3">
              {DEVICES.map((d) => {
                const Icon = d.icon;
                return (
                  <div key={d.name} className={cn('rounded-lg border p-3 text-center', d.cardBg, d.cardBorder)}>
                    <div className={cn('mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full', d.circleBg)}>
                      <Icon className={cn('h-5 w-5', d.iconColor)} />
                    </div>
                    <p className="text-xl font-bold text-gray-900">{d.pct}%</p>
                    <p className="text-xs text-gray-500">{d.name}</p>
                    <p className="mt-0.5 text-[10px] text-gray-400">{d.count}</p>
                  </div>
                );
              })}
            </div>
            {/* Device Bars */}
            <div className="space-y-4">
              {DEVICES.map((d) => (
                <div key={d.name}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{d.name}</span>
                    <span className="text-sm font-bold text-gray-900">{d.pct}%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gray-100">
                    <div
                      className={cn('h-3 rounded-full transition-all duration-700', d.barColor)}
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top 5 Cities */}
        <div className="rounded-xl border border-gray-100 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">{TEXT.topCitiesTitle}</h2>
            <button className="text-xs font-medium text-orange-500 hover:text-orange-600">{TEXT.viewAll}</button>
          </div>
          <div className="space-y-4 p-6">
            {CITIES.map((city) => (
              <div key={city.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={cn('flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold', city.rankBg, city.rankText)}>
                    {city.rank}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{city.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-32 rounded-full bg-gray-100">
                    <div
                      className={cn('h-2.5 rounded-full', city.barColor)}
                      style={{ width: `${city.pct}%` }}
                    />
                  </div>
                  <span className="w-16 text-right text-sm font-semibold text-gray-700">{city.sessions}</span>
                </div>
              </div>
            ))}
            {/* City Totals */}
            <div className="mt-1 flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-xs text-gray-400">{TEXT.topCitiesFooter}</span>
              <span className="text-xs font-semibold text-gray-700">{TEXT.topCitiesPercent}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Traffic Pattern + Traffic by Page */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Hourly Traffic Pattern */}
        <div className="rounded-xl border border-gray-100 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">{TEXT.hourlyTitle}</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                <span className="text-xs text-gray-400">{TEXT.peakHours}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-gray-200" />
                <span className="text-xs text-gray-400">{TEXT.offPeak}</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex h-40 items-end gap-[3px]">
              {HOURLY_DATA.map((h) => (
                <div key={h.hour} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className={cn('w-full rounded-t transition-all duration-300 hover:opacity-85', getHourlyBarColor(parseInt(h.hour), h.pct))}
                    style={{ height: `${h.pct}%` }}
                  />
                  <span className={cn('text-[9px]', h.peak ? 'font-bold text-orange-600' : 'text-gray-400')}>
                    {h.hour}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-orange-500" />
                  <span className="text-xs text-gray-500">Peak: <span className="font-semibold text-gray-700">{TEXT.morningPeak}</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-orange-600" />
                  <span className="text-xs text-gray-500">Evening Peak: <span className="font-semibold text-gray-700">{TEXT.eveningPeak}</span></span>
                </div>
              </div>
              <span className="text-xs text-gray-400">{TEXT.hourlyHighest}</span>
            </div>
          </div>
        </div>

        {/* Traffic by Page */}
        <div className="rounded-xl border border-gray-100 bg-white">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">{TEXT.trafficByPageTitle}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <th className="px-6 py-3">{TEXT.colPage}</th>
                  <th className="px-4 py-3">{TEXT.colViews}</th>
                  <th className="px-4 py-3">{TEXT.colUnique}</th>
                  <th className="px-4 py-3">{TEXT.colBounce}</th>
                  <th className="px-4 py-3">{TEXT.colAvgTime}</th>
                </tr>
              </thead>
              <tbody>
                {PAGE_TRAFFIC.map((row, idx) => (
                  <tr
                    key={row.page}
                    className={cn(
                      'transition-colors hover:bg-orange-50/40',
                      idx < PAGE_TRAFFIC.length - 1 && 'border-b border-gray-50'
                    )}
                  >
                    <td className="px-6 py-3 font-medium">{row.page}</td>
                    <td className="px-4 py-3">{row.views}</td>
                    <td className="px-4 py-3">{row.unique}</td>
                    <td className="px-4 py-3">{row.bounce}</td>
                    <td className="px-4 py-3">{row.avgTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Session Quality + Engagement Metrics */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Session Quality Funnel */}
        <div className="rounded-xl border border-gray-100 bg-white">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">{TEXT.sessionQualityTitle}</h2>
          </div>
          <div className="space-y-4 p-6">
            {FUNNEL_STEPS.map((step) => (
              <div key={step.label}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{step.label}</span>
                  <span className="text-sm font-bold text-gray-900">{step.value}</span>
                </div>
                <div className="h-4 w-full rounded-full bg-gray-100">
                  <div
                    className={cn('flex h-4 items-center justify-center rounded-full', step.color)}
                    style={{ width: `${step.pct}%` }}
                  >
                    <span className="text-[10px] font-bold text-white">{step.pctLabel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="rounded-xl border border-gray-100 bg-white">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">{TEXT.engagementTitle}</h2>
          </div>
          <div className="grid grid-cols-2 gap-5 p-6">
            {ENGAGEMENT_METRICS.map((m) => (
              <div key={m.label} className={cn('rounded-lg border p-4', m.bg, m.border)}>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">{m.label}</p>
                <p className={cn('text-2xl font-bold', m.valueColor)}>{m.value}</p>
                <p className={cn('mt-1 text-xs', m.trendColor)}>{m.trend}</p>
                <div className={cn('mt-2 h-1.5 w-full rounded-full', m.barBg)}>
                  <div
                    className={cn('h-1.5 rounded-full', m.barFill)}
                    style={{ width: `${m.barPct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
