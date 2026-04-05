'use client';

import { useCallback, useState } from 'react';
import {
  Ticket,
  AlertTriangle,
  BarChart3,
  DollarSign,
  Plus,
  Layers,
  Copy,
  RefreshCw,
  AlertCircle,
  Inbox,
} from 'lucide-react';
import { cn, Skeleton } from '@homebase/ui';

import { useCouponStats, useCouponList } from '../hooks/use-coupons';
import {
  mockCouponTabs,
  mockTopCoupons,
  mockExpiringSoon,
  mockStackingRules,
  mockCouponCards,
} from '../services/coupon-mock';
import type { CouponMgmtStatus } from '../types';

// ----------------------------------------------------------------
// Constants (i18n-ready)
// ----------------------------------------------------------------

const TEXT = {
  pageTitle: 'Platform Coupons',
  pageDescription: 'Manage platform-level discount coupons and promotional codes',
  createCoupon: 'Create Coupon',
  statActive: 'Active Coupons',
  statExpiring: 'Expiring This Week',
  statRedemptions: 'Total Redemptions',
  statRevenue: 'Revenue Impact',
  topPerforming: 'Top Performing Coupons',
  topSubtitle: 'Usage vs Limit',
  expiringTitle: 'Expiring This Week',
  stackingTitle: 'Coupon Stacking Rules',
  stackingRule: 'Rule: Only one discount-type coupon per order. Shipping coupons can stack with any discount coupon.',
  allCoupons: 'All Coupons',
  colCode: 'Code',
  colType: 'Type',
  colDiscount: 'Discount',
  colMinOrder: 'Min Order',
  colUsage: 'Usage / Limit',
  colStatus: 'Status',
  colExpires: 'Expires',
  colActions: 'Actions',
  showing: 'Showing 8 of 24 coupons',
  extend: 'Extend',
  deactivate: 'Deactivate',
  edit: 'Edit',
  disable: 'Disable',
  enable: 'Enable',
  clone: 'Clone',
  copy: 'Copy',
  empty: 'No coupons found',
  errorTitle: 'Failed to load coupons',
  errorDescription: 'Please check your connection and try again.',
  retry: 'Retry',
  emptyTitle: 'No coupon data available',
  emptyDescription: 'Data will appear here once available.',
} as const;

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function statusBadge(status: CouponMgmtStatus) {
  switch (status) {
    case 'Active':
      return { bg: 'bg-green-50', text: 'text-green-600' };
    case 'Expired':
      return { bg: 'bg-gray-100', text: 'text-gray-500' };
    case 'Disabled':
      return { bg: 'bg-red-50', text: 'text-red-600' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-500' };
  }
}

// ----------------------------------------------------------------
// Sub-components: Loading / Error / Empty
// ----------------------------------------------------------------

function CouponSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300" role="status" aria-label="Loading coupons">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="mt-1 h-3 w-24" />
          </div>
        ))}
      </div>
      <Skeleton className="h-[400px] w-full rounded-xl" />
      <span className="sr-only">Loading coupon data...</span>
    </div>
  );
}

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <section
      className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-12"
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="mb-4 h-12 w-12 text-red-400" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-gray-900">{message}</h2>
      <p className="mt-1 text-sm text-gray-500">{TEXT.errorDescription}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        {TEXT.retry}
      </button>
    </section>
  );
}

function EmptyState() {
  return (
    <section className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-12">
      <Inbox className="mb-4 h-12 w-12 text-gray-300" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-gray-900">{TEXT.emptyTitle}</h2>
      <p className="mt-1 text-sm text-gray-500">{TEXT.emptyDescription}</p>
    </section>
  );
}

// ----------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------

