/**
 * Mock data for Payout Calendar page.
 *
 * Each export matches the shape returned by the real API contract.
 * When backend endpoints are ready, swap the mock imports in the
 * hook for real fetch calls -- no component changes needed.
 */

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export type PayoutStatus = 'Scheduled' | 'Pending' | 'Completed' | 'Failed';
export type BankStatus = 'Verified' | 'Pending' | 'Failed';
export type PaymentMethod = 'Bank Transfer' | 'UPI' | 'NEFT' | 'RTGS';
export type PayoutFrequency = 'Weekly' | 'Bi-weekly' | 'Monthly';

export interface PayoutEntry {
  id: string;
  sellerName: string;
  sellerId: string;
  amount: number;
  date: string;
  nextDate: string;
  status: PayoutStatus;
  paymentMethod: PaymentMethod;
  frequency: PayoutFrequency;
  bankStatus: BankStatus;
  holdReason: string | null;
}

export interface PayoutCalendarStats {
  nextPayout: { date: string; amount: string; subtitle: string };
  pendingAmount: { value: string; subtitle: string };
  failedLastBatch: { value: string; subtitle: string };
}

export interface PayoutCalendarTab {
  key: string;
  label: string;
  count: number;
}

export interface CalendarPayoutDay {
  day: number;
  frequency: PayoutFrequency | null;
  payoutCount: number;
}

export interface FailedPayout {
  id: string;
  sellerName: string;
  amount: number;
  account: string;
  reason: string;
}

// ----------------------------------------------------------------
// Mock Stats
// ----------------------------------------------------------------

export const mockPayoutCalendarStats: PayoutCalendarStats = {
  nextPayout: { date: 'Apr 5, 2026', amount: '\u20B945.8L', subtitle: 'For 180 weekly sellers' },
  pendingAmount: { value: '\u20B91.2 Cr', subtitle: 'Across 42 sellers' },
  failedLastBatch: { value: '3 sellers', subtitle: 'Requires immediate attention' },
};

// ----------------------------------------------------------------
// Mock Tabs
// ----------------------------------------------------------------

export const mockPayoutTabs: PayoutCalendarTab[] = [
  { key: 'all', label: 'All', count: 12 },
  { key: 'Scheduled', label: 'Scheduled', count: 5 },
  { key: 'Processing', label: 'Processing', count: 2 },
  { key: 'Completed', label: 'Completed', count: 4 },
  { key: 'Failed', label: 'Failed', count: 1 },
];

// ----------------------------------------------------------------
// Mock Calendar Payout Days (April 2026)
// ----------------------------------------------------------------

export const mockCalendarDays: CalendarPayoutDay[] = [
  { day: 3, frequency: 'Weekly', payoutCount: 3 },
  { day: 5, frequency: 'Weekly', payoutCount: 3 },
  { day: 10, frequency: 'Weekly', payoutCount: 3 },
  { day: 11, frequency: 'Bi-weekly', payoutCount: 2 },
  { day: 17, frequency: 'Weekly', payoutCount: 3 },
  { day: 24, frequency: 'Weekly', payoutCount: 3 },
  { day: 25, frequency: 'Bi-weekly', payoutCount: 2 },
  { day: 30, frequency: 'Monthly', payoutCount: 1 },
];

// ----------------------------------------------------------------
// Mock Upcoming Payouts
// ----------------------------------------------------------------

export const mockUpcomingPayouts: {
  id: string;
  sellerName: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Scheduled';
}[] = [
  { id: 'UP-001', sellerName: 'Sharma Electronics', amount: 124500, date: 'Apr 5, 2026', status: 'Pending' },
  { id: 'UP-002', sellerName: 'Patel Home Store', amount: 89200, date: 'Apr 5, 2026', status: 'Pending' },
  { id: 'UP-003', sellerName: 'GreenLeaf Organics', amount: 45680, date: 'Apr 10, 2026', status: 'Scheduled' },
  { id: 'UP-004', sellerName: 'TechZone Gadgets', amount: 234100, date: 'Apr 10, 2026', status: 'Scheduled' },
  { id: 'UP-005', sellerName: 'Fashion Hub India', amount: 67350, date: 'Apr 10, 2026', status: 'Scheduled' },
];

