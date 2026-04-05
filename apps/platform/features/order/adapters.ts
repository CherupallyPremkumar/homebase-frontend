/**
 * Pure adapter functions: transform backend SearchResponse data into
 * order-specific UI types. Shared between client hooks and server prefetch.
 */

import type { Order as ApiOrder, SearchResponse } from '@homebase/types';

import type {
  OrderStats,
  OrderListResponse,
  Order,
} from './types';

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function formatINR(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function adaptOrderRow(apiOrder: ApiOrder): Order {
  const customerName = (apiOrder as { customerName?: string }).customerName
    ?? apiOrder.customerEmail?.split('@')[0]
    ?? apiOrder.userId
    ?? 'Unknown';
  const initials = customerName.slice(0, 2).toUpperCase();
  const sellerName = (apiOrder as { sellerName?: string }).sellerName ?? '';
  const itemCount = (apiOrder as { itemCount?: number }).itemCount ?? apiOrder.items?.length ?? 0;

  return {
    id: apiOrder.orderNumber || apiOrder.id,
    initials,
    avatarBg: 'bg-blue-100 text-blue-700',
    customer: customerName,
    email: apiOrder.customerEmail ?? '',
    seller: sellerName,
    product: apiOrder.items?.[0]?.productName ?? '',
    items: `${itemCount} item${itemCount !== 1 ? 's' : ''}`,
    amount: formatINR(apiOrder.total ?? apiOrder.totalAmount ?? 0),
    payment: (apiOrder.paymentMethod as Order['payment']) ?? 'UPI',
    status: apiOrder.stateId,
    date: apiOrder.createdAt
      ? new Date(apiOrder.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : apiOrder.createdTime
        ? new Date(apiOrder.createdTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        : '',
  };
}

// ----------------------------------------------------------------
// Exported Adapters
// ----------------------------------------------------------------

export function adaptSearchToListResponse(
  response: SearchResponse<ApiOrder>,
): OrderListResponse {
  return {
    orders: response.list.map((item) => adaptOrderRow(item.row)),
    total: response.maxRows,
    page: response.currentPage,
    pageSize: response.numRowsInPage,
    totalPages: response.maxPages,
  };
}

export function adaptSearchToStats(response: SearchResponse<ApiOrder>): OrderStats {
  const orders = response.list.map((item) => item.row);
  const count = (states: string[]) =>
    orders.filter((o) => states.includes(o.stateId)).length;

  const fmt = (n: number) => n.toLocaleString('en-IN');
  return {
    totalOrders: { value: fmt(response.maxRows), trend: 0, trendDirection: 'up' },
    pending: { value: fmt(count(['CREATED'])), trend: 0, trendDirection: 'up' },
    processing: { value: fmt(count(['CONFIRMED', 'PAID', 'PROCESSING'])), trend: 0, trendDirection: 'up' },
    shipped: { value: fmt(count(['SHIPPED'])), trend: 0, trendDirection: 'up' },
    delivered: { value: fmt(count(['DELIVERED'])), trend: 0, trendDirection: 'up' },
    cancelled: { value: fmt(count(['CANCELLED', 'CANCELLATION_APPROVED'])), trend: 0, trendDirection: 'up' },
  };
}
