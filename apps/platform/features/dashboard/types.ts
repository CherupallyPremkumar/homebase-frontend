/**
 * Types for the Dashboard feature.
 *
 * Re-exports shared types and defines dashboard-specific interfaces.
 */

export type {
  DashboardStats,
  DailyOrderStats,
  OrdersByState,
  StockAlert,
} from '@homebase/types';

// ----------------------------------------------------------------
// Shared
// ----------------------------------------------------------------

export interface DateRange {
  from: string;
  to: string;
}

export type ActivityBadgeColor =
  | 'green'
  | 'blue'
  | 'red'
  | 'emerald'
  | 'violet'
  | 'amber';

// ----------------------------------------------------------------
// Legacy (kept for existing adapters until fully migrated)
// ----------------------------------------------------------------

export interface StatMetric {
  value: number;
  currency?: string;
}

export interface PendingApprovalMetric {
  value: number;
  needsAction: boolean;
}

export interface MockDashboardStats {
  totalRevenue: StatMetric;
  totalOrders: StatMetric;
  activeSellers: StatMetric;
  activeUsers: StatMetric;
  productsListed: StatMetric;
  pendingApprovals: PendingApprovalMetric;
}

export interface RevenueDataPoint {
  label: string;
  revenue: number;
  target: number;
}

export interface RevenueChartData {
  period: string;
  data: RevenueDataPoint[];
  total: number;
  average: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  relativeTime: string;
  badge: { label: string; color: ActivityBadgeColor };
  icon: { type: string; bgColor: string; iconColor: string };
  navigateTo: string;
}

export interface TopSeller {
  id: string;
  storeName: string;
  tier: string;
  products: number;
  orders: number;
  revenue: number;
  rating: number;
  fulfillmentPercent?: number;
}

export interface HealthMetrics {
  serverUptime: {
    value: number;
    unit: string;
    status: string;
    lastDowntime: string;
    lastDowntimeDuration: number;
  };
  apiResponse: {
    value: number;
    unit: string;
    percentile: string;
    target: number;
    status: string;
  };
  activeSessions: {
    value: number;
    capacity: number;
    breakdown: { buyers: number; sellers: number; admin: number };
  };
  lastUpdated: string;
}

// ----------------------------------------------------------------
// Section 1: Command Strip
// ----------------------------------------------------------------

export interface CommandMetric {
  label: string;
  value: string;
  trend?: string;
  trendLabel?: string;
  sparklineData: number[];
  sparklineColor: string;
}

export interface SystemService {
  name: string;
  status: 'up' | 'degraded' | 'down';
}

export interface CommandStripData {
  metrics: CommandMetric[];
  services: SystemService[];
}

// ----------------------------------------------------------------
// Section 2: Revenue Comparison
// ----------------------------------------------------------------

export interface ComparisonValue {
  value: string;
  changePercent: string;
}

export interface RevenueComparison {
  todayRevenue: string;
  yesterday: ComparisonValue;
  lastWeek: ComparisonValue;
  lastMonthAvg: ComparisonValue;
}

// ----------------------------------------------------------------
// Section 3: KPI Cards
// ----------------------------------------------------------------

export interface KpiCard {
  key: string;
  title: string;
  value: string;
  trend: string;
  iconBgColor: string;
  iconColor: string;
  iconKey: string;
  sparklineData: number[];
  sparklineColor: string;
  href: string;
}

// ----------------------------------------------------------------
// Section 4: Order Pipeline
// ----------------------------------------------------------------

export interface PipelineStage {
  label: string;
  count: number;
  breachCount?: number;
  breachLabel?: string;
  colorScheme: string;
}

export interface PipelineMetrics {
  stages: PipelineStage[];
  cancellationRate: string;
  rtoRate: string;
  returnRate: string;
}

// ----------------------------------------------------------------
// Section 5: Payment Mix + Revenue by Region
// ----------------------------------------------------------------

export interface PaymentMethod {
  name: string;
  percentage: number;
  color: string;
  revenue: string;
  successRate: string;
}

export interface PaymentMixData {
  methods: PaymentMethod[];
  overallSuccessRate: string;
  failedTransactions: number;
}

export interface RegionData {
  name: string;
  orders: string;
  revenue: string;
  growth: string;
  barPercent: number;
  barColor: string;
}

export interface RegionSummary {
  statesActive: number;
  citiesServed: number;
  tier1Share: string;
}

export interface RegionPanelData {
  regions: RegionData[];
  summary: RegionSummary;
}

// ----------------------------------------------------------------
// Section 6: Smart Alerts
// ----------------------------------------------------------------

export type AlertSeverity = 'p0' | 'p1' | 'p2';

export interface AlertAction {
  label: string;
  variant: 'primary' | 'secondary';
}

export interface PlatformAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  timestamp: string;
  actions: AlertAction[];
}

// ----------------------------------------------------------------
// Section 7: Seller Health + Conversion Funnel
// ----------------------------------------------------------------

export interface SellerHealthData {
  distribution: {
    healthyPercent: number;
    atRiskPercent: number;
    unhealthyPercent: number;
  };
  counts: {
    healthy: number;
    atRisk: number;
    unhealthy: number;
  };
  quickStats: {
    pendingApplications: number;
    suspendedThisMonth: number;
    avgHealthScore: number;
  };
}

export interface FunnelStage {
  label: string;
  value: number;
  percentage: number;
  changeVsYesterday: string;
  barColor: string;
}

// ----------------------------------------------------------------
// Section 8: Category Performance + Customer Health
// ----------------------------------------------------------------

export interface CategoryPerformance {
  name: string;
  units: string;
  revenue: string;
  returnPercent: string;
  returnSeverity: 'low' | 'medium' | 'high';
  barPercent: number;
  barColor: string;
}

export interface CustomerHealthData {
  // From customerHealth (cohort) query
  retentionRate: string;
  churnCount: number;
  revenuePerUser: string;
  repeatPurchaseRate: string;
  // From platformKpi query
  cartAbandonment: string;
  supportTicketsToday: number;
  // From liveOrderPipeline query
  slaBreach: number;
  // From platformKpi
  avgRating: number;
}

// ----------------------------------------------------------------
// Section 9: Top Products
// ----------------------------------------------------------------

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface TopProduct {
  id: string;
  name: string;
  sku: string;
  unitsSold: number;
  revenue: string;
  conversion: string;
  rating: number;
  reviewCount: number;
  stockStatus: StockStatus;
  sellerName: string;
}

// ----------------------------------------------------------------
// Footer: Quick Actions
// ----------------------------------------------------------------

export interface QuickAction {
  label: string;
  iconKey: string;
  href?: string;
  variant: 'primary' | 'secondary';
}
