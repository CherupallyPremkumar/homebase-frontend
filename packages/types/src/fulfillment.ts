import type { StateEntity, ActivityLog } from './common';

export interface FulfillmentOrder extends StateEntity {
  orderId: string;
  warehouseId?: string;
  lineItems: FulfillmentLineItem[];
  pickListId?: string;
  packSlipId?: string;
  trackingNumber?: string;
  carrier?: string;
  activities: ActivityLog[];
}

export interface FulfillmentLineItem {
  id: string;
  productId: string;
  variantId?: string;
  productName: string;
  sku: string;
  quantity: number;
  pickedQuantity?: number;
  packedQuantity?: number;
  location?: string;
}
