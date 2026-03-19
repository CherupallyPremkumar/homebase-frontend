import type { Order, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const ordersApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<Order>>('/api/v1/orders/search', params);
  },
  getById(id: string) {
    return getApiClient().get<StateEntityServiceResponse<Order>>(`/api/v1/orders/${id}`);
  },
  create(order: Partial<Order>) {
    return getApiClient().post<StateEntityServiceResponse<Order>>('/api/v1/orders', order);
  },
  processEvent(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<Order>>(`/api/v1/orders/${id}/${eventId}`, payload ?? {});
  },
  myOrders(params: SearchRequest) {
    return getApiClient().post<SearchResponse<Order>>('/api/v1/orders/my-orders', params);
  },
};
