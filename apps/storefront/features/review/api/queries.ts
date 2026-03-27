'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '@homebase/api-client';
import type { SearchRequest } from '@homebase/types';

const REVIEW_QUERY_KEY = ['reviews'] as const;

export function useProductReviews(productId: string, page = 1, pageSize = 5) {
  return useQuery({
    queryKey: [...REVIEW_QUERY_KEY, 'product', productId, page, pageSize],
    queryFn: () =>
      reviewsApi.byProduct(productId, {
        pageNum: page,
        pageSize,
        sortBy: 'createdTime',
        sortOrder: 'desc',
      } as SearchRequest),
    enabled: !!productId,
    staleTime: 60_000,
    gcTime: 300_000,
  });
}

export function useReviewSummary(productId: string) {
  return useQuery({
    queryKey: [...REVIEW_QUERY_KEY, 'summary', productId],
    queryFn: () => reviewsApi.summary(productId),
    enabled: !!productId,
    staleTime: 300_000,
    gcTime: 600_000,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEY });
    },
  });
}

export function useVoteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, helpful }: { reviewId: string; helpful: boolean }) =>
      reviewsApi.vote(reviewId, helpful),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEY });
    },
  });
}
