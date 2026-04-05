'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Store, CheckCircle, Clock, Ban, UserX,
  Search, Download, Plus, MoreVertical,
  Filter, Mail, AlertTriangle, Inbox, ChevronDown,
  ChevronLeft, ChevronRight, Star, ArrowUpRight,
  CircleDollarSign, Eye, X, Check,
} from 'lucide-react';
import {
  cn,
  Skeleton,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from '@homebase/ui';

import { useSupplierStats, useSupplierList } from '../hooks/use-supplier';
import type { SupplierListFilters } from '../hooks/use-supplier';
import { mockSupplierTabs, mockSupplierSecondaryStats } from '../services/mock-data';
import type { SupplierStatus, ComplianceStatus, Supplier } from '../services/mock-data';

// ----------------------------------------------------------------
// Constants (i18n-ready)
// ----------------------------------------------------------------

const TEXT = {
  pageTitle: 'Seller Management',
  pageSubtitle: 'Monitor, approve, and manage marketplace sellers',
  export: 'Export',
  inviteSeller: 'Invite Seller',
  searchPlaceholder: 'Search sellers...',
  filters: 'Filters',
  clearAll: 'Clear All',
  applyFilters: 'Apply Filters',
  related: 'Related:',
  onboarding: 'Onboarding',
  sellerSla: 'Seller SLA',
  payoutCalendar: 'Payout Calendar',
  // Row 1 stats
  statTotalSellers: 'Total Sellers',
  statActive: 'Active',
  statPendingApproval: 'Pending Approval',
  statSuspended: 'Suspended',
  statInactive: 'Inactive',
  // Row 2 stats
  statTotalGmv: 'Total GMV',
  statAvgRating: 'Avg Rating',
  statComplianceIssues: 'Compliance Issues',
  statPendingPayouts: 'Pending Payouts',
  // Table columns
  colSeller: 'Seller',
  colStoreName: 'Store Name',
  colHealthScore: 'Health Score',
  colProducts: 'Products',
  colOrders: 'Orders',
  colRevenue: 'Revenue',
  colRating: 'Rating',
  colFulfillment: 'Fulfillment %',
  colDisputes: 'Disputes',
  colCompliance: 'Compliance',
  colStatus: 'Status',
  colJoined: 'Joined',
  colActions: 'Actions',
  // Actions
  viewDetails: 'View Details',
  suspendSeller: 'Suspend Seller',
  sendNotice: 'Send Notice',
  viewPayouts: 'View Payouts',
  viewDisputes: 'View Disputes',
  approveSeller: 'Approve Seller',
  reactivateSeller: 'Reactivate Seller',
  // Bulk actions
  bulkSelected: 'seller(s) selected',
  bulkApprove: 'Approve Selected',
  bulkSuspend: 'Suspend Selected',
  bulkSendNotice: 'Send Notice',
  bulkExport: 'Export',
  clearSelection: 'Clear Selection',
  // States
  emptyTitle: 'No sellers found',
  emptySubtitle: 'Try adjusting your search or filter criteria.',
  errorTitle: 'Failed to load sellers',
  retry: 'Retry',
  // Pagination
  showing: 'Showing',
  of: 'of',
  sellers: 'sellers',
  tableLabel: 'Sellers list',
  // Advanced filters
  labelCategory: 'Category',
  labelRatingRange: 'Rating Range',
  labelRevenueRange: 'Revenue Range',
  labelPayoutStatus: 'Payout Status',
  labelComplianceStatus: 'Compliance Status',
  labelOnboardingDate: 'Onboarding Date',
  na: '--',
} as const;

const STATUS_STYLES: Record<SupplierStatus, { bg: string; text: string; dot: string; border: string }> = {
  Active:    { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500',  border: 'border-green-200' },
  Pending:   { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500',  border: 'border-amber-200' },
  Suspended: { bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500',    border: 'border-red-200' },
  Inactive:  { bg: 'bg-gray-50',   text: 'text-gray-700',   dot: 'bg-gray-400',   border: 'border-gray-200' },
};

const COMPLIANCE_STYLES: Record<ComplianceStatus, { bg: string; text: string; border: string; label: string }> = {
  ok:        { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'OK' },
  warning:   { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Warning' },
  violation: { bg: 'bg-red-50',   text: 'text-red-700',   border: 'border-red-200',   label: 'Violation' },
  review:    { bg: 'bg-blue-50',  text: 'text-blue-700',  border: 'border-blue-200',  label: 'Review' },
};

const PAGE_SIZE = 10;
const DEBOUNCE_MS = 300;

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function getHealthScoreColor(score: number): string {
  if (score >= 700) return 'text-green-600';
  if (score >= 500) return 'text-amber-600';
  return 'text-red-600';
}

function getHealthBarColor(score: number): string {
  if (score >= 700) return 'bg-green-500';
  if (score >= 500) return 'bg-amber-500';
  return 'bg-red-500';
}

function getFulfillmentColor(pct: number): string {
  if (pct >= 90) return 'text-green-600';
  if (pct >= 75) return 'text-amber-600';
  return 'text-red-600';
}

function buildPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | 'ellipsis')[] = [];
  if (current <= 3) {
    pages.push(1, 2, 3, 'ellipsis', total);
  } else if (current >= total - 2) {
    pages.push(1, 'ellipsis', total - 2, total - 1, total);
  } else {
    pages.push(1, 'ellipsis', current, 'ellipsis', total);
  }
  return pages;
}

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export function SupplierList() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const filters: SupplierListFilters = {
    search: debouncedSearch,
    status: mockSupplierTabs[activeTab]?.key ?? 'all',
    page,
    pageSize: PAGE_SIZE,
  };

  const statsQuery = useSupplierStats();
  const listQuery = useSupplierList(filters);

  const handleTabChange = useCallback((index: number) => {
    setActiveTab(index);
    setPage(1);
    setSelectedIds(new Set());
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchInput('');
    setDebouncedSearch('');
    setActiveTab(0);
    setPage(1);
    setSelectedIds(new Set());
  }, []);

  const toggleSelectAll = useCallback((checked: boolean, suppliers: Supplier[]) => {
    if (checked) {
      setSelectedIds(new Set(suppliers.map((s) => s.id)));
    } else {
      setSelectedIds(new Set());
    }
  }, []);

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const secondaryStats = mockSupplierSecondaryStats;

  // ------ LOADING STATE ------
  if (statsQuery.isLoading || listQuery.isLoading) {
    return <SupplierListSkeleton />;
  }

  // ------ ERROR STATE ------
  if (statsQuery.isError || listQuery.isError) {
    return (
      <section className="flex flex-col items-center justify-center py-32">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-gray-900">{TEXT.errorTitle}</h2>
        <p className="mt-1 text-sm text-gray-500">{(statsQuery.error ?? listQuery.error)?.message}</p>
        <button
          onClick={() => { statsQuery.refetch(); listQuery.refetch(); }}
          className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          {TEXT.retry}
        </button>
      </section>
    );
  }

  const stats = statsQuery.data;
  const { suppliers, total, totalPages } = listQuery.data ?? { suppliers: [], total: 0, totalPages: 0 };
  const isEmpty = suppliers.length === 0;
  const allSelected = suppliers.length > 0 && selectedIds.size === suppliers.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < suppliers.length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{TEXT.pageTitle}</h1>
          <p className="mt-1 text-sm text-gray-500">{TEXT.pageSubtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            <Download className="h-4 w-4" /> {TEXT.export}
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-orange-600">
            <Plus className="h-4 w-4" /> {TEXT.inviteSeller}
          </button>
        </div>
      </div>

      {/* Related pills */}
      <nav className="flex items-center gap-2" aria-label="Related pages">
        <span className="text-xs text-gray-400">{TEXT.related}</span>
        <Link href="/suppliers/onboarding" className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-500 transition hover:bg-orange-100">{TEXT.onboarding}</Link>
        <Link href="/suppliers/sla" className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-500 transition hover:bg-orange-100">{TEXT.sellerSla}</Link>
        <Link href="/suppliers/payout-calendar" className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-500 transition hover:bg-orange-100">{TEXT.payoutCalendar}</Link>
      </nav>

      {/* ===== STATS ROW 1 (5 cards) ===== */}
      {stats && (
        <section className="grid grid-cols-5 gap-5" aria-label="Seller statistics">
          {/* Total Sellers */}
          <div className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{TEXT.statTotalSellers}</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
                <Store className="h-5 w-5 text-orange-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalSellers.value}</p>
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              +{stats.totalSellers.trend}% this month
            </p>
          </div>
          {/* Active */}
          <div className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{TEXT.statActive}</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.active.value}</p>
            <p className="mt-1 text-xs text-gray-400">{stats.active.subtitle}</p>
          </div>
          {/* Pending Approval */}
          <div className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{TEXT.statPendingApproval}</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.pendingApproval.value}</p>
            <p className="mt-1 text-xs font-medium text-amber-500">{stats.pendingApproval.subtitle}</p>
          </div>
          {/* Suspended */}
          <div className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{TEXT.statSuspended}</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
                <Ban className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.suspended.value}</p>
            <p className="mt-1 text-xs font-medium text-red-600">{stats.suspended.subtitle}</p>
          </div>
          {/* Inactive */}
          <div className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{TEXT.statInactive}</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                <UserX className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.inactive.value}</p>
            <p className="mt-1 text-xs text-gray-400">{stats.inactive.subtitle}</p>
          </div>
        </section>
      )}

      {/* ===== STATS ROW 2 (4 cards) ===== */}
      <section className="grid grid-cols-4 gap-5" aria-label="Financial statistics">
        {/* Total GMV */}
        <div className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{TEXT.statTotalGmv}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
              <CircleDollarSign className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{secondaryStats.totalGmv.value}</p>
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-green-600">
            <ArrowUpRight className="h-3 w-3" />
            {secondaryStats.totalGmv.trend}
          </p>
        </div>
        {/* Avg Rating */}
        <div className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{TEXT.statAvgRating}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
              <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{secondaryStats.avgRating.value}</p>
          <p className="mt-1 text-xs text-gray-400">{secondaryStats.avgRating.subtitle}</p>
        </div>
        {/* Compliance Issues */}
        <div className="group rounded-xl border border-red-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{TEXT.statComplianceIssues}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600">{secondaryStats.complianceIssues.value}</p>
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
            <AlertTriangle className="h-3 w-3" />
            {secondaryStats.complianceIssues.subtitle}
          </p>
        </div>
        {/* Pending Payouts */}
        <div className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{TEXT.statPendingPayouts}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
              <CircleDollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{secondaryStats.pendingPayouts.value}</p>
          <p className="mt-1 text-xs font-medium text-blue-600">{secondaryStats.pendingPayouts.subtitle}</p>
        </div>
      </section>

      {/* ===== TABLE CARD ===== */}
      <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Tabs + search */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6">
          <nav className="flex items-center gap-0" role="tablist" aria-label="Seller status filter">
            {mockSupplierTabs.map((tab, i) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === i}
                onClick={() => handleTabChange(i)}
                className={cn(
                  '-mb-px border-b-2 px-4 py-4 text-sm font-medium transition',
                  activeTab === i
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700',
                )}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
                placeholder={TEXT.searchPlaceholder}
                className="w-56 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                aria-label="Search sellers"
              />
            </div>
            <button
              onClick={() => setShowAdvancedFilters((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              {TEXT.filters}
              <ChevronDown className={cn('h-3 w-3 transition', showAdvancedFilters && 'rotate-180')} />
            </button>
          </div>
        </div>

        {/* ===== ADVANCED FILTERS PANEL ===== */}
        <div
          className={cn(
            'overflow-hidden border-b border-gray-100 transition-all duration-300',
            showAdvancedFilters ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0',
          )}
        >
          <div className="px-6 py-5">
            <div className="mb-4 grid grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.labelCategory}</label>
                <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100">
                  <option value="">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home & Living">Home &amp; Living</option>
                  <option value="Sports & Outdoors">Sports &amp; Outdoors</option>
                  <option value="Beauty & Health">Beauty &amp; Health</option>
                  <option value="Grocery & Gourmet">Grocery &amp; Gourmet</option>
                  <option value="Books & Stationery">Books &amp; Stationery</option>
                  <option value="Toys & Games">Toys &amp; Games</option>
                </select>
              </div>
              {/* Rating Range */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.labelRatingRange}</label>
                <div className="flex items-center gap-2">
                  <select className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100">
                    <option value="">Min</option>
                    <option value="1">1.0+</option>
                    <option value="2">2.0+</option>
                    <option value="3">3.0+</option>
                    <option value="4">4.0+</option>
                    <option value="4.5">4.5+</option>
                  </select>
                  <span className="text-xs text-gray-400">to</span>
                  <select className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100">
                    <option value="">Max</option>
                    <option value="2">2.0</option>
                    <option value="3">3.0</option>
                    <option value="4">4.0</option>
                    <option value="4.5">4.5</option>
                    <option value="5">5.0</option>
                  </select>
                </div>
              </div>
              {/* Revenue Range */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.labelRevenueRange}</label>
                <div className="flex items-center gap-2">
                  <select className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100">
                    <option value="">Min</option>
                    <option value="0">{'\u20B9'}0</option>
                    <option value="50000">{'\u20B9'}50K</option>
                    <option value="100000">{'\u20B9'}1L</option>
                    <option value="500000">{'\u20B9'}5L</option>
                    <option value="1000000">{'\u20B9'}10L</option>
                  </select>
                  <span className="text-xs text-gray-400">to</span>
                  <select className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100">
                    <option value="">Max</option>
                    <option value="100000">{'\u20B9'}1L</option>
                    <option value="500000">{'\u20B9'}5L</option>
                    <option value="1000000">{'\u20B9'}10L</option>
                    <option value="5000000">{'\u20B9'}50L</option>
                    <option value="10000000">{'\u20B9'}1Cr+</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {/* Payout Status */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.labelPayoutStatus}</label>
                <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100">
                  <option value="">All</option>
                  <option value="up-to-date">Up to Date</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
              {/* Compliance Status */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.labelComplianceStatus}</label>
                <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100">
                  <option value="">All</option>
                  <option value="compliant">Compliant</option>
                  <option value="warning">Warning</option>
                  <option value="violation">Violation</option>
                  <option value="review">Under Review</option>
                </select>
              </div>
              {/* Onboarding Date */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.labelOnboardingDate}</label>
                <div className="flex items-center gap-2">
                  <input type="date" className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
                  <span className="text-xs text-gray-400">to</span>
                  <input type="date" className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-3 border-t border-gray-50 pt-4">
              <button className="text-sm font-medium text-gray-500 transition hover:text-gray-700">{TEXT.clearAll}</button>
              <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600">{TEXT.applyFilters}</button>
            </div>
          </div>
        </div>

        {/* ===== BULK ACTIONS TOOLBAR ===== */}
        <div
          className={cn(
            'overflow-hidden border-b border-gray-100 bg-orange-50 transition-all duration-250',
            selectedIds.size > 0 ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0',
          )}
        >
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-orange-700">
                {selectedIds.size} {TEXT.bulkSelected}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-green-700">
                <CheckCircle className="h-3.5 w-3.5" />
                {TEXT.bulkApprove}
              </button>
              <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700">
                <Ban className="h-3.5 w-3.5" />
                {TEXT.bulkSuspend}
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50">
                <Mail className="h-3.5 w-3.5" />
                {TEXT.bulkSendNotice}
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50">
                <Download className="h-3.5 w-3.5" />
                {TEXT.bulkExport}
              </button>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="ml-2 text-xs font-medium text-gray-500 underline transition hover:text-gray-700"
              >
                {TEXT.clearSelection}
              </button>
            </div>
          </div>
        </div>

        {/* Table or Empty */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Inbox className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-base font-semibold text-gray-900">{TEXT.emptyTitle}</h3>
            <p className="mt-1 text-sm text-gray-500">{TEXT.emptySubtitle}</p>
            <button
              onClick={handleClearFilters}
              className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
            >
              {TEXT.retry}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" aria-label={TEXT.tableLabel}>
              <thead>
                <tr className="border-b border-gray-100">
                  <th scope="col" className="px-6 py-3.5 text-left">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(el) => { if (el) el.indeterminate = someSelected; }}
                      onChange={(e) => toggleSelectAll(e.target.checked, suppliers)}
                      className="cursor-pointer rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                      aria-label="Select all sellers"
                    />
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colSeller}</th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colStoreName}</th>
                  <th scope="col" className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colHealthScore}</th>
                  <th scope="col" className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colProducts}</th>
                  <th scope="col" className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colOrders}</th>
                  <th scope="col" className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colRevenue}</th>
                  <th scope="col" className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colRating}</th>
                  <th scope="col" className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colFulfillment}</th>
                  <th scope="col" className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colDisputes}</th>
                  <th scope="col" className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colCompliance}</th>
                  <th scope="col" className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colStatus}</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colJoined}</th>
                  <th scope="col" className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {suppliers.map((s) => {
                  const isRiskRow = s.status === 'Suspended';
                  const statusStyle = STATUS_STYLES[s.status];
                  const complianceStyle = COMPLIANCE_STYLES[s.compliance];

                  return (
                    <tr
                      key={s.id}
                      className={cn(
                        'transition-colors',
                        isRiskRow
                          ? 'bg-red-50/60 hover:bg-red-100/60'
                          : 'hover:bg-orange-50/40',
                      )}
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter') window.location.href = `/suppliers/${s.id}`; }}
                    >
                      {/* Checkbox */}
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(s.id)}
                          onChange={() => toggleSelect(s.id)}
                          className="cursor-pointer rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                          aria-label={`Select ${s.name}`}
                        />
                      </td>
                      {/* Seller */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white', s.gradient)}>
                            {s.initials}
                          </div>
                          <div>
                            <Link
                              href={`/suppliers/${s.id}`}
                              className="text-sm font-semibold text-orange-600 transition hover:text-orange-700 hover:underline"
                            >
                              {s.name}
                            </Link>
                            <p className="text-xs text-gray-400">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      {/* Store Name */}
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">{s.store}</td>
                      {/* Health Score */}
                      <td className="px-4 py-4 text-center">
                        {s.healthScore > 0 ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className={cn('text-sm font-bold', getHealthScoreColor(s.healthScore))}>{s.healthScore}</span>
                            <div className="h-1.5 w-14 overflow-hidden rounded-full bg-gray-200">
                              <div
                                className={cn('h-full rounded-full', getHealthBarColor(s.healthScore))}
                                style={{ width: `${s.healthScore / 10}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">{TEXT.na}</span>
                        )}
                      </td>
                      {/* Products */}
                      <td className="px-4 py-4 text-center text-sm text-gray-600">{s.products}</td>
                      {/* Orders */}
                      <td className="px-4 py-4 text-center text-sm text-gray-600">{s.orders}</td>
                      {/* Revenue */}
                      <td className="px-4 py-4 text-right text-sm font-semibold text-gray-900">{s.revenue}</td>
                      {/* Rating */}
                      <td className="px-4 py-4 text-center">
                        {s.rating > 0 ? (
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-medium text-gray-700">{s.rating}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">{TEXT.na}</span>
                        )}
                      </td>
                      {/* Fulfillment % */}
                      <td className="px-4 py-4 text-center">
                        {s.fulfillmentPct > 0 ? (
                          <span className={cn('text-sm font-semibold', getFulfillmentColor(s.fulfillmentPct))}>
                            {s.fulfillmentPct}%
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">{TEXT.na}</span>
                        )}
                      </td>
                      {/* Disputes */}
                      <td className="px-4 py-4 text-center">
                        {s.disputes >= 10 ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                            {s.disputes}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-600">{s.disputes}</span>
                        )}
                      </td>
                      {/* Compliance */}
                      <td className="px-4 py-4 text-center">
                        <span className={cn(
                          'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold',
                          complianceStyle.bg,
                          complianceStyle.text,
                          complianceStyle.border,
                        )}>
                          <ComplianceIcon compliance={s.compliance} />
                          {complianceStyle.label}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-4 text-center">
                        <span className={cn(
                          'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold',
                          statusStyle.bg,
                          statusStyle.text,
                          statusStyle.border,
                        )}>
                          <span className={cn('h-1.5 w-1.5 rounded-full', statusStyle.dot)} />
                          {s.status}
                        </span>
                      </td>
                      {/* Joined */}
                      <td className="px-4 py-4 text-sm text-gray-500">{s.joined}</td>
                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <RowActions seller={s} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ===== PAGINATION ===== */}
        {!isEmpty && (
          <PaginationBar
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
          />
        )}
      </section>
    </div>
  );
}

// ----------------------------------------------------------------
// Compliance Icon sub-component
// ----------------------------------------------------------------

function ComplianceIcon({ compliance }: { compliance: ComplianceStatus }) {
  switch (compliance) {
    case 'ok':
      return <Check className="h-3 w-3" />;
    case 'warning':
      return <AlertTriangle className="h-3 w-3" />;
    case 'violation':
      return <X className="h-3 w-3" />;
    case 'review':
      return <Clock className="h-3 w-3" />;
  }
}

// ----------------------------------------------------------------
// Row Actions (dropdown per row, context-specific)
// ----------------------------------------------------------------

function RowActions({ seller }: { seller: Supplier }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600" title="More actions">
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href={`/suppliers/${seller.id}`}>
            <Eye className="mr-2 h-4 w-4 text-gray-400" /> {TEXT.viewDetails}
          </Link>
        </DropdownMenuItem>

        {/* Active sellers: Suspend + Send Notice */}
        {seller.status === 'Active' && (
          <>
            <DropdownMenuItem>
              <Ban className="mr-2 h-4 w-4 text-gray-400" /> {TEXT.suspendSeller}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4 text-gray-400" /> {TEXT.sendNotice}
            </DropdownMenuItem>
          </>
        )}

        {/* Pending sellers: Approve + Send Notice */}
        {seller.status === 'Pending' && (
          <>
            <DropdownMenuItem className="text-green-700 focus:text-green-700">
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> {TEXT.approveSeller}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4 text-gray-400" /> {TEXT.sendNotice}
            </DropdownMenuItem>
          </>
        )}

        {/* Suspended sellers: Reactivate + Send Notice */}
        {seller.status === 'Suspended' && (
          <>
            <DropdownMenuItem className="text-green-700 focus:text-green-700">
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> {TEXT.reactivateSeller}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4 text-gray-400" /> {TEXT.sendNotice}
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <CircleDollarSign className="mr-2 h-4 w-4 text-gray-400" /> {TEXT.viewPayouts}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <AlertTriangle className="mr-2 h-4 w-4 text-gray-400" /> {TEXT.viewDisputes}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ----------------------------------------------------------------
// Pagination Bar
// ----------------------------------------------------------------

function PaginationBar({
  page,
  totalPages,
  total,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (p: number) => void;
}) {
  const pageNumbers = useMemo(() => buildPageNumbers(page, totalPages), [page, totalPages]);

  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">{TEXT.showing}</span>
        <select className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-orange-400">
          <option>10</option>
          <option>25</option>
          <option>50</option>
          <option>100</option>
        </select>
        <span className="text-sm text-gray-500">
          {TEXT.of} <span className="font-medium text-gray-700">{total.toLocaleString()}</span> {TEXT.sellers}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-400 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pageNumbers.map((p, idx) =>
          p === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-sm text-gray-400">...</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition',
                page === p
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100',
              )}
            >
              {p}
            </button>
          ),
        )}
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Loading skeleton
// ----------------------------------------------------------------

function SupplierListSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-52" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      {/* Related pills */}
      <Skeleton className="h-6 w-56" />
      {/* Stats row 1 */}
      <div className="grid grid-cols-5 gap-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={`s1-${i}`} className="h-[120px] rounded-xl" />
        ))}
      </div>
      {/* Stats row 2 */}
      <div className="grid grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={`s2-${i}`} className="h-[120px] rounded-xl" />
        ))}
      </div>
      {/* Table */}
      <Skeleton className="h-[600px] rounded-xl" />
    </div>
  );
}
