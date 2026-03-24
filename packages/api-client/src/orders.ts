import type { Order, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const ordersApi = {
  // Query endpoints
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<Order>>('/order/orders', params);
  },
  myOrders(params: SearchRequest) {
    return getApiClient().post<SearchResponse<Order>>('/order/myOrders', params);
  },

  // Query-based retrieve (works with query-build)
  async retrieve(id: string) {
    const response = await getApiClient().post<SearchResponse<Order>>('/order/order', {
      pageNum: 1,
      pageSize: 1,
      filters: { id },
    });
    const item = response.list?.[0];
    if (!item) throw new Error('Order not found');
    return { mutatedEntity: item.row, allowedActionsAndMetadata: item.allowedActions ?? [] } as StateEntityServiceResponse<Order>;
  },
  create(entity: Partial<Order>) {
    return getApiClient().post<StateEntityServiceResponse<Order>>('/order', entity);
  },
  processById(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<Order>>('/order/' + id + '/' + eventId, payload ?? {});
  },
};
