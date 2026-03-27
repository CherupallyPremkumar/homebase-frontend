import type { ReconciliationBatch, TransactionMismatch, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const reconciliationApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<ReconciliationBatch>>('/reconciliation/batches', params);
  },
  mismatches(params: SearchRequest) {
    return getApiClient().post<SearchResponse<TransactionMismatch>>('/reconciliation/mismatches', params);
  },

  async retrieve(id: string) {
    const response = await getApiClient().post<SearchResponse<ReconciliationBatch>>('/reconciliation/batch', {
      filters: { id },
    });
    const item = response.list?.[0];
    if (!item) throw new Error('Reconciliation batch not found');
    return { mutatedEntity: item.row, allowedActionsAndMetadata: item.allowedActions ?? [] } as StateEntityServiceResponse<ReconciliationBatch>;
  },
  processById(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<ReconciliationBatch>>('/reconciliation/' + id + '/' + eventId, payload ?? {});
  },
};
