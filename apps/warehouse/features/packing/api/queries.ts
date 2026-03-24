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
 * Fetches fulfillment orders that are in packing-related states
 * via the Chenile query endpoint POST /fulfillment/fulfillments.
 */
export function usePendingPacks() {
  return useQuery({
    queryKey: ['wms-packing', 'pending'],
    queryFn: async (): Promise<FulfillmentOrder[]> => {
      const api = getApiClient();
      // Fulfillment orders in SHIPMENT_CREATED state need packing
      const res = await api.post<SearchResponse<FulfillmentOrder>>(
        '/fulfillment/fulfillments',
        {
          filters: { stateId: 'SHIPMENT_CREATED' },
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
