'use client';

import { useQuery } from '@tanstack/react-query';

import type { HealthDashboardResponse } from '../types';
import { mockHealthDashboard } from '../services/mock-data';

// ----------------------------------------------------------------
// Platform Health Dashboard
// Health metrics come from Spring Actuator (GET /actuator/health),
// not Chenile queries. Keeping mock until actuator proxy is wired.
// TODO: Replace with GET /api/proxy/actuator/health when available
// ----------------------------------------------------------------

export function useHealthDashboard() {
  return useQuery<HealthDashboardResponse>({
    queryKey: ['health-dashboard'],
    queryFn: async () => {
      return mockHealthDashboard;
    },
    staleTime: 10_000,
    refetchInterval: 30_000,
  });
}
