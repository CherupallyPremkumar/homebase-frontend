import type { StateEntity, ActivityLog } from './common';

export interface Settlement extends StateEntity {
  supplierId: string;
  supplierName?: string;
  orderId?: string;
  periodStart: string;
  periodEnd: string;
  settlementPeriodStart?: string;
  settlementPeriodEnd?: string;
  grossAmount: number;
  orderAmount?: number;
  commission: number;
  commissionAmount?: number;
  platformFees: number;
  platformFee?: number;
  returnDeductions: number;
  chargebackDeductions: number;
  gstOnCommission: number;
  tds: number;
  netPayout: number;
  netAmount?: number;
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
