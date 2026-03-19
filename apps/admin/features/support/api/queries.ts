'use client';

import { useQuery } from '@tanstack/react-query';
import { supportApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { SupportTicket, SearchRequest } from '@homebase/types';

export function useSupportSearch(params: SearchRequest) {
  return useQuery({
    queryKey: ['admin-support', 'list', params],
    queryFn: () => supportApi.search(params),
    ...CACHE_TIMES.productList,
  });
}

export function useSupportMutation() {
  return useStmMutation<SupportTicket>({
    entityType: 'admin-support',
    mutationFn: supportApi.processEvent,
  });
}
