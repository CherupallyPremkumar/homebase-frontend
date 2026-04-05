'use client';

import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import type { User as SharedUser, SearchResponse } from '@homebase/types';

import type {
  UserStats,
  UserListResponse,
  UserDetailData,
  UserListFilters,
} from '../types';
import { adaptUserStats, adaptUserList } from '../adapters';

export type { UserListFilters } from '../types';

/**
 * Adapts the user retrieve response into the admin detail view type.
 */
function adaptUserDetail(u: SharedUser): UserDetailData {
  const first = u.firstName ?? '';
  const last = u.lastName ?? '';
  const stateId = u.stateId ?? (u.currentState?.stateId) ?? 'CREATED';
  const statusMap: Record<string, { label: string; color: string }> = {
    ACTIVE: { label: 'Active', color: 'green' },
    VERIFIED: { label: 'Active', color: 'green' },
    SUSPENDED: { label: 'Suspended', color: 'red' },
    DEACTIVATED: { label: 'Inactive', color: 'gray' },
  };
  const status = statusMap[stateId] ?? { label: stateId, color: 'gray' };

  return {
    id: u.id,
    firstName: first,
    lastName: last,
    initials: `${first.charAt(0)}${last.charAt(0)}`.toUpperCase(),
    avatarBg: 'bg-purple-100 text-purple-600',
    status: status.label,
    statusColor: status.color,
    email: u.email ?? '',
    phone: u.phone ?? '',
    memberSince: u.createdTime ? new Date(u.createdTime).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '',
    role: 'Customer',
    dob: '',
    gender: '',
    language: '',
    orders: [],
    activities: (u.activities ?? []).map((a) => ({
      event: a.name,
      iconBg: 'bg-green-50',
      iconType: 'login' as const,
      detail: a.comment ?? '',
      date: a.timestamp ? new Date(a.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '',
    })),
    addresses: (u.addresses ?? []).map((a) => ({
      type: a.type === 'HOME' ? 'Home' : a.type === 'WORK' ? 'Office' : 'Other',
      typeBg: a.type === 'HOME' ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700',
      isDefault: a.isDefault ?? false,
      name: a.fullName ?? '',
      line1: a.addressLine1 ?? '',
      line2: a.addressLine2 ?? '',
      city: a.city ?? '',
      state: a.state ?? '',
      pincode: a.pincode ?? '',
      phone: a.phone ?? '',
    })),
    totalOrders: 0,
    totalSpent: 0,
    avgOrderValue: 0,
    reviewsWritten: 0,
    emailVerified: u.emailVerified ?? false,
    phoneVerified: u.phoneVerified ?? false,
    twoFactorEnabled: false,
  };
}

// ----------------------------------------------------------------
// User Stats (4 stat cards)
// ----------------------------------------------------------------

export function useUserStats() {
  return useQuery<UserStats>({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const response = await usersApi.search({
        queryName: 'userStateCounts',
        pageNum: 1,
        pageSize: 100,
      });
      return adaptUserStats(response as unknown as SearchResponse<Record<string, unknown>>);
    },
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// User List (paginated table)
// ----------------------------------------------------------------

export function useUserList(filters: UserListFilters) {
  return useQuery<UserListResponse>({
    queryKey: ['user-list', filters],
    queryFn: async () => {
      const searchFilters: Record<string, unknown> = {};
      if (filters.status && filters.status !== 'all') searchFilters.stateId = filters.status.toUpperCase();
      if (filters.role && filters.role !== 'all') searchFilters.role = filters.role;
      if (filters.search) searchFilters.firstName = filters.search;

      const response = await usersApi.search({
        pageNum: filters.page,
        pageSize: filters.pageSize,
        filters: searchFilters,
      });
      return adaptUserList(response, filters);
    },
    staleTime: 15_000,
  });
}

// ----------------------------------------------------------------
// User Detail (rich admin view)
// ----------------------------------------------------------------

export function useUserAdminDetail(id: string) {
  return useQuery<UserDetailData>({
    queryKey: ['user-admin-detail', id],
    queryFn: async () => {
      const response = await usersApi.retrieve(id);
      return adaptUserDetail(response.mutatedEntity);
    },
    staleTime: 30_000,
    enabled: !!id,
  });
}

// ----------------------------------------------------------------
// Detail & Mutation (existing STM-based)
// ----------------------------------------------------------------

export function useUserDetail(id: string) {
  return useQuery({
    queryKey: ['platform-user', id],
    queryFn: () => usersApi.retrieve(id),
    ...CACHE_TIMES.productDetail,
    enabled: !!id,
  });
}

export function useUserMutation() {
  return useStmMutation<SharedUser>({
    entityType: 'platform-user',
    mutationFn: usersApi.processById,
  });
}
