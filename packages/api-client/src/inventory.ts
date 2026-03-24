import type { InventoryItem, StockAlert, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const inventoryApi = {
  // Query endpoints
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<InventoryItem>>('/inventory/inventoryItems', params);
  },
  lowStockAlerts(params?: SearchRequest) {
    return getApiClient().post<SearchResponse<StockAlert>>('/inventory/lowStockAlerts', params ?? {
      pageNum: 1,
      pageSize: 20,
    });
  },

  // Query-based retrieve (works with query-build)
  async retrieve(id: string) {
    const response = await getApiClient().post<SearchResponse<InventoryItem>>('/inventory/inventory', {
      filters: { id },
    });
    const item = response.list?.[0];
    if (!item) throw new Error('Inventory item not found');
    return { mutatedEntity: item.row, allowedActionsAndMetadata: item.allowedActions ?? [] } as StateEntityServiceResponse<InventoryItem>;
  },
  create(entity: Partial<InventoryItem>) {
    return getApiClient().post<StateEntityServiceResponse<InventoryItem>>('/inventory', entity);
  },
  processById(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<InventoryItem>>('/inventory/' + id + '/' + eventId, payload ?? {});
  },
};
