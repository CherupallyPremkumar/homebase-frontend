'use client';

import { useQuery } from '@tanstack/react-query';

import type { CmsData } from '../types';
import { mockCmsData } from '../services/mock-data';

// ----------------------------------------------------------------
// CMS Data (all tabs: banners, pages, announcements)
// ----------------------------------------------------------------

export function useCmsData() {
  return useQuery<CmsData>({
    queryKey: ['cms-data'],
    queryFn: async (): Promise<CmsData> => {
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 600));
      return mockCmsData;
    },
    staleTime: 30_000,
  });
}
