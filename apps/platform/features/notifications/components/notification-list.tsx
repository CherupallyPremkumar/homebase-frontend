'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Bell, Mail, Calendar, Search, Settings,
  ShoppingBag, Store, Flag, AlertTriangle,
  Banknote, Server, UserPlus, ClipboardList,
  Package, Settings2, Inbox, Trash2,
} from 'lucide-react';
import { Skeleton } from '@homebase/ui';
import { cn } from '@homebase/ui/src/lib/utils';

import {
  mockNotificationStats,
  mockNotificationTabs,
  mockNotifications,
} from '../services/mock-data';
import type {
  Notification,
  NotificationIconVariant,
} from '../types';

// ----------------------------------------------------------------
// Constants
// ----------------------------------------------------------------

const TEXT = {
  pageTitle: 'Notifications',
  pageSubtitle: 'Stay updated on platform activity',
  notificationSettings: 'Notification Settings',
  markAllRead: 'Mark All Read',
  deleteSelected: 'Delete Selected',
  searchPlaceholder: 'Search notifications...',
  emptyTitle: 'No notifications found',
  emptySubtitle: 'Try adjusting your search or filter criteria.',
  errorTitle: 'Failed to load notifications',
  retry: 'Retry',
  clearFilters: 'Clear Filters',
  statsTotal: 'Total',
  statsUnread: 'Unread',
  statsToday: 'Today',
  paginationShowing: 'Showing',
  paginationOf: 'of',
  paginationNotifications: 'notifications',
  prev: 'Prev',
  next: 'Next',
  noSelection: 'No notifications selected',
} as const;

const PAGE_SIZE = 10;
const DEBOUNCE_MS = 300;

/**
 * Icon + color mapping per notification variant.
 * Each variant gets a unique Lucide icon and a bg/text color pair.
 */
const ICON_CONFIG: Record<NotificationIconVariant, {
  icon: typeof Bell;
  bg: string;
  text: string;
}> = {
  'seller-new':       { icon: Store,         bg: 'bg-green-100',  text: 'text-green-600'  },
  'seller-verified':  { icon: UserPlus,      bg: 'bg-green-100',  text: 'text-green-600'  },
  'order-new':        { icon: ShoppingBag,   bg: 'bg-blue-100',   text: 'text-blue-600'   },
  'order-cancelled':  { icon: ClipboardList, bg: 'bg-blue-100',   text: 'text-blue-600'   },
  'product-flagged':  { icon: Flag,          bg: 'bg-red-100',    text: 'text-red-600'    },
  'product-stock':    { icon: Package,       bg: 'bg-orange-100', text: 'text-orange-600' },
  'return-escalated': { icon: AlertTriangle, bg: 'bg-yellow-100', text: 'text-yellow-600' },
  'payment':          { icon: Banknote,      bg: 'bg-green-100',  text: 'text-green-600'  },
  'system-server':    { icon: Server,        bg: 'bg-purple-100', text: 'text-purple-600' },
  'system-settings':  { icon: Settings2,     bg: 'bg-gray-100',   text: 'text-gray-600'   },
};

// ----------------------------------------------------------------
// Skeleton (loading state)
// ----------------------------------------------------------------

function NotificationListSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading notifications">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-44" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-12 rounded-xl" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-16 rounded-xl" />
      ))}
    </div>
  );
}

// ----------------------------------------------------------------
// Error state
// ----------------------------------------------------------------

function NotificationListError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <section className="flex flex-col items-center justify-center py-32" role="alert">
      <AlertTriangle className="h-12 w-12 text-red-400" aria-hidden="true" />
      <h2 className="mt-4 text-lg font-semibold text-gray-900">{TEXT.errorTitle}</h2>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
      <button
        onClick={onRetry}
        className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
      >
        {TEXT.retry}
      </button>
    </section>
  );
}

// ----------------------------------------------------------------
// Empty state
// ----------------------------------------------------------------

function NotificationListEmpty({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Inbox className="h-12 w-12 text-gray-300" aria-hidden="true" />
      <h3 className="mt-4 text-base font-semibold text-gray-900">{TEXT.emptyTitle}</h3>
      <p className="mt-1 text-sm text-gray-500">{TEXT.emptySubtitle}</p>
      <button
        onClick={onClear}
        className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
      >
        {TEXT.clearFilters}
      </button>
    </div>
  );
}

// ----------------------------------------------------------------
// Single notification item
// ----------------------------------------------------------------

function NotificationItem({
  notification,
  isSelected,
  onToggleSelect,
  onDelete,
  onMarkRead,
}: {
  notification: Notification;
  isSelected: boolean;
  onToggleSelect: () => void;
  onDelete: () => void;
  onMarkRead: () => void;
}) {
  const config = ICON_CONFIG[notification.iconVariant] ?? ICON_CONFIG['system-settings'];
  const Icon = config.icon;

  return (
    <article
      onClick={onMarkRead}
      className={cn(
        'flex items-start gap-4 px-6 py-4 cursor-pointer transition',
        'hover:bg-gray-50',
        !notification.isRead && 'border-l-[3px] border-l-orange-500',
        notification.isRead && 'border-l-[3px] border-l-transparent',
      )}
      aria-label={`${notification.isRead ? '' : 'Unread: '}${notification.title}`}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e) => { e.stopPropagation(); onToggleSelect(); }}
        onClick={(e) => e.stopPropagation()}
        className="mt-1.5 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
      />

      {/* Icon */}
      <div className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
        config.bg,
      )}>
        <Icon className={cn('h-4 w-4', config.text)} aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className={cn(
          'text-sm',
          notification.isRead ? 'text-gray-700' : 'text-gray-900',
        )}>
          <span className="font-semibold">{notification.title}</span>
          {' - '}
          {notification.description}
        </p>
        <p className="mt-1 text-xs text-gray-400">{notification.relativeTime}</p>
      </div>

      {/* Unread dot */}
      {!notification.isRead && (
        <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-orange-500" aria-label="Unread" />
      )}

      {/* Delete button */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="shrink-0 p-1 text-gray-400 transition hover:text-red-500"
        aria-label="Delete notification"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </article>
  );
}

