import type { Product, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const productsApi = {
  // Query endpoints
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<Product>>('/product/products', params);
  },

  // Query-based retrieve (works with query-build)
  async retrieve(id: string) {
    const response = await getApiClient().post<SearchResponse<Product>>('/product/product', {
      filters: { id },
    });
    const item = response.list?.[0];
    if (!item) throw new Error('Product not found');
    return { mutatedEntity: item.row, allowedActionsAndMetadata: item.allowedActions ?? [] } as StateEntityServiceResponse<Product>;
  },
  create(entity: Partial<Product>) {
    return getApiClient().post<StateEntityServiceResponse<Product>>('/product', entity);
  },
  processById(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<Product>>('/product/' + id + '/' + eventId, payload ?? {});
  },
};
