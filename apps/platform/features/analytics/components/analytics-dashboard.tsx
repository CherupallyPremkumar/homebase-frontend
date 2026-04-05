'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  IndianRupee,
  ShoppingCart,
  BarChart3,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  ChevronDown,
  AlertTriangle,
  MapPin,
  Users,
  CreditCard,
  Armchair,
  Home,
  UtensilsCrossed,
  Lightbulb,
  Bath,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { useAnalytics } from '../hooks/use-analytics';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const RANGES = ['7D', '30D', '90D', '1Y'] as const;

const REVENUE_MONTHS = [
  { month: 'Apr', revenue: 12.5, target: 15 },
  { month: 'May', revenue: 14, target: 15 },
  { month: 'Jun', revenue: 16, target: 16 },
  { month: 'Jul', revenue: 14.5, target: 17 },
  { month: 'Aug', revenue: 18, target: 17 },
  { month: 'Sep', revenue: 16.5, target: 18 },
  { month: 'Oct', revenue: 21, target: 19 },
  { month: 'Nov', revenue: 24, target: 22 },
  { month: 'Dec', revenue: 23, target: 22 },
  { month: 'Jan', revenue: 19, target: 20 },
  { month: 'Feb', revenue: 20, target: 20 },
  { month: 'Mar', revenue: 22, target: 21 },
];

const MAX_REVENUE = 25; // 25L for Y-axis scale

const CATEGORY_BARS = [
  { name: 'Furniture', pct: 35, orders: '4,380', color: 'bg-orange-500' },
  { name: 'Home Decor', pct: 25, orders: '3,128', color: 'bg-blue-500' },
  { name: 'Kitchen & Dining', pct: 18, orders: '2,252', color: 'bg-green-500' },
  { name: 'Lighting', pct: 12, orders: '1,502', color: 'bg-purple-500' },
  { name: 'Bathroom', pct: 6, orders: '751', color: 'bg-yellow-500' },
  { name: 'Others', pct: 4, orders: '501', color: 'bg-gray-400' },
];

const CATEGORY_TABLE = [
  {
    name: 'Furniture',
    products: '142 products',
    revenue: '\u20B984.0L',
    orders: '4,380',
    aov: '\u20B91,918',
    growth: 22.4,
    up: true,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
    Icon: Armchair,
    trendBars: [40, 55, 45, 70, 65, 85, 100],
    trendColors: ['bg-orange-300', 'bg-orange-300', 'bg-orange-300', 'bg-orange-400', 'bg-orange-400', 'bg-orange-500', 'bg-orange-500'],
  },
  {
    name: 'Home Decor',
    products: '238 products',
    revenue: '\u20B960.0L',
    orders: '3,128',
    aov: '\u20B91,918',
    growth: 18.7,
    up: true,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    Icon: Home,
    trendBars: [50, 55, 60, 70, 75, 80, 90],
    trendColors: ['bg-blue-200', 'bg-blue-300', 'bg-blue-300', 'bg-blue-400', 'bg-blue-400', 'bg-blue-500', 'bg-blue-500'],
  },
  {
    name: 'Kitchen & Dining',
    products: '189 products',
    revenue: '\u20B943.2L',
    orders: '2,252',
    aov: '\u20B91,918',
    growth: 14.2,
    up: true,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-500',
    Icon: UtensilsCrossed,
    trendBars: [45, 50, 55, 65, 60, 75, 85],
    trendColors: ['bg-green-200', 'bg-green-200', 'bg-green-300', 'bg-green-300', 'bg-green-400', 'bg-green-400', 'bg-green-500'],
  },
  {
    name: 'Lighting',
    products: '95 products',
    revenue: '\u20B928.8L',
    orders: '1,502',
    aov: '\u20B91,918',
    growth: 9.8,
    up: true,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-500',
    Icon: Lightbulb,
    trendBars: [55, 50, 60, 55, 70, 75, 80],
    trendColors: ['bg-purple-200', 'bg-purple-200', 'bg-purple-300', 'bg-purple-300', 'bg-purple-400', 'bg-purple-400', 'bg-purple-500'],
  },
  {
    name: 'Bathroom',
    products: '67 products',
    revenue: '\u20B914.4L',
    orders: '751',
    aov: '\u20B91,918',
    growth: -3.1,
    up: false,
    iconBg: 'bg-yellow-50',
    iconColor: 'text-yellow-500',
    Icon: Bath,
    trendBars: [70, 65, 55, 60, 50, 45, 40],
    trendColors: ['bg-yellow-300', 'bg-yellow-300', 'bg-yellow-200', 'bg-yellow-200', 'bg-yellow-200', 'bg-yellow-200', 'bg-yellow-100'],
  },
];

