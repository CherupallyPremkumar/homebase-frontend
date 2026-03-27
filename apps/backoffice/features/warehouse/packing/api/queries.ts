'use client';

import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';
import type { SearchResponse } from '@homebase/types';
import type { WarehouseFulfillmentOrder } from '@/lib/warehouse-types';

export type FulfillmentOrder = WarehouseFulfillmentOrder;

export function usePendingPacks() {
  return useQuery({
    queryKey: ['wms-packing', 'pending'],
    queryFn: async (): Promise<FulfillmentOrder[]> => {
      const api = getApiClient();
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
