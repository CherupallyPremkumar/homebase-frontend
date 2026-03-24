'use client';

import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';
import type { SearchResponse } from '@homebase/types';

export interface FulfillmentOrder {
  id: string;
  orderId: string;
  warehouseId: string;
  userId: string;
  priority: string;
  fulfillmentType: string;
  carrier: string;
  stateId: string;
  trackingNumber: string;
}

/**
 * Fetches fulfillment orders that are in picking-related states
 * via the Chenile query endpoint POST /fulfillment/fulfillments.
 */
export function useActivePickLists() {
  return useQuery({
    queryKey: ['wms-picks', 'active'],
    queryFn: async (): Promise<FulfillmentOrder[]> => {
      const api = getApiClient();
      // Fulfillment orders in INVENTORY_RESERVED state need picking
      const res = await api.post<SearchResponse<FulfillmentOrder>>(
        '/fulfillment/fulfillments',
        {
          filters: { stateId: 'INVENTORY_RESERVED' },
          pageNum: 1,
          pageSize: 50,
        },
      );
      return res?.list?.map((entry) => entry.row) ?? [];
    },
    staleTime: 10_000,
    refetchInterval: 15_000,
  });
}
