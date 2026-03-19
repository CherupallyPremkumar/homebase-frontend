'use client';

import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { Order, SearchRequest } from '@homebase/types';

export function useOrderSearch(params: SearchRequest) {
  return useQuery({
    queryKey: ['admin-orders', 'list', params],
    queryFn: () => ordersApi.search(params),
    ...CACHE_TIMES.productList,
  });
}

export function useOrderDetail(id: string) {
  return useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => ordersApi.getById(id),
    ...CACHE_TIMES.orderDetail,
    enabled: !!id,
  });
}

export function useOrderMutation() {
  return useStmMutation<Order>({
    entityType: 'admin-order',
    mutationFn: ordersApi.processEvent,
  });
}
