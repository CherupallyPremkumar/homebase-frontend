'use client';

import { useQuery } from '@tanstack/react-query';
import { reconciliationApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { ReconciliationBatch, SearchRequest } from '@homebase/types';

export function useReconciliationSearch(params: SearchRequest) {
  return useQuery({
    queryKey: ['admin-reconciliation', 'list', params],
    queryFn: () => reconciliationApi.search(params),
    ...CACHE_TIMES.productList,
  });
}

export function useReconciliationMutation() {
  return useStmMutation<ReconciliationBatch>({
    entityType: 'admin-reconciliation',
    mutationFn: reconciliationApi.processEvent,
  });
}
