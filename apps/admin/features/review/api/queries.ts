'use client';

import { useQuery } from '@tanstack/react-query';
import { reviewsApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { Review, SearchRequest } from '@homebase/types';

export function useReviewSearch(params: SearchRequest) {
  return useQuery({
    queryKey: ['admin-reviews', 'list', params],
    queryFn: () => reviewsApi.search(params),
    ...CACHE_TIMES.productList,
  });
}

export function useReviewMutation() {
  return useStmMutation<Review>({
    entityType: 'admin-review',
    mutationFn: reviewsApi.processEvent,
  });
}
