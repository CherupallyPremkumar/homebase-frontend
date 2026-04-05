/**
 * Mock data for the Settlement Management page.
 *
 * Matches the HTML prototype at design-prototype/admin/finance/settlements.html.
 * When backend endpoints are ready, swap imports in use-settlement.ts.
 */

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export type SettlementStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed' | 'Disputed';

export interface SettlementItem {
  id: string;
  initials: string;
  gradient: string;
  seller: string;
  period: string;
  gross: string;
  fee: string;
  gst: string;
  net: string;
  status: SettlementStatus;
  payoutDate: string;
  /** Expanded earnings breakdown */
  breakdown: EarningsBreakdown;
}

export interface EarningsBreakdown {
  grossSales: string;
  commission: string;
  gstOnFee: string;
  tds: string;
  adjustmentAmount: string;
  adjustmentLabel: string;
  netPayout: string;
}

export interface SettlementTab {
  label: string;
  count: number;
}

export interface HoldSeller {
  initials: string;
  gradient: string;
  name: string;
  pending: string;
  heldSince: string;
  reason: string;
  reasonVariant: 'kyc' | 'dispute' | 'low-balance' | 'fraud';
}

export interface FailedSettlement {
  id: string;
  seller: string;
  net: string;
  reason: string;
  failedAt: string;
}

export interface DisputedSettlement {
  id: string;
  seller: string;
  period: string;
  net: string;
  reason: string;
}

export interface ChartBar {
  month: string;
  height: number;
  value: string;
  color: string;
}

// ----------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------

export const MOCK_SETTLEMENT_TABS: SettlementTab[] = [
  { label: 'All', count: 48 },
  { label: 'Pending', count: 12 },
  { label: 'Processing', count: 8 },
  { label: 'Completed', count: 22 },
  { label: 'Failed', count: 4 },
  { label: 'Disputed', count: 2 },
];

