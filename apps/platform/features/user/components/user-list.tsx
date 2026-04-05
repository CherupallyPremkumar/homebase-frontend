'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, UserCheck, UserPlus, UserX,
  Search, Download, Plus, Eye, AlertTriangle,
  Trash2, CheckCircle, SlidersHorizontal, Inbox,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from 'lucide-react';
import { cn, StatCard, Skeleton } from '@homebase/ui';

import { useUserStats, useUserList } from '../hooks/use-user';
import type { UserListFilters } from '../hooks/use-user';
import type { UserStatus } from '../types';

// ----------------------------------------------------------------
// Constants (i18n-ready)
// ----------------------------------------------------------------

const TEXT = {
  pageTitle: 'User Management',
  pageSubtitle: 'Monitor and manage all platform users',
  export: 'Export',
  addUser: 'Add User',
  searchPlaceholder: 'Search by name, email, or phone...',
  allStatuses: 'All Statuses',
  sortNewest: 'Sort: Newest First',
  sortOldest: 'Sort: Oldest First',
  sortNameAz: 'Sort: Name A-Z',
  sortNameZa: 'Sort: Name Z-A',
  sortMostOrders: 'Sort: Most Orders',
  sortHighestSpent: 'Sort: Highest Spent',
  filters: 'Filters',
  colUser: 'User',
  colPhone: 'Phone',
  colOrders: 'Orders',
  colTotalSpent: 'Total Spent',
  colStatus: 'Status',
  colJoined: 'Joined',
  colLastActive: 'Last Active',
  colActions: 'Actions',
  showing: 'Showing',
  of: 'of',
  users: 'users',
  perPage: 'per page',
  emptyTitle: 'No users found',
  emptySubtitle: 'Try adjusting your search or filter criteria.',
  errorTitle: 'Failed to load users',
  retry: 'Retry',
  tableLabel: 'Users list',
  view: 'View',
  suspend: 'Suspend',
  reactivate: 'Reactivate',
  delete: 'Delete',
} as const;

const STATUS_STYLES: Record<UserStatus, { bg: string; text: string; dot: string }> = {
  Active: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  Suspended: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  Inactive: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
};

