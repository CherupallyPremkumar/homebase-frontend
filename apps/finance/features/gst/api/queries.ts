'use client';

import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';
import { CACHE_TIMES } from '@homebase/shared';
import type { GstSummaryResponse } from '../model/types';

export function useGstSummary(year?: number) {
  const currentYear = year || new Date().getFullYear();
  return useQuery({
    queryKey: ['finance-gst-summary', currentYear],
    queryFn: () => getApiClient().get<GstSummaryResponse>(`/api/v1/finance/gst/summary?year=${currentYear}`),
    ...CACHE_TIMES.productList,
  });
}
