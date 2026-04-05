'use client';

import Link from 'next/link';
import { Skeleton } from '@homebase/ui';

import { useDashboardFunnel } from '../hooks/use-dashboard';

const TEXT = {
  title: 'Conversion Funnel (Today)',
  fullAnalytics: 'Full Analytics',
  cartAbandonment: 'Cart Abandonment Rate: 50.0%',
} as const;

export function FunnelSkeleton() {
  return <Skeleton className="h-[380px] w-full rounded-xl" />;
}

export function ConversionFunnel() {
  const { data: stages, isLoading } = useDashboardFunnel();

  if (isLoading || !stages) return <FunnelSkeleton />;

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">{TEXT.title}</h2>
        <Link href="/analytics" className="text-xs font-medium text-brand-500 transition hover:text-brand-600">
          {TEXT.fullAnalytics}
        </Link>
      </div>
      <div className="space-y-4 px-6 py-5">
        {stages.map((stage) => (
          <div key={stage.label}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{stage.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  {stage.value.toLocaleString('en-IN')}
                </span>
                <span className={`text-[10px] font-medium ${stage.changeVsYesterday.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
                  {stage.changeVsYesterday}
                </span>
              </div>
            </div>
            <div className="h-7 overflow-hidden rounded-lg bg-gray-100">
              <div
                className={`flex h-full items-center rounded-lg ${stage.barColor}`}
                style={{ width: `${stage.percentage}%` }}
              >
                {stage.percentage >= 10 && (
                  <span className="pl-3 text-[10px] font-bold text-white">
                    {stage.percentage}%
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Cart Abandonment Alert */}
        <div className="mt-2 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5">
          <svg className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <span className="text-xs font-medium text-amber-700">{TEXT.cartAbandonment}</span>
        </div>
      </div>
    </div>
  );
}
