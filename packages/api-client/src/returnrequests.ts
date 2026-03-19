import type { ReturnRequest, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const returnRequestsApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<ReturnRequest>>('/api/v1/returns/search', params);
  },
  getById(id: string) {
    return getApiClient().get<StateEntityServiceResponse<ReturnRequest>>(`/api/v1/returns/${id}`);
  },
  create(returnRequest: Partial<ReturnRequest>) {
    return getApiClient().post<StateEntityServiceResponse<ReturnRequest>>('/api/v1/returns', returnRequest);
  },
  processEvent(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<ReturnRequest>>(`/api/v1/returns/${id}/${eventId}`, payload ?? {});
  },
  myReturns(params: SearchRequest) {
    return getApiClient().post<SearchResponse<ReturnRequest>>('/api/v1/returns/my-returns', params);
  },
};
