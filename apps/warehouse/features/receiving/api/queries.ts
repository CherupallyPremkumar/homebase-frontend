'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';
import { toast } from 'sonner';

export interface InboundShipment {
  id: string;
  poNumber: string;
  supplierName: string;
  expectedItems: number;
  receivedItems: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DISCREPANCY';
  expectedDate: string;
  items: InboundItem[];
}

export interface InboundItem {
  id: string;
  sku: string;
  productName: string;
  expectedQuantity: number;
  receivedQuantity: number;
  binLocation?: string;
  condition: 'GOOD' | 'DAMAGED' | 'NOT_RECEIVED';
}

export interface ReceiveItemPayload {
  shipmentId: string;
  itemId: string;
  receivedQuantity: number;
  binLocation: string;
  condition: 'GOOD' | 'DAMAGED';
  notes?: string;
}

export function usePendingShipments() {
  return useQuery({
    queryKey: ['wms-receiving', 'pending'],
    queryFn: () => getApiClient().get<InboundShipment[]>('/api/v1/warehouse/receiving/pending'),
    staleTime: 10_000,
    refetchInterval: 30_000,
  });
}

export function useShipmentDetail(id: string) {
  return useQuery({
    queryKey: ['wms-receiving', id],
    queryFn: () => getApiClient().get<InboundShipment>(`/api/v1/warehouse/receiving/${id}`),
    staleTime: 5_000,
    enabled: !!id,
  });
}

export function useReceiveItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReceiveItemPayload) =>
      getApiClient().post<void>(`/api/v1/warehouse/receiving/${payload.shipmentId}/receive`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wms-receiving', variables.shipmentId] });
      queryClient.invalidateQueries({ queryKey: ['wms-receiving', 'pending'] });
      toast.success('Item received');
    },
    onError: () => toast.error('Failed to record receipt'),
  });
}
