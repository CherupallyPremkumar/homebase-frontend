'use client';

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { StateEntityServiceResponse, StateEntity } from '@homebase/types';

interface UseStmEntityOptions<T extends StateEntity> {
  entityType: string;
  entityId: string | undefined;
  queryFn: (id: string) => Promise<StateEntityServiceResponse<T>>;
  staleTime?: number;
  gcTime?: number;
  enabled?: boolean;
}

export function useStmEntity<T extends StateEntity>({
  entityType,
  entityId,
  queryFn,
  staleTime = 10_000,
  gcTime = 120_000,
  enabled = true,
}: UseStmEntityOptions<T>) {
  return useQuery({
    queryKey: [entityType, entityId],
    queryFn: () => queryFn(entityId!),
    enabled: !!entityId && enabled,
    staleTime,
    gcTime,
    retry: 2,
  });
}
