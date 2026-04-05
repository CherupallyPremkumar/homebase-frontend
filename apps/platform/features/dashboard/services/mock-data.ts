import type {
  CommandStripData,
  RevenueComparison,
  KpiCard,
  PipelineMetrics,
  PaymentMixData,
  RegionPanelData,
  PlatformAlert,
  SellerHealthData,
  FunnelStage,
  CategoryPerformance,
  CustomerHealthData,
  TopProduct,
  QuickAction,
} from '../types';

// ----------------------------------------------------------------
// Section 1: Command Strip
// ----------------------------------------------------------------

export const mockCommandStrip: CommandStripData = {
  metrics: [
    { label: 'GMV Today', value: '\u20B94.82L', trend: '+18%', sparklineData: [8, 11, 9, 14, 12, 16, 18], sparklineColor: 'bg-green-400' },
    { label: 'Orders/min', value: '14.2', trend: '+8%', sparklineData: [12, 10, 15, 13, 16, 14, 17], sparklineColor: 'bg-green-400' },
    { label: 'Active Users', value: '2,847', trend: '+12%', sparklineData: [14, 16, 13, 18, 15, 17, 19], sparklineColor: 'bg-blue-400' },
    { label: 'Payment Success', value: '98.4%', trendLabel: 'Healthy', sparklineData: [18, 17, 19, 18, 19, 18, 19], sparklineColor: 'bg-green-400' },
    { label: 'Avg Delivery', value: '2.1d', trend: '-0.3d', sparklineData: [14, 12, 11, 10, 9, 8, 8], sparklineColor: 'bg-amber-400' },
  ],
  services: [
    { name: 'API', status: 'up' },
    { name: 'DB', status: 'up' },
    { name: 'Redis', status: 'up' },
    { name: 'Kafka', status: 'up' },
  ],
};

// ----------------------------------------------------------------
// Section 2: Revenue Comparison
// ----------------------------------------------------------------

export const mockRevenueComparison: RevenueComparison = {
  todayRevenue: '\u20B94,82,350',
  yesterday: { value: '\u20B93,62,100', changePercent: '+33.2%' },
  lastWeek: { value: '\u20B94,15,800', changePercent: '+16.0%' },
  lastMonthAvg: { value: '\u20B93,89,200', changePercent: '+23.9%' },
};

// ----------------------------------------------------------------
// Section 3: KPI Cards
// ----------------------------------------------------------------

export const mockKpiCards: KpiCard[] = [
  { key: 'gmv', title: 'GMV (This Month)', value: '\u20B98.6 Cr', trend: '+18.4%', iconBgColor: 'bg-brand-50', iconColor: 'text-brand-500', iconKey: 'currency', sparklineData: [8, 10, 12, 11, 14, 16, 18], sparklineColor: 'bg-brand', href: '/analytics' },
  { key: 'revenue', title: 'Net Revenue', value: '\u20B92.4 Cr', trend: '+22.1%', iconBgColor: 'bg-emerald-50', iconColor: 'text-emerald-500', iconKey: 'rupee', sparklineData: [9, 11, 10, 13, 15, 14, 17], sparklineColor: 'bg-emerald', href: '/analytics' },
  { key: 'takeRate', title: 'Take Rate', value: '12.8%', trend: '+0.3pp', iconBgColor: 'bg-blue-50', iconColor: 'text-blue-500', iconKey: 'trending-up', sparklineData: [14, 13, 14, 15, 14, 15, 16], sparklineColor: 'bg-blue', href: '/analytics' },
  { key: 'orders', title: 'Total Orders', value: '12,450', trend: '+14.2%', iconBgColor: 'bg-violet-50', iconColor: 'text-violet-500', iconKey: 'shopping-bag', sparklineData: [10, 12, 11, 15, 13, 16, 18], sparklineColor: 'bg-violet', href: '/orders' },
  { key: 'sellers', title: 'Active Sellers', value: '234', trend: '+6', iconBgColor: 'bg-emerald-50', iconColor: 'text-emerald-500', iconKey: 'store', sparklineData: [12, 12, 13, 13, 14, 14, 15], sparklineColor: 'bg-emerald', href: '/suppliers' },
  { key: 'buyers', title: 'Active Buyers', value: '18,420', trend: '+9.8%', iconBgColor: 'bg-sky-50', iconColor: 'text-sky-500', iconKey: 'users', sparklineData: [10, 12, 14, 13, 15, 16, 17], sparklineColor: 'bg-sky', href: '/users' },
  { key: 'aov', title: 'Avg Order Value', value: '\u20B93,875', trend: '+3.7%', iconBgColor: 'bg-amber-50', iconColor: 'text-amber-500', iconKey: 'cart', sparklineData: [13, 12, 14, 13, 15, 14, 16], sparklineColor: 'bg-amber', href: '/analytics' },
  { key: 'products', title: 'Products Listed', value: '8,920', trend: '+124', iconBgColor: 'bg-rose-50', iconColor: 'text-rose-500', iconKey: 'archive', sparklineData: [11, 12, 13, 14, 14, 15, 16], sparklineColor: 'bg-rose', href: '/products' },
];

