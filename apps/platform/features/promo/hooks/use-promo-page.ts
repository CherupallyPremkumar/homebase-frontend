'use client';

import { useQuery } from '@tanstack/react-query';
import { promosApi } from '@homebase/api-client';

import type { PromoStats, Campaign, CouponCard } from '../types';
import type { Coupon, SearchResponse } from '@homebase/types';

// ----------------------------------------------------------------
// Adapter: Coupon (API) -> PromoStats (UI)
// ----------------------------------------------------------------

function toPromoStats(response: SearchResponse<Coupon>): PromoStats {
  const list = response.list?.map((r) => r.row) ?? [];
  const active = list.filter((c) => c.isActive || c.stateId === 'ACTIVE');
  const expired = list.filter((c) => c.stateId === 'EXPIRED' || c.stateId === 'DISABLED');
  const totalRedemptions = list.reduce((sum, c) => sum + (c.usedCount ?? c.usageCount ?? 0), 0);
  const totalLimit = list.reduce((sum, c) => sum + (c.usageLimit ?? 0), 0);
  const revenue = list.reduce((sum, c) => sum + (c.usedCount ?? 0) * c.discountValue, 0);
  const formatted = revenue >= 100000 ? `\u20B9${(revenue / 100000).toFixed(1)}L` : `\u20B9${revenue.toLocaleString('en-IN')}`;
  const rate = totalLimit > 0 ? Math.round((totalRedemptions / totalLimit) * 1000) / 10 : 0;
  return {
    activeCampaigns: active.length,
    activeCampaignsTrend: '+2 this week',
    totalCoupons: list.length,
    totalCouponsSubtitle: `${active.length} active, ${expired.length} expired`,
    promoRevenue: formatted,
    promoRevenueTrend: '+18.2% vs last month',
    redemptionRate: `${rate}%`,
    redemptionRateTrend: '+3.1% vs last month',
  };
}

// ----------------------------------------------------------------
// Adapter: Coupon (API) -> Campaign (UI)
// ----------------------------------------------------------------

function toCampaign(coupon: Coupon): Campaign {
  const statusMap: Record<string, Campaign['status']> = {
    ACTIVE: 'Active',
    SCHEDULED: 'Scheduled',
    CREATED: 'Draft',
    EXPIRED: 'Expired',
    DISABLED: 'Expired',
  };
  const typeMap: Record<string, Campaign['type']> = {
    PERCENTAGE: 'Coupon',
    FIXED_AMOUNT: 'Coupon',
    FREE_SHIPPING: 'Free Shipping',
  };
  const used = coupon.usedCount ?? coupon.usageCount ?? 0;
  const limit = coupon.usageLimit;
  const discountLabel =
    coupon.discountType === 'PERCENTAGE'
      ? `${coupon.discountValue}%`
      : coupon.discountType === 'FREE_SHIPPING'
        ? '100%'
        : `\u20B9${coupon.discountValue}`;
  return {
    id: coupon.id,
    name: coupon.name ?? coupon.code,
    subtitle: '',
    type: typeMap[coupon.discountType] ?? 'Coupon',
    discount: discountLabel,
    status: statusMap[coupon.stateId] ?? 'Draft',
    startDate: coupon.validFrom ?? coupon.startDate ?? '-',
    endDate: coupon.validUntil ?? coupon.endDate ?? '-',
    usageUsed: used,
    usageLimit: limit ?? null,
    usageLabel: limit ? `${used.toLocaleString('en-IN')}/${limit.toLocaleString('en-IN')}` : `${used.toLocaleString('en-IN')}/--`,
    iconBg: 'bg-gray-50',
    iconColor: 'text-gray-500',
  };
}

// ----------------------------------------------------------------
// Adapter: Coupon (API) -> CouponCard (UI)
// ----------------------------------------------------------------

function toCouponCard(coupon: Coupon): CouponCard {
  const discountLabel =
    coupon.discountType === 'PERCENTAGE'
      ? `${coupon.discountValue}% OFF`
      : coupon.discountType === 'FREE_SHIPPING'
        ? 'FREE SHIP'
        : `\u20B9${coupon.discountValue} OFF`;
  const typeLabel =
    coupon.discountType === 'PERCENTAGE'
      ? 'Percentage'
      : coupon.discountType === 'FREE_SHIPPING'
        ? 'Free Shipping'
        : 'Flat Discount';
  const used = coupon.usedCount ?? coupon.usageCount ?? 0;
  const limit = coupon.usageLimit ?? 0;
  const pct = limit > 0 ? Math.round((used / limit) * 100) : 0;
  return {
    code: coupon.code,
    discount: discountLabel,
    discountLabel: typeLabel,
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-orange-600',
    codeBg: 'bg-orange-50',
    codeBorder: 'border-orange-300',
    codeText: 'text-orange-700',
    copyColor: 'text-orange-500',
    copyHover: 'hover:text-orange-700',
    barColor: 'bg-orange-500',
    minOrder: coupon.minOrderAmount ? `\u20B9${coupon.minOrderAmount.toLocaleString('en-IN')}` : '-',
    validTill: coupon.validUntil ?? coupon.endDate ?? '-',
    usageUsed: used.toLocaleString('en-IN'),
    usageLimit: limit > 0 ? limit.toLocaleString('en-IN') : 'Unlimited',
    usagePercent: pct,
  };
}

// ----------------------------------------------------------------
// Promo Stats (4 stat cards)
// ----------------------------------------------------------------

export function usePromoStats() {
  return useQuery<PromoStats>({
    queryKey: ['promo-stats'],
    queryFn: async () => {
      const response = await promosApi.search({ pageNum: 1, pageSize: 100 });
      return toPromoStats(response);
    },
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// Campaigns Table
// ----------------------------------------------------------------

export function useCampaigns() {
  return useQuery<Campaign[]>({
    queryKey: ['promo-campaigns'],
    queryFn: async () => {
      const response = await promosApi.search({ pageNum: 1, pageSize: 20 });
      return (response.list ?? []).map((r) => toCampaign(r.row));
    },
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// Active Coupons
// ----------------------------------------------------------------

export function useActiveCoupons() {
  return useQuery<CouponCard[]>({
    queryKey: ['promo-coupons-active'],
    queryFn: async () => {
      const response = await promosApi.search({
        pageNum: 1,
        pageSize: 20,
        filters: { stateId: 'ACTIVE' },
      });
      return (response.list ?? []).map((r) => toCouponCard(r.row));
    },
    staleTime: 30_000,
  });
}
