'use client';

import { useQuery } from '@tanstack/react-query';
import { promosApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { Coupon, SearchRequest } from '@homebase/types';

export function usePromoSearch(params: SearchRequest) {
  return useQuery({
    queryKey: ['platform-promotions', 'list', params],
    queryFn: () => promosApi.search(params),
    ...CACHE_TIMES.productList,
  });
}

export function usePromoMutation() {
  return useStmMutation<Coupon>({
    entityType: 'platform-promo',
    mutationFn: promosApi.processEvent,
  });
}
