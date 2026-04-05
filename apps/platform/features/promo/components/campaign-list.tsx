'use client';

import { useCallback, useState } from 'react';
import {
  BarChart3,
  Bell,
  Clock,
  Lightbulb,
  Mail,
  MousePointerClick,
  Plus,
  RefreshCw,
  Send,
  ShoppingCart,
  Smartphone,
  Sparkles,
  UserRound,
  AlertCircle,
  Inbox,
} from 'lucide-react';
import { cn, Skeleton, StatusBadge } from '@homebase/ui';

import { useCampaignStats, useCampaignList } from '../hooks/use-campaigns';
import {
  mockCampaignTabs,
  mockCampaignTemplates,
} from '../services/campaign-mock';
import type { CampaignMgmtStatus, CampaignMgmtChannel } from '../types';

// ----------------------------------------------------------------
// Constants (i18n-ready)
// ----------------------------------------------------------------

const TEXT = {
  pageTitle: 'Marketing Campaigns',
  pageDescription: 'Create, manage and track marketing campaigns across all channels',
  scheduleCampaign: 'Schedule Campaign',
  createCampaign: 'Create Campaign',
  statActive: 'Active Campaigns',
  statSent: 'Sent This Month',
  statOpenRate: 'Open Rate',
  statClickRate: 'Click Rate',
  sendTimeTitle: 'Optimal Send Time',
  sendTimeBody: 'Best engagement: ',
  sendTimeWindow: 'Tue-Thu 10AM-12PM',
  sendTimeSuffix: '. Your last 3 campaigns sent during this window had ',
  sendTimeHighlight: '35% higher open rates',
  sendTimeTail: ' vs off-peak sends.',
  channelLabel: 'Channel:',
  tableTitle: 'Campaign Performance',
  colCampaignName: 'Campaign Name',
  colType: 'Type',
  colSent: 'Sent',
  colOpened: 'Opened',
  colClicked: 'Clicked',
  colConversions: 'Conversions',
  colRevenue: 'Revenue',
  colStatus: 'Status',
  colActions: 'Actions',
  actionView: 'View',
  actionClone: 'Clone',
  paginationShowing: 'Showing 8 of 23 campaigns',
  paginationPrev: 'Previous',
  paginationNext: 'Next',
  templateTitle: 'Campaign Templates',
  templateUse: 'Use Template',
  statusAll: 'All Status',
  timeLast30: 'Last 30 Days',
  timeLast7: 'Last 7 Days',
  timeLast90: 'Last 90 Days',
  timeThisYear: 'This Year',
  empty: 'No campaigns found',
  errorTitle: 'Failed to load campaigns',
  errorDescription: 'Please check your connection and try again.',
  retry: 'Retry',
  emptyTitle: 'No campaign data available',
  emptyDescription: 'Data will appear here once available.',
  // Modal
  modalTitle: 'Schedule New Campaign',
  modalNameLabel: 'Campaign Name',
  modalNamePlaceholder: 'e.g., April Flash Sale',
  modalChannelLabel: 'Channel',
  modalSegmentLabel: 'Target Segment',
  modalSendDateLabel: 'Send Date',
  modalSendTimeLabel: 'Send Time',
  modalCancel: 'Cancel',
  modalSchedule: 'Schedule Campaign',
  modalHint: 'Recommended: Tue-Thu 10AM-12PM for best engagement',
} as const;

const SEGMENTS = [
  'All Customers',
  'Active Buyers (30d)',
  'High Spenders',
  'Loyalty Members',
  'Abandoned Carts',
  'Inactive 30d+',
  'New Signups (7d)',
] as const;

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function getStatusVariant(status: CampaignMgmtStatus) {
  switch (status) {
    case 'Active': return 'success' as const;
    case 'Scheduled': return 'warning' as const;
    case 'Completed': return 'neutral' as const;
    case 'Draft': return 'warning' as const;
    default: return 'neutral' as const;
  }
}

const CHANNEL_BADGE: Record<CampaignMgmtChannel, string> = {
  Email: 'bg-blue-100 text-blue-700',
  SMS: 'bg-purple-100 text-purple-700',
  Push: 'bg-green-100 text-green-700',
};

function formatNumber(n: number): string {
  return n.toLocaleString('en-IN');
}

function templateIcon(icon: string) {
  switch (icon) {
    case 'UserRound': return <UserRound className="h-5 w-5" />;
    case 'Sparkles': return <Sparkles className="h-5 w-5" />;
    case 'ShoppingCart': return <ShoppingCart className="h-5 w-5" />;
    case 'RefreshCw': return <RefreshCw className="h-5 w-5" />;
    default: return <Sparkles className="h-5 w-5" />;
  }
}

// ----------------------------------------------------------------
// Sub-components: Loading / Error / Empty
// ----------------------------------------------------------------

function CampaignSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300" role="status" aria-label="Loading campaigns">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-44 rounded-lg" />
          <Skeleton className="h-10 w-44 rounded-lg" />
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
      {/* Table */}
      <Skeleton className="h-[480px] w-full rounded-xl" />
      <span className="sr-only">Loading campaign data...</span>
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
// Schedule Campaign Modal
// ----------------------------------------------------------------

function ScheduleModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">{TEXT.modalTitle}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 transition hover:text-gray-600"
            aria-label="Close modal"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Campaign Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {TEXT.modalNameLabel}
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              placeholder={TEXT.modalNamePlaceholder}
            />
          </div>

          {/* Channel */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {TEXT.modalChannelLabel}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Email', 'SMS', 'Push'] as const).map((ch, i) => (
                <label key={ch} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="channel"
                    value={ch.toLowerCase()}
                    className="peer sr-only"
                    defaultChecked={i === 0}
                  />
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-600 transition peer-checked:border-orange-400 peer-checked:bg-orange-50 peer-checked:text-orange-700">
                    {ch === 'Email' && <Mail className="h-4 w-4" />}
                    {ch === 'SMS' && <Smartphone className="h-4 w-4" />}
                    {ch === 'Push' && <Bell className="h-4 w-4" />}
                    {ch}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Target Segment */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {TEXT.modalSegmentLabel}
            </label>
            <select className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100">
              {SEGMENTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Date / Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {TEXT.modalSendDateLabel}
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {TEXT.modalSendTimeLabel}
              </label>
              <input
                type="time"
                defaultValue="10:00"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          {/* Hint */}
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3">
            <Lightbulb className="h-4 w-4 flex-shrink-0 text-blue-500" aria-hidden="true" />
            <p className="text-xs text-blue-700">{TEXT.modalHint}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            {TEXT.modalCancel}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            {TEXT.modalSchedule}
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------

export function CampaignList() {
  const [activeChannel, setActiveChannel] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const tabs = mockCampaignTabs;

  const statsQuery = useCampaignStats();
  const listQuery = useCampaignList(tabs[activeChannel]?.label);

  const handleRetry = useCallback(() => {
    statsQuery.refetch();
    listQuery.refetch();
  }, [statsQuery, listQuery]);

  // ---- Loading ----
  if (statsQuery.isLoading && listQuery.isLoading) return <CampaignSkeleton />;

  // ---- Error ----
  if (statsQuery.isError && listQuery.isError) {
    return <ErrorBanner message={TEXT.errorTitle} onRetry={handleRetry} />;
  }

  // ---- Empty ----
  if (!statsQuery.data && !listQuery.data) return <EmptyState />;

  const stats = statsQuery.data;
  const campaigns = listQuery.data ?? [];

  return (
    <div className="space-y-6">
      {/* ==============================================================
          Page Header
          ============================================================== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{TEXT.pageTitle}</h1>
          <p className="mt-1 text-sm text-gray-500">{TEXT.pageDescription}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
          >
            <Clock className="h-4 w-4" aria-hidden="true" />
            {TEXT.scheduleCampaign}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {TEXT.createCampaign}
          </button>
        </div>
      </div>

      {/* ==============================================================
          Stats
          ============================================================== */}
      <section aria-label="Campaign statistics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Active Campaigns */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {TEXT.statActive}
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {stats?.activeCampaigns ?? '--'}
                </p>
                <p className="mt-1 text-xs font-medium text-green-600">
                  {stats?.activeTrend ?? ''}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <BarChart3 className="h-5 w-5 text-green-600" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Sent This Month */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {TEXT.statSent}
                </p>
                <p className="mt-1 text-2xl font-bold text-orange-500">
                  {stats?.sentThisMonth ?? '--'}
                </p>
                <p className="mt-1 text-xs font-medium text-green-600">
                  {stats?.sentTrend ?? ''}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                <Send className="h-5 w-5 text-orange-600" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Open Rate */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {TEXT.statOpenRate}
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {stats?.openRate ?? '--'}
                </p>
                <p className="mt-1 text-xs font-medium text-green-600">
                  {stats?.openBenchmark ?? ''}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Mail className="h-5 w-5 text-blue-600" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Click Rate */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {TEXT.statClickRate}
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {stats?.clickRate ?? '--'}
                </p>
                <p className="mt-1 text-xs font-medium text-green-600">
                  {stats?.clickBenchmark ?? ''}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <MousePointerClick className="h-5 w-5 text-purple-600" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          Optimal Send Time Hint
          ============================================================== */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
          <Lightbulb className="h-4 w-4 text-blue-600" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-blue-900">{TEXT.sendTimeTitle}</p>
          <p className="mt-0.5 text-sm text-blue-700">
            {TEXT.sendTimeBody}
            <span className="font-semibold">{TEXT.sendTimeWindow}</span>
            {TEXT.sendTimeSuffix}
            <span className="font-semibold">{TEXT.sendTimeHighlight}</span>
            {TEXT.sendTimeTail}
          </p>
        </div>
      </div>

      {/* ==============================================================
          Channel Filters
          ============================================================== */}
      <div className="flex items-center gap-2">
        <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          {TEXT.channelLabel}
        </span>
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActiveChannel(i)}
            className={cn(
              'inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition',
              activeChannel === i
                ? 'border-orange-300 bg-orange-50 text-orange-700'
                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
            )}
          >
            {tab.label === 'Email' && <Mail className="h-3.5 w-3.5" />}
            {tab.label === 'SMS' && <Smartphone className="h-3.5 w-3.5" />}
            {tab.label === 'Push' && <Bell className="h-3.5 w-3.5" />}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==============================================================
          Campaign Performance Table
          ============================================================== */}
      <section aria-label="Campaign performance">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Table Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">{TEXT.tableTitle}</h2>
            <div className="flex items-center gap-2">
              <select className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 outline-none transition focus:border-orange-400">
                <option>{TEXT.statusAll}</option>
                <option>Active</option>
                <option>Completed</option>
                <option>Draft</option>
                <option>Scheduled</option>
              </select>
              <select className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 outline-none transition focus:border-orange-400">
                <option>{TEXT.timeLast30}</option>
                <option>{TEXT.timeLast7}</option>
                <option>{TEXT.timeLast90}</option>
                <option>{TEXT.timeThisYear}</option>
              </select>
            </div>
          </div>

          {/* Table Content */}
          {listQuery.isLoading ? (
            <div className="space-y-3 p-6">
              <Skeleton className="h-10 w-full" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : campaigns.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {TEXT.colCampaignName}
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {TEXT.colType}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {TEXT.colSent}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {TEXT.colOpened}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {TEXT.colClicked}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {TEXT.colConversions}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {TEXT.colRevenue}
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {TEXT.colStatus}
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {TEXT.colActions}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {campaigns.map((c) => (
                      <tr
                        key={c.id}
                        className="transition-colors hover:bg-orange-50/40"
                      >
                        {/* Campaign Name */}
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{c.name}</div>
                          <div className="mt-0.5 text-xs text-gray-400">{c.subtitle}</div>
                        </td>

                        {/* Channel Type */}
                        <td className="px-4 py-4">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                              CHANNEL_BADGE[c.channel]
                            )}
                          >
                            {c.channel}
                          </span>
                        </td>

                        {/* Sent */}
                        <td className="px-4 py-4 text-right font-medium text-gray-700">
                          {formatNumber(c.sent)}
                        </td>

                        {/* Opened */}
                        <td className="px-4 py-4 text-right">
                          {c.opened != null ? (
                            <>
                              <span className="font-medium text-gray-900">
                                {formatNumber(c.opened)}
                              </span>
                              {c.openRate != null && (
                                <span className="ml-1 text-xs text-gray-400">
                                  ({c.openRate}%)
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="font-medium text-gray-400">N/A</span>
                          )}
                        </td>

                        {/* Clicked */}
                        <td className="px-4 py-4 text-right">
                          <span className="font-medium text-gray-900">
                            {formatNumber(c.clicked)}
                          </span>
                          <span className="ml-1 text-xs text-gray-400">
                            ({c.clickRate}%)
                          </span>
                        </td>

                        {/* Conversions */}
                        <td className="px-4 py-4 text-right font-medium text-gray-900">
                          {c.conversions > 0 ? c.conversions : '--'}
                        </td>

                        {/* Revenue */}
                        <td className="px-4 py-4 text-right font-semibold text-green-700">
                          {c.revenue !== '--' ? c.revenue : (
                            <span className="font-medium text-gray-400">--</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          <StatusBadge
                            status={c.status}
                            variant={getStatusVariant(c.status)}
                          />
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="text-xs font-medium text-orange-500 transition hover:text-orange-600"
                            >
                              {TEXT.actionView}
                            </button>
                            <button
                              type="button"
                              className="text-xs font-medium text-gray-400 transition hover:text-gray-600"
                            >
                              {TEXT.actionClone}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer / Pagination */}
              <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3">
                <p className="text-xs text-gray-500">{TEXT.paginationShowing}</p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-400"
                    disabled
                  >
                    {TEXT.paginationPrev}
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white"
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
                    {TEXT.paginationNext}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="px-6 py-8 text-center text-sm text-gray-400">
              {TEXT.empty}
            </div>
          )}
        </div>
      </section>

      {/* ==============================================================
          Campaign Templates
          ============================================================== */}
      <section aria-label="Campaign templates">
        <h2 className="mb-4 text-base font-semibold text-gray-900">
          {TEXT.templateTitle}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {mockCampaignTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
            >
              <div
                className={cn(
                  'mb-3 flex h-10 w-10 items-center justify-center rounded-lg',
                  tpl.iconBg,
                  tpl.iconColor
                )}
              >
                {templateIcon(tpl.icon)}
              </div>
              <h3 className="text-sm font-semibold text-gray-900">{tpl.title}</h3>
              <p className="mt-1 text-xs text-gray-500">{tpl.description}</p>
              <button
                type="button"
                className="mt-3 text-xs font-medium text-orange-500 transition hover:text-orange-600"
              >
                {TEXT.templateUse} &rarr;
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ==============================================================
          Schedule Campaign Modal
          ============================================================== */}
      <ScheduleModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
