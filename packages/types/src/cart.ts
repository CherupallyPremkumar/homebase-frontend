import type { StateEntity, ActivityLog } from './common';

export interface Cart extends StateEntity {
  userId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingEstimate: number;
  taxEstimate: number;
  total: number;
  currency: string;
  couponCode?: string;
  couponDiscount?: number;
  itemCount: number;
  activities: ActivityLog[];
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  productName: string;
  variantName?: string;
  imageUrl?: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  mrp: number;
  totalPrice: number;
  currency: string;
  inStock: boolean;
  maxQuantity: number;
}

export interface AddToCartPayload {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export interface ApplyCouponPayload {
  couponCode: string;
}
