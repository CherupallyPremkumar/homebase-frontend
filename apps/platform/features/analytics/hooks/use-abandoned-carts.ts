'use client';

import { useQuery } from '@tanstack/react-query';

import {
  mockAbandonedCartsData,
  type AbandonedCartsData,
  type AbandonedCartStats,
} from '../services/abandoned-carts-mock';

// ----------------------------------------------------------------
// Abandoned Carts data hook
// ----------------------------------------------------------------

export function useAbandonedCarts() {
  return useQuery<AbandonedCartsData>({
    queryKey: ['abandoned-carts'],
    queryFn: async () => {
      // TODO: Replace with real API call when backend is ready
      await new Promise((r) => setTimeout(r, 400));
      return mockAbandonedCartsData;
    },
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// Stats-only hook (can be used independently on dashboards)
// ----------------------------------------------------------------

export function useAbandonedCartStats() {
  return useQuery<AbandonedCartStats>({
    queryKey: ['abandoned-cart-stats'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return mockAbandonedCartsData.stats;
    },
    staleTime: 30_000,
  });
}
