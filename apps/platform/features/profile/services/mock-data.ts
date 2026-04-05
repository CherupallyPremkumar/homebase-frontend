/**
 * Mock data for the Admin Profile page.
 *
 * Each export matches the shape returned by the real API contract.
 * When backend endpoints are ready, swap the mock imports in
 * queries.ts for real fetch calls -- no component changes needed.
 */

import type {
  AdminProfileData,
  SecuritySettings,
  TrustedDevice,
  ActivityTimelineEntry,
  NotificationPreferences,
  DisplayPreferences,
  LoginHistoryEntry,
  DelegatedAccessEntry,
  ProfilePageResponse,
} from '../types';

// ----------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------

export const mockAdminProfile: AdminProfileData = {
  fullName: 'Super Admin',
  initials: 'SA',
  email: 'admin@homebase.com',
  emailVerified: true,
  phone: '+91 98765 43210',
  phoneVerified: true,
  location: 'Mumbai, Maharashtra, India',
  lastLogin: 'Today, 8:00 AM from 192.168.1.45',
  lastLoginIp: '192.168.1.45',
  memberSince: 'Jan 2024',
  role: 'Platform Admin',
  accessLevel: 'Full Access',
  permissions: [
    'Manage Sellers',
    'Manage Products',
    'Manage Orders',
    'Manage Users',
    'View Analytics',
    'Manage CMS',
    'Process Refunds',
    'System Settings',
  ],
};

export const mockSecuritySettings: SecuritySettings = {
  passwordLastChanged: '15 days ago',
  twoFactorEnabled: true,
  twoFactorMethod: 'Authenticator app enabled',
  recoveryEmail: 's****n@gmail.com',
  recoveryPhone: '+91 *****67890',
  activeSessions: 2,
  apiKeys: 2,
};

export const mockTrustedDevices: TrustedDevice[] = [
  {
    id: 'dev-001',
    name: 'MacBook Pro - Chrome',
    location: 'Mumbai, India',
    addedDate: '15 Jan 2024',
    type: 'desktop',
  },
  {
    id: 'dev-002',
    name: 'iPhone 15 Pro - Safari',
    location: 'Mumbai, India',
    addedDate: '20 Feb 2024',
    type: 'mobile',
  },
];

export const mockActivityTimeline: ActivityTimelineEntry[] = [
  {
    id: 'act-001',
    description: 'Approved seller',
    highlight: "'Sharma Electronics'",
    category: 'Seller Onboarding',
    time: '8:15 AM',
    color: 'green',
  },
  {
    id: 'act-002',
    description: 'Updated commission rate for',
    highlight: 'Power Tools',
    category: 'Commission Settings',
    time: '8:42 AM',
    color: 'blue',
  },
  {
    id: 'act-003',
    description: 'Processed settlement batch',
    highlight: '#STL-2026-0328',
    category: 'Finance / Settlements',
    time: '9:00 AM',
    color: 'orange',
  },
  {
    id: 'act-004',
    description: "Suspended product",
    highlight: "'Premium LED Panel'",
    category: 'Product Moderation',
    time: '9:30 AM',
    color: 'red',
  },
  {
    id: 'act-005',
    description: 'Generated',
    highlight: 'monthly revenue report',
    category: 'Analytics / Reports',
    time: '10:15 AM',
    color: 'purple',
  },
  {
    id: 'act-006',
    description: 'Reviewed',
    highlight: '3 dispute cases',
    category: 'Order Disputes',
    time: '11:00 AM',
    color: 'yellow',
  },
  {
    id: 'act-007',
    description: 'Updated shipping rate for',
    highlight: 'NE India zone',
    category: 'Shipping / Zone Configuration',
    time: '11:30 AM',
    color: 'indigo',
  },
  {
    id: 'act-008',
    description: 'Responded to support escalation',
    highlight: '#ESC-4521',
    category: 'Customer Support',
    time: '12:00 PM',
    color: 'teal',
  },
];

