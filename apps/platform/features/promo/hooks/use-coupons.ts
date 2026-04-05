'use client';

import { useQuery } from '@tanstack/react-query';
import { promosApi } from '@homebase/api-client';

import type { CouponMgmt, CouponMgmtStats, CouponMgmtStatus } from '../types';
import type { Coupon, SearchResponse } from '@homebase/types';

// ----------------------------------------------------------------
// Adapter: Coupon (API) -> CouponMgmt (UI)
// ----------------------------------------------------------------

function toCouponMgmt(coupon: Coupon): CouponMgmt {
  const statusMap: Record<string, CouponMgmtStatus> = {
    ACTIVE: 'Active',
    EXPIRED: 'Expired',
    SCHEDULED: 'Scheduled',
    DISABLED: 'Disabled',
    CREATED: 'Active',
  };
  const discountType = coupon.discountType === 'PERCENTAGE' ? 'percentage' : 'flat';
  const maxLabel = coupon.maxDiscountAmount
    ? ` (max \u20B9${coupon.maxDiscountAmount.toLocaleString('en-IN')})`
    : '';
  const discount =
    discountType === 'percentage'
      ? `${coupon.discountValue}%${maxLabel}`
      : `\u20B9${coupon.discountValue.toLocaleString('en-IN')} off`;
  const type =
    discountType === 'percentage' ? 'Percentage' : 'Flat Amount';

  return {
    id: coupon.id,
    code: coupon.code,
    type,
    discount,
    minOrder: `\u20B9${(coupon.minOrderAmount ?? 0).toLocaleString('en-IN')}`,
    usageUsed: coupon.usedCount ?? coupon.usageCount ?? 0,
    usageLimit: coupon.usageLimit ?? 0,
    status: statusMap[coupon.stateId] ?? 'Active',
    expires: coupon.validUntil ?? coupon.endDate ?? '',
  };
}

function toStats(response: SearchResponse<Coupon>): CouponMgmtStats {
  const list = response.list?.map((r) => r.row) ?? [];
  const active = list.filter((c) => c.isActive || c.stateId === 'ACTIVE').length;
  const totalRedemptions = list.reduce((sum, c) => sum + (c.usedCount ?? c.usageCount ?? 0), 0);
  const impact = list.reduce((sum, c) => sum + (c.usedCount ?? 0) * c.discountValue, 0);
  const formatted = impact >= 100000 ? `\u20B9${(impact / 100000).toFixed(1)}L` : `\u20B9${impact.toLocaleString('en-IN')}`;
  return {
    totalCoupons: response.maxRows ?? list.length,
    activeCoupons: active,
    activeTrend: `+${active} active`,
    expiringThisWeek: 0,
    expiringLabel: 'None expiring',
    totalRedemptions,
    redemptionsTrend: `${totalRedemptions.toLocaleString('en-IN')} total`,
    revenueImpact: formatted,
    revenueLabel: 'Saved for customers',
  };
}

// ----------------------------------------------------------------
// Coupon Stats (4 stat cards)
// ----------------------------------------------------------------

export function useCouponStats() {
  return useQuery<CouponMgmtStats>({
    queryKey: ['coupon-mgmt-stats'],
    queryFn: async () => {
      const response = await promosApi.search({ pageNum: 1, pageSize: 100 });
      return toStats(response);
    },
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// Coupon List (filterable)
// ----------------------------------------------------------------

export function useCouponList(filter?: string) {
  return useQuery<CouponMgmt[]>({
    queryKey: ['coupon-mgmt-list', filter],
    queryFn: async () => {
      const filters: Record<string, string> = {};
      if (filter && filter !== 'All') {
        filters.stateId = filter.toUpperCase();
      }
      const response = await promosApi.search({ pageNum: 1, pageSize: 50, filters });
      return (response.list ?? []).map((r) => toCouponMgmt(r.row));
    },
    staleTime: 30_000,
  });
}
