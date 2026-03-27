import type { SupplierOnboarding, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const onboardingApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<SupplierOnboarding>>('/onboarding/Onboarding.getAll', params);
  },

  async retrieve(id: string) {
    const response = await getApiClient().get<StateEntityServiceResponse<SupplierOnboarding>>(`/onboarding/${id}`);
    return response;
  },

  processById(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<SupplierOnboarding>>(`/onboarding/${id}/${eventId}`, payload ?? {});
  },
};
