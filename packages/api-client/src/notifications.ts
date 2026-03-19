import type { Notification, NotificationPreference, SearchRequest, SearchResponse } from '@homebase/types';
import { getApiClient } from './client';

export const notificationsApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<Notification>>('/api/v1/notifications/search', params);
  },
  markRead(id: string) {
    return getApiClient().patch<void>(`/api/v1/notifications/${id}/read`, {});
  },
  markAllRead() {
    return getApiClient().patch<void>('/api/v1/notifications/read-all', {});
  },
  getUnreadCount() {
    return getApiClient().get<{ count: number }>('/api/v1/notifications/unread-count');
  },
  getPreferences() {
    return getApiClient().get<NotificationPreference[]>('/api/v1/notifications/preferences');
  },
  updatePreference(preference: Partial<NotificationPreference>) {
    return getApiClient().put<NotificationPreference>('/api/v1/notifications/preferences', preference);
  },
};
