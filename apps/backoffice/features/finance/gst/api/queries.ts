'use client';

import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';
import { CACHE_TIMES } from '@homebase/shared';
import type { GstSummaryResponse } from '../model/types';
import type { SearchResponse } from '@homebase/types';

export function useGstSummary(year?: number) {
  const currentYear = year || new Date().getFullYear();
  return useQuery({
    queryKey: ['finance-gst-summary', currentYear],
    queryFn: () => getApiClient().post<SearchResponse<GstSummaryResponse>>('/dashboard/gstSummary', {
      pageNum: 1,
      pageSize: 1,
      filters: { year: currentYear },
    }),
    select: (data) => data.list?.[0]?.row,
    ...CACHE_TIMES.productList,
  });
}
