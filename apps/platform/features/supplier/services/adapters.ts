/**
 * Adapter functions that transform backend SearchResponse data into UI-specific shapes.
 * Shared between server-side prefetching (page.tsx) and client hooks (use-supplier.ts).
 *
 * This file must NOT have 'use client' so it can be imported in Server Components.
 */

import type { Supplier as SharedSupplier, SearchResponse } from '@homebase/types';
import type {
  SupplierStats,
  SupplierListResponse,
  SupplierListFilters,
  ComplianceStatus,
} from '../types';

/**
 * Adapts supplierStateCounts query response into SupplierStats.
 * The backend returns rows with { stateId, count } pairs.
 */
export function adaptSupplierStats(response: SearchResponse<Record<string, unknown>>): SupplierStats {
  const stateCounts: Record<string, number> = {};
  let total = 0;
  for (const item of response.list ?? []) {
    const stateId = String(item.row.stateId ?? item.row.state_id ?? '');
    const count = Number(item.row.count ?? item.row.cnt ?? 0);
    stateCounts[stateId] = count;
    total += count;
  }

  const active = stateCounts['ACTIVE'] ?? stateCounts['APPROVED'] ?? 0;
  const pending = stateCounts['PENDING_APPROVAL'] ?? stateCounts['CREATED'] ?? 0;
  const suspended = stateCounts['SUSPENDED'] ?? 0;
  const inactive = stateCounts['DEACTIVATED'] ?? stateCounts['INACTIVE'] ?? 0;

  const activePercent = total > 0 ? ((active / total) * 100).toFixed(1) : '0';

  return {
    totalSellers: { value: total.toLocaleString('en-IN'), trend: 0, trendDirection: 'up' },
    active: { value: active.toLocaleString('en-IN'), subtitle: `${activePercent}% of total` },
    pendingApproval: { value: pending.toLocaleString('en-IN'), subtitle: 'Requires review' },
    suspended: { value: suspended.toLocaleString('en-IN'), subtitle: 'Policy violations' },
    inactive: { value: inactive.toLocaleString('en-IN'), subtitle: 'No activity 30+ days' },
  };
}

/**
 * Adapts supplier search response into SupplierListResponse expected by the UI table.
 */
export function adaptSupplierList(response: SearchResponse<SharedSupplier>, filters: SupplierListFilters): SupplierListResponse {
  const gradients = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-green-400 to-green-600',
    'from-amber-400 to-amber-600',
    'from-rose-400 to-rose-600',
    'from-red-400 to-red-600',
    'from-teal-400 to-teal-600',
    'from-indigo-400 to-indigo-600',
  ];

  const suppliers = (response.list ?? []).map((item, idx) => {
    const s = item.row;
    const name = s.contactPerson ?? s.businessName ?? '';
    const initials = name.split(' ').map((w: string) => w.charAt(0)).join('').substring(0, 2).toUpperCase();
    const stateId = s.stateId ?? (s.currentState?.stateId) ?? 'CREATED';
    const statusMap: Record<string, string> = {
      ACTIVE: 'Active', APPROVED: 'Active', PENDING_APPROVAL: 'Pending',
      CREATED: 'Pending', SUSPENDED: 'Suspended', DEACTIVATED: 'Inactive',
    };

    const complianceMap: Record<string, ComplianceStatus> = {
      ACTIVE: 'ok', APPROVED: 'ok', PENDING_APPROVAL: 'review',
      CREATED: 'review', SUSPENDED: 'violation', DEACTIVATED: 'ok',
    };

    return {
      id: idx + 1,
      initials,
      gradient: gradients[idx % gradients.length]!,
      name,
      email: s.email ?? '',
      store: s.businessName ?? '',
      healthScore: s.performanceScore ?? 0,
      products: s.productCount ?? 0,
      orders: '0',
      revenue: '\u20B90',
      rating: s.rating ?? 0,
      fulfillmentPct: 0,
      disputes: 0,
      compliance: (complianceMap[stateId] ?? 'ok') as ComplianceStatus,
      status: (statusMap[stateId] ?? 'Inactive') as 'Active' | 'Pending' | 'Suspended' | 'Inactive',
      joined: s.createdTime ? new Date(s.createdTime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
    };
  });

  return {
    suppliers,
    total: response.maxRows ?? suppliers.length,
    page: filters.page,
    pageSize: filters.pageSize,
    totalPages: response.maxPages ?? 1,
  };
}
