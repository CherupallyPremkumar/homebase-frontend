/**
 * Mock data for the Platform Analytics Dashboard.
 *
 * Each export matches the shape returned by the real API contract.
 * When the backend endpoints are ready, swap the mock imports in
 * queries.ts for real fetch calls -- no component changes needed.
 */

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export interface TopSellerItem {
  name: string;
  initials: string;
  bg: string;
  revenue: string;
  orders: number;
  growth: number;
}

export interface AnalyticsData {
  revenueData: ChartDataPoint[];
  categoryOrders: ChartDataPoint[];
  geoSegments: DonutSegment[];
  paymentSegments: DonutSegment[];
  topSellers: TopSellerItem[];
}

// ----------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------

export const mockRevenueData: ChartDataPoint[] = [
  { label: 'Apr', value: 19200000 },
  { label: 'May', value: 20800000 },
  { label: 'Jun', value: 23200000 },
  { label: 'Jul', value: 22400000 },
  { label: 'Aug', value: 24800000 },
  { label: 'Sep', value: 28000000 },
  { label: 'Oct', value: 30000000 },
  { label: 'Nov', value: 32800000 },
  { label: 'Dec', value: 36000000 },
  { label: 'Jan', value: 34000000 },
  { label: 'Feb', value: 35200000 },
  { label: 'Mar', value: 38000000 },
];

export const mockCategoryOrders: ChartDataPoint[] = [
  { label: 'Furniture', value: 3450 },
  { label: 'Lighting', value: 2890 },
  { label: 'Tools', value: 2340 },
  { label: 'Garden', value: 1560 },
  { label: 'Kitchen', value: 1230 },
  { label: 'Security', value: 980 },
];

export const mockGeoSegments: DonutSegment[] = [
  { label: 'Maharashtra', value: 3200, color: '#F97316' },
  { label: 'Delhi NCR', value: 2800, color: '#3B82F6' },
  { label: 'Karnataka', value: 2100, color: '#10B981' },
  { label: 'Tamil Nadu', value: 1800, color: '#8B5CF6' },
  { label: 'Gujarat', value: 1400, color: '#EAB308' },
  { label: 'Others', value: 1150, color: '#6B7280' },
];

export const mockPaymentSegments: DonutSegment[] = [
  { label: 'UPI', value: 5200, color: '#F97316' },
  { label: 'Credit Card', value: 3100, color: '#3B82F6' },
  { label: 'Debit Card', value: 1800, color: '#10B981' },
  { label: 'COD', value: 1500, color: '#EAB308' },
  { label: 'EMI', value: 850, color: '#8B5CF6' },
];

export const mockTopSellers: TopSellerItem[] = [
  { name: 'Sharma Electronics', initials: 'SE', bg: 'from-blue-400 to-blue-600', revenue: 'Rs.22.3L', orders: 1240, growth: 18.5 },
  { name: 'TechWorld India', initials: 'TW', bg: 'from-emerald-400 to-emerald-600', revenue: 'Rs.15.7L', orders: 980, growth: 12.3 },
  { name: 'Priya Fashion Hub', initials: 'PF', bg: 'from-pink-400 to-pink-600', revenue: 'Rs.6.9L', orders: 650, growth: -2.1 },
  { name: 'Rajesh Store', initials: 'RS', bg: 'from-amber-400 to-amber-600', revenue: 'Rs.8.4L', orders: 540, growth: 8.7 },
  { name: 'Krishna Home Decor', initials: 'KH', bg: 'from-violet-400 to-violet-600', revenue: 'Rs.4.2L', orders: 380, growth: 22.4 },
];

export const mockAnalyticsData: AnalyticsData = {
  revenueData: mockRevenueData,
  categoryOrders: mockCategoryOrders,
  geoSegments: mockGeoSegments,
  paymentSegments: mockPaymentSegments,
  topSellers: mockTopSellers,
};
