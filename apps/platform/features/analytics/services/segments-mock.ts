/**
 * Mock data for Customer Segments.
 *
 * Each export matches the shape returned by the real API contract.
 * When the backend endpoints are ready, swap the mock imports in
 * the hook for real fetch calls -- no component changes needed.
 */

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export type SegmentStatus = 'active' | 'draft';

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  customerCount: number;
  avgOrderValue: string;
  totalRevenue: string;
  growth: number;
  status: SegmentStatus;
  iconBg: string;
  iconColor: string;
}

export interface SegmentsData {
  segments: CustomerSegment[];
}

// ----------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------

export const mockSegments: CustomerSegment[] = [
  {
    id: 'seg-1',
    name: 'New Customers',
    description: 'First purchase within the last 30 days',
    customerCount: 1245,
    avgOrderValue: 'Rs.2,340',
    totalRevenue: 'Rs.29.1L',
    growth: 28,
    status: 'active',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 'seg-2',
    name: 'Repeat Buyers',
    description: '2+ orders placed, consistent monthly activity',
    customerCount: 8456,
    avgOrderValue: 'Rs.5,670',
    totalRevenue: 'Rs.4.79Cr',
    growth: 8,
    status: 'active',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    id: 'seg-3',
    name: 'High Value',
    description: 'Lifetime spend above Rs.50,000 or VIP status',
    customerCount: 234,
    avgOrderValue: 'Rs.12,450',
    totalRevenue: 'Rs.29.1L',
    growth: 12,
    status: 'active',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  {
    id: 'seg-4',
    name: 'At Risk',
    description: 'Previously active, no orders in 60+ days',
    customerCount: 567,
    avgOrderValue: 'Rs.8,900',
    totalRevenue: 'Rs.50.5L',
    growth: -15,
    status: 'active',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
  },
  {
    id: 'seg-5',
    name: 'Dormant',
    description: 'No activity in 90+ days, previously had orders',
    customerCount: 3210,
    avgOrderValue: 'Rs.3,120',
    totalRevenue: 'Rs.1.0Cr',
    growth: -5,
    status: 'active',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-500',
  },
  {
    id: 'seg-6',
    name: 'Bargain Hunters',
    description: 'Primarily purchases during sales and with coupons',
    customerCount: 1890,
    avgOrderValue: 'Rs.1,450',
    totalRevenue: 'Rs.27.4L',
    growth: 18,
    status: 'active',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: 'seg-7',
    name: 'Mobile-First Shoppers',
    description: '90%+ sessions from mobile devices',
    customerCount: 4320,
    avgOrderValue: 'Rs.2,890',
    totalRevenue: 'Rs.1.25Cr',
    growth: 22,
    status: 'draft',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
  {
    id: 'seg-8',
    name: 'Weekend Warriors',
    description: 'Most purchases made on Saturday and Sunday',
    customerCount: 2150,
    avgOrderValue: 'Rs.3,780',
    totalRevenue: 'Rs.81.3L',
    growth: 6,
    status: 'draft',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
  },
];

export const mockSegmentsData: SegmentsData = {
  segments: mockSegments,
};