export function CouponList() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = mockCouponTabs;
  const topCoupons = mockTopCoupons;
  const expiringSoon = mockExpiringSoon;
  const stackingRules = mockStackingRules;
  const couponCards = mockCouponCards;

  const statsQuery = useCouponStats();
  const listQuery = useCouponList(tabs[activeTab]?.label);

  const handleRetry = useCallback(() => {
    statsQuery.refetch();
    listQuery.refetch();
  }, [statsQuery, listQuery]);

  // ---- Loading ----
  if (statsQuery.isLoading && listQuery.isLoading) return <CouponSkeleton />;

  // ---- Error ----
  if (statsQuery.isError && listQuery.isError) {
    return <ErrorBanner message={TEXT.errorTitle} onRetry={handleRetry} />;
  }

  // ---- Empty ----
  if (!statsQuery.data && !listQuery.data) return <EmptyState />;

  const stats = statsQuery.data;
  const coupons = listQuery.data ?? [];

  return (
    <div className="space-y-8">
      {/* ================================================================
          Page Header
          ================================================================ */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{TEXT.pageTitle}</h1>
          <p className="mt-1 text-sm text-gray-500">{TEXT.pageDescription}</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
          aria-label={TEXT.createCoupon}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {TEXT.createCoupon}
        </button>
      </div>

      {/* ================================================================
          Stats Cards
          ================================================================ */}
      <section aria-label="Coupon statistics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Active Coupons */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.statActive}</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
                <Ticket className="h-5 w-5 text-green-500" aria-hidden="true" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.activeCoupons ?? '--'}</p>
            <p className="mt-1 text-xs font-medium text-green-600">{stats?.activeTrend ?? ''}</p>
          </div>

          {/* Expiring This Week */}
          <div
            className="rounded-xl border border-amber-200 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
            style={{ background: 'linear-gradient(135deg, #FFFBEB 0%, #FFF 50%)' }}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">{TEXT.statExpiring}</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden="true" />
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-700">{stats?.expiringThisWeek ?? '--'}</p>
            <p className="mt-1 text-xs font-medium text-amber-600">{stats?.expiringLabel ?? ''}</p>
          </div>

          {/* Total Redemptions */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.statRedemptions}</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                <BarChart3 className="h-5 w-5 text-blue-500" aria-hidden="true" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats ? stats.totalRedemptions.toLocaleString('en-IN') : '--'}
            </p>
            <p className="mt-1 text-xs font-medium text-green-600">{stats?.redemptionsTrend ?? ''}</p>
          </div>

          {/* Revenue Impact */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.statRevenue}</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
                <DollarSign className="h-5 w-5 text-orange-500" aria-hidden="true" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.revenueImpact ?? '--'}</p>
            <p className="mt-1 text-xs font-medium text-gray-400">{stats?.revenueLabel ?? ''}</p>
          </div>
        </div>
      </section>

      {/* ================================================================
          Top Performing + Expiring Soon (side by side)
          ================================================================ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Performing Coupons */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">{TEXT.topPerforming}</h2>
            <span className="text-xs font-medium text-gray-400">{TEXT.topSubtitle}</span>
          </div>
          <div className="space-y-5 p-6">
            {topCoupons.map((coupon) => (
              <div key={coupon.code}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-orange-600">{coupon.code}</span>
                    <span className="text-xs text-gray-400">{coupon.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {coupon.used.toLocaleString('en-IN')} / {coupon.limit.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-100">
                  <div
                    className={cn('h-2.5 rounded-full transition-all duration-300', coupon.barColor)}
                    style={{ width: `${coupon.percent}%` }}
                    role="progressbar"
                    aria-valuenow={coupon.percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${coupon.percent}% used`}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-gray-400">{coupon.percent}% used</span>
                  <span className="text-xs font-medium text-green-600">{coupon.saved} saved</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="rounded-xl border border-amber-200 bg-white shadow-sm">
          <div
            className="flex items-center justify-between border-b border-amber-100 px-6 py-4"
            style={{ background: 'linear-gradient(135deg, #FFFBEB 0%, #FFF 100%)' }}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden="true" />
              <h2 className="text-base font-semibold text-amber-900">{TEXT.expiringTitle}</h2>
            </div>
            <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
              {expiringSoon.length} coupons
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {expiringSoon.map((item) => (
              <div key={item.code} className="flex items-center justify-between px-6 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-orange-600">{item.code}</span>
                    <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-semibold', item.urgencyColor)}>
                      {item.urgency}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-400">{item.detail}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-orange-200 px-3 py-1.5 text-xs font-medium text-orange-500 transition hover:bg-orange-50 hover:text-orange-600"
                  >
                    {TEXT.extend}
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600"
                  >
                    {TEXT.deactivate}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================================
          Coupon Stacking Rules Hint
          ================================================================ */}
      <div className="flex items-start gap-3 rounded-xl border border-purple-100 bg-purple-50 p-4">
        <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100">
          <Layers className="h-4 w-4 text-purple-600" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-purple-900">{TEXT.stackingTitle}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
            {stackingRules.map((rule) => (
              <div key={rule.pair} className="flex items-center gap-1.5">
                <span className={cn('h-2 w-2 rounded-full', rule.allowed ? 'bg-green-500' : 'bg-red-500')} />
                <span className="text-xs text-purple-700">
                  <span className="font-semibold">{rule.pair}</span>: {rule.reason}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-purple-500">{TEXT.stackingRule}</p>
        </div>
      </div>

      {/* ================================================================
          Active Coupon Cards (dashed border)
          ================================================================ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {couponCards.map((card) => (
          <div
            key={card.code}
            className="rounded-xl border-2 border-dashed border-orange-300 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-lg font-bold text-orange-600">{card.code}</span>
              <button
                type="button"
                className="rounded border border-gray-200 px-2 py-1 text-xs font-medium text-gray-400 transition hover:text-orange-500"
                aria-label={`Copy ${card.code}`}
              >
                <Copy className="inline h-3 w-3" aria-hidden="true" /> {TEXT.copy}
              </button>
            </div>
            <p className="text-sm text-gray-600">{card.description}</p>
            <p className="mt-2 text-xs text-gray-400">{card.detail}</p>
            <div className="mt-3 flex items-center justify-between border-t border-dashed border-gray-200 pt-3">
              <span className="text-xs text-gray-400">{card.used}</span>
              <span className="text-xs font-medium text-green-600">Active</span>
            </div>
          </div>
        ))}
      </div>

      {/* ================================================================
          Coupons Table
          ================================================================ */}
      <section aria-label="Coupon list">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Header with filter pills */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">{TEXT.allCoupons}</h2>
            <div className="flex items-center gap-2">
              {tabs.map((tab, i) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActiveTab(i)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-medium transition',
                    activeTab === i
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-500 hover:bg-gray-50'
                  )}
                  aria-pressed={activeTab === i}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table content */}
          {listQuery.isLoading ? (
            <div className="space-y-3 p-6">
              <Skeleton className="h-10 w-full" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : coupons.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      <th className="px-6 py-3">{TEXT.colCode}</th>
                      <th className="px-4 py-3">{TEXT.colType}</th>
                      <th className="px-4 py-3">{TEXT.colDiscount}</th>
                      <th className="px-4 py-3">{TEXT.colMinOrder}</th>
                      <th className="px-4 py-3">{TEXT.colUsage}</th>
                      <th className="px-4 py-3">{TEXT.colStatus}</th>
                      <th className="px-4 py-3">{TEXT.colExpires}</th>
                      <th className="px-4 py-3">{TEXT.colActions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((c) => {
                      const badge = statusBadge(c.status);
                      const isExpiredOrDisabled = c.status === 'Expired' || c.status === 'Disabled';
                      return (
                        <tr
                          key={c.id}
                          className="border-b border-gray-50 transition-colors hover:bg-orange-50/30"
                        >
                          <td className={cn(
                            'px-6 py-3.5 font-bold',
                            isExpiredOrDisabled ? 'text-gray-400' : 'text-orange-600'
                          )}>
                            {c.code}
                          </td>
                          <td className="px-4 py-3.5">{c.type}</td>
                          <td className="px-4 py-3.5 font-semibold">{c.discount}</td>
                          <td className="px-4 py-3.5">{c.minOrder}</td>
                          <td className="px-4 py-3.5">
                            {c.usageUsed.toLocaleString('en-IN')} / {c.usageLimit.toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={cn('rounded-full px-2 py-1 text-xs font-semibold', badge.bg, badge.text)}>
                              {c.status}
                            </span>
                          </td>
                          <td className={cn(
                            'px-4 py-3.5',
                            isExpiredOrDisabled ? 'text-gray-400' : 'text-gray-500'
                          )}>
                            {c.expires}
                          </td>
                          <td className="px-4 py-3.5">
                            {c.status === 'Active' && (
                              <>
                                <button
                                  type="button"
                                  className="mr-2 text-xs font-medium text-orange-500 transition hover:text-orange-600"
                                  aria-label={`Edit ${c.code}`}
                                >
                                  {TEXT.edit}
                                </button>
                                <button
                                  type="button"
                                  className="text-xs font-medium text-red-500 transition hover:text-red-600"
                                  aria-label={`Disable ${c.code}`}
                                >
                                  {TEXT.disable}
                                </button>
                              </>
                            )}
                            {c.status === 'Expired' && (
                              <button
                                type="button"
                                className="text-xs font-medium text-orange-500 transition hover:text-orange-600"
                                aria-label={`Clone ${c.code}`}
                              >
                                {TEXT.clone}
                              </button>
                            )}
                            {c.status === 'Disabled' && (
                              <>
                                <button
                                  type="button"
                                  className="mr-2 text-xs font-medium text-green-500 transition hover:text-green-600"
                                  aria-label={`Enable ${c.code}`}
                                >
                                  {TEXT.enable}
                                </button>
                                <button
                                  type="button"
                                  className="text-xs font-medium text-orange-500 transition hover:text-orange-600"
                                  aria-label={`Clone ${c.code}`}
                                >
                                  {TEXT.clone}
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer / Pagination */}
              <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3">
                <p className="text-xs text-gray-500">{TEXT.showing}</p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-400"
                    disabled
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white"
                    aria-current="page"
                  >
                    1
                  </button>
                  <button
                    type="button"
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                  >
                    2
                  </button>
                  <button
                    type="button"
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                  >
                    3
                  </button>
                  <button
                    type="button"
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="px-6 py-8 text-center text-sm text-gray-400">{TEXT.empty}</div>
          )}
        </div>
      </section>
    </div>
  );
}
