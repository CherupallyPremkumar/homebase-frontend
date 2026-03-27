'use client';

import { useQuery } from '@tanstack/react-query';
import { settlementsApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { SearchRequest, Settlement } from '@homebase/types';

export function useSellerSettlements(params: SearchRequest) {
  return useQuery({
    queryKey: ['seller-settlements', 'list', params],
    queryFn: () => settlementsApi.search(params),
    ...CACHE_TIMES.orderList,
  });
}

export function useSellerSettlementDetail(id: string) {
  return useQuery({
    queryKey: ['seller-settlements', id],
    queryFn: () => settlementsApi.retrieve(id),
    ...CACHE_TIMES.orderDetail,
    enabled: !!id,
  });
}

export function useSellerSettlementMutation() {
  return useStmMutation<Settlement>({
    entityType: 'seller-settlements',
    mutationFn: settlementsApi.processById,
  });
}
