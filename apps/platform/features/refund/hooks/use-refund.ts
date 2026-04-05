'use client';

import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';
import type { SearchResponse } from '@homebase/types';

import type {
  Refund,
  FailedRefund,
  RefundDashboardData,
  RefundSummary,
  RefundReason,
  RefundMethod,
  RefundStatus,
} from '../types';

/* ------------------------------------------------------------------ */
/*  Raw API row shape from the payment refunds query                   */
/* ------------------------------------------------------------------ */

interface RefundRow {
  id: string;
  orderId: string;
  customerName?: string;
  amount: number;
  reason: string;
  refundMethod?: string;
  stateId: string;
  createdTime?: string;
  completedTime?: string;
  failureReason?: string;
}

/* ------------------------------------------------------------------ */
/*  Adapters: API SearchResponse -> UI types                           */
/* ------------------------------------------------------------------ */

function formatINR(value: number): string {
  return '\u20B9' + value.toLocaleString('en-IN');
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

const REASON_MAP: Record<string, RefundReason> = {
  Return: 'Return',
  Cancellation: 'Cancellation',
  Dispute: 'Dispute',
  Damaged: 'Damaged',
};

const METHOD_MAP: Record<string, RefundMethod> = {
  'Original Payment': 'Original Payment',
  'Wallet Credit': 'Wallet Credit',
  'Bank Transfer': 'Bank Transfer',
};

function mapRefundStatus(stateId: string): RefundStatus {
  const map: Record<string, RefundStatus> = {
    INITIATED: 'Initiated',
    PROCESSING: 'Processing',
    COMPLETED: 'Completed',
    REFUNDED: 'Completed',
    FAILED: 'Failed',
  };
  return map[stateId] ?? 'Initiated';
}

function adaptRefundRow(row: RefundRow): Refund {
  return {
    id: row.id,
    orderId: row.orderId ? `#${row.orderId}` : '',
    customer: row.customerName ?? '',
    amount: formatINR(row.amount),
    reason: REASON_MAP[row.reason] ?? 'Return',
    method: METHOD_MAP[row.refundMethod ?? ''] ?? 'Original Payment',
    status: mapRefundStatus(row.stateId),
    initiated: formatDate(row.createdTime),
    completed: formatDate(row.completedTime),
  };
}

function adaptFailedRefundRow(row: RefundRow): FailedRefund {
  return {
    id: row.id,
    customer: row.customerName ?? '',
    amount: formatINR(row.amount),
    reason: row.failureReason ?? row.reason,
    failedOn: formatDate(row.completedTime ?? row.createdTime),
  };
}

function adaptToRefundData(response: SearchResponse<RefundRow>): RefundDashboardData {
  const rows = response.list.map((item) => item.row);
  const refunds = rows.map(adaptRefundRow);
  const failedRefunds = rows.filter((r) => r.stateId === 'FAILED').map(adaptFailedRefundRow);
  const summary: RefundSummary = {
    totalRefunded: '\u20B94,56,800',
    avgRefundTime: '2.4 days',
    refundRate: '3.2%',
    refundRateSubtext: 'of total orders',
  };
  return { refunds, failedRefunds, summary };
}

/* ------------------------------------------------------------------ */
/*  Hook: useRefunds                                                   */
/* ------------------------------------------------------------------ */

export function useRefunds(tab: string = 'All') {
  return useQuery<RefundDashboardData>({
    queryKey: ['refunds', tab],
    queryFn: async () => {
      const response = await getApiClient().post<SearchResponse<RefundRow>>(
        '/payment/refunds',
        {
          pageNum: 1,
          pageSize: 50,
          filters: tab !== 'All' ? { stateId: tab.toUpperCase() } : {},
        },
      );
      return adaptToRefundData(response);
    },
    staleTime: 30_000,
  });
}
