'use client';

import { useQuery } from '@tanstack/react-query';
import { fulfillmentApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { FulfillmentOrder, SearchRequest } from '@homebase/types';

export function useFulfillmentSearch(params: SearchRequest) {
  return useQuery({
    queryKey: ['oms-fulfillment', 'list', params],
    queryFn: () => fulfillmentApi.search(params),
    ...CACHE_TIMES.productList,
  });
}

export function useFulfillmentDetail(id: string) {
  return useQuery({
    queryKey: ['oms-fulfillment', id],
    queryFn: () => fulfillmentApi.retrieve(id),
    ...CACHE_TIMES.orderDetail,
    enabled: !!id,
  });
}

export function useFulfillmentMutation() {
  return useStmMutation<FulfillmentOrder>({
    entityType: 'oms-fulfillment',
    mutationFn: fulfillmentApi.processById,
  });
}
