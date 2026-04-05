/**
 * Types for the Inventory feature.
 *
 * All types are defined locally -- no re-exports from @homebase/types.
 * When the backend contract stabilises, align these with the real DTOs.
 */

// ----------------------------------------------------------------
// Status unions
// ----------------------------------------------------------------

export type InventoryStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'In Transit';

export type AlertType = 'low-stock' | 'out-of-stock' | 'overstock';

export type AlertSeverity = 'critical' | 'warning' | 'info';

// ----------------------------------------------------------------
// Stat cards
// ----------------------------------------------------------------

export interface InventoryStats {
  totalSkus: { value: string; subtitle: string };
  lowStock: { value: string; subtitle: string };
  outOfStock: { value: string; subtitle: string };
  inTransit: { value: string; subtitle: string };
}

// ----------------------------------------------------------------
// Inventory item (table row)
// ----------------------------------------------------------------

export interface InventoryItem {
  id: string;
  sku: string;
  productName: string;
  productImage: string;
  category: string;
  warehouse: string;
  totalQty: number;
  availableQty: number;
  reservedQty: number;
  damagedQty: number;
  inboundQty: number;
  lowStockThreshold: number;
  status: InventoryStatus;
  lastRestocked: string;
}

// ----------------------------------------------------------------
// Inventory list response (paginated)
// ----------------------------------------------------------------

export interface InventoryListResponse {
  items: InventoryItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ----------------------------------------------------------------
// Filters
// ----------------------------------------------------------------

export interface InventoryListFilters {
  search: string;
  status: string;
  warehouse: string;
  page: number;
  pageSize: number;
}

// ----------------------------------------------------------------
// Inventory tab
// ----------------------------------------------------------------

export interface InventoryTab {
  key: string;
  label: string;
  count: string;
  badgeClass?: string;
}

// ----------------------------------------------------------------
// Inventory alert
// ----------------------------------------------------------------

export interface InventoryAlert {
  id: string;
  sku: string;
  productName: string;
  type: AlertType;
  currentQty: number;
  threshold: number;
  severity: AlertSeverity;
  warehouse: string;
  lastChecked: string;
}
