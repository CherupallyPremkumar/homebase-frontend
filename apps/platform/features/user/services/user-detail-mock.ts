/**
 * Mock data for User Detail (admin) page.
 *
 * Mirrors the admin/users/detail.html prototype.
 */

import type { UserDetailData } from '../types';

export type {
  UserOrderEntry,
  UserActivityEntry,
  UserAddress,
  UserDetailData,
} from '../types';

// ----------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------

export const mockUserDetail: UserDetailData = {
  id: 'USR-001',
  firstName: 'Ankit',
  lastName: 'Kumar',
  initials: 'AK',
  avatarBg: 'bg-purple-100 text-purple-600',
  status: 'Active',
  statusColor: 'green',
  email: 'ankit.kumar@email.com',
  phone: '+91 99876 54321',
  memberSince: 'Feb 2024',
  role: 'Customer',

  dob: '15 Aug 1992',
  gender: 'Male',
  language: 'English, Hindi',

  orders: [
    { id: '#HB-10234', items: 'Modern Velvet Sofa + 1 more', amount: 146429, status: 'Shipped', statusColor: 'blue', date: '25 Mar 2026' },
    { id: '#HB-10198', items: 'Cotton Bed Sheet Set', amount: 3490, status: 'Delivered', statusColor: 'green', date: '18 Mar 2026' },
    { id: '#HB-10145', items: 'Ceramic Dining Set (6-piece)', amount: 8999, status: 'Delivered', statusColor: 'green', date: '05 Mar 2026' },
    { id: '#HB-10089', items: 'Wall Art Canvas (3-pack)', amount: 4250, status: 'Delivered', statusColor: 'green', date: '22 Feb 2026' },
    { id: '#HB-10052', items: 'Wooden Bookshelf', amount: 12500, status: 'Delivered', statusColor: 'green', date: '10 Feb 2026' },
  ],

  activities: [
    { event: 'Logged in from Chrome / macOS', iconBg: 'bg-green-50', iconType: 'login', detail: 'IP: 103.xx.xx.45', date: '28 Mar 2026, 9:15 AM' },
    { event: 'Placed order #HB-10234', iconBg: 'bg-orange-50', iconType: 'order', detail: '', date: '25 Mar 2026, 10:30 AM' },
    { event: 'Wrote review for "Cotton Bed Sheet Set" - 5 stars', iconBg: 'bg-yellow-50', iconType: 'review', detail: '', date: '20 Mar 2026, 4:45 PM' },
    { event: 'Initiated return for order #HB-10098', iconBg: 'bg-red-50', iconType: 'return', detail: '', date: '15 Mar 2026, 11:00 AM' },
    { event: 'Logged in from Safari / iPhone', iconBg: 'bg-green-50', iconType: 'login', detail: 'IP: 103.xx.xx.45', date: '14 Mar 2026, 8:30 PM' },
  ],

  addresses: [
    {
      type: 'Home',
      typeBg: 'bg-orange-50 text-orange-700',
      isDefault: true,
      name: 'Ankit Kumar',
      line1: 'Flat 402, Prestige Towers',
      line2: 'MG Road, Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
      phone: '+91 99876 54321',
    },
    {
      type: 'Office',
      typeBg: 'bg-blue-50 text-blue-700',
      isDefault: false,
      name: 'Ankit Kumar',
      line1: 'Floor 3, TechPark One',
      line2: 'Whitefield Main Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560066',
      phone: '+91 99876 54321',
    },
  ],

  totalOrders: 23,
  totalSpent: 284560,
  avgOrderValue: 12372,
  reviewsWritten: 8,

  emailVerified: true,
  phoneVerified: true,
  twoFactorEnabled: false,
};
