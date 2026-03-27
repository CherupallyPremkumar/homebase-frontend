'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi, shippingApi } from '@homebase/api-client';
import { CACHE_TIMES } from '@homebase/shared';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['oms-dashboard-stats'],
    queryFn: () => dashboardApi.overviewStats(),
    select: (data) => data.list?.[0]?.row,
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });
}

export function useOrdersByState() {
  return useQuery({
    queryKey: ['oms-orders-by-state'],
    queryFn: () => dashboardApi.ordersByState(),
    select: (data) => data.list?.map(r => r.row) ?? [],
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });
}

export function useRecentOrders(limit = 10) {
  return useQuery({
    queryKey: ['oms-recent-orders', limit],
    queryFn: () => dashboardApi.recentOrders({ pageNum: 1, pageSize: limit }),
    select: (data) => data.list?.map(r => r.row) ?? [],
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });
}

export function useDelayedShipments() {
  return useQuery({
    queryKey: ['oms-delayed-shipments'],
    queryFn: () => shippingApi.search({ filters: { delayed: true }, pageNum: 1, pageSize: 5 }),
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });
}
