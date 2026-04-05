'use client';

import { useState } from 'react';
import {
  Calendar, DollarSign, AlertTriangle, ChevronLeft, ChevronRight,
  Plus, X, Search, Inbox, RotateCcw,
} from 'lucide-react';
import { cn, Skeleton } from '@homebase/ui';

import { usePayoutCalendarStats, usePayoutCalendar } from '../hooks/use-payout-calendar';
import {
  mockCalendarDays,
  mockUpcomingPayouts,
  mockFailedPayouts,
  mockPayoutSchedule,
  mockPayoutCalendarStats,
} from '../services/payout-calendar-mock';
import type { PayoutFrequency, BankStatus } from '../services/payout-calendar-mock';

// ----------------------------------------------------------------
// Constants (i18n-ready)
// ----------------------------------------------------------------

const TEXT = {
  pageTitle: 'Payout Calendar',
  pageSubtitle: 'View scheduled payouts, manage payout dates, and track settlement cycles',
  schedulePayout: 'Schedule Payout',
  nextPayout: 'Next Payout',
  pendingAmount: 'Pending Amount',
  failedLastBatch: 'Failed Last Batch',
  calendarTitle: 'April 2026',
  upcomingPayouts: 'Upcoming Payouts',
  payoutFrequency: 'Payout Frequency',
  weeklyPayout: 'Weekly Payout',
  biWeekly: 'Bi-weekly',
  monthly: 'Monthly',
  weekly: 'Weekly',
  sellers: 'sellers',
  payoutSchedule: 'Payout Schedule',
  searchPlaceholder: 'Search sellers...',
  colSeller: 'Seller',
  colFrequency: 'Frequency',
  colNextDate: 'Next Date',
  colAmount: 'Amount',
  colBankStatus: 'Bank Status',
  colHoldReason: 'Hold Reason',
  failedPayouts: 'Failed Payouts',
  failedCount: '3 Failed',
  failedBatchDate: 'From batch: Mar 28, 2026',
  retry: 'Retry',
  emptyTitle: 'No payouts found',
  emptySubtitle: 'Try adjusting your filter criteria.',
  errorTitle: 'Failed to load payout data',
  retryButton: 'Retry',
} as const;

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

const FREQUENCY_COLORS: Record<PayoutFrequency, { dot: string; text: string; bg: string; badge: string; badgeText: string }> = {
  Weekly: { dot: 'bg-orange-500', text: 'text-orange-600', bg: 'bg-orange-50', badge: 'bg-orange-50', badgeText: 'text-orange-600' },
  'Bi-weekly': { dot: 'bg-blue-500', text: 'text-blue-600', bg: 'bg-blue-50', badge: 'bg-blue-50', badgeText: 'text-blue-600' },
  Monthly: { dot: 'bg-green-500', text: 'text-green-600', bg: 'bg-green-50', badge: 'bg-green-50', badgeText: 'text-green-600' },
};

