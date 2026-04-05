'use client';

import { useQuery } from '@tanstack/react-query';

import type { CampaignMgmt, CampaignMgmtStats } from '../types';
import {
  mockCampaignStats,
  mockCampaignList,
} from '../services/campaign-mock';

// ----------------------------------------------------------------
// Campaign Stats (4 stat cards)
// ----------------------------------------------------------------

export function useCampaignStats() {
  return useQuery<CampaignMgmtStats>({
    queryKey: ['campaign-mgmt-stats'],
    queryFn: async () => {
      // TODO: replace with real API call when backend is ready
      await new Promise((r) => setTimeout(r, 400));
      return mockCampaignStats;
    },
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// Campaign List (filterable by channel)
// ----------------------------------------------------------------

export function useCampaignList(channelFilter?: string) {
  return useQuery<CampaignMgmt[]>({
    queryKey: ['campaign-mgmt-list', channelFilter],
    queryFn: async () => {
      // TODO: replace with real API call when backend is ready
      await new Promise((r) => setTimeout(r, 400));
      if (!channelFilter || channelFilter === 'All') {
        return mockCampaignList;
      }
      return mockCampaignList.filter((c) => c.channel === channelFilter);
    },
    staleTime: 30_000,
  });
}
