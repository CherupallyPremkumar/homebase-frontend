'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supportApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { SearchRequest, SupportTicket } from '@homebase/types';
import { toast } from 'sonner';

export function useSellerTickets(params: SearchRequest) {
  return useQuery({
    queryKey: ['seller-tickets', 'list', params],
    queryFn: () => supportApi.myTickets(params),
    ...CACHE_TIMES.orderList,
  });
}

export function useCreateSellerTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ticket: Partial<SupportTicket>) => supportApi.create(ticket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-tickets'] });
      toast.success('Support ticket created');
    },
    onError: () => toast.error('Failed to create ticket'),
  });
}
