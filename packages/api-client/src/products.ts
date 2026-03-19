import type { Product, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const productsApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<Product>>('/api/v1/products/search', params);
  },
  getById(id: string) {
    return getApiClient().get<StateEntityServiceResponse<Product>>(`/api/v1/products/${id}`);
  },
  create(product: Partial<Product>) {
    return getApiClient().post<StateEntityServiceResponse<Product>>('/api/v1/products', product);
  },
  processEvent(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<Product>>(`/api/v1/products/${id}/${eventId}`, payload ?? {});
  },
};
