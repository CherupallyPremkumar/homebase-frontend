'use client';

import { useQuery } from '@tanstack/react-query';
import { suppliersApi, getApiClient } from '@homebase/api-client';
import { useStmMutation } from '@homebase/shared';
import type { SupplierOnboarding, SearchResponse } from '@homebase/types';

export function useOnboardingStatus() {
  return useQuery({
    queryKey: ['seller-onboarding'],
    queryFn: () => getApiClient().post<SearchResponse<{ id: string; status: string }>>('/onboarding/myOnboarding', {
      pageNum: 1,
      pageSize: 1,
    }),
    staleTime: 60_000,
  });
}

export function useOnboardingDetail(id: string) {
  return useQuery({
    queryKey: ['seller-onboarding', id],
    queryFn: () => suppliersApi.retrieveOnboarding(id),
    staleTime: 30_000,
    enabled: !!id,
  });
}

export function useOnboardingMutation() {
  return useStmMutation<SupplierOnboarding>({
    entityType: 'seller-onboarding',
    mutationFn: suppliersApi.processOnboardingById,
  });
}
