'use client';

import { useQuery } from '@tanstack/react-query';
import { returnRequestsApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { ReturnRequest, SearchRequest } from '@homebase/types';

export function useReturnSearch(params: SearchRequest) {
  return useQuery({
    queryKey: ['oms-returns', 'list', params],
    queryFn: () => returnRequestsApi.search(params),
    ...CACHE_TIMES.productList,
  });
}

export function useReturnDetail(id: string) {
  return useQuery({
    queryKey: ['oms-return', id],
    queryFn: () => returnRequestsApi.retrieve(id),
    ...CACHE_TIMES.orderDetail,
    enabled: !!id,
  });
}

export function useReturnMutation() {
  return useStmMutation<ReturnRequest>({
    entityType: 'oms-return',
    mutationFn: returnRequestsApi.processById,
  });
}
