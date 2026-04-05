/**
 * Pure adapter functions: transform backend SearchResponse data into
 * dashboard-specific UI types. Shared between client hooks and server prefetch.
 */

import type { DashboardStats as ApiDashboardStats, DailyOrderStats, SearchResponse } from '@homebase/types';

import type {
  MockDashboardStats as DashboardStats,
  RevenueChartData,
  ActivityItem,
  TopSeller,
} from './types';

// ----------------------------------------------------------------
// Overview Stats
// ----------------------------------------------------------------

export function adaptOverviewStats(response: SearchResponse<ApiDashboardStats>): DashboardStats {
  const row = response.list?.[0]?.row;
  if (!row) {
    return {
      totalRevenue: { value: 0, currency: 'INR' },
      totalOrders: { value: 0 },
      activeSellers: { value: 0 },
      activeUsers: { value: 0 },
      productsListed: { value: 0 },
      pendingApprovals: { value: 0, needsAction: false },
    };
  }
  return {
    totalRevenue: { value: row.totalRevenue, currency: 'INR' },
    totalOrders: { value: row.totalOrders },
    activeSellers: { value: row.activeSuppliers },
    activeUsers: { value: row.totalCustomers },
    productsListed: { value: row.publishedProducts },
    pendingApprovals: { value: row.pendingReviewProducts + row.openTickets, needsAction: (row.pendingReviewProducts + row.openTickets) > 0 },
  };
}

// ----------------------------------------------------------------
// Revenue Chart
// ----------------------------------------------------------------

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function adaptDailyOrderStatsToRevenue(response: SearchResponse<DailyOrderStats>): RevenueChartData {
  const rows = response.list?.map((item) => item.row) ?? [];
  const monthMap = new Map<string, number>();
  for (const row of rows) {
    const date = new Date(row.date);
    const label = MONTH_LABELS[date.getMonth()]!;
    monthMap.set(label, (monthMap.get(label) ?? 0) + row.revenue);
  }
  const data = Array.from(monthMap.entries()).map(([label, revenue]) => ({
    label,
    revenue,
    target: 0,
  }));
  const total = data.reduce((sum, d) => sum + d.revenue, 0);
  return {
    period: '12m',
    data,
    total,
    average: data.length > 0 ? Math.round(total / data.length) : 0,
  };
}

// ----------------------------------------------------------------
// Recent Activity
// ----------------------------------------------------------------

interface RecentOrderRow {
  id: string;
  orderNumber?: string;
  stateId?: string;
  total?: number;
  totalAmount?: number;
  currency?: string;
  createdTime?: string;
  itemCount?: number;
  customerId?: string;
}

function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

function orderStateBadgeColor(state: string): 'green' | 'blue' | 'red' | 'emerald' | 'violet' | 'amber' {
  switch (state) {
    case 'CREATED': case 'PAID': return 'blue';
    case 'DELIVERED': case 'COMPLETED': return 'green';
    case 'CANCELLED': case 'FAILED': return 'red';
    case 'SHIPPED': return 'emerald';
    case 'REFUNDED': return 'violet';
    default: return 'amber';
  }
}

export function adaptRecentOrdersToActivity(response: SearchResponse<RecentOrderRow>): ActivityItem[] {
  return (response.list ?? []).map((item, index) => {
    const order = item.row;
    const state = order.stateId ?? 'UNKNOWN';
    const orderId = order.id ?? `act-${index}`;
    const amount = order.total ?? order.totalAmount ?? 0;
    return {
      id: orderId,
      type: 'ORDER',
      title: `Order ${order.orderNumber ?? orderId} - ${state}`,
      subtitle: `${order.itemCount ?? 0} items · ₹${amount.toLocaleString('en-IN')}`,
      relativeTime: order.createdTime ? formatRelativeTime(order.createdTime) : '',
      badge: { label: state, color: orderStateBadgeColor(state) },
      icon: { type: 'shopping-bag', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
      navigateTo: `/orders/${orderId}`,
    };
  });
}

// ----------------------------------------------------------------
// Top Sellers
// ----------------------------------------------------------------

interface SupplierRow {
  id?: string;
  businessName?: string;
  productCount?: number;
  rating?: number;
  commissionRate?: number;
}

export function adaptSuppliersToTopSellers(response: SearchResponse<SupplierRow>): TopSeller[] {
  return (response.list ?? []).map((item) => {
    const s = item.row;
    return {
      id: s.id ?? '',
      storeName: s.businessName ?? '',
      tier: 'Standard Seller',
      products: s.productCount ?? 0,
      orders: 0,
      revenue: 0,
      rating: s.rating ?? 0,
    };
  });
}
