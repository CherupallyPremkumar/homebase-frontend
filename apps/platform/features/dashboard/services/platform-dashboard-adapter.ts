/**
 * Adapters: transform platform-dashboard OLAP query responses → dashboard UI types.
 *
 * Data contract:
 *   Backend money = paisa (÷100 for ₹)
 *   Backend rates = basis points (÷100 for %)
 *   All adapters handle empty/null responses gracefully.
 */

import type { SearchResponse } from '@homebase/types';
import type {
  CommandStripData,
  RevenueComparison,
  KpiCard,
  PipelineMetrics,
  PaymentMixData,
  RegionPanelData,
  SellerHealthData,
  FunnelStage,
  CategoryPerformance,
  TopProduct,
  PlatformAlert,
  CustomerHealthData,
  AlertSeverity,
} from '../types';

type Row = Record<string, unknown>;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' ? v : Number(v) || fallback;
}

function str(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : String(v ?? fallback);
}

function paisa(v: unknown): string {
  const n = num(v) / 100;
  if (n >= 10000000) return `\u20B9${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000) return `\u20B9${(n / 100000).toFixed(1)}L`;
  return `\u20B9${n.toLocaleString('en-IN')}`;
}

function bps(v: unknown): string {
  return `${(num(v) / 100).toFixed(1)}%`;
}

function latest(res: SearchResponse<Row>): Row {
  return res.list?.[0]?.row ?? {};
}

function rows(res: SearchResponse<Row>): Row[] {
  return (res.list ?? []).map((item) => item.row);
}

// ----------------------------------------------------------------
// Command Strip — from platformKpi (latest day)
// ----------------------------------------------------------------

export function adaptKpiToCommandStrip(res: SearchResponse<Row>): CommandStripData {
  const r = latest(res);
  return {
    metrics: [
      { label: 'GMV Today', value: paisa(r.gmv_today), trend: `+${bps(r.gmv_growth_bps)}`, sparklineData: [8, 11, 9, 14, 12, 16, 18], sparklineColor: 'bg-green-400' },
      { label: 'Orders/min', value: str(r.orders_per_minute, '0'), trend: `+${bps(r.order_growth_bps)}`, sparklineData: [12, 10, 15, 13, 16, 14, 17], sparklineColor: 'bg-green-400' },
      { label: 'Active Users', value: num(r.active_users).toLocaleString('en-IN'), trend: `+${bps(r.user_growth_bps)}`, sparklineData: [14, 16, 13, 18, 15, 17, 19], sparklineColor: 'bg-blue-400' },
      { label: 'Payment Success', value: bps(r.payment_success_bps), trendLabel: 'Healthy', sparklineData: [18, 17, 19, 18, 19, 18, 19], sparklineColor: 'bg-green-400' },
      { label: 'Avg Delivery', value: `${num(r.avg_delivery_days, 2.1).toFixed(1)}d`, trend: `${num(r.delivery_improvement_days, -0.3) > 0 ? '+' : ''}${num(r.delivery_improvement_days, -0.3).toFixed(1)}d`, sparklineData: [14, 12, 11, 10, 9, 8, 8], sparklineColor: 'bg-amber-400' },
    ],
    services: [
      { name: 'API', status: 'up' },
      { name: 'DB', status: 'up' },
      { name: 'Redis', status: 'up' },
      { name: 'Kafka', status: 'up' },
    ],
  };
}

// ----------------------------------------------------------------
// Revenue Comparison — from platformKpi with date filters
// ----------------------------------------------------------------

export function adaptKpiToRevenueComparison(today: Row, yesterday: Row, lastWeek: Row, lastMonth: Row): RevenueComparison {
  const todayGmv = num(today.gmv_today);
  const yesterdayGmv = num(yesterday.gmv_today);
  const lastWeekGmv = num(lastWeek.gmv_today);
  const lastMonthGmv = num(lastMonth.gmv_today);

  function changePct(current: number, previous: number): string {
    if (previous === 0) return '+0%';
    const pct = ((current - previous) / previous) * 100;
    return `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
  }

  return {
    todayRevenue: paisa(todayGmv),
    yesterday: { value: paisa(yesterdayGmv), changePercent: changePct(todayGmv, yesterdayGmv) },
    lastWeek: { value: paisa(lastWeekGmv), changePercent: changePct(todayGmv, lastWeekGmv) },
    lastMonthAvg: { value: paisa(lastMonthGmv), changePercent: changePct(todayGmv, lastMonthGmv) },
  };
}