// ----------------------------------------------------------------
// Mock Payout Schedule (Table)
// ----------------------------------------------------------------

export const mockPayoutSchedule: PayoutEntry[] = [
  {
    id: 'PO-001',
    sellerName: 'Sharma Electronics',
    sellerId: 'SUP-101',
    amount: 124500,
    date: '2026-04-05',
    nextDate: 'Apr 5',
    status: 'Scheduled',
    paymentMethod: 'Bank Transfer',
    frequency: 'Weekly',
    bankStatus: 'Verified',
    holdReason: null,
  },
  {
    id: 'PO-002',
    sellerName: 'Patel Home Store',
    sellerId: 'SUP-102',
    amount: 89200,
    date: '2026-04-05',
    nextDate: 'Apr 5',
    status: 'Scheduled',
    paymentMethod: 'NEFT',
    frequency: 'Weekly',
    bankStatus: 'Verified',
    holdReason: null,
  },
  {
    id: 'PO-003',
    sellerName: 'GreenLeaf Organics',
    sellerId: 'SUP-103',
    amount: 45680,
    date: '2026-04-11',
    nextDate: 'Apr 11',
    status: 'Scheduled',
    paymentMethod: 'UPI',
    frequency: 'Bi-weekly',
    bankStatus: 'Verified',
    holdReason: null,
  },
  {
    id: 'PO-004',
    sellerName: 'TechZone Gadgets',
    sellerId: 'SUP-104',
    amount: 234100,
    date: '2026-04-05',
    nextDate: 'Apr 5',
    status: 'Scheduled',
    paymentMethod: 'RTGS',
    frequency: 'Weekly',
    bankStatus: 'Verified',
    holdReason: null,
  },
  {
    id: 'PO-005',
    sellerName: 'Fashion Hub India',
    sellerId: 'SUP-105',
    amount: 67350,
    date: '2026-04-05',
    nextDate: 'Apr 5',
    status: 'Pending',
    paymentMethod: 'Bank Transfer',
    frequency: 'Weekly',
    bankStatus: 'Pending',
    holdReason: 'Bank verification in progress',
  },
  {
    id: 'PO-006',
    sellerName: 'Delhi Spice Market',
    sellerId: 'SUP-106',
    amount: 38900,
    date: '2026-04-30',
    nextDate: 'Apr 30',
    status: 'Scheduled',
    paymentMethod: 'NEFT',
    frequency: 'Monthly',
    bankStatus: 'Verified',
    holdReason: 'SLA violations - under review',
  },
  {
    id: 'PO-007',
    sellerName: 'Urban Essentials',
    sellerId: 'SUP-107',
    amount: 52400,
    date: '2026-04-05',
    nextDate: 'Apr 5',
    status: 'Scheduled',
    paymentMethod: 'Bank Transfer',
    frequency: 'Weekly',
    bankStatus: 'Verified',
    holdReason: 'Quality holds - 3 complaints',
  },
];

// ----------------------------------------------------------------
// Mock Failed Payouts
// ----------------------------------------------------------------

export const mockFailedPayouts: FailedPayout[] = [
  {
    id: 'FP-001',
    sellerName: 'Craft Corner',
    amount: 34200,
    account: 'XXXX-4521',
    reason: 'Invalid IFSC code - SBIN0001234 not found',
  },
  {
    id: 'FP-002',
    sellerName: 'Nisha Handicrafts',
    amount: 18750,
    account: 'XXXX-8834',
    reason: 'Insufficient balance in settlement pool',
  },
  {
    id: 'FP-003',
    sellerName: 'Metro Appliances',
    amount: 72600,
    account: 'XXXX-3301',
    reason: 'Account frozen by bank - seller notified',
  },
];

// ----------------------------------------------------------------
// Mock Payout Entries (legacy - kept for hook compatibility)
// ----------------------------------------------------------------

export const mockPayoutEntries: PayoutEntry[] = mockPayoutSchedule;
