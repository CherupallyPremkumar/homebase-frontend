'use client';

import { useQuery } from '@tanstack/react-query';
import { suppliersApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { Supplier } from '@homebase/types';

export function useSupplierDetail(id: string) {
  return useQuery({
    queryKey: ['platform-supplier', id],
    queryFn: () => suppliersApi.getById(id),
    ...CACHE_TIMES.productDetail,
    enabled: !!id,
  });
}

export function useSupplierMutation() {
  return useStmMutation<Supplier>({
    entityType: 'platform-supplier',
    mutationFn: suppliersApi.processEvent,
  });
}
