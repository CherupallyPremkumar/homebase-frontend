'use client';

import { useQuery } from '@tanstack/react-query';
import { settlementsApi, getApiClient } from '@homebase/api-client';
import { CACHE_TIMES } from '@homebase/shared';
import type { FinanceStats, RevenueTrend, SettlementsByState } from '../model/types';
import type { Settlement, SearchResponse } from '@homebase/types';

export function useFinanceStats() {
  return useQuery({
    queryKey: ['finance-stats'],
    queryFn: () => getApiClient().get<FinanceStats>('/api/v1/finance/stats'),
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });
}

export function useRevenueTrend(days = 30) {
  return useQuery({
    queryKey: ['finance-revenue-trend', days],
    queryFn: () => getApiClient().get<RevenueTrend[]>(`/api/v1/finance/revenue-trend?days=${days}`),
    ...CACHE_TIMES.dashboard,
    refetchInterval: 60_000,
  });
}

export function useSettlementsByState() {
  return useQuery({
    queryKey: ['finance-settlements-by-state'],
    queryFn: () => getApiClient().get<SettlementsByState[]>('/api/v1/finance/settlements-by-state'),
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });
}

export function useRecentSettlements(limit = 10) {
  return useQuery({
    queryKey: ['finance-recent-settlements', limit],
    queryFn: () => settlementsApi.search({ page: 0, size: limit, sort: 'createdTime', sortOrder: 'DESC' }),
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
    select: (data: SearchResponse<Settlement>) => data.content,
  });
}
