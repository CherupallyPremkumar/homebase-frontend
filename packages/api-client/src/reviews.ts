import type { Review, ReviewSummary, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const reviewsApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<Review>>('/api/v1/reviews/search', params);
  },
  getByProduct(productId: string, params: SearchRequest) {
    return getApiClient().post<SearchResponse<Review>>(`/api/v1/reviews/product/${productId}`, params);
  },
  getSummary(productId: string) {
    return getApiClient().get<ReviewSummary>(`/api/v1/reviews/product/${productId}/summary`);
  },
  create(review: Partial<Review>) {
    return getApiClient().post<StateEntityServiceResponse<Review>>('/api/v1/reviews', review);
  },
  processEvent(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<Review>>(`/api/v1/reviews/${id}/${eventId}`, payload ?? {});
  },
  vote(reviewId: string, helpful: boolean) {
    return getApiClient().post<void>(`/api/v1/reviews/${reviewId}/vote`, { helpful });
  },
};
