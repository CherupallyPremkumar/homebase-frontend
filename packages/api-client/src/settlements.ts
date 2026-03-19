import type { Settlement, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const settlementsApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<Settlement>>('/api/v1/settlements/search', params);
  },
  getById(id: string) {
    return getApiClient().get<StateEntityServiceResponse<Settlement>>(`/api/v1/settlements/${id}`);
  },
  processEvent(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<Settlement>>(`/api/v1/settlements/${id}/${eventId}`, payload ?? {});
  },
};