// ----------------------------------------------------------------
// Pagination
// ----------------------------------------------------------------

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

  /** Build a compact page list: [1, 2, 3, '...', totalPages] or similar */
  const pages = useMemo(() => {
    const result: (number | 'ellipsis')[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) result.push(i);
    } else {
      result.push(1);
      if (page > 3) result.push('ellipsis');
      const rangeStart = Math.max(2, page - 1);
      const rangeEnd = Math.min(totalPages - 1, page + 1);
      for (let i = rangeStart; i <= rangeEnd; i++) result.push(i);
      if (page < totalPages - 2) result.push('ellipsis');
      result.push(totalPages);
    }
    return result;
  }, [page, totalPages]);

  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
      <p className="text-sm text-gray-500">
        {TEXT.paginationShowing} {start}-{end} {TEXT.paginationOf} {total} {TEXT.paginationNotifications}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={cn(
            'rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium transition',
            page <= 1
              ? 'cursor-not-allowed text-gray-300'
              : 'text-gray-500 hover:bg-gray-50',
          )}
        >
          {TEXT.prev}
        </button>
        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400">...</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition',
                page === p
                  ? 'bg-orange-500 text-white'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
              )}
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={cn(
            'rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium transition',
            page >= totalPages
              ? 'cursor-not-allowed text-gray-300'
              : 'text-gray-500 hover:bg-gray-50',
          )}
        >
          {TEXT.next}
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Main component
// ----------------------------------------------------------------

export function NotificationList() {
  // -- State --
  const [activeTab, setActiveTab] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Simulated loading/error for the 4-state requirement
  const [isLoading, setIsLoading] = useState(true);
  const [isError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // -- Derived data --
  const stats = mockNotificationStats;
  const tabs = mockNotificationTabs;

  const filteredNotifications = useMemo(() => {
    const tabKey = tabs[activeTab]?.key ?? 'all';
    return notifications.filter((n) => {
      // Tab filter
      if (tabKey === 'unread' && n.isRead) return false;
      if (tabKey !== 'all' && tabKey !== 'unread' && n.category !== tabKey) return false;
      // Search filter
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [notifications, activeTab, debouncedSearch, tabs]);

  const totalFiltered = filteredNotifications.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  const pagedNotifications = filteredNotifications.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );
  const isEmpty = pagedNotifications.length === 0;

  // -- Handlers --
  const handleTabChange = useCallback((index: number) => {
    setActiveTab(index);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchInput('');
    setDebouncedSearch('');
    setActiveTab(0);
    setPage(1);
  }, []);

  const handleToggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleMarkRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const handleDeleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (selected.size === 0) return;
    setNotifications((prev) => prev.filter((n) => !selected.has(n.id)));
    setSelected(new Set());
  }, [selected]);

  // -- 4 states: loading, error, empty, data --

  if (isLoading) {
    return <NotificationListSkeleton />;
  }

  if (isError) {
    return (
      <NotificationListError
        message="An unexpected error occurred while loading notifications."
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* ===== Page Header ===== */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{TEXT.pageTitle}</h1>
          <p className="mt-1 text-sm text-gray-500">{TEXT.pageSubtitle}</p>
        </div>
        <button
          className="flex items-center gap-1 text-sm font-medium text-orange-500 transition hover:text-orange-600"
          aria-label={TEXT.notificationSettings}
        >
          <Settings className="h-4 w-4" aria-hidden="true" />
          {TEXT.notificationSettings}
        </button>
      </header>

      {/* ===== Stat Cards ===== */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Notification statistics">
        {/* Total */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.statsTotal}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Bell className="h-5 w-5 text-blue-600" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Unread */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.statsUnread}</p>
              <p className="mt-1 text-2xl font-bold text-orange-500">{stats.unread}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
              <Mail className="h-5 w-5 text-orange-600" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Today */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.statsToday}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.today}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Calendar className="h-5 w-5 text-green-600" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Filter Bar + Notifications Card ===== */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* Tab bar + bulk actions */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <nav className="flex flex-wrap gap-1" role="tablist" aria-label="Notification filter">
            {tabs.map((tab, i) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === i}
                onClick={() => handleTabChange(i)}
                className={cn(
                  'rounded-lg border border-transparent px-3 py-1.5 text-xs font-medium transition',
                  activeTab === i
                    ? 'border-orange-500 bg-orange-50 text-orange-500'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700',
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-600 transition hover:bg-orange-100"
            >
              {TEXT.markAllRead}
            </button>
            <button
              onClick={handleDeleteSelected}
              className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
            >
              {TEXT.deleteSelected}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="border-b border-gray-100 px-6 py-3">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
              placeholder={TEXT.searchPlaceholder}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              aria-label="Search notifications"
            />
          </div>
        </div>

        {/* Notification list or empty state */}
        {isEmpty ? (
          <NotificationListEmpty onClear={handleClearFilters} />
        ) : (
          <div className="divide-y divide-gray-100" role="list" aria-label="Notifications list">
            {pagedNotifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                isSelected={selected.has(notif.id)}
                onToggleSelect={() => handleToggleSelect(notif.id)}
                onDelete={() => handleDeleteNotification(notif.id)}
                onMarkRead={() => handleMarkRead(notif.id)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isEmpty && (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={totalFiltered}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        )}
      </section>
    </div>
  );
}
