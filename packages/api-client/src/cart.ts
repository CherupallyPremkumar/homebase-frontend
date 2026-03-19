import type { Cart, StateEntityServiceResponse, AddToCartPayload, UpdateCartItemPayload, ApplyCouponPayload } from '@homebase/types';
import { getApiClient } from './client';

export const cartApi = {
  get() {
    return getApiClient().get<StateEntityServiceResponse<Cart>>('/api/v1/cart');
  },
  addItem(payload: AddToCartPayload) {
    return getApiClient().post<StateEntityServiceResponse<Cart>>('/api/v1/cart/items', payload);
  },
  updateItem(itemId: string, payload: UpdateCartItemPayload) {
    return getApiClient().put<StateEntityServiceResponse<Cart>>(`/api/v1/cart/items/${itemId}`, payload);
  },
  removeItem(itemId: string) {
    return getApiClient().delete<StateEntityServiceResponse<Cart>>(`/api/v1/cart/items/${itemId}`);
  },
  applyCoupon(payload: ApplyCouponPayload) {
    return getApiClient().post<StateEntityServiceResponse<Cart>>('/api/v1/cart/coupon', payload);
  },
  removeCoupon() {
    return getApiClient().delete<StateEntityServiceResponse<Cart>>('/api/v1/cart/coupon');
  },
  processEvent(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<Cart>>(`/api/v1/cart/${id}/${eventId}`, payload ?? {});
  },
};
