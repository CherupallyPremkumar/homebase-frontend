/**
 * Mock data for the Support Center page.
 *
 * Each export matches the shape returned by the real API contract.
 * When backend endpoints are ready, swap the mock imports in
 * queries.ts for real fetch calls -- no component changes needed.
 */

import type {
  SupportTicket,
  SupportStats,
  SupportTab,
  KnowledgeBaseArticle,
  SupportListResponse,
} from '../types';

export type {
  TicketStatus,
  TicketPriority,
  TicketType,
  SupportTicket,
  SupportStats,
  SupportTab,
  KnowledgeBaseArticle,
  SupportListResponse,
} from '../types';

// ----------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------

export const mockSupportStats: SupportStats = {
  open: 12,
  escalated: 4,
  avgResponseHrs: 2.1,
  slaBreach: 2,
};

export const mockSupportTabs: SupportTab[] = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'escalated', label: 'Escalated' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'closed', label: 'Closed' },
];

export const mockTickets: SupportTicket[] = [
  {
    id: '#TK-1201',
    customerName: 'Ananya Singh',
    type: 'Customer',
    subject: 'Order not delivered after 10 days',
    priority: 'High',
    status: 'Escalated',
    assignedTo: 'Rahul K.',
    date: '27 Mar 2026',
  },
  {
    id: '#TK-1200',
    customerName: 'TechMart India',
    type: 'Seller',
    subject: 'Settlement amount mismatch for March',
    priority: 'High',
    status: 'Open',
    assignedTo: 'Priya M.',
    date: '27 Mar 2026',
  },
  {
    id: '#TK-1199',
    customerName: 'Rohit Mehra',
    type: 'Customer',
    subject: 'Refund not received for return #RT-4510',
    priority: 'High',
    status: 'Escalated',
    assignedTo: 'Rahul K.',
    date: '26 Mar 2026',
  },
  {
    id: '#TK-1198',
    customerName: 'GreenLeaf Organics',
    type: 'Seller',
    subject: 'Unable to upload product images',
    priority: 'Medium',
    status: 'Open',
    assignedTo: 'Vikram S.',
    date: '26 Mar 2026',
  },
  {
    id: '#TK-1197',
    customerName: 'Deepika Nair',
    type: 'Customer',
    subject: 'Wrong product delivered, need exchange',
    priority: 'Medium',
    status: 'Open',
    assignedTo: 'Priya M.',
    date: '25 Mar 2026',
  },
  {
    id: '#TK-1196',
    customerName: 'Sharma Electronics',
    type: 'Seller',
    subject: 'Commission rate clarification needed',
    priority: 'Low',
    status: 'Resolved',
    assignedTo: 'Vikram S.',
    date: '24 Mar 2026',
  },
  {
    id: '#TK-1195',
    customerName: 'Kavita Patel',
    type: 'Customer',
    subject: 'Unable to apply coupon code SAVE20',
    priority: 'Low',
    status: 'Closed',
    assignedTo: 'Priya M.',
    date: '23 Mar 2026',
  },
  {
    id: '#TK-1194',
    customerName: 'Priya Enterprises',
    type: 'Seller',
    subject: 'Request to update bank account details',
    priority: 'Medium',
    status: 'Closed',
    assignedTo: 'Rahul K.',
    date: '22 Mar 2026',
  },
];

export const mockKnowledgeBase: KnowledgeBaseArticle[] = [
  { id: 'kb-1', category: 'Orders', categoryColor: 'bg-blue-100 text-blue-700', title: 'How to Track Your Order', views: 1245 },
  { id: 'kb-2', category: 'Returns', categoryColor: 'bg-yellow-100 text-yellow-700', title: 'Return & Refund Policy', views: 987 },
  { id: 'kb-3', category: 'Sellers', categoryColor: 'bg-green-100 text-green-700', title: 'Seller Onboarding Guide', views: 654 },
  { id: 'kb-4', category: 'Payments', categoryColor: 'bg-purple-100 text-purple-700', title: 'Payment Methods & FAQ', views: 432 },
];

export const mockSupportListResponse: SupportListResponse = {
  tickets: mockTickets,
  total: 48,
  page: 1,
  pageSize: 8,
  totalPages: 6,
};
