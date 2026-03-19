import type { InventoryItem, StockAlert, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const inventoryApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<InventoryItem>>('/api/v1/inventory/search', params);
  },
  getById(id: string) {
    return getApiClient().get<StateEntityServiceResponse<InventoryItem>>(`/api/v1/inventory/${id}`);
  },
  processEvent(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<InventoryItem>>(`/api/v1/inventory/${id}/${eventId}`, payload ?? {});
  },
  lowStockAlerts() {
    return getApiClient().get<StockAlert[]>('/api/v1/inventory/alerts/low-stock');
  },
  checkStock(productId: string, variantId?: string) {
    const params = variantId ? `?variantId=${variantId}` : '';
    return getApiClient().get<{ available: number; reserved: number }>(`/api/v1/inventory/stock/${productId}${params}`);
  },
};
