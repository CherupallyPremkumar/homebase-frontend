'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@homebase/api-client';
import { CACHE_TIMES } from '@homebase/shared';

export function usePlatformStats() {
  return useQuery({
    queryKey: ['platform-stats'],
    queryFn: () => dashboardApi.overviewStats(),
    select: (data) => data.list?.[0]?.row,
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });
}

export function usePlatformActivity() {
  return useQuery({
    queryKey: ['platform-recent-orders'],
    queryFn: () => dashboardApi.recentOrders({ pageNum: 1, pageSize: 10 }),
    select: (data) => data.list?.map(r => r.row) ?? [],
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });
}

export function usePlatformLowStock() {
  return useQuery({
    queryKey: ['platform-low-stock'],
    queryFn: () => dashboardApi.lowStockAlerts(),
    select: (data) => data.list?.map(r => r.row) ?? [],
    ...CACHE_TIMES.dashboard,
  });
}
