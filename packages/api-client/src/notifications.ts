import type { Notification, NotificationPreference, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const notificationsApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<Notification>>('/notification/notifications', params);
  },

  async retrieve(id: string) {
    const response = await getApiClient().post<SearchResponse<Notification>>('/notification/notification', {
      filters: { id },
    });
    const item = response.list?.[0];
    if (!item) throw new Error('Notification not found');
    return { mutatedEntity: item.row, allowedActionsAndMetadata: item.allowedActions ?? [] } as StateEntityServiceResponse<Notification>;
  },
  processById(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<Notification>>('/notification/' + id + '/' + eventId, payload ?? {});
  },
  markRead(id: string) {
    return getApiClient().patch<StateEntityServiceResponse<Notification>>('/notification/' + id + '/MARK_READ', {});
  },
  markAllRead() {
    return getApiClient().post<void>('/notification/read-all', {});
  },
  getPreferences() {
    return getApiClient().get<NotificationPreference[]>('/notification/preferences');
  },
  updatePreference(preference: Partial<NotificationPreference>) {
    return getApiClient().put<NotificationPreference>('/notification/preferences', preference);
  },

  /** Storefront query: search customer notifications via Chenile query service */
  searchNotifications(params: SearchRequest) {
    return getApiClient().post<SearchResponse<Notification>>('/storefront/my-notifications', params);
  },

  /** Mark a single notification as read via STM event */
  markAsRead(id: string) {
    return getApiClient().patch<StateEntityServiceResponse<Notification>>('/notification/' + id + '/MARK_READ', {});
  },

  /** Get unread notification count using storefront query with isRead=false filter */
  getUnreadCount() {
    return getApiClient().post<SearchResponse<Notification>>('/storefront/my-notifications', {
      pageNum: 1,
      pageSize: 1,
      filters: { isRead: 'false' },
    }).then(response => response.maxRows ?? 0);
  },
};
