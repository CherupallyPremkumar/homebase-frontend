/**
 * Types for the User Management feature.
 *
 * Re-exports shared types and defines admin-specific interfaces.
 */

export type { User as SharedUser, SearchRequest, SearchResponse } from '@homebase/types';

// ----------------------------------------------------------------
// User List types
// ----------------------------------------------------------------

export type UserStatus = 'Active' | 'Suspended' | 'Inactive';
export type UserRole = 'Customer' | 'Seller' | 'Admin';

export interface User {
  id: number;
  initials: string;
  gradient: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  orders: number;
  spent: string;
  status: UserStatus;
  joined: string;
  lastActive: string;
}

export interface UserStats {
  totalUsers: { value: string; trend: number; trendDirection: 'up' | 'down' };
  activeUsers: { value: string; trend: number; trendDirection: 'up' | 'down' };
  newThisMonth: { value: string; trend: number; trendDirection: 'up' | 'down' };
  suspended: { value: string; trend: number; trendDirection: 'down' | 'up' };
}

export interface UserTab {
  key: string;
  label: string;
  count: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UserListFilters {
  search: string;
  status: string;
  role: string;
  page: number;
  pageSize: number;
}

// ----------------------------------------------------------------
// User Detail types
// ----------------------------------------------------------------

export interface UserOrderEntry {
  id: string;
  items: string;
  amount: number;
  status: string;
  statusColor: string;
  date: string;
}

export interface UserActivityEntry {
  event: string;
  iconBg: string;
  iconType: 'login' | 'order' | 'review' | 'return';
  detail: string;
  date: string;
}

export interface UserAddress {
  type: string;
  typeBg: string;
  isDefault: boolean;
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface UserDetailData {
  id: string;
  firstName: string;
  lastName: string;
  initials: string;
  avatarBg: string;
  status: string;
  statusColor: string;
  email: string;
  phone: string;
  memberSince: string;
  role: string;

  dob: string;
  gender: string;
  language: string;

  orders: UserOrderEntry[];
  activities: UserActivityEntry[];
  addresses: UserAddress[];

  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  reviewsWritten: number;

  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
}
