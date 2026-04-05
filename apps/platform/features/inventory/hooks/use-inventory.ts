'use client';

import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '@homebase/api-client';
import type { StockAlert, SearchResponse } from '@homebase/types';

import type {
  InventoryStats,
  InventoryListResponse,
  InventoryListFilters,
  InventoryAlert,
} from '../types';
import { adaptInventoryStats, adaptInventoryList } from '../services/adapters';

export { adaptInventoryStats, adaptInventoryList } from '../services/adapters';

function adaptInventoryAlerts(res: SearchResponse<StockAlert>): InventoryAlert[] {
  return (res.list ?? []).map((entry) => {
    const row = entry.row;
    return {
      id: row.productId ?? '',
      sku: row.sku ?? '',
      productName: row.productName ?? '',
      type: 'low-stock' as InventoryAlert['type'],
      currentQty: row.currentStock ?? 0,
      threshold: row.reorderLevel ?? 0,
      severity: row.currentStock === 0 ? 'critical' as const : 'warning' as const,
      warehouse: row.warehouseName ?? '',
      lastChecked: '',
    };
  });
}

// ----------------------------------------------------------------
// Inventory Stats (4 stat cards)
// ----------------------------------------------------------------

export function useInventoryStats() {
  return useQuery<InventoryStats>({
    queryKey: ['inventory-stats'],
    queryFn: async () => {
      const res = await inventoryApi.search({ pageNum: 1, pageSize: 1 });
      return adaptInventoryStats(res);
    },
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// Inventory List (paginated table)
// ----------------------------------------------------------------

export function useInventoryList(filters: InventoryListFilters) {
  return useQuery<InventoryListResponse>({
    queryKey: ['inventory-list', filters],
    queryFn: async () => {
      const res = await inventoryApi.search({
        pageNum: filters.page,
        pageSize: filters.pageSize,
        filters: {
          ...(filters.status && filters.status !== 'all' ? { stateId: filters.status } : {}),
          ...(filters.warehouse ? { warehouseId: filters.warehouse } : {}),
          ...(filters.search ? { searchText: filters.search } : {}),
        },
      });
      return adaptInventoryList(res, filters);
    },
    staleTime: 15_000,
  });
}

// ----------------------------------------------------------------
// Inventory Alerts
// ----------------------------------------------------------------

export function useInventoryAlerts() {
  return useQuery<InventoryAlert[]>({
    queryKey: ['inventory-alerts'],
    queryFn: async () => {
      const res = await inventoryApi.lowStockAlerts({ pageNum: 1, pageSize: 20 });
      return adaptInventoryAlerts(res);
    },
    staleTime: 30_000,
  });
}
