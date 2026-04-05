'use client';

import { useState } from 'react';
import {
  Users, UserPlus, Star, AlertTriangle, UserMinus,
  ArrowUpRight, ArrowDownRight, Plus, Send, X, Clock,
  ShoppingBag, IndianRupee, RefreshCw,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';

// ----------------------------------------------------------------
// Text constants (i18n-ready)
// ----------------------------------------------------------------

const TEXT = {
  pageTitle: 'Customer Segments',
  pageDescription: 'Analyze and manage customer groups for targeted engagement',
  createSegment: 'Create Segment',
  distributionTitle: 'Segment Distribution',
  distributionTotal: '13,712 total customers',
  overlapTitle: 'Segment Overlap Insights',
  overlapDescription: 'Customers appearing in multiple segments',
  viewFullMatrix: 'View Full Matrix',
  segmentBuilderTitle: 'Dynamic Segment Builder',
  segmentBuilderPreview: 'Preview: "High-Value Active Shoppers"',
  matchesLabel: '842 matches',
  updatedLive: 'Updated live',
  addCondition: 'Add Condition',
  saveSegment: 'Save Segment',
  createCampaign: 'Create Campaign for Segment',
  createCampaignShort: 'Create Campaign',
  avgOrderValue: 'Avg Order Value',
  revenue: 'Revenue',
  customers: 'customers',
  andLabel: 'AND',
  greaterThan: 'greater than',
  lessThan: 'less than',
  loadingLabel: 'Loading customer segments',
  errorTitle: 'Failed to load segments',
  errorDescription: 'Please try refreshing the page or contact support.',
  retryLabel: 'Retry',
  emptyTitle: 'No segments defined',
  emptyDescription: 'Create your first customer segment to start targeted engagement.',
} as const;

// ----------------------------------------------------------------
// Mock data (matching prototype exactly)
// ----------------------------------------------------------------

const DISTRIBUTION_SEGMENTS = [
  { name: 'VIP', count: 234, pct: 1.7, color: 'bg-yellow-400', dotColor: 'bg-yellow-400', showLabel: false },
  { name: 'New', count: 1245, pct: 9.1, color: 'bg-blue-400', dotColor: 'bg-blue-400', showLabel: true, label: '9%', labelClass: 'text-[10px] font-bold text-white' },
  { name: 'Returning', count: 8456, pct: 61.6, color: 'bg-green-400', dotColor: 'bg-green-400', showLabel: true, label: 'Returning 62%', labelClass: 'text-xs font-bold text-white' },
  { name: 'Inactive', count: 3210, pct: 23.4, color: 'bg-gray-300', dotColor: 'bg-gray-300', showLabel: true, label: 'Inactive 23%', labelClass: 'text-xs font-bold text-gray-600' },
  { name: 'At Risk', count: 567, pct: 4.1, color: 'bg-red-400', dotColor: 'bg-red-400', showLabel: true, label: '4%', labelClass: 'text-[10px] font-bold text-white' },
] as const;

const OVERLAP_INSIGHTS = [
  {
    title: 'High Value + Repeat Buyer',
    description: 'VIP customers who are also frequent repeat buyers',
    count: '4,200',
    bg: 'bg-yellow-50/50',
    border: 'border-yellow-100',
    badges: [
      { letter: 'V', bg: 'bg-yellow-400' },
      { letter: 'R', bg: 'bg-green-400' },
    ],
  },
  {
    title: 'At Risk + Previously VIP',
    description: 'Formerly high-value customers showing declining activity',
    count: '189',
    bg: 'bg-red-50/50',
    border: 'border-red-100',
    badges: [
      { letter: 'A', bg: 'bg-red-400' },
      { letter: 'V', bg: 'bg-yellow-400' },
    ],
  },
  {
    title: 'New + Repeat Buyer (fast converters)',
    description: 'Joined recently but already placed 2+ orders',
    count: '312',
    bg: 'bg-blue-50/50',
    border: 'border-blue-100',
    badges: [
      { letter: 'N', bg: 'bg-blue-400' },
      { letter: 'R', bg: 'bg-green-400' },
    ],
  },
] as const;

const BUILDER_CONDITIONS = [
  {
    icon: IndianRupee,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
    field: 'Total Spend',
    operator: TEXT.greaterThan,
    value: '\u20B910,000',
    valueBg: 'bg-orange-50',
    valueColor: 'text-orange-700',
  },
  {
    icon: ShoppingBag,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    field: 'Orders',
    operator: TEXT.greaterThan,
    value: '5',
    valueBg: 'bg-blue-50',
    valueColor: 'text-blue-700',
  },
  {
    icon: Clock,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-500',
    field: 'Last Active',
    operator: TEXT.lessThan,
    value: '30 days',
    valueBg: 'bg-green-50',
    valueColor: 'text-green-700',
  },
] as const;

interface SegmentCardData {
  id: string;
  name: string;
  count: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  trend: string;
  trendUp: boolean;
  avgOrderValue: string;
  revenue: string;
}

const SEGMENT_CARDS: SegmentCardData[] = [
  { id: 'vip', name: 'VIP Customers', count: '234', icon: Star, iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', trend: '+12%', trendUp: true, avgOrderValue: '\u20B912,450', revenue: '\u20B929.1L' },
  { id: 'new', name: 'New Customers', count: '1,245', icon: UserPlus, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', trend: '+28%', trendUp: true, avgOrderValue: '\u20B92,340', revenue: '\u20B929.1L' },
  { id: 'returning', name: 'Returning', count: '8,456', icon: RefreshCw, iconBg: 'bg-green-100', iconColor: 'text-green-600', trend: '+8%', trendUp: true, avgOrderValue: '\u20B95,670', revenue: '\u20B94.79Cr' },
  { id: 'inactive', name: 'Inactive', count: '3,210', icon: Users, iconBg: 'bg-gray-100', iconColor: 'text-gray-500', trend: '-5%', trendUp: false, avgOrderValue: '\u20B93,120', revenue: '\u20B91.0Cr' },
  { id: 'at-risk', name: 'At Risk', count: '567', icon: AlertTriangle, iconBg: 'bg-red-100', iconColor: 'text-red-600', trend: '-15%', trendUp: false, avgOrderValue: '\u20B98,900', revenue: '\u20B950.5L' },
];

// ----------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------

function SegmentCard({ segment }: { segment: SegmentCardData }) {
  const Icon = segment.icon;
  return (
    <div className="cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-[3px] hover:shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', segment.iconBg)}>
            <Icon className={cn('h-5 w-5', segment.iconColor)} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{segment.name}</h3>
            <p className="text-2xl font-bold text-gray-900">{segment.count}</p>
          </div>
        </div>
        <span className={cn(
          'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
          segment.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        )}>
          {segment.trendUp
            ? <ArrowUpRight className="h-3 w-3" />
            : <ArrowDownRight className="h-3 w-3" />}
          {segment.trend}
        </span>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs text-gray-500">{TEXT.avgOrderValue}</p>
          <p className="text-sm font-semibold text-gray-900">{segment.avgOrderValue}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">{TEXT.revenue}</p>
          <p className="text-sm font-semibold text-gray-900">{segment.revenue}</p>
        </div>
      </div>
      <button className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-orange-50 px-3 py-2 text-xs font-medium text-orange-600 transition hover:bg-orange-100">
        <Send className="h-3.5 w-3.5" />
        {TEXT.createCampaignShort}
      </button>
    </div>
  );
}

// ----------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------

export function CustomerSegments() {
  const [isLoading] = useState(false);
  const [isError] = useState(false);
  const [isEmpty] = useState(false);

  /* Loading state */
  if (isLoading) {
    return (
      <div className="space-y-6" role="status" aria-label={TEXT.loadingLabel}>
        <div className="h-8 w-64 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-24 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-48 animate-pulse rounded-xl bg-gray-200" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-xl bg-gray-200" />
          ))}
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
        <button className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600">
          <Plus className="h-4 w-4" />
          {TEXT.createSegment}
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-6" aria-label={TEXT.pageTitle}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{TEXT.pageTitle}</h1>
          <p className="mt-1 text-sm text-gray-500">{TEXT.pageDescription}</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600">
          <Plus className="h-4 w-4" />
          {TEXT.createSegment}
        </button>
      </div>

      {/* Segment Distribution Overview Bar */}
      <div className="rounded-xl border border-gray-100 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">{TEXT.distributionTitle}</h2>
          <span className="text-xs text-gray-400">{TEXT.distributionTotal}</span>
        </div>
        <div className="mb-3 flex h-8 w-full overflow-hidden rounded-lg">
          {DISTRIBUTION_SEGMENTS.map((seg) => (
            <div
              key={seg.name}
              className={cn('flex h-8 items-center justify-center', seg.color)}
              style={{ width: `${seg.pct}%` }}
              title={`${seg.name}: ${seg.count.toLocaleString()}`}
            >
              {seg.showLabel && <span className={seg.labelClass}>{seg.label}</span>}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-5">
          {DISTRIBUTION_SEGMENTS.map((seg) => (
            <div key={seg.name} className="flex items-center gap-1.5">
              <div className={cn('h-2.5 w-2.5 rounded-full', seg.dotColor)} />
              <span className="text-xs text-gray-500">{seg.name} ({seg.count.toLocaleString()})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Segment Overlap Insights */}
      <div className="rounded-xl border border-gray-100 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">{TEXT.overlapTitle}</h2>
            <p className="mt-0.5 text-xs text-gray-400">{TEXT.overlapDescription}</p>
          </div>
          <button className="text-xs font-medium text-orange-500 hover:text-orange-600">{TEXT.viewFullMatrix}</button>
        </div>
        <div className="space-y-3">
          {OVERLAP_INSIGHTS.map((overlap) => (
            <div
              key={overlap.title}
              className={cn('flex items-center justify-between rounded-lg border p-3', overlap.bg, overlap.border)}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center -space-x-1">
                  {overlap.badges.map((badge, i) => (
                    <div
                      key={i}
                      className={cn('flex h-6 w-6 items-center justify-center rounded-full border-2 border-white', badge.bg)}
                    >
                      <span className="text-[9px] font-bold text-white">{badge.letter}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{overlap.title}</p>
                  <p className="text-xs text-gray-400">{overlap.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{overlap.count}</p>
                <p className="text-xs text-gray-400">{TEXT.customers}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Segment Builder Preview */}
      <div className="rounded-xl border border-gray-100 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">{TEXT.segmentBuilderTitle}</h2>
            <p className="mt-0.5 text-xs text-gray-400">{TEXT.segmentBuilderPreview}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">{TEXT.matchesLabel}</span>
            <span className="text-xs text-gray-400">{TEXT.updatedLive}</span>
          </div>
        </div>

        {/* Condition Cards */}
        <div className="mb-5 space-y-3">
          {BUILDER_CONDITIONS.map((cond, idx) => {
            const Icon = cond.icon;
            return (
              <div key={cond.field}>
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50/50 p-3 transition hover:border-orange-500">
                  <div className={cn('flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg', cond.iconBg)}>
                    <Icon className={cn('h-4 w-4', cond.iconColor)} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-700">{cond.field}</span>
                      <span className="text-xs font-bold text-orange-500">{cond.operator}</span>
                      <span className={cn('rounded px-2 py-0.5 text-xs font-bold', cond.valueBg, cond.valueColor)}>{cond.value}</span>
                    </div>
                  </div>
                  <button className="text-gray-300 transition hover:text-red-400">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {idx < BUILDER_CONDITIONS.length - 1 && (
                  <div className="flex items-center justify-center py-2">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-400">{TEXT.andLabel}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 text-xs font-medium text-orange-500 transition hover:text-orange-600">
            <Plus className="h-3.5 w-3.5" />
            {TEXT.addCondition}
          </button>
          <div className="flex-1" />
          <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            {TEXT.saveSegment}
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600">
            <Send className="h-4 w-4" />
            {TEXT.createCampaign}
          </button>
        </div>
      </div>

      {/* Segment Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {SEGMENT_CARDS.map((segment) => (
          <SegmentCard key={segment.id} segment={segment} />
        ))}
      </div>
    </section>
  );
}
