'use client';

import { useQuery } from '@tanstack/react-query';

import type { ProfilePageResponse } from '../types';
import { mockProfilePage } from '../services/mock-data';

// ----------------------------------------------------------------
// Profile Page Data
// ----------------------------------------------------------------

export function useProfilePage() {
  return useQuery<ProfilePageResponse>({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      // TODO: Replace with real API call when backend endpoints are ready.
      // const response = await usersApi.getProfile();
      // return adaptResponse(response);
      return mockProfilePage;
    },
    staleTime: 60_000,
  });
}
