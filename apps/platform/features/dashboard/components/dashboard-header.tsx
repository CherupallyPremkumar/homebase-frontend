'use client';

import { RefreshCw } from 'lucide-react';

const TEXT = {
  title: 'Platform Command Center',
  subtitle: 'Real-time platform operations overview',
  lastRefresh: 'Last refresh',
  refreshAgo: '12 seconds ago',
} as const;

export function DashboardHeader() {
  return (
    <section className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{TEXT.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{TEXT.subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-wider text-gray-400">
          {TEXT.lastRefresh}
        </span>
        <span className="text-xs font-semibold text-gray-600">
          {TEXT.refreshAgo}
        </span>
        <button
          onClick={() => window.location.reload()}
          className="ml-2 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          aria-label="Refresh dashboard"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
