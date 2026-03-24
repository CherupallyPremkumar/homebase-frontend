import type { StateEntity, ActivityLog } from './common';

export interface Coupon extends StateEntity {
  code: string;
  name?: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  usageCount?: number;
  perUserLimit?: number;
  validFrom: string;
  validUntil: string;
  startDate?: string;
  endDate?: string;
  applicableCategories?: string[];
  applicableProducts?: string[];
  excludedProducts?: string[];
  isActive: boolean;
  activities: ActivityLog[];
}

export interface CouponUsage {
  id: string;
  couponId: string;
  userId: string;
  orderId: string;
  discountApplied: number;
  usedAt: string;
}

export interface ValidateCouponResponse {
  valid: boolean;
  discountAmount: number;
  reason?: string;
}
