import type { Checkout, StateEntityServiceResponse, CheckoutAddressPayload, CheckoutPaymentPayload } from '@homebase/types';
import { getApiClient } from './client';

export const checkoutApi = {
  // Command (STM) endpoints
  retrieve(id: string) {
    return getApiClient().get<StateEntityServiceResponse<Checkout>>('/checkout/' + id);
  },
  create(entity?: Partial<Checkout>) {
    return getApiClient().post<StateEntityServiceResponse<Checkout>>('/checkout', entity ?? {});
  },
  processById(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<Checkout>>('/checkout/' + id + '/' + eventId, payload ?? {});
  },
  setAddress(id: string, payload: CheckoutAddressPayload) {
    return getApiClient().patch<StateEntityServiceResponse<Checkout>>('/checkout/' + id + '/SET_ADDRESS', payload);
  },
  setPayment(id: string, payload: CheckoutPaymentPayload) {
    return getApiClient().patch<StateEntityServiceResponse<Checkout>>('/checkout/' + id + '/SET_PAYMENT', payload);
  },
  placeOrder(id: string) {
    return getApiClient().patch<StateEntityServiceResponse<Checkout>>('/checkout/' + id + '/PLACE_ORDER', {});
  },
};
