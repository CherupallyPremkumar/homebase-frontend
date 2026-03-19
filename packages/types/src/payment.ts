import type { StateEntity, ActivityLog } from './common';

export interface Payment extends StateEntity {
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  gatewayTransactionId?: string;
  gatewayName?: string;
  refundAmount?: number;
  refundReason?: string;
  activities: ActivityLog[];
}

export interface PaymentRefund {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: string;
  createdAt: string;
}

export interface SavedPaymentMethod {
  id: string;
  type: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}
