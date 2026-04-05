/**
 * Mock data for the Promotions & Campaigns page.
 *
 * All values match the design prototype pixel-for-pixel.
 * When the backend endpoints are ready, swap the mock imports in
 * hooks for real fetch calls -- no component changes needed.
 */

import type { PromoStats, Campaign, CouponCard, PromoTab } from '../types';

export type {
  PromoStats,
  CampaignStatus,
  CampaignType,
  Campaign,
  CouponCard,
  PromoTab,
} from '../types';

// ----------------------------------------------------------------
// Stats
// ----------------------------------------------------------------

export const mockPromoStats: PromoStats = {
  activeCampaigns: 8,
  activeCampaignsTrend: '+2 this week',
  totalCoupons: 45,
  totalCouponsSubtitle: '12 active, 33 expired',
  promoRevenue: '\u20B912.5L',
  promoRevenueTrend: '+18.2% vs last month',
  redemptionRate: '23%',
  redemptionRateTrend: '+3.1% vs last month',
};

// ----------------------------------------------------------------
// Tabs
// ----------------------------------------------------------------

export const mockTabs: PromoTab[] = [
  { label: 'All',       count: 8, badgeBg: 'bg-orange-50',  badgeText: 'text-orange-600' },
  { label: 'Active',    count: 3, badgeBg: 'bg-green-50',   badgeText: 'text-green-600' },
  { label: 'Scheduled', count: 2, badgeBg: 'bg-blue-50',    badgeText: 'text-blue-600' },
  { label: 'Expired',   count: 2, badgeBg: 'bg-gray-100',   badgeText: 'text-gray-600' },
  { label: 'Draft',     count: 1, badgeBg: 'bg-yellow-50',  badgeText: 'text-yellow-700' },
];

// ----------------------------------------------------------------
// Campaign Rows (8 rows matching prototype)
// ----------------------------------------------------------------

export const mockCampaigns: Campaign[] = [
  {
    id: 'prm-001',
    name: 'Summer Mega Sale',
    subtitle: 'All categories',
    type: 'Flash Sale',
    discount: '40%',
    status: 'Active',
    startDate: '01 Mar 2026',
    endDate: '31 Mar 2026',
    usageUsed: 1440,
    usageLimit: 2000,
    usageLabel: '1,440/2,000',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
  },
  {
    id: 'prm-002',
    name: 'New User Welcome',
    subtitle: 'First-time buyers',
    type: 'Coupon',
    discount: '\u20B9200',
    status: 'Active',
    startDate: '15 Jan 2026',
    endDate: '31 Dec 2026',
    usageUsed: 3500,
    usageLimit: 10000,
    usageLabel: '3,500/10,000',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
  },
  {
    id: 'prm-003',
    name: 'Holi Festival Banner',
    subtitle: 'Homepage hero',
    type: 'Banner',
    discount: '25%',
    status: 'Expired',
    startDate: '10 Mar 2026',
    endDate: '18 Mar 2026',
    usageUsed: 8200,
    usageLimit: 8200,
    usageLabel: '8,200/8,200',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-500',
  },
  {
    id: 'prm-004',
    name: 'Free Shipping Week',
    subtitle: 'Orders above \u20B9499',
    type: 'Free Shipping',
    discount: '100%',
    status: 'Active',
    startDate: '25 Mar 2026',
    endDate: '31 Mar 2026',
    usageUsed: 960,
    usageLimit: 2000,
    usageLabel: '960/2,000',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    id: 'prm-005',
    name: 'Diwali Early Bird',
    subtitle: 'Home decor & lighting',
    type: 'Flash Sale',
    discount: '30%',
    status: 'Scheduled',
    startDate: '01 Oct 2026',
    endDate: '20 Oct 2026',
    usageUsed: 0,
    usageLimit: 5000,
    usageLabel: '0/5,000',
    iconBg: 'bg-yellow-50',
    iconColor: 'text-yellow-500',
  },
  {
    id: 'prm-006',
    name: 'Monsoon Clearance',
    subtitle: 'Rainwear & accessories',
    type: 'Coupon',
    discount: '\u20B9500',
    status: 'Expired',
    startDate: '01 Jul 2025',
    endDate: '31 Aug 2025',
    usageUsed: 2640,
    usageLimit: 3000,
    usageLabel: '2,640/3,000',
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-500',
  },
  {
    id: 'prm-007',
    name: 'Independence Day Offer',
    subtitle: 'Electronics & appliances',
    type: 'Banner',
    discount: '15%',
    status: 'Scheduled',
    startDate: '10 Aug 2026',
    endDate: '17 Aug 2026',
    usageUsed: 0,
    usageLimit: 10000,
    usageLabel: '0/10,000',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-500',
  },
  {
    id: 'prm-008',
    name: 'Loyalty Reward Program',
    subtitle: 'Repeat customers',
    type: 'Coupon',
    discount: '10%',
    status: 'Draft',
    startDate: 'TBD',
    endDate: 'TBD',
    usageUsed: 0,
    usageLimit: null,
    usageLabel: '0/--',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
];

// ----------------------------------------------------------------
// Active Coupon Cards (4 cards matching prototype)
// ----------------------------------------------------------------

export const mockCoupons: CouponCard[] = [
  {
    code: 'WELCOME200',
    discount: '\u20B9200 OFF',
    discountLabel: 'Flat Discount',
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-orange-600',
    codeBg: 'bg-orange-50',
    codeBorder: 'border-orange-300',
    codeText: 'text-orange-700',
    copyColor: 'text-orange-500',
    copyHover: 'hover:text-orange-700',
    barColor: 'bg-orange-500',
    minOrder: '\u20B9999',
    validTill: '31 Dec 2026',
    usageUsed: '3,500',
    usageLimit: '10,000',
    usagePercent: 35,
  },
  {
    code: 'SUMMER40',
    discount: '40% OFF',
    discountLabel: 'Percentage',
    gradientFrom: 'from-red-500',
    gradientTo: 'to-red-600',
    codeBg: 'bg-red-50',
    codeBorder: 'border-red-300',
    codeText: 'text-red-700',
    copyColor: 'text-red-500',
    copyHover: 'hover:text-red-700',
    barColor: 'bg-red-500',
    minOrder: '\u20B91,499',
    validTill: '31 Mar 2026',
    usageUsed: '1,440',
    usageLimit: '2,000',
    usagePercent: 72,
  },
  {
    code: 'FREESHIP',
    discount: 'FREE SHIP',
    discountLabel: 'Free Shipping',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-blue-600',
    codeBg: 'bg-blue-50',
    codeBorder: 'border-blue-300',
    codeText: 'text-blue-700',
    copyColor: 'text-blue-500',
    copyHover: 'hover:text-blue-700',
    barColor: 'bg-blue-500',
    minOrder: '\u20B9499',
    validTill: '31 Mar 2026',
    usageUsed: '960',
    usageLimit: '2,000',
    usagePercent: 48,
  },
  {
    code: 'EXTRA15',
    discount: '15% OFF',
    discountLabel: 'Percentage',
    gradientFrom: 'from-emerald-500',
    gradientTo: 'to-emerald-600',
    codeBg: 'bg-emerald-50',
    codeBorder: 'border-emerald-300',
    codeText: 'text-emerald-700',
    copyColor: 'text-emerald-500',
    copyHover: 'hover:text-emerald-700',
    barColor: 'bg-emerald-500',
    minOrder: '\u20B9799',
    validTill: '30 Apr 2026',
    usageUsed: '1,120',
    usageLimit: '5,000',
    usagePercent: 22,
  },
];
