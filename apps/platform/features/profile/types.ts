/**
 * Types for the Admin Profile feature.
 */

export interface AdminProfileData {
  fullName: string;
  initials: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  location: string;
  lastLogin: string;
  lastLoginIp: string;
  memberSince: string;
  role: string;
  accessLevel: string;
  permissions: string[];
}

export interface SecuritySettings {
  passwordLastChanged: string;
  twoFactorEnabled: boolean;
  twoFactorMethod: string;
  recoveryEmail: string;
  recoveryPhone: string;
  activeSessions: number;
  apiKeys: number;
}

export interface TrustedDevice {
  id: string;
  name: string;
  location: string;
  addedDate: string;
  type: 'desktop' | 'mobile';
}

export interface ActivityTimelineEntry {
  id: string;
  description: string;
  highlight: string;
  category: string;
  time: string;
  color: 'green' | 'blue' | 'orange' | 'red' | 'purple' | 'yellow' | 'indigo' | 'teal';
}

export interface NotificationPreferences {
  email: { label: string; enabled: boolean }[];
  channels: { label: string; description: string; enabled: boolean }[];
  digest: { label: string; description: string; enabled: boolean }[];
}

export interface DisplayPreferences {
  theme: 'light' | 'dark' | 'auto';
  dashboardView: string;
  timezone: string;
  language: string;
  dateFormat: string;
  itemsPerPage: number;
}

export interface LoginHistoryEntry {
  id: string;
  device: string;
  deviceType: 'desktop' | 'mobile';
  browser: string;
  ip: string;
  location: string;
  status: 'current' | 'success' | 'failed';
  time: string;
}

export interface DelegatedAccessEntry {
  id: string;
  person: string;
  initials: string;
  avatarColor: string;
  role: string;
  scope: string;
  expires: string;
  status: 'active' | 'expired';
}

export interface ProfilePageResponse {
  profile: AdminProfileData;
  security: SecuritySettings;
  trustedDevices: TrustedDevice[];
  activityTimeline: ActivityTimelineEntry[];
  notifications: NotificationPreferences;
  display: DisplayPreferences;
  loginHistory: LoginHistoryEntry[];
  delegatedAccess: DelegatedAccessEntry[];
}