// ----------------------------------------------------------------
// KPI Cards — from platformKpi (latest day)
// ----------------------------------------------------------------

export function adaptKpiToKpiCards(res: SearchResponse<Row>): KpiCard[] {
  const r = latest(res);
  return [
    { key: 'gmv', title: 'GMV (This Month)', value: paisa(r.gmv_month), trend: `+${bps(r.gmv_growth_bps)}`, iconBgColor: 'bg-brand-50', iconColor: 'text-brand-500', iconKey: 'currency', sparklineData: [8, 10, 12, 11, 14, 16, 18], sparklineColor: 'bg-brand', href: '/analytics' },
    { key: 'revenue', title: 'Net Revenue', value: paisa(r.net_revenue), trend: `+${bps(r.revenue_growth_bps)}`, iconBgColor: 'bg-emerald-50', iconColor: 'text-emerald-500', iconKey: 'rupee', sparklineData: [9, 11, 10, 13, 15, 14, 17], sparklineColor: 'bg-emerald', href: '/analytics' },
    { key: 'takeRate', title: 'Take Rate', value: bps(r.take_rate_bps), trend: `+${(num(r.take_rate_change_bps) / 100).toFixed(1)}pp`, iconBgColor: 'bg-blue-50', iconColor: 'text-blue-500', iconKey: 'trending-up', sparklineData: [14, 13, 14, 15, 14, 15, 16], sparklineColor: 'bg-blue', href: '/analytics' },
    { key: 'orders', title: 'Total Orders', value: num(r.total_orders).toLocaleString('en-IN'), trend: `+${bps(r.order_growth_bps)}`, iconBgColor: 'bg-violet-50', iconColor: 'text-violet-500', iconKey: 'shopping-bag', sparklineData: [10, 12, 11, 15, 13, 16, 18], sparklineColor: 'bg-violet', href: '/orders' },
    { key: 'sellers', title: 'Active Sellers', value: num(r.active_sellers).toLocaleString('en-IN'), trend: `+${num(r.new_sellers)}`, iconBgColor: 'bg-emerald-50', iconColor: 'text-emerald-500', iconKey: 'store', sparklineData: [12, 12, 13, 13, 14, 14, 15], sparklineColor: 'bg-emerald', href: '/suppliers' },
    { key: 'buyers', title: 'Active Buyers', value: num(r.active_buyers).toLocaleString('en-IN'), trend: `+${bps(r.buyer_growth_bps)}`, iconBgColor: 'bg-sky-50', iconColor: 'text-sky-500', iconKey: 'users', sparklineData: [10, 12, 14, 13, 15, 16, 17], sparklineColor: 'bg-sky', href: '/users' },
    { key: 'aov', title: 'Avg Order Value', value: paisa(r.aov), trend: `+${bps(r.aov_growth_bps)}`, iconBgColor: 'bg-amber-50', iconColor: 'text-amber-500', iconKey: 'cart', sparklineData: [13, 12, 14, 13, 15, 14, 16], sparklineColor: 'bg-amber', href: '/analytics' },
    { key: 'products', title: 'Products Listed', value: num(r.total_products).toLocaleString('en-IN'), trend: `+${num(r.new_products)}`, iconBgColor: 'bg-rose-50', iconColor: 'text-rose-500', iconKey: 'archive', sparklineData: [11, 12, 13, 14, 14, 15, 16], sparklineColor: 'bg-rose', href: '/products' },
  ];
}

// ----------------------------------------------------------------
// Pipeline — from liveOrderPipeline
// ----------------------------------------------------------------

export function adaptPipeline(res: SearchResponse<Row>): PipelineMetrics {
  const r = latest(res);
  return {
    stages: [
      { label: 'Placed', count: num(r.placed), breachCount: num(r.placed_breach_4hr), breachLabel: `${num(r.placed_breach_4hr)} >4hrs`, colorScheme: 'blue' },
      { label: 'Confirmed', count: num(r.confirmed), breachCount: num(r.confirmed_breach_8hr), breachLabel: `${num(r.confirmed_breach_8hr)} >8hrs`, colorScheme: 'indigo' },
      { label: 'Packed', count: num(r.packed), breachCount: num(r.packed_breach_4hr), breachLabel: `${num(r.packed_breach_4hr)} >4hrs`, colorScheme: 'violet' },
      { label: 'Shipped', count: num(r.shipped), breachCount: num(r.shipped_delayed), breachLabel: `${num(r.shipped_delayed)} delayed`, colorScheme: 'purple' },
      { label: 'Out for Delivery', count: num(r.out_for_delivery), breachCount: num(r.ofd_sla_breach), breachLabel: `${num(r.ofd_sla_breach)} >SLA`, colorScheme: 'amber' },
      { label: 'Delivered', count: num(r.delivered), colorScheme: 'green' },
    ],
    cancellationRate: bps(r.cancellation_rate_bps),
    rtoRate: bps(r.rto_rate_bps),
    returnRate: bps(r.return_rate_bps),
  };
}

