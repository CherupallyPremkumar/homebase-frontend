'use client';

import { useQuery } from '@tanstack/react-query';
import { settlementsApi } from '@homebase/api-client';
import type { Settlement, SearchResponse } from '@homebase/types';

import { MOCK_SETTLEMENTS } from '../services/mock-data';
import type { SettlementItem } from '../services/mock-data';

// ----------------------------------------------------------------
// Adapter: API Settlement -> UI SettlementItem
// ----------------------------------------------------------------

const gradientPalette = [
  'from-blue-400 to-blue-600',
  'from-emerald-400 to-emerald-600',
  'from-pink-400 to-pink-600',
  'from-violet-400 to-violet-600',
  'from-amber-400 to-amber-600',
  'from-teal-400 to-teal-600',
  'from-rose-400 to-rose-600',
  'from-cyan-400 to-cyan-600',
];

function formatINR(value: number): string {
  return '\u20B9' + new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function mapSettlementStatus(stateId: string): SettlementItem['status'] {
  const map: Record<string, SettlementItem['status']> = {
    CREATED: 'Pending',
    CALCULATING: 'Processing',
    CALCULATED: 'Processing',
    PENDING_APPROVAL: 'Pending',
    APPROVED: 'Processing',
    PROCESSING: 'Processing',
    COMPLETED: 'Completed',
    PAID: 'Completed',
    FAILED: 'Failed',
    DISPUTED: 'Disputed',
  };
  return map[stateId] ?? 'Pending';
}

function adaptSettlement(s: Settlement, index: number): SettlementItem {
  const name = s.supplierName ?? s.supplierId ?? '';
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const periodStart = s.periodStart ?? s.settlementPeriodStart ?? '';
  const periodEnd = s.periodEnd ?? s.settlementPeriodEnd ?? '';

  const formatPeriod = (d: string) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  const gross = s.grossAmount ?? s.orderAmount ?? 0;
  const fee = s.platformFees ?? s.platformFee ?? 0;
  const gst = s.gstOnCommission ?? 0;
  const tds = Math.round(gross * 0.01);
  const net = s.netPayout ?? s.netAmount ?? 0;

  return {
    id: s.id,
    initials,
    gradient: gradientPalette[index % gradientPalette.length]!,
    seller: name,
    period: periodStart && periodEnd ? `${formatPeriod(periodStart)} - ${formatPeriod(periodEnd)}` : '',
    gross: formatINR(gross),
    fee: `-${formatINR(fee)}`,
    gst: `-${formatINR(gst)}`,
    net: formatINR(net),
    status: mapSettlementStatus(s.stateId),
    payoutDate: s.stateId === 'COMPLETED' || s.stateId === 'PAID'
      ? formatDate(s.lastModifiedTime)
      : '--',
    breakdown: {
      grossSales: formatINR(gross),
      commission: `-${formatINR(fee)}`,
      gstOnFee: `-${formatINR(gst)}`,
      tds: `-${formatINR(tds)}`,
      adjustmentAmount: `+${formatINR(tds)}`,
      adjustmentLabel: 'Adjustment',
      netPayout: formatINR(net),
    },
  };
}

function adaptSettlements(response: SearchResponse<Settlement>): SettlementItem[] {
  return response.list.map((item, index) => adaptSettlement(item.row, index));
}

// ----------------------------------------------------------------
// Settlement List (all settlements)
// ----------------------------------------------------------------

export function useSettlements(tab: string = 'All') {
  return useQuery<SettlementItem[]>({
    queryKey: ['settlements', tab],
    queryFn: async () => {
      try {
        const response = await settlementsApi.search({
          pageNum: 1,
          pageSize: 50,
          filters: tab !== 'All' ? { stateId: tab.toUpperCase() } : {},
        });
        return adaptSettlements(response);
      } catch {
        // Fallback to mock data during development
        const filtered = tab === 'All'
          ? MOCK_SETTLEMENTS
          : MOCK_SETTLEMENTS.filter((s) => s.status === tab);
        return filtered;
      }
    },
    staleTime: 30_000,
  });
}
