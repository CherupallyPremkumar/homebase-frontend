/**
 * Mock data for the Notifications page.
 *
 * Each export matches the shape returned by the real API contract.
 * When backend endpoints are ready, swap the mock imports in
 * queries.ts for real fetch calls -- no component changes needed.
 */

import type {
  Notification,
  NotificationStats,
  NotificationTab,
  NotificationListResponse,
} from '../types';

export type {
  NotificationCategory,
  NotificationPriority,
  Notification,
  NotificationStats,
  NotificationTab,
  NotificationListResponse,
} from '../types';

// ----------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------

export const mockNotificationStats: NotificationStats = {
  total: 142,
  unread: 23,
  today: 12,
};

export const mockNotificationTabs: NotificationTab[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'orders', label: 'Orders' },
  { key: 'sellers', label: 'Sellers' },
  { key: 'products', label: 'Products' },
  { key: 'system', label: 'System' },
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    title: 'New Seller Registration',
    description: 'Sharma Electronics has applied for onboarding',
    category: 'sellers',
    priority: 'medium',
    isRead: false,
    timestamp: '2026-03-28T09:52:00Z',
    relativeTime: '8 minutes ago',
    iconVariant: 'seller-new',
  },
  {
    id: 'notif-002',
    title: 'Bulk Order Placed',
    description: 'Order #HB-78234 worth \u20B91,24,500 from Priya Enterprises',
    category: 'orders',
    priority: 'high',
    isRead: false,
    timestamp: '2026-03-28T09:35:00Z',
    relativeTime: '25 minutes ago',
    iconVariant: 'order-new',
  },
  {
    id: 'notif-003',
    title: 'Product Flagged',
    description: '"Premium LED Panel 40W" reported for misleading specifications',
    category: 'products',
    priority: 'high',
    isRead: false,
    timestamp: '2026-03-28T09:15:00Z',
    relativeTime: '45 minutes ago',
    iconVariant: 'product-flagged',
  },
  {
    id: 'notif-004',
    title: 'Return Escalated',
    description: 'Return #RT-4521 escalated by customer Ananya Singh',
    category: 'orders',
    priority: 'high',
    isRead: false,
    timestamp: '2026-03-28T09:00:00Z',
    relativeTime: '1 hour ago',
    iconVariant: 'return-escalated',
  },
  {
    id: 'notif-005',
    title: 'Payment Processed',
    description: '\u20B945,200 settlement transferred to TechMart India',
    category: 'orders',
    priority: 'low',
    isRead: true,
    timestamp: '2026-03-28T08:00:00Z',
    relativeTime: '2 hours ago',
    iconVariant: 'payment',
  },
  {
    id: 'notif-006',
    title: 'System Alert',
    description: 'Database backup completed successfully. Next scheduled: 28 Mar 2:00 AM',
    category: 'system',
    priority: 'low',
    isRead: true,
    timestamp: '2026-03-28T07:00:00Z',
    relativeTime: '3 hours ago',
    iconVariant: 'system-server',
  },
  {
    id: 'notif-007',
    title: 'Seller Verified',
    description: 'GreenLeaf Organics has completed document verification',
    category: 'sellers',
    priority: 'medium',
    isRead: false,
    timestamp: '2026-03-28T06:00:00Z',
    relativeTime: '4 hours ago',
    iconVariant: 'seller-verified',
  },
  {
    id: 'notif-008',
    title: 'Order Cancelled',
    description: 'Order #HB-78190 cancelled by customer. Refund initiated \u20B93,450',
    category: 'orders',
    priority: 'medium',
    isRead: true,
    timestamp: '2026-03-28T05:00:00Z',
    relativeTime: '5 hours ago',
    iconVariant: 'order-cancelled',
  },
  {
    id: 'notif-009',
    title: 'Low Stock Alert',
    description: '"Organic Turmeric Powder 500g" has only 3 units remaining',
    category: 'products',
    priority: 'medium',
    isRead: true,
    timestamp: '2026-03-28T04:00:00Z',
    relativeTime: '6 hours ago',
    iconVariant: 'product-stock',
  },
  {
    id: 'notif-010',
    title: 'Scheduled Maintenance',
    description: 'Planned downtime on 30 Mar, 2:00 AM - 4:00 AM IST',
    category: 'system',
    priority: 'low',
    isRead: true,
    timestamp: '2026-03-27T08:00:00Z',
    relativeTime: 'Yesterday',
    iconVariant: 'system-settings',
  },
];

export const mockNotificationListResponse: NotificationListResponse = {
  notifications: mockNotifications,
  total: 142,
  page: 1,
  pageSize: 10,
  totalPages: 15,
};
