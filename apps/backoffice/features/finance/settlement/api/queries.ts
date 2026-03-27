'use client';

import { useQuery } from '@tanstack/react-query';
import { settlementsApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { Settlement, SearchRequest } from '@homebase/types';

export function useSettlementSearch(params: SearchRequest) {
  return useQuery({
    queryKey: ['finance-settlements', 'list', params],
    queryFn: () => settlementsApi.search(params),
    ...CACHE_TIMES.productList,
  });
}

export function useSettlementDetail(id: string) {
  return useQuery({
    queryKey: ['finance-settlement', id],
    queryFn: () => settlementsApi.retrieve(id),
    ...CACHE_TIMES.orderDetail,
    enabled: !!id,
  });
}

export function useSettlementMutation() {
  return useStmMutation<Settlement>({
    entityType: 'finance-settlement',
    mutationFn: settlementsApi.processById,
  });
}
