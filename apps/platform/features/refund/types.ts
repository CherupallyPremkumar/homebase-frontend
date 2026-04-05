/**
 * Types for the Refund Management feature.
 */

export type RefundStatus = 'Completed' | 'Processing' | 'Initiated' | 'Failed';
export type RefundReason = 'Return' | 'Cancellation' | 'Dispute' | 'Damaged';
export type RefundMethod = 'Original Payment' | 'Wallet Credit' | 'Bank Transfer';

export interface Refund {
  id: string;
  orderId: string;
  customer: string;
  amount: string;
  reason: RefundReason;
  method: RefundMethod;
  status: RefundStatus;
  initiated: string;
  completed: string;
}

export interface FailedRefund {
  id: string;
  customer: string;
  amount: string;
  reason: string;
  failedOn: string;
}

export interface RefundTab {
  label: string;
  count: number;
}

export interface RefundSummary {
  totalRefunded: string;
  avgRefundTime: string;
  refundRate: string;
  refundRateSubtext: string;
}

export interface RefundTimelineEntry {
  label: string;
  date: string;
  description: string;
  isFinal?: boolean;
}

export interface RefundDetail {
  id: string;
  orderId: string;
  amount: string;
  customer: string;
  method: string;
  reason: string;
  bankRef: string;
  status: RefundStatus;
  timeline: RefundTimelineEntry[];
}

export interface RefundDashboardData {
  refunds: Refund[];
  failedRefunds: FailedRefund[];
  summary: RefundSummary;
}