export const MOCK_SETTLEMENTS: SettlementItem[] = [
  {
    id: 'STL-20260328-001', initials: 'RS', gradient: 'from-blue-400 to-blue-600',
    seller: 'Rajesh Store', period: 'Mar 15 - 21',
    gross: '\u20B98,45,200', fee: '-\u20B942,260', gst: '-\u20B97,605', net: '\u20B97,95,335',
    status: 'Pending', payoutDate: '--',
    breakdown: { grossSales: '\u20B98,45,200', commission: '-\u20B942,260', gstOnFee: '-\u20B97,605', tds: '-\u20B98,452', adjustmentAmount: '+\u20B98,452', adjustmentLabel: 'Return reversal', netPayout: '\u20B97,95,335' },
  },
  {
    id: 'STL-20260327-002', initials: 'TW', gradient: 'from-emerald-400 to-emerald-600',
    seller: 'TechWorld India', period: 'Mar 15 - 21',
    gross: '\u20B915,72,800', fee: '-\u20B978,640', gst: '-\u20B914,155', net: '\u20B914,80,005',
    status: 'Processing', payoutDate: '28 Mar 2026',
    breakdown: { grossSales: '\u20B915,72,800', commission: '-\u20B978,640', gstOnFee: '-\u20B914,155', tds: '-\u20B915,728', adjustmentAmount: '\u20B90', adjustmentLabel: 'No adjustments', netPayout: '\u20B914,80,005' },
  },
  {
    id: 'STL-20260321-003', initials: 'PF', gradient: 'from-pink-400 to-pink-600',
    seller: 'Priya Fashion Hub', period: 'Mar 8 - 14',
    gross: '\u20B96,89,400', fee: '-\u20B934,470', gst: '-\u20B96,205', net: '\u20B96,48,725',
    status: 'Completed', payoutDate: '21 Mar 2026',
    breakdown: { grossSales: '\u20B96,89,400', commission: '-\u20B934,470', gstOnFee: '-\u20B96,205', tds: '-\u20B96,894', adjustmentAmount: '+\u20B96,894', adjustmentLabel: 'Promo credit', netPayout: '\u20B96,48,725' },
  },
  {
    id: 'STL-20260328-004', initials: 'KH', gradient: 'from-violet-400 to-violet-600',
    seller: 'Krishna Home Decor', period: 'Mar 22 - 28',
    gross: '\u20B94,23,600', fee: '-\u20B921,180', gst: '-\u20B93,812', net: '\u20B93,98,608',
    status: 'Pending', payoutDate: '--',
    breakdown: { grossSales: '\u20B94,23,600', commission: '-\u20B921,180', gstOnFee: '-\u20B93,812', tds: '-\u20B94,236', adjustmentAmount: '+\u20B94,236', adjustmentLabel: 'Shipping subsidy', netPayout: '\u20B93,98,608' },
  },
  {
    id: 'STL-20260325-005', initials: 'ME', gradient: 'from-amber-400 to-amber-600',
    seller: 'Mumbai Essentials', period: 'Mar 8 - 14',
    gross: '\u20B92,15,800', fee: '-\u20B910,790', gst: '-\u20B91,942', net: '\u20B92,03,068',
    status: 'Failed', payoutDate: '25 Mar 2026',
    breakdown: { grossSales: '\u20B92,15,800', commission: '-\u20B910,790', gstOnFee: '-\u20B91,942', tds: '-\u20B92,158', adjustmentAmount: '+\u20B92,158', adjustmentLabel: 'Penalty waiver', netPayout: '\u20B92,03,068' },
  },
  {
    id: 'STL-20260321-006', initials: 'SE', gradient: 'from-teal-400 to-teal-600',
    seller: 'Sharma Electronics', period: 'Mar 8 - 14',
    gross: '\u20B922,34,500', fee: '-\u20B91,11,725', gst: '-\u20B920,111', net: '\u20B921,02,664',
    status: 'Completed', payoutDate: '21 Mar 2026',
    breakdown: { grossSales: '\u20B922,34,500', commission: '-\u20B91,11,725', gstOnFee: '-\u20B920,111', tds: '-\u20B922,345', adjustmentAmount: '+\u20B922,345', adjustmentLabel: 'Festival bonus', netPayout: '\u20B921,02,664' },
  },
  {
    id: 'STL-20260327-007', initials: 'GT', gradient: 'from-rose-400 to-rose-600',
    seller: 'Gupta Textiles', period: 'Mar 15 - 21',
    gross: '\u20B99,67,300', fee: '-\u20B948,365', gst: '-\u20B98,706', net: '\u20B99,10,229',
    status: 'Processing', payoutDate: '28 Mar 2026',
    breakdown: { grossSales: '\u20B99,67,300', commission: '-\u20B948,365', gstOnFee: '-\u20B98,706', tds: '-\u20B99,673', adjustmentAmount: '+\u20B99,673', adjustmentLabel: 'Late delivery credit', netPayout: '\u20B99,10,229' },
  },
  {
    id: 'STL-20260325-008', initials: 'RS', gradient: 'from-blue-400 to-blue-600',
    seller: 'Rajesh Store', period: 'Mar 1 - 7',
    gross: '\u20B95,12,900', fee: '-\u20B925,645', gst: '-\u20B94,616', net: '\u20B94,82,639',
    status: 'Failed', payoutDate: '25 Mar 2026',
    breakdown: { grossSales: '\u20B95,12,900', commission: '-\u20B925,645', gstOnFee: '-\u20B94,616', tds: '-\u20B95,129', adjustmentAmount: '+\u20B95,129', adjustmentLabel: 'Damage claim', netPayout: '\u20B94,82,639' },
  },
];

export const MOCK_CHART_BARS: ChartBar[] = [
  { month: 'Oct', height: 68, value: '\u20B982L', color: 'bg-orange-200' },
  { month: 'Nov', height: 80, value: '\u20B991L', color: 'bg-orange-300' },
  { month: 'Dec', height: 104, value: '\u20B91.05Cr', color: 'bg-orange-400' },
  { month: 'Jan', height: 96, value: '\u20B998L', color: 'bg-orange-400' },
  { month: 'Feb', height: 116, value: '\u20B91.1Cr', color: 'bg-orange-500' },
  { month: 'Mar', height: 140, value: '\u20B91.2Cr', color: 'bg-orange-600' },
];

