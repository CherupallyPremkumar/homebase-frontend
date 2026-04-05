'use client';

import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '@homebase/api-client';
import type { Notification as SharedNotification, SearchResponse } from '@homebase/types';

import type {
  NotificationStats,
  NotificationListResponse,
  NotificationListFilters,
  NotificationIconVariant,
  Notification as UINotification,
} from '../types';

export type { NotificationListFilters } from '../types';

// ----------------------------------------------------------------
// Adapters: transform SearchResponse → UI-specific types
// ----------------------------------------------------------------

/**
 * Adapts notificationStateCounts query response into NotificationStats.
 */
function adaptNotificationStats(
  countResponse: SearchResponse<Record<string, unknown>>,
  unreadCount: number,
): NotificationStats {
  let total = 0;
  for (const item of countResponse.list ?? []) {
    total += Number(item.row.count ?? item.row.cnt ?? 0);
  }

  return {
    total,
    unread: unreadCount,
    today: 0,
  };
}

/**
 * Computes relative time string from a timestamp.
 */
function relativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} ${diffHr === 1 ? 'hour' : 'hours'} ago`;
  if (diffDay === 1) return 'Yesterday';
  return `${diffDay} days ago`;
}

/**
 * Adapts notification search response into NotificationListResponse.
 */
function adaptNotificationList(response: SearchResponse<SharedNotification>, filters: NotificationListFilters): NotificationListResponse {
  const categoryMap: Record<string, string> = {
    ORDER: 'orders', PAYMENT: 'orders', SHIPPING: 'orders',
    SELLER: 'sellers', SUPPLIER: 'sellers', ONBOARDING: 'sellers',
    PRODUCT: 'products', INVENTORY: 'products', OFFER: 'products',
    SYSTEM: 'system', ALERT: 'system',
  };

  /** Map backend type to an appropriate icon variant */
  const iconVariantMap: Record<string, NotificationIconVariant> = {
    ORDER: 'order-new',
    PAYMENT: 'payment',
    SHIPPING: 'order-new',
    SELLER: 'seller-new',
    SUPPLIER: 'seller-new',
    ONBOARDING: 'seller-verified',
    PRODUCT: 'product-stock',
    INVENTORY: 'product-stock',
    OFFER: 'product-stock',
    SYSTEM: 'system-server',
    ALERT: 'system-settings',
  };

  const notifications: UINotification[] = (response.list ?? []).map((item) => {
    const n = item.row;
    const type = (n.type ?? '').toUpperCase();

    return {
      id: n.id ?? '',
      title: n.subject ?? n.type ?? 'Notification',
      description: n.body ?? '',
      category: (categoryMap[type] ?? 'system') as UINotification['category'],
      priority: 'medium' as UINotification['priority'],
      isRead: !!n.readAt,
      timestamp: n.sentAt ?? n.createdTime ?? '',
      relativeTime: relativeTime(n.sentAt ?? n.createdTime ?? new Date().toISOString()),
      iconVariant: iconVariantMap[type] ?? 'system-settings',
      actionUrl: n.referenceId ? `/${(n.referenceType ?? 'orders').toLowerCase()}` : undefined,
    };
  });

  return {
    notifications,
    total: response.maxRows ?? notifications.length,
    page: filters.page,
    pageSize: filters.pageSize,
    totalPages: response.maxPages ?? 1,
  };
}

// ----------------------------------------------------------------
// Notification Stats
// ----------------------------------------------------------------

export function useNotificationStats() {
  return useQuery<NotificationStats>({
    queryKey: ['notification-stats'],
    queryFn: async () => {
      const [countResponse, unreadCount] = await Promise.all([
        notificationsApi.search({
          queryName: 'notificationStateCounts',
          pageNum: 1,
          pageSize: 100,
        }),
        // Use a search with a small page to get total unread count from maxRows
        notificationsApi.search({
          pageNum: 1,
          pageSize: 1,
          filters: { stateId: 'DISPATCHED' },
        }).then((r) => r.maxRows ?? 0).catch(() => 0),
      ]);
      return adaptNotificationStats(
        countResponse as unknown as SearchResponse<Record<string, unknown>>,
        unreadCount,
      );
    },
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// Notification List
// ----------------------------------------------------------------

export function useNotificationList(filters: NotificationListFilters) {
  return useQuery<NotificationListResponse>({
    queryKey: ['notification-list', filters],
    queryFn: async () => {
      const searchFilters: Record<string, unknown> = {};
      if (filters.tab && filters.tab !== 'all') {
        // Map UI tabs to backend filters
        if (filters.tab === 'unread') {
          searchFilters.stateId = 'DISPATCHED';
        } else {
          // orders/sellers/products/system map by channel or type
          searchFilters.channel = filters.tab.toUpperCase();
        }
      }
      if (filters.search) searchFilters.subject = filters.search;

      const response = await notificationsApi.search({
        pageNum: filters.page,
        pageSize: filters.pageSize,
        filters: searchFilters,
      });
      return adaptNotificationList(
        response as unknown as SearchResponse<SharedNotification>,
        filters,
      );
    },
    staleTime: 15_000,
  });
}
