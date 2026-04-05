/**
 * Mock data for the User Management list page.
 *
 * Each export matches the shape returned by the real API contract.
 * When backend endpoints are ready, swap the mock imports in
 * queries.ts for real fetch calls -- no component changes needed.
 */

import type { User, UserStats, UserTab, UserListResponse } from '../types';

export type {
  UserStatus,
  UserRole,
  User,
  UserStats,
  UserTab,
  UserListResponse,
} from '../types';

// ----------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------

export const mockUserStats: UserStats = {
  totalUsers: { value: '45,890', trend: 12.5, trendDirection: 'up' },
  activeUsers: { value: '38,450', trend: 8.2, trendDirection: 'up' },
  newThisMonth: { value: '1,234', trend: 15.3, trendDirection: 'up' },
  suspended: { value: '89', trend: 3.1, trendDirection: 'down' },
};

export const mockUserTabs: UserTab[] = [
  { key: 'all', label: 'All Users', count: '45,890' },
  { key: 'active', label: 'Active', count: '38,450' },
  { key: 'new', label: 'New (30d)', count: '1,234' },
  { key: 'suspended', label: 'Suspended', count: '89' },
  { key: 'inactive', label: 'Inactive', count: '6,117' },
];

export const mockUsers: User[] = [
  {
    id: 1,
    initials: 'AP',
    gradient: 'from-violet-400 to-violet-600',
    name: 'Ananya Patel',
    email: 'ananya.patel@gmail.com',
    phone: '+91 98765 43210',
    role: 'Customer',
    orders: 156,
    spent: '$12,450.00',
    status: 'Active',
    joined: 'Jan 15, 2024',
    lastActive: '2 hours ago',
  },
  {
    id: 2,
    initials: 'RK',
    gradient: 'from-blue-400 to-blue-600',
    name: 'Rahul Kumar',
    email: 'rahul.kumar@yahoo.com',
    phone: '+91 87654 32109',
    role: 'Customer',
    orders: 89,
    spent: '$7,832.50',
    status: 'Active',
    joined: 'Mar 22, 2024',
    lastActive: '5 mins ago',
  },
  {
    id: 3,
    initials: 'SM',
    gradient: 'from-rose-400 to-rose-600',
    name: 'Sneha Mehta',
    email: 'sneha.mehta@outlook.com',
    phone: '+91 76543 21098',
    role: 'Customer',
    orders: 234,
    spent: '$18,920.75',
    status: 'Suspended',
    joined: 'Nov 8, 2023',
    lastActive: '3 days ago',
  },
  {
    id: 4,
    initials: 'VR',
    gradient: 'from-emerald-400 to-emerald-600',
    name: 'Vikram Reddy',
    email: 'vikram.reddy@gmail.com',
    phone: '+91 65432 10987',
    role: 'Customer',
    orders: 42,
    spent: '$3,215.30',
    status: 'Active',
    joined: 'Jul 3, 2024',
    lastActive: '1 hour ago',
  },
  {
    id: 5,
    initials: 'PN',
    gradient: 'from-amber-400 to-amber-600',
    name: 'Priya Nair',
    email: 'priya.nair@hotmail.com',
    phone: '+91 54321 09876',
    role: 'Customer',
    orders: 8,
    spent: '$542.00',
    status: 'Inactive',
    joined: 'Sep 19, 2024',
    lastActive: '45 days ago',
  },
  {
    id: 6,
    initials: 'AS',
    gradient: 'from-cyan-400 to-cyan-600',
    name: 'Arjun Singh',
    email: 'arjun.singh@gmail.com',
    phone: '+91 43210 98765',
    role: 'Customer',
    orders: 312,
    spent: '$24,680.90',
    status: 'Active',
    joined: 'Feb 28, 2023',
    lastActive: 'Just now',
  },
  {
    id: 7,
    initials: 'DG',
    gradient: 'from-pink-400 to-pink-600',
    name: 'Deepika Gupta',
    email: 'deepika.gupta@gmail.com',
    phone: '+91 32109 87654',
    role: 'Customer',
    orders: 67,
    spent: '$5,430.25',
    status: 'Active',
    joined: 'May 14, 2024',
    lastActive: '12 hours ago',
  },
  {
    id: 8,
    initials: 'MJ',
    gradient: 'from-indigo-400 to-indigo-600',
    name: 'Mohammed Jabbar',
    email: 'm.jabbar@protonmail.com',
    phone: '+91 21098 76543',
    role: 'Customer',
    orders: 3,
    spent: '$189.50',
    status: 'Inactive',
    joined: 'Dec 1, 2024',
    lastActive: '62 days ago',
  },
];

export const mockUserListResponse: UserListResponse = {
  users: mockUsers,
  total: 45_890,
  page: 1,
  pageSize: 8,
  totalPages: 5737,
};