const GEO_CITIES = [
  { rank: 1, name: 'Mumbai', orders: '3,842', pct: 100, rankBg: 'bg-orange-50', rankColor: 'text-orange-600', barColor: 'bg-orange-500' },
  { rank: 2, name: 'Delhi NCR', orders: '3,156', pct: 82, rankBg: 'bg-blue-50', rankColor: 'text-blue-600', barColor: 'bg-blue-500' },
  { rank: 3, name: 'Bangalore', orders: '2,489', pct: 65, rankBg: 'bg-green-50', rankColor: 'text-green-600', barColor: 'bg-green-500' },
  { rank: 4, name: 'Hyderabad', orders: '1,678', pct: 44, rankBg: 'bg-purple-50', rankColor: 'text-purple-600', barColor: 'bg-purple-500' },
  { rank: 5, name: 'Pune', orders: '1,349', pct: 35, rankBg: 'bg-yellow-50', rankColor: 'text-yellow-600', barColor: 'bg-yellow-500' },
];

const PAYMENT_METHODS = [
  { name: 'UPI', desc: 'GPay, PhonePe, Paytm', pct: 45, txns: '5,631 txns', iconBg: 'bg-orange-50', barColor: 'bg-orange-500', iconLabel: 'UPI', isText: true },
  { name: 'Credit/Debit Card', desc: 'Visa, Mastercard, RuPay', pct: 30, txns: '3,754 txns', iconBg: 'bg-blue-50', barColor: 'bg-blue-500', iconColor: 'text-blue-600', isText: false },
  { name: 'Cash on Delivery', desc: 'Pay at doorstep', pct: 15, txns: '1,877 txns', iconBg: 'bg-green-50', barColor: 'bg-green-500', iconColor: 'text-green-600', isText: false },
  { name: 'Others', desc: 'Net Banking, Wallets, EMI', pct: 10, txns: '1,252 txns', iconBg: 'bg-gray-100', barColor: 'bg-gray-400', iconColor: 'text-gray-500', isText: false },
];

/* ------------------------------------------------------------------ */
/*  Stat Card (inline, matches prototype exactly)                      */
/* ------------------------------------------------------------------ */

interface MetricCardProps {
  title: string;
  value: string;
  trend: number;
  trendUp: boolean;
  iconBg: string;
  icon: React.ReactNode;
}

