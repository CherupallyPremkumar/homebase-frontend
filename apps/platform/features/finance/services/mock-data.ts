/**
 * Mock data for the Platform Finance Dashboard.
 *
 * Values match the HTML prototype at design-prototype/admin/finance/index.html
 * pixel-for-pixel. When the backend endpoints are ready, swap the mock
 * imports in use-finance.ts for real fetch calls -- no component changes needed.
 */

import type { FinanceDashboardData } from '../types';

// ----------------------------------------------------------------
// Revenue bar chart data (20 days of daily commission)
// Heights match the prototype CSS bar heights exactly.
// ----------------------------------------------------------------

const REVENUE_DATA: FinanceDashboardData['revenueData'] = [
  { label: '1', value: 820000, heightPct: 60 },
  { label: '2', value: 610000, heightPct: 45 },
  { label: '3', value: 940000, heightPct: 72 },
  { label: '4', value: 780000, heightPct: 55 },
  { label: '5', value: 1050000, heightPct: 80 },
  { label: '6', value: 1180000, heightPct: 90 },
  { label: '7', value: 890000, heightPct: 65 },
  { label: '8', value: 700000, heightPct: 50 },
  { label: '9', value: 980000, heightPct: 75 },
  { label: '10', value: 1120000, heightPct: 85 },
  { label: '11', value: 950000, heightPct: 70 },
  { label: '12', value: 580000, heightPct: 40 },
  { label: '13', value: 910000, heightPct: 68 },
  { label: '14', value: 1250000, heightPct: 95 },
  { label: '15', value: 1080000, heightPct: 82 },
  { label: '16', value: 780000, heightPct: 58 },
  { label: '17', value: 640000, heightPct: 48 },
  { label: '18', value: 830000, heightPct: 62 },
  { label: '19', value: 1020000, heightPct: 78 },
  { label: '20', value: 1160000, heightPct: 88 },
];

// ----------------------------------------------------------------
// Full mock dashboard data
// ----------------------------------------------------------------

