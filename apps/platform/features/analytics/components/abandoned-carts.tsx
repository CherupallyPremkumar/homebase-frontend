'use client';

import { useState } from 'react';
import {
  ShoppingCart, RefreshCw, DollarSign, CheckCircle,
  TrendingUp, AlertTriangle, TrendingDown, Send, Mail,
  Play, Lightbulb, ShoppingBag, Home, Smartphone, Package,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { useAbandonedCarts } from '../hooks/use-abandoned-carts';
import type { CartLikelihood, CartStatus } from '../services/abandoned-carts-mock';

// ----------------------------------------------------------------
// Text constants (i18n-ready)
// ----------------------------------------------------------------

const TEXT = {
  pageTitle: 'Abandoned Carts',
  pageDescription: 'Track abandoned carts, trigger recovery emails, and reclaim lost revenue',
  bulkRecoveryLabel: 'Bulk Recovery Email',
  // Stat cards
  statTotalAbandoned: 'Total Abandoned',
  statRecoveryRate: 'Recovery Rate',
  statRevenueLost: 'Revenue Lost',
  statRevenueRecovered: 'Revenue Recovered',
  // Recovery tiers
  recoveryScoringTitle: 'Recovery Likelihood Scoring',
  recoveryScoringSubtitle: 'AI-scored tiers based on recency, cart value, and engagement signals',
  totalLabel: 'Total: 1,245 abandoned carts',
  sendRecoveryCampaign: 'Send Recovery Campaign',
  carts: 'Carts',
  value: 'Value',
  // Carts table
  cartsTableTitle: 'Abandoned Carts',
  tabAll: 'All',
  tabAbandoned: 'Abandoned',
  tabRecovered: 'Recovered',
  tabExpired: 'Expired',
  colCustomer: 'Customer',
  colItems: 'Items',
  colCartValue: 'Cart Value',
  colAbandoned: 'Abandoned',
  colRecoveryEmail: 'Recovery Email',
  colLikelihood: 'Likelihood',
  colStatus: 'Status',
  colAction: 'Action',
  sendReminder: 'Send Reminder',
  completed: 'Completed',
  expired: 'Expired',
  paginationShowing: 'Showing 1-8 of 1,245 abandoned carts',
  // Top 5 products table
  topProductsTitle: 'Top 5 Abandoned Products',
  topProductsPeriod: 'Last 30 days',
  colRank: '#',
  colProduct: 'Product',
  colPrice: 'Price',
  colCartCount: 'Cart Count',
  colAvgTime: 'Avg Time Before Abandon',
  colAbandonRate: 'Abandon Rate',
  // Product cards
  productCardsTitle: 'Top Abandoned Products',
  productImageAlt: 'Product Image',
  // States
  loadingLabel: 'Loading abandoned carts',
  errorTitle: 'Failed to load abandoned carts',
  errorDescription: 'Please try refreshing the page or contact support.',
  retryLabel: 'Retry',
  emptyTitle: 'No abandoned carts',
  emptyDescription: 'Great news! There are no abandoned carts to recover right now.',
} as const;

// ----------------------------------------------------------------
// Config registries
// ----------------------------------------------------------------

const LIKELIHOOD_CONFIG: Record<CartLikelihood, { label: string; badgeClass: string }> = {
  high: { label: 'High', badgeClass: 'bg-green-50 text-green-700' },
  medium: { label: 'Medium', badgeClass: 'bg-yellow-50 text-yellow-700' },
  low: { label: 'Low', badgeClass: 'bg-red-50 text-red-600' },
};

const STATUS_CONFIG: Record<CartStatus, { label: string; badgeClass: string }> = {
  abandoned: { label: 'Abandoned', badgeClass: 'bg-red-50 text-red-600' },
  recovered: { label: 'Recovered', badgeClass: 'bg-green-50 text-green-600' },
  expired: { label: 'Expired', badgeClass: 'bg-gray-100 text-gray-500' },
};

const TIER_STYLES: Record<CartLikelihood, {
  border: string; bg: string; iconBg: string; iconText: string;
  titleText: string; subtitleText: string; btnBg: string; btnHover: string;
  recBorder: string;
}> = {
  high: {
    border: 'border-green-200', bg: 'bg-green-50/30', iconBg: 'bg-green-100', iconText: 'text-green-600',
    titleText: 'text-green-800', subtitleText: 'text-green-600', btnBg: 'bg-green-600', btnHover: 'hover:bg-green-700',
    recBorder: 'border-green-100',
  },
  medium: {
    border: 'border-yellow-200', bg: 'bg-yellow-50/30', iconBg: 'bg-yellow-100', iconText: 'text-yellow-600',
    titleText: 'text-yellow-800', subtitleText: 'text-yellow-600', btnBg: 'bg-yellow-500', btnHover: 'hover:bg-yellow-600',
    recBorder: 'border-yellow-100',
  },
  low: {
    border: 'border-red-200', bg: 'bg-red-50/30', iconBg: 'bg-red-100', iconText: 'text-red-600',
    titleText: 'text-red-800', subtitleText: 'text-red-600', btnBg: 'bg-red-500', btnHover: 'hover:bg-red-600',
    recBorder: 'border-red-100',
  },
};

const TIER_ICONS: Record<CartLikelihood, typeof TrendingUp> = {
  high: TrendingUp,
  medium: AlertTriangle,
  low: TrendingDown,
};

const PRODUCT_ICONS = [Play, Lightbulb, ShoppingBag, Home, Smartphone];

const PRODUCT_BAR_COLORS: Record<number, string> = {
  0: 'bg-red-400',
  1: 'bg-orange-400',
  2: 'bg-yellow-400',
  3: 'bg-green-400',
  4: 'bg-green-400',
};

const ABANDON_RATE_STYLES = (rate: number) => {
  if (rate >= 60) return 'bg-red-50 text-red-600';
  if (rate >= 40) return 'bg-yellow-50 text-yellow-700';
  if (rate >= 30) return 'bg-yellow-50 text-yellow-700';
  return 'bg-green-50 text-green-600';
};

const TAB_FILTERS = [
  { key: 'all', label: TEXT.tabAll },
  { key: 'abandoned', label: TEXT.tabAbandoned },
  { key: 'recovered', label: TEXT.tabRecovered },
  { key: 'expired', label: TEXT.tabExpired },
] as const;

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export function AbandonedCarts() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const { data, isLoading, isError } = useAbandonedCarts();

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
        <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-96 animate-pulse rounded-xl bg-gray-200" />
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
  if (!data || data.carts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <ShoppingCart className="h-12 w-12 text-gray-300" />
        <h2 className="text-lg font-semibold text-gray-900">{TEXT.emptyTitle}</h2>
        <p className="text-sm text-gray-500">{TEXT.emptyDescription}</p>
      </div>
    );
  }

  const { stats, tiers, carts, topProducts, productCards, totalCartsInTier } = data;

  const filteredCarts = activeTab === 'all'
    ? carts
    : carts.filter((c) => c.status === activeTab);

  return (
    <section className="space-y-8" aria-label={TEXT.pageTitle}>

      {/* ---- Page Header ---- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{TEXT.pageTitle}</h1>
          <p className="mt-1 text-sm text-gray-500">{TEXT.pageDescription}</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
            <option>Today</option>
            <option>Last 7 Days</option>
            <option selected>Last 30 Days</option>
          </select>
          <button
            onClick={() => alert('Bulk send recovery emails')}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            <Mail className="h-4 w-4" />
            {TEXT.bulkRecoveryLabel}
          </button>
        </div>
      </div>

      {/* ---- Aggregate Stats (30-Day) ---- */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Abandoned */}
        <div className="stat-card rounded-xl border border-gray-100 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{TEXT.statTotalAbandoned}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
              <ShoppingCart className="h-5 w-5 text-red-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalAbandoned.toLocaleString('en-IN')}</p>
          <p className="mt-1 text-xs font-medium text-red-500">{stats.totalAbandonedTrendText}</p>
        </div>

        {/* Recovery Rate */}
        <div className="stat-card rounded-xl border border-gray-100 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{TEXT.statRecoveryRate}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
              <RefreshCw className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.recoveryRate}</p>
          <p className="mt-1 text-xs font-medium text-green-600">{stats.recoveryRateTrendText}</p>
        </div>

        {/* Revenue Lost */}
        <div className="stat-card rounded-xl border border-gray-100 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{TEXT.statRevenueLost}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
              <DollarSign className="h-5 w-5 text-orange-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.revenueLost}</p>
          <p className="mt-1 text-xs font-medium text-red-500">{stats.revenueLostSubText}</p>
        </div>

        {/* Revenue Recovered */}
        <div className="stat-card rounded-xl border border-gray-100 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{TEXT.statRevenueRecovered}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
              <CheckCircle className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.revenueRecovered}</p>
          <p className="mt-1 text-xs font-medium text-green-600">{stats.revenueRecoveredSubText}</p>
        </div>
      </div>

      {/* ---- Recovery Likelihood Scoring ---- */}
      <div className="rounded-xl border border-gray-100 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{TEXT.recoveryScoringTitle}</h2>
            <p className="mt-0.5 text-xs text-gray-400">{TEXT.recoveryScoringSubtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{TEXT.totalLabel}</span>
            <div className="flex h-2 w-48 overflow-hidden rounded-full bg-gray-100">
              <div className="h-2 bg-green-500" style={{ width: `${totalCartsInTier.highPercent}%` }} />
              <div className="h-2 bg-yellow-400" style={{ width: `${totalCartsInTier.mediumPercent}%` }} />
              <div className="h-2 bg-red-400" style={{ width: `${totalCartsInTier.lowPercent}%` }} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 p-6 lg:grid-cols-3">
          {tiers.map((tier) => {
            const style = TIER_STYLES[tier.id];
            const TierIcon = TIER_ICONS[tier.id];
            return (
              <div
                key={tier.id}
                className={cn(
                  'rounded-xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]',
                  style.border, style.bg
                )}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', style.iconBg)}>
                    <TierIcon className={cn('h-5 w-5', style.iconText)} />
                  </div>
                  <div>
                    <h3 className={cn('text-sm font-bold', style.titleText)}>{tier.label}</h3>
                    <p className={cn('text-xs', style.subtitleText)}>{tier.subtitle}</p>
                  </div>
                </div>
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">{TEXT.carts}</p>
                    <p className="text-lg font-bold text-gray-900">{tier.carts}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{TEXT.value}</p>
                    <p className="text-lg font-bold text-gray-900">{tier.value}</p>
                  </div>
                </div>
                <div className={cn('mb-4 rounded-lg border bg-white p-3', style.recBorder)}>
                  <p className="mb-1 text-xs font-semibold text-gray-700">{tier.recommendedTitle}</p>
                  <p className="text-xs text-gray-500">{tier.recommendedDescription}</p>
                </div>
                <button
                  onClick={() => alert(tier.expectedRecoveryAlert)}
                  className={cn(
                    'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition',
                    style.btnBg, style.btnHover
                  )}
                >
                  <Send className="h-4 w-4" />
                  {TEXT.sendRecoveryCampaign}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---- Abandoned Carts Table ---- */}
      <div className="rounded-xl border border-gray-100 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">{TEXT.cartsTableTitle}</h2>
          <div className="flex items-center gap-2" role="tablist" aria-label="Filter by status">
            {TAB_FILTERS.map((tab) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition',
                  activeTab === tab.key
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-500 hover:bg-gray-50'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                <th className="px-6 py-3">{TEXT.colCustomer}</th>
                <th className="px-4 py-3">{TEXT.colItems}</th>
                <th className="px-4 py-3">{TEXT.colCartValue}</th>
                <th className="px-4 py-3">{TEXT.colAbandoned}</th>
                <th className="px-4 py-3">{TEXT.colRecoveryEmail}</th>
                <th className="px-4 py-3">{TEXT.colLikelihood}</th>
                <th className="px-4 py-3">{TEXT.colStatus}</th>
                <th className="px-4 py-3">{TEXT.colAction}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCarts.map((cart, idx) => {
                const likelihoodCfg = LIKELIHOOD_CONFIG[cart.likelihood];
                const statusCfg = STATUS_CONFIG[cart.status];
                const isLastRow = idx === filteredCarts.length - 1;
                const canSendReminder = cart.status === 'abandoned';

                return (
                  <tr
                    key={cart.id}
                    className={cn(
                      'transition-colors duration-150 hover:bg-orange-50/60',
                      !isLastRow && 'border-b border-gray-50'
                    )}
                  >
                    <td className="px-6 py-3.5 font-medium">{cart.customerName}</td>
                    <td className="px-4 py-3.5">{cart.items}</td>
                    <td className="px-4 py-3.5 font-semibold">{cart.cartValue}</td>
                    <td className="px-4 py-3.5 text-gray-500">{cart.abandoned}</td>
                    <td className="px-4 py-3.5">
                      {cart.recoveryEmailSent ? (
                        <span className="font-medium text-green-600">Yes</span>
                      ) : (
                        <span className="font-medium text-gray-400">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn('rounded-full px-2 py-1 text-xs font-semibold', likelihoodCfg.badgeClass)}>
                        {likelihoodCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn('rounded-full px-2 py-1 text-xs font-semibold', statusCfg.badgeClass)}>
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {canSendReminder ? (
                        <button
                          onClick={() => alert(`Reminder sent to ${cart.customerName}`)}
                          className="text-xs font-medium text-orange-500 transition hover:text-orange-600"
                        >
                          {TEXT.sendReminder}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">
                          {cart.status === 'recovered' ? TEXT.completed : TEXT.expired}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3">
          <p className="text-xs text-gray-400">{TEXT.paginationShowing}</p>
          <div className="flex items-center gap-1">
            <button className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-600">1</button>
            <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50">2</button>
            <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50">3</button>
            <span className="px-2 text-xs text-gray-400">...</span>
            <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50">156</button>
          </div>
        </div>
      </div>

      {/* ---- Top 5 Abandoned Products Table ---- */}
      <div className="rounded-xl border border-gray-100 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">{TEXT.topProductsTitle}</h2>
          <span className="text-xs text-gray-400">{TEXT.topProductsPeriod}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                <th className="px-6 py-3">{TEXT.colRank}</th>
                <th className="px-4 py-3">{TEXT.colProduct}</th>
                <th className="px-4 py-3">{TEXT.colPrice}</th>
                <th className="px-4 py-3">{TEXT.colCartCount}</th>
                <th className="px-4 py-3">{TEXT.colAvgTime}</th>
                <th className="px-4 py-3">{TEXT.colAbandonRate}</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, idx) => {
                const ProductIcon = PRODUCT_ICONS[idx] ?? Package;
                const barColor = PRODUCT_BAR_COLORS[idx] ?? 'bg-gray-400';
                const rateStyle = ABANDON_RATE_STYLES(product.abandonRate);
                const isLastRow = idx === topProducts.length - 1;

                return (
                  <tr
                    key={product.id}
                    className={cn(
                      'transition-colors duration-150 hover:bg-orange-50/60',
                      !isLastRow && 'border-b border-gray-50'
                    )}
                  >
                    <td className="px-6 py-3.5 font-bold text-gray-400">{product.rank}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                          <ProductIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-semibold">{product.price}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{product.cartCount}</span>
                        <div className="h-1.5 w-20 rounded-full bg-gray-100">
                          <div
                            className={cn('h-1.5 rounded-full', barColor)}
                            style={{ width: `${product.cartCountPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500">{product.avgTimeBeforeAbandon}</td>
                    <td className="px-4 py-3.5">
                      <span className={cn('rounded-full px-2 py-1 text-xs font-semibold', rateStyle)}>
                        {product.abandonRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---- Top Abandoned Products (Visual Cards) ---- */}
      <div className="rounded-xl border border-gray-100 bg-white">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">{TEXT.productCardsTitle}</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
          {productCards.map((card, idx) => {
            const barColor = PRODUCT_BAR_COLORS[idx] ?? 'bg-gray-400';
            return (
              <div key={card.id} className="rounded-lg border border-gray-100 p-4">
                <div className="mb-3 flex h-24 w-full items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                  {TEXT.productImageAlt}
                </div>
                <p className="text-sm font-semibold text-gray-900">{card.name}</p>
                <p className="mt-1 text-xs text-gray-500">Abandoned {card.abandonedCount} times</p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100">
                  <div
                    className={cn('h-1.5 rounded-full', barColor)}
                    style={{ width: `${card.abandonedPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
