'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  Tag,
  IndianRupee,
  PieChart,
  Search,
  Plus,
  Download,
  Pencil,
  Pause,
  Trash2,
  ArrowUpRight,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Inbox,
  Flame,
  Image,
  Truck,
  Sun,
  Flag,
  Gift,
  ClipboardCopy,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { Skeleton } from '@homebase/ui';

import { usePromoStats, useCampaigns, useActiveCoupons } from '../hooks/use-promo-page';
import {
  mockPromoStats,
  mockTabs,
  mockCampaigns,
  mockCoupons,
} from '../services/mock-data';
import type { Campaign, CampaignStatus, CampaignType, CouponCard, PromoTab } from '../types';

// ----------------------------------------------------------------
// Constants
// ----------------------------------------------------------------

const PAGE_TITLE = 'Promotions & Campaigns';
const PAGE_SUBTITLE = 'Manage discount coupons, flash sales, banners, and promotional campaigns';
const SEARCH_PLACEHOLDER = 'Search campaigns...';
const EXPORT_LABEL = 'Export';
const CREATE_LABEL = 'Create Campaign';
const ACTIVE_COUPONS_TITLE = 'Active Coupons';
const ACTIVE_COUPONS_SUBTITLE = 'Currently redeemable coupon codes';
const VIEW_ALL_COUPONS = 'View All Coupons';
const NO_CAMPAIGNS_TEXT = 'No campaigns found';
const NO_COUPONS_TEXT = 'No active coupons';
const ERROR_TITLE = 'Failed to load promotions';
const ERROR_SUBTITLE = 'Please check your connection and try again.';
const EMPTY_TITLE = 'No promotions data available';
const EMPTY_SUBTITLE = 'Data will appear here once available.';

const TYPE_OPTIONS = ['All Types', 'Coupon', 'Flash Sale', 'Banner', 'Free Shipping'];

const RELATED_LINKS = [
  { label: 'Coupons', href: '/promotions/coupons' },
  { label: 'Campaigns', href: '/promotions/campaigns' },
  { label: 'Banners', href: '/promotions/banners' },
];

// ----------------------------------------------------------------
// Campaign icon by row id (matches prototype per-row icons)
// ----------------------------------------------------------------

const CAMPAIGN_ICON_MAP: Record<string, React.ReactNode> = {
  'prm-001': <Flame className="h-5 w-5" />,
  'prm-002': <Tag className="h-5 w-5" />,
  'prm-003': <Image className="h-5 w-5" />,
  'prm-004': <Truck className="h-5 w-5" />,
  'prm-005': <Sun className="h-5 w-5" />,
  'prm-006': <Tag className="h-5 w-5" />,
  'prm-007': <Flag className="h-5 w-5" />,
  'prm-008': <Gift className="h-5 w-5" />,
};

// ----------------------------------------------------------------
// Type badge config
// ----------------------------------------------------------------

interface TypeBadgeStyle {
  bg: string;
  text: string;
  icon: React.ReactNode;
}

const TYPE_BADGE_STYLES: Record<CampaignType, TypeBadgeStyle> = {
  'Flash Sale': {
    bg: 'bg-red-50',
    text: 'text-red-600',
    icon: <Zap className="h-3 w-3" />,
  },
  'Coupon': {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    icon: <Tag className="h-3 w-3" />,
  },
  'Banner': {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    icon: <Image className="h-3 w-3" />,
  },
  'Free Shipping': {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    icon: <Truck className="h-3 w-3" />,
  },
};

// ----------------------------------------------------------------
// Status badge config
// ----------------------------------------------------------------

interface StatusStyle {
  bg: string;
  text: string;
  dot: string;
}

