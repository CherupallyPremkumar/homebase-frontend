'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Banknote, CircleDollarSign, CreditCard, Receipt,
  ArrowUpRight, ArrowDownRight, Download, AlertTriangle, CheckCircle,
  ShieldAlert, Info,
} from 'lucide-react';
import { cn } from '@homebase/ui';
import { useFinanceDashboard } from '../hooks/use-finance';
import { getStatusBadgeClass, getGatewayCardClass, getBarColor } from '../services/finance-adapter';
import type { StatCardData } from '../types';

/* ------------------------------------------------------------------ */
/*  TEXT constants                                                      */
/* ------------------------------------------------------------------ */

const TEXT = {
  PAGE_TITLE: 'Finance Dashboard',
  PAGE_SUBTITLE: 'Complete money flow overview, revenue tracking, and reconciliation status.',
  EXPORT_REPORT: 'Export Report',
  RELATED: 'Related:',
  PAYOUT_CALENDAR: 'Payout Calendar',
  PERIOD: 'Period:',
  APPLY: 'Apply',
  DATE_TO: 'to',
  DATE_START: '2026-03-01',
  DATE_END: '2026-03-28',

  // Section titles
  PAYMENT_MIX: 'Payment Method Mix',
  GATEWAY_HEALTH: 'Gateway Health',
  VIEW_GATEWAY_LOGS: 'View Gateway Logs',
  TAX_CASH_FLOW: 'Tax & Cash Flow',
  CASH_FLOW_FORECAST: 'Cash Flow Forecast',
  REVENUE_BY_REGION: 'Revenue by Region (This Month)',
  MONEY_FLOW: 'Money Flow Breakdown',
  CUSTOMER_PAYS: 'Customer Pays',
  CUSTOMER_PAYS_AMOUNT: '\u20B92.45 Cr',
  PLATFORM_KEEPS: 'Platform Keeps',
  REVENUE_TREND: 'Revenue Trend',
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  LEGEND_COMMISSION: 'Commission',
  LEGEND_GATEWAY_FEE: 'Gateway Fee',
  PENDING_SETTLEMENTS: 'Pending Settlements',
  PROCESS_BATCH: 'Process Batch Settlement',
  GATEWAY_BALANCE: 'Gateway Balance',
  SYNC_GATEWAY: 'Sync Gateway Balance',
  RECONCILIATION: 'Reconciliation Status',
  MATCHED: 'Matched',
  MISMATCHED: 'Mismatched',
  REVIEW_MISMATCHES: 'Review Mismatches',
  RECENT_TRANSACTIONS: 'Recent Transactions',
  VIEW_ALL: 'View All',
  REVIEW_FAILED: 'Review Failed',
  VIEW_DISPUTES: 'View Disputes',
  FAILED_TXN_TODAY: 'Failed transactions today',

  // Table headers
  TH_DATE: 'Date',
  TH_ORDER_ID: 'Order ID',
  TH_CUSTOMER: 'Customer',
  TH_AMOUNT: 'Amount',
  TH_COMMISSION: 'Commission',
  TH_GATEWAY_FEE: 'Gateway Fee',
  TH_SELLER_PAYOUT: 'Seller Payout',
  TH_STATUS: 'Status',

  // Loading/Error/Empty
  LOADING_LABEL: 'Loading finance dashboard',
  ERROR_TITLE: 'Failed to load finance data',
  ERROR_DESC: 'Please try refreshing the page or contact support.',
  RETRY: 'Retry',
  EMPTY_TITLE: 'No finance data available',
  EMPTY_DESC: 'Financial data will appear here once transactions begin.',
} as const;

const DATE_RANGES = ['Today', '7D', '30D', '90D', '1Y'] as const;

/* ------------------------------------------------------------------ */
/*  Icon helpers per stat card                                         */
/* ------------------------------------------------------------------ */

