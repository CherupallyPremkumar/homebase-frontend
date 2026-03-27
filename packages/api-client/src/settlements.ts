import type { Settlement, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const settlementsApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<Settlement>>('/settlement/settlements', params);
  },

  async retrieve(id: string) {
    const response = await getApiClient().post<SearchResponse<Settlement>>('/settlement/settlementById', {
      pageNum: 1,
      pageSize: 1,
      filters: { id },
    });
    const item = response.list?.[0];
    if (!item) throw new Error('Settlement not found');
    return { mutatedEntity: item.row, allowedActionsAndMetadata: item.allowedActions ?? [] } as StateEntityServiceResponse<Settlement>;
  },
  processById(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<Settlement>>('/settlement/' + id + '/' + eventId, payload ?? {});
  },
};
