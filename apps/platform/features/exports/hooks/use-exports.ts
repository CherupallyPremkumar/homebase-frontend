'use client';

import { useQuery } from '@tanstack/react-query';

import type { ExportsPageResponse } from '../types';
import { mockExportsPage } from '../services/mock-data';

// ----------------------------------------------------------------
// Exports API
//
// Data exports are generated on the frontend from query results.
// The export metadata (available exports, schedules, history) is
// fetched from a reporting endpoint. Until that endpoint is deployed
// we return mock data so the UI renders correctly.
// ----------------------------------------------------------------

async function fetchExportsPage(): Promise<ExportsPageResponse> {
  // TODO: Replace with real API call when backend endpoint is deployed
  // return await getApiClient().post<ExportsPageResponse>(
  //   '/reporting/exports',
  //   { pageNum: 1, pageSize: 50 },
  // );
  return Promise.resolve(mockExportsPage);
}

// ----------------------------------------------------------------
// Exports Page Data
// ----------------------------------------------------------------

export function useExportsPage() {
  return useQuery<ExportsPageResponse>({
    queryKey: ['exports-page'],
    queryFn: fetchExportsPage,
    staleTime: 30_000,
  });
}
