'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cconfigApi } from '@homebase/api-client';
import { CACHE_TIMES } from '@homebase/shared';
import { toast } from 'sonner';

export function useConfigList() {
  return useQuery({
    queryKey: ['admin-cconfig'],
    queryFn: () => cconfigApi.getAll(),
    ...CACHE_TIMES.cconfig,
  });
}

export function useConfigMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => cconfigApi.update(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cconfig'] });
      toast.success('Config updated');
    },
    onError: () => toast.error('Failed to update config'),
  });
}
