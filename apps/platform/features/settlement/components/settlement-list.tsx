'use client';

import { Fragment, useState } from 'react';
import {
  Clock, CheckCircle, Store, Timer, Search, Download, Play,
  Eye, RotateCcw, AlertTriangle, Banknote, ChevronRight,
  ChevronLeft, Calendar, TrendingUp, Calculator,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { useSettlements } from '../hooks/use-settlement';
import {
  MOCK_SETTLEMENT_TABS,
  MOCK_CHART_BARS,
  MOCK_HOLD_SELLERS,
  MOCK_FAILED_SETTLEMENTS,
  MOCK_DISPUTED_SETTLEMENTS,
  MOCK_SELLER_OPTIONS,
} from '../services/mock-data';
import type { SettlementItem, EarningsBreakdown, HoldSeller } from '../services/mock-data';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const PAGE_TITLE = 'Settlement Management';
const PAGE_SUBTITLE = 'Process payouts, manage seller settlements, and resolve disputes.';
const BATCH_DATE = 'April 5, 2026';
const BATCH_SELLERS = '42';
const BATCH_TOTAL = '\u20B945,80,000';
const BATCH_PERIOD = 'Mar 29 - Apr 4';
const CHART_TOTAL_6M = '\u20B96.06 Cr';
const CHART_AVG_MONTHLY = '\u20B91.01 Cr';
const CHART_GROWTH = '+46% growth';
const DATE_RANGE_LABEL = 'Mar 1 - Mar 28, 2026';
const TOTAL_PAGES = 6;
const ITEMS_PER_PAGE = 8;
const TOTAL_ITEMS = 48;

/* ------------------------------------------------------------------ */
/*  Status helpers                                                     */
/* ------------------------------------------------------------------ */

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string; border: string; pulse?: boolean }> = {
  Pending:    { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500', border: 'border-yellow-200' },
  Processing: { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500',   border: 'border-blue-200', pulse: true },
  Completed:  { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500',  border: 'border-green-200' },
  Failed:     { bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500',    border: 'border-red-200' },
  Disputed:   { bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500',    border: 'border-red-200' },
};

const HOLD_REASON_STYLES: Record<string, { rowBg: string; badgeBg: string; badgeText: string; badgeBorder: string }> = {
  kyc:          { rowBg: 'bg-yellow-50/50 border-yellow-100', badgeBg: 'bg-yellow-100', badgeText: 'text-yellow-700', badgeBorder: 'border-yellow-200' },
  dispute:      { rowBg: 'bg-purple-50/50 border-purple-100', badgeBg: 'bg-purple-100', badgeText: 'text-purple-700', badgeBorder: 'border-purple-200' },
  'low-balance': { rowBg: 'bg-blue-50/50 border-blue-100',   badgeBg: 'bg-blue-100',   badgeText: 'text-blue-700',   badgeBorder: 'border-blue-200' },
  fraud:        { rowBg: 'bg-red-50/50 border-red-100',      badgeBg: 'bg-red-100',    badgeText: 'text-red-700',    badgeBorder: 'border-red-200' },
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function SettlementStatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.Pending;
  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border',
      s.bg, s.text, s.border,
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', s.dot, s.pulse && 'animate-pulse')} />
      {status}
    </span>
  );
}

function EarningsBreakdownRow({ breakdown }: { breakdown: EarningsBreakdown }) {
  const isZeroAdjustment = breakdown.adjustmentAmount === '\u20B90';
  return (
    <td colSpan={11} className="px-0 py-0">
      <div className="border-t border-b border-gray-100 bg-gray-50 px-8 py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Seller Earnings Breakdown</p>
        <div className="flex items-center gap-0">
          {/* Gross Sales */}
          <div className="flex-1 rounded-l-lg border border-gray-200 bg-white p-3 text-center">
            <p className="text-[10px] font-semibold uppercase text-gray-500">Gross Sales</p>
            <p className="mt-1 text-sm font-bold text-gray-900">{breakdown.grossSales}</p>
          </div>
          <span className="px-1 text-lg font-light text-gray-300">&rarr;</span>
          {/* Commission */}
          <div className="flex-1 border border-gray-200 bg-white p-3 text-center">
            <p className="text-[10px] font-semibold uppercase text-red-500">Commission (5%)</p>
            <p className="mt-1 text-sm font-bold text-red-600">{breakdown.commission}</p>
          </div>
          <span className="px-1 text-lg font-light text-gray-300">&rarr;</span>
          {/* GST */}
          <div className="flex-1 border border-gray-200 bg-white p-3 text-center">
            <p className="text-[10px] font-semibold uppercase text-red-500">GST (18% on fee)</p>
            <p className="mt-1 text-sm font-bold text-red-600">{breakdown.gstOnFee}</p>
          </div>
          <span className="px-1 text-lg font-light text-gray-300">&rarr;</span>
          {/* TDS */}
          <div className="flex-1 border border-gray-200 bg-white p-3 text-center">
            <p className="text-[10px] font-semibold uppercase text-red-500">TDS (1%)</p>
            <p className="mt-1 text-sm font-bold text-red-600">{breakdown.tds}</p>
          </div>
          <span className="px-1 text-lg font-light text-gray-300">&rarr;</span>
          {/* Adjustments */}
          <div className="flex-1 border border-gray-200 bg-white p-3 text-center">
            <p className="text-[10px] font-semibold uppercase text-gray-500">Adjustments</p>
            <p className={cn('mt-1 text-sm font-bold', isZeroAdjustment ? 'text-gray-500' : 'text-green-600')}>
              {breakdown.adjustmentAmount}
            </p>
            <p className="mt-0.5 text-[9px] text-gray-400">{breakdown.adjustmentLabel}</p>
          </div>
          <span className="px-1 text-lg font-light text-gray-300">&rarr;</span>
          {/* Net Payout */}
          <div className="flex-1 rounded-r-lg border border-green-200 bg-green-50 p-3 text-center">
            <p className="text-[10px] font-semibold uppercase text-green-700">Net Payout</p>
            <p className="mt-1 text-sm font-bold text-green-700">{breakdown.netPayout}</p>
          </div>
        </div>
      </div>
    </td>
  );
}

function HoldSellerRow({ seller }: { seller: HoldSeller }) {
  const style = HOLD_REASON_STYLES[seller.reasonVariant] ?? HOLD_REASON_STYLES.kyc;
  return (
    <div className={cn('flex items-center justify-between rounded-lg border px-4 py-3', style.rowBg)}>
      <div className="flex items-center gap-3">
        <div className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white',
          seller.gradient,
        )}>
          {seller.initials}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{seller.name}</p>
          <p className="text-[11px] text-gray-500">Pending: {seller.pending} | Held since: {seller.heldSince}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={cn(
          'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold',
          style.badgeBg, style.badgeText, style.badgeBorder,
        )}>
          {seller.reason}
        </span>
        <button className="rounded-lg border border-orange-200 bg-white px-3 py-1.5 text-xs font-semibold text-orange-600 transition hover:bg-orange-50 hover:text-orange-700">
          Release Hold
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function SettlementList() {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tabs = MOCK_SETTLEMENT_TABS;
  const { data, isLoading, isError } = useSettlements(tabs[activeTab]?.label ?? 'All');

  /* ---- Loading state ---- */
  if (isLoading) {
    return (
      <div className="space-y-6" role="status" aria-label="Loading settlements">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-64 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-4 w-96 animate-pulse rounded-lg bg-gray-100" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
          </div>
        </div>
        {/* Stat cards skeleton */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
        {/* Batch preview skeleton */}
        <div className="h-48 animate-pulse rounded-xl bg-orange-100/50" />
        {/* Chart skeleton */}
        <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
        {/* Table skeleton */}
        <div className="h-96 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  /* ---- Error state ---- */
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24" role="alert">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Failed to load settlements</h2>
        <p className="max-w-md text-center text-sm text-gray-500">
          Something went wrong while fetching settlement data. Please try refreshing the page or contact support if the issue persists.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          <RotateCcw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  /* ---- Empty state ---- */
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Banknote className="h-8 w-8 text-gray-300" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">No settlements found</h2>
        <p className="max-w-md text-center text-sm text-gray-500">
          Settlements will appear here once sellers have payable orders in the system.
        </p>
      </div>
    );
  }

  /* ---- Success state ---- */

  const toggleExpand = (id: string) => {
    setExpandedRow(prev => (prev === id ? null : id));
  };

  return (
    <section className="space-y-8" aria-label="Settlement Management">

      {/* ===== Page Header ===== */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{PAGE_TITLE}</h1>
            <p className="mt-1 text-sm text-gray-500">{PAGE_SUBTITLE}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600">
              <Play className="h-4 w-4" />
              Process Batch
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">
              <Download className="h-4 w-4 text-gray-400" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* ===== 4 Stat Cards ===== */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Pending */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <span className="rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-600">Awaiting</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{'\u20B945,80,000'}</p>
          <p className="mt-1 text-xs text-gray-500">Total Pending</p>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full w-[27%] rounded-full bg-yellow-400" />
          </div>
        </div>

        {/* Processed This Week */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{'\u20B91,24,50,000'}</p>
          <p className="mt-1 text-xs text-gray-500">Processed This Week</p>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full w-[73%] rounded-full bg-green-500" />
          </div>
        </div>

        {/* Active Sellers */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Store className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">234</p>
          <p className="mt-1 text-xs text-gray-500">Active Sellers</p>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full w-[85%] rounded-full bg-blue-500" />
          </div>
        </div>

        {/* Avg Settlement Time */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <Timer className="h-5 w-5 text-purple-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">3.2 days</p>
          <p className="mt-1 text-xs text-gray-500">Avg Settlement Time</p>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full w-[40%] rounded-full bg-purple-500" />
          </div>
        </div>
      </div>

      {/* ===== Settlement Batch Preview ===== */}
      <div className="rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-orange-50/50 p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Next Settlement Batch</h2>
                <p className="text-sm text-gray-600">
                  Scheduled for <span className="font-semibold text-orange-600">{BATCH_DATE}</span>
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-6">
              <div className="rounded-lg border border-orange-100 bg-white/70 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Sellers</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{BATCH_SELLERS}</p>
                <p className="text-xs text-gray-500">eligible for payout</p>
              </div>
              <div className="rounded-lg border border-orange-100 bg-white/70 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Batch Total</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{BATCH_TOTAL}</p>
                <p className="text-xs text-gray-500">net payout amount</p>
              </div>
              <div className="rounded-lg border border-orange-100 bg-white/70 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Period</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{BATCH_PERIOD}</p>
                <p className="text-xs text-gray-500">settlement window</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Preview before processing to verify seller eligibility, hold statuses, and deduction accuracy.
            </p>
          </div>
          <div className="ml-6 flex shrink-0 flex-col gap-2">
            <button className="flex items-center gap-2 rounded-lg border border-orange-300 bg-white px-5 py-2.5 text-sm font-semibold text-orange-600 shadow-sm transition hover:bg-orange-50">
              <Eye className="h-4 w-4" />
              Preview Batch
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600">
              <Play className="h-4 w-4" />
              Process Now
            </button>
          </div>
        </div>
      </div>

      {/* ===== Settlement Volume Trend Chart ===== */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Settlement Volume Trend</h2>
            <p className="mt-0.5 text-xs text-gray-500">Monthly payout volume over the last 6 months</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
            <TrendingUp className="h-3 w-3" />
            {CHART_GROWTH}
          </span>
        </div>
        <div className="flex h-40 items-end gap-4">
          {MOCK_CHART_BARS.map((bar) => (
            <div key={bar.month} className="group flex flex-1 flex-col items-center gap-2">
              <div className="relative w-full">
                <div
                  className={cn('w-full rounded-t-lg transition-all duration-300 hover:opacity-85', bar.color)}
                  style={{ height: `${bar.height}px` }}
                />
                <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
                  {bar.value}
                </div>
              </div>
              <span className="text-[10px] font-medium text-gray-500">{bar.month}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">
              Total (6 months): <span className="font-bold text-gray-800">{CHART_TOTAL_6M}</span>
            </span>
            <span className="text-xs text-gray-500">
              Avg monthly: <span className="font-bold text-gray-800">{CHART_AVG_MONTHLY}</span>
            </span>
          </div>
          <span className="text-xs text-gray-500">234 active sellers across all periods</span>
        </div>
      </div>

      {/* ===== Filter Tabs + Search ===== */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="scrollbar-hide overflow-x-auto border-b border-gray-100 px-6">
          <div className="flex min-w-max gap-0">
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => { setActiveTab(i); setExpandedRow(null); }}
                className={cn(
                  'border-b-2 px-4 py-3.5 text-sm font-medium transition',
                  activeTab === i
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700',
                )}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 p-4">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by settlement ID, seller name..."
              aria-label="Search settlements"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>
          <select
            aria-label="Filter by seller"
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          >
            {MOCK_SELLER_OPTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{DATE_RANGE_LABEL}</span>
            <ChevronRight className="h-3.5 w-3.5 rotate-90 text-gray-400" />
          </div>
        </div>
      </div>

      {/* ===== Settlements Table with Expandable Earnings Breakdown ===== */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Settlements">
            <thead>
              <tr className="bg-gray-50/80">
                <th scope="col" className="w-8 px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500" />
                <th scope="col" className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Settlement ID</th>
                <th scope="col" className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Seller Name</th>
                <th scope="col" className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Period</th>
                <th scope="col" className="px-3 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500">Gross Amount</th>
                <th scope="col" className="px-3 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500">Platform Fee (5%)</th>
                <th scope="col" className="px-3 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500">GST</th>
                <th scope="col" className="px-3 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500">Net Payout</th>
                <th scope="col" className="px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th scope="col" className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Payout Date</th>
                <th scope="col" className="px-6 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((s: SettlementItem) => {
                const isExpanded = expandedRow === s.id;
                return (
                  <Fragment key={s.id}>
                    <tr
                      className="cursor-pointer transition-colors hover:bg-orange-50/40"
                      onClick={() => toggleExpand(s.id)}
                    >
                      <td className="px-3 py-3.5 text-center">
                        <ChevronRight className={cn(
                          'h-4 w-4 text-gray-400 transition-transform duration-200',
                          isExpanded && 'rotate-90',
                        )} />
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="text-sm font-semibold text-orange-600">{s.id}</span>
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white',
                            s.gradient,
                          )}>
                            {s.initials}
                          </div>
                          <span className="text-sm font-medium text-gray-800">{s.seller}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-sm text-gray-600">{s.period}</td>
                      <td className="px-3 py-3.5 text-right text-sm font-medium text-gray-800">{s.gross}</td>
                      <td className="px-3 py-3.5 text-right text-sm text-red-500">{s.fee}</td>
                      <td className="px-3 py-3.5 text-right text-sm text-red-500">{s.gst}</td>
                      <td className="px-3 py-3.5 text-right text-sm font-bold text-gray-900">{s.net}</td>
                      <td className="px-3 py-3.5 text-center">
                        <SettlementStatusBadge status={s.status} />
                      </td>
                      <td className="px-3 py-3.5 text-sm text-gray-500">{s.payoutDate}</td>
                      <td className="px-6 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          {s.status === 'Pending' && (
                            <button className="rounded-lg p-1.5 text-green-600 transition hover:bg-green-50" title="Process">
                              <Play className="h-4 w-4" />
                            </button>
                          )}
                          {s.status === 'Failed' && (
                            <button className="rounded-lg p-1.5 text-orange-500 transition hover:bg-orange-50" title="Retry">
                              <RotateCcw className="h-4 w-4" />
                            </button>
                          )}
                          <button className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100" title="View">
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <EarningsBreakdownRow breakdown={s.breakdown} />
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Hold Reasons Tracker + Failed Settlement Retry ===== */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* Hold Reasons Tracker */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm xl:col-span-3">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Sellers on Hold</h2>
              <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">8 Sellers</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-yellow-400" />KYC (3)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-purple-400" />Dispute (2)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-400" />Low Balance (1)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500" />Fraud (2)
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {MOCK_HOLD_SELLERS.map((seller) => (
              <HoldSellerRow key={`${seller.name}-${seller.reason}`} seller={seller} />
            ))}
          </div>
        </div>

        {/* Failed Settlement Retry */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Failed Settlements</h2>
            <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">3 Failed</span>
          </div>
          <div className="space-y-4">
            {MOCK_FAILED_SETTLEMENTS.map((fs) => (
              <div key={fs.id} className="rounded-xl border border-red-100 bg-red-50/50 p-4">
                <div className="mb-2 flex items-center gap-3">
                  <span className="text-sm font-semibold text-orange-600">{fs.id}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">Failed</span>
                </div>
                <p className="text-sm font-medium text-gray-800">{fs.seller}</p>
                <p className="mt-1 text-xs text-gray-500">Net Payout: {fs.net}</p>
                <div className="mt-2 rounded-lg border border-red-100 bg-white p-2.5">
                  <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Failure Reason</p>
                  <p className="text-sm text-gray-700">{fs.reason}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">{fs.failedAt}</span>
                  <button className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-600">
                    <RotateCcw className="h-3.5 w-3.5" />
                    Retry
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Batch Processing + Disputed Settlements ===== */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Batch Processing Card */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm xl:col-span-1">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">Batch Processing</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">Date Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  defaultValue="2026-03-22"
                  className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
                <span className="text-sm text-gray-400">to</span>
                <input
                  type="date"
                  defaultValue="2026-03-28"
                  className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">Sellers</label>
              <select className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100">
                <option>All Sellers (234)</option>
                <option>Specific Sellers...</option>
              </select>
            </div>
            <div className="space-y-2 pt-2">
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-200">
                <Calculator className="h-4 w-4" />
                Calculate
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600">
                <Play className="h-4 w-4" />
                Process Batch
              </button>
            </div>
          </div>
        </div>

        {/* Disputed Settlements */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Disputed Settlements</h2>
            <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">2 Active</span>
          </div>
          <div className="space-y-4">
            {MOCK_DISPUTED_SETTLEMENTS.map((ds) => (
              <div key={ds.id} className="rounded-xl border border-red-100 bg-red-50/50 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="text-sm font-semibold text-orange-600">{ds.id}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">Disputed</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800">{ds.seller}</p>
                    <p className="mt-1 text-xs text-gray-500">Period: {ds.period} | Net Payout: {ds.net}</p>
                    <div className="mt-2 rounded-lg border border-red-100 bg-white p-2.5">
                      <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Dispute Reason</p>
                      <p className="text-sm text-gray-700">{ds.reason}</p>
                    </div>
                  </div>
                  <button className="ml-4 shrink-0 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600">
                    Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Pagination ===== */}
      <div className="rounded-xl border border-gray-100 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-700">1 - {ITEMS_PER_PAGE}</span> of{' '}
            <span className="font-medium text-gray-700">{TOTAL_ITEMS}</span> settlements
          </p>
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: TOTAL_PAGES }).map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition',
                    currentPage === page
                      ? 'bg-orange-500 font-semibold text-white'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50',
                  )}
                >
                  {page}
                </button>
              );
            })}
            <button
              disabled={currentPage === TOTAL_PAGES}
              onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

    </section>
  );
}

