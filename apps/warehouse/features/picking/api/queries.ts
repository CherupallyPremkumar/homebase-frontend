'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';
import { toast } from 'sonner';

export interface PickList {
  id: string;
  orderId: string;
  orderNumber: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  totalItems: number;
  pickedItems: number;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  createdAt: string;
  items: PickItem[];
}

export interface PickItem {
  id: string;
  sku: string;
  productName: string;
  quantity: number;
  pickedQuantity: number;
  binLocation: string;
  zone: string;
  picked: boolean;
}

export function useActivePickLists() {
  return useQuery({
    queryKey: ['wms-picks', 'active'],
    queryFn: () => getApiClient().get<PickList[]>('/api/v1/warehouse/picks/active'),
    staleTime: 10_000,
    refetchInterval: 15_000,
  });
}

export function usePickListDetail(id: string) {
  return useQuery({
    queryKey: ['wms-picks', id],
    queryFn: () => getApiClient().get<PickList>(`/api/v1/warehouse/picks/${id}`),
    staleTime: 5_000,
    enabled: !!id,
  });
}

export function useConfirmPick() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pickListId, itemId, quantity }: { pickListId: string; itemId: string; quantity: number }) =>
      getApiClient().post<void>(`/api/v1/warehouse/picks/${pickListId}/items/${itemId}/pick`, { quantity }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wms-picks', variables.pickListId] });
      queryClient.invalidateQueries({ queryKey: ['wms-picks', 'active'] });
      toast.success('Item picked');
    },
    onError: () => toast.error('Failed to confirm pick'),
  });
}

export function useStartPickList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pickListId: string) =>
      getApiClient().post<void>(`/api/v1/warehouse/picks/${pickListId}/start`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wms-picks'] });
      toast.success('Pick list started');
    },
  });
}
