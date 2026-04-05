'use client';

import { useState } from 'react';
import {
  Star, Clock, Flag, Trash2, Download, SlidersHorizontal,
  CheckCircle2, AlertTriangle, MessageSquare, Undo2,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { StatCard, RatingStars } from '@homebase/ui';

/* ------------------------------------------------------------------ */
/*  TEXT CONSTANTS                                                      */
/* ------------------------------------------------------------------ */

const TEXT = {
  pageTitle: 'Review Moderation',
  pageSubtitle: 'Monitor, approve, flag, or remove customer reviews across the platform',
  exportBtn: 'Export',
  settingsBtn: 'Moderation Settings',
  searchPlaceholder: 'Search reviews...',
  showingPrefix: 'Showing',
  showingOf: 'of',
  showingReviews: 'reviews',
  previousBtn: 'Previous',
  nextBtn: 'Next',
  flaggedTitle: 'Flagged Reviews Requiring Attention',
  flaggedSubtitle: 'Reviews flagged by automated system or user reports',
  flaggedCount: '3 flagged',
  approveTitle: 'Approve',
  flagTitle: 'Flag',
  removeTitle: 'Remove',
  restoreTitle: 'Restore',
  loadingLabel: 'Loading reviews',
  errorTitle: 'Failed to load reviews',
  errorSubtitle: 'Please try refreshing the page or contact support.',
  retryBtn: 'Retry',
  emptyTitle: 'No reviews yet',
  emptySubtitle: 'Product reviews will appear here once customers submit them.',
} as const;

/* ------------------------------------------------------------------ */
/*  STAT CARD DATA                                                     */
/* ------------------------------------------------------------------ */

const STATS = [
  {
    title: 'Total Reviews',
    value: '12,450',
    icon: <Star className="h-5 w-5 text-blue-500" />,
    iconBg: 'bg-blue-50',
    trend: 12.3,
    trendDirection: 'up' as const,
    subtitle: '+12.3% this month',
    progressBar: 85,
    progressColor: 'bg-blue-500',
  },
  {
    title: 'Pending Moderation',
    value: '15',
    icon: <Clock className="h-5 w-5 text-amber-500" />,
    iconBg: 'bg-amber-50',
    trend: 0,
    trendDirection: 'up' as const,
    subtitle: 'Needs Action',
    progressBar: 12,
    progressColor: 'bg-amber-500',
  },
  {
    title: 'Flagged',
    value: '8',
    icon: <Flag className="h-5 w-5 text-red-500" />,
    iconBg: 'bg-red-50',
    trend: 0,
    trendDirection: 'up' as const,
    subtitle: '+3 today',
    progressBar: 8,
    progressColor: 'bg-red-500',
  },
  {
    title: 'Removed',
    value: '23',
    icon: <Trash2 className="h-5 w-5 text-gray-500" />,
    iconBg: 'bg-gray-100',
    trend: 0,
    trendDirection: 'up' as const,
    subtitle: 'This month',
    progressBar: 5,
    progressColor: 'bg-gray-400',
  },
];

/* ------------------------------------------------------------------ */
/*  TAB DATA                                                           */
/* ------------------------------------------------------------------ */

type TabId = 'all' | 'pending' | 'flagged' | 'approved' | 'removed';

const TABS: { id: TabId; label: string; badgeCount?: string; badgeStyle?: string }[] = [
  { id: 'all', label: 'All Reviews' },
  { id: 'pending', label: 'Pending', badgeCount: '15', badgeStyle: 'bg-amber-100 text-amber-700' },
  { id: 'flagged', label: 'Flagged', badgeCount: '8', badgeStyle: 'bg-red-100 text-red-700' },
  { id: 'approved', label: 'Approved' },
  { id: 'removed', label: 'Removed' },
];

/* ------------------------------------------------------------------ */
/*  REVIEW TABLE DATA                                                  */
/* ------------------------------------------------------------------ */

type ReviewStatus = 'Approved' | 'Pending' | 'Flagged' | 'Removed';

interface ReviewRow {
  id: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
  customer: string;
  product: string;
  seller: string;
  rating: number;
  review: string;
  status: ReviewStatus;
  date: string;
}

const REVIEWS: ReviewRow[] = [
  {
    id: '#REV-12401',
    initials: 'RK',
    avatarBg: 'bg-blue-100',
    avatarText: 'text-blue-600',
    customer: 'Rajesh Kumar',
    product: 'Bosch Drill Machine GSB 501',
    seller: 'ToolMasters India',
    rating: 5,
    review: 'Excellent drill machine! Perfect for home use and very powerful...',
    status: 'Approved',
    date: '27 Mar 2026',
  },
  {
    id: '#REV-12402',
    initials: 'PS',
    avatarBg: 'bg-purple-100',
    avatarText: 'text-purple-600',
    customer: 'Priya Sharma',
    product: 'Havells LED Panel Light 18W',
    seller: 'LightHouse Electricals',
    rating: 4,
    review: 'Good brightness and energy efficient. Installation was easy...',
    status: 'Pending',
    date: '27 Mar 2026',
  },
  {
    id: '#REV-12403',
    initials: 'AM',
    avatarBg: 'bg-green-100',
    avatarText: 'text-green-600',
    customer: 'Anil Mehta',
    product: 'Asian Paints Royale Matt 20L',
    seller: 'PaintPro Supplies',
    rating: 1,
    review: 'Terrible quality. Paint started peeling within a week of application...',
    status: 'Flagged',
    date: '26 Mar 2026',
  },
  {
    id: '#REV-12404',
    initials: 'SG',
    avatarBg: 'bg-rose-100',
    avatarText: 'text-rose-600',
    customer: 'Sneha Gupta',
    product: 'Finolex FR Cable 2.5 sq mm',
    seller: 'WireWorld India',
    rating: 3,
    review: 'Good quality cable. ISI marked and the insulation feels durable...',
    status: 'Approved',
    date: '26 Mar 2026',
  },
  {
    id: '#REV-12405',
    initials: 'VR',
    avatarBg: 'bg-orange-100',
    avatarText: 'text-orange-600',
    customer: 'Vikram Rao',
    product: 'Crompton Ceiling Fan 48"',
    seller: 'CoolBreeze Fans',
    rating: 5,
    review: 'Best fan I have ever purchased. Silent operation, great airflow...',
    status: 'Pending',
    date: '25 Mar 2026',
  },
  {
    id: '#REV-12406',
    initials: 'DP',
    avatarBg: 'bg-teal-100',
    avatarText: 'text-teal-600',
    customer: 'Deepa Patel',
    product: 'Pidilite Fevicol SH 5kg',
    seller: 'BuildRight Supplies',
    rating: 4,
    review: 'Strong adhesive as expected from Fevicol. Works great on wood...',
    status: 'Approved',
    date: '25 Mar 2026',
  },
  {
    id: '#REV-12407',
    initials: 'MJ',
    avatarBg: 'bg-indigo-100',
    avatarText: 'text-indigo-600',
    customer: 'Manoj Joshi',
    product: 'Cera Bathroom Faucet S-Series',
    seller: 'BathFittings Hub',
    rating: 2,
    review: 'Faucet started leaking after two weeks. Poor chrome finish...',
    status: 'Pending',
    date: '24 Mar 2026',
  },
  {
    id: '#REV-12408',
    initials: 'KN',
    avatarBg: 'bg-cyan-100',
    avatarText: 'text-cyan-600',
    customer: 'Kavita Nair',
    product: 'Godrej Interio Steel Almirah',
    seller: 'FurniKart Online',
    rating: 4,
    review: 'Sturdy build quality and spacious storage. Delivery was on time...',
    status: 'Removed',
    date: '23 Mar 2026',
  },
];

/* ------------------------------------------------------------------ */
/*  FLAGGED REVIEW DATA                                                */
/* ------------------------------------------------------------------ */

interface FlaggedReview {
  id: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
  reviewer: string;
  reviewId: string;
  tagLabel: string;
  tagStyle: string;
  product: string;
  seller: string;
  rating: number;
  content: string;
  contentBg: string;
  contentBorder: string;
  reasonIconColor: string;
  reason: string;
  reasonTextColor: string;
}

const FLAGGED_REVIEWS: FlaggedReview[] = [
  {
    id: 'f1',
    initials: 'SK',
    avatarBg: 'bg-red-100',
    avatarText: 'text-red-600',
    reviewer: 'Suresh Krishnan',
    reviewId: '#REV-12389',
    tagLabel: 'SPAM',
    tagStyle: 'bg-red-100 text-red-700',
    product: 'Philips Air Purifier AC1215',
    seller: 'AirQuality Store',
    rating: 5,
    content: '"Amazing product!!! BUY NOW visit www.cheapdeals-spam.com for 90% off all electronics and home appliances click here now..."',
    contentBg: 'bg-red-50/50',
    contentBorder: 'border-red-100',
    reasonIconColor: 'text-red-400',
    reason: 'Reason: Contains external spam links and promotional content',
    reasonTextColor: 'text-red-600',
  },
  {
    id: 'f2',
    initials: 'RB',
    avatarBg: 'bg-amber-100',
    avatarText: 'text-amber-600',
    reviewer: 'Rahul Banerjee',
    reviewId: '#REV-12395',
    tagLabel: 'INAPPROPRIATE',
    tagStyle: 'bg-amber-100 text-amber-700',
    product: 'Stanley Measuring Tape 8m',
    seller: 'ToolMasters India',
    rating: 1,
    content: '"This measuring tape is absolute garbage. The seller is a [inappropriate language removed] and should be banned. Never buying from this [expletive] store again..."',
    contentBg: 'bg-amber-50/50',
    contentBorder: 'border-amber-100',
    reasonIconColor: 'text-amber-400',
    reason: 'Reason: Contains inappropriate language and personal attacks',
    reasonTextColor: 'text-amber-600',
  },
  {
    id: 'f3',
    initials: 'ND',
    avatarBg: 'bg-violet-100',
    avatarText: 'text-violet-600',
    reviewer: 'Neha Deshmukh',
    reviewId: '#REV-12398',
    tagLabel: 'FAKE',
    tagStyle: 'bg-violet-100 text-violet-700',
    product: 'JSW Steel TMT Bars 12mm',
    seller: 'SteelMart Direct',
    rating: 5,
    content: '"Outstanding quality steel bars! Best prices in the market. I have been buying from this seller for 10 years and they never disappoint. Everyone should buy only from this seller."',
    contentBg: 'bg-violet-50/50',
    contentBorder: 'border-violet-100',
    reasonIconColor: 'text-violet-400',
    reason: 'Reason: Suspected fake review - account has no purchase history for this product',
    reasonTextColor: 'text-violet-600',
  },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function getStatusVariant(status: ReviewStatus) {
  switch (status) {
    case 'Approved': return 'success' as const;
    case 'Pending': return 'warning' as const;
    case 'Flagged': return 'error' as const;
    case 'Removed': return 'neutral' as const;
  }
}

function getStatusBadgeClasses(status: ReviewStatus) {
  switch (status) {
    case 'Approved': return 'bg-green-50 text-green-700';
    case 'Pending': return 'bg-amber-50 text-amber-700';
    case 'Flagged': return 'bg-red-50 text-red-700';
    case 'Removed': return 'bg-gray-100 text-gray-600';
  }
}

/* ------------------------------------------------------------------ */
/*  MOCK HOOK                                                          */
/* ------------------------------------------------------------------ */

function useReviews() {
  return {
    data: { reviews: REVIEWS, flaggedReviews: FLAGGED_REVIEWS },
    isLoading: false,
    isError: false,
    error: null,
  };
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export function ReviewList() {
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const { data, isLoading, isError } = useReviews();

  /* ---------- Loading ---------- */
  if (isLoading) {
    return (
      <div className="space-y-6" role="status" aria-label={TEXT.loadingLabel}>
        <div className="h-8 w-64 animate-pulse rounded-lg bg-gray-200" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
        <div className="h-12 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-96 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  /* ---------- Error ---------- */
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24" role="alert">
        <AlertTriangle className="h-12 w-12 text-red-400" />
        <h2 className="text-lg font-semibold text-gray-900">{TEXT.errorTitle}</h2>
        <p className="text-sm text-gray-500">{TEXT.errorSubtitle}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          {TEXT.retryBtn}
        </button>
      </div>
    );
  }

  /* ---------- Empty ---------- */
  if (!data || data.reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <MessageSquare className="h-12 w-12 text-gray-300" />
        <h2 className="text-lg font-semibold text-gray-900">{TEXT.emptyTitle}</h2>
        <p className="text-sm text-gray-500">{TEXT.emptySubtitle}</p>
      </div>
    );
  }

  /* ---------- Filter reviews by active tab ---------- */
  const filteredReviews = activeTab === 'all'
    ? data.reviews
    : data.reviews.filter(
        (r) => r.status.toLowerCase() === activeTab
      );

  /* ---------- Success ---------- */
  return (
    <section className="space-y-6" aria-label="Review Moderation">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{TEXT.pageTitle}</h1>
            <p className="mt-1 text-sm text-gray-500">{TEXT.pageSubtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
              <Download className="h-4 w-4" />
              {TEXT.exportBtn}
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600">
              <SlidersHorizontal className="h-4 w-4" />
              {TEXT.settingsBtn}
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <StatCard
            key={s.title}
            title={s.title}
            value={s.value}
            icon={s.icon}
            trend={s.trend || undefined}
            trendDirection={s.trendDirection}
            subtitle={s.subtitle}
            progressBar={s.progressBar}
            progressColor={s.progressColor}
          />
        ))}
      </div>

      {/* Main Table Card */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 border-b border-gray-100 p-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'rounded-lg border border-transparent px-4 py-2 text-sm font-medium transition',
                activeTab === tab.id
                  ? 'border-orange-200 bg-orange-50 font-semibold text-orange-500'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              )}
            >
              {tab.label}
              {tab.badgeCount && (
                <span
                  className={cn(
                    'ml-1 rounded-full px-1.5 py-0.5 text-[10px]',
                    tab.badgeStyle
                  )}
                >
                  {tab.badgeCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Reviews Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Reviews">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Review ID</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Customer</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Product</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Seller</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Rating</th>
                <th className="min-w-[200px] px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Review</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Date</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredReviews.map((r) => (
                <tr
                  key={r.id}
                  className="transition-colors hover:bg-orange-50/40"
                >
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{r.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                          r.avatarBg,
                          r.avatarText
                        )}
                      >
                        {r.initials}
                      </div>
                      <span className="font-medium text-gray-800">{r.customer}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-700">{r.product}</td>
                  <td className="px-5 py-3.5 text-gray-600">{r.seller}</td>
                  <td className="px-5 py-3.5">
                    <RatingStars rating={r.rating} size="sm" />
                  </td>
                  <td className="max-w-[200px] px-5 py-3.5 text-gray-600">
                    <span className="block truncate">{r.review}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-[11px] font-semibold',
                        getStatusBadgeClasses(r.status)
                      )}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-xs text-gray-500">{r.date}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      {/* Approve: shown for Pending and Flagged */}
                      {(r.status === 'Pending' || r.status === 'Flagged') && (
                        <button
                          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-green-50 hover:text-green-500"
                          title={TEXT.approveTitle}
                          aria-label={`Approve review ${r.id}`}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                      )}
                      {/* Flag: shown for Approved and Pending */}
                      {(r.status === 'Approved' || r.status === 'Pending') && (
                        <button
                          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-amber-50 hover:text-amber-500"
                          title={TEXT.flagTitle}
                          aria-label={`Flag review ${r.id}`}
                        >
                          <Flag className="h-4 w-4" />
                        </button>
                      )}
                      {/* Remove: shown for Approved, Pending, Flagged */}
                      {r.status !== 'Removed' && (
                        <button
                          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                          title={TEXT.removeTitle}
                          aria-label={`Remove review ${r.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                      {/* Restore: shown for Removed */}
                      {r.status === 'Removed' && (
                        <button
                          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-green-50 hover:text-green-500"
                          title={TEXT.restoreTitle}
                          aria-label={`Restore review ${r.id}`}
                        >
                          <Undo2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Flagged Reviews Section */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
              <Flag className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{TEXT.flaggedTitle}</h3>
              <p className="mt-0.5 text-xs text-gray-500">{TEXT.flaggedSubtitle}</p>
            </div>
          </div>
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700">
            {TEXT.flaggedCount}
          </span>
        </div>

        <div className="divide-y divide-gray-50">
          {data.flaggedReviews.map((fr) => (
            <div key={fr.id} className="p-5 transition hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                      fr.avatarBg,
                      fr.avatarText
                    )}
                  >
                    {fr.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{fr.reviewer}</span>
                      <span className="text-xs text-gray-400">{fr.reviewId}</span>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[10px] font-bold',
                          fr.tagStyle
                        )}
                      >
                        {fr.tagLabel}
                      </span>
                    </div>
                    <p className="mb-1.5 text-xs text-gray-500">
                      Product: <span className="font-medium text-gray-700">{fr.product}</span>
                      {' | '}
                      Seller: <span className="font-medium text-gray-700">{fr.seller}</span>
                    </p>
                    <div className="mb-2">
                      <RatingStars rating={fr.rating} size="sm" />
                    </div>
                    <p
                      className={cn(
                        'rounded-lg border px-3 py-2 text-sm text-gray-700',
                        fr.contentBg,
                        fr.contentBorder
                      )}
                    >
                      {fr.content}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <AlertTriangle className={cn('h-3.5 w-3.5', fr.reasonIconColor)} />
                      <span className={cn('text-xs font-medium', fr.reasonTextColor)}>
                        {fr.reason}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex shrink-0 items-center gap-2">
                  <button className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 transition hover:bg-green-100">
                    Approve
                  </button>
                  <button className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
        <p className="text-sm text-gray-500">
          {TEXT.showingPrefix}{' '}
          <span className="font-semibold text-gray-700">1-8</span>
          {' '}{TEXT.showingOf}{' '}
          <span className="font-semibold text-gray-700">12,450</span>
          {' '}{TEXT.showingReviews}
        </p>
        <div className="flex items-center gap-1">
          <button
            className="cursor-not-allowed rounded-lg bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-400"
            disabled
          >
            {TEXT.previousBtn}
          </button>
          <button className="rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white">
            1
          </button>
          <button className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            2
          </button>
          <button className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            3
          </button>
          <span className="px-2 text-sm text-gray-400">...</span>
          <button className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            1,557
          </button>
          <button className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            {TEXT.nextBtn}
          </button>
        </div>
      </div>
    </section>
  );
}