// ----------------------------------------------------------------
// Payment Mix — from platformKpi
// ----------------------------------------------------------------

export function adaptPaymentMix(res: SearchResponse<Row>): PaymentMixData {
  const r = latest(res);
  return {
    methods: [
      { name: 'UPI', percentage: num(r.upi_pct) / 100, color: 'bg-violet-500', revenue: paisa(r.upi_revenue), successRate: `${(num(r.upi_success_bps) / 100).toFixed(1)}% success` },
      { name: 'Cards', percentage: num(r.card_pct) / 100, color: 'bg-blue-500', revenue: paisa(r.card_revenue), successRate: `${(num(r.card_success_bps) / 100).toFixed(1)}% success` },
      { name: 'COD', percentage: num(r.cod_pct) / 100, color: 'bg-amber-500', revenue: paisa(r.cod_revenue), successRate: `${(num(r.cod_rto_bps) / 100).toFixed(1)}% RTO risk` },
      { name: 'Wallet', percentage: num(r.wallet_pct) / 100, color: 'bg-emerald-500', revenue: paisa(r.wallet_revenue), successRate: `${(num(r.wallet_success_bps) / 100).toFixed(1)}% success` },
      { name: 'NetBanking', percentage: num(r.nb_pct) / 100, color: 'bg-gray-400', revenue: paisa(r.nb_revenue), successRate: `${(num(r.nb_success_bps) / 100).toFixed(1)}% success` },
    ],
    overallSuccessRate: bps(r.payment_success_bps),
    failedTransactions: num(r.failed_transactions_today),
  };
}

// ----------------------------------------------------------------
// Revenue by Region — from revenueByRegion
// ----------------------------------------------------------------

export function adaptRegionToPanel(res: SearchResponse<Row>): RegionPanelData {
  const allRows = rows(res);
  const sorted = [...allRows].sort((a, b) => num(b.gmv) - num(a.gmv));
  const top5 = sorted.slice(0, 5);
  const maxGmv = num(top5[0]?.gmv) || 1;

  const BAR_COLORS = ['bg-brand-500', 'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500'];

  return {
    regions: top5.map((r, i) => ({
      name: str(r.state_name),
      orders: `${num(r.order_count).toLocaleString('en-IN')} orders`,
      revenue: paisa(r.gmv),
      growth: `+${bps(r.growth_bps)}`,
      barPercent: Math.round((num(r.gmv) / maxGmv) * 100),
      barColor: BAR_COLORS[i] ?? 'bg-gray-400',
    })),
    summary: {
      statesActive: num(allRows.length),
      citiesServed: 142,
      tier1Share: '68%',
    },
  };
}

// ----------------------------------------------------------------
// Seller Health — from sellerHealthSummary (latest day)
// ----------------------------------------------------------------

export function adaptSellerHealth(res: SearchResponse<Row>): SellerHealthData {
  const r = latest(res);
  const total = num(r.total_sellers) || 1;
  const healthy = num(r.healthy);
  const atRisk = num(r.at_risk);
  const unhealthy = num(r.unhealthy);

  return {
    distribution: {
      healthyPercent: Math.round((healthy / total) * 100),
      atRiskPercent: Math.round((atRisk / total) * 100),
      unhealthyPercent: Math.round((unhealthy / total) * 100),
    },
    counts: { healthy, atRisk, unhealthy },
    quickStats: {
      pendingApplications: num(r.pending_applications),
      suspendedThisMonth: num(r.suspended_this_month),
      avgHealthScore: num(r.avg_health_score),
    },
  };
}

// ----------------------------------------------------------------
// Conversion Funnel — from conversionFunnel (latest day)
// ----------------------------------------------------------------