const STAT_ICONS: Record<string, React.ReactNode> = {
  'Total Collections': <Banknote className="h-4 w-4" />,
  'Platform Commission': <CircleDollarSign className="h-4 w-4" />,
  'Gateway Fees Paid': <CreditCard className="h-4 w-4" />,
  'GST Collected': <Receipt className="h-4 w-4" />,
  'Net Platform Revenue': <CircleDollarSign className="h-4 w-4" />,
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function LoadingSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label={TEXT.LOADING_LABEL}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-56 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-2 h-4 w-96 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
      </div>
      {/* Related pill skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
        <div className="h-6 w-28 animate-pulse rounded-full bg-gray-200" />
      </div>
      {/* Date range skeleton */}
      <div className="h-14 animate-pulse rounded-xl bg-gray-200" />
      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-xl bg-gray-200" />
        ))}
      </div>
      {/* Three-column row skeleton */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-xl bg-gray-200" />
        ))}
      </div>
      {/* Region row skeleton */}
      <div className="h-28 animate-pulse rounded-xl bg-gray-200" />
      {/* Alert banners skeleton */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-20 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-20 animate-pulse rounded-xl bg-gray-200" />
      </div>
      {/* Two-column row skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-80 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-80 animate-pulse rounded-xl bg-gray-200" />
      </div>
      {/* Three-column row skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-xl bg-gray-200" />
        ))}
      </div>
      {/* Table skeleton */}
      <div className="h-96 animate-pulse rounded-xl bg-gray-200" />
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24" role="alert">
      <AlertTriangle className="h-12 w-12 text-red-400" />
      <h2 className="text-lg font-semibold text-gray-900">{TEXT.ERROR_TITLE}</h2>
      <p className="text-sm text-gray-500">{TEXT.ERROR_DESC}</p>
      <button
        onClick={() => window.location.reload()}
        className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
      >
        {TEXT.RETRY}
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <Banknote className="h-12 w-12 text-gray-300" />
      <h2 className="text-lg font-semibold text-gray-900">{TEXT.EMPTY_TITLE}</h2>
      <p className="text-sm text-gray-500">{TEXT.EMPTY_DESC}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat Card (inline, matching prototype exactly)                     */
/* ------------------------------------------------------------------ */

function FinanceStatCard({ card }: { card: StatCardData }) {
  const icon = STAT_ICONS[card.title];
  return (
    <div
      className={cn(
        'rounded-xl border bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]',
        card.isHighlighted
          ? 'border-orange-200 ring-1 ring-orange-100'
          : 'border-gray-200'
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className={cn(
            'text-xs font-semibold uppercase tracking-wide',
            card.isHighlighted ? 'text-orange-600' : 'text-gray-500'
          )}
        >
          {card.title}
        </span>
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', card.iconBg)}>
          <span className={card.iconColor}>{icon}</span>
        </div>
      </div>
      <p className={cn('text-2xl font-bold', card.valueColor ?? 'text-gray-900')}>
        {card.value}
      </p>
      <p className="mt-1 text-xs text-gray-500">{card.subtitle}</p>
      <div className="mt-2 flex items-center gap-1">
        {card.trendValue && card.trendDirection === 'up' && (
          <>
            <ArrowUpRight className="h-3.5 w-3.5 text-green-500" />
            <span className="text-xs font-semibold text-green-600">{card.trendValue}</span>
          </>
        )}
        {card.trendValue && card.trendDirection === 'down' && (
          <>
            <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
            <span className="text-xs font-semibold text-red-600">{card.trendValue}</span>
          </>
        )}
        {card.trendLabel && (
          <span className="text-xs text-gray-400">{card.trendLabel}</span>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reconciliation SVG Ring                                            */
/* ------------------------------------------------------------------ */

function ReconciliationRing({ pct }: { pct: number }) {
  return (
    <div className="relative h-20 w-20">
      <svg className="-rotate-90" viewBox="0 0 36 36" width={80} height={80}>
        <path
          className="text-gray-100"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831"
        />
        <path
          className="text-green-500"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeDasharray={`${pct},100`}
          d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-gray-900">{pct}%</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function FinanceDashboard() {
  const [activeRange, setActiveRange] = useState<string>('30D');
  const [chartMode, setChartMode] = useState<'Daily' | 'Weekly'>('Daily');
  const { data, isLoading, isError } = useFinanceDashboard(activeRange);

  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <ErrorState />;
  if (!data) return <EmptyState />;

  return (
    <section className="space-y-6" aria-label={TEXT.PAGE_TITLE}>

      {/* ============================================================ */}
      {/*  Page Header                                                  */}
      {/* ============================================================ */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{TEXT.PAGE_TITLE}</h1>
            <p className="mt-1 text-sm text-gray-500">{TEXT.PAGE_SUBTITLE}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
              <Download className="h-4 w-4" />
              {TEXT.EXPORT_REPORT}
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Sub-page Navigation                                          */}
      {/* ============================================================ */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">{TEXT.RELATED}</span>
        <Link
          href="/sellers/payout-calendar"
          className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-500 transition hover:bg-orange-100"
        >
          {TEXT.PAYOUT_CALENDAR}
        </Link>
      </div>

      {/* ============================================================ */}
      {/*  Date Range Filter                                            */}
      {/* ============================================================ */}
      <nav
        className="rounded-xl border border-gray-200 bg-white p-4"
        aria-label="Date range filter"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-sm font-medium text-gray-600">{TEXT.PERIOD}</span>
          {DATE_RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setActiveRange(r)}
              aria-pressed={activeRange === r}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                activeRange === r
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600'
              )}
            >
              {r}
            </button>
          ))}
          <div className="mx-2 h-6 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <input
              type="date"
              defaultValue={TEXT.DATE_START}
              aria-label="Start date"
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-orange-400"
            />
            <span className="text-xs text-gray-400">{TEXT.DATE_TO}</span>
            <input
              type="date"
              defaultValue={TEXT.DATE_END}
              aria-label="End date"
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-orange-400"
            />
            <button className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-orange-50 hover:text-orange-600">
              {TEXT.APPLY}
            </button>
          </div>
        </div>
      </nav>

      {/* ============================================================ */}
      {/*  Top Stats Row (5 cards)                                      */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {data.statCards.map((card) => (
          <FinanceStatCard key={card.title} card={card} />
        ))}
      </div>

      {/* ============================================================ */}
      {/*  Payment Method Mix + Gateway Health + Tax & Cash Flow        */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        {/* Payment Method Mix */}
        <article className="rounded-xl border border-gray-200 bg-white p-5" aria-label={TEXT.PAYMENT_MIX}>
          <h3 className="mb-4 text-sm font-semibold text-gray-900">{TEXT.PAYMENT_MIX}</h3>

          {/* Stacked horizontal bar */}
          <div className="mb-4 flex h-8 overflow-hidden rounded-lg">
            {data.paymentMethods.map((pm) => (
              <div
                key={pm.method}
                className={cn('flex items-center justify-center', pm.color)}
                style={{ width: `${pm.pct}%` }}
              >
                {pm.pct >= 8 && (
                  <span className="text-[10px] font-bold text-white">
                    {pm.method === 'Wallet' ? `${pm.pct}%` : `${pm.method} ${pm.pct}%`}
                  </span>
                )}
              </div>
            ))}
            {/* "Other" sliver: 4% */}
            <div className="bg-gray-400" style={{ width: '4%' }} />
          </div>

          {/* Legend rows */}
          <div className="space-y-2">
            {data.paymentMethods.map((pm) => (
              <div key={pm.method} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={cn('h-2 w-2 rounded-full', pm.color)} />
                  <span className="text-gray-600">{pm.method}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn('font-semibold', pm.successColor)}>{pm.successLabel}</span>
                  <span className="text-gray-400">{pm.successValue}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Failed transactions footer */}
          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-xs text-gray-500">{TEXT.FAILED_TXN_TODAY}</span>
            <span className="text-xs font-bold text-red-600">{data.failedTransactionsToday}</span>
          </div>
        </article>

        {/* Gateway Health */}
        <article className="rounded-xl border border-gray-200 bg-white p-5" aria-label={TEXT.GATEWAY_HEALTH}>
          <h3 className="mb-4 text-sm font-semibold text-gray-900">{TEXT.GATEWAY_HEALTH}</h3>
          <div className="space-y-3">
            {data.gateways.map((gw) => {
              const styles = getGatewayCardClass(gw.status);
              return (
                <div
                  key={gw.name}
                  className={cn(
                    'flex items-center justify-between rounded-lg border p-3',
                    styles.bg,
                    styles.border
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'h-2 w-2 rounded-full',
                        styles.dotColor,
                        styles.dotAnimate && 'animate-pulse'
                      )}
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{gw.name}</p>
                      <p className={cn('text-[10px]', styles.subtitleColor)}>{gw.subtitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn('text-sm font-bold', styles.uptimeColor)}>{gw.uptime}</p>
                    <p className={cn('text-[10px]', styles.latencyColor)}>{gw.latency}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="mt-3 w-full rounded-lg border border-orange-200 py-2 text-center text-xs font-semibold text-orange-500 transition hover:bg-orange-50 hover:text-orange-600">
            {TEXT.VIEW_GATEWAY_LOGS}
          </button>
        </article>

        {/* Tax & Cash Flow */}
        <article className="rounded-xl border border-gray-200 bg-white p-5" aria-label={TEXT.TAX_CASH_FLOW}>
          <h3 className="mb-4 text-sm font-semibold text-gray-900">{TEXT.TAX_CASH_FLOW}</h3>

          {/* Tax lines */}
          <div className="mb-4 space-y-3">
            {data.taxLines.map((line) => (
              <div key={line.label} className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{line.label}</span>
                <span className="font-bold text-gray-900">{line.value}</span>
              </div>
            ))}
          </div>

          {/* GST filing alert */}
          <div className="mb-4 rounded-lg border border-amber-100 bg-amber-50 p-3">
            <div className="mb-1 flex items-center gap-2">
              <Info className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700">{data.gstFilingDue}</span>
            </div>
            <p className="ml-6 text-[10px] text-amber-600">{data.gstFilingDetail}</p>
          </div>

          {/* Cash Flow Forecast */}
          <div className="border-t border-gray-100 pt-3">
            <p className="mb-2 text-xs font-semibold text-gray-700">{TEXT.CASH_FLOW_FORECAST}</p>
            {data.cashFlow.map((item, idx) => (
              <div
                key={item.label}
                className={cn(
                  'flex items-center justify-between text-xs',
                  idx > 0 && 'mt-1',
                  item.isBold && 'mt-1 border-t border-gray-100 pt-1'
                )}
              >
                <span className={cn(item.isBold ? 'font-semibold text-gray-600' : 'text-gray-500')}>
                  {item.label}
                </span>
                <span className={cn('font-bold', item.color)}>{item.value}</span>
              </div>
            ))}
          </div>
        </article>
      </div>

      {/* ============================================================ */}
      {/*  Revenue by Region                                            */}
      {/* ============================================================ */}
      <article className="rounded-xl border border-gray-200 bg-white p-5" aria-label={TEXT.REVENUE_BY_REGION}>
        <h3 className="mb-4 text-sm font-semibold text-gray-900">{TEXT.REVENUE_BY_REGION}</h3>
        <div className="grid grid-cols-5 gap-4">
          {data.regions.map((r) => (
            <div key={r.region} className="rounded-lg bg-gray-50 p-3 text-center">
              <p className="text-lg font-bold text-gray-900">{r.revenue}</p>
              <p className="text-xs font-medium text-gray-600">{r.region}</p>
              <p className="text-[10px] text-gray-400">{r.orders}</p>
              <span className="text-[10px] font-semibold text-green-600">{r.growth}</span>
            </div>
          ))}
        </div>
      </article>

      {/* ============================================================ */}
      {/*  Alert Banners: Failed Transactions + Chargebacks             */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* Failed Transactions */}
        <div className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-800">
                {data.failedAlert.count} Failed Transactions Today
              </p>
              <p className="text-xs text-red-600">
                Total value: {data.failedAlert.value} — {data.failedAlert.autoRetried} auto-retried, {data.failedAlert.pendingReview} pending manual review
              </p>
            </div>
          </div>
          <button className="rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50">
            {TEXT.REVIEW_FAILED}
          </button>
        </div>

        {/* Chargebacks */}
        <div className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <ShieldAlert className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-800">
                {data.chargebackAlert.count} Chargebacks This Week
              </p>
              <p className="text-xs text-amber-600">
                {data.chargebackAlert.value} disputed — Win rate: {data.chargebackAlert.winRate}
              </p>
            </div>
          </div>
          <button className="rounded-lg border border-amber-200 bg-white px-4 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-50">
            {TEXT.VIEW_DISPUTES}
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Money Flow Diagram + Revenue Trend Chart                     */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Money Flow Breakdown */}
        <article className="rounded-xl border border-gray-200 bg-white p-6" aria-label={TEXT.MONEY_FLOW}>
          <h3 className="mb-5 text-sm font-semibold text-gray-900">{TEXT.MONEY_FLOW}</h3>

          {/* Customer Pays bar */}
          <div className="mb-5">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">{TEXT.CUSTOMER_PAYS}</span>
              <span className="text-xs font-bold text-gray-900">{TEXT.CUSTOMER_PAYS_AMOUNT}</span>
            </div>
            <div className="h-6 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="flex h-full items-center justify-end rounded-full bg-blue-500 pr-2"
                style={{ width: '100%' }}
                role="progressbar"
                aria-valuenow={100}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span className="text-[10px] font-bold text-white">100%</span>
              </div>
            </div>
          </div>

          {/* Breakdown bars */}
          <div className="ml-4 space-y-4 border-l-2 border-gray-200 pl-4">
            {data.moneyFlow.map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn('h-2.5 w-2.5 rounded-full', item.color)} />
                    <span className="text-xs font-medium text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">
                    {item.amount}
                    {item.sub && (
                      <span className="ml-1 font-normal text-gray-400">({item.sub})</span>
                    )}
                  </span>
                </div>
                <div className="h-4 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={cn('h-full rounded-full transition-all duration-700', item.color)}
                    style={{ width: `${item.pct}%` }}
                    role="progressbar"
                    aria-valuenow={item.pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={item.label}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Platform Keeps */}
          <div className="mt-5 border-t border-dashed border-gray-200 pt-4">
            <div className="flex items-center justify-between rounded-lg bg-orange-50 p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-semibold text-orange-700">{TEXT.PLATFORM_KEEPS}</span>
              </div>
              <span className="text-lg font-bold text-orange-600">{data.platformKeeps}</span>
            </div>
          </div>
        </article>

        {/* Revenue Trend Chart */}
        <article className="rounded-xl border border-gray-200 bg-white p-6" aria-label={TEXT.REVENUE_TREND}>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">{TEXT.REVENUE_TREND}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setChartMode('Daily')}
                className={cn(
                  'rounded-lg px-3 py-1 text-xs font-semibold transition',
                  chartMode === 'Daily'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-orange-50'
                )}
              >
                {TEXT.DAILY}
              </button>
              <button
                onClick={() => setChartMode('Weekly')}
                className={cn(
                  'rounded-lg px-3 py-1 text-xs font-semibold transition',
                  chartMode === 'Weekly'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-orange-50'
                )}
              >
                {TEXT.WEEKLY}
              </button>
            </div>
          </div>

          {/* CSS bar chart */}
          <div className="flex h-48 items-end gap-1.5 px-2">
            {data.revenueData.map((bar) => (
              <div key={bar.label} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={cn('w-full rounded-t', getBarColor(bar.heightPct))}
                  style={{ height: `${bar.heightPct}%` }}
                />
                <span className="text-[9px] text-gray-400">{bar.label}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded bg-orange-500" />
              {TEXT.LEGEND_COMMISSION}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded bg-orange-200" />
              {TEXT.LEGEND_GATEWAY_FEE}
            </div>
          </div>
        </article>
      </div>

      {/* ============================================================ */}
      {/*  Pending Settlements + Gateway Balance + Reconciliation       */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Pending Settlements */}
        <article className="rounded-xl border border-gray-200 bg-white p-6" aria-label={TEXT.PENDING_SETTLEMENTS}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">{TEXT.PENDING_SETTLEMENTS}</h3>
            <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{data.pendingSettlements.total}</p>
          <p className="mt-1 text-sm text-gray-500">
            Pending for <span className="font-semibold text-gray-700">{data.pendingSettlements.sellerCount}</span>
          </p>
          <div className="mt-4 space-y-2">
            {data.pendingSettlements.lines.map((line) => (
              <div key={line.label} className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{line.label}</span>
                <span className={cn('font-semibold', line.color)}>{line.value}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-lg border border-orange-200 py-2 text-center text-xs font-semibold text-orange-500 transition hover:bg-orange-50 hover:text-orange-600">
            {TEXT.PROCESS_BATCH}
          </button>
        </article>

        {/* Gateway Balance */}
        <article className="rounded-xl border border-gray-200 bg-white p-6" aria-label={TEXT.GATEWAY_BALANCE}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">{TEXT.GATEWAY_BALANCE}</h3>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
              {data.gatewayBalance.badge}
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{data.gatewayBalance.total}</p>
          <p className="mt-1 text-sm text-gray-500">{data.gatewayBalance.subtitle}</p>
          <div className="mt-4 space-y-2">
            {data.gatewayBalance.lines.map((line) => (
              <div key={line.label} className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{line.label}</span>
                <span className={cn('font-semibold', line.color)}>{line.value}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-lg border border-blue-200 py-2 text-center text-xs font-semibold text-blue-500 transition hover:bg-blue-50 hover:text-blue-600">
            {TEXT.SYNC_GATEWAY}
          </button>
        </article>

        {/* Reconciliation Status */}
        <article className="rounded-xl border border-gray-200 bg-white p-6" aria-label={TEXT.RECONCILIATION}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">{TEXT.RECONCILIATION}</h3>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>

          {/* Progress ring + summary */}
          <div className="mb-4 flex items-center gap-4">
            <ReconciliationRing pct={data.reconciliation.matchedPct} />
            <div>
              <p className="text-sm font-semibold text-gray-900">{TEXT.MATCHED}</p>
              <p className="text-xs text-gray-500">
                {data.reconciliation.matchedCount} of {data.reconciliation.totalCount} transactions
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">{TEXT.MATCHED}</span>
              <span className="font-semibold text-green-600">{data.reconciliation.matchedCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">{TEXT.MISMATCHED}</span>
              <span className="font-semibold text-red-600">{data.reconciliation.mismatchedCount} transactions</span>
            </div>
          </div>
          <button className="mt-4 w-full rounded-lg border border-red-200 py-2 text-center text-xs font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-600">
            {TEXT.REVIEW_MISMATCHES}
          </button>
        </article>
      </div>

      {/* ============================================================ */}
      {/*  Recent Transactions Table                                    */}
      {/* ============================================================ */}
      <article className="overflow-hidden rounded-xl border border-gray-200 bg-white" aria-label={TEXT.RECENT_TRANSACTIONS}>
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-900">{TEXT.RECENT_TRANSACTIONS}</h3>
          <button className="text-xs font-semibold text-orange-500 transition hover:text-orange-600">
            {TEXT.VIEW_ALL}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" aria-label={TEXT.RECENT_TRANSACTIONS}>
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3 font-semibold">{TEXT.TH_DATE}</th>
                <th className="px-6 py-3 font-semibold">{TEXT.TH_ORDER_ID}</th>
                <th className="px-6 py-3 font-semibold">{TEXT.TH_CUSTOMER}</th>
                <th className="px-6 py-3 text-right font-semibold">{TEXT.TH_AMOUNT}</th>
                <th className="px-6 py-3 text-right font-semibold">{TEXT.TH_COMMISSION}</th>
                <th className="px-6 py-3 text-right font-semibold">{TEXT.TH_GATEWAY_FEE}</th>
                <th className="px-6 py-3 text-right font-semibold">{TEXT.TH_SELLER_PAYOUT}</th>
                <th className="px-6 py-3 text-center font-semibold">{TEXT.TH_STATUS}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.recentTransactions.map((txn) => (
                <tr
                  key={txn.orderId}
                  className="transition-colors hover:bg-orange-50/40"
                >
                  <td className="px-6 py-3.5 text-xs text-gray-500">{txn.date}</td>
                  <td className="px-6 py-3.5 font-medium text-orange-600">{txn.orderId}</td>
                  <td className="px-6 py-3.5">{txn.customer}</td>
                  <td className="px-6 py-3.5 text-right font-medium">{txn.amount}</td>
                  <td className="px-6 py-3.5 text-right font-medium text-green-600">{txn.commission}</td>
                  <td className="px-6 py-3.5 text-right text-red-600">{txn.gatewayFee}</td>
                  <td className="px-6 py-3.5 text-right">{txn.sellerPayout}</td>
                  <td className="px-6 py-3.5 text-center">
                    <span
                      className={cn(
                        'rounded-full px-2 py-1 text-xs font-semibold',
                        getStatusBadgeClass(txn.status)
                      )}
                    >
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
