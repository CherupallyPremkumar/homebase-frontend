'use client';

import { useQuery } from '@tanstack/react-query';
import { suppliersApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { Supplier } from '@homebase/types';

export function useSupplierDetail(id: string) {
  return useQuery({
    queryKey: ['platform-supplier', id],
    queryFn: () => suppliersApi.retrieve(id),
    ...CACHE_TIMES.productDetail,
    enabled: !!id,
  });
}

export function useSupplierMutation() {
  return useStmMutation<Supplier>({
    entityType: 'platform-supplier',
    mutationFn: suppliersApi.processById,
  });
}
