'use client';

import { Fragment, useState, useCallback, useEffect } from 'react';
import {
  Clock, Users, AlertTriangle, Search, Download,
  ChevronRight, Inbox,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { Skeleton } from '@homebase/ui';

import { useAuditStats, useAuditList } from '../hooks/use-audit';
import type { AuditListFilters } from '../hooks/use-audit';
import type { AuditLogEntry, AuditAction } from '../services/mock-data';

// ----------------------------------------------------------------
// Constants
// ----------------------------------------------------------------

const TEXT = {
  pageTitle: 'Audit Log',
  pageSubtitle: 'Complete record of all administrative actions for compliance and accountability.',
  exportAuditLog: 'Export Audit Log',
  searchPlaceholder: 'Search actions, users, entities...',
  allAdmins: 'All Admins',
  allActions: 'All Actions',
  allEntities: 'All Entities',
  filter: 'Filter',
  emptyTitle: 'No audit entries found',
  emptySubtitle: 'Try adjusting your search or filter criteria.',
  errorTitle: 'Failed to load audit log',
  retry: 'Retry',
  clearFilters: 'Clear Filters',
  totalActionsToday: 'Total Actions Today',
  adminUsersActive: 'Admin Users Active',
  criticalActions: 'Critical Actions',
  actionsLogged: 'Actions logged today',
  currentlyLoggedIn: 'Currently logged in',
  requireReview: 'Require review',
  colTimestamp: 'Timestamp',
  colAdmin: 'Admin User',
  colAction: 'Action',
  colEntityType: 'Entity Type',
  colEntityId: 'Entity ID',
  colDetails: 'Details',
  colIp: 'IP Address',
  before: 'Before',
  after: 'After',
  tableLabel: 'Audit log entries',
  showing: 'Showing',
  of: 'of',
  entries: 'entries',
  to: 'to',
} as const;

const PAGE_SIZE = 12;
const DEBOUNCE_MS = 300;

const ADMINS = ['All Admins', 'Super Admin', 'Ravi Krishnan', 'Deepa Menon'];
const ACTIONS = ['All Actions', 'Create', 'Update', 'Delete', 'Approve', 'Suspend', 'Override'];
const ENTITIES = ['All Entities', 'Order', 'Product', 'Seller', 'User', 'Settings'];

const ACTION_STYLES: Record<AuditAction, string> = {
  Suspended: 'bg-red-100 text-red-700',
  Approved: 'bg-green-100 text-green-700',
  Flagged: 'bg-yellow-100 text-yellow-700',
  Updated: 'bg-red-100 text-red-700',
  Processed: 'bg-blue-100 text-blue-700',
  Override: 'bg-orange-100 text-orange-700',
  Created: 'bg-green-100 text-green-700',
  Deleted: 'bg-red-100 text-red-700',
  Modified: 'bg-purple-100 text-purple-700',
  Published: 'bg-green-100 text-green-700',
  'Force Refund': 'bg-red-100 text-red-700',
};

// ----------------------------------------------------------------
// Skeleton
// ----------------------------------------------------------------

function AuditSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading audit log">
      <div className="flex items-center justify-between">
        <div><Skeleton className="h-8 w-40" /><Skeleton className="mt-2 h-4 w-96" /></div>
        <Skeleton className="h-10 w-44" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-14 rounded-xl" />
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}

// ----------------------------------------------------------------
// Expandable Row
// ----------------------------------------------------------------

function ExpandedContent({ entry }: { entry: AuditLogEntry }) {
  if (!entry.expandedData) return null;

  return (
    <tr className={entry.isCritical ? 'bg-red-50/50' : 'bg-gray-50/50'}>
      <td colSpan={8} className="px-8 py-4">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div
            className={cn(
              'rounded-lg border p-3',
              entry.isCritical ? 'border-red-100 bg-white' : 'border-gray-200 bg-gray-50',
            )}
          >
            <p className="mb-2 font-semibold text-gray-500">{TEXT.before}</p>
            {Object.entries(entry.expandedData.before).map(([key, val]) => (
              <p key={key} className="text-gray-700">
                {key}: <span className="font-medium">{val}</span>
              </p>
            ))}
          </div>
          <div
            className={cn(
              'rounded-lg border p-3',
              entry.isCritical ? 'border-red-100 bg-white' : 'border-gray-200 bg-gray-50',
            )}
          >
            <p className="mb-2 font-semibold text-gray-500">{TEXT.after}</p>
            {Object.entries(entry.expandedData.after).map(([key, val]) => (
              <p key={key} className="text-gray-700">
                {key}: <span className="font-medium">{val}</span>
              </p>
            ))}
          </div>
        </div>
      </td>
    </tr>
  );
}

