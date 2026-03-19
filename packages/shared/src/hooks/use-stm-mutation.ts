'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { StateEntityServiceResponse, StateEntity } from '@homebase/types';
import { toast } from 'sonner';
import { getErrorMessage } from '../lib/error-formatter';

interface UseStmMutationOptions<T extends StateEntity> {
  entityType: string;
  mutationFn: (id: string, eventId: string, payload?: unknown) => Promise<StateEntityServiceResponse<T>>;
  onSuccess?: (data: StateEntityServiceResponse<T>, eventId: string) => void;
}

export function useStmMutation<T extends StateEntity>({
  entityType,
  mutationFn,
  onSuccess,
}: UseStmMutationOptions<T>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, eventId, payload }: { id: string; eventId: string; payload?: unknown }) =>
      mutationFn(id, eventId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [entityType, variables.id] });
      queryClient.invalidateQueries({ queryKey: [entityType, 'list'] });
      toast.success(`${entityType} ${variables.eventId.toLowerCase().replace(/_/g, ' ')} successful`);
      onSuccess?.(data, variables.eventId);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