const STATUS_STYLES: Record<CampaignStatus, StatusStyle> = {
  Active:    { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  Scheduled: { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  Expired:   { bg: 'bg-gray-100',  text: 'text-gray-600',   dot: 'bg-gray-400' },
  Draft:     { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
};

// ----------------------------------------------------------------
// Usage bar color by status
// ----------------------------------------------------------------

function getUsageBarColor(status: CampaignStatus): string {
  switch (status) {
    case 'Active':    return 'bg-green-500';
    case 'Scheduled': return 'bg-blue-400';
    case 'Expired':   return 'bg-gray-400';
    case 'Draft':     return 'bg-gray-200';
  }
}

// ----------------------------------------------------------------
// Usage percent
// ----------------------------------------------------------------

function getUsagePercent(c: Campaign): number {
  if (c.usageLimit === null || c.usageLimit === 0) return 0;
  return Math.round((c.usageUsed / c.usageLimit) * 100);
}

// ----------------------------------------------------------------
// Sub-components: Loading / Error / Empty states
// ----------------------------------------------------------------

function PromoSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300" role="status" aria-label="Loading promotions">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>
      </div>

      {/* Related pills */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-12" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-20 rounded-full" />
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
            <Skeleton className="h-9 w-20" />
            <Skeleton className="mt-2 h-3.5 w-32" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-100 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded" />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-56 rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>
        <div className="p-6 space-y-3">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>

      {/* Coupons */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="space-y-1">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      </div>

      <span className="sr-only">Loading promotions data...</span>
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
      <p className="mt-1 text-sm text-gray-500">{ERROR_SUBTITLE}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Retry
      </button>
    </section>
  );
}

function EmptyState() {
  return (
    <section className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-12">
      <Inbox className="mb-4 h-12 w-12 text-gray-300" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-gray-900">{EMPTY_TITLE}</h2>
      <p className="mt-1 text-sm text-gray-500">{EMPTY_SUBTITLE}</p>
    </section>
  );
}

// ----------------------------------------------------------------
// Campaign Table Row
// ----------------------------------------------------------------

function CampaignRow({ campaign }: { campaign: Campaign }) {
  const typeStyle = TYPE_BADGE_STYLES[campaign.type];
  const statusStyle = STATUS_STYLES[campaign.status];
  const barColor = getUsageBarColor(campaign.status);
  const usagePct = getUsagePercent(campaign);
  const icon = CAMPAIGN_ICON_MAP[campaign.id];
  const isDateTbd = campaign.startDate === 'TBD';

  return (
    <tr className="transition-colors hover:bg-orange-50/40">
      {/* Campaign name + icon */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', campaign.iconBg)}>
            <span className={campaign.iconColor}>{icon}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{campaign.name}</p>
            <p className="mt-0.5 text-xs text-gray-400">{campaign.subtitle}</p>
          </div>
        </div>
      </td>

      {/* Type badge */}
      <td className="px-4 py-4">
        {typeStyle && (
          <span className={cn(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold',
            typeStyle.bg,
            typeStyle.text,
          )}>
            {typeStyle.icon}
            {campaign.type}
          </span>
        )}
      </td>

      {/* Discount */}
      <td className="px-4 py-4">
        <span className="text-sm font-semibold text-gray-900">{campaign.discount}</span>
      </td>

      {/* Start Date */}
      <td className="px-4 py-4">
        <span className={cn('text-sm', isDateTbd ? 'text-gray-400' : 'text-gray-600')}>
          {campaign.startDate}
        </span>
      </td>

      {/* End Date */}
      <td className="px-4 py-4">
        <span className={cn('text-sm', isDateTbd ? 'text-gray-400' : 'text-gray-600')}>
          {campaign.endDate}
        </span>
      </td>

      {/* Usage bar */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 flex-1 rounded-full bg-gray-100">
            <div
              className={cn('h-1.5 rounded-full', barColor)}
              style={{ width: `${usagePct}%` }}
            />
          </div>
          <span className={cn('text-xs', campaign.status === 'Draft' ? 'text-gray-400' : 'text-gray-500')}>
            {campaign.usageLabel}
          </span>
        </div>
      </td>

      {/* Status badge */}
      <td className="px-4 py-4">
        <span className={cn(
          'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold',
          statusStyle.bg,
          statusStyle.text,
        )}>
          <span className={cn('mr-1.5 h-1.5 w-1.5 rounded-full', statusStyle.dot)} />
          {campaign.status}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          {/* Edit */}
          <button
            type="button"
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-orange-50 hover:text-orange-500"
            title="Edit"
            aria-label={`Edit ${campaign.name}`}
          >
            <Pencil className="h-4 w-4" />
          </button>

          {/* Pause -- only enabled for Active */}
          {campaign.status === 'Active' ? (
            <button
              type="button"
              className="rounded-lg p-1.5 text-gray-400 transition hover:bg-yellow-50 hover:text-yellow-600"
              title="Pause"
              aria-label={`Pause ${campaign.name}`}
            >
              <Pause className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              className="cursor-not-allowed rounded-lg p-1.5 text-gray-300"
              title="Pause"
              disabled
              aria-label="Pause disabled"
            >
              <Pause className="h-4 w-4" />
            </button>
          )}

          {/* Delete */}
          <button
            type="button"
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
            title="Delete"
            aria-label={`Delete ${campaign.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ----------------------------------------------------------------
// Coupon Card
// ----------------------------------------------------------------

function CouponCardItem({ coupon }: { coupon: CouponCard }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]">
      {/* Gradient header */}
      <div className={cn('bg-gradient-to-r px-5 py-4', coupon.gradientFrom, coupon.gradientTo)}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-white/70">
            {coupon.discountLabel}
          </span>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white">
            Active
          </span>
        </div>
        <p className="mt-1 text-2xl font-extrabold text-white">{coupon.discount}</p>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Code with dashed border */}
        <div className={cn(
          'mb-4 flex items-center justify-between rounded-lg border-2 border-dashed px-4 py-2.5',
          coupon.codeBg,
          coupon.codeBorder,
        )}>
          <span className={cn('text-sm font-bold tracking-wider', coupon.codeText)}>
            {coupon.code}
          </span>
          <button
            type="button"
            className={cn('transition', coupon.copyColor, coupon.copyHover)}
            title="Copy code"
            aria-label={`Copy coupon code ${coupon.code}`}
          >
            <ClipboardCopy className="h-4 w-4" />
          </button>
        </div>

        {/* Details */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Min. Order</span>
            <span className="text-xs font-medium text-gray-700">{coupon.minOrder}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Valid Till</span>
            <span className="text-xs font-medium text-gray-700">{coupon.validTill}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Used</span>
            <span className="text-xs font-medium text-gray-700">
              {coupon.usageUsed} / {coupon.usageLimit}
            </span>
          </div>
        </div>

        {/* Usage bar */}
        <div className="mt-3 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 rounded-full bg-gray-100">
              <div
                className={cn('h-1.5 rounded-full', coupon.barColor)}
                style={{ width: `${coupon.usagePercent}%` }}
              />
            </div>
            <span className="text-[10px] font-semibold text-gray-500">{coupon.usagePercent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------

export function PromoList() {
  const [activeTab, setActiveTab] = useState(0);

  const statsQuery = usePromoStats();
  const campaignsQuery = useCampaigns();
  const couponsQuery = useActiveCoupons();

  const handleRetry = useCallback(() => {
    statsQuery.refetch();
    campaignsQuery.refetch();
    couponsQuery.refetch();
  }, [statsQuery, campaignsQuery, couponsQuery]);

  // ---- Loading ----
  const isLoading = statsQuery.isLoading && campaignsQuery.isLoading;
  if (isLoading) return <PromoSkeleton />;

  // ---- Error ----
  const isError = statsQuery.isError && campaignsQuery.isError;
  if (isError) return <ErrorBanner message={ERROR_TITLE} onRetry={handleRetry} />;

  // ---- Empty ----
  if (!statsQuery.data && !campaignsQuery.data) return <EmptyState />;

  // Use API data when available, fall back to mocks
  const stats = statsQuery.data ?? mockPromoStats;
  const campaigns = campaignsQuery.data ?? mockCampaigns;
  const coupons = couponsQuery.data ?? mockCoupons;
  const tabs = mockTabs;

  // Filter campaigns by active tab
  const filteredCampaigns = activeTab === 0
    ? campaigns
    : campaigns.filter((c) => c.status === tabs[activeTab].label);

  return (
    <div className="space-y-8">
      {/* ================================================================
          Page Header
          ================================================================ */}
      <section className="flex items-center justify-between">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">{PAGE_TITLE}</h1>
          <p className="mt-1 text-sm text-gray-500">{PAGE_SUBTITLE}</p>
        </header>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {EXPORT_LABEL}
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {CREATE_LABEL}
          </button>
        </div>
      </section>

      {/* ================================================================
          Related sub-page navigation pills
          ================================================================ */}
      <nav className="flex items-center gap-2" aria-label="Related pages">
        <span className="text-xs text-gray-400">Related:</span>
        {RELATED_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-500 transition hover:bg-orange-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* ================================================================
          Stats Cards
          ================================================================ */}
      <section aria-label="Promotion statistics">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Active Campaigns */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Active Campaigns</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <Zap className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.activeCampaigns}</p>
            <div className="mt-1.5 flex items-center gap-1">
              <ArrowUpRight className="h-3.5 w-3.5 text-green-500" />
              <span className="text-xs font-medium text-green-600">{stats.activeCampaignsTrend}</span>
            </div>
          </div>

          {/* Total Coupons */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Total Coupons</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                <Tag className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalCoupons}</p>
            <div className="mt-1.5 flex items-center gap-1">
              <span className="text-xs text-gray-400">{stats.totalCouponsSubtitle}</span>
            </div>
          </div>

          {/* Revenue from Promos */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Revenue from Promos</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <IndianRupee className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.promoRevenue}</p>
            <div className="mt-1.5 flex items-center gap-1">
              <ArrowUpRight className="h-3.5 w-3.5 text-green-500" />
              <span className="text-xs font-medium text-green-600">{stats.promoRevenueTrend}</span>
            </div>
          </div>

          {/* Redemption Rate */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Redemption Rate</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <PieChart className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.redemptionRate}</p>
            <div className="mt-1.5 flex items-center gap-1">
              <ArrowUpRight className="h-3.5 w-3.5 text-green-500" />
              <span className="text-xs font-medium text-green-600">{stats.redemptionRateTrend}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          Campaigns Table
          ================================================================ */}
      <section aria-label="Campaign list">
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          {/* Tabs + Search + Filter */}
          <div className="flex items-center justify-between px-6 pt-5 pb-0">
            <div className="-mb-px flex items-center gap-1 border-b border-gray-100">
              {tabs.map((tab: PromoTab, i: number) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActiveTab(i)}
                  aria-current={activeTab === i ? 'page' : undefined}
                  className={cn(
                    'border-b-2 px-4 py-3 text-sm font-medium transition',
                    activeTab === i
                      ? 'border-orange-500 text-orange-500'
                      : 'border-transparent text-gray-500 hover:text-gray-700',
                  )}
                >
                  {tab.label}
                  <span className={cn(
                    'ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                    activeTab === i ? 'bg-orange-50 text-orange-600' : tab.badgeBg,
                    activeTab === i ? '' : tab.badgeText,
                  )}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  type="search"
                  placeholder={SEARCH_PLACEHOLDER}
                  aria-label="Search campaigns"
                  className="w-56 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>
              <select
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 outline-none focus:border-orange-400"
                aria-label="Filter by type"
              >
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          {campaignsQuery.isLoading ? (
            <div className="space-y-3 p-6">
              <Skeleton className="h-10 w-full" />
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : filteredCampaigns.length > 0 ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-t border-gray-100">
                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Campaign</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Type</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Discount</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Start Date</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">End Date</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Usage</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Status</th>
                    <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredCampaigns.map((c) => (
                    <CampaignRow key={c.id} campaign={c} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-8 text-center text-sm text-gray-400">{NO_CAMPAIGNS_TEXT}</div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-700">1-{filteredCampaigns.length}</span> of{' '}
              <span className="font-medium text-gray-700">{filteredCampaigns.length}</span> campaigns
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="cursor-not-allowed rounded-lg bg-gray-50 px-3 py-1.5 text-sm text-gray-400"
                disabled
              >
                Previous
              </button>
              <button
                type="button"
                className="rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-white"
              >
                1
              </button>
              <button
                type="button"
                className="rounded-lg px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50"
              >
                2
              </button>
              <button
                type="button"
                className="rounded-lg px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50"
              >
                3
              </button>
              <button
                type="button"
                className="rounded-lg px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          Active Coupons
          ================================================================ */}
      <section aria-label="Active coupons">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{ACTIVE_COUPONS_TITLE}</h2>
            <p className="mt-0.5 text-sm text-gray-500">{ACTIVE_COUPONS_SUBTITLE}</p>
          </div>
          <Link
            href="/promotions/coupons"
            className="flex items-center gap-2 text-sm font-semibold text-orange-500 transition hover:text-orange-600"
          >
            {VIEW_ALL_COUPONS}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {couponsQuery.isLoading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : coupons.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4" role="list" aria-label="Active coupon codes">
            {coupons.map((c) => (
              <div key={c.code} role="listitem">
                <CouponCardItem coupon={c} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-gray-400">{NO_COUPONS_TEXT}</div>
        )}
      </section>
    </div>
  );
}
