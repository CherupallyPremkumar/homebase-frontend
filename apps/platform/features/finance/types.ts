/**
 * Types for the Finance Dashboard feature.
 */

/* ------------------------------------------------------------------ */
/*  Chart & Revenue                                                    */
/* ------------------------------------------------------------------ */

export interface RevenueDataPoint {
  label: string;
  value: number;
  /** Bar height percentage (0-100) for CSS-based chart */
  heightPct: number;
}

/* ------------------------------------------------------------------ */
/*  Money Flow                                                         */
/* ------------------------------------------------------------------ */

export interface MoneyFlowItem {
  label: string;
  amount: string;
  pct: number;
  color: string;
  sub?: string;
}

/* ------------------------------------------------------------------ */
/*  Payment Method Mix                                                 */
/* ------------------------------------------------------------------ */

export interface PaymentMethodItem {
  method: string;
  pct: number;
  color: string;
  successLabel: string;
  successValue: string;
  successColor: string;
}

/* ------------------------------------------------------------------ */
/*  Gateway Health                                                     */
/* ------------------------------------------------------------------ */

export type GatewayStatus = 'healthy' | 'degraded' | 'down';

export interface GatewayHealthItem {
  name: string;
  subtitle: string;
  uptime: string;
  latency: string;
  status: GatewayStatus;
}

/* ------------------------------------------------------------------ */
/*  Tax & Cash Flow                                                    */
/* ------------------------------------------------------------------ */

export interface TaxLineItem {
  label: string;
  value: string;
}

export interface CashFlowItem {
  label: string;
  value: string;
  color: string;
  isBold?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Revenue by Region                                                  */
/* ------------------------------------------------------------------ */

export interface RegionRevenueItem {
  region: string;
  revenue: string;
  orders: string;
  growth: string;
}

/* ------------------------------------------------------------------ */
/*  Pending Settlements                                                */
/* ------------------------------------------------------------------ */

export interface SettlementLineItem {
  label: string;
  value: string;
  color: string;
}

/* ------------------------------------------------------------------ */
/*  Gateway Balance                                                    */
/* ------------------------------------------------------------------ */

export interface GatewayBalanceLineItem {
  label: string;
  value: string;
  color: string;
}

/* ------------------------------------------------------------------ */
/*  Reconciliation                                                     */
/* ------------------------------------------------------------------ */

export interface ReconciliationData {
  matchedPct: number;
  matchedCount: string;
  totalCount: string;
  mismatchedCount: string;
}

/* ------------------------------------------------------------------ */
/*  Transactions                                                       */
/* ------------------------------------------------------------------ */

export type TransactionStatus = 'Settled' | 'Pending' | 'Processing' | 'Failed';

export interface RecentTransaction {
  date: string;
  orderId: string;
  customer: string;
  amount: string;
  commission: string;
  gatewayFee: string;
  sellerPayout: string;
  status: TransactionStatus;
}

/* ------------------------------------------------------------------ */
/*  Stat Card Data                                                     */
/* ------------------------------------------------------------------ */

export interface StatCardData {
  title: string;
  value: string;
  subtitle: string;
  trendValue?: string;
  trendLabel?: string;
  trendDirection?: 'up' | 'down';
  iconBg: string;
  iconColor: string;
  isHighlighted?: boolean;
  valueColor?: string;
}

/* ------------------------------------------------------------------ */
/*  Dashboard Aggregate                                                */
/* ------------------------------------------------------------------ */

export interface FinanceDashboardData {
  statCards: StatCardData[];
  paymentMethods: PaymentMethodItem[];
  failedTransactionsToday: number;
  gateways: GatewayHealthItem[];
  taxLines: TaxLineItem[];
  cashFlow: CashFlowItem[];
  gstFilingDue: string;
  gstFilingDetail: string;
  regions: RegionRevenueItem[];
  failedAlert: { count: number; value: string; autoRetried: number; pendingReview: number };
  chargebackAlert: { count: number; value: string; winRate: string };
  moneyFlow: MoneyFlowItem[];
  platformKeeps: string;
  revenueData: RevenueDataPoint[];
  pendingSettlements: {
    total: string;
    sellerCount: string;
    lines: SettlementLineItem[];
  };
  gatewayBalance: {
    total: string;
    badge: string;
    subtitle: string;
    lines: GatewayBalanceLineItem[];
  };
  reconciliation: ReconciliationData;
  recentTransactions: RecentTransaction[];
}

export type FinanceDateRange = 'Today' | '7D' | '30D' | '90D' | '1Y';
