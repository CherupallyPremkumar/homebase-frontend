'use client';

import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@homebase/api-client';
import { CACHE_TIMES } from '@homebase/shared';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => usersApi.getProfile(),
    ...CACHE_TIMES.userProfile,
  });
}