export const MOCK_FINANCE_DASHBOARD: FinanceDashboardData = {
  /* ---- Top 5 stat cards ---- */
  statCards: [
    {
      title: 'Total Collections',
      value: '\u20B92,45,00,000',
      subtitle: 'What customers paid',
      trendValue: '+12.4%',
      trendLabel: 'vs last period',
      trendDirection: 'up',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Platform Commission',
      value: '\u20B912,25,000',
      subtitle: '5% earned on transactions',
      trendValue: '+8.7%',
      trendLabel: 'vs last period',
      trendDirection: 'up',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      title: 'Gateway Fees Paid',
      value: '\u20B94,90,000',
      subtitle: '2% to Razorpay',
      trendValue: '+5.2%',
      trendLabel: 'cost increase',
      trendDirection: 'down',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      title: 'GST Collected',
      value: '\u20B93,08,700',
      subtitle: '18% on platform fees',
      trendLabel: 'Due for filing: Apr 20',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Net Platform Revenue',
      value: '\u20B94,26,300',
      subtitle: 'Commission - Gateway - GST',
      trendValue: '+15.3%',
      trendLabel: 'vs last period',
      trendDirection: 'up',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      isHighlighted: true,
      valueColor: 'text-orange-600',
    },
  ],

  /* ---- Payment Method Mix ---- */
  paymentMethods: [
    { method: 'UPI', pct: 42, color: 'bg-violet-500', successLabel: '99.2%', successValue: 'success', successColor: 'text-green-600' },
    { method: 'Cards', pct: 28, color: 'bg-blue-500', successLabel: '97.8%', successValue: 'success', successColor: 'text-green-600' },
    { method: 'COD', pct: 18, color: 'bg-amber-500', successLabel: 'RTO 8.1%', successValue: 'risk', successColor: 'text-amber-600' },
    { method: 'Wallet', pct: 8, color: 'bg-green-500', successLabel: '100%', successValue: 'success', successColor: 'text-green-600' },
  ],
  failedTransactionsToday: 23,

  /* ---- Gateway Health ---- */
  gateways: [
    { name: 'Razorpay', subtitle: 'Primary gateway', uptime: '99.8%', latency: '142ms avg', status: 'healthy' },
    { name: 'Paytm PG', subtitle: 'UPI fallback', uptime: '99.5%', latency: '198ms avg', status: 'healthy' },
    { name: 'PhonePe', subtitle: 'Degraded performance', uptime: '97.2%', latency: '450ms avg', status: 'degraded' },
  ],

  /* ---- Tax & Cash Flow ---- */
  taxLines: [
    { label: 'GST Collected (This Month)', value: '\u20B943.2L' },
    { label: 'TDS Deducted', value: '\u20B98.1L' },
    { label: 'TCS on Sales', value: '\u20B91.7L' },
  ],
  gstFilingDue: 'GST Filing Due: Apr 20',
  gstFilingDetail: 'GSTR-3B for March 2026',
  cashFlow: [
    { label: 'Expected this week', value: '\u20B91.2 Cr', color: 'text-green-600' },
    { label: 'Seller payouts due', value: '-\u20B998.4L', color: 'text-red-600' },
    { label: 'Net cash position', value: '\u20B921.6L', color: 'text-orange-600', isBold: true },
  ],

  /* ---- Revenue by Region ---- */
  regions: [
    { region: 'Maharashtra', revenue: '\u20B92.1Cr', orders: '3,420 orders', growth: '+22%' },
    { region: 'Karnataka', revenue: '\u20B91.6Cr', orders: '2,810 orders', growth: '+18%' },
    { region: 'Delhi NCR', revenue: '\u20B91.4Cr', orders: '2,540 orders', growth: '+15%' },
    { region: 'Tamil Nadu', revenue: '\u20B91.1Cr', orders: '1,890 orders', growth: '+12%' },
    { region: 'Gujarat', revenue: '\u20B90.8Cr', orders: '1,420 orders', growth: '+28%' },
  ],

  /* ---- Alert Banners ---- */
  failedAlert: { count: 23, value: '\u20B94,82,000', autoRetried: 14, pendingReview: 9 },
  chargebackAlert: { count: 3, value: '\u20B918,400', winRate: '67% (2 of 3 last month)' },

  /* ---- Money Flow Breakdown ---- */
  moneyFlow: [
    { label: 'Platform Commission', amount: '\u20B912.25L', pct: 50, color: 'bg-orange-500', sub: '5%' },
    { label: 'Gateway Fee (Razorpay)', amount: '\u20B94.9L', pct: 20, color: 'bg-red-500', sub: '2%' },
    { label: 'GST on Fees (18%)', amount: '\u20B93.08L', pct: 12.5, color: 'bg-purple-500' },
    { label: 'Seller Payouts', amount: '\u20B92.24 Cr', pct: 91.4, color: 'bg-green-500', sub: '91.4%' },
  ],
  platformKeeps: '\u20B94.26L',

  /* ---- Revenue Trend (bar chart) ---- */
  revenueData: REVENUE_DATA,

  /* ---- Pending Settlements ---- */
  pendingSettlements: {
    total: '\u20B945,80,000',
    sellerCount: '42 sellers',
    lines: [
      { label: 'Due today', value: '\u20B98,45,000 (7 sellers)', color: 'text-red-600' },
      { label: 'Due this week', value: '\u20B922,30,000 (18 sellers)', color: 'text-yellow-600' },
      { label: 'Overdue', value: '\u20B915,05,000 (17 sellers)', color: 'text-red-600' },
    ],
  },

  /* ---- Gateway Balance ---- */
  gatewayBalance: {
    total: '\u20B912,45,000',
    badge: 'Razorpay',
    subtitle: 'Available for payout',
    lines: [
      { label: 'Settled today', value: '\u20B93,20,000', color: 'text-green-600' },
      { label: 'On hold', value: '\u20B91,85,000', color: 'text-yellow-600' },
      { label: 'In transit', value: '\u20B97,40,000', color: 'text-blue-600' },
    ],
  },

  /* ---- Reconciliation ---- */
  reconciliation: {
    matchedPct: 98.2,
    matchedCount: '1,254',
    totalCount: '1,277',
    mismatchedCount: '23',
  },

  /* ---- Recent Transactions Table ---- */
  recentTransactions: [
    { date: '28 Mar 2026', orderId: '#HB-78456', customer: 'Rajesh Kumar', amount: '\u20B91,24,500', commission: '\u20B96,225', gatewayFee: '\u20B92,490', sellerPayout: '\u20B91,15,785', status: 'Settled' },
    { date: '28 Mar 2026', orderId: '#HB-78453', customer: 'Priya Sharma', amount: '\u20B945,800', commission: '\u20B92,290', gatewayFee: '\u20B9916', sellerPayout: '\u20B942,594', status: 'Settled' },
    { date: '27 Mar 2026', orderId: '#HB-78449', customer: 'Amit Patel', amount: '\u20B92,34,000', commission: '\u20B911,700', gatewayFee: '\u20B94,680', sellerPayout: '\u20B92,17,620', status: 'Pending' },
    { date: '27 Mar 2026', orderId: '#HB-78445', customer: 'Sunita Reddy', amount: '\u20B918,900', commission: '\u20B9945', gatewayFee: '\u20B9378', sellerPayout: '\u20B917,577', status: 'Settled' },
    { date: '26 Mar 2026', orderId: '#HB-78440', customer: 'Vikram Singh', amount: '\u20B989,200', commission: '\u20B94,460', gatewayFee: '\u20B91,784', sellerPayout: '\u20B982,956', status: 'Processing' },
    { date: '26 Mar 2026', orderId: '#HB-78437', customer: 'Meena Gupta', amount: '\u20B956,400', commission: '\u20B92,820', gatewayFee: '\u20B91,128', sellerPayout: '\u20B952,452', status: 'Settled' },
    { date: '25 Mar 2026', orderId: '#HB-78432', customer: 'Anish Joshi', amount: '\u20B93,45,000', commission: '\u20B917,250', gatewayFee: '\u20B96,900', sellerPayout: '\u20B93,20,850', status: 'Failed' },
    { date: '25 Mar 2026', orderId: '#HB-78428', customer: 'Kavita Nair', amount: '\u20B972,600', commission: '\u20B93,630', gatewayFee: '\u20B91,452', sellerPayout: '\u20B967,518', status: 'Pending' },
  ],
};
