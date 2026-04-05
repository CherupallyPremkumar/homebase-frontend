/**
 * Mock data for the Order Management list page.
 *
 * Each export matches the shape returned by the real API contract.
 * When backend endpoints are ready, swap the mock imports in
 * queries.ts for real fetch calls -- no component changes needed.
 */

import type { Order, OrderStats, OrderTab, OrderListResponse } from '../types';

export type {
  OrderStatus,
  PaymentMethod,
  Order,
  OrderStats,
  OrderTab,
  OrderListResponse,
} from '../types';

// ----------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------

export const mockOrderStats: OrderStats = {
  totalOrders: { value: '12,450', trend: 12.5, trendDirection: 'up' },
  pending: { value: '234', trend: 8.2, trendDirection: 'up' },
  processing: { value: '567', trend: 3.1, trendDirection: 'down' },
  shipped: { value: '1,890', trend: 5.7, trendDirection: 'up' },
  delivered: { value: '9,200', trend: 15.3, trendDirection: 'up' },
  cancelled: { value: '559', trend: 2.1, trendDirection: 'up' },
};

export const mockOrderTabs: OrderTab[] = [
  { key: 'all', label: 'All Orders', count: '12,450' },
  { key: 'pending', label: 'Pending', count: '234' },
  { key: 'processing', label: 'Processing', count: '567' },
  { key: 'shipped', label: 'Shipped', count: '1,890' },
  { key: 'delivered', label: 'Delivered', count: '9,200' },
  { key: 'cancelled', label: 'Cancelled', count: '559' },
  { key: 'disputes', label: 'Disputes', count: '8', badgeClass: 'bg-red-100 text-red-600' },
];

export const mockOrders: Order[] = [
  {
    id: '#HB-10234',
    initials: 'AM',
    avatarBg: 'bg-blue-100 text-blue-700',
    customer: 'Arun Mehta',
    email: 'arun.mehta@email.com',
    seller: 'Rajesh Store',
    product: 'iPhone 15 Pro Max',
    items: '1 item',
    amount: '\u20B91,34,999',
    payment: 'UPI',
    status: 'Delivered',
    date: 'Mar 25, 2026',
  },
  {
    id: '#HB-10233',
    initials: 'PK',
    avatarBg: 'bg-purple-100 text-purple-700',
    customer: 'Priya Kumar',
    email: 'priya.kumar@email.com',
    seller: 'Anita Fashion',
    product: 'Designer Silk Saree',
    items: '2 items',
    amount: '\u20B918,500',
    payment: 'Card',
    status: 'Shipped',
    date: 'Mar 26, 2026',
  },
  {
    id: '#HB-10232',
    initials: 'RG',
    avatarBg: 'bg-green-100 text-green-700',
    customer: 'Rahul Gupta',
    email: 'rahul.g@email.com',
    seller: 'TechWorld',
    product: 'Samsung Galaxy S24',
    items: '1 item',
    amount: '\u20B979,999',
    payment: 'EMI',
    status: 'Processing',
    date: 'Mar 27, 2026',
  },
  {
    id: '#HB-10231',
    initials: 'SK',
    avatarBg: 'bg-amber-100 text-amber-700',
    customer: 'Sneha Krishnan',
    email: 'sneha.k@email.com',
    seller: 'Krishna Home',
    product: 'Wooden Dining Table',
    items: '1 item',
    amount: '\u20B945,000',
    payment: 'UPI',
    status: 'Pending',
    date: 'Mar 28, 2026',
  },
  {
    id: '#HB-10230',
    initials: 'VR',
    avatarBg: 'bg-red-100 text-red-700',
    customer: 'Vikram Rao',
    email: 'vikram.r@email.com',
    seller: 'ToolMaster Pro',
    product: 'Cordless Drill + Bits Set',
    items: '3 items',
    amount: '\u20B912,450',
    payment: 'Card',
    status: 'Delivered',
    date: 'Mar 24, 2026',
  },
  {
    id: '#HB-10229',
    initials: 'NP',
    avatarBg: 'bg-teal-100 text-teal-700',
    customer: 'Neha Patel',
    email: 'neha.p@email.com',
    seller: 'BrightLite',
    product: 'LED Panel Lights 4-Pack',
    items: '4 items',
    amount: '\u20B96,800',
    payment: 'COD',
    status: 'Cancelled',
    date: 'Mar 23, 2026',
  },
  {
    id: '#HB-10228',
    initials: 'MJ',
    avatarBg: 'bg-indigo-100 text-indigo-700',
    customer: 'Manish Jain',
    email: 'manish.j@email.com',
    seller: 'Patel Lighting',
    product: 'Chandelier Crystal 12-Arm',
    items: '1 item',
    amount: '\u20B928,900',
    payment: 'UPI',
    status: 'Shipped',
    date: 'Mar 25, 2026',
  },
  {
    id: '#HB-10227',
    initials: 'DS',
    avatarBg: 'bg-pink-100 text-pink-700',
    customer: 'Deepa Singh',
    email: 'deepa.s@email.com',
    seller: 'GreenEarth',
    product: 'Premium Garden Tool Set',
    items: '2 items',
    amount: '\u20B94,250',
    payment: 'Card',
    status: 'Delivered',
    date: 'Mar 22, 2026',
  },
];

export const mockOrderListResponse: OrderListResponse = {
  orders: mockOrders,
  total: 12_450,
  page: 1,
  pageSize: 8,
  totalPages: 1557,
};
