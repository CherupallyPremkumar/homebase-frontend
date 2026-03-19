'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';
import { CACHE_TIMES } from '@homebase/shared';
import type { Payment, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import type { PaymentRefund, PaymentWebhookLog } from '../model/types';
import { toast } from 'sonner';

export function usePaymentSearch(params: SearchRequest) {
  return useQuery({
    queryKey: ['finance-payments', 'list', params],
    queryFn: () => getApiClient().post<SearchResponse<Payment>>('/api/v1/payments/search', params),
    ...CACHE_TIMES.productList,
  });
}

export function usePaymentDetail(id: string) {
  return useQuery({
    queryKey: ['finance-payment', id],
    queryFn: () => getApiClient().get<StateEntityServiceResponse<Payment>>(`/api/v1/payments/${id}`),
    ...CACHE_TIMES.orderDetail,
    enabled: !!id,
  });
}

export function usePaymentRefunds(paymentId: string) {
  return useQuery({
    queryKey: ['finance-payment-refunds', paymentId],
    queryFn: () => getApiClient().get<PaymentRefund[]>(`/api/v1/payments/${paymentId}/refunds`),
    ...CACHE_TIMES.orderDetail,
    enabled: !!paymentId,
  });
}

export function usePaymentWebhookLog(paymentId: string) {
  return useQuery({
    queryKey: ['finance-payment-webhooks', paymentId],
    queryFn: () => getApiClient().get<PaymentWebhookLog[]>(`/api/v1/payments/${paymentId}/webhooks`),
    ...CACHE_TIMES.orderDetail,
    enabled: !!paymentId,
  });
}

export function usePaymentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, eventId, payload }: { id: string; eventId: string; payload?: unknown }) =>
      getApiClient().patch<StateEntityServiceResponse<Payment>>(`/api/v1/payments/${id}/${eventId}`, payload ?? {}),
    onSuccess: (_data, variables) => {
      toast.success('Payment action completed');
      queryClient.invalidateQueries({ queryKey: ['finance-payment', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['finance-payments'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Payment action failed');
    },
  });
}
