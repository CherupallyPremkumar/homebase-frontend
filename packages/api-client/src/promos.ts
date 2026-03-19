import type { Coupon, ValidateCouponResponse, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const promosApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<Coupon>>('/api/v1/promos/search', params);
  },
  getById(id: string) {
    return getApiClient().get<StateEntityServiceResponse<Coupon>>(`/api/v1/promos/${id}`);
  },
  create(coupon: Partial<Coupon>) {
    return getApiClient().post<StateEntityServiceResponse<Coupon>>('/api/v1/promos', coupon);
  },
  processEvent(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<Coupon>>(`/api/v1/promos/${id}/${eventId}`, payload ?? {});
  },
  validate(code: string, cartTotal: number) {
    return getApiClient().post<ValidateCouponResponse>('/api/v1/promos/validate', { code, cartTotal });
  },
};
