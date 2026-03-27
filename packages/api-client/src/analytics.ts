import type { SearchRequest, SearchResponse } from '@homebase/types';
import { getApiClient } from './client';

export interface DailySales {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
  returnRate: number;
}

export interface RevenueByCategory {
  categoryId: string;
  categoryName: string;
  revenue: number;
  percentage: number;
  orderCount: number;
}

export const analyticsApi = {
  getDailySales(params: SearchRequest) {
    return getApiClient().post<SearchResponse<DailySales>>('/analytics/Analytics.getDailySales', params);
  },

  getProductPerformance(params: SearchRequest) {
    return getApiClient().post<SearchResponse<ProductPerformance>>('/analytics/Analytics.getProductPerformance', params);
  },

  getRevenueByCategory(params: SearchRequest) {
    return getApiClient().post<SearchResponse<RevenueByCategory>>('/analytics/Analytics.getRevenueByCategory', params);
  },
};