// ----------------------------------------------------------------
// Section 4: Order Pipeline
// ----------------------------------------------------------------

export const mockPipeline: PipelineMetrics = {
  stages: [
    { label: 'Placed', count: 342, breachCount: 12, breachLabel: '12 >4hrs', colorScheme: 'blue' },
    { label: 'Confirmed', count: 298, breachCount: 3, breachLabel: '3 >8hrs', colorScheme: 'indigo' },
    { label: 'Packed', count: 245, breachCount: 8, breachLabel: '8 >4hrs', colorScheme: 'violet' },
    { label: 'Shipped', count: 218, breachCount: 5, breachLabel: '5 delayed', colorScheme: 'purple' },
    { label: 'Out for Delivery', count: 156, breachCount: 2, breachLabel: '2 >SLA', colorScheme: 'amber' },
    { label: 'Delivered', count: 1089, colorScheme: 'green' },
  ],
  cancellationRate: '4.2%',
  rtoRate: '8.1%',
  returnRate: '3.4%',
};

// ----------------------------------------------------------------
// Section 5: Payment Mix + Revenue by Region
// ----------------------------------------------------------------

export const mockPaymentMix: PaymentMixData = {
  methods: [
    { name: 'UPI', percentage: 42, color: 'bg-violet-500', revenue: '\u20B93.61 Cr', successRate: '99.1% success' },
    { name: 'Cards', percentage: 28, color: 'bg-blue-500', revenue: '\u20B92.41 Cr', successRate: '97.8% success' },
    { name: 'COD', percentage: 18, color: 'bg-amber-500', revenue: '\u20B91.55 Cr', successRate: '12% RTO risk' },
    { name: 'Wallet', percentage: 8, color: 'bg-emerald-500', revenue: '\u20B90.69 Cr', successRate: '99.5% success' },
    { name: 'NetBanking', percentage: 4, color: 'bg-gray-400', revenue: '\u20B90.34 Cr', successRate: '96.2% success' },
  ],
  overallSuccessRate: '98.4%',
  failedTransactions: 23,
};

export const mockRegions: RegionPanelData = {
  regions: [
    { name: 'Maharashtra', orders: '3,420 orders', revenue: '\u20B92.1 Cr', growth: '+24%', barPercent: 100, barColor: 'bg-brand-500' },
    { name: 'Karnataka', orders: '2,680 orders', revenue: '\u20B91.6 Cr', growth: '+18%', barPercent: 76, barColor: 'bg-blue-500' },
    { name: 'Delhi NCR', orders: '2,340 orders', revenue: '\u20B91.4 Cr', growth: '+15%', barPercent: 67, barColor: 'bg-emerald-500' },
    { name: 'Tamil Nadu', orders: '1,890 orders', revenue: '\u20B91.1 Cr', growth: '+21%', barPercent: 52, barColor: 'bg-violet-500' },
    { name: 'Gujarat', orders: '1,420 orders', revenue: '\u20B90.8 Cr', growth: '+12%', barPercent: 38, barColor: 'bg-amber-500' },
  ],
  summary: { statesActive: 28, citiesServed: 142, tier1Share: '68%' },
};