function MetricCard({ title, value, trend, trendUp, iconBg, icon }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</span>
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', iconBg)}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <div className="mt-2 flex items-center gap-1.5">
        <span className={cn('flex items-center gap-0.5 text-xs font-semibold', trendUp ? 'text-green-600' : 'text-red-600')}>
          {trendUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {trend}%
        </span>
        <span className="text-xs text-gray-400">vs last month</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AnalyticsDashboard() {
  const [activeRange, setActiveRange] = useState<string>('30D');
  const { isLoading, isError, data } = useAnalytics(activeRange);

  /* ---- Loading state ---- */
  if (isLoading) {
    return (
      <div className="space-y-6" role="status" aria-label="Loading analytics">
        {/* Header skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-8 w-64 animate-pulse rounded-lg bg-gray-200" />
            <div className="mt-2 h-4 w-80 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-52 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-10 w-36 animate-pulse rounded-lg bg-gray-200" />
          </div>
        </div>
        {/* Related pills skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-12 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
          <div className="h-6 w-28 animate-pulse rounded-full bg-gray-200" />
          <div className="h-6 w-28 animate-pulse rounded-full bg-gray-200" />
        </div>
        {/* Metric cards skeleton */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
        {/* Charts skeleton */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-[420px] animate-pulse rounded-xl bg-gray-200 lg:col-span-2" />
          <div className="h-[420px] animate-pulse rounded-xl bg-gray-200" />
        </div>
        {/* Table skeleton */}
        <div className="h-80 animate-pulse rounded-xl bg-gray-200" />
        {/* Bottom row skeleton */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-96 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-96 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-96 animate-pulse rounded-xl bg-gray-200" />
        </div>
      </div>
    );
  }

  /* ---- Error state ---- */
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24" role="alert">
        <AlertTriangle className="h-12 w-12 text-red-400" />
        <h2 className="text-lg font-semibold text-gray-900">Failed to load analytics</h2>
        <p className="text-sm text-gray-500">Please try refreshing the page or contact support.</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          Retry
        </button>
      </div>
    );
  }

  /* ---- Empty state ---- */
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <BarChart3 className="h-12 w-12 text-gray-300" />
        <h2 className="text-lg font-semibold text-gray-900">No analytics data</h2>
        <p className="text-sm text-gray-500">Analytics will appear once order and transaction data is available.</p>
        <nav className="flex items-center gap-2" aria-label="Related pages">
          <span className="text-xs text-gray-400">Related:</span>
          <Link href="/analytics/segments" className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-500 transition hover:bg-orange-100">Segments</Link>
          <Link href="/analytics/sessions" className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-500 transition hover:bg-orange-100">Session Analytics</Link>
          <Link href="/analytics/abandoned-carts" className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-500 transition hover:bg-orange-100">Abandoned Carts</Link>
        </nav>
      </div>
    );
  }

  /* ---- Success state ---- */
  return (
    <section className="space-y-8" aria-label="Platform Analytics">

      {/* ===== PAGE HEADER ===== */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">Comprehensive overview of platform performance and trends</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date Range Picker */}
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Mar 1 - Mar 28, 2026</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
          {/* Period Selector */}
          <div className="flex overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm" role="group" aria-label="Time range selector">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRange(r)}
                aria-pressed={activeRange === r}
                className={cn(
                  'px-3 py-2.5 text-xs font-medium transition',
                  activeRange === r
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-500 hover:bg-gray-50',
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ===== SUB-PAGE NAVIGATION ===== */}
      <nav className="flex items-center gap-2" aria-label="Related pages">
        <span className="text-xs text-gray-400">Related:</span>
        <Link href="/analytics/segments" className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-500 transition hover:bg-orange-100">Segments</Link>
        <Link href="/analytics/sessions" className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-500 transition hover:bg-orange-100">Session Analytics</Link>
        <Link href="/analytics/abandoned-carts" className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-500 transition hover:bg-orange-100">Abandoned Carts</Link>
      </nav>

      {/* ===== KEY METRICS CARDS ===== */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Gross Merchandise Value"
          value={'\u20B92.4 Cr'}
          trend={18.2}
          trendUp
          iconBg="bg-orange-50"
          icon={<IndianRupee className="h-5 w-5 text-orange-500" />}
        />
        <MetricCard
          title="Avg Order Value"
          value={'\u20B91,920'}
          trend={5.4}
          trendUp
          iconBg="bg-blue-50"
          icon={<ShoppingCart className="h-5 w-5 text-blue-500" />}
        />
        <MetricCard
          title="Conversion Rate"
          value="3.2%"
          trend={0.8}
          trendUp
          iconBg="bg-green-50"
          icon={<BarChart3 className="h-5 w-5 text-green-500" />}
        />
        <MetricCard
          title="Customer Retention"
          value="68%"
          trend={2.1}
          trendUp={false}
          iconBg="bg-purple-50"
          icon={<UserPlus className="h-5 w-5 text-purple-500" />}
        />
      </div>

      {/* ===== REVENUE CHART + CATEGORY PIE ===== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Monthly Revenue Chart */}
        <article className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2" aria-label="Monthly revenue chart">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Monthly Revenue</h2>
              <p className="mt-0.5 text-xs text-gray-400">Last 12 months trend</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                <span className="text-xs text-gray-500">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-200" />
                <span className="text-xs text-gray-500">Target</span>
              </div>
            </div>
          </div>

          {/* Chart Area */}
          <div className="relative">
            {/* Y-axis labels */}
            <div className="absolute bottom-6 left-0 top-0 flex w-10 flex-col justify-between text-[10px] text-gray-400">
              <span>25L</span>
              <span>20L</span>
              <span>15L</span>
              <span>10L</span>
              <span>5L</span>
              <span>0</span>
            </div>
            {/* Bars */}
            <div className="ml-12 flex h-56 items-end gap-2">
              {REVENUE_MONTHS.map((m) => {
                const revHeight = (m.revenue / MAX_REVENUE) * 224;
                const tgtHeight = (m.target / MAX_REVENUE) * 224;
                return (
                  <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                    <div className="relative flex w-full items-end justify-center gap-0.5">
                      <div
                        className="w-[45%] cursor-pointer rounded-t-sm bg-orange-500 transition-all duration-600 hover:opacity-85"
                        style={{ height: `${revHeight}px` }}
                        title={`\u20B9${m.revenue}L`}
                      />
                      <div
                        className="w-[45%] rounded-t-sm bg-orange-200 transition-all duration-600"
                        style={{ height: `${tgtHeight}px` }}
                        title={`Target: \u20B9${m.target}L`}
                      />
                    </div>
                    <span className="text-[10px] text-gray-400">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Row */}
          <div className="mt-5 flex items-center gap-8 border-t border-gray-100 pt-4">
            <div>
              <p className="text-xs text-gray-400">Total Revenue (FY)</p>
              <p className="text-lg font-bold text-gray-900">{'\u20B9'}2.4 Cr</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Target Achievement</p>
              <p className="text-lg font-bold text-green-600">104.2%</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Best Month</p>
              <p className="text-lg font-bold text-orange-500">November</p>
            </div>
          </div>
        </article>

        {/* Orders by Category */}
        <article className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm" aria-label="Orders by category">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Orders by Category</h2>
              <p className="mt-0.5 text-xs text-gray-400">Distribution across categories</p>
            </div>
          </div>

          <div className="space-y-4">
            {CATEGORY_BARS.map((cat) => (
              <div key={cat.name}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                  <span className="text-sm font-bold text-gray-900">{cat.pct}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={cn('h-full rounded-full transition-all duration-800', cat.color)}
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-gray-400">{cat.orders} orders</p>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Total Orders</span>
              <span className="text-sm font-bold text-gray-900">12,514</span>
            </div>
          </div>
        </article>
      </div>

      {/* ===== TOP PERFORMING CATEGORIES TABLE ===== */}
      <article className="rounded-xl border border-gray-100 bg-white shadow-sm" aria-label="Top performing categories">
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Top Performing Categories</h2>
            <p className="mt-0.5 text-xs text-gray-400">Revenue and growth metrics by category</p>
          </div>
          <button className="text-xs font-medium text-orange-500 transition hover:text-orange-600">
            View All Categories
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Category performance table">
            <thead>
              <tr className="border-b border-t border-gray-100">
                <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Category</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Revenue</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Orders</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Avg Order Value</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Growth</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Trend</th>
              </tr>
            </thead>
            <tbody>
              {CATEGORY_TABLE.map((cat, idx) => {
                const IconComp = cat.Icon;
                return (
                  <tr
                    key={cat.name}
                    className={cn(
                      'transition-colors hover:bg-orange-50/30',
                      idx < CATEGORY_TABLE.length - 1 && 'border-b border-gray-50',
                    )}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', cat.iconBg)}>
                          <IconComp className={cn('h-4 w-4', cat.iconColor)} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{cat.name}</p>
                          <p className="text-[11px] text-gray-400">{cat.products}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-800">{cat.revenue}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{cat.orders}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{cat.aov}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold',
                        cat.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600',
                      )}>
                        {cat.up
                          ? <ArrowUpRight className="h-3 w-3" />
                          : <ArrowDownRight className="h-3 w-3" />}
                        {Math.abs(cat.growth)}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex h-5 items-end gap-0.5">
                        {cat.trendBars.map((h, i) => (
                          <div
                            key={i}
                            className={cn('w-1 rounded-sm', cat.trendColors[i])}
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </article>

      {/* ===== GEOGRAPHIC + USER ACQUISITION + PAYMENT METHODS ===== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Geographic Distribution */}
        <article className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm" aria-label="Geographic distribution">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Geographic Distribution</h2>
              <p className="mt-0.5 text-xs text-gray-400">Top 5 cities by order volume</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
              <MapPin className="h-5 w-5 text-orange-500" />
            </div>
          </div>

          <div className="space-y-4">
            {GEO_CITIES.map((city) => (
              <div key={city.name} className="flex items-center gap-4">
                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold', city.rankBg, city.rankColor)}>
                  {city.rank}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">{city.name}</span>
                    <span className="text-sm font-bold text-gray-900">{city.orders}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={cn('h-full rounded-full', city.barColor)}
                      style={{ width: `${city.pct}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
            <span className="text-xs text-gray-400">Other cities</span>
            <span className="text-sm font-semibold text-gray-600">4,286 orders</span>
          </div>
        </article>

        {/* User Acquisition */}
        <article className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm" aria-label="User acquisition">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">User Acquisition</h2>
              <p className="mt-0.5 text-xs text-gray-400">New vs returning customer analysis</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
              <Users className="h-5 w-5 text-green-500" />
            </div>
          </div>

          {/* Ring Chart */}
          <div className="mb-6 flex items-center justify-center">
            <div className="relative h-28 w-28">
              <svg className="-rotate-90" viewBox="0 0 100 100" width={112} height={112}>
                <circle cx={50} cy={50} r={40} fill="none" stroke="#F3F4F6" strokeWidth={12} />
                {/* New users: 32% = ~80.4 of 251.2 */}
                <circle
                  cx={50} cy={50} r={40} fill="none"
                  stroke="#F97316" strokeWidth={12}
                  strokeDasharray="251.2"
                  strokeDashoffset="75.36"
                  strokeLinecap="round"
                />
                {/* Returning users: 68% */}
                <circle
                  cx={50} cy={50} r={40} fill="none"
                  stroke="#3B82F6" strokeWidth={12}
                  strokeDasharray="251.2"
                  strokeDashoffset="175.84"
                  strokeLinecap="round"
                  transform="rotate(108, 50, 50)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-gray-900">48.2K</span>
                <span className="text-[10px] text-gray-400">Total Users</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <div className="rounded-xl bg-orange-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-orange-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">New Users</p>
                    <p className="text-xs text-gray-500">First-time visitors</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">15,420</p>
                  <p className="text-[11px] font-semibold text-green-600">+24.3%</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-blue-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Returning Users</p>
                    <p className="text-xs text-gray-500">Repeat customers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">32,780</p>
                  <p className="text-[11px] font-semibold text-green-600">+12.8%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ratio */}
          <div className="mt-5 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">New : Returning Ratio</span>
              <span className="font-bold text-gray-900">32% : 68%</span>
            </div>
            <div className="mt-2 flex gap-0.5">
              <div className="h-2 rounded-l-full bg-orange-500" style={{ width: '32%' }} />
              <div className="h-2 rounded-r-full bg-blue-500" style={{ width: '68%' }} />
            </div>
          </div>
        </article>

        {/* Payment Methods */}
        <article className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm" aria-label="Payment methods distribution">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Payment Methods</h2>
              <p className="mt-0.5 text-xs text-gray-400">Distribution by payment type</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">
              <CreditCard className="h-5 w-5 text-purple-500" />
            </div>
          </div>

          <div className="space-y-5">
            {PAYMENT_METHODS.map((pm) => (
              <div key={pm.name}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', pm.iconBg)}>
                      {pm.isText ? (
                        <span className="text-xs font-bold text-orange-600">{pm.iconLabel}</span>
                      ) : pm.name === 'Credit/Debit Card' ? (
                        <CreditCard className={cn('h-4 w-4', pm.iconColor)} />
                      ) : pm.name === 'Cash on Delivery' ? (
                        <IndianRupee className={cn('h-4 w-4', pm.iconColor)} />
                      ) : (
                        <MoreHorizontal className={cn('h-4 w-4', pm.iconColor)} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{pm.name}</p>
                      <p className="text-[10px] text-gray-400">{pm.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{pm.pct}%</p>
                    <p className="text-[10px] text-gray-400">{pm.txns}</p>
                  </div>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={cn('h-full rounded-full transition-all duration-800', pm.barColor)}
                    style={{ width: `${pm.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
            <span className="text-xs text-gray-400">Total Transactions</span>
            <span className="text-sm font-bold text-gray-900">12,514</span>
          </div>
        </article>
      </div>
    </section>
  );
}
