import type { DashboardStats, DailyOrderStats, OrdersByState, StockAlert, Order, SearchRequest, SearchResponse } from '@homebase/types';
import { getApiClient } from './client';

export const dashboardApi = {
  overviewStats(params?: SearchRequest) {
    return getApiClient().post<SearchResponse<DashboardStats>>('/dashboard/overviewStats', params ?? {
      pageNum: 1,
      pageSize: 1,
    });
  },
  dailyOrderStats(params?: SearchRequest) {
    return getApiClient().post<SearchResponse<DailyOrderStats>>('/dashboard/dailyOrderStats', params ?? {
      pageNum: 1,
      pageSize: 30,
    });
  },
  ordersByState(params?: SearchRequest) {
    return getApiClient().post<SearchResponse<OrdersByState>>('/dashboard/ordersByState', params ?? {
      pageNum: 1,
      pageSize: 50,
    });
  },
  recentOrders(params?: SearchRequest) {
    return getApiClient().post<SearchResponse<Order>>('/dashboard/recentOrders', params ?? {
      pageNum: 1,
      pageSize: 10,
    });
  },
  lowStockAlerts(params?: SearchRequest) {
    return getApiClient().post<SearchResponse<StockAlert>>('/dashboard/lowStockAlerts', params ?? {
      pageNum: 1,
      pageSize: 20,
    });
  },
};
