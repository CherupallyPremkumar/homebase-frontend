import type { Coupon, ValidateCouponResponse, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const promosApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<Coupon>>('/promo/promos', params);
  },

  async retrieve(id: string) {
    const response = await getApiClient().post<SearchResponse<Coupon>>('/promo/promo', {
      filters: { id },
    });
    const item = response.list?.[0];
    if (!item) throw new Error('Promo not found');
    return { mutatedEntity: item.row, allowedActionsAndMetadata: item.allowedActions ?? [] } as StateEntityServiceResponse<Coupon>;
  },
  create(entity: Partial<Coupon>) {
    return getApiClient().post<StateEntityServiceResponse<Coupon>>('/promo', entity);
  },
  processById(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<Coupon>>('/promo/' + id + '/' + eventId, payload ?? {});
  },
  validate(code: string, cartTotal: number) {
    return getApiClient().post<ValidateCouponResponse>('/promo/validate', { code, cartTotal });
  },
};
