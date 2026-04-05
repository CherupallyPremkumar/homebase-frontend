/**
 * Types for the Order feature.
 */

// ----------------------------------------------------------------
// Order List types
// ----------------------------------------------------------------

/** Order status — raw STM state from backend (e.g., CREATED, PAID, SHIPPED) */
export type OrderStatus = string;

export type PaymentMethod = 'UPI' | 'Card' | 'EMI' | 'COD';

export interface Order {
  id: string;
  initials: string;
  avatarBg: string;
  customer: string;
  email: string;
  seller: string;
  product: string;
  items: string;
  amount: string;
  payment: PaymentMethod;
  status: OrderStatus;
  date: string;
}

export interface OrderStats {
  totalOrders: { value: string; trend: number; trendDirection: 'up' | 'down' };
  pending: { value: string; trend: number; trendDirection: 'up' | 'down' };
  processing: { value: string; trend: number; trendDirection: 'up' | 'down' };
  shipped: { value: string; trend: number; trendDirection: 'up' | 'down' };
  delivered: { value: string; trend: number; trendDirection: 'up' | 'down' };
  cancelled: { value: string; trend: number; trendDirection: 'up' | 'down' };
}

export interface OrderTab {
  key: string;
  label: string;
  count: string;
  badgeClass?: string;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface OrderListFilters {
  search: string;
  status: string;
  seller: string;
  page: number;
  pageSize: number;
}

// ----------------------------------------------------------------
// Order Detail types
// ----------------------------------------------------------------

export type OrderTimelineStepStatus = 'completed' | 'current' | 'pending';

export interface OrderTimelineStep {
  label: string;
  date: string | null;
  status: OrderTimelineStepStatus;
}

export interface OrderItem {
  id: string;
  name: string;
  sku: string;
  emoji: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
  variants: { label: string; value: string }[];
}

export interface OrderCustomer {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  totalOrders: number;
  avatarBg: string;
}

export interface OrderSeller {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  tier: string;
  rating: number;
}

export interface OrderShippingAddress {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface OrderPayment {
  method: string;
  provider: string;
  transactionId: string;
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
}

export interface OrderDelivery {
  carrier: string;
  trackingId: string;
  estimatedDate: string;
}

export interface OrderPriceSummary {
  subtotal: number;
  itemCount: number;
  shipping: number;
  shippingLabel: string;
  discountCode: string | null;
  discount: number;
  gstPercent: number;
  gst: number;
  total: number;
}

export interface OrderFinancials {
  orderValue: number;
  platformFeePercent: number;
  platformFee: number;
  gatewayFeePercent: number;
  gatewayFee: number;
  gstOnFees: number;
  sellerPayout: number;
  settlementRef: string;
}

export interface OrderAdminNote {
  author: string;
  date: string;
  content: string;
}

export interface OrderAuditEntry {
  event: string;
  actor: string;
  date: string;
  color: string;
}

export interface OrderDetail {
  id: string;
  status: string;
  statusColor: string;
  placedAt: string;
  timeline: OrderTimelineStep[];
  items: OrderItem[];
  priceSummary: OrderPriceSummary;
  customer: OrderCustomer;
  seller: OrderSeller;
  shippingAddress: OrderShippingAddress;
  payment: OrderPayment;
  delivery: OrderDelivery;
  financials: OrderFinancials;
  adminNotes: OrderAdminNote[];
  auditTrail: OrderAuditEntry[];
}
