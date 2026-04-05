/**
 * Types for the Product feature.
 *
 * Re-exports shared types and defines admin-specific interfaces.
 */

export type { Product as SharedProduct, ProductVariant, SearchRequest, SearchResponse } from '@homebase/types';

// ----------------------------------------------------------------
// Product List types
// ----------------------------------------------------------------

export type ProductStatus = 'Active' | 'Pending' | 'Flagged' | 'Removed';

export interface Product {
  id: number;
  name: string;
  sku: string;
  emoji: string;
  emojiBg: string;
  seller: string;
  category: string;
  price: string;
  stock: number;
  status: ProductStatus;
  date: string;
}

export interface ProductStats {
  totalProducts: { value: string; subtitle: string };
  pendingReview: { value: string; subtitle: string };
  flagged: { value: string; subtitle: string };
  removed: { value: string; subtitle: string };
}

export interface ProductTab {
  key: string;
  label: string;
  count: string;
  badgeClass?: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductListFilters {
  search: string;
  status: string;
  page: number;
  pageSize: number;
}

// ----------------------------------------------------------------
// Product Detail types
// ----------------------------------------------------------------

export interface ProductDetailData {
  id: string;
  name: string;
  sku: string;
  emoji: string;
  status: string;
  statusColor: string;
  category: string;
  brand: string;
  listedDate: string;
  description: string;
  features: string[];

  /** MRP in smallest currency unit */
  mrp: number;
  /** Selling price in smallest currency unit */
  sellingPrice: number;
  discountPercent: number;
  stock: number;

  /** Average star rating */
  avgRating: number;
  reviewCount: number;
  ratingBreakdown: { stars: number; percent: number }[];

  seller: {
    id: string;
    name: string;
    initials: string;
    avatarBg: string;
    tier: string;
    since: string;
    rating: number;
    productCount: number;
    orderCount: number;
  };

  productId: string;
  createdDate: string;
  lastUpdated: string;
  views: number;
  orders: number;
  returns: number;
  returnRate: string;
  gstPercent: number;
  hsnCode: string;
  weight: string;
  dimensions: string;

  shippingWeight: string;
  freeShipping: boolean;
  estDelivery: string;
  returnable: string;

  moderationHistory: {
    event: string;
    actor: string;
    date: string;
    color: string;
  }[];
}

// ----------------------------------------------------------------
// Enhanced Product List types (prototype-matching)
// ----------------------------------------------------------------

export type SellerTier = 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE';

export type EnhancedProductStatus = 'Published' | 'Under Review' | 'Suspended' | 'Draft';

export interface EnhancedProduct {
  id: string;
  name: string;
  sku: string;
  categoryBreadcrumb: string;
  sellerName: string;
  sellerHref: string;
  sellerTier: SellerTier;
  variantCount: number;
  rating: number | null;
  reviewCount: number;
  price: string;
  stock: number;
  reservedStock: number;
  violationCount: number;
  status: EnhancedProductStatus;
  suspensionReason?: string;
}

export interface EnhancedStatCard {
  key: string;
  label: string;
  value: string;
  subtitle?: string;
  borderColor?: string;
  valueColor?: string;
  iconBgColor: string;
  iconColor: string;
  iconKey: string;
}

export interface EnhancedProductTab {
  key: string;
  label: string;
  count: string;
  badgeColor: string;
}

// ----------------------------------------------------------------
// State-Based Product Detail types
// ----------------------------------------------------------------

export type ProductDetailState = 'Published' | 'Draft' | 'Under Review' | 'Suspended';

export interface ComplianceCheckItem {
  label: string;
  status: 'ready' | 'partial' | 'missing';
  detail: string;
  progress?: string;
}

export interface ListingField {
  label: string;
  completed: boolean;
}

export interface SlaInfo {
  remainingHours: number;
  totalHours: number;
  submittedAt: string;
  dueAt: string;
  isWarning: boolean;
}

export interface ReviewerInfo {
  name: string;
  title: string;
  avatar: string;
  assignedAt: string;
  queuePosition: number;
  avgReviewTime: string;
}

export interface SubmissionInfo {
  attemptNumber: number;
  previousRejection?: { reason: string; date: string };
}

export interface ComplianceIssue {
  label: string;
  description: string;
  status: 'fail' | 'warn' | 'pass';
  action?: string;
}

export interface BuyerComplaint {
  text: string;
  date: string;
}

export interface SuspensionInfo {
  reason: string;
  suspendedAt: string;
  suspendedBy: string;
  complaints: BuyerComplaint[];
}

export interface RemediationStep {
  label: string;
  status: 'done' | 'pending';
  description: string;
}

export interface SuspensionHistoryEntry {
  number: number;
  date: string;
  reason: string;
  status: 'active' | 'resolved';
  resolvedDate?: string;
}

// ----------------------------------------------------------------
// Advanced Filters
// ----------------------------------------------------------------

export interface AdvancedFilters {
  priceMin: number;
  priceMax: number;
  minRating: number;
  category: string;
  seller: string;
  stockStatus: string;
  hasReviews: string;
  dateFrom: string;
  dateTo: string;
}

export interface LowStockAlert {
  count: number;
  message: string;
  description: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterOptions {
  categories: FilterOption[];
  sellers: FilterOption[];
}
