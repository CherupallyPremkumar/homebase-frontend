'use client';

import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { Product } from '@homebase/types';

export function useProductDetail(id: string) {
  return useQuery({
    queryKey: ['platform-product', id],
    queryFn: () => productsApi.retrieve(id),
    ...CACHE_TIMES.productDetail,
    enabled: !!id,
  });
}

export function useProductMutation() {
  return useStmMutation<Product>({
    entityType: 'platform-product',
    mutationFn: productsApi.processById,
  });
}
