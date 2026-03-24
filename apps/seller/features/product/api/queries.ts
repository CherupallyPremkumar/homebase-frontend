'use client';

import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { SearchRequest, Product } from '@homebase/types';

export function useSellerProducts(params: SearchRequest) {
  return useQuery({
    queryKey: ['seller-products', 'list', params],
    queryFn: () => productsApi.search(params),
    ...CACHE_TIMES.productList,
  });
}

export function useSellerProductDetail(id: string) {
  return useQuery({
    queryKey: ['seller-products', id],
    queryFn: () => productsApi.retrieve(id),
    ...CACHE_TIMES.productDetail,
    enabled: !!id,
  });
}

export function useSellerProductMutation() {
  return useStmMutation<Product>({
    entityType: 'seller-products',
    mutationFn: productsApi.processById,
  });
}
