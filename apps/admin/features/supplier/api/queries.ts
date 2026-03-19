'use client';

import { useQuery } from '@tanstack/react-query';
import { suppliersApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { Supplier, SearchRequest } from '@homebase/types';

export function useSupplierSearch(params: SearchRequest) {
  return useQuery({
    queryKey: ['admin-suppliers', 'list', params],
    queryFn: () => suppliersApi.search(params),
    ...CACHE_TIMES.productList,
  });
}

export function useSupplierMutation() {
  return useStmMutation<Supplier>({
    entityType: 'admin-supplier',
    mutationFn: suppliersApi.processEvent,
  });
}
