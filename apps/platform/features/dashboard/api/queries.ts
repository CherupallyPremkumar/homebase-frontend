'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@homebase/api-client';
import { CACHE_TIMES } from '@homebase/shared';

export function usePlatformStats() {
  return useQuery({
    queryKey: ['platform-stats'],
    queryFn: () => dashboardApi.overviewStats(),
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });
}

export function usePlatformActivity() {
  return useQuery({
    queryKey: ['platform-recent-orders'],
    queryFn: () => dashboardApi.recentOrders(10),
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });
}

export function usePlatformLowStock() {
  return useQuery({
    queryKey: ['platform-low-stock'],
    queryFn: () => dashboardApi.lowStockAlerts(),
    ...CACHE_TIMES.dashboard,
  });
}
