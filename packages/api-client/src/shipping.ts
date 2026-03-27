import type { Shipment, ShippingRate, DeliveryEstimateRequest, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const shippingApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<Shipment>>('/shipping/shipments', params);
  },

  async retrieve(id: string) {
    const response = await getApiClient().post<SearchResponse<Shipment>>('/shipping/shippingById', {
      pageNum: 1,
      pageSize: 1,
      filters: { id },
    });
    const item = response.list?.[0];
    if (!item) throw new Error('Shipment not found');
    return { mutatedEntity: item.row, allowedActionsAndMetadata: item.allowedActions ?? [] } as StateEntityServiceResponse<Shipment>;
  },
  processById(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<Shipment>>('/shipping/' + id + '/' + eventId, payload ?? {});
  },
  estimateDelivery(request: DeliveryEstimateRequest) {
    return getApiClient().post<ShippingRate[]>('/shipping/estimate', request);
  },
};
