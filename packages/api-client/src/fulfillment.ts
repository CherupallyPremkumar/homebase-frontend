import type { FulfillmentOrder, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const fulfillmentApi = {
  // Query endpoints
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<FulfillmentOrder>>('/fulfillment/fulfillments', params);
  },

  // Query-based retrieve (works with query-build)
  async retrieve(id: string) {
    const response = await getApiClient().post<SearchResponse<FulfillmentOrder>>('/fulfillment/fulfillment', {
      filters: { id },
    });
    const item = response.list?.[0];
    if (!item) throw new Error('Fulfillment order not found');
    return { mutatedEntity: item.row, allowedActionsAndMetadata: item.allowedActions ?? [] } as StateEntityServiceResponse<FulfillmentOrder>;
  },
  processById(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<FulfillmentOrder>>('/fulfillment/' + id + '/' + eventId, payload ?? {});
  },
};