const PAGE_SIZE = 8;
const DEBOUNCE_MS = 300;

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function buildPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | 'ellipsis')[] = [];
  if (current <= 3) {
    pages.push(1, 2, 3, 4, 'ellipsis', total);
  } else if (current >= total - 2) {
    pages.push(1, 'ellipsis', total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total);
  }
  return pages;
}

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export function UserList() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const filters: UserListFilters = {
    search: debouncedSearch,
    status: statusFilter || 'all',
    role: '',
    page,
    pageSize: PAGE_SIZE,
  };

  const statsQuery = useUserStats();
  const listQuery = useUserList(filters);

  const handleClearFilters = useCallback(() => {
    setSearchInput('');
    setDebouncedSearch('');
    setStatusFilter('');
    setPage(1);
  }, []);

  // ------ LOADING STATE ------
  if (statsQuery.isLoading || listQuery.isLoading) {
    return <UserListSkeleton />;
  }

  // ------ ERROR STATE ------
  if (statsQuery.isError || listQuery.isError) {
    return (
      <section className="flex flex-col items-center justify-center py-32">
        <AlertTriangle className="h-12 w-12 text-red-400" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">{TEXT.errorTitle}</h2>
        <p className="mt-1 text-sm text-gray-500">
          {(statsQuery.error ?? listQuery.error)?.message}
        </p>
        <button
          onClick={() => {
            statsQuery.refetch();
            listQuery.refetch();
          }}
          className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          {TEXT.retry}
        </button>
      </section>
    );
  }

  const stats = statsQuery.data;
  const { users, total, totalPages } = listQuery.data ?? { users: [], total: 0, totalPages: 0 };
  const isEmpty = users.length === 0;
  const rangeStart = (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);
  const pageNumbers = buildPageNumbers(page, totalPages);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{TEXT.pageTitle}</h1>
          <p className="mt-1 text-sm text-gray-500">{TEXT.pageSubtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            <Download className="h-4 w-4 text-gray-500" />
            {TEXT.export}
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600">
            <Plus className="h-4 w-4" />
            {TEXT.addUser}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <section
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="User statistics"
        >
          <StatCard
            title="Total Users"
            value={stats.totalUsers.value}
            icon={<Users className="h-5 w-5 text-blue-600" />}
            trend={stats.totalUsers.trend}
            trendDirection={stats.totalUsers.trendDirection}
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers.value}
            icon={<UserCheck className="h-5 w-5 text-green-600" />}
            trend={stats.activeUsers.trend}
            trendDirection={stats.activeUsers.trendDirection}
          />
          <StatCard
            title="New This Month"
            value={stats.newThisMonth.value}
            icon={<UserPlus className="h-5 w-5 text-orange-600" />}
            trend={stats.newThisMonth.trend}
            trendDirection={stats.newThisMonth.trendDirection}
          />
          <StatCard
            title="Suspended"
            value={stats.suspended.value}
            icon={<UserX className="h-5 w-5 text-red-600" />}
            trend={stats.suspended.trend}
            trendDirection={stats.suspended.trendDirection}
            trendIsPositive
          />
        </section>
      )}

      {/* Filters & Search Bar */}
      <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative w-full flex-1 lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setPage(1);
              }}
              placeholder={TEXT.searchPlaceholder}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              aria-label="Search users"
            />
          </div>

          {/* Status + Sort */}
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 pr-10 text-sm text-gray-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              aria-label="Filter by status"
            >
              <option value="">{TEXT.allStatuses}</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 pr-10 text-sm text-gray-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              aria-label="Sort order"
            >
              <option>{TEXT.sortNewest}</option>
              <option>{TEXT.sortOldest}</option>
              <option>{TEXT.sortNameAz}</option>
              <option>{TEXT.sortNameZa}</option>
              <option>{TEXT.sortMostOrders}</option>
              <option>{TEXT.sortHighestSpent}</option>
            </select>
          </div>

          {/* Filters button (right side) */}
          <div className="flex items-center gap-2 lg:ml-auto">
            <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 transition hover:bg-gray-100">
              <SlidersHorizontal className="h-4 w-4" />
              {TEXT.filters}
            </button>
          </div>
        </div>
      </section>

      {/* Users Table */}
      <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Inbox className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-base font-semibold text-gray-900">{TEXT.emptyTitle}</h3>
            <p className="mt-1 text-sm text-gray-500">{TEXT.emptySubtitle}</p>
            <button
              onClick={handleClearFilters}
              className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full" aria-label={TEXT.tableLabel}>
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th scope="col" className="px-5 py-3.5 text-left">
                      <input
                        type="checkbox"
                        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                        aria-label="Select all users"
                      />
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {TEXT.colUser}
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {TEXT.colPhone}
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {TEXT.colOrders}
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {TEXT.colTotalSpent}
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {TEXT.colStatus}
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {TEXT.colJoined}
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {TEXT.colLastActive}
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {TEXT.colActions}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u) => {
                    const statusStyle = STATUS_STYLES[u.status];
                    return (
                      <tr
                        key={u.id}
                        className="transition-colors duration-150 hover:bg-orange-50/40"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') window.location.href = `/users/${u.id}`;
                        }}
                      >
                        <td className="px-5 py-4">
                          <input
                            type="checkbox"
                            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                            aria-label={`Select ${u.name}`}
                          />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white',
                                u.gradient,
                              )}
                            >
                              {u.initials}
                            </div>
                            <div>
                              <Link
                                href={`/users/${u.id}`}
                                className="text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                              >
                                {u.name}
                              </Link>
                              <p className="text-xs text-gray-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">{u.phone}</td>
                        <td className="px-5 py-4 text-sm font-medium text-gray-900">{u.orders}</td>
                        <td className="px-5 py-4 text-sm font-medium text-gray-900">{u.spent}</td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
                              statusStyle.bg,
                              statusStyle.text,
                            )}
                          >
                            <span className={cn('h-1.5 w-1.5 rounded-full', statusStyle.dot)} />
                            {u.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500">{u.joined}</td>
                        <td className="px-5 py-4 text-sm text-gray-500">{u.lastActive}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <Link
                              href={`/users/${u.id}`}
                              className="rounded-lg p-1.5 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"
                              title={TEXT.view}
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            {u.status === 'Active' && (
                              <button
                                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-amber-50 hover:text-amber-600"
                                title={TEXT.suspend}
                              >
                                <AlertTriangle className="h-4 w-4" />
                              </button>
                            )}
                            {u.status === 'Suspended' && (
                              <button
                                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-green-50 hover:text-green-600"
                                title={TEXT.reactivate}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                            {u.status === 'Inactive' && (
                              <button
                                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-amber-50 hover:text-amber-600"
                                title={TEXT.suspend}
                              >
                                <AlertTriangle className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                              title={TEXT.delete}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500">
                  {TEXT.showing}{' '}
                  <span className="font-medium text-gray-700">
                    {rangeStart}-{rangeEnd}
                  </span>{' '}
                  {TEXT.of}{' '}
                  <span className="font-medium text-gray-700">
                    {total.toLocaleString()}
                  </span>{' '}
                  {TEXT.users}
                </p>
                <select
                  className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-600 outline-none transition focus:border-orange-400"
                  aria-label="Rows per page"
                >
                  <option>8 {TEXT.perPage}</option>
                  <option>25 {TEXT.perPage}</option>
                  <option>50 {TEXT.perPage}</option>
                  <option>100 {TEXT.perPage}</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                {/* First page */}
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(1)}
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="First page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>
                {/* Previous page */}
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Page numbers */}
                {pageNumbers.map((p, idx) =>
                  p === 'ellipsis' ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="flex h-9 w-9 items-center justify-center text-sm text-gray-400"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={cn(
                        'h-9 w-9 rounded-lg text-sm font-medium transition',
                        p === page
                          ? 'bg-orange-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100',
                      )}
                    >
                      {p.toLocaleString()}
                    </button>
                  ),
                )}

                {/* Next page */}
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                {/* Last page */}
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(totalPages)}
                  className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Last page"
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

// ----------------------------------------------------------------
// Loading skeleton
// ----------------------------------------------------------------

function UserListSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
      {/* Stats skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[120px] rounded-xl" />
        ))}
      </div>
      {/* Filter bar skeleton */}
      <Skeleton className="h-[72px] rounded-xl" />
      {/* Table skeleton */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gray-50 px-5 py-3.5">
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-gray-50 px-5 py-4">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-9 w-64" />
        </div>
      </div>
    </div>
  );
}
