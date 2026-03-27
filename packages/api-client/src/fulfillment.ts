import type { FulfillmentOrder, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const fulfillmentApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<FulfillmentOrder>>('/fulfillment/fulfillments', params);
  },

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

  getLineItems(fulfillmentId: string) {
    return getApiClient().post<SearchResponse<Record<string, unknown>>>('/fulfillment/fulfillment-line-items', {
      filters: { fulfillmentId },
    });
  },
};