// ----------------------------------------------------------------
// Pagination
// ----------------------------------------------------------------

function buildPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];

  if (currentPage <= 3) {
    pages.push(1, 2, 3, 'ellipsis', totalPages);
  } else if (currentPage >= totalPages - 2) {
    pages.push(1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages);
  } else {
    pages.push(1, 'ellipsis', currentPage, 'ellipsis', totalPages);
  }

  return pages;
}

function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (p: number) => void;
}) {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const pageNumbers = buildPageNumbers(page, totalPages);

  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
      <p className="text-xs text-gray-500">
        {TEXT.showing} {start}-{end} {TEXT.of} {total} {TEXT.entries}
      </p>
      <div className="flex items-center gap-1">
        {pageNumbers.map((item, idx) =>
          item === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-xs text-gray-400">...</span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              className={cn(
                'rounded px-3 py-1.5 text-xs font-medium',
                item === page
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              )}
            >
              {item}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------

export function AuditLogList() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('');
  const [dateFrom, setDateFrom] = useState('2026-03-28');
  const [dateTo, setDateTo] = useState('2026-03-28');
  const [page, setPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const filters: AuditListFilters = {
    search: debouncedSearch,
    admin: selectedAdmin,
    action: selectedAction,
    entity: selectedEntity,
    dateFrom,
    dateTo,
    page,
    pageSize: PAGE_SIZE,
  };

  const statsQuery = useAuditStats();
  const listQuery = useAuditList(filters);

  const toggleRow = useCallback((id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchInput('');
    setDebouncedSearch('');
    setSelectedAdmin('');
    setSelectedAction('');
    setSelectedEntity('');
    setPage(1);
  }, []);

  // ------ LOADING STATE ------
  if (statsQuery.isLoading || listQuery.isLoading) {
    return <AuditSkeleton />;
  }

  // ------ ERROR STATE ------
  if (statsQuery.isError || listQuery.isError) {
    return (
      <section className="flex flex-col items-center justify-center py-32" role="alert">
        <AlertTriangle className="h-12 w-12 text-red-400" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">{TEXT.errorTitle}</h2>
        <p className="mt-1 text-sm text-gray-500">{(statsQuery.error ?? listQuery.error)?.message}</p>
        <button
          onClick={() => { statsQuery.refetch(); listQuery.refetch(); }}
          className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          {TEXT.retry}
        </button>
      </section>
    );
  }

  const stats = statsQuery.data;
  const listData = listQuery.data ?? { entries: [], total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 0 };
  const { entries } = listData;
  const isEmpty = entries.length === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{TEXT.pageTitle}</h1>
          <p className="mt-1 text-sm text-gray-500">{TEXT.pageSubtitle}</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
          <Download className="h-4 w-4" aria-hidden="true" />
          {TEXT.exportAuditLog}
        </button>
      </header>

      {/* Stat Cards */}
      {stats && (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Audit statistics">
          <div className="rounded-xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{TEXT.totalActionsToday}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                <Clock className="h-4 w-4 text-blue-600" aria-hidden="true" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalActionsToday}</p>
            <p className="mt-1 text-xs text-gray-500">{TEXT.actionsLogged}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{TEXT.adminUsersActive}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                <Users className="h-4 w-4 text-green-600" aria-hidden="true" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.adminUsersActive}</p>
            <p className="mt-1 text-xs text-gray-500">{TEXT.currentlyLoggedIn}</p>
          </div>
          <div className="rounded-xl border border-red-200 bg-white p-5 ring-1 ring-red-100 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-red-600">{TEXT.criticalActions}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" aria-hidden="true" />
              </div>
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.criticalActions}</p>
            <p className="mt-1 text-xs text-gray-500">{TEXT.requireReview}</p>
          </div>
        </section>
      )}

      {/* Filter Bar */}
      <section className="rounded-xl border border-gray-200 bg-white p-4" aria-label="Audit log filters">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-[200px] flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
                placeholder={TEXT.searchPlaceholder}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                aria-label="Search audit log"
              />
            </div>
          </div>
          <select
            value={selectedAdmin}
            onChange={(e) => { setSelectedAdmin(e.target.value); setPage(1); }}
            className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400"
            aria-label="Filter by admin"
          >
            {ADMINS.map((a) => <option key={a} value={a === 'All Admins' ? '' : a}>{a}</option>)}
          </select>
          <select
            value={selectedAction}
            onChange={(e) => { setSelectedAction(e.target.value); setPage(1); }}
            className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400"
            aria-label="Filter by action"
          >
            {ACTIONS.map((a) => <option key={a} value={a === 'All Actions' ? '' : a}>{a}</option>)}
          </select>
          <select
            value={selectedEntity}
            onChange={(e) => { setSelectedEntity(e.target.value); setPage(1); }}
            className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400"
            aria-label="Filter by entity"
          >
            {ENTITIES.map((e) => <option key={e} value={e === 'All Entities' ? '' : e}>{e}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-400"
              aria-label="Date from"
            />
            <span className="text-xs text-gray-400">{TEXT.to}</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-400"
              aria-label="Date to"
            />
          </div>
          <button
            onClick={handleClearFilters}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            {TEXT.filter}
          </button>
        </div>
      </section>

      {/* Audit Table */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white" aria-label="Audit log table">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Inbox className="h-12 w-12 text-gray-300" aria-hidden="true" />
            <h3 className="mt-4 text-base font-semibold text-gray-900">{TEXT.emptyTitle}</h3>
            <p className="mt-1 text-sm text-gray-500">{TEXT.emptySubtitle}</p>
            <button
              onClick={handleClearFilters}
              className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
            >
              {TEXT.clearFilters}
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm" aria-label={TEXT.tableLabel}>
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                    <th scope="col" className="w-8 px-4 py-3 font-semibold"><span className="sr-only">Expand</span></th>
                    <th scope="col" className="px-4 py-3 font-semibold">{TEXT.colTimestamp}</th>
                    <th scope="col" className="px-4 py-3 font-semibold">{TEXT.colAdmin}</th>
                    <th scope="col" className="px-4 py-3 font-semibold">{TEXT.colAction}</th>
                    <th scope="col" className="px-4 py-3 font-semibold">{TEXT.colEntityType}</th>
                    <th scope="col" className="px-4 py-3 font-semibold">{TEXT.colEntityId}</th>
                    <th scope="col" className="px-4 py-3 font-semibold">{TEXT.colDetails}</th>
                    <th scope="col" className="px-4 py-3 font-semibold">{TEXT.colIp}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {entries.map((entry) => {
                    const isExpanded = expandedRows.has(entry.id);
                    return (
                      <Fragment key={entry.id}>
                        <tr
                          className={cn(
                            'cursor-pointer transition',
                            entry.isCritical
                              ? 'bg-red-50 hover:bg-red-100/70'
                              : 'hover:bg-orange-50/40',
                          )}
                          onClick={() => toggleRow(entry.id)}
                          aria-expanded={isExpanded}
                        >
                          <td className="px-4 py-3.5 text-center">
                            <ChevronRight
                              className={cn(
                                'h-4 w-4 text-gray-400 transition-transform',
                                isExpanded && 'rotate-90',
                              )}
                              aria-hidden="true"
                            />
                          </td>
                          <td className="whitespace-nowrap px-4 py-3.5 text-xs text-gray-600">{entry.timestamp}</td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                'flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br text-[9px] font-bold text-white',
                                entry.admin.avatarGradient,
                              )}>
                                {entry.admin.initials}
                              </div>
                              <span className="font-medium text-gray-900">{entry.admin.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={cn(
                              'rounded px-2 py-0.5 text-xs font-semibold',
                              ACTION_STYLES[entry.action] ?? 'bg-gray-100 text-gray-700',
                            )}>
                              {entry.action}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-gray-500">{entry.entityType}</td>
                          <td className="px-4 py-3.5 font-mono text-xs text-orange-600">{entry.entityId}</td>
                          <td className="px-4 py-3.5 text-xs text-gray-600">{entry.details}</td>
                          <td className="px-4 py-3.5 font-mono text-xs text-gray-400">{entry.ipAddress}</td>
                        </tr>
                        {isExpanded && <ExpandedContent entry={entry} />}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination
              page={listData.page}
              totalPages={listData.totalPages}
              total={listData.total}
              pageSize={listData.pageSize}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </div>
  );
}
