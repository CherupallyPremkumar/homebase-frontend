/**
 * Adapter functions that transform backend SearchResponse data into UI-specific shapes.
 * Shared between server-side prefetching (page.tsx) and client hooks (use-inventory.ts).
 *
 * This file must NOT have 'use client' so it can be imported in Server Components.
 */

import type { InventoryItem as ApiInventoryItem, SearchResponse } from '@homebase/types';
import type {
  InventoryStats,
  InventoryListResponse,
  InventoryListFilters,
  InventoryItem,
} from '../types';

export function adaptInventoryStats(res: SearchResponse<ApiInventoryItem>): InventoryStats {
  const total = res.maxRows ?? (res.list?.length ?? 0);
  return {
    totalSkus: { value: total.toLocaleString(), subtitle: 'From inventory' },
    lowStock: { value: '0', subtitle: 'Below threshold' },
    outOfStock: { value: '0', subtitle: 'Needs restock' },
    inTransit: { value: '0', subtitle: 'Arriving soon' },
  };
}

export function adaptInventoryList(
  res: SearchResponse<ApiInventoryItem>,
  filters: InventoryListFilters,
): InventoryListResponse {
  const items: InventoryItem[] = (res.list ?? []).map((entry) => {
    const row = entry.row;
    return {
      id: row.id ?? '',
      sku: row.sku ?? '',
      productName: row.productName ?? '',
      productImage: '',
      category: '',
      warehouse: row.warehouseName ?? row.warehouseId ?? '',
      totalQty: row.quantity ?? 0,
      availableQty: row.availableQuantity ?? 0,
      reservedQty: row.reservedQuantity ?? row.reserved ?? 0,
      damagedQty: row.damagedQuantity ?? 0,
      inboundQty: row.inboundQuantity ?? 0,
      lowStockThreshold: row.lowStockThreshold ?? row.reorderLevel ?? 0,
      status: (row.status ?? row.stateId ?? 'In Stock') as InventoryItem['status'],
      lastRestocked: row.lastModifiedTime ?? '',
    };
  });

  const total = res.maxRows ?? items.length;
  const pageSize = filters.pageSize || 10;
  return {
    items,
    total,
    page: res.currentPage ?? filters.page,
    pageSize,
    totalPages: res.maxPages ?? Math.ceil(total / pageSize),
  };
}
