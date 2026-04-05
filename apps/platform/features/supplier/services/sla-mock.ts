/**
 * Mock data for Seller SLA Performance page.
 *
 * Each export matches the shape returned by the real API contract.
 * When backend endpoints are ready, swap the mock imports in the
 * hook for real fetch calls -- no component changes needed.
 */

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export type SlaStatus = 'Good' | 'Warning' | 'Critical';

export type RiskLevel = 'Warning' | 'Critical';

export type ViolationType =
  | 'Late Dispatch'
  | 'Slow Response'
  | 'High Return Rate'
  | 'Quality Issues';

export interface SellerSlaEntry {
  id: string;
  sellerName: string;
  sellerId: string;
  dispatchSla: number;
  deliverySla: number;
  responseTime: string;
  rating: number;
  violations: number;
  status: SlaStatus;
}

export interface SellerAtRisk {
  id: string;
  sellerName: string;
  dispatchSla: number;
  deliverySla: number;
  violations: number;
  riskLevel: RiskLevel;
}

export interface SlaStats {
  avgDispatchSla: { value: string; trend: string; trendUp: boolean };
  avgDeliverySla: { value: string; trend: string; trendUp: boolean };
  avgResponseTime: { value: string; trend: string; trendUp: boolean };
  totalViolations: { value: string; subtitle: string };
}

export interface SlaTrendMonth {
  month: string;
  value: number;
}

export interface ViolationBreakdown {
  type: ViolationType;
  count: number;
  color: string;
}

export interface SlaViolation {
  id: string;
  sellerName: string;
  type: string;
  description: string;
  severity: 'critical' | 'warning';
  timeAgo: string;
}

// ----------------------------------------------------------------
// Mock Stats
// ----------------------------------------------------------------

export const mockSlaStats: SlaStats = {
  avgDispatchSla: { value: '96.4%', trend: '+1.2% vs last month', trendUp: true },
  avgDeliverySla: { value: '94.2%', trend: '+0.8% vs last month', trendUp: true },
  avgResponseTime: { value: '3.2 hrs', trend: '-0.5 hrs improvement', trendUp: true },
  totalViolations: { value: '23', subtitle: 'This month' },
};

// ----------------------------------------------------------------
// Mock SLA Trend (6 months)
// ----------------------------------------------------------------

export const mockSlaTrend: SlaTrendMonth[] = [
  { month: 'Oct', value: 91.2 },
  { month: 'Nov', value: 92.8 },
  { month: 'Dec', value: 93.5 },
  { month: 'Jan', value: 94.6 },
  { month: 'Feb', value: 95.2 },
  { month: 'Mar', value: 96.4 },
];

// ----------------------------------------------------------------
// Mock Violation Breakdown
// ----------------------------------------------------------------

export const mockViolationBreakdown: ViolationBreakdown[] = [
  { type: 'Late Dispatch', count: 12, color: 'bg-red-500' },
  { type: 'Slow Response', count: 6, color: 'bg-yellow-500' },
  { type: 'High Return Rate', count: 3, color: 'bg-orange-500' },
  { type: 'Quality Issues', count: 2, color: 'bg-purple-500' },
];

// ----------------------------------------------------------------
// Mock Sellers at Risk
// ----------------------------------------------------------------

export const mockSellersAtRisk: SellerAtRisk[] = [
  { id: 'RISK-001', sellerName: 'Delhi Spice Market', dispatchSla: 72, deliverySla: 68, violations: 9, riskLevel: 'Critical' },
  { id: 'RISK-002', sellerName: 'Urban Essentials', dispatchSla: 65, deliverySla: 60, violations: 12, riskLevel: 'Critical' },
  { id: 'RISK-003', sellerName: 'Craft Corner', dispatchSla: 80, deliverySla: 78, violations: 5, riskLevel: 'Warning' },
  { id: 'RISK-004', sellerName: 'Fashion Hub India', dispatchSla: 85, deliverySla: 82, violations: 4, riskLevel: 'Warning' },
  { id: 'RISK-005', sellerName: 'QuickMart Supplies', dispatchSla: 87, deliverySla: 84, violations: 3, riskLevel: 'Warning' },
];

// ----------------------------------------------------------------
// Mock Seller SLA Rankings
// ----------------------------------------------------------------

export const mockSellerSlaEntries: SellerSlaEntry[] = [
  { id: 'SLA-001', sellerName: 'Sharma Electronics', sellerId: 'SUP-101', dispatchSla: 98, deliverySla: 96, responseTime: '2 hrs', rating: 4.8, violations: 0, status: 'Good' },
  { id: 'SLA-002', sellerName: 'Patel Home Store', sellerId: 'SUP-102', dispatchSla: 95, deliverySla: 93, responseTime: '4 hrs', rating: 4.6, violations: 1, status: 'Good' },
  { id: 'SLA-003', sellerName: 'GreenLeaf Organics', sellerId: 'SUP-103', dispatchSla: 92, deliverySla: 91, responseTime: '3 hrs', rating: 4.5, violations: 2, status: 'Good' },
  { id: 'SLA-004', sellerName: 'Fashion Hub India', sellerId: 'SUP-105', dispatchSla: 85, deliverySla: 82, responseTime: '8 hrs', rating: 4.1, violations: 4, status: 'Warning' },
  { id: 'SLA-005', sellerName: 'TechZone Gadgets', sellerId: 'SUP-104', dispatchSla: 94, deliverySla: 90, responseTime: '5 hrs', rating: 4.3, violations: 1, status: 'Good' },
  { id: 'SLA-006', sellerName: 'Delhi Spice Market', sellerId: 'SUP-106', dispatchSla: 72, deliverySla: 68, responseTime: '18 hrs', rating: 3.4, violations: 9, status: 'Critical' },
  { id: 'SLA-007', sellerName: 'Craft Corner', sellerId: 'SUP-108', dispatchSla: 80, deliverySla: 78, responseTime: '12 hrs', rating: 3.8, violations: 5, status: 'Warning' },
  { id: 'SLA-008', sellerName: 'Urban Essentials', sellerId: 'SUP-107', dispatchSla: 65, deliverySla: 60, responseTime: '24 hrs', rating: 3.1, violations: 12, status: 'Critical' },
];

// ----------------------------------------------------------------
// Mock Recent SLA Violations
// ----------------------------------------------------------------

export const mockSlaViolations: SlaViolation[] = [
  { id: 'VIO-001', sellerName: 'Urban Essentials', type: 'Late Dispatch', description: 'Order #HB-89234 dispatched 48 hrs late', severity: 'critical', timeAgo: '2 hrs ago' },
  { id: 'VIO-002', sellerName: 'Delhi Spice Market', type: 'No Response', description: 'Customer query unanswered for 36 hrs', severity: 'critical', timeAgo: '5 hrs ago' },
  { id: 'VIO-003', sellerName: 'Craft Corner', type: 'Late Delivery', description: 'Order #HB-88912 delivered 3 days late', severity: 'warning', timeAgo: '1 day ago' },
  { id: 'VIO-004', sellerName: 'Fashion Hub India', type: 'Late Dispatch', description: 'Order #HB-88501 dispatched 24 hrs late', severity: 'warning', timeAgo: '1 day ago' },
  { id: 'VIO-005', sellerName: 'Urban Essentials', type: 'Quality Complaint', description: '3 quality complaints in one week', severity: 'critical', timeAgo: '2 days ago' },
];
