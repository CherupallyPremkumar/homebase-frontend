'use client';

import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';
import type { SearchResponse } from '@homebase/types';

export interface InventoryItem {
  id: string;
  sku: string;
  productId: string;
  variantId: string;
  quantity: number;
  availableQuantity: number;
  reserved: number;
  damagedQuantity: number;
  inboundQuantity: number;
  lowStockThreshold: number;
  status: string;
  primaryFc: string;
  stateId: string;
}

/**
 * Fetches inventory items in STOCK_PENDING state (awaiting receiving)
 * via the Chenile query endpoint POST /inventory/inventoryItems.
 */
export function usePendingReceiving() {
  return useQuery({
    queryKey: ['wms-receiving', 'pending'],
    queryFn: async (): Promise<InventoryItem[]> => {
      const api = getApiClient();
      const res = await api.post<SearchResponse<InventoryItem>>(
        '/inventory/inventoryItems',
        {
          filters: { stateId: 'STOCK_PENDING' },
          pageNum: 1,
          pageSize: 50,
        },
      );
      return res?.list?.map((entry) => entry.row) ?? [];
    },
    staleTime: 10_000,
    refetchInterval: 30_000,
  });
}
