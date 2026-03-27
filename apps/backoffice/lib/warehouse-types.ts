export interface WarehouseFulfillmentOrder {
  id: string;
  orderId: string;
  warehouseId: string;
  userId: string;
  priority: string;
  fulfillmentType: string;
  carrier: string;
  stateId: string;
  trackingNumber: string;
}
