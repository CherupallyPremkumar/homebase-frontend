/**
 * Pure adapter functions: transform backend SearchResponse data into
 * user-specific UI types. Shared between client hooks and server prefetch.
 */

import type { User as SharedUser, SearchResponse } from '@homebase/types';

import type {
  UserStats,
  UserListResponse,
  UserListFilters,
} from './types';

// ----------------------------------------------------------------
// User Stats
// ----------------------------------------------------------------

export function adaptUserStats(response: SearchResponse<Record<string, unknown>>): UserStats {
  const stateCounts: Record<string, number> = {};
  let total = 0;
  for (const item of response.list ?? []) {
    const stateId = String(item.row.stateId ?? item.row.state_id ?? '');
    const count = Number(item.row.count ?? item.row.cnt ?? 0);
    stateCounts[stateId] = count;
    total += count;
  }

  const active = stateCounts['ACTIVE'] ?? stateCounts['VERIFIED'] ?? 0;
  const suspended = stateCounts['SUSPENDED'] ?? 0;

  return {
    totalUsers: { value: total.toLocaleString('en-IN'), trend: 0, trendDirection: 'up' },
    activeUsers: { value: active.toLocaleString('en-IN'), trend: 0, trendDirection: 'up' },
    newThisMonth: { value: (stateCounts['PENDING_VERIFICATION'] ?? stateCounts['CREATED'] ?? 0).toLocaleString('en-IN'), trend: 0, trendDirection: 'up' },
    suspended: { value: suspended.toLocaleString('en-IN'), trend: 0, trendDirection: 'down' },
  };
}

// ----------------------------------------------------------------
// User List
// ----------------------------------------------------------------

export function adaptUserList(response: SearchResponse<SharedUser>, filters: UserListFilters): UserListResponse {
  const gradients = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-orange-400 to-orange-600',
    'from-green-400 to-green-600',
    'from-red-400 to-red-600',
    'from-teal-400 to-teal-600',
    'from-indigo-400 to-indigo-600',
    'from-pink-400 to-pink-600',
  ];

  const users = (response.list ?? []).map((item, idx) => {
    const u = item.row;
    const first = u.firstName ?? '';
    const last = u.lastName ?? '';
    const initials = `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    const stateId = u.stateId ?? (u.currentState?.stateId) ?? 'CREATED';
    const statusMap: Record<string, string> = {
      ACTIVE: 'Active', VERIFIED: 'Active', SUSPENDED: 'Suspended',
      DEACTIVATED: 'Inactive', CREATED: 'Inactive', PENDING_VERIFICATION: 'Inactive',
    };

    return {
      id: idx + 1,
      initials,
      gradient: gradients[idx % gradients.length]!,
      name: `${first} ${last}`.trim() || u.displayName || u.email,
      email: u.email ?? '',
      phone: u.phone ?? '',
      role: 'Customer' as const,
      orders: 0,
      spent: '\u20B90',
      status: (statusMap[stateId] ?? 'Inactive') as 'Active' | 'Suspended' | 'Inactive',
      joined: u.createdTime ? new Date(u.createdTime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
      lastActive: u.lastModifiedTime ? new Date(u.lastModifiedTime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
    };
  });

  return {
    users,
    total: response.maxRows ?? users.length,
    page: filters.page,
    pageSize: filters.pageSize,
    totalPages: response.maxPages ?? 1,
  };
}
