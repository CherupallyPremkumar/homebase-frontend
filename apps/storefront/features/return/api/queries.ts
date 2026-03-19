'use client';

import { useQuery } from '@tanstack/react-query';
import { returnRequestsApi } from '@homebase/api-client';
import type { SearchRequest } from '@homebase/types';

export function useMyReturns(params: SearchRequest) {
  return useQuery({
    queryKey: ['my-returns', params],
    queryFn: () => returnRequestsApi.myReturns(params),
  });
}
