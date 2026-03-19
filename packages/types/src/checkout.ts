import type { StateEntity, Address, ActivityLog } from './common';
import type { CartItem } from './cart';

export interface Checkout extends StateEntity {
  userId: string;
  cartId: string;
  items: CartItem[];
  shippingAddress?: Address;
  billingAddress?: Address;
  paymentMethod?: string;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discount: number;
  total: number;
  currency: string;
  estimatedDelivery?: string;
  idempotencyKey: string;
  orderId?: string;
  activities: ActivityLog[];
}

export interface CheckoutAddressPayload {
  shippingAddressId: string;
  billingAddressId?: string;
}

export interface CheckoutPaymentPayload {
  paymentMethod: string;
  paymentDetails?: Record<string, unknown>;
}
