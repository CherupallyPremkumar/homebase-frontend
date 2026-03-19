'use client';

import { useQuery } from '@tanstack/react-query';
import { shippingApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { Shipment, SearchRequest } from '@homebase/types';

export function useShipmentSearch(params: SearchRequest) {
  return useQuery({
    queryKey: ['admin-shipments', 'list', params],
    queryFn: () => shippingApi.search(params),
    ...CACHE_TIMES.productList,
  });
}

export function useShipmentMutation() {
  return useStmMutation<Shipment>({
    entityType: 'admin-shipment',
    mutationFn: shippingApi.processEvent,
  });
}
