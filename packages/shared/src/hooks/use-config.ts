'use client';

import { useQuery } from '@tanstack/react-query';
import { cconfigApi } from '@homebase/api-client';
import { useConfigStore } from '../stores/config-store';
import { CACHE_TIMES } from '../lib/constants';

export function useConfig(key: string) {
  const { getConfig, setConfig, isStale } = useConfigStore();

  const cached = getConfig(key);

  const query = useQuery({
    queryKey: ['cconfig', key],
    queryFn: async () => {
      const config = await cconfigApi.getByKey(key);
      setConfig(key, config.value);
      return config.value;
    },
    ...CACHE_TIMES.cconfig,
    enabled: isStale(key),
    initialData: cached ?? undefined,
    retry: 1,
  });

  return {
    value: cached ?? query.data ?? null,
    isLoading: query.isLoading && !cached,
    error: query.error,
  };
}
