'use client';

import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';

export interface WarehouseStats {
  pendingReceiving: number;
  activePicks: number;
  pendingPacks: number;
  pendingCycleCounts: number;
  totalItems: number;
  utilizationPercent: number;
  ordersShippedToday: number;
  itemsProcessedToday: number;
}

export function useWarehouseStats() {
  return useQuery({
    queryKey: ['wms-stats'],
    queryFn: () => getApiClient().get<WarehouseStats>('/api/v1/warehouse/stats'),
    staleTime: 10_000,
    refetchInterval: 15_000,
  });
}
