'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';
import { toast } from 'sonner';

export interface CycleCountTask {
  id: string;
  binLocation: string;
  zone: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DISCREPANCY';
  scheduledDate: string;
  items: CycleCountItem[];
}

export interface CycleCountItem {
  id: string;
  sku: string;
  productName: string;
  expectedQuantity: number;
  actualQuantity?: number;
  counted: boolean;
  discrepancy: boolean;
}

export interface RecordCountPayload {
  taskId: string;
  itemId: string;
  actualQuantity: number;
}

export function usePendingCounts() {
  return useQuery({
    queryKey: ['wms-cycle-count', 'pending'],
    queryFn: () => getApiClient().get<CycleCountTask[]>('/api/v1/warehouse/cycle-counts/pending'),
    staleTime: 30_000,
  });
}

export function useCycleCountDetail(id: string) {
  return useQuery({
    queryKey: ['wms-cycle-count', id],
    queryFn: () => getApiClient().get<CycleCountTask>(`/api/v1/warehouse/cycle-counts/${id}`),
    staleTime: 5_000,
    enabled: !!id,
  });
}

export function useRecordCount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RecordCountPayload) =>
      getApiClient().post<void>(`/api/v1/warehouse/cycle-counts/${payload.taskId}/count`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wms-cycle-count', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['wms-cycle-count', 'pending'] });
      toast.success('Count recorded');
    },
    onError: () => toast.error('Failed to record count'),
  });
}
