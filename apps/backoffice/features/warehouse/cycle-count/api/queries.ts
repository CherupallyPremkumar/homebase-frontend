'use client';

import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';
import type { SearchResponse } from '@homebase/types';

export interface WarehouseLocation {
  id: string;
  warehouseId: string;
  locationCode: string;
  zone: string;
  aisle: string;
  shelf: string;
  bin: string;
  locationType: string;
  capacityUnits: number;
  currentUnits: number;
  isActive: boolean;
}

export function useCountLocations() {
  return useQuery({
    queryKey: ['wms-cycle-count', 'locations'],
    queryFn: async (): Promise<WarehouseLocation[]> => {
      const api = getApiClient();
      const res = await api.post<SearchResponse<WarehouseLocation>>(
        '/warehouse/warehouse-locations',
        {
          filters: { isActive: 'true' },
          pageNum: 1,
          pageSize: 50,
        },
      );
      return res?.list?.map((entry) => entry.row) ?? [];
    },
    staleTime: 30_000,
  });
}
