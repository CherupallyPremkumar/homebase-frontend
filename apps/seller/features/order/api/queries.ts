'use client';

import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { SearchRequest, Order } from '@homebase/types';

export function useSellerOrders(params: SearchRequest) {
  return useQuery({
    queryKey: ['seller-orders', 'list', params],
    queryFn: () => ordersApi.search(params),
    ...CACHE_TIMES.orderList,
  });
}

export function useSellerOrderDetail(id: string) {
  return useQuery({
    queryKey: ['seller-orders', id],
    queryFn: () => ordersApi.retrieve(id),
    ...CACHE_TIMES.orderDetail,
    enabled: !!id,
  });
}

export function useSellerOrderMutation() {
  return useStmMutation<Order>({
    entityType: 'seller-orders',
    mutationFn: ordersApi.processById,
  });
}
