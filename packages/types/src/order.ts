import type { StateEntity, Address, ActivityLog } from './common';

export interface Order extends StateEntity {
  orderNumber: string;
  userId: string;
  customerId?: string;
  customerEmail?: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discount: number;
  total: number;
  totalAmount?: number;
  currency: string;
  paymentMethod?: string;
  paymentId?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt?: string;
  itemCount?: number;
  activities: ActivityLog[];
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  productName: string;
  variantName?: string;
  imageUrl?: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
}

export interface OrderStatusHistory {
  state: string;
  timestamp: string;
  comment?: string;
  performedBy?: string;
}
