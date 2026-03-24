'use client';

import { useQuery } from '@tanstack/react-query';
import { reconciliationApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { ReconciliationBatch, SearchRequest } from '@homebase/types';

export function useReconciliationSearch(params: SearchRequest) {
  return useQuery({
    queryKey: ['finance-reconciliation', 'list', params],
    queryFn: () => reconciliationApi.search(params),
    ...CACHE_TIMES.productList,
  });
}

export function useReconciliationDetail(id: string) {
  return useQuery({
    queryKey: ['finance-reconciliation', id],
    queryFn: () => reconciliationApi.retrieve(id),
    ...CACHE_TIMES.orderDetail,
    enabled: !!id,
  });
}

export function useReconciliationMismatches(batchId: string) {
  return useQuery({
    queryKey: ['finance-reconciliation-mismatches', batchId],
    queryFn: () => reconciliationApi.mismatches({ pageNum: 1, pageSize: 100, filters: { batchId } }),
    select: (data) => data.list?.map(r => r.row) ?? [],
    ...CACHE_TIMES.orderDetail,
    enabled: !!batchId,
  });
}

export function useReconciliationMutation() {
  return useStmMutation<ReconciliationBatch>({
    entityType: 'finance-reconciliation',
    mutationFn: reconciliationApi.processById,
  });
}
