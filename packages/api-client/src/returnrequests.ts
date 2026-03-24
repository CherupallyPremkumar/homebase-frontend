import type { ReturnRequest, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const returnRequestsApi = {
  // Query endpoints
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<ReturnRequest>>('/returnrequest/returnrequests', params);
  },
  myReturns(params: SearchRequest) {
    return getApiClient().post<SearchResponse<ReturnRequest>>('/returnrequest/myReturns', params);
  },

  // Query-based retrieve (works with query-build)
  async retrieve(id: string) {
    const response = await getApiClient().post<SearchResponse<ReturnRequest>>('/returnrequest/returnrequestById', {
      filters: { id },
    });
    const item = response.list?.[0];
    if (!item) throw new Error('Return request not found');
    return { mutatedEntity: item.row, allowedActionsAndMetadata: item.allowedActions ?? [] } as StateEntityServiceResponse<ReturnRequest>;
  },
  create(entity: Partial<ReturnRequest>) {
    return getApiClient().post<StateEntityServiceResponse<ReturnRequest>>('/returnrequest', entity);
  },
  processById(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<ReturnRequest>>('/returnrequest/' + id + '/' + eventId, payload ?? {});
  },
};
