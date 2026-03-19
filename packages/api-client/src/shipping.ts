import type { Shipment, ShippingRate, DeliveryEstimateRequest, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const shippingApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<Shipment>>('/api/v1/shipping/search', params);
  },
  getById(id: string) {
    return getApiClient().get<StateEntityServiceResponse<Shipment>>(`/api/v1/shipping/${id}`);
  },
  processEvent(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<Shipment>>(`/api/v1/shipping/${id}/${eventId}`, payload ?? {});
  },
  estimateDelivery(request: DeliveryEstimateRequest) {
    return getApiClient().post<ShippingRate[]>('/api/v1/shipping/estimate', request);
  },
};
