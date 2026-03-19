import type { StateEntity, ActivityLog } from './common';

export interface ReturnRequest extends StateEntity {
  orderId: string;
  orderItemId: string;
  userId: string;
  productId: string;
  productName: string;
  reason: string;
  description?: string;
  quantity: number;
  refundAmount?: number;
  refundMethod?: string;
  images?: string[];
  activities: ActivityLog[];
}