// ----------------------------------------------------------------
// Section 6: Platform Alerts
// ----------------------------------------------------------------

export const mockAlerts: PlatformAlert[] = [
  { id: 'a1', severity: 'p0', title: 'Payment gateway error rate 12% (threshold 5%)', description: 'Razorpay gateway returning 5xx errors at elevated rate. 23 failed transactions in last 15 minutes.', timestamp: '2 minutes ago', actions: [{ label: 'Switch to Backup', variant: 'primary' }, { label: 'Investigate', variant: 'secondary' }] },
  { id: 'a2', severity: 'p0', title: 'Order volume dropped 35% vs same hour yesterday', description: 'Expected ~18 orders/min at this hour. Currently at 11.7/min. Possible checkout flow issue or payment degradation.', timestamp: '8 minutes ago', actions: [{ label: 'View Metrics', variant: 'primary' }, { label: 'Alert Team', variant: 'secondary' }] },
  { id: 'a3', severity: 'p1', title: 'Seller "QuickDeals" \u2014 50+ price changes in 1 hour', description: 'Possible price manipulation detected. Seller changed prices on 52 products within the last 60 minutes.', timestamp: '18 minutes ago', actions: [{ label: 'Pause Seller', variant: 'primary' }, { label: 'Review', variant: 'secondary' }] },
  { id: 'a4', severity: 'p1', title: 'Mumbai FC Zone C at 96% capacity', description: 'Fulfillment center approaching maximum. Expected to hit 100% within 4 hours at current inbound rate.', timestamp: '32 minutes ago', actions: [{ label: 'Redirect Inbound', variant: 'primary' }, { label: 'View FC', variant: 'secondary' }] },
  { id: 'a5', severity: 'p1', title: '12 seller applications pending >48hrs', description: 'SLA for seller onboarding review is 24 hours. 12 applications have breached the 48-hour mark.', timestamp: '1 hour ago', actions: [{ label: 'Review Queue', variant: 'primary' }] },
  { id: 'a6', severity: 'p2', title: 'Fake review cluster \u2014 12 reviews same device fingerprint', description: 'Device ID d8f2a1c matched across 12 reviews on 4 different products. All posted within 3 hours.', timestamp: '2 hours ago', actions: [{ label: 'View Details', variant: 'primary' }] },
  { id: 'a7', severity: 'p2', title: 'Slow-moving inventory: 847 SKUs no sale in 30 days', description: 'Estimated holding cost \u20B94.2L/month. Top categories affected: Garden & Outdoor, Hardware & Fasteners.', timestamp: '3 hours ago', actions: [{ label: 'Generate Report', variant: 'primary' }] },
  { id: 'a8', severity: 'p2', title: 'GST filing due in 5 days for Q4', description: 'Quarterly GST return GSTR-3B for Jan-Mar 2026 due on April 7. Tax liability: \u20B918.4L.', timestamp: '6 hours ago', actions: [{ label: 'Prepare Filing', variant: 'primary' }] },
];

// ----------------------------------------------------------------
// Section 7: Seller Health + Conversion Funnel
// ----------------------------------------------------------------

export const mockSellerHealth: SellerHealthData = {
  distribution: { healthyPercent: 72, atRiskPercent: 18, unhealthyPercent: 10 },
  counts: { healthy: 168, atRisk: 42, unhealthy: 24 },
  quickStats: { pendingApplications: 12, suspendedThisMonth: 3, avgHealthScore: 742 },
};

export const mockFunnel: FunnelStage[] = [
  { label: 'Sessions', value: 3842, percentage: 100, changeVsYesterday: '+8.2%', barColor: 'bg-brand-500' },
  { label: 'Product Views', value: 2690, percentage: 70.0, changeVsYesterday: '+5.4%', barColor: 'bg-brand-400' },
  { label: 'Add to Cart', value: 538, percentage: 14.0, changeVsYesterday: '+12.1%', barColor: 'bg-brand-300' },
  { label: 'Checkout Started', value: 269, percentage: 7.0, changeVsYesterday: '-2.3%', barColor: 'bg-brand-200' },
  { label: 'Purchase Completed', value: 161, percentage: 4.2, changeVsYesterday: '+1.8%', barColor: 'bg-green-500' },
];

