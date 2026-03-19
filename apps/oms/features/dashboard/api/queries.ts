'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi, ordersApi, shippingApi } from '@homebase/api-client';
import { CACHE_TIMES } from '@homebase/shared';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['oms-dashboard-stats'],
    queryFn: () => dashboardApi.overviewStats(),
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });
}

export function useOrdersByState() {
  return useQuery({
    queryKey: ['oms-orders-by-state'],
    queryFn: () => dashboardApi.ordersByState(),
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });
}

export function useRecentOrders(limit = 10) {
  return useQuery({
    queryKey: ['oms-recent-orders', limit],
    queryFn: () => dashboardApi.recentOrders(limit),
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });
}

export function useDelayedShipments() {
  return useQuery({
    queryKey: ['oms-delayed-shipments'],
    queryFn: () => shippingApi.search({ filters: { delayed: true }, page: 0, size: 5 }),
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });
}

export function usePendingOrders() {
  return useQuery({
    queryKey: ['oms-pending-orders'],
    queryFn: () => ordersApi.search({ filters: { stateId: 'CREATED' }, page: 0, size: 100 }),
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });
}
