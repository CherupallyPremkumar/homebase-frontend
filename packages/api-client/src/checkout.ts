import type { Checkout, StateEntityServiceResponse, CheckoutAddressPayload, CheckoutPaymentPayload } from '@homebase/types';
import { getApiClient } from './client';

export const checkoutApi = {
  get(id: string) {
    return getApiClient().get<StateEntityServiceResponse<Checkout>>(`/api/v1/checkout/${id}`);
  },
  create() {
    return getApiClient().post<StateEntityServiceResponse<Checkout>>('/api/v1/checkout');
  },
  setAddress(id: string, payload: CheckoutAddressPayload) {
    return getApiClient().patch<StateEntityServiceResponse<Checkout>>(`/api/v1/checkout/${id}/SET_ADDRESS`, payload);
  },
  setPayment(id: string, payload: CheckoutPaymentPayload) {
    return getApiClient().patch<StateEntityServiceResponse<Checkout>>(`/api/v1/checkout/${id}/SET_PAYMENT`, payload);
  },
  processEvent(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<Checkout>>(`/api/v1/checkout/${id}/${eventId}`, payload ?? {});
  },
  placeOrder(id: string) {
    return getApiClient().patch<StateEntityServiceResponse<Checkout>>(`/api/v1/checkout/${id}/PLACE_ORDER`, {});
  },
};
