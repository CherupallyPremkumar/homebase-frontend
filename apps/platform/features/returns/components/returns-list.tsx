'use client';

import { useState } from 'react';
import {
  RotateCcw, Clock, Truck, Banknote, CheckCircle2, Search, Download,
  Eye, MoreVertical, AlertTriangle, Check, X, ChevronLeft, ChevronRight,
  Calendar, ChevronDown, TrendingDown, TrendingUp, BarChart3, IndianRupee,
  RotateCw,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ReturnStatus =
  | 'Pending'
  | 'Pickup Scheduled'
  | 'In Transit'
  | 'Refund Processing'
  | 'Completed'
  | 'Received'
  | 'Rejected';

type ReasonTag = 'Defective' | 'Wrong Item' | 'Wrong Size' | 'Damaged' | 'Not as Described';

interface ReturnRow {
  id: string;
  orderId: string;
  initials: string;
  avatarBg: string;
  customer: string;
  seller: string;
  product: string;
  reason: ReasonTag;
  amount: string;
  status: ReturnStatus;
  date: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const TABS = [
  { label: 'All', count: 47 },
  { label: 'Pending Approval', count: 12 },
  { label: 'Pickup Scheduled', count: 8 },
  { label: 'In Transit', count: 3 },
  { label: 'Received', count: 5 },
  { label: 'Refund Processing', count: 15 },
  { label: 'Completed', count: 12 },
  { label: 'Rejected', count: 2 },
] as const;

const MOCK_RETURNS: ReturnRow[] = [
  { id: '#RTN-4701', orderId: '#HB-78234', initials: 'PM', avatarBg: 'from-blue-400 to-blue-600', customer: 'Priya Mehta', seller: 'Rajesh Store', product: 'Premium LED Panel 60W', reason: 'Defective', amount: '\u20B94,299', status: 'Pending', date: '28 Mar 2026' },
  { id: '#RTN-4698', orderId: '#HB-78102', initials: 'AK', avatarBg: 'from-emerald-400 to-emerald-600', customer: 'Amit Kumar', seller: 'TechWorld India', product: 'Wireless Earbuds Pro X', reason: 'Wrong Item', amount: '\u20B92,149', status: 'Pickup Scheduled', date: '27 Mar 2026' },
  { id: '#RTN-4695', orderId: '#HB-77998', initials: 'SG', avatarBg: 'from-pink-400 to-pink-600', customer: 'Sneha Gupta', seller: 'Priya Fashion Hub', product: 'Silk Saree - Banarasi', reason: 'Wrong Size', amount: '\u20B98,750', status: 'In Transit', date: '26 Mar 2026' },
  { id: '#RTN-4690', orderId: '#HB-77891', initials: 'RV', avatarBg: 'from-violet-400 to-violet-600', customer: 'Rahul Verma', seller: 'Krishna Home Decor', product: 'Ceramic Vase Set (3pc)', reason: 'Damaged', amount: '\u20B93,450', status: 'Refund Processing', date: '25 Mar 2026' },
  { id: '#RTN-4685', orderId: '#HB-77750', initials: 'DS', avatarBg: 'from-amber-400 to-amber-600', customer: 'Deepika Singh', seller: 'Mumbai Essentials', product: 'Stainless Steel Cooker 5L', reason: 'Not as Described', amount: '\u20B91,899', status: 'Completed', date: '24 Mar 2026' },
  { id: '#RTN-4702', orderId: '#HB-78310', initials: 'NK', avatarBg: 'from-teal-400 to-teal-600', customer: 'Neha Kapoor', seller: 'Priya Fashion Hub', product: 'Cotton Kurti - Floral Print', reason: 'Wrong Size', amount: '\u20B91,299', status: 'Pending', date: '28 Mar 2026' },
  { id: '#RTN-4688', orderId: '#HB-77820', initials: 'VP', avatarBg: 'from-rose-400 to-rose-600', customer: 'Vikram Patel', seller: 'TechWorld India', product: 'Smart Watch Ultra 2', reason: 'Defective', amount: '\u20B912,999', status: 'Received', date: '23 Mar 2026' },
  { id: '#RTN-4682', orderId: '#HB-77680', initials: 'MJ', avatarBg: 'from-gray-400 to-gray-600', customer: 'Meera Joshi', seller: 'Rajesh Store', product: 'Bluetooth Speaker Mini', reason: 'Not as Described', amount: '\u20B91,599', status: 'Rejected', date: '22 Mar 2026' },
];

const SELLER_OPTIONS = ['All Sellers', 'Rajesh Store', 'Krishna Home Decor', 'Priya Fashion Hub', 'TechWorld India', 'Mumbai Essentials'] as const;

const STATUS_OPTIONS = ['All Statuses', 'Pending Approval', 'Approved', 'Pickup Scheduled', 'In Transit', 'Received', 'Refund Processing', 'Completed', 'Rejected'] as const;

const TOP_REASONS = [
  { label: 'Defective Product', pct: 34, color: 'bg-red-400' },
  { label: 'Wrong Size', pct: 26, color: 'bg-blue-400' },
  { label: 'Not as Described', pct: 19, color: 'bg-amber-400' },
  { label: 'Wrong Item', pct: 13, color: 'bg-purple-400' },
  { label: 'Damaged in Transit', pct: 8, color: 'bg-orange-400' },
] as const;

const TOTAL_PAGES = 6;

/* ------------------------------------------------------------------ */
/*  Style maps                                                         */
/* ------------------------------------------------------------------ */

const STATUS_STYLES: Record<ReturnStatus, { text: string; bg: string; border: string; dot: string }> = {
  Pending:             { text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', dot: 'bg-yellow-500' },
  'Pickup Scheduled':  { text: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', dot: 'bg-purple-500' },
  'In Transit':        { text: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  'Refund Processing': { text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', dot: 'bg-orange-500' },
  Completed:           { text: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200',  dot: 'bg-green-500' },
  Received:            { text: 'text-cyan-700',   bg: 'bg-cyan-50',   border: 'border-cyan-200',   dot: 'bg-cyan-500' },
  Rejected:            { text: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200',     dot: 'bg-red-500' },
};

const REASON_STYLES: Record<ReasonTag, string> = {
  Defective:          'text-red-700 bg-red-50',
  'Wrong Item':       'text-amber-700 bg-amber-50',
  'Wrong Size':       'text-blue-700 bg-blue-50',
  Damaged:            'text-orange-700 bg-orange-50',
  'Not as Described': 'text-gray-700 bg-gray-100',
};

/* ------------------------------------------------------------------ */
/*  Mock hook                                                          */
/* ------------------------------------------------------------------ */

function useReturns() {
  return {
    data: MOCK_RETURNS,
    isLoading: false,
    isError: false,
    error: null,
  };
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ReturnStatusBadge({ status }: { status: ReturnStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span className={cn('inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border', s.bg, s.text, s.border)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />
      {status}
    </span>
  );
}

function ReasonBadge({ reason }: { reason: ReasonTag }) {
  return (
    <span className={cn('text-xs font-medium px-2 py-1 rounded-full', REASON_STYLES[reason])}>
      {reason}
    </span>
  );
}

function Avatar({ initials, bg }: { initials: string; bg: string }) {
  return (
    <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white', bg)}>
      {initials}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function ReturnsList() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError } = useReturns();

  /* ---------- Loading state ---------- */
  if (isLoading) {
    return (
      <div className="space-y-6" role="status" aria-label="Loading returns">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-56 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-4 w-96 animate-pulse rounded-lg bg-gray-200" />
          </div>
          <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
        </div>
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
        {/* Table skeleton */}
        <div className="h-12 animate-pulse rounded-t-xl bg-gray-200" />
        <div className="space-y-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  /* ---------- Error state ---------- */
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24" role="alert">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Failed to load returns</h2>
        <p className="max-w-sm text-center text-sm text-gray-500">
          Something went wrong while fetching return data. Please try refreshing the page or contact support if the issue persists.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-orange-600"
        >
          <RotateCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  /* ---------- Empty state ---------- */
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <RotateCcw className="h-8 w-8 text-gray-300" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">No return requests</h2>
        <p className="max-w-sm text-center text-sm text-gray-500">
          Return requests will appear here when customers initiate them.
        </p>
      </div>
    );
  }

  /* ---------- Success state ---------- */
  return (
    <section className="space-y-8" aria-label="Returns Management">

      {/* ===== Page Header ===== */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Returns &amp; Refunds</h1>
          <p className="mt-1 text-sm text-gray-500">Manage return requests, approve refunds, and track return logistics.</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">
          <Download className="h-4 w-4 text-gray-400" />
          Export
        </button>
      </header>

      {/* ===== 5 Stats Cards ===== */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {/* Total Returns */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
              <RotateCcw className="h-5 w-5 text-orange-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">47</p>
          <p className="mt-1 text-xs text-gray-500">Total Returns</p>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-orange-500" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Pending Approval */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <span className="rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-600">Needs Action</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">12</p>
          <p className="mt-1 text-xs text-gray-500">Pending Approval</p>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-yellow-400" style={{ width: '25%' }} />
          </div>
        </div>

        {/* Pickup Scheduled */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <Truck className="h-5 w-5 text-purple-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">8</p>
          <p className="mt-1 text-xs text-gray-500">Pickup Scheduled</p>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-purple-500" style={{ width: '17%' }} />
          </div>
        </div>

        {/* Refund Processing */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
              <Banknote className="h-5 w-5 text-orange-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">15</p>
          <p className="mt-1 text-xs text-gray-500">Refund Processing</p>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-orange-400" style={{ width: '32%' }} />
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">12</p>
          <p className="mt-1 text-xs text-gray-500">Completed</p>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-green-500" style={{ width: '25%' }} />
          </div>
        </div>
      </div>

      {/* ===== Filter Tabs + Search + Filters ===== */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Tabs */}
        <div className="scrollbar-hide overflow-x-auto border-b border-gray-100 px-6">
          <nav className="flex min-w-max gap-0" aria-label="Return status filter">
            {TABS.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                aria-pressed={activeTab === i}
                className={cn(
                  'whitespace-nowrap border-b-2 px-4 py-3.5 text-sm font-medium transition',
                  activeTab === i
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700',
                )}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 p-4">
          {/* Search */}
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by return ID, order ID, customer name..."
              aria-label="Search returns"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Mar 1 - Mar 28, 2026</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </div>

          {/* Seller Filter */}
          <select
            aria-label="Filter by seller"
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          >
            {SELLER_OPTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            aria-label="Filter by status"
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== Returns Table ===== */}
      <div className="mb-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Returns table">
            <thead>
              <tr className="bg-gray-50/80">
                <th scope="col" className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Return ID</th>
                <th scope="col" className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Order ID</th>
                <th scope="col" className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Customer</th>
                <th scope="col" className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Seller</th>
                <th scope="col" className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Product</th>
                <th scope="col" className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Reason</th>
                <th scope="col" className="px-3 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500">Refund Amt</th>
                <th scope="col" className="px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th scope="col" className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Date</th>
                <th scope="col" className="px-6 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((r) => (
                <tr key={r.id} className="transition-colors hover:bg-orange-50/40">
                  {/* Return ID */}
                  <td className="px-6 py-3.5">
                    <span className="text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer">
                      {r.id}
                    </span>
                  </td>

                  {/* Order ID */}
                  <td className="px-3 py-3.5 text-sm text-gray-700">{r.orderId}</td>

                  {/* Customer */}
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={r.initials} bg={r.avatarBg} />
                      <span className="text-sm font-medium text-gray-800">{r.customer}</span>
                    </div>
                  </td>

                  {/* Seller */}
                  <td className="px-3 py-3.5 text-sm text-gray-600">{r.seller}</td>

                  {/* Product */}
                  <td className="max-w-[140px] truncate px-3 py-3.5 text-sm text-gray-700" title={r.product}>
                    {r.product}
                  </td>

                  {/* Reason */}
                  <td className="px-3 py-3.5">
                    <ReasonBadge reason={r.reason} />
                  </td>

                  {/* Refund Amt */}
                  <td className="px-3 py-3.5 text-right text-sm font-semibold text-gray-800">{r.amount}</td>

                  {/* Status */}
                  <td className="px-3 py-3.5 text-center">
                    <ReturnStatusBadge status={r.status} />
                  </td>

                  {/* Date */}
                  <td className="px-3 py-3.5 text-sm text-gray-500">{r.date}</td>

                  {/* Actions */}
                  <td className="px-6 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {r.status === 'Pending' && (
                        <>
                          <button
                            className="rounded-lg p-1.5 text-green-600 transition hover:bg-green-50"
                            title="Approve"
                            aria-label={`Approve return ${r.id}`}
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-50"
                            title="Reject"
                            aria-label={`Reject return ${r.id}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100"
                        title="View Details"
                        aria-label={`View details for ${r.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100"
                        title="More actions"
                        aria-label={`More options for ${r.id}`}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Refund Summary + Top Return Reasons ===== */}
      <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Refund Summary Card */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">Refund Summary</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Total Refunded */}
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <IndianRupee className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{'\u20B9'}1,84,520</p>
              <p className="mt-1 text-xs text-gray-500">Total Refunded This Month</p>
              <div className="mt-3 flex items-center gap-1.5">
                <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                <span className="text-xs font-medium text-red-500">+12.3% vs last month</span>
              </div>
            </div>

            {/* Average Refund Time */}
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">3.2 days</p>
              <p className="mt-1 text-xs text-gray-500">Average Refund Time</p>
              <div className="mt-3 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                <span className="text-xs font-medium text-green-500">-0.5 days improvement</span>
              </div>
            </div>

            {/* Return Rate */}
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <BarChart3 className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">3.8%</p>
              <p className="mt-1 text-xs text-gray-500">Return Rate</p>
              <div className="mt-3 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                <span className="text-xs font-medium text-green-500">-0.2% vs last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Return Reasons */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">Top Return Reasons</h2>
          <div className="space-y-4">
            {TOP_REASONS.map((r) => (
              <div key={r.label}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm text-gray-700">{r.label}</span>
                  <span className="text-sm font-semibold text-gray-800">{r.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className={cn('h-full rounded-full', r.color)} style={{ width: `${r.pct}%` }} />
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
            Showing <span className="font-medium text-gray-700">1 - 8</span> of{' '}
            <span className="font-medium text-gray-700">47</span> returns
          </p>
          <div className="flex items-center gap-1.5">
            {/* Previous */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:bg-gray-50 disabled:opacity-50"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page numbers */}
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
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              );
            })}

            {/* Next */}
            <button
              disabled={currentPage === TOTAL_PAGES}
              onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

    </section>
  );
}
