'use client';

import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@homebase/api-client';
import { CACHE_TIMES } from '@homebase/shared';
import type { SearchRequest } from '@homebase/types';

export function useProductSearch(params: SearchRequest) {
  return useQuery({
    queryKey: ['products', 'list', params],
    queryFn: () => catalogApi.search(params),
    ...CACHE_TIMES.productList,
  });
}

export function useProductDetail(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => catalogApi.getProduct(id),
    ...CACHE_TIMES.productDetail,
    enabled: !!id,
  });
}
