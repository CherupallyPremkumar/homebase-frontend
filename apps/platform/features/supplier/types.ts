/**
 * Types for the Supplier/Seller feature.
 *
 * Re-exports shared types and defines admin-specific interfaces.
 */

export type { Supplier as SharedSupplier, SupplierOnboarding, SearchRequest, SearchResponse } from '@homebase/types';

// ----------------------------------------------------------------
// Supplier List types
// ----------------------------------------------------------------

export type SupplierStatus = 'Active' | 'Pending' | 'Suspended' | 'Inactive';

export type ComplianceStatus = 'ok' | 'warning' | 'violation' | 'review';

export interface Supplier {
  id: number;
  initials: string;
  gradient: string;
  name: string;
  email: string;
  store: string;
  healthScore: number;
  products: number;
  orders: string;
  revenue: string;
  rating: number;
  fulfillmentPct: number;
  disputes: number;
  compliance: ComplianceStatus;
  status: SupplierStatus;
  joined: string;
}

export interface SupplierStats {
  totalSellers: { value: string; trend: number; trendDirection: 'up' | 'down' };
  active: { value: string; subtitle: string };
  pendingApproval: { value: string; subtitle: string };
  suspended: { value: string; subtitle: string };
  inactive: { value: string; subtitle: string };
}

export interface SupplierSecondaryStats {
  totalGmv: { value: string; trend: string };
  avgRating: { value: string; subtitle: string };
  complianceIssues: { value: string; subtitle: string };
  pendingPayouts: { value: string; subtitle: string };
}

export interface SupplierTab {
  key: string;
  label: string;
  count: string;
}

export interface SupplierListResponse {
  suppliers: Supplier[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SupplierListFilters {
  search: string;
  status: string;
  page: number;
  pageSize: number;
}

// ----------------------------------------------------------------
// Seller Detail types
// ----------------------------------------------------------------

export interface SellerRecentOrder {
  id: string;
  customer: string;
  amount: number;
  status: string;
  statusColor: string;
  date: string;
}

export interface SellerHealthMetric {
  label: string;
  value: string;
  numericValue: number;
  progressPercent: number;
  status: 'green' | 'yellow' | 'red';
}

export interface SellerComplianceDocument {
  name: string;
  status: 'verified' | 'pending' | 'partial';
  statusLabel: string;
  detail: string;
  highlight?: boolean;
}

export interface SellerDisputeHistory {
  totalDisputes: number;
  inFavor: number;
  against: number;
  open: number;
  returnRate: number;
  returnRateThreshold: number;
  chargebacks: number;
}

export interface SellerRevenueTrend {
  month: string;
  amount: number;
  label: string;
  isPeak?: boolean;
}

export interface SellerDetailData {
  id: string;
  storeName: string;
  initials: string;
  avatarBg: string;
  status: string;
  statusColor: string;
  tier: string;
  memberSince: string;
  rating: number;
  productCount: number;

  category: string;
  description: string;
  contactEmail: string;
  phone: string;
  address: string;

  businessName: string;
  businessType: string;
  gstin: string;
  gstVerified: boolean;
  pan: string;
  panVerified: boolean;
  bankAccount: string;

  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  outOfStock: number;

  recentOrders: SellerRecentOrder[];

  fulfillmentRate: number;
  avgRating: number;
  responseTime: string;
  returnRate: number;

  revenue: number;
  totalOrders: number;

  // Health Dashboard
  healthScore: number;
  healthMaxScore: number;
  healthStanding: string;
  healthMetrics: SellerHealthMetric[];

  // Compliance Documents
  complianceDocuments: SellerComplianceDocument[];
  complianceActionsNeeded: number;

  // Dispute & Return History
  disputeHistory: SellerDisputeHistory;

  // Performance Trend (revenue chart)
  revenueTrend: SellerRevenueTrend[];
  revenueTrendTotal: string;
  revenueTrendAvg: string;
  revenueTrendGrowth: string;

  compliance: {
    gst: boolean;
    pan: boolean;
    bank: boolean;
    documents: string;
    overall: string;
  };

  moderationHistory: {
    event: string;
    actor: string;
    date: string;
    color: string;
  }[];
}
