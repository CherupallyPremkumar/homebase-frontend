/**
 * Types for the Notifications feature.
 */

export type NotificationCategory =
  | 'orders'
  | 'sellers'
  | 'products'
  | 'system';

export type NotificationPriority = 'high' | 'medium' | 'low';

/**
 * Each notification carries an iconVariant that maps to a specific
 * icon + color combination in the UI. This allows different notification
 * types within the same category to display distinct icons.
 */
export type NotificationIconVariant =
  | 'seller-new'
  | 'seller-verified'
  | 'order-new'
  | 'order-cancelled'
  | 'product-flagged'
  | 'product-stock'
  | 'return-escalated'
  | 'payment'
  | 'system-server'
  | 'system-settings';

export interface Notification {
  id: string;
  title: string;
  description: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  isRead: boolean;
  timestamp: string;
  relativeTime: string;
  iconVariant: NotificationIconVariant;
  actionUrl?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  today: number;
}

export interface NotificationTab {
  key: string;
  label: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface NotificationListFilters {
  search: string;
  tab: string;
  page: number;
  pageSize: number;
}
