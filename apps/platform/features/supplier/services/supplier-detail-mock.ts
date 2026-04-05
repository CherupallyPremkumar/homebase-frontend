/**
 * Mock data for Seller/Supplier Detail (admin) page.
 *
 * Mirrors the admin/sellers/detail.html prototype.
 */

import type { SellerDetailData } from '../types';

export type { SellerRecentOrder, SellerDetailData } from '../types';

// ----------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------

export const mockSellerDetail: SellerDetailData = {
  id: 'SEL-001',
  storeName: 'Rajesh Store',
  initials: 'RS',
  avatarBg: 'bg-blue-100 text-blue-600',
  status: 'Active',
  statusColor: 'green',
  tier: 'Premium Seller',
  memberSince: 'Jan 2024',
  rating: 4.6,
  productCount: 89,

  category: 'Home & Furniture',
  description: 'Premium home furnishings and decor items. Specializing in handcrafted furniture, artisanal textiles, and contemporary home accessories for modern living spaces.',
  contactEmail: 'rajesh@rajeshstore.in',
  phone: '+91 98765 43210',
  address: '42, MG Road, Koramangala, Bangalore, Karnataka 560034',

  businessName: 'Rajesh Home Furnishings Pvt. Ltd.',
  businessType: 'Private Limited Company',
  gstin: '29ABCDE1234F1Z5',
  gstVerified: true,
  pan: 'ABCDE1234F',
  panVerified: true,
  bankAccount: 'HDFC Bank ****6789',

  totalProducts: 89,
  activeProducts: 72,
  inactiveProducts: 12,
  outOfStock: 5,

  recentOrders: [
    { id: '#HB-10234', customer: 'Ankit Kumar', amount: 12450, status: 'Delivered', statusColor: 'green', date: '27 Mar 2026' },
    { id: '#HB-10228', customer: 'Priya Sharma', amount: 8990, status: 'Shipped', statusColor: 'blue', date: '26 Mar 2026' },
    { id: '#HB-10215', customer: 'Meena Reddy', amount: 24500, status: 'Delivered', statusColor: 'green', date: '25 Mar 2026' },
    { id: '#HB-10201', customer: 'Vikram Patel', amount: 6750, status: 'Processing', statusColor: 'yellow', date: '24 Mar 2026' },
    { id: '#HB-10189', customer: 'Deepa Nair', amount: 15200, status: 'Delivered', statusColor: 'green', date: '22 Mar 2026' },
  ],

  fulfillmentRate: 96.5,
  avgRating: 4.6,
  responseTime: '2.4 hrs',
  returnRate: 3.2,

  revenue: 452890,
  totalOrders: 1234,

  // Health Dashboard
  healthScore: 742,
  healthMaxScore: 1000,
  healthStanding: 'Good Standing',
  healthMetrics: [
    { label: 'Fulfillment Rate', value: '96.4%', numericValue: 96.4, progressPercent: 96.4, status: 'green' },
    { label: 'On-time Dispatch', value: '97.2%', numericValue: 97.2, progressPercent: 97.2, status: 'green' },
    { label: 'Return Rate', value: '3.1%', numericValue: 3.1, progressPercent: 31, status: 'green' },
    { label: 'Response Time', value: '2.4 hrs', numericValue: 2.4, progressPercent: 60, status: 'green' },
  ],

  // Compliance Documents
  complianceDocuments: [
    { name: 'GST Certificate', status: 'verified', statusLabel: 'Verified', detail: 'Expires Dec 2027' },
    { name: 'PAN Card', status: 'verified', statusLabel: 'Verified', detail: 'Permanent' },
    { name: 'Bank Account', status: 'verified', statusLabel: 'Verified', detail: 'Last verified Mar 15, 2026' },
    { name: 'Business License', status: 'pending', statusLabel: 'Pending Renewal', detail: 'Expires in 28 days -- renewal required', highlight: true },
    { name: 'Brand Authorization', status: 'partial', statusLabel: 'Partial', detail: '3 of 4 brands verified' },
  ],
  complianceActionsNeeded: 1,

  // Dispute & Return History
  disputeHistory: {
    totalDisputes: 7,
    inFavor: 4,
    against: 2,
    open: 1,
    returnRate: 3.1,
    returnRateThreshold: 5,
    chargebacks: 0,
  },

  // Performance Trend
  revenueTrend: [
    { month: 'Oct', amount: 1200000, label: '12L' },
    { month: 'Nov', amount: 1500000, label: '15L' },
    { month: 'Dec', amount: 2200000, label: '22L', isPeak: true },
    { month: 'Jan', amount: 1400000, label: '14L' },
    { month: 'Feb', amount: 1600000, label: '16L' },
    { month: 'Mar', amount: 1800000, label: '18L' },
  ],
  revenueTrendTotal: '97L',
  revenueTrendAvg: '16.2L',
  revenueTrendGrowth: '+12.5%',

  compliance: {
    gst: true,
    pan: true,
    bank: true,
    documents: '5/5',
    overall: 'Compliant',
  },

  moderationHistory: [
    { event: 'Approved', actor: 'Super Admin', date: '20 Jan 2024, 11:00 AM', color: 'bg-green-500' },
    { event: 'Under Review', actor: '', date: '18 Jan 2024, 2:30 PM', color: 'bg-blue-500' },
    { event: 'Joined', actor: '', date: '15 Jan 2024, 9:00 AM', color: 'bg-gray-300' },
  ],
};
