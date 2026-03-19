export type { Settlement, SearchResponse } from '@homebase/types';

export interface FinanceStats {
  totalRevenue: number;
  revenueChange: number;
  pendingSettlements: number;
  pendingSettlementsChange: number;
  completedPayouts: number;
  completedPayoutsChange: number;
  activeDisputes: number;
  disputesChange: number;
}

export interface RevenueTrend {
  date: string;
  revenue: number;
  settlements: number;
}

export interface SettlementsByState {
  state: string;
  count: number;
  amount: number;
}
