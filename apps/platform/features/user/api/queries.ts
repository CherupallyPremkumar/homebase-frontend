'use client';

import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { User } from '@homebase/types';

export function useUserDetail(id: string) {
  return useQuery({
    queryKey: ['platform-user', id],
    queryFn: () => usersApi.retrieve(id),
    ...CACHE_TIMES.productDetail,
    enabled: !!id,
  });
}

export function useUserMutation() {
  return useStmMutation<User>({
    entityType: 'platform-user',
    mutationFn: usersApi.processById,
  });
}
