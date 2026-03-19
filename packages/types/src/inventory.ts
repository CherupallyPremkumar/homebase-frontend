import type { StateEntity, ActivityLog } from './common';

export interface InventoryItem extends StateEntity {
  productId: string;
  variantId?: string;
  sku: string;
  productName?: string;
  warehouseId?: string;
  warehouseName?: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  reorderLevel: number;
  reorderQuantity: number;
  activities: ActivityLog[];
}

export interface InventoryMovement {
  id: string;
  inventoryItemId: string;
  type: 'INBOUND' | 'OUTBOUND' | 'ADJUSTMENT' | 'RESERVATION' | 'RELEASE';
  quantity: number;
  reason?: string;
  referenceId?: string;
  timestamp: string;
}

export interface StockAlert {
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  reorderLevel: number;
  warehouseName?: string;
}
