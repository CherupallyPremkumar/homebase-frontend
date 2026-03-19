import type { Supplier, SupplierOnboarding, SupplierPerformanceMetrics, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const suppliersApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<Supplier>>('/api/v1/suppliers/search', params);
  },
  getById(id: string) {
    return getApiClient().get<StateEntityServiceResponse<Supplier>>(`/api/v1/suppliers/${id}`);
  },
  processEvent(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<Supplier>>(`/api/v1/suppliers/${id}/${eventId}`, payload ?? {});
  },
  getPerformance(supplierId: string) {
    return getApiClient().get<SupplierPerformanceMetrics>(`/api/v1/suppliers/${supplierId}/performance`);
  },
  // Onboarding
  getOnboarding(id: string) {
    return getApiClient().get<StateEntityServiceResponse<SupplierOnboarding>>(`/api/v1/onboarding/${id}`);
  },
  processOnboardingEvent(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<SupplierOnboarding>>(`/api/v1/onboarding/${id}/${eventId}`, payload ?? {});
  },
};
