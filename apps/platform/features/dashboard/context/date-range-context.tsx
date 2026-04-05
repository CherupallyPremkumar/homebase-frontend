'use client';

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';

import type { DateRange } from '../types';

function today(): string {
  return new Date().toISOString().split('T')[0]!;
}

export interface DateRangeContextValue {
  dateRange: DateRange;
}

const DateRangeContext = createContext<DateRangeContextValue | null>(null);

export function DateRangeProvider({ children }: { children: ReactNode }) {
  const todayStr = today();

  const value = useMemo<DateRangeContextValue>(
    () => ({ dateRange: { from: todayStr, to: todayStr } }),
    [todayStr],
  );

  return (
    <DateRangeContext.Provider value={value}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange(): DateRangeContextValue {
  const ctx = useContext(DateRangeContext);
  if (!ctx) {
    throw new Error('useDateRange must be used within a <DateRangeProvider>');
  }
  return ctx;
}
