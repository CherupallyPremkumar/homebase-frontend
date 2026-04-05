/**
 * Types for the Analytics feature.
 */

export interface RevenueDataPoint {
  label: string;
  value: number;
}

export interface CategoryOrderData {
  label: string;
  value: number;
}

export interface GeoSegment {
  label: string;
  value: number;
  color: string;
}

export interface PaymentSegment {
  label: string;
  value: number;
  color: string;
}

export interface TopSellerRow {
  name: string;
  initials: string;
  bg: string;
  revenue: string;
  orders: number;
  growth: number;
}

export interface AnalyticsData {
  revenueData: RevenueDataPoint[];
  categoryOrders: CategoryOrderData[];
  geoSegments: GeoSegment[];
  paymentSegments: PaymentSegment[];
  topSellers: TopSellerRow[];
}

export type AnalyticsRange = '7D' | '30D' | '90D' | '1Y';
