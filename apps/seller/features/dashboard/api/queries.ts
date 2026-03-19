'use client';

import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';
import { CACHE_TIMES } from '@homebase/shared';

// Seller-specific dashboard endpoints
const sellerDashboard = {
  stats: () => getApiClient().get<SellerStats>('/api/v1/seller/dashboard/stats'),
  dailySales: (days = 30) => getApiClient().get<DailySales[]>(`/api/v1/seller/dashboard/daily-sales?days=${days}`),
  topProducts: (limit = 10) => getApiClient().get<TopProduct[]>(`/api/v1/seller/dashboard/top-products?limit=${limit}`),
  recentOrders: (limit = 10) => getApiClient().get<RecentSellerOrder[]>(`/api/v1/seller/dashboard/recent-orders?limit=${limit}`),
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

export interface DailySales {
  date: string;
  orders: number;
  revenue: number;
  units: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  unitsSold: number;
  revenue: number;
  rating: number;
}

export interface RecentSellerOrder {
  orderId: string;
  orderNumber: string;
  productName: string;
  quantity: number;
  amount: number;
  state: string;
  createdTime: string;
}

export function useSellerStats() {
  return useQuery({
    queryKey: ['seller-stats'],
    queryFn: () => sellerDashboard.stats(),
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });
}

export function useDailySales(days = 30) {
  return useQuery({
    queryKey: ['seller-daily-sales', days],
    queryFn: () => sellerDashboard.dailySales(days),
    ...CACHE_TIMES.dashboard,
  });
}

export function useTopProducts() {
  return useQuery({
    queryKey: ['seller-top-products'],
    queryFn: () => sellerDashboard.topProducts(),
    ...CACHE_TIMES.dashboard,
  });
}

export function useRecentSellerOrders() {
  return useQuery({
    queryKey: ['seller-recent-orders'],
    queryFn: () => sellerDashboard.recentOrders(),
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });
}
