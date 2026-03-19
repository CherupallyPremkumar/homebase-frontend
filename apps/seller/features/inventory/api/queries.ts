'use client';

import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { SearchRequest, InventoryItem } from '@homebase/types';

export function useSellerInventory(params: SearchRequest) {
  return useQuery({
    queryKey: ['seller-inventory', 'list', params],
    queryFn: () => inventoryApi.search(params),
    ...CACHE_TIMES.productList,
  });
}

export function useSellerInventoryMutation() {
  return useStmMutation<InventoryItem>({
    entityType: 'seller-inventory',
    mutationFn: inventoryApi.processEvent,
  });
}
