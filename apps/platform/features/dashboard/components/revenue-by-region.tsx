'use client';

import Link from 'next/link';
import { Skeleton } from '@homebase/ui';

import { useDashboardRegions } from '../hooks/use-dashboard';

const TEXT = {
  title: 'Revenue by Region',
  fullReport: 'Full Report',
  statesActive: 'States Active',
  citiesServed: 'Cities Served',
  tier1Share: 'Tier-1 Share',
} as const;

export function RegionSkeleton() {
  return <Skeleton className="h-[400px] w-full rounded-xl" />;
}

export function RevenueByRegion() {
  const { data, isLoading } = useDashboardRegions();

  if (isLoading || !data) return <RegionSkeleton />;

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">{TEXT.title}</h2>
        <Link href="/analytics" className="text-xs font-medium text-brand-500 transition hover:text-brand-600">
          {TEXT.fullReport}
        </Link>
      </div>
      <div className="space-y-4 px-6 py-5">
        {data.regions.map((region) => (
          <div key={region.name}>
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">{region.name}</span>
                <span className="text-[10px] text-gray-400">{region.orders}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900">{region.revenue}</span>
                <span className="text-[10px] font-medium text-green-600">{region.growth}</span>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full ${region.barColor}`}
                style={{ width: `${region.barPercent}%` }}
              />
            </div>
          </div>
        ))}

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-4 text-center">
          <div>
            <p className="text-lg font-bold text-gray-900">{data.summary.statesActive}</p>
            <p className="text-[10px] text-gray-400">{TEXT.statesActive}</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{data.summary.citiesServed}</p>
            <p className="text-[10px] text-gray-400">{TEXT.citiesServed}</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{data.summary.tier1Share}</p>
            <p className="text-[10px] text-gray-400">{TEXT.tier1Share}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
