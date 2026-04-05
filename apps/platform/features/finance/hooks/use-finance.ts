'use client';

import { useQuery } from '@tanstack/react-query';
import type { FinanceDashboardData } from '../types';
import { MOCK_FINANCE_DASHBOARD } from '../services/mock-data';

// ----------------------------------------------------------------
// Finance Dashboard hook
//
// Currently returns mock data. When backend endpoints are ready,
// replace the queryFn body with real API calls. The component
// contract stays the same — FinanceDashboardData.
// ----------------------------------------------------------------

export function useFinanceDashboard(_range: string = '30D') {
  return useQuery<FinanceDashboardData>({
    queryKey: ['finance-dashboard', _range],
    queryFn: async () => {
      // Simulate network latency
      await new Promise((r) => setTimeout(r, 300));
      return MOCK_FINANCE_DASHBOARD;
    },
    staleTime: 30_000,
  });
}
