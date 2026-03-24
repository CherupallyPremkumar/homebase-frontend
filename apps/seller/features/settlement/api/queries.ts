'use client';

import { useQuery } from '@tanstack/react-query';
import { settlementsApi } from '@homebase/api-client';
import { CACHE_TIMES } from '@homebase/shared';
import type { SearchRequest } from '@homebase/types';

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
