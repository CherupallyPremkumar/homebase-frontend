'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';
import { toast } from 'sonner';

export interface PackTask {
  id: string;
  orderId: string;
  orderNumber: string;
  status: 'READY_TO_PACK' | 'PACKING' | 'PACKED' | 'LABELED';
  totalItems: number;
  packedItems: number;
  items: PackItem[];
  shippingLabel?: string;
  carrier?: string;
  trackingNumber?: string;
}

export interface PackItem {
  id: string;
  sku: string;
  productName: string;
  quantity: number;
  packedQuantity: number;
  packed: boolean;
  weight?: number;
}

export function usePendingPacks() {
  return useQuery({
    queryKey: ['wms-packing', 'pending'],
    queryFn: () => getApiClient().get<PackTask[]>('/api/v1/warehouse/packing/pending'),
    staleTime: 10_000,
    refetchInterval: 15_000,
  });
}

export function usePackTaskDetail(id: string) {
  return useQuery({
    queryKey: ['wms-packing', id],
    queryFn: () => getApiClient().get<PackTask>(`/api/v1/warehouse/packing/${id}`),
    staleTime: 5_000,
    enabled: !!id,
  });
}

export function useConfirmPackItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, itemId }: { taskId: string; itemId: string }) =>
      getApiClient().post<void>(`/api/v1/warehouse/packing/${taskId}/items/${itemId}/pack`, {}),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wms-packing', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['wms-packing', 'pending'] });
      toast.success('Item packed');
    },
    onError: () => toast.error('Failed to confirm pack'),
  });
}

export function useCompletePacking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) =>
      getApiClient().post<PackTask>(`/api/v1/warehouse/packing/${taskId}/complete`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wms-packing'] });
      toast.success('Packing complete — label generated');
    },
    onError: () => toast.error('Failed to complete packing'),
  });
}
