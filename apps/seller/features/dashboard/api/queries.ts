'use client';

import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';
import { CACHE_TIMES } from '@homebase/shared';
import type { SearchResponse } from '@homebase/types';

// Seller-specific dashboard endpoints — use Chenile query format
const sellerDashboard = {
  stats: () => getApiClient().post<SearchResponse<SellerStats>>('/dashboard/sellerStats', {
    pageNum: 1,
    pageSize: 1,
  }),
  dailySales: (days = 30) => getApiClient().post<SearchResponse<DailySales>>('/dashboard/sellerDailySales', {
    pageNum: 1,
    pageSize: days,
    filters: { days },
  }),
  topProducts: (limit = 10) => getApiClient().post<SearchResponse<TopProduct>>('/dashboard/sellerTopProducts', {
    pageNum: 1,
    pageSize: limit,
  }),
  recentOrders: (limit = 10) => getApiClient().post<SearchResponse<RecentSellerOrder>>('/dashboard/sellerRecentOrders', {
    pageNum: 1,
    pageSize: limit,
  }),
};

export interface SellerStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  pendingSettlement: number;
  averageRating: number;
  returnRate: number;
  productsChange: number;
  ordersChange: number;
  revenueChange: number;
}

// Matches Dashboard.sellerDailySales SQL output
export interface DailySales {
  date: string;
  orderCount: number;
  revenue: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  unitsSold: number;
  revenue: number;
  rating: number;
}

// Matches Dashboard.sellerRecentOrders SQL output
export interface RecentSellerOrder {
  orderId: string;
  orderState: string;
  totalAmount: number;
  currency: string;
  createdTime: string;
  itemCount: number;
}

export function useSellerStats() {
  return useQuery({
    queryKey: ['seller-stats'],
    queryFn: () => sellerDashboard.stats(),
    select: (data) => data.list?.[0]?.row,
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });
}

export function useDailySales(days = 30) {
  return useQuery({
    queryKey: ['seller-daily-sales', days],
    queryFn: () => sellerDashboard.dailySales(days),
    select: (data) => data.list?.map(r => r.row) ?? [],
    ...CACHE_TIMES.dashboard,
  });
}

export function useTopProducts() {
  return useQuery({
    queryKey: ['seller-top-products'],
    queryFn: () => sellerDashboard.topProducts(),
    select: (data) => data.list?.map(r => r.row) ?? [],
    ...CACHE_TIMES.dashboard,
  });
}

export function useRecentSellerOrders() {
  return useQuery({
    queryKey: ['seller-recent-orders'],
    queryFn: () => sellerDashboard.recentOrders(),
    select: (data) => data.list?.map(r => r.row) ?? [],
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });
}
