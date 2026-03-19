'use client';

import { useQuery } from '@tanstack/react-query';
import { suppliersApi } from '@homebase/api-client';
import { useStmMutation } from '@homebase/shared';
import type { SupplierOnboarding } from '@homebase/types';
import { getApiClient } from '@homebase/api-client';

export function useOnboardingStatus() {
  return useQuery({
    queryKey: ['seller-onboarding'],
    queryFn: () => getApiClient().get<{ id: string; status: string }>('/api/v1/seller/onboarding/status'),
    staleTime: 60_000,
  });
}

export function useOnboardingDetail(id: string) {
  return useQuery({
    queryKey: ['seller-onboarding', id],
    queryFn: () => suppliersApi.getOnboarding(id),
    staleTime: 30_000,
    enabled: !!id,
  });
}

export function useOnboardingMutation() {
  return useStmMutation<SupplierOnboarding>({
    entityType: 'seller-onboarding',
    mutationFn: suppliersApi.processOnboardingEvent,
  });
}
