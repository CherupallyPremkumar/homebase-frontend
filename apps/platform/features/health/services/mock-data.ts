/**
 * Mock data for the Platform Health page.
 *
 * Each export matches the shape returned by the real API contract.
 * When backend endpoints are ready, swap the mock imports in
 * queries.ts for real fetch calls -- no component changes needed.
 */

import type {
  HealthStats,
  InfraService,
  AppService,
  ActiveAlert,
  RecentError,
  HealthDashboardResponse,
} from '../types';

export type {
  ServiceStatus,
  AlertSeverity,
  ErrorSeverity,
  BarColor,
  UptimeBar,
  HealthStats,
  InfraService,
  AppService,
  ActiveAlert,
  RecentError,
  HealthDashboardResponse,
} from '../types';

// ----------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------

export const mockHealthStats: HealthStats = {
  uptime: '99.9%',
  responseTime: '142ms',
  activeSessions: '1,247',
  errorRate: '0.02%',
};

export const mockInfraServices: InfraService[] = [
  {
    name: 'API Server',
    status: 'Operational',
    uptimePercent: '99.9%',
    latency: '142ms',
    uptimeBars: [
      { color: 'green', opacity: 0.7 },
      { color: 'green', opacity: 0.75 },
      { color: 'green', opacity: 0.8 },
      { color: 'green', opacity: 0.85 },
      { color: 'green', opacity: 0.9 },
      { color: 'green', opacity: 0.95 },
      { color: 'green', opacity: 1 },
    ],
    dateRange: { start: 'Mar 27', end: 'Today' },
  },
  {
    name: 'PostgreSQL',
    status: 'Operational',
    uptimePercent: '99.8%',
    latency: '23ms',
    uptimeBars: [
      { color: 'green', opacity: 0.8 },
      { color: 'green', opacity: 0.85 },
      { color: 'green', opacity: 0.75 },
      { color: 'green', opacity: 0.9 },
      { color: 'green', opacity: 0.95 },
      { color: 'green', opacity: 1 },
      { color: 'green', opacity: 0.95 },
    ],
    dateRange: { start: 'Mar 27', end: 'Today' },
  },
  {
    name: 'Redis',
    status: 'Operational',
    uptimePercent: '99.9%',
    latency: '2ms',
    uptimeBars: [
      { color: 'green', opacity: 0.9 },
      { color: 'green', opacity: 0.95 },
      { color: 'green', opacity: 1 },
      { color: 'green', opacity: 1 },
      { color: 'green', opacity: 0.95 },
      { color: 'green', opacity: 1 },
      { color: 'green', opacity: 1 },
    ],
    dateRange: { start: 'Mar 27', end: 'Today' },
  },
  {
    name: 'Kafka',
    status: 'Operational',
    uptimePercent: '99.7%',
    latency: '45ms',
    uptimeBars: [
      { color: 'green', opacity: 0.75 },
      { color: 'green', opacity: 0.8 },
      { color: 'yellow', opacity: 0.9 },
      { color: 'green', opacity: 0.9 },
      { color: 'green', opacity: 0.95 },
      { color: 'green', opacity: 1 },
      { color: 'green', opacity: 0.95 },
    ],
    dateRange: { start: 'Mar 27', end: 'Today' },
  },
  {
    name: 'Keycloak',
    status: 'Operational',
    uptimePercent: '99.6%',
    latency: '68ms',
    uptimeBars: [
      { color: 'green', opacity: 0.8 },
      { color: 'yellow', opacity: 0.85 },
      { color: 'green', opacity: 0.9 },
      { color: 'green', opacity: 0.85 },
      { color: 'green', opacity: 0.9 },
      { color: 'green', opacity: 0.95 },
      { color: 'green', opacity: 1 },
    ],
    dateRange: { start: 'Mar 27', end: 'Today' },
  },
  {
    name: 'Elasticsearch',
    status: 'Degraded',
    uptimePercent: '98.2%',
    latency: '210ms',
    uptimeBars: [
      { color: 'green', opacity: 0.8 },
      { color: 'green', opacity: 0.85 },
      { color: 'yellow', opacity: 0.9 },
      { color: 'yellow', opacity: 0.85 },
      { color: 'yellow', opacity: 1 },
      { color: 'yellow', opacity: 1 },
      { color: 'yellow', opacity: 1 },
    ],
    dateRange: { start: 'Mar 27', end: 'Today' },
  },
];

export const mockAppServices: AppService[] = [
  { name: 'Payment', status: 'Operational' },
  { name: 'Email', status: 'Operational' },
  { name: 'SMS', status: 'Operational' },
  { name: 'Search', status: 'Operational' },
  { name: 'CDN', status: 'Operational' },
  { name: 'Database', status: 'Operational' },
];

export const mockAlerts: ActiveAlert[] = [
  {
    id: 'alert-001',
    severity: 'critical',
    title: 'Elasticsearch Indexing Lag',
    description: 'Indexing lag at 12 seconds (threshold: 5s). Product search results may be stale. Affects catalog freshness for new listings.',
    descriptionBold: '12 seconds',
    detectedAt: 'Detected 6 minutes ago',
    actionLabel: 'Investigate',
  },
  {
    id: 'alert-002',
    severity: 'warning',
    title: 'High Memory Usage on Worker-3',
    description: 'Memory utilization at 87%. Threshold is 85%. Auto-scaling triggered. Monitoring in progress.',
    detectedAt: 'Detected 14 minutes ago',
    actionLabel: 'View Metrics',
  },
  {
    id: 'alert-003',
    severity: 'warning',
    title: 'Elevated Latency on /api/search',
    description: 'P95 latency increased to 380ms (normal: 120ms). Likely due to cache rebuild after deployment. Expected to resolve within 30 minutes.',
    detectedAt: 'Detected 8 minutes ago',
    actionLabel: 'Acknowledge',
  },
];

export const mockRecentErrors: RecentError[] = [
  { id: 'err-001', timestamp: '2026-03-28 09:42:18', endpoint: '/api/v1/checkout/payment', error: '502 Bad Gateway', errorCode: '502', count: 3 },
  { id: 'err-002', timestamp: '2026-03-28 09:38:05', endpoint: '/api/v1/products/search', error: '504 Timeout', errorCode: '504', count: 7 },
  { id: 'err-003', timestamp: '2026-03-28 09:25:33', endpoint: '/api/v1/users/profile', error: '500 Internal Error', errorCode: '500', count: 1 },
  { id: 'err-004', timestamp: '2026-03-28 09:12:47', endpoint: '/api/v1/orders/bulk', error: '429 Rate Limited', errorCode: '429', count: 12 },
  { id: 'err-005', timestamp: '2026-03-28 08:58:22', endpoint: '/api/v1/inventory/sync', error: '503 Unavailable', errorCode: '503', count: 2 },
];

export const mockHealthDashboard: HealthDashboardResponse = {
  stats: mockHealthStats,
  infraServices: mockInfraServices,
  appServices: mockAppServices,
  alerts: mockAlerts,
  recentErrors: mockRecentErrors,
  overallStatus: 'All Systems Operational',
  lastChecked: '12 seconds ago',
};
