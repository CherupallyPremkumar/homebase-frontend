/**
 * Types for the Platform Health feature.
 */

export type ServiceStatus = 'Operational' | 'Degraded' | 'Down';
export type AlertSeverity = 'warning' | 'critical';
export type ErrorSeverity = '502' | '504' | '500' | '429' | '503';

export interface HealthStats {
  uptime: string;
  responseTime: string;
  activeSessions: string;
  errorRate: string;
}

export type BarColor = 'green' | 'yellow' | 'red';

export interface UptimeBar {
  color: BarColor;
  opacity: number;
}

export interface InfraService {
  name: string;
  status: ServiceStatus;
  uptimePercent: string;
  latency: string;
  uptimeBars: UptimeBar[];
  dateRange: { start: string; end: string };
}

export interface AppService {
  name: string;
  status: ServiceStatus;
}

export interface ActiveAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  descriptionBold?: string;
  detectedAt: string;
  actionLabel: string;
}

export interface RecentError {
  id: string;
  timestamp: string;
  endpoint: string;
  error: string;
  errorCode: ErrorSeverity;
  count: number;
}

export interface HealthDashboardResponse {
  stats: HealthStats;
  infraServices: InfraService[];
  appServices: AppService[];
  alerts: ActiveAlert[];
  recentErrors: RecentError[];
  overallStatus: 'All Systems Operational' | 'Partial Outage' | 'Major Outage';
  lastChecked: string;
}
