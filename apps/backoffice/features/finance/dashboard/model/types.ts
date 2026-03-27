export type { Settlement, SearchResponse } from '@homebase/types';

// Matches Dashboard.financeStats SQL output
export interface FinanceStats {
  totalRevenue: number;
  todayRevenue: number;
  disbursedSettlements: number;
  totalPayouts: number;
  pendingSettlements: number;
  pendingPayoutAmount: number;
  disputedSettlements: number;
  totalRefunds: number;
  totalRefundAmount: number;
}

// Matches Dashboard.revenueTrend SQL output
export interface RevenueTrend {
  date: string;
  revenue: number;
  orderCount: number;
}

// Matches Dashboard.settlementsByState SQL output
export interface SettlementsByState {
  state: string;
  count: number;
  totalAmount: number;
}
