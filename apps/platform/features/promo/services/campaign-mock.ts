/**
 * Mock data for the Marketing Campaigns page.
 *
 * Matches the prototype at design-prototype/admin/promotions/campaigns.html.
 * When the backend endpoints are ready, swap the mock imports in
 * use-campaigns.ts for real fetch calls -- no component changes needed.
 */

import type {
  CampaignMgmt,
  CampaignMgmtStats,
  CampaignMgmtTab,
  CampaignTemplate,
} from '../types';

// ----------------------------------------------------------------
// Stats
// ----------------------------------------------------------------

export const mockCampaignStats: CampaignMgmtStats = {
  activeCampaigns: 8,
  activeTrend: '+2 since last week',
  sentThisMonth: '45K',
  sentTrend: '+12% vs last month',
  openRate: '28%',
  openBenchmark: 'Industry avg: 21%',
  clickRate: '4.2%',
  clickBenchmark: 'Industry avg: 2.6%',
};

// ----------------------------------------------------------------
// Tab Counts (channel filter)
// ----------------------------------------------------------------

export const mockCampaignTabs: CampaignMgmtTab[] = [
  { label: 'All', count: '8' },
  { label: 'Email', count: '4' },
  { label: 'SMS', count: '2' },
  { label: 'Push', count: '2' },
];

// ----------------------------------------------------------------
// Campaign List
// ----------------------------------------------------------------

export const mockCampaignList: CampaignMgmt[] = [
  {
    id: 'cmp-001',
    name: 'Summer Sale Blast',
    subtitle: 'All Customers | Mar 25, 2026',
    channel: 'Email',
    status: 'Active',
    sent: 12450,
    opened: 3996,
    openRate: 32.1,
    clicked: 623,
    clickRate: 5.0,
    conversions: 89,
    revenue: '\u20B91.8L',
  },
  {
    id: 'cmp-002',
    name: 'New Arrivals Alert',
    subtitle: 'Active Buyers | Mar 24, 2026',
    channel: 'Push',
    status: 'Active',
    sent: 8320,
    opened: 3453,
    openRate: 41.5,
    clicked: 498,
    clickRate: 6.0,
    conversions: 72,
    revenue: '\u20B91.4L',
  },
  {
    id: 'cmp-003',
    name: 'Loyalty Points Reminder',
    subtitle: 'Loyalty Members | Mar 23, 2026',
    channel: 'SMS',
    status: 'Active',
    sent: 5600,
    opened: null,
    openRate: null,
    clicked: 336,
    clickRate: 6.0,
    conversions: 54,
    revenue: '\u20B992K',
  },
  {
    id: 'cmp-004',
    name: 'Flash Sale Weekend',
    subtitle: 'High Spenders | Mar 18, 2026',
    channel: 'Email',
    status: 'Completed',
    sent: 9100,
    opened: 2530,
    openRate: 27.8,
    clicked: 382,
    clickRate: 4.2,
    conversions: 61,
    revenue: '\u20B91.1L',
  },
  {
    id: 'cmp-005',
    name: 'Cart Recovery',
    subtitle: 'Abandoned Carts | Mar 12, 2026',
    channel: 'Email',
    status: 'Completed',
    sent: 6230,
    opened: 1514,
    openRate: 24.3,
    clicked: 249,
    clickRate: 4.0,
    conversions: 43,
    revenue: '\u20B978K',
  },
  {
    id: 'cmp-006',
    name: 'Win-back Inactive Users',
    subtitle: 'Inactive 30d+ | Mar 10, 2026',
    channel: 'Push',
    status: 'Draft',
    sent: 3300,
    opened: 624,
    openRate: 18.9,
    clicked: 99,
    clickRate: 3.0,
    conversions: 12,
    revenue: '--',
  },
  {
    id: 'cmp-007',
    name: 'Holi Festival Special',
    subtitle: 'All Customers | Mar 8, 2026',
    channel: 'Email',
    status: 'Completed',
    sent: 15200,
    opened: 4864,
    openRate: 32.0,
    clicked: 760,
    clickRate: 5.0,
    conversions: 118,
    revenue: '\u20B92.4L',
  },
  {
    id: 'cmp-008',
    name: 'Delivery Update - Order Shipped',
    subtitle: 'Recent Orders | Ongoing',
    channel: 'SMS',
    status: 'Active',
    sent: 2800,
    opened: null,
    openRate: null,
    clicked: 196,
    clickRate: 7.0,
    conversions: 0,
    revenue: '--',
  },
];

// ----------------------------------------------------------------
// Campaign Templates
// ----------------------------------------------------------------

export const mockCampaignTemplates: CampaignTemplate[] = [
  {
    id: 'tpl-001',
    title: 'Welcome Series',
    description: 'Onboard new customers with a 3-part email series',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    icon: 'UserRound',
  },
  {
    id: 'tpl-002',
    title: 'Sale Alert',
    description: 'Announce flash sales and limited-time offers',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    icon: 'Sparkles',
  },
  {
    id: 'tpl-003',
    title: 'Abandoned Cart',
    description: 'Recover lost sales with automated cart reminders',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    icon: 'ShoppingCart',
  },
  {
    id: 'tpl-004',
    title: 'Reactivation',
    description: 'Win back inactive customers with special offers',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    icon: 'RefreshCw',
  },
];
