'use client';

import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { User, SearchRequest } from '@homebase/types';

export function useUserSearch(params: SearchRequest) {
  return useQuery({
    queryKey: ['admin-users', 'list', params],
    queryFn: () => usersApi.search(params),
    ...CACHE_TIMES.productList,
  });
}

export function useUserMutation() {
  return useStmMutation<User>({
    entityType: 'admin-user',
    mutationFn: usersApi.processEvent,
  });
}
