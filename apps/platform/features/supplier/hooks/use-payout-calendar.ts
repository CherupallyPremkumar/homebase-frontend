'use client';

import { useQuery } from '@tanstack/react-query';
import { settlementsApi } from '@homebase/api-client';
import type { Settlement, SearchResponse } from '@homebase/types';

import type { PayoutEntry, PayoutCalendarStats } from '../services/payout-calendar-mock';

// ----------------------------------------------------------------
// Adapter: Settlement (API) -> PayoutEntry / PayoutCalendarStats (UI)
// ----------------------------------------------------------------

function toPayoutEntry(settlement: Settlement): PayoutEntry {
  const statusMap: Record<string, PayoutEntry['status']> = {
    SCHEDULED: 'Scheduled',
    CALCULATING: 'Pending',
    PENDING_APPROVAL: 'Pending',
    APPROVED: 'Scheduled',
    DISBURSED: 'Completed',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
    REJECTED: 'Failed',
  };

  const bankStatusMap: Record<string, PayoutEntry['bankStatus']> = {
    SCHEDULED: 'Verified',
    APPROVED: 'Verified',
    DISBURSED: 'Verified',
    COMPLETED: 'Verified',
    CALCULATING: 'Pending',
    PENDING_APPROVAL: 'Pending',
    FAILED: 'Failed',
    REJECTED: 'Failed',
  };

  const dateStr = settlement.periodEnd ?? settlement.settlementPeriodEnd ?? '';
  const nextDateFormatted = dateStr
    ? new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    : '--';

  return {
    id: settlement.id,
    sellerName: settlement.supplierName ?? settlement.supplierId,
    sellerId: settlement.supplierId,
    amount: settlement.netPayout ?? settlement.netAmount ?? 0,
    date: dateStr,
    nextDate: nextDateFormatted,
    status: statusMap[settlement.stateId] ?? 'Scheduled',
    paymentMethod: 'Bank Transfer',
    frequency: 'Weekly',
    bankStatus: bankStatusMap[settlement.stateId] ?? 'Pending',
    holdReason: null,
  };
}

function toStats(response: SearchResponse<Settlement>): PayoutCalendarStats {
  const list = response.list?.map((r) => r.row) ?? [];
  const pending = list.filter((s) =>
    ['SCHEDULED', 'CALCULATING', 'PENDING_APPROVAL', 'APPROVED'].includes(s.stateId),
  );
  const totalAmount = pending.reduce((sum, s) => sum + (s.netPayout ?? s.netAmount ?? 0), 0);
  const formatted = totalAmount >= 10000000
    ? `\u20B9${(totalAmount / 10000000).toFixed(1)} Cr`
    : totalAmount >= 100000
      ? `\u20B9${(totalAmount / 100000).toFixed(1)}L`
      : `\u20B9${totalAmount.toLocaleString('en-IN')}`;

  // Find nearest future payout date
  const now = new Date();
  const futureDates = pending
    .map((s) => s.periodEnd ?? s.settlementPeriodEnd ?? '')
    .filter((d) => d && new Date(d) > now)
    .sort();
  const nextDate = futureDates[0];
  const nextDateStr = nextDate
    ? new Date(nextDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
    : '-';

  // Sum next payout batch amount
  const nextBatchAmount = nextDate
    ? pending
        .filter((s) => (s.periodEnd ?? s.settlementPeriodEnd) === nextDate)
        .reduce((sum, s) => sum + (s.netPayout ?? s.netAmount ?? 0), 0)
    : 0;
  const nextBatchFormatted = nextBatchAmount >= 100000
    ? `\u20B9${(nextBatchAmount / 100000).toFixed(1)}L`
    : `\u20B9${nextBatchAmount.toLocaleString('en-IN')}`;

  const failed = list.filter((s) => ['FAILED', 'REJECTED'].includes(s.stateId));

  return {
    nextPayout: {
      date: nextDateStr,
      amount: nextBatchFormatted,
      subtitle: `For ${pending.length} weekly sellers`,
    },
    pendingAmount: {
      value: formatted,
      subtitle: `Across ${pending.length} sellers`,
    },
    failedLastBatch: {
      value: `${failed.length} sellers`,
      subtitle: failed.length > 0 ? 'Requires immediate attention' : 'All clear',
    },
  };
}

// ----------------------------------------------------------------
// Payout Calendar Stats
// ----------------------------------------------------------------

export function usePayoutCalendarStats() {
  return useQuery<PayoutCalendarStats>({
    queryKey: ['payout-calendar-stats'],
    queryFn: async () => {
      const response = await settlementsApi.search({ pageNum: 1, pageSize: 100 });
      return toStats(response);
    },
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// Payout Calendar List (filtered by tab)
// ----------------------------------------------------------------

export function usePayoutCalendar(tab: string = 'all') {
  return useQuery<PayoutEntry[]>({
    queryKey: ['payout-calendar', tab],
    queryFn: async () => {
      const filters: Record<string, string> = {};
      if (tab !== 'all') {
        const tabMap: Record<string, string> = {
          Scheduled: 'SCHEDULED',
          Pending: 'CALCULATING',
          Completed: 'DISBURSED',
          Failed: 'FAILED',
        };
        const stateId = tabMap[tab];
        if (stateId) filters.stateId = stateId;
      }
      const response = await settlementsApi.search({ pageNum: 1, pageSize: 50, filters });
      return (response.list ?? []).map((r) => toPayoutEntry(r.row));
    },
    staleTime: 30_000,
  });
}
