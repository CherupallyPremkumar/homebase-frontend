'use client';

import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { InventoryItem, SearchRequest } from '@homebase/types';

export function useInventorySearch(params: SearchRequest) {
  return useQuery({
    queryKey: ['platform-inventory', 'list', params],
    queryFn: () => inventoryApi.search(params),
    ...CACHE_TIMES.productList,
  });
}

export function useInventoryMutation() {
  return useStmMutation<InventoryItem>({
    entityType: 'platform-inventory',
    mutationFn: inventoryApi.processEvent,
  });
}
