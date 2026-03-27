'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { SessionProvider } from './session-provider';
import { SessionGuard } from './session-guard';

export interface CreateProvidersOptions {
  refetchOnWindowFocus?: boolean;
  retry?: number;
  staleTime?: number;
}

export function createProviders(options: CreateProvidersOptions = {}) {
  const {
    refetchOnWindowFocus = false,
    retry = 2,
    staleTime = 30_000,
  } = options;

  function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
      () =>
        new QueryClient({
          defaultOptions: {
            queries: {
              refetchOnWindowFocus,
              retry,
              staleTime,
            },
          },
        }),
    );

    return (
      <SessionProvider>
        <SessionGuard />
        <QueryClientProvider client={queryClient}>
          <NuqsAdapter>{children}</NuqsAdapter>
        </QueryClientProvider>
      </SessionProvider>
    );
  }

  Providers.displayName = 'Providers';
  return Providers;
}
