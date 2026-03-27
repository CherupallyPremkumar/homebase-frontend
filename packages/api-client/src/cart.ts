import type { Cart, StateEntityServiceResponse, SearchRequest, SearchResponse, AddToCartPayload, UpdateCartItemPayload, ApplyCouponPayload } from '@homebase/types';
import { getApiClient } from './client';

export const cartApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<Cart>>('/cart/carts', params);
  },
  storefrontCart(params: SearchRequest) {
    return getApiClient().post<SearchResponse<Cart>>('/cart/storefrontCart', params);
  },

  retrieve(id: string) {
    return getApiClient().get<StateEntityServiceResponse<Cart>>('/cart/' + id);
  },
  create(entity: Partial<Cart>) {
    return getApiClient().post<StateEntityServiceResponse<Cart>>('/cart', entity);
  },
  processById(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<Cart>>('/cart/' + id + '/' + eventId, payload ?? {});
  },
  addItem(id: string, payload: AddToCartPayload) {
    return getApiClient().patch<StateEntityServiceResponse<Cart>>('/cart/' + id + '/ADD_ITEM', payload);
  },
  updateItem(id: string, payload: UpdateCartItemPayload) {
    return getApiClient().patch<StateEntityServiceResponse<Cart>>('/cart/' + id + '/UPDATE_ITEM', payload);
  },
  removeItem(id: string, payload: { itemId: string }) {
    return getApiClient().patch<StateEntityServiceResponse<Cart>>('/cart/' + id + '/REMOVE_ITEM', payload);
  },
  applyCoupon(id: string, payload: ApplyCouponPayload) {
    return getApiClient().patch<StateEntityServiceResponse<Cart>>('/cart/' + id + '/APPLY_COUPON', payload);
  },
  removeCoupon(id: string) {
    return getApiClient().patch<StateEntityServiceResponse<Cart>>('/cart/' + id + '/REMOVE_COUPON', {});
  },
};
