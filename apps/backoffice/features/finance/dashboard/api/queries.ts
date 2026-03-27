'use client';

import { useQuery } from '@tanstack/react-query';
import { settlementsApi, getApiClient } from '@homebase/api-client';
import { CACHE_TIMES } from '@homebase/shared';
import type { FinanceStats, RevenueTrend, SettlementsByState } from '../model/types';
import type { SearchResponse } from '@homebase/types';

export function useFinanceStats() {
  return useQuery({
    queryKey: ['finance-stats'],
    queryFn: () => getApiClient().post<SearchResponse<FinanceStats>>('/dashboard/financeStats', {
      pageNum: 1,
      pageSize: 1,
    }),
    select: (data) => data.list?.[0]?.row,
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });
}

export function useRevenueTrend(days = 30) {
  return useQuery({
    queryKey: ['finance-revenue-trend', days],
    queryFn: () => getApiClient().post<SearchResponse<RevenueTrend>>('/dashboard/revenueTrend', {
      pageNum: 1,
      pageSize: days,
      filters: { days },
    }),
    select: (data) => data.list?.map(r => r.row) ?? [],
    ...CACHE_TIMES.dashboard,
    refetchInterval: 60_000,
  });
}

export function useSettlementsByState() {
  return useQuery({
    queryKey: ['finance-settlements-by-state'],
    queryFn: () => getApiClient().post<SearchResponse<SettlementsByState>>('/dashboard/settlementsByState', {
      pageNum: 1,
      pageSize: 50,
    }),
    select: (data) => data.list?.map(r => r.row) ?? [],
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });
}

export function useRecentSettlements(limit = 10) {
  return useQuery({
    queryKey: ['finance-recent-settlements', limit],
    queryFn: () => settlementsApi.search({
      pageNum: 1,
      pageSize: limit,
      sortCriteria: [{ field: 'createdTime', order: 'DESC' }],
    }),
    select: (data) => data.list?.map(r => r.row) ?? [],
    ...CACHE_TIMES.dashboard,
    refetchInterval: 30_000,
  });
}