const BANK_STATUS_STYLES: Record<BankStatus, string> = {
  Verified: 'bg-green-50 text-green-600',
  Pending: 'bg-yellow-50 text-yellow-600',
  Failed: 'bg-red-50 text-red-600',
};

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Build the calendar grid for April 2026 (starts on Wednesday, index 3) */
function buildApril2026Grid(): (number | null)[] {
  const daysInMonth = 30;
  const startDay = 3; // April 1, 2026 is Wednesday
  const grid: (number | null)[] = [];

  for (let i = 0; i < startDay; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);
  while (grid.length % 7 !== 0) grid.push(null);

  return grid;
}

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export function PayoutCalendar() {
  const [searchQuery, setSearchQuery] = useState('');
  const statsQuery = usePayoutCalendarStats();
  const listQuery = usePayoutCalendar('all');

  /* Loading state */
  if (statsQuery.isLoading || listQuery.isLoading) {
    return <PayoutCalendarSkeleton />;
  }

  /* Error state */
  if (statsQuery.isError || listQuery.isError) {
    return (
      <section className="flex flex-col items-center justify-center py-32" role="alert">
        <AlertTriangle className="h-12 w-12 text-red-400" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">{TEXT.errorTitle}</h2>
        <p className="mt-1 text-sm text-gray-500">
          {(statsQuery.error ?? listQuery.error)?.message}
        </p>
        <button
          onClick={() => { statsQuery.refetch(); listQuery.refetch(); }}
          className="mt-6 flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          <RotateCcw className="h-4 w-4" />
          {TEXT.retryButton}
        </button>
      </section>
    );
  }

  const stats = mockPayoutCalendarStats;
  const schedule = mockPayoutSchedule;
  const upcomingPayouts = mockUpcomingPayouts;
  const failedPayouts = mockFailedPayouts;
  const calendarGrid = buildApril2026Grid();
  const payoutDayMap = new Map(mockCalendarDays.map((d) => [d.day, d]));

  const filteredSchedule = searchQuery
    ? schedule.filter((p) => p.sellerName.toLowerCase().includes(searchQuery.toLowerCase()))
    : schedule;

  const isEmpty = filteredSchedule.length === 0;

  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{TEXT.pageTitle}</h1>
          <p className="mt-1 text-sm text-gray-500">{TEXT.pageSubtitle}</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600">
          <Plus className="h-4 w-4" />
          {TEXT.schedulePayout}
        </button>
      </div>

      {/* Stat Cards - 3 columns */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-3" aria-label="Payout statistics">
        {/* Next Payout */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{TEXT.nextPayout}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
              <Calendar className="h-5 w-5 text-orange-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.nextPayout.date}</p>
          <p className="mt-1 text-sm font-semibold text-orange-600">{stats.nextPayout.amount}</p>
          <p className="mt-0.5 text-xs text-gray-400">{stats.nextPayout.subtitle}</p>
        </div>

        {/* Pending Amount */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{TEXT.pendingAmount}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.pendingAmount.value}</p>
          <p className="mt-1 text-xs text-gray-400">{stats.pendingAmount.subtitle}</p>
        </div>

        {/* Failed Last Batch */}
        <div className="rounded-xl border border-red-100 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{TEXT.failedLastBatch}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.failedLastBatch.value}</p>
          <p className="mt-1 text-xs font-medium text-red-500">{stats.failedLastBatch.subtitle}</p>
        </div>
      </section>

      {/* Calendar + Sidebar */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Calendar Grid */}
        <section className="rounded-xl border border-gray-100 bg-white lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">{TEXT.calendarTitle}</h2>
            <div className="flex items-center gap-2">
              <button className="rounded-lg p-1.5 transition hover:bg-gray-100" aria-label="Previous month">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="rounded-lg p-1.5 transition hover:bg-gray-100" aria-label="Next month">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="p-4">
            {/* Day headers */}
            <div className="mb-2 grid grid-cols-7">
              {DAY_HEADERS.map((d) => (
                <div key={d} className="py-2 text-center text-xs font-semibold text-gray-400">
                  {d}
                </div>
              ))}
            </div>
            {/* Day cells */}
            <div className="grid grid-cols-7 gap-px">
              {calendarGrid.map((day, i) => {
                if (day === null) {
                  return <div key={`empty-${i}`} className="py-3 text-center text-sm text-gray-300" />;
                }
                const payoutDay = payoutDayMap.get(day);
                const hasP = !!payoutDay;
                const freq = payoutDay?.frequency;
                const colors = freq ? FREQUENCY_COLORS[freq] : null;

                return (
                  <div
                    key={day}
                    className={cn(
                      'rounded-lg py-3 text-center text-sm transition hover:bg-orange-50/60',
                      hasP && colors ? `font-bold ${colors.text} ${colors.bg}` : 'text-gray-700'
                    )}
                  >
                    {day}
                    {hasP && colors && (
                      <div className={cn('mx-auto mt-1 h-1.5 w-1.5 rounded-full', colors.dot)} />
                    )}
                  </div>
                );
              })}
            </div>
            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-3">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                <span className="text-xs text-gray-500">{TEXT.weeklyPayout}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <span className="text-xs text-gray-500">{TEXT.biWeekly}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="text-xs text-gray-500">{TEXT.monthly}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sidebar: Upcoming + Frequency */}
        <div className="space-y-6">
          {/* Upcoming Payouts */}
          <section className="rounded-xl border border-gray-100 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-base font-semibold text-gray-900">{TEXT.upcomingPayouts}</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {upcomingPayouts.map((p) => (
                <div key={p.id} className="px-5 py-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{p.sellerName}</span>
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(p.amount)}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs text-gray-400">{p.date}</span>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-semibold',
                        p.status === 'Pending'
                          ? 'bg-yellow-50 text-yellow-600'
                          : 'bg-blue-50 text-blue-600'
                      )}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Payout Frequency Summary */}
          <section className="rounded-xl border border-gray-100 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-base font-semibold text-gray-900">{TEXT.payoutFrequency}</h2>
            </div>
            <div className="space-y-4 p-5">
              <FrequencyBar label={TEXT.weekly} color="bg-orange-500" count={180} percentage={77} />
              <FrequencyBar label={TEXT.biWeekly} color="bg-blue-500" count={34} percentage={14.5} />
              <FrequencyBar label={TEXT.monthly} color="bg-green-500" count={20} percentage={8.5} />
            </div>
          </section>
        </div>
      </div>

      {/* Payout Schedule Table */}
      <section className="rounded-xl border border-gray-100 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">{TEXT.payoutSchedule}</h2>
          <input
            type="text"
            placeholder={TEXT.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-56 rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none transition focus:border-orange-300 focus:ring-1 focus:ring-orange-200"
          />
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Inbox className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-base font-semibold text-gray-900">{TEXT.emptyTitle}</h3>
            <p className="mt-1 text-sm text-gray-500">{TEXT.emptySubtitle}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <th className="px-6 py-3">{TEXT.colSeller}</th>
                  <th className="px-4 py-3">{TEXT.colFrequency}</th>
                  <th className="px-4 py-3">{TEXT.colNextDate}</th>
                  <th className="px-4 py-3">{TEXT.colAmount}</th>
                  <th className="px-4 py-3">{TEXT.colBankStatus}</th>
                  <th className="px-4 py-3">{TEXT.colHoldReason}</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedule.map((p, idx) => {
                  const freqColors = FREQUENCY_COLORS[p.frequency];
                  const isLast = idx === filteredSchedule.length - 1;
                  return (
                    <tr
                      key={p.id}
                      className={cn(
                        'transition-colors hover:bg-orange-50/40',
                        !isLast && 'border-b border-gray-50'
                      )}
                    >
                      <td className="px-6 py-3.5 font-medium">{p.sellerName}</td>
                      <td className="px-4 py-3.5">
                        <span className={cn('rounded px-2 py-1 text-xs font-semibold', freqColors.badge, freqColors.badgeText)}>
                          {p.frequency}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">{p.nextDate}</td>
                      <td className="px-4 py-3.5 font-semibold">{formatCurrency(p.amount)}</td>
                      <td className="px-4 py-3.5">
                        <span className={cn('rounded-full px-2 py-1 text-xs font-semibold', BANK_STATUS_STYLES[p.bankStatus])}>
                          {p.bankStatus}
                        </span>
                      </td>
                      <td className={cn(
                        'px-4 py-3.5 text-xs',
                        p.holdReason
                          ? (p.bankStatus === 'Pending' ? 'text-yellow-600' : 'text-red-600')
                          : 'text-gray-400'
                      )}>
                        {p.holdReason ?? '--'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Failed Payouts - Retry Section */}
      <section className="rounded-xl border border-red-200 bg-white">
        <div className="flex items-center justify-between rounded-t-xl border-b border-red-100 bg-red-50/50 px-6 py-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <h2 className="text-base font-semibold text-red-800">{TEXT.failedPayouts}</h2>
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">{TEXT.failedCount}</span>
          </div>
          <span className="text-xs text-red-500">{TEXT.failedBatchDate}</span>
        </div>
        <div className="divide-y divide-gray-100">
          {failedPayouts.map((fp) => (
            <div key={fp.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <X className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{fp.sellerName}</p>
                  <p className="text-xs text-gray-500">
                    Amount: <strong>{formatCurrency(fp.amount)}</strong> &middot; Account: {fp.account}
                  </p>
                  <p className="mt-0.5 text-xs text-red-600">Reason: {fp.reason}</p>
                </div>
              </div>
              <button className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-600">
                {TEXT.retry}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ----------------------------------------------------------------
// Frequency Bar Sub-component
// ----------------------------------------------------------------

interface FrequencyBarProps {
  label: string;
  color: string;
  count: number;
  percentage: number;
}

function FrequencyBar({ label, color, count, percentage }: FrequencyBarProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn('h-3 w-3 rounded-full', color)} />
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span className="text-sm font-bold text-gray-900">{count} {TEXT.sellers}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100">
        <div
          className={cn('h-2 rounded-full', color)}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${percentage}%`}
        />
      </div>
    </>
  );
}

// ----------------------------------------------------------------
// Loading skeleton
// ----------------------------------------------------------------

function PayoutCalendarSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-52" />
          <Skeleton className="mt-2 h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Skeleton className="h-96 rounded-xl lg:col-span-2" />
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
      <Skeleton className="h-96 rounded-xl" />
      <Skeleton className="h-56 rounded-xl" />
    </div>
  );
}
