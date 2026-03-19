'use client';

import { useQuery } from '@tanstack/react-query';
import { settlementsApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { Settlement, SearchRequest } from '@homebase/types';

export function useSettlementSearch(params: SearchRequest) {
  return useQuery({
    queryKey: ['admin-settlements', 'list', params],
    queryFn: () => settlementsApi.search(params),
    ...CACHE_TIMES.productList,
  });
}

export function useSettlementMutation() {
  return useStmMutation<Settlement>({
    entityType: 'admin-settlement',
    mutationFn: settlementsApi.processEvent,
  });
}
