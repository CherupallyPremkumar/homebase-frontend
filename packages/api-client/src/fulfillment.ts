import type { FulfillmentOrder, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const fulfillmentApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<FulfillmentOrder>>('/api/v1/fulfillment/search', params);
  },
  getById(id: string) {
    return getApiClient().get<StateEntityServiceResponse<FulfillmentOrder>>(`/api/v1/fulfillment/${id}`);
  },
  processEvent(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<FulfillmentOrder>>(`/api/v1/fulfillment/${id}/${eventId}`, payload ?? {});
  },
};
