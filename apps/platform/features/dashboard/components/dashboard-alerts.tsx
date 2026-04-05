'use client';

import { useState } from 'react';
import { Skeleton } from '@homebase/ui';
import { cn } from '@homebase/ui/src/lib/utils';

import { useDashboardAlerts } from '../hooks/use-dashboard';
import type { AlertSeverity } from '../types';
import { AlertCard } from './alert-card';

type FilterTab = 'all' | AlertSeverity;

const TEXT = {
  title: 'Platform Alerts',
} as const;

const TABS: { key: FilterTab; label: string; style: string }[] = [
  { key: 'all', label: 'All', style: '' },
  { key: 'p0', label: 'P0 Critical', style: 'text-red-600 border border-red-200' },
  { key: 'p1', label: 'P1 Warning', style: 'text-amber-600 border border-amber-200' },
  { key: 'p2', label: 'P2 Info', style: 'text-blue-600 border border-blue-200' },
];

export function AlertsSkeleton() {
  return <Skeleton className="h-[300px] w-full rounded-xl" />;
}

export function DashboardAlerts() {
  const { data: alerts, isLoading } = useDashboardAlerts();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  if (isLoading || !alerts) return <AlertsSkeleton />;

  const filtered = activeTab === 'all' ? alerts : alerts.filter((a) => a.severity === activeTab);
  const counts = {
    all: alerts.length,
    p0: alerts.filter((a) => a.severity === 'p0').length,
    p1: alerts.filter((a) => a.severity === 'p1').length,
    p2: alerts.filter((a) => a.severity === 'p2').length,
  };

  return (
    <section aria-label="Platform alerts">
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            <h2 className="text-lg font-semibold text-gray-900">{TEXT.title}</h2>
          </div>
          <div className="flex items-center gap-1.5">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-medium transition',
                  activeTab === tab.key
                    ? 'bg-brand-500 text-white'
                    : tab.style || 'text-gray-600 hover:bg-gray-100',
                )}
              >
                {tab.label} ({counts[tab.key]})
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3 px-6 py-4">
          {filtered.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-400">No alerts</p>
          )}
        </div>
      </div>
    </section>
  );
}
