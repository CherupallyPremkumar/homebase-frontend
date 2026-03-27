'use client';

import { useQuery } from '@tanstack/react-query';
import { shippingApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { Shipment, SearchRequest } from '@homebase/types';

export function useShipmentSearch(params: SearchRequest) {
  return useQuery({
    queryKey: ['oms-shipments', 'list', params],
    queryFn: () => shippingApi.search(params),
    ...CACHE_TIMES.productList,
  });
}

export function useShipmentDetail(id: string) {
  return useQuery({
    queryKey: ['oms-shipment', id],
    queryFn: () => shippingApi.retrieve(id),
    ...CACHE_TIMES.orderDetail,
    enabled: !!id,
  });
}

export function useShipmentMutation() {
  return useStmMutation<Shipment>({
    entityType: 'oms-shipment',
    mutationFn: shippingApi.processById,
  });
}
