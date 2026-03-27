import type { SearchRequest, SearchResponse } from '@homebase/types';
import { getApiClient } from './client';

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  type: string;
  region: string;
  status: string;
  stateId: string;
  createdAt: string;
  updatedAt: string;
}

export const taxApi = {
  searchTaxRates(params: SearchRequest) {
    return getApiClient().post<SearchResponse<TaxRate>>('/tax/Tax.getRates', params);
  },

  async getTaxRate(id: string) {
    return getApiClient().get<TaxRate>(`/tax/${id}`);
  },

  updateTaxRate(id: string, data: Partial<TaxRate>) {
    return getApiClient().put<TaxRate>(`/tax/${id}`, data);
  },
};
