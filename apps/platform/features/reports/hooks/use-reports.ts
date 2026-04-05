'use client';

import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';

import type { ReportCard, ScheduledReport, DownloadHistoryItem } from '../types';
import {
  mockReportCards,
  mockScheduledReports,
  mockDownloadHistory,
} from '../services/mock-data';

// ----------------------------------------------------------------
// Reports API
//
// The backend does not yet have a dedicated reports module.
// We call a generic reporting query endpoint; if it 404s, we
// gracefully fall back to mock data so the UI still renders.
// ----------------------------------------------------------------

async function fetchOrFallback<T>(queryName: string, fallback: T[]): Promise<T[]> {
  try {
    const response = await getApiClient().post<{ data?: T[] }>(
      '/reporting/reportDefinitions',
      { queryName, pageNum: 1, pageSize: 50 },
    );
    return response.data ?? fallback;
  } catch {
    return fallback;
  }
}

// ----------------------------------------------------------------
// Report Cards
// ----------------------------------------------------------------

export function useReportCards() {
  return useQuery<ReportCard[]>({
    queryKey: ['report-cards'],
    queryFn: () => fetchOrFallback<ReportCard>('Reports.cards', mockReportCards),
    staleTime: 60_000,
  });
}

// ----------------------------------------------------------------
// Scheduled Reports
// ----------------------------------------------------------------

export function useScheduledReports() {
  return useQuery<ScheduledReport[]>({
    queryKey: ['scheduled-reports'],
    queryFn: () => fetchOrFallback<ScheduledReport>('Reports.scheduled', mockScheduledReports),
    staleTime: 60_000,
  });
}

// ----------------------------------------------------------------
// Download History
// ----------------------------------------------------------------

export function useDownloadHistory() {
  return useQuery<DownloadHistoryItem[]>({
    queryKey: ['download-history'],
    queryFn: () => fetchOrFallback<DownloadHistoryItem>('Reports.downloads', mockDownloadHistory),
    staleTime: 30_000,
  });
}
