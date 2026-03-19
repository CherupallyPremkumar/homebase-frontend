import type { StateEntity, ActivityLog } from './common';

export interface Settlement extends StateEntity {
  supplierId: string;
  supplierName?: string;
  periodStart: string;
  periodEnd: string;
  grossAmount: number;
  commission: number;
  platformFees: number;
  returnDeductions: number;
  chargebackDeductions: number;
  gstOnCommission: number;
  tds: number;
  netPayout: number;
  currency: string;
  lineItems: SettlementLineItem[];
  adjustments: SettlementAdjustment[];
  activities: ActivityLog[];
}

export interface SettlementLineItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  orderAmount: number;
  commission: number;
  platformFee: number;
  netAmount: number;
}

export interface SettlementAdjustment {
  id: string;
  type: string;
  amount: number;
  reason: string;
  createdAt: string;
}
