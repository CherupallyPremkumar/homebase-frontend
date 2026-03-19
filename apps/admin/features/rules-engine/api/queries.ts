'use client';

import { useQuery } from '@tanstack/react-query';
import { rulesEngineApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { RuleSet, SearchRequest } from '@homebase/types';

export function useRuleSetSearch(params: SearchRequest) {
  return useQuery({
    queryKey: ['admin-rules', 'list', params],
    queryFn: () => rulesEngineApi.searchRuleSets(params),
    ...CACHE_TIMES.productList,
  });
}

export function useRuleSetMutation() {
  return useStmMutation<RuleSet>({
    entityType: 'admin-ruleset',
    mutationFn: rulesEngineApi.processEvent,
  });
}
