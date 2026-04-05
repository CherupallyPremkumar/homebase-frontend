'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { returnRequestsApi } from '@homebase/api-client';
import type { ReturnRequest } from '@homebase/types';

import type { ReturnDetailData } from '../types';

// ----------------------------------------------------------------
// Adapter: API ReturnRequest → UI ReturnDetailData
// ----------------------------------------------------------------

function adaptToReturnDetail(rr: ReturnRequest): ReturnDetailData {
  return {
    id: rr.id,
    status: rr.stateId,
    statusColor: stateColor(rr.stateId),

    timeline: buildReturnTimeline(rr.stateId),

    items: [
      {
        id: rr.productId,
        name: rr.productName,
        sku: '',
        emoji: '',
        qty: rr.quantity,
        price: rr.refundAmount ?? 0,
        reason: rr.reason,
        condition: rr.description ?? '',
      },
    ],

    originalOrder: {
      id: rr.orderId,
      placedDate: '',
      deliveredDate: '',
      amount: 0,
      status: '',
      statusColor: 'gray',
    },

    refund: {
      itemValue: rr.refundAmount ?? 0,
      shippingRefund: 0,
      shippingLabel: 'Free shipping',
      discountAdjustment: 0,
      totalRefund: rr.refundAmount ?? 0,
      refundMethod: rr.refundMethod ?? 'Original Payment',
    },

    customerComment: rr.description ?? '',
    commentDate: rr.createdTime ?? '',
    evidence: (rr.images ?? []).map((filename) => ({ filename })),

    customer: {
      id: rr.userId,
      name: '',
      initials: '',
      avatarBg: 'bg-purple-100 text-purple-600',
      email: '',
      phone: '',
      totalReturns: 0,
    },

    seller: {
      id: '',
      name: '',
      initials: '',
      avatarBg: 'bg-blue-100 text-blue-600',
      tier: '',
      responseStatus: '',
      responseStatusColor: 'gray',
      responseDate: '',
    },

    policyChecks: [],
    policyVerdict: '',
    policyVerdictColor: 'gray',

    pickup: {
      scheduledDate: '',
      timeSlot: '',
      carrier: '',
      address: '',
    },
  };
}

function stateColor(stateId: string): string {
  const map: Record<string, string> = {
    CREATED: 'yellow',
    PENDING: 'yellow',
    APPROVED: 'blue',
    PICKUP_SCHEDULED: 'yellow',
    RECEIVED: 'blue',
    REFUNDED: 'green',
    COMPLETED: 'green',
    REJECTED: 'red',
    CANCELLED: 'red',
  };
  return map[stateId] ?? 'gray';
}

function buildReturnTimeline(currentState: string) {
  const states = ['CREATED', 'APPROVED', 'PICKUP_SCHEDULED', 'RECEIVED', 'REFUNDED'];
  const labels = ['Return Requested', 'Approved', 'Pickup Scheduled', 'Received at Warehouse', 'Refunded'];
  const currentIndex = states.indexOf(currentState);

  return labels.map((label, i) => ({
    label,
    date: i <= currentIndex ? '' : null,
    actor: null,
    status: (i < currentIndex ? 'completed' : i === currentIndex ? 'current' : 'pending') as 'completed' | 'current' | 'pending',
  }));
}

// ----------------------------------------------------------------
// Return Detail
// ----------------------------------------------------------------

export function useReturnDetail(id: string) {
  return useQuery<ReturnDetailData>({
    queryKey: ['return-detail', id],
    queryFn: async () => {
      const response = await returnRequestsApi.retrieve(id);
      return adaptToReturnDetail(response.mutatedEntity);
    },
    staleTime: 30_000,
    enabled: !!id,
  });
}

// ----------------------------------------------------------------
// Return Admin Actions
// ----------------------------------------------------------------

export function useReturnAdminAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string; action: string; payload?: unknown }) => {
      await returnRequestsApi.processById(params.id, params.action, params.payload);
      return { success: true };
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['return-detail', variables.id] });
    },
  });
}
