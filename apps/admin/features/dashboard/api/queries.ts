'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@homebase/api-client';
import { CACHE_TIMES } from '@homebase/shared';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.overviewStats(),
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });
}

export function useDailyOrders(days = 30) {
  return useQuery({
    queryKey: ['dashboard-daily-orders', days],
    queryFn: () => dashboardApi.dailyOrderStats(days),
    ...CACHE_TIMES.dashboard,
  });
}

export function useOrdersByState() {
  return useQuery({
    queryKey: ['dashboard-orders-by-state'],
    queryFn: () => dashboardApi.ordersByState(),
    ...CACHE_TIMES.dashboard,
  });
}

export function useRecentOrders(limit = 10) {
  return useQuery({
    queryKey: ['dashboard-recent-orders', limit],
    queryFn: () => dashboardApi.recentOrders(limit),
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });
}

export function useLowStockAlerts() {
  return useQuery({
    queryKey: ['dashboard-low-stock'],
    queryFn: () => dashboardApi.lowStockAlerts(),
    ...CACHE_TIMES.dashboard,
  });
}
