'use client';

import { useQuery } from '@tanstack/react-query';
import { rulesEngineApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { RuleSet } from '@homebase/types';

export function useRuleSetDetail(id: string) {
  return useQuery({
    queryKey: ['platform-ruleset', id],
    queryFn: () => rulesEngineApi.retrieve(id),
    ...CACHE_TIMES.productDetail,
    enabled: !!id,
  });
}

export function useFactDefinitions() {
  return useQuery({
    queryKey: ['platform-fact-definitions'],
    queryFn: () => rulesEngineApi.factDefinitions(),
    select: (data) => data.list?.map(r => r.row) ?? [],
    ...CACHE_TIMES.productList,
  });
}

export function useRuleSetMutation() {
  return useStmMutation<RuleSet>({
    entityType: 'platform-ruleset',
    mutationFn: rulesEngineApi.processById,
  });
}
