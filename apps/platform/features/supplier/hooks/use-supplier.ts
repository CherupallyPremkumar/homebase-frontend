'use client';

import { useQuery } from '@tanstack/react-query';
import { suppliersApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { Supplier as SharedSupplier, SearchResponse } from '@homebase/types';

import type {
  SupplierStats,
  SupplierListResponse,
  SellerDetailData,
  SupplierListFilters,
} from '../types';
import { adaptSupplierStats, adaptSupplierList } from '../services/adapters';

export type { SupplierListFilters } from '../types';
export { adaptSupplierStats, adaptSupplierList } from '../services/adapters';

/**
 * Adapts the supplier retrieve response into the admin detail view type.
 */
function adaptSellerDetail(s: SharedSupplier): SellerDetailData {
  const name = s.businessName ?? s.contactPerson ?? '';
  const initials = name.split(' ').map((w: string) => w.charAt(0)).join('').substring(0, 2).toUpperCase();
  const stateId = s.stateId ?? (s.currentState?.stateId) ?? 'CREATED';
  const statusMap: Record<string, { label: string; color: string }> = {
    ACTIVE: { label: 'Active', color: 'green' },
    APPROVED: { label: 'Active', color: 'green' },
    SUSPENDED: { label: 'Suspended', color: 'red' },
    DEACTIVATED: { label: 'Inactive', color: 'gray' },
    PENDING_APPROVAL: { label: 'Pending', color: 'yellow' },
  };
  const status = statusMap[stateId] ?? { label: stateId, color: 'gray' };

  return {
    id: s.id,
    storeName: s.businessName ?? '',
    initials,
    avatarBg: 'bg-blue-100 text-blue-600',
    status: status.label,
    statusColor: status.color,
    tier: 'Standard Seller',
    memberSince: s.createdTime ? new Date(s.createdTime).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '',
    rating: s.rating ?? 0,
    productCount: s.productCount ?? 0,
    category: '',
    description: '',
    contactEmail: s.email ?? '',
    phone: s.phone ?? '',
    address: s.businessAddress
      ? [s.businessAddress.addressLine1, s.businessAddress.addressLine2, s.businessAddress.city, s.businessAddress.state, s.businessAddress.pincode].filter(Boolean).join(', ')
      : '',
    businessName: s.legalName ?? s.businessName ?? '',
    businessType: '',
    gstin: s.gstin ?? '',
    gstVerified: !!s.gstin,
    pan: s.pan ?? '',
    panVerified: !!s.pan,
    bankAccount: s.bankName ? `${s.bankName} ****${(s.bankAccountNumber ?? '').slice(-4)}` : '',
    totalProducts: s.productCount ?? 0,
    activeProducts: s.productCount ?? 0,
    inactiveProducts: 0,
    outOfStock: 0,
    recentOrders: [],
    fulfillmentRate: s.performanceScore ?? 0,
    avgRating: s.rating ?? 0,
    responseTime: '0 hrs',
    returnRate: 0,
    revenue: 0,
    totalOrders: 0,
    healthScore: 0,
    healthMaxScore: 1000,
    healthStanding: 'Unknown',
    healthMetrics: [],
    complianceDocuments: [],
    complianceActionsNeeded: 0,
    disputeHistory: {
      totalDisputes: 0,
      inFavor: 0,
      against: 0,
      open: 0,
      returnRate: 0,
      returnRateThreshold: 5,
      chargebacks: 0,
    },
    revenueTrend: [],
    revenueTrendTotal: '0',
    revenueTrendAvg: '0',
    revenueTrendGrowth: '0%',
    compliance: {
      gst: !!s.gstin,
      pan: !!s.pan,
      bank: !!s.bankAccountNumber,
      documents: '0/5',
      overall: (s.gstin && s.pan && s.bankAccountNumber) ? 'Compliant' : 'Incomplete',
    },
    moderationHistory: (s.activities ?? []).map((a) => ({
      event: a.name,
      actor: a.performedBy ?? '',
      date: a.timestamp ? new Date(a.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '',
      color: 'bg-blue-500',
    })),
  };
}

// ----------------------------------------------------------------
// Supplier Stats (5 stat cards)
// ----------------------------------------------------------------

export function useSupplierStats() {
  return useQuery<SupplierStats>({
    queryKey: ['supplier-stats'],
    queryFn: async () => {
      const response = await suppliersApi.search({
        queryName: 'supplierStateCounts',
        pageNum: 1,
        pageSize: 100,
      });
      return adaptSupplierStats(response as unknown as SearchResponse<Record<string, unknown>>);
    },
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// Supplier List (paginated table)
// ----------------------------------------------------------------

export function useSupplierList(filters: SupplierListFilters) {
  return useQuery<SupplierListResponse>({
    queryKey: ['supplier-list', filters],
    queryFn: async () => {
      const searchFilters: Record<string, unknown> = {};
      if (filters.status && filters.status !== 'all') searchFilters.stateId = filters.status.toUpperCase();
      if (filters.search) searchFilters.businessName = filters.search;

      const response = await suppliersApi.search({
        pageNum: filters.page,
        pageSize: filters.pageSize,
        filters: searchFilters,
      });
      return adaptSupplierList(response, filters);
    },
    staleTime: 15_000,
  });
}

// ----------------------------------------------------------------
// Seller Detail (rich admin view)
// ----------------------------------------------------------------

export function useSellerAdminDetail(id: string) {
  return useQuery<SellerDetailData>({
    queryKey: ['seller-admin-detail', id],
    queryFn: async () => {
      const response = await suppliersApi.retrieve(id);
      return adaptSellerDetail(response.mutatedEntity);
    },
    staleTime: 30_000,
    enabled: !!id,
  });
}

// ----------------------------------------------------------------
// Detail & Mutation (existing STM-based)
// ----------------------------------------------------------------

export function useSupplierDetail(id: string) {
  return useQuery({
    queryKey: ['platform-supplier', id],
    queryFn: () => suppliersApi.retrieve(id),
    ...CACHE_TIMES.productDetail,
    enabled: !!id,
  });
}

export function useSupplierMutation() {
  return useStmMutation<SharedSupplier>({
    entityType: 'platform-supplier',
    mutationFn: suppliersApi.processById,
  });
}
