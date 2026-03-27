import type { Supplier, SupplierOnboarding, SupplierPerformanceMetrics, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const suppliersApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<Supplier>>('/supplier/suppliers', params);
  },

  async retrieve(id: string) {
    const response = await getApiClient().post<SearchResponse<Supplier>>('/supplier/supplierById', {
      pageNum: 1,
      pageSize: 1,
      filters: { id },
    });
    const item = response.list?.[0];
    if (!item) throw new Error('Supplier not found');
    return { mutatedEntity: item.row, allowedActionsAndMetadata: item.allowedActions ?? [] } as StateEntityServiceResponse<Supplier>;
  },
  create(entity: Partial<Supplier>) {
    return getApiClient().post<StateEntityServiceResponse<Supplier>>('/supplier', entity);
  },
  processById(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<Supplier>>('/supplier/' + id + '/' + eventId, payload ?? {});
  },
  getPerformance(supplierId: string) {
    return getApiClient().post<SearchResponse<SupplierPerformanceMetrics>>('/supplier/performance', {
      pageNum: 1,
      pageSize: 1,
      filters: { supplierId },
    });
  },

  async retrieveOnboarding(id: string) {
    const response = await getApiClient().post<SearchResponse<SupplierOnboarding>>('/onboarding/onboarding', {
      pageNum: 1,
      pageSize: 1,
      filters: { id },
    });
    const item = response.list?.[0];
    if (!item) throw new Error('Onboarding not found');
    return { mutatedEntity: item.row, allowedActionsAndMetadata: item.allowedActions ?? [] } as StateEntityServiceResponse<SupplierOnboarding>;
  },
  processOnboardingById(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<SupplierOnboarding>>('/onboarding/' + id + '/' + eventId, payload ?? {});
  },
};
