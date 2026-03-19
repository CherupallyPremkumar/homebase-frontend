'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { suppliersApi, getApiClient } from '@homebase/api-client';
import { CACHE_TIMES } from '@homebase/shared';
import { toast } from 'sonner';
import type { Supplier } from '@homebase/types';

export function useSellerProfile() {
  return useQuery({
    queryKey: ['seller-profile'],
    queryFn: () => getApiClient().get<Supplier>('/api/v1/seller/profile'),
    ...CACHE_TIMES.userProfile,
  });
}

export function useUpdateSellerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Supplier>) =>
      getApiClient().put<Supplier>('/api/v1/seller/profile', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-profile'] });
      toast.success('Profile updated');
    },
    onError: () => toast.error('Failed to update profile'),
  });
}
