/**
 * Mock data for Return Detail (admin) page.
 *
 * Mirrors the admin/orders/return-detail.html prototype.
 */

import type { ReturnDetailData } from '../types';

export type {
  ReturnTimelineStepStatus,
  ReturnTimelineStep,
  ReturnItem,
  ReturnRefundBreakdown,
  ReturnPolicyCheck,
  ReturnEvidence,
  ReturnDetailData,
} from '../types';

// ----------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------

export const mockReturnDetail: ReturnDetailData = {
  id: 'RET-00456',
  status: 'Pickup Scheduled',
  statusColor: 'yellow',

  timeline: [
    { label: 'Return Requested', date: '22 Mar 2026, 11:00 AM', actor: 'By customer', status: 'completed' },
    { label: 'Approved', date: '23 Mar 2026, 9:30 AM', actor: 'By Super Admin', status: 'completed' },
    { label: 'Pickup Scheduled', date: 'Scheduled for 29 Mar 2026', actor: null, status: 'current' },
    { label: 'Received at Warehouse', date: null, actor: null, status: 'pending' },
    { label: 'Refunded', date: null, actor: null, status: 'pending' },
  ],

  items: [
    {
      id: 'PRD-00142',
      name: 'Modern Velvet Sofa',
      sku: 'HB-FUR-00142',
      emoji: '\uD83D\uDECB',
      qty: 1,
      price: 129900,
      reason: 'Product damaged on delivery',
      condition: 'Damaged - Tear on left arm',
    },
  ],

  originalOrder: {
    id: '#HB-10234',
    placedDate: '25 Mar 2026',
    deliveredDate: '27 Mar 2026',
    amount: 146429,
    status: 'Delivered',
    statusColor: 'green',
  },

  refund: {
    itemValue: 129900,
    shippingRefund: 0,
    shippingLabel: 'Free shipping',
    discountAdjustment: 12990,
    totalRefund: 116910,
    refundMethod: 'Original Payment (UPI)',
  },

  customerComment: 'The sofa arrived with a noticeable tear on the left armrest. The packaging seemed fine from the outside but the damage was clearly there when I unpacked it. I\'ve attached photos showing the tear and the condition of the packaging.',
  commentDate: '22 Mar 2026, 11:00 AM',
  evidence: [
    { filename: 'damage_1.jpg' },
    { filename: 'damage_2.jpg' },
    { filename: 'packaging.jpg' },
  ],

  customer: {
    id: 'USR-001',
    name: 'Ankit Kumar',
    initials: 'AK',
    avatarBg: 'bg-purple-100 text-purple-600',
    email: 'ankit.kumar@email.com',
    phone: '+91 99876 54321',
    totalReturns: 2,
  },

  seller: {
    id: 'SEL-001',
    name: 'Rajesh Store',
    initials: 'RS',
    avatarBg: 'bg-blue-100 text-blue-600',
    tier: 'Premium Seller',
    responseStatus: 'Accepted',
    responseStatusColor: 'green',
    responseDate: '22 Mar 2026, 3:00 PM',
  },

  policyChecks: [
    { label: 'Within 30 days', passed: true, detail: 'Yes (5 days)' },
    { label: 'Product unused', passed: true, detail: 'Yes' },
    { label: 'Original packaging', passed: true, detail: 'Yes' },
    { label: 'Evidence provided', passed: true, detail: '3 photos' },
    { label: 'Returnable category', passed: true, detail: 'Yes' },
  ],
  policyVerdict: 'Eligible',
  policyVerdictColor: 'green',

  pickup: {
    scheduledDate: '29 Mar 2026',
    timeSlot: '10:00 AM - 1:00 PM',
    carrier: 'Delhivery Express',
    address: 'Flat 402, Prestige Towers, MG Road, Koramangala, Bangalore 560034',
  },
};