export const mockNotificationPreferences: NotificationPreferences = {
  email: [
    { label: 'Orders & Fulfillment', enabled: true },
    { label: 'Seller Activity', enabled: true },
    { label: 'Finance & Settlements', enabled: true },
    { label: 'System Alerts', enabled: true },
    { label: 'Security Events', enabled: true },
  ],
  channels: [
    { label: 'SMS Alerts', description: 'Critical incidents only', enabled: true },
    { label: 'Push Notifications', description: 'Browser and mobile', enabled: true },
  ],
  digest: [
    { label: 'Daily Digest Email', description: 'Sent at 8:00 AM IST', enabled: true },
    { label: 'Weekly Summary Report', description: 'Every Monday at 9:00 AM IST', enabled: true },
  ],
};

export const mockDisplayPreferences: DisplayPreferences = {
  theme: 'light',
  dashboardView: 'Platform Overview',
  timezone: 'Asia/Kolkata (IST +5:30)',
  language: 'English',
  dateFormat: 'DD/MM/YYYY',
  itemsPerPage: 25,
};

export const mockLoginHistory: LoginHistoryEntry[] = [
  {
    id: 'login-001',
    device: 'MacBook Pro',
    deviceType: 'desktop',
    browser: 'Chrome 124',
    ip: '192.168.1.45',
    location: 'Mumbai, MH',
    status: 'current',
    time: '2 Apr 2026, 8:00 AM',
  },
  {
    id: 'login-002',
    device: 'MacBook Pro',
    deviceType: 'desktop',
    browser: 'Chrome 124',
    ip: '192.168.1.45',
    location: 'Mumbai, MH',
    status: 'success',
    time: '1 Apr 2026, 9:15 AM',
  },
  {
    id: 'login-003',
    device: 'iPhone 15 Pro',
    deviceType: 'mobile',
    browser: 'Safari 18',
    ip: '103.45.67.89',
    location: 'Delhi, DL',
    status: 'success',
    time: '31 Mar 2026, 6:30 PM',
  },
  {
    id: 'login-004',
    device: 'Unknown Device',
    deviceType: 'desktop',
    browser: 'Firefox 128',
    ip: '45.112.89.201',
    location: 'Hyderabad, TS',
    status: 'failed',
    time: '30 Mar 2026, 2:45 AM',
  },
  {
    id: 'login-005',
    device: 'MacBook Pro',
    deviceType: 'desktop',
    browser: 'Chrome 124',
    ip: '192.168.1.45',
    location: 'Mumbai, MH',
    status: 'success',
    time: '29 Mar 2026, 8:30 AM',
  },
];

export const mockDelegatedAccess: DelegatedAccessEntry[] = [
  {
    id: 'del-001',
    person: 'Priya Deshmukh',
    initials: 'PD',
    avatarColor: 'purple',
    role: 'Finance Lead',
    scope: 'Full Finance Access',
    expires: '10 Apr 2026',
    status: 'active',
  },
  {
    id: 'del-002',
    person: 'Rajesh Kumar',
    initials: 'RK',
    avatarColor: 'teal',
    role: 'Ops Manager',
    scope: 'Orders + Fulfillment',
    expires: '5 Apr 2026',
    status: 'active',
  },
  {
    id: 'del-003',
    person: 'Anita Sharma',
    initials: 'AS',
    avatarColor: 'gray',
    role: 'Support Lead',
    scope: 'Seller Management',
    expires: '28 Mar 2026',
    status: 'expired',
  },
];

export const mockProfilePage: ProfilePageResponse = {
  profile: mockAdminProfile,
  security: mockSecuritySettings,
  trustedDevices: mockTrustedDevices,
  activityTimeline: mockActivityTimeline,
  notifications: mockNotificationPreferences,
  display: mockDisplayPreferences,
  loginHistory: mockLoginHistory,
  delegatedAccess: mockDelegatedAccess,
};