export const MOCK_HOLD_SELLERS: HoldSeller[] = [
  { initials: 'RS', gradient: 'from-blue-400 to-blue-600', name: 'Rajesh Store', pending: '\u20B97,95,335', heldSince: '25 Mar 2026', reason: 'KYC pending', reasonVariant: 'kyc' },
  { initials: 'AK', gradient: 'from-cyan-400 to-cyan-600', name: 'Anand Kitchen', pending: '\u20B93,12,400', heldSince: '22 Mar 2026', reason: 'KYC pending', reasonVariant: 'kyc' },
  { initials: 'PB', gradient: 'from-lime-400 to-lime-600', name: 'Patel Books', pending: '\u20B91,45,700', heldSince: '28 Mar 2026', reason: 'KYC pending', reasonVariant: 'kyc' },
  { initials: 'TW', gradient: 'from-emerald-400 to-emerald-600', name: 'TechWorld India', pending: '\u20B911,45,230', heldSince: '20 Mar 2026', reason: 'Dispute resolution', reasonVariant: 'dispute' },
  { initials: 'PF', gradient: 'from-pink-400 to-pink-600', name: 'Priya Fashion Hub', pending: '\u20B95,89,120', heldSince: '18 Mar 2026', reason: 'Dispute resolution', reasonVariant: 'dispute' },
  { initials: 'NS', gradient: 'from-orange-400 to-orange-600', name: 'Nair Spices', pending: '\u20B948,200', heldSince: '30 Mar 2026', reason: 'Low balance', reasonVariant: 'low-balance' },
  { initials: 'DM', gradient: 'from-gray-400 to-gray-600', name: 'Delhi Mart', pending: '\u20B98,22,500', heldSince: '15 Mar 2026', reason: 'Fraud investigation', reasonVariant: 'fraud' },
  { initials: 'SK', gradient: 'from-indigo-400 to-indigo-600', name: 'Singh Krafts', pending: '\u20B94,67,800', heldSince: '19 Mar 2026', reason: 'Fraud investigation', reasonVariant: 'fraud' },
];

export const MOCK_FAILED_SETTLEMENTS: FailedSettlement[] = [
  { id: 'STL-20260325-005', seller: 'Mumbai Essentials', net: '\u20B92,03,068', reason: 'Bank account number invalid. NEFT transfer rejected by HDFC Bank. Error code: ACCT_INVALID.', failedAt: 'Failed: 25 Mar 2026, 14:32 IST' },
  { id: 'STL-20260325-008', seller: 'Rajesh Store', net: '\u20B94,82,639', reason: 'IFSC code mismatch. Beneficiary verification failed at SBI clearing house.', failedAt: 'Failed: 25 Mar 2026, 15:10 IST' },
  { id: 'STL-20260322-014', seller: 'Gupta Textiles', net: '\u20B96,34,200', reason: 'Payment gateway timeout. Transaction timed out after 30s during IMPS transfer to Kotak Bank.', failedAt: 'Failed: 22 Mar 2026, 09:45 IST' },
];

export const MOCK_DISPUTED_SETTLEMENTS: DisputedSettlement[] = [
  { id: 'STL-20260314-019', seller: 'TechWorld India', period: 'Mar 1 - 7', net: '\u20B911,45,230', reason: 'Seller claims 3 orders worth \u20B945,200 were cancelled after delivery confirmation but deducted from settlement. Requesting reversal.' },
  { id: 'STL-20260314-022', seller: 'Priya Fashion Hub', period: 'Mar 1 - 7', net: '\u20B95,89,120', reason: 'Platform fee charged at 7% instead of agreed 5%. Seller has raised support ticket #TKT-8821. Difference: \u20B911,782.' },
];

export const MOCK_SELLER_OPTIONS = [
  'All Sellers',
  'Rajesh Store',
  'Krishna Home Decor',
  'Priya Fashion Hub',
  'TechWorld India',
  'Mumbai Essentials',
  'Sharma Electronics',
  'Gupta Textiles',
];
