import type { Order } from '../types';

// ----------------------------------------------------------------
// Adapter: Raw Order[] -> table row render props
// ----------------------------------------------------------------

export interface OrderListRow {
  id: string;
  initials: string;
  avatarBg: string;
  customerName: string;
  email: string;
  sellerName: string;
  productName: string;
  itemCount: string;
  amount: string;
  paymentMethod: string;
  status: string;
  date: string;
}

/**
 * Transforms raw order list items into table-ready rows.
 */
export function adaptOrdersForList(orders: Order[] | undefined): OrderListRow[] {
  if (!orders) return [];

  return orders.map((order) => ({
    id: order.id,
    initials: order.initials,
    avatarBg: order.avatarBg,
    customerName: order.customer,
    email: order.email,
    sellerName: order.seller,
    productName: order.product,
    itemCount: order.items,
    amount: order.amount,
    paymentMethod: order.payment,
    status: order.status,
    date: order.date,
  }));
}
