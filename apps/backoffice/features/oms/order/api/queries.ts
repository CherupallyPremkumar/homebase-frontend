'use client';

import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { Order, SearchRequest } from '@homebase/types';

export function useOrderSearch(params: SearchRequest) {
  return useQuery({
    queryKey: ['oms-orders', 'list', params],
    queryFn: () => ordersApi.search(params),
    ...CACHE_TIMES.productList,
  });
}

export function useOrderDetail(id: string) {
  return useQuery({
    queryKey: ['oms-order', id],
    queryFn: () => ordersApi.retrieve(id),
    ...CACHE_TIMES.orderDetail,
    enabled: !!id,
  });
}

export function useOrderMutation() {
  return useStmMutation<Order>({
    entityType: 'oms-order',
    mutationFn: ordersApi.processById,
  });
}
