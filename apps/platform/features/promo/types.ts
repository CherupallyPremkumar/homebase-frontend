/**
 * Types for the Promotions & Campaigns feature.
 *
 * Re-exports shared types and defines admin-specific interfaces.
 */

export type { Coupon, SearchRequest, SearchResponse } from '@homebase/types';

// ----------------------------------------------------------------
// Admin Promo types
// ----------------------------------------------------------------

export interface PromoStats {
  activeCampaigns: number;
  activeCampaignsTrend: string;
  totalCoupons: number;
  totalCouponsSubtitle: string;
  promoRevenue: string;
  promoRevenueTrend: string;
  redemptionRate: string;
  redemptionRateTrend: string;
}

export type CampaignStatus = 'Active' | 'Scheduled' | 'Draft' | 'Expired';
export type CampaignType = 'Flash Sale' | 'Coupon' | 'Banner' | 'Free Shipping';

export interface Campaign {
  id: string;
  name: string;
  subtitle: string;
  type: CampaignType;
  discount: string;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  usageUsed: number;
  usageLimit: number | null;
  usageLabel: string;
  iconBg: string;
  iconColor: string;
}

export interface CouponCard {
  code: string;
  discount: string;
  discountLabel: string;
  gradientFrom: string;
  gradientTo: string;
  codeBg: string;
  codeBorder: string;
  codeText: string;
  copyColor: string;
  copyHover: string;
  barColor: string;
  minOrder: string;
  validTill: string;
  usageUsed: string;
  usageLimit: string;
  usagePercent: number;
}

export interface PromoTab {
  label: string;
  count: number;
  badgeBg: string;
  badgeText: string;
}

// ----------------------------------------------------------------
// Campaign Management types (Marketing Campaigns)
// ----------------------------------------------------------------

export type CampaignMgmtStatus = 'Active' | 'Completed' | 'Draft' | 'Scheduled';
export type CampaignMgmtChannel = 'Email' | 'SMS' | 'Push';

export interface CampaignMgmt {
  id: string;
  name: string;
  subtitle: string;
  channel: CampaignMgmtChannel;
  status: CampaignMgmtStatus;
  sent: number;
  opened: number | null;
  openRate: number | null;
  clicked: number;
  clickRate: number;
  conversions: number;
  revenue: string;
}

export interface CampaignMgmtStats {
  activeCampaigns: number;
  activeTrend: string;
  sentThisMonth: string;
  sentTrend: string;
  openRate: string;
  openBenchmark: string;
  clickRate: string;
  clickBenchmark: string;
}

export interface CampaignMgmtTab {
  label: string;
  count: string;
}

export interface CampaignTemplate {
  id: string;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
  icon: string;
}

// ----------------------------------------------------------------
// Coupon Management types
// ----------------------------------------------------------------

export type CouponMgmtStatus = 'Active' | 'Expired' | 'Scheduled' | 'Disabled';
export type CouponDiscountType = 'percentage' | 'flat';

export interface CouponMgmt {
  id: string;
  code: string;
  type: string;
  discount: string;
  minOrder: string;
  usageUsed: number;
  usageLimit: number;
  status: CouponMgmtStatus;
  expires: string;
}

export interface CouponMgmtStats {
  totalCoupons: number;
  activeCoupons: number;
  activeTrend: string;
  expiringThisWeek: number;
  expiringLabel: string;
  totalRedemptions: number;
  redemptionsTrend: string;
  revenueImpact: string;
  revenueLabel: string;
}

export interface CouponMgmtTab {
  label: string;
  count: string;
}

export interface TopCoupon {
  code: string;
  label: string;
  used: number;
  limit: number;
  percent: number;
  saved: string;
  barColor: string;
}

export interface ExpiringSoonCoupon {
  code: string;
  urgency: string;
  urgencyColor: string;
  detail: string;
}

export interface CouponCardData {
  code: string;
  description: string;
  detail: string;
  used: string;
}

export interface StackingRule {
  pair: string;
  allowed: boolean;
  reason: string;
}
