/**
 * Mock data for Session Analytics.
 *
 * Each export matches the shape returned by the real API contract.
 * When the backend endpoints are ready, swap the mock imports in
 * the hook for real fetch calls -- no component changes needed.
 */

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export interface SessionStats {
  activeSessions: number;
  activeSessionsTrend: number;
  avgSessionDuration: string;
  avgSessionDurationTrend: number;
  bounceRate: number;
  bounceRateTrend: number;
  pagesPerSession: number;
  pagesPerSessionTrend: number;
}

export interface TrafficSource {
  source: string;
  sessions: number;
  percentage: number;
  color: string;
}

export interface DeviceBreakdown {
  device: string;
  sessions: number;
  percentage: number;
  color: string;
}

export interface TopPage {
  id: string;
  url: string;
  views: string;
  avgTime: string;
  bounceRate: string;
}

export interface SessionAnalyticsData {
  stats: SessionStats;
  trafficSources: TrafficSource[];
  devices: DeviceBreakdown[];
  topPages: TopPage[];
}

// ----------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------

export const mockSessionStats: SessionStats = {
  activeSessions: 3842,
  activeSessionsTrend: 12.5,
  avgSessionDuration: '3.2 min',
  avgSessionDurationTrend: 8.3,
  bounceRate: 32,
  bounceRateTrend: -2.1,
  pagesPerSession: 4.6,
  pagesPerSessionTrend: 5.7,
};

export const mockTrafficSources: TrafficSource[] = [
  { source: 'Direct', sessions: 156200, percentage: 34, color: 'bg-orange-500' },
  { source: 'Organic Search', sessions: 119600, percentage: 26, color: 'bg-blue-500' },
  { source: 'Social Media', sessions: 82400, percentage: 18, color: 'bg-green-500' },
  { source: 'Referral', sessions: 59300, percentage: 13, color: 'bg-purple-500' },
  { source: 'Paid Campaigns', sessions: 41200, percentage: 9, color: 'bg-yellow-500' },
];

export const mockDevices: DeviceBreakdown[] = [
  { device: 'Mobile', sessions: 296400, percentage: 65, color: 'bg-orange-500' },
  { device: 'Desktop', sessions: 136800, percentage: 30, color: 'bg-blue-500' },
  { device: 'Tablet', sessions: 22800, percentage: 5, color: 'bg-purple-500' },
];

export const mockTopPages: TopPage[] = [
  { id: '1', url: '/home', views: '320K', avgTime: '1.8 min', bounceRate: '28%' },
  { id: '2', url: '/products', views: '280K', avgTime: '2.4 min', bounceRate: '35%' },
  { id: '3', url: '/products/:id', views: '245K', avgTime: '4.1 min', bounceRate: '22%' },
  { id: '4', url: '/search', views: '150K', avgTime: '1.5 min', bounceRate: '42%' },
  { id: '5', url: '/cart', views: '120K', avgTime: '2.8 min', bounceRate: '38%' },
  { id: '6', url: '/checkout', views: '85K', avgTime: '5.2 min', bounceRate: '18%' },
  { id: '7', url: '/account/orders', views: '72K', avgTime: '3.1 min', bounceRate: '25%' },
  { id: '8', url: '/categories', views: '64K', avgTime: '2.0 min', bounceRate: '40%' },
  { id: '9', url: '/deals', views: '58K', avgTime: '3.5 min', bounceRate: '20%' },
  { id: '10', url: '/support', views: '31K', avgTime: '4.8 min', bounceRate: '15%' },
];

export const mockSessionAnalyticsData: SessionAnalyticsData = {
  stats: mockSessionStats,
  trafficSources: mockTrafficSources,
  devices: mockDevices,
  topPages: mockTopPages,
};
