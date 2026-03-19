import type { DashboardStats, DailyOrderStats, OrdersByState, StockAlert, Order } from '@homebase/types';
import { getApiClient } from './client';

export const dashboardApi = {
  overviewStats() {
    return getApiClient().get<DashboardStats>('/api/v1/dashboard/stats');
  },
  dailyOrderStats(days = 30) {
    return getApiClient().get<DailyOrderStats[]>(`/api/v1/dashboard/daily-orders?days=${days}`);
  },
  ordersByState() {
    return getApiClient().get<OrdersByState[]>('/api/v1/dashboard/orders-by-state');
  },
  recentOrders(limit = 10) {
    return getApiClient().get<Order[]>(`/api/v1/dashboard/recent-orders?limit=${limit}`);
  },
  lowStockAlerts() {
    return getApiClient().get<StockAlert[]>('/api/v1/dashboard/low-stock-alerts');
  },
};
