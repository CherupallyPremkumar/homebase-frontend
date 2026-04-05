import type { SellerDetailData, SellerRecentOrder, SellerHealthMetric, SellerComplianceDocument, SellerRevenueTrend } from '../types';

// ----------------------------------------------------------------
// Adapter: Raw SellerDetailData -> UI-ready view models
// ----------------------------------------------------------------

export interface PerformanceMetricView {
  label: string;
  value: string;
  color: string;
  progressPercent: number;
}

/**
 * Transforms raw seller performance data into metric cards.
 */
export function adaptPerformanceMetrics(seller: SellerDetailData): PerformanceMetricView[] {
  return [
    {
      label: 'Fulfillment Rate',
      value: `${seller.fulfillmentRate}%`,
      color: seller.fulfillmentRate >= 95 ? 'text-green-600' : 'text-yellow-600',
      progressPercent: seller.fulfillmentRate,
    },
    {
      label: 'Avg Rating',
      value: `${seller.avgRating} / 5.0`,
      color: seller.avgRating >= 4.5 ? 'text-green-600' : 'text-yellow-600',
      progressPercent: (seller.avgRating / 5) * 100,
    },
    {
      label: 'Response Time',
      value: seller.responseTime,
      color: 'text-blue-600',
      progressPercent: 60,
    },
    {
      label: 'Return Rate',
      value: `${seller.returnRate}%`,
      color: seller.returnRate <= 3 ? 'text-green-600' : 'text-red-600',
      progressPercent: seller.returnRate * 10,
    },
  ];
}

export interface ComplianceView {
  items: { label: string; verified: boolean }[];
  documentsLabel: string;
  overallStatus: string;
}

/**
 * Transforms raw compliance data into a display-ready checklist.
 */
export function adaptCompliance(seller: SellerDetailData): ComplianceView {
  return {
    items: [
      { label: 'GST Certificate', verified: seller.compliance.gst },
      { label: 'PAN Card', verified: seller.compliance.pan },
      { label: 'Bank Account', verified: seller.compliance.bank },
    ],
    documentsLabel: `Documents: ${seller.compliance.documents}`,
    overallStatus: seller.compliance.overall,
  };
}

export interface RecentOrderView {
  id: string;
  customer: string;
  amountFormatted: string;
  status: string;
  statusColor: string;
  date: string;
}

/**
 * Transforms raw recent orders into display rows.
 */
export function adaptRecentOrders(orders: SellerRecentOrder[]): RecentOrderView[] {
  return orders.map((order) => ({
    id: order.id,
    customer: order.customer,
    amountFormatted: new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(order.amount),
    status: order.status,
    statusColor: order.statusColor,
    date: order.date,
  }));
}

/**
 * Computes the max revenue from the trend data, used for bar chart scaling.
 */
export function getRevenueTrendMax(trend: SellerRevenueTrend[]): number {
  return Math.max(...trend.map((t) => t.amount), 1);
}

/**
 * Returns the dispute resolution percentages for the breakdown bar.
 */
export function getDisputeBreakdown(totalDisputes: number, inFavor: number, against: number, open: number) {
  if (totalDisputes === 0) return { inFavorPct: 0, againstPct: 0, openPct: 0 };
  return {
    inFavorPct: Math.round((inFavor / totalDisputes) * 100),
    againstPct: Math.round((against / totalDisputes) * 100),
    openPct: Math.round((open / totalDisputes) * 100),
  };
}
