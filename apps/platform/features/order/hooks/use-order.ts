'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, dashboardApi } from '@homebase/api-client';
import type { Order as ApiOrder, SearchResponse } from '@homebase/types';

import type {
  OrderStats,
  OrderListResponse,
  OrderDetail,
  OrderListFilters,
  Order,
} from '../types';
import { adaptSearchToListResponse, adaptSearchToStats } from '../adapters';

export type { OrderListFilters } from '../types';

// ----------------------------------------------------------------
// Detail-only helpers (not needed in server prefetch)
// ----------------------------------------------------------------

function mapStateToStatus(stateId: string): Order['status'] {
  const map: Record<string, Order['status']> = {
    CREATED: 'Pending',
    CONFIRMED: 'Processing',
    PAID: 'Processing',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    CANCELLATION_APPROVED: 'Cancelled',
  };
  return map[stateId] ?? 'Pending';
}

function formatINR(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function stateColor(stateId: string): string {
  const map: Record<string, string> = {
    CREATED: 'yellow', CONFIRMED: 'blue', PAID: 'blue', PROCESSING: 'blue',
    SHIPPED: 'blue', DELIVERED: 'green', CANCELLED: 'red',
  };
  return map[stateId] ?? 'gray';
}

function buildTimeline(currentState: string) {
  const states = ['CREATED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
  const labels = ['Placed', 'Confirmed', 'Shipped', 'Delivered'];
  const currentIndex = states.indexOf(currentState);

  return labels.map((label, i) => ({
    label,
    date: i <= currentIndex ? '' : null,
    status: (i < currentIndex ? 'completed' : i === currentIndex ? 'current' : 'pending') as 'completed' | 'current' | 'pending',
  }));
}

function adaptToOrderDetail(apiOrder: ApiOrder): OrderDetail {
  const name = apiOrder.customerEmail?.split('@')[0] ?? apiOrder.userId ?? 'Unknown';
  const initials = name.slice(0, 2).toUpperCase();
  const addr = apiOrder.shippingAddress;

  return {
    id: apiOrder.orderNumber || apiOrder.id,
    status: mapStateToStatus(apiOrder.stateId),
    statusColor: stateColor(apiOrder.stateId),
    placedAt: apiOrder.createdAt ?? apiOrder.createdTime ?? '',
    timeline: buildTimeline(apiOrder.stateId),
    items: (apiOrder.items ?? []).map((item) => ({
      id: item.id,
      name: item.productName,
      sku: item.sku,
      emoji: '',
      qty: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      variants: item.variantName ? [{ label: 'Variant', value: item.variantName }] : [],
    })),
    priceSummary: {
      subtotal: apiOrder.subtotal,
      itemCount: apiOrder.itemCount ?? apiOrder.items?.length ?? 0,
      shipping: apiOrder.shippingCost,
      shippingLabel: apiOrder.shippingCost === 0 ? 'Free' : formatINR(apiOrder.shippingCost),
      discountCode: null,
      discount: apiOrder.discount,
      gstPercent: 18,
      gst: apiOrder.taxAmount,
      total: apiOrder.total ?? apiOrder.totalAmount ?? 0,
    },
    customer: {
      id: apiOrder.userId,
      name,
      initials,
      email: apiOrder.customerEmail ?? '',
      phone: '',
      totalOrders: 0,
      avatarBg: 'bg-purple-100 text-purple-600',
    },
    seller: {
      id: '',
      name: '',
      initials: '',
      avatarBg: 'bg-blue-100 text-blue-600',
      tier: '',
      rating: 0,
    },
    shippingAddress: {
      name: addr?.fullName ?? name,
      line1: addr?.addressLine1 ?? '',
      line2: addr?.addressLine2 ?? '',
      city: addr?.city ?? '',
      state: addr?.state ?? '',
      pincode: addr?.pincode ?? '',
      phone: addr?.phone ?? '',
    },
    payment: {
      method: apiOrder.paymentMethod ?? '',
      provider: '',
      transactionId: apiOrder.paymentId ?? '',
      status: apiOrder.stateId === 'PAID' || apiOrder.stateId === 'DELIVERED' || apiOrder.stateId === 'SHIPPED' ? 'Paid' : 'Pending',
    },
    delivery: {
      carrier: '',
      trackingId: apiOrder.trackingNumber ?? '',
      estimatedDate: apiOrder.estimatedDelivery ?? '',
    },
    financials: {
      orderValue: apiOrder.total ?? apiOrder.totalAmount ?? 0,
      platformFeePercent: 0,
      platformFee: 0,
      gatewayFeePercent: 0,
      gatewayFee: 0,
      gstOnFees: 0,
      sellerPayout: 0,
      settlementRef: '',
    },
    adminNotes: [],
    auditTrail: (apiOrder.activities ?? []).map((a) => ({
      event: a.name,
      actor: a.comment ?? '',
      date: '',
      color: 'bg-gray-300',
    })),
  };
}

// ----------------------------------------------------------------
// Order State Counts (for tabs — from backend, never hardcoded)
// ----------------------------------------------------------------

export interface StateCount {
  state: string;
  count: number;
}

export function useOrderStateCounts() {
  return useQuery<StateCount[]>({
    queryKey: ['order-state-counts'],
    queryFn: async () => {
      const response = await dashboardApi.ordersByState({
        pageNum: 1,
        pageSize: 50,
      });
      return (response.list ?? []).map((item) => {
        const row = item.row;
        return {
          state: row.state ?? '',
          count: Number(row.count ?? 0),
        };
      });
    },
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// Order Stats (6 stat cards)
// ----------------------------------------------------------------

export function useOrderStats() {
  return useQuery<OrderStats>({
    queryKey: ['order-stats'],
    queryFn: async () => {
      const response = await ordersApi.search({ pageNum: 1, pageSize: 100 });
      return adaptSearchToStats(response);
    },
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// Order List (paginated table)
// ----------------------------------------------------------------

export function useOrderList(filters: OrderListFilters) {
  return useQuery<OrderListResponse>({
    queryKey: ['order-list', filters],
    queryFn: async () => {
      const response = await ordersApi.search({
        pageNum: filters.page,
        pageSize: filters.pageSize,
        filters: {
          ...(filters.status && filters.status !== 'all' ? { stateId: filters.status.toUpperCase() } : {}),
          ...(filters.seller ? { seller: filters.seller } : {}),
          ...(filters.search ? { search: filters.search } : {}),
        },
      });
      return adaptSearchToListResponse(response);
    },
    staleTime: 15_000,
    placeholderData: (previousData) => previousData,
  });
}

// ----------------------------------------------------------------
// Order Detail
// ----------------------------------------------------------------

export function useOrderDetail(id: string) {
  return useQuery<OrderDetail>({
    queryKey: ['order-detail', id],
    queryFn: async () => {
      const response = await ordersApi.retrieve(id);
      return adaptToOrderDetail(response.mutatedEntity);
    },
    staleTime: 30_000,
    enabled: !!id,
  });
}

// ----------------------------------------------------------------
// Order Admin Actions
// ----------------------------------------------------------------

export function useOrderAdminAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string; action: string; payload?: unknown }) => {
      await ordersApi.processById(params.id, params.action, params.payload);
      return { success: true };
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['order-detail', variables.id] });
      qc.invalidateQueries({ queryKey: ['order-list'] });
      qc.invalidateQueries({ queryKey: ['order-stats'] });
    },
  });
}
