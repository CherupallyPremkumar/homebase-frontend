'use client';

import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@homebase/api-client';
import { CACHE_TIMES } from '@homebase/shared';
import type { SearchRequest } from '@homebase/types';

export function useMyOrders(params: SearchRequest) {
  return useQuery({
    queryKey: ['my-orders', params],
    queryFn: () => ordersApi.myOrders(params),
    ...CACHE_TIMES.orderList,
  });
}

export function useOrderDetail(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersApi.retrieve(id),
    ...CACHE_TIMES.orderDetail,
    enabled: !!id,
  });
}