export function adaptFunnel(res: SearchResponse<Row>): FunnelStage[] {
  const r = latest(res);
  const sessions = num(r.sessions) || 1;

  return [
    { label: 'Sessions', value: num(r.sessions), percentage: 100, changeVsYesterday: `+${bps(r.sessions_growth_bps)}`, barColor: 'bg-brand-500' },
    { label: 'Product Views', value: num(r.product_views), percentage: Math.round((num(r.product_views) / sessions) * 100), changeVsYesterday: `+${bps(r.views_growth_bps)}`, barColor: 'bg-brand-400' },
    { label: 'Add to Cart', value: num(r.add_to_cart), percentage: Math.round((num(r.add_to_cart) / sessions) * 100), changeVsYesterday: `+${bps(r.cart_growth_bps)}`, barColor: 'bg-brand-300' },
    { label: 'Checkout Started', value: num(r.checkout_started), percentage: Math.round((num(r.checkout_started) / sessions) * 100), changeVsYesterday: `${num(r.checkout_growth_bps) >= 0 ? '+' : ''}${bps(r.checkout_growth_bps)}`, barColor: 'bg-brand-200' },
    { label: 'Purchase Completed', value: num(r.purchase_completed), percentage: +((num(r.purchase_completed) / sessions) * 100).toFixed(1), changeVsYesterday: `+${bps(r.purchase_growth_bps)}`, barColor: 'bg-green-500' },
  ];
}

// ----------------------------------------------------------------
// Category Performance — from categoryPerformance
// ----------------------------------------------------------------

export function adaptCategoryPerformance(res: SearchResponse<Row>): CategoryPerformance[] {
  const allRows = rows(res);
  const sorted = [...allRows].sort((a, b) => num(b.gmv) - num(a.gmv));
  const top6 = sorted.slice(0, 6);
  const maxGmv = num(top6[0]?.gmv) || 1;
  const BAR_COLORS = ['bg-brand-500', 'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500'];

  return top6.map((r, i) => ({
    name: str(r.category_name),
    units: `${num(r.units_sold).toLocaleString('en-IN')} units`,
    revenue: paisa(r.gmv),
    returnPercent: bps(r.return_rate_bps),
    returnSeverity: num(r.return_rate_bps) > 500 ? 'high' as const : num(r.return_rate_bps) > 300 ? 'medium' as const : 'low' as const,
    barPercent: Math.round((num(r.gmv) / maxGmv) * 100),
    barColor: BAR_COLORS[i] ?? 'bg-gray-400',
  }));
}

// ----------------------------------------------------------------
// Top Products — from topProductsToday
// ----------------------------------------------------------------

export function adaptTopProducts(res: SearchResponse<Row>): TopProduct[] {
  return rows(res).slice(0, 5).map((r) => ({
    id: str(r.id),
    name: str(r.product_name),
    sku: str(r.sku),
    unitsSold: num(r.units_sold),
    revenue: paisa(r.revenue),
    conversion: bps(r.conversion_rate_bps),
    rating: num(r.rating_bps) / 100,
    reviewCount: num(r.review_count),
    stockStatus: num(r.available_stock) === 0 ? 'out-of-stock' as const : num(r.available_stock) < 20 ? 'low-stock' as const : 'in-stock' as const,
    sellerName: str(r.seller_name),
  }));
}

// ----------------------------------------------------------------
// Platform Alerts — from platformAlerts
// ----------------------------------------------------------------

export function adaptAlerts(res: SearchResponse<Row>): PlatformAlert[] {
  return rows(res).map((r) => ({
    id: str(r.id),
    severity: str(r.severity, 'p2').toLowerCase() as AlertSeverity,
    title: str(r.alert_message),
    description: `${str(r.metric_name)}: current ${str(r.current_value)}, threshold ${str(r.threshold_value)}`,
    timestamp: str(r.created_time),
    actions: [{ label: 'Investigate', variant: 'primary' as const }],
  }));
}

// ----------------------------------------------------------------
// Customer Health — from customerHealth
// ----------------------------------------------------------------

export function adaptCustomerHealth(res: SearchResponse<Row>): CustomerHealthData {
  const r = latest(res);
  const cohortSize = num(r.cohort_size) || 1;
  const activeCount = num(r.active_count);
  return {
    retentionRate: bps(r.retention_rate),
    churnCount: num(r.churn_count),
    revenuePerUser: paisa(r.revenue_per_user),
    repeatPurchaseRate: `${((activeCount / cohortSize) * 100).toFixed(1)}%`,
    cartAbandonment: bps(r.cart_abandonment_bps),
    supportTicketsToday: num(r.support_tickets_today),
    slaBreach: num(r.sla_breach_count),
    avgRating: num(r.avg_rating_bps, 430) / 100,
  };
}
