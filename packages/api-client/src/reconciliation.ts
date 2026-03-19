import type { ReconciliationBatch, TransactionMismatch, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const reconciliationApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<ReconciliationBatch>>('/api/v1/reconciliation/search', params);
  },
  getById(id: string) {
    return getApiClient().get<StateEntityServiceResponse<ReconciliationBatch>>(`/api/v1/reconciliation/${id}`);
  },
  processEvent(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<ReconciliationBatch>>(`/api/v1/reconciliation/${id}/${eventId}`, payload ?? {});
  },
  getMismatches(batchId: string) {
    return getApiClient().get<TransactionMismatch[]>(`/api/v1/reconciliation/${batchId}/mismatches`);
  },
};
