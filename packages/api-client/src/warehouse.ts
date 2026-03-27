import type { SearchRequest, SearchResponse } from '@homebase/types';
import { getApiClient } from './client';

export type Warehouse = WarehouseSearchResult;

export interface WarehouseSearchResult {
  id: string;
  warehouseCode: string;
  warehouseName: string;
  warehouseType: string;
  city: string;
  state: string;
  pincode: string;
  isActive: boolean;
}

export type WarehouseLocation = WarehouseLocationResult;

export interface WarehouseLocationResult {
  id: string;
  warehouseId: string;
  locationCode: string;
  zone: string;
  aisle: string;
  shelf: string;
  bin: string;
  locationType: string;
  capacityUnits: number;
  currentUnits: number;
  isActive: boolean;
}

export type WarehouseInventory = InventoryByLocationResult;

export interface InventoryByLocationResult {
  warehouseInventoryId: string;
  productId: string;
  variantId: string;
  sku: string;
  expectedQuantity: number;
  quantityReserved: number;
  quantityAvailable: number;
  quantityDamaged: number;
  lastCountedAt: string | null;
  locationId: string;
  locationCode: string;
  zone: string;
  aisle: string;
  shelf: string;
  bin: string;
  locationType: string;
  productName: string;
  brand: string;
}

export interface CycleCountAdjustment {
  warehouseInventoryId: string;
  locationId: string;
  productId: string;
  sku: string;
  expectedQuantity: number;
  actualQuantity: number;
}

export type CycleCountPayload = CycleCountSubmission;

export interface CycleCountSubmission {
  warehouseId: string;
  locationId: string;
  adjustments: CycleCountAdjustment[];
  notes?: string;
}

export const warehouseApi = {
  searchWarehouses(params: SearchRequest) {
    return getApiClient().post<SearchResponse<WarehouseSearchResult>>('/warehouse/warehouses', params);
  },

  getWarehouseLocations(warehouseId: string, params?: Partial<SearchRequest>) {
    return getApiClient().post<SearchResponse<WarehouseLocationResult>>('/warehouse/warehouse-locations', {
      filters: { warehouseId, ...params?.filters },
      pageNum: params?.pageNum ?? 1,
      pageSize: params?.pageSize ?? 100,
    });
  },

  getInventoryByLocation(params: { warehouseId?: string; locationId?: string; zone?: string }) {
    return getApiClient().post<SearchResponse<InventoryByLocationResult>>('/warehouse/warehouse-inventory-by-location', {
      filters: params,
    });
  },

  submitCycleCount(data: CycleCountSubmission) {
    return getApiClient().post<void>('/warehouse/cycle-count', data);
  },
};
