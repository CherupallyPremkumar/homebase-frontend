/**
 * Mock data for the Coupon Management page.
 *
 * Matches the prototype at design-prototype/admin/promotions/coupons.html
 * pixel-for-pixel. When the backend is ready, swap mock imports in
 * use-coupons.ts for real fetch calls -- no component changes needed.
 */

import type {
  CouponMgmt,
  CouponMgmtStats,
  CouponMgmtTab,
  TopCoupon,
  ExpiringSoonCoupon,
  CouponCardData,
  StackingRule,
} from '../types';

// ----------------------------------------------------------------
// Stats
// ----------------------------------------------------------------

export const mockCouponStats: CouponMgmtStats = {
  totalCoupons: 24,
  activeCoupons: 24,
  activeTrend: '+3 new this week',
  expiringThisWeek: 4,
  expiringLabel: 'Action required',
  totalRedemptions: 12450,
  redemptionsTrend: '+1,240 this week',
  revenueImpact: '\u20B918.2L',
  revenueLabel: 'Saved for customers',
};

// ----------------------------------------------------------------
// Tab Counts (pill-style filters in prototype)
// ----------------------------------------------------------------

export const mockCouponTabs: CouponMgmtTab[] = [
  { label: 'All', count: '24' },
  { label: 'Active', count: '18' },
  { label: 'Expired', count: '3' },
  { label: 'Disabled', count: '3' },
];

// ----------------------------------------------------------------
// Top Performing Coupons (progress bars)
// ----------------------------------------------------------------

export const mockTopCoupons: TopCoupon[] = [
  {
    code: 'FREESHIP',
    label: 'Free Shipping',
    used: 2100,
    limit: 10000,
    percent: 21,
    saved: '\u20B94.2L',
    barColor: 'bg-green-500',
  },
  {
    code: 'WELCOME50',
    label: '50% off first order',
    used: 1230,
    limit: 5000,
    percent: 24.6,
    saved: '\u20B92.5L',
    barColor: 'bg-orange-500',
  },
  {
    code: 'SAVE15',
    label: '15% off \u20B9999+',
    used: 890,
    limit: 2000,
    percent: 44.5,
    saved: '\u20B93.8L',
    barColor: 'bg-blue-500',
  },
];

// ----------------------------------------------------------------
// Expiring Soon
// ----------------------------------------------------------------

export const mockExpiringSoon: ExpiringSoonCoupon[] = [
  {
    code: 'FLAT200',
    urgency: 'Expires Tomorrow',
    urgencyColor: 'bg-red-50 text-red-600',
    detail: '\u20B9200 off on \u20B91,499+ | 340 / 1,000 used',
  },
  {
    code: 'SAVE15',
    urgency: '3 days left',
    urgencyColor: 'bg-amber-50 text-amber-600',
    detail: '15% off (max \u20B9500) \u20B9999+ | 890 / 2,000 used',
  },
  {
    code: 'SPRING20',
    urgency: '5 days left',
    urgencyColor: 'bg-amber-50 text-amber-600',
    detail: '20% off (max \u20B9400) \u20B9799+ | 560 / 3,000 used',
  },
  {
    code: 'ELECTRONICS10',
    urgency: '6 days left',
    urgencyColor: 'bg-amber-50 text-amber-600',
    detail: '10% off electronics (max \u20B9300) | 420 / 2,000 used',
  },
];

// ----------------------------------------------------------------
// Stacking Rules
// ----------------------------------------------------------------

export const mockStackingRules: StackingRule[] = [
  { pair: 'FLAT15 + FREESHIP', allowed: true, reason: 'allowed' },
  { pair: 'FLAT15 + SAVE10', allowed: false, reason: 'blocked (conflict \u2014 two discount types)' },
  { pair: 'WELCOME50 + FREESHIP', allowed: true, reason: 'allowed (new user + shipping)' },
  { pair: 'WELCOME50 + SAVE15', allowed: false, reason: 'blocked (two percentage discounts)' },
];

// ----------------------------------------------------------------
// Active Coupon Cards (dashed border cards)
// ----------------------------------------------------------------

export const mockCouponCards: CouponCardData[] = [
  {
    code: 'WELCOME50',
    description: '50% off on first order',
    detail: 'Max discount: \u20B9200 | Min order: \u20B9499',
    used: '1,230 used',
  },
  {
    code: 'SAVE15',
    description: '15% off on orders above \u20B9999',
    detail: 'Max discount: \u20B9500 | Min order: \u20B9999',
    used: '890 used',
  },
  {
    code: 'FREESHIP',
    description: 'Free shipping on all orders',
    detail: 'No max discount | Min order: \u20B9299',
    used: '2,100 used',
  },
  {
    code: 'FLAT200',
    description: 'Flat \u20B9200 off on \u20B91,499+',
    detail: 'Flat \u20B9200 | Min order: \u20B91,499',
    used: '340 used',
  },
];

// ----------------------------------------------------------------
// Coupon Table List
// ----------------------------------------------------------------

export const mockCouponList: CouponMgmt[] = [
  {
    id: 'cpn-001',
    code: 'WELCOME50',
    type: 'Percentage',
    discount: '50% (max \u20B9200)',
    minOrder: '\u20B9499',
    usageUsed: 1230,
    usageLimit: 5000,
    status: 'Active',
    expires: 'Apr 30, 2026',
  },
  {
    id: 'cpn-002',
    code: 'SAVE15',
    type: 'Percentage',
    discount: '15% (max \u20B9500)',
    minOrder: '\u20B9999',
    usageUsed: 890,
    usageLimit: 2000,
    status: 'Active',
    expires: 'Apr 15, 2026',
  },
  {
    id: 'cpn-003',
    code: 'FREESHIP',
    type: 'Free Shipping',
    discount: 'Free delivery',
    minOrder: '\u20B9299',
    usageUsed: 2100,
    usageLimit: 10000,
    status: 'Active',
    expires: 'May 31, 2026',
  },
  {
    id: 'cpn-004',
    code: 'FLAT200',
    type: 'Flat Amount',
    discount: '\u20B9200 off',
    minOrder: '\u20B91,499',
    usageUsed: 340,
    usageLimit: 1000,
    status: 'Active',
    expires: 'Apr 10, 2026',
  },
  {
    id: 'cpn-005',
    code: 'DIWALI30',
    type: 'Percentage',
    discount: '30% (max \u20B91,000)',
    minOrder: '\u20B91,999',
    usageUsed: 4200,
    usageLimit: 4200,
    status: 'Expired',
    expires: 'Nov 15, 2025',
  },
  {
    id: 'cpn-006',
    code: 'SUMMER25',
    type: 'Percentage',
    discount: '25% (max \u20B9750)',
    minOrder: '\u20B91,299',
    usageUsed: 120,
    usageLimit: 3000,
    status: 'Active',
    expires: 'Jun 30, 2026',
  },
  {
    id: 'cpn-007',
    code: 'NEWYEAR10',
    type: 'Percentage',
    discount: '10% (max \u20B9300)',
    minOrder: '\u20B9599',
    usageUsed: 1800,
    usageLimit: 2000,
    status: 'Disabled',
    expires: 'Jan 31, 2026',
  },
  {
    id: 'cpn-008',
    code: 'BULK500',
    type: 'Flat Amount',
    discount: '\u20B9500 off',
    minOrder: '\u20B94,999',
    usageUsed: 56,
    usageLimit: 500,
    status: 'Active',
    expires: 'May 15, 2026',
  },
];
