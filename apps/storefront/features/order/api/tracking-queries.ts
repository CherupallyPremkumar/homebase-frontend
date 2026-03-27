'use client';

import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@homebase/api-client';

/**
 * Fetches order data including tracking info and activity timeline.
 * The order entity contains trackingNumber, estimatedDelivery, and activities
 * which together form the tracking view.
 */
export function useOrderTracking(orderId: string) {
  return useQuery({
    queryKey: ['orders', orderId, 'tracking'],
    queryFn: () => ordersApi.retrieve(orderId),
    enabled: !!orderId,
    staleTime: 10_000,
    gcTime: 120_000,
    refetchInterval: 60_000, // Auto-refresh tracking every minute
  });
}
