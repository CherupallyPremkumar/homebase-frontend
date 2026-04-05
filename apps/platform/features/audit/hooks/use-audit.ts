'use client';

import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';
import type { SearchResponse } from '@homebase/types';

import type { AuditStats, AuditListResponse, AuditListFilters, AuditLogEntry } from '../types';

export type { AuditListFilters } from '../types';

// ----------------------------------------------------------------
// Backend row type
// ----------------------------------------------------------------

interface AuditRow {
  id: string;
  timestamp?: string;
  createdTime?: string;
  adminName?: string;
  adminUser?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
  isCritical?: boolean;
  severity?: string;
  beforeState?: Record<string, string>;
  afterState?: Record<string, string>;
}

// ----------------------------------------------------------------
// Adapters
// ----------------------------------------------------------------

function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

const ADMIN_GRADIENTS = [
  'from-green-500 to-green-700',
  'from-blue-500 to-blue-700',
  'from-purple-500 to-purple-700',
  'from-amber-500 to-amber-700',
];

function adaptAuditRows(rows: AuditRow[]): AuditLogEntry[] {
  const adminColorMap = new Map<string, string>();
  let colorIndex = 0;

  return rows.map((row) => {
    const adminName = row.adminName ?? row.adminUser ?? 'System';
    if (!adminColorMap.has(adminName)) {
      adminColorMap.set(adminName, ADMIN_GRADIENTS[colorIndex % ADMIN_GRADIENTS.length]!);
      colorIndex++;
    }

    const timestamp = row.timestamp ?? row.createdTime ?? '';
    const formattedTime = timestamp
      ? new Date(timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })
      : '';

    return {
      id: row.id,
      timestamp: formattedTime,
      admin: {
        name: adminName,
        initials: getInitials(adminName),
        avatarGradient: adminColorMap.get(adminName)!,
      },
      action: (row.action ?? 'Updated') as AuditLogEntry['action'],
      entityType: (row.entityType ?? 'Settings') as AuditLogEntry['entityType'],
      entityId: row.entityId ?? '',
      details: row.details ?? '',
      ipAddress: row.ipAddress ?? '',
      isCritical: row.isCritical ?? row.severity === 'CRITICAL',
      expandedData: (row.beforeState || row.afterState)
        ? { before: row.beforeState ?? {}, after: row.afterState ?? {} }
        : undefined,
    };
  });
}

// ----------------------------------------------------------------
// Audit Stats
// ----------------------------------------------------------------

export function useAuditStats() {
  return useQuery<AuditStats>({
    queryKey: ['audit-stats'],
    queryFn: async () => {
      const response = await getApiClient().post<SearchResponse<AuditRow>>(
        '/dashboard/audit-log',
        { pageNum: 1, pageSize: 1, filters: { today: true } },
      );
      const totalActionsToday = response.maxRows ?? 0;
      // Derive unique admins and critical count from a broader fetch
      const fullPage = await getApiClient().post<SearchResponse<AuditRow>>(
        '/dashboard/audit-log',
        { pageNum: 1, pageSize: 100, filters: { today: true } },
      );
      const rows = fullPage.list?.map((item) => item.row) ?? [];
      const uniqueAdmins = new Set(rows.map((r) => r.adminName ?? r.adminUser ?? 'System'));
      const criticalCount = rows.filter((r) => r.isCritical || r.severity === 'CRITICAL').length;

      return {
        totalActionsToday,
        adminUsersActive: uniqueAdmins.size,
        criticalActions: criticalCount,
      };
    },
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// Audit Log List
// ----------------------------------------------------------------

export function useAuditList(filters: AuditListFilters) {
  return useQuery<AuditListResponse>({
    queryKey: ['audit-list', filters],
    queryFn: async () => {
      const response = await getApiClient().post<SearchResponse<AuditRow>>(
        '/dashboard/audit-log',
        {
          pageNum: filters.page,
          pageSize: filters.pageSize,
          filters: {
            ...(filters.admin && { adminUser: filters.admin }),
            ...(filters.action && { action: filters.action }),
            ...(filters.entity && { entityType: filters.entity }),
            ...(filters.search && { search: filters.search }),
            ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
            ...(filters.dateTo && { dateTo: filters.dateTo }),
          },
        },
      );

      const rows = response.list?.map((item) => item.row) ?? [];
      const entries = adaptAuditRows(rows);

      return {
        entries,
        total: response.maxRows ?? entries.length,
        page: response.currentPage ?? filters.page,
        pageSize: response.numRowsInPage ?? filters.pageSize,
        totalPages: response.maxPages ?? Math.ceil((response.maxRows ?? entries.length) / filters.pageSize),
      };
    },
    staleTime: 15_000,
  });
}
