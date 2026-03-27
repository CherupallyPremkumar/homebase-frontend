import type { Review, ReviewSummary, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const reviewsApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<Review>>('/review/reviews', params);
  },
  byProduct(productId: string, params: SearchRequest) {
    return getApiClient().post<SearchResponse<Review>>('/review/productReviews', {
      ...params,
      filters: { ...params.filters, productId },
    });
  },
  summary(productId: string) {
    return getApiClient().post<SearchResponse<ReviewSummary>>('/review/reviewSummary', {
      pageNum: 1,
      pageSize: 1,
      filters: { productId },
    });
  },

  async retrieve(id: string) {
    const response = await getApiClient().post<SearchResponse<Review>>('/review/review', {
      pageNum: 1,
      pageSize: 1,
      filters: { id },
    });
    const item = response.list?.[0];
    if (!item) throw new Error('Review not found');
    return { mutatedEntity: item.row, allowedActionsAndMetadata: item.allowedActions ?? [] } as StateEntityServiceResponse<Review>;
  },
  create(entity: Partial<Review>) {
    return getApiClient().post<StateEntityServiceResponse<Review>>('/review', entity);
  },
  processById(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<Review>>('/review/' + id + '/' + eventId, payload ?? {});
  },
  vote(reviewId: string, helpful: boolean) {
    return getApiClient().post<void>('/review/' + reviewId + '/vote', { helpful });
  },
};
