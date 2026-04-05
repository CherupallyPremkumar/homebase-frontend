/**
 * Mock data for the Refund Management page.
 *
 * Each export matches the shape returned by the real API contract.
 * When the backend endpoints are ready, swap the mock imports in
 * the hook for real fetch calls -- no component changes needed.
 */

import type {
  Refund,
  FailedRefund,
  RefundTab,
  RefundSummary,
  RefundDetail,
  RefundDashboardData,
} from '../types';

/* ------------------------------------------------------------------ */
/*  Tabs                                                               */
/* ------------------------------------------------------------------ */

export const MOCK_REFUND_TABS: RefundTab[] = [
  { label: 'All', count: 234 },
  { label: 'Initiated', count: 5 },
  { label: 'Processing', count: 12 },
  { label: 'Completed', count: 215 },
  { label: 'Failed', count: 7 },
];

/* ------------------------------------------------------------------ */
/*  Summary                                                            */
/* ------------------------------------------------------------------ */

export const MOCK_REFUND_SUMMARY: RefundSummary = {
  totalRefunded: '\u20B94,56,800',
  avgRefundTime: '2.4 days',
  refundRate: '3.2%',
  refundRateSubtext: 'of total orders',
};

/* ------------------------------------------------------------------ */
/*  Refund rows                                                        */
/* ------------------------------------------------------------------ */

export const MOCK_REFUNDS: Refund[] = [
  { id: 'RF-1001', orderId: '#HB-78234', customer: 'Rajesh Kumar',  amount: '\u20B912,500',  reason: 'Return',       method: 'Original Payment', status: 'Completed',  initiated: '22 Mar 2026', completed: '25 Mar 2026' },
  { id: 'RF-1002', orderId: '#HB-78245', customer: 'Priya Sharma',  amount: '\u20B93,200',   reason: 'Cancellation', method: 'Wallet Credit',    status: 'Processing', initiated: '26 Mar 2026', completed: '-' },
  { id: 'RF-1003', orderId: '#HB-78190', customer: 'Amit Patel',    amount: '\u20B98,750',   reason: 'Dispute',      method: 'Bank Transfer',    status: 'Completed',  initiated: '18 Mar 2026', completed: '22 Mar 2026' },
  { id: 'RF-1004', orderId: '#HB-78301', customer: 'Sunita Reddy',  amount: '\u20B924,900',  reason: 'Damaged',      method: 'Original Payment', status: 'Failed',     initiated: '20 Mar 2026', completed: '-' },
  { id: 'RF-1005', orderId: '#HB-78312', customer: 'Vikram Singh',  amount: '\u20B95,600',   reason: 'Return',       method: 'Wallet Credit',    status: 'Completed',  initiated: '24 Mar 2026', completed: '26 Mar 2026' },
  { id: 'RF-1006', orderId: '#HB-78280', customer: 'Meena Gupta',   amount: '\u20B91,890',   reason: 'Cancellation', method: 'Original Payment', status: 'Initiated',  initiated: '27 Mar 2026', completed: '-' },
  { id: 'RF-1007', orderId: '#HB-78350', customer: 'Anish Joshi',   amount: '\u20B945,000',  reason: 'Damaged',      method: 'Bank Transfer',    status: 'Processing', initiated: '25 Mar 2026', completed: '-' },
  { id: 'RF-1008', orderId: '#HB-78298', customer: 'Kavita Nair',   amount: '\u20B97,200',   reason: 'Dispute',      method: 'Original Payment', status: 'Completed',  initiated: '21 Mar 2026', completed: '24 Mar 2026' },
];

/* ------------------------------------------------------------------ */
/*  Failed refunds                                                     */
/* ------------------------------------------------------------------ */

export const MOCK_FAILED_REFUNDS: FailedRefund[] = [
  { id: 'RF-1004', customer: 'Sunita Reddy', amount: '\u20B924,900', reason: 'Bank rejected - Account number mismatch',   failedOn: '23 Mar 2026' },
  { id: 'RF-0998', customer: 'Deepak Menon', amount: '\u20B915,400', reason: 'Invalid bank account - IFSC code incorrect', failedOn: '19 Mar 2026' },
  { id: 'RF-0992', customer: 'Rohit Kapoor', amount: '\u20B99,800',  reason: 'Gateway timeout - Razorpay processing error', failedOn: '17 Mar 2026' },
];

/* ------------------------------------------------------------------ */
/*  Refund detail (for slide-over modal)                               */
/* ------------------------------------------------------------------ */

export const MOCK_REFUND_DETAIL: RefundDetail = {
  id: 'RF-1001',
  orderId: '#HB-78234',
  amount: '\u20B912,500',
  customer: 'Rajesh Kumar',
  method: 'Original Payment (UPI)',
  reason: 'Return - Product not as described',
  bankRef: 'REF-RPY-78234-A1B2',
  status: 'Completed',
  timeline: [
    { label: 'Initiated',  date: '22 Mar 2026, 2:15 PM',  description: 'Customer requested return refund' },
    { label: 'Approved',   date: '22 Mar 2026, 4:30 PM',  description: 'Auto-approved by system (return verified)' },
    { label: 'Processing', date: '23 Mar 2026, 10:00 AM',  description: 'Sent to Razorpay for processing' },
    { label: 'Completed',  date: '25 Mar 2026, 11:45 AM',  description: 'Refund credited to customer UPI', isFinal: true },
  ],
};

/* ------------------------------------------------------------------ */
/*  Combined dashboard data                                            */
/* ------------------------------------------------------------------ */

export const MOCK_REFUND_DATA: RefundDashboardData = {
  refunds: MOCK_REFUNDS,
  failedRefunds: MOCK_FAILED_REFUNDS,
  summary: MOCK_REFUND_SUMMARY,
};

/* ------------------------------------------------------------------ */
/*  Sample orders (for Initiate Refund modal auto-lookup)              */
/* ------------------------------------------------------------------ */

export const SAMPLE_ORDERS: Record<string, { customer: string; amount: number }> = {
  'HB-78234': { customer: 'Rajesh Kumar', amount: 12500 },
  'HB-78245': { customer: 'Priya Sharma', amount: 3200 },
  'HB-78190': { customer: 'Amit Patel',   amount: 8750 },
  'HB-78301': { customer: 'Sunita Reddy', amount: 24900 },
  'HB-78312': { customer: 'Vikram Singh', amount: 5600 },
  'HB-78280': { customer: 'Meena Gupta',  amount: 1890 },
  'HB-78350': { customer: 'Anish Joshi',  amount: 45000 },
  'HB-78298': { customer: 'Kavita Nair',  amount: 7200 },
};