// ----------------------------------------------------------------
// Section 8: Category Performance + Customer Health
// ----------------------------------------------------------------

export const mockCategories: CategoryPerformance[] = [
  { name: 'Power Tools', units: '3,245 units', revenue: '\u20B92.1 Cr', returnPercent: '2.8%', returnSeverity: 'low', barPercent: 100, barColor: 'bg-brand-500' },
  { name: 'Paints & Finishes', units: '2,890 units', revenue: '\u20B91.8 Cr', returnPercent: '1.4%', returnSeverity: 'low', barPercent: 86, barColor: 'bg-blue-500' },
  { name: 'Electrical & Lighting', units: '2,120 units', revenue: '\u20B91.5 Cr', returnPercent: '4.1%', returnSeverity: 'medium', barPercent: 71, barColor: 'bg-emerald-500' },
  { name: 'Plumbing & Bath', units: '1,780 units', revenue: '\u20B91.2 Cr', returnPercent: '5.8%', returnSeverity: 'high', barPercent: 57, barColor: 'bg-violet-500' },
  { name: 'Hardware & Fasteners', units: '1,540 units', revenue: '\u20B91.0 Cr', returnPercent: '2.2%', returnSeverity: 'low', barPercent: 48, barColor: 'bg-amber-500' },
  { name: 'Garden & Outdoor', units: '1,120 units', revenue: '\u20B90.8 Cr', returnPercent: '3.1%', returnSeverity: 'medium', barPercent: 38, barColor: 'bg-rose-500' },
];

export const mockCustomerHealth: CustomerHealthData = {
  retentionRate: '62.0%',
  churnCount: 420,
  revenuePerUser: '\u20B912,400',
  repeatPurchaseRate: '34.2%',
  cartAbandonment: '50%',
  supportTicketsToday: 89,
  slaBreach: 14,
  avgRating: 4.3,
};

// ----------------------------------------------------------------
// Section 9: Top Products
// ----------------------------------------------------------------

export const mockTopProducts: TopProduct[] = [
  { id: 'p1', name: 'Bosch GSB 500W Drill Kit', sku: 'BOS-GSB-500W', unitsSold: 48, revenue: '\u20B91,44,000', conversion: '6.8%', rating: 4.7, reviewCount: 234, stockStatus: 'in-stock', sellerName: 'Anand Tools' },
  { id: 'p2', name: 'Asian Paints Royale Luxury 10L', sku: 'AP-ROY-10L', unitsSold: 35, revenue: '\u20B91,22,500', conversion: '5.4%', rating: 4.8, reviewCount: 189, stockStatus: 'low-stock', sellerName: 'Krishna Home' },
  { id: 'p3', name: 'Havells Reo 5L Water Heater', sku: 'HAV-REO-5L', unitsSold: 28, revenue: '\u20B998,000', conversion: '4.9%', rating: 4.5, reviewCount: 156, stockStatus: 'in-stock', sellerName: 'Rajesh Store' },
  { id: 'p4', name: 'Crompton Super Silent Fan 1200mm', sku: 'CRM-FAN-1200', unitsSold: 24, revenue: '\u20B962,400', conversion: '3.2%', rating: 4.4, reviewCount: 98, stockStatus: 'in-stock', sellerName: 'Patel Lighting' },
  { id: 'p5', name: 'Pidilite Fevicol SH 500g (Box of 20)', sku: 'PID-FEV-500', unitsSold: 22, revenue: '\u20B944,000', conversion: '7.1%', rating: 4.6, reviewCount: 312, stockStatus: 'out-of-stock', sellerName: 'Meera Garden' },
];

// ----------------------------------------------------------------
// Footer: Quick Actions
// ----------------------------------------------------------------

export const mockQuickActions: QuickAction[] = [
  { label: 'Generate Report', iconKey: 'file-text', variant: 'primary' },
  { label: 'Export Dashboard', iconKey: 'download', variant: 'secondary' },
  { label: 'Send Notification', iconKey: 'bell', variant: 'secondary' },
  { label: 'View Full Analytics', iconKey: 'bar-chart', href: '/analytics', variant: 'secondary' },
];
