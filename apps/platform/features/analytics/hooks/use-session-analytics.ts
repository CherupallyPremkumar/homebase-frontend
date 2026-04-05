'use client';

import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';
import type { SearchResponse } from '@homebase/types';

import type {
  SessionAnalyticsData,
  SessionStats,
  TrafficSource,
  DeviceBreakdown,
  TopPage,
} from '../services/session-mock';

// ----------------------------------------------------------------
// Backend row types
// ----------------------------------------------------------------

interface SessionStatsRow {
  activeSessions?: number;
  avgSessionDuration?: number;
  bounceRate?: number;
  pagesPerSession?: number;
}

interface TrafficSourceRow {
  source: string;
  sessions: number;
  percentage: number;
}

interface DeviceRow {
  device: string;
  sessions: number;
  percentage: number;
}

interface TopPageRow {
  id: string;
  url: string;
  views: number;
  avgTime: number;
  bounceRate: number;
}

// ----------------------------------------------------------------
// Adapters
// ----------------------------------------------------------------

const TRAFFIC_COLORS = ['bg-orange-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500'];
const DEVICE_COLORS = ['bg-orange-500', 'bg-blue-500', 'bg-purple-500'];

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

function adaptSessionData(
  statsRes: SearchResponse<SessionStatsRow>,
  trafficRes: SearchResponse<TrafficSourceRow>,
  deviceRes: SearchResponse<DeviceRow>,
  pagesRes: SearchResponse<TopPageRow>,
): SessionAnalyticsData {
  const statsRow = statsRes.list?.[0]?.row;
  const stats: SessionStats = {
    activeSessions: statsRow?.activeSessions ?? 0,
    activeSessionsTrend: 0,
    avgSessionDuration: statsRow?.avgSessionDuration ? `${statsRow.avgSessionDuration.toFixed(1)} min` : '0 min',
    avgSessionDurationTrend: 0,
    bounceRate: statsRow?.bounceRate ?? 0,
    bounceRateTrend: 0,
    pagesPerSession: statsRow?.pagesPerSession ?? 0,
    pagesPerSessionTrend: 0,
  };

  const trafficSources: TrafficSource[] = (trafficRes.list ?? []).map((item, i) => ({
    source: item.row.source,
    sessions: item.row.sessions,
    percentage: item.row.percentage,
    color: TRAFFIC_COLORS[i % TRAFFIC_COLORS.length]!,
  }));

  const devices: DeviceBreakdown[] = (deviceRes.list ?? []).map((item, i) => ({
    device: item.row.device,
    sessions: item.row.sessions,
    percentage: item.row.percentage,
    color: DEVICE_COLORS[i % DEVICE_COLORS.length]!,
  }));

  const topPages: TopPage[] = (pagesRes.list ?? []).map((item) => ({
    id: item.row.id,
    url: item.row.url,
    views: formatViews(item.row.views),
    avgTime: `${item.row.avgTime.toFixed(1)} min`,
    bounceRate: `${item.row.bounceRate}%`,
  }));

  return { stats, trafficSources, devices, topPages };
}

// ----------------------------------------------------------------
// Session Analytics hook
// ----------------------------------------------------------------

export function useSessionAnalytics(range: string = '7D') {
  return useQuery<SessionAnalyticsData>({
    queryKey: ['session-analytics', range],
    queryFn: async () => {
      const client = getApiClient();
      const params = { pageNum: 1, pageSize: 20, filters: { range } };

      const [statsRes, trafficRes, deviceRes, pagesRes] = await Promise.all([
        client.post<SearchResponse<SessionStatsRow>>('/analytics/Analytics.getSessionStats', { pageNum: 1, pageSize: 1 }),
        client.post<SearchResponse<TrafficSourceRow>>('/analytics/Analytics.getTrafficSources', params),
        client.post<SearchResponse<DeviceRow>>('/analytics/Analytics.getDeviceBreakdown', params),
        client.post<SearchResponse<TopPageRow>>('/analytics/Analytics.getTopPages', params),
      ]);

      return adaptSessionData(statsRes, trafficRes, deviceRes, pagesRes);
    },
    staleTime: 30_000,
  });
}
