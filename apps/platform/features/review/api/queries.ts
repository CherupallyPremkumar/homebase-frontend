'use client';

import { useQuery } from '@tanstack/react-query';
import { reviewsApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { Review } from '@homebase/types';

export function useReviewDetail(id: string) {
  return useQuery({
    queryKey: ['platform-review', id],
    queryFn: () => reviewsApi.processEvent(id, 'RETRIEVE'),
    ...CACHE_TIMES.productDetail,
    enabled: !!id,
  });
}

export function useReviewMutation() {
  return useStmMutation<Review>({
    entityType: 'platform-review',
    mutationFn: reviewsApi.processEvent,
  });
}
