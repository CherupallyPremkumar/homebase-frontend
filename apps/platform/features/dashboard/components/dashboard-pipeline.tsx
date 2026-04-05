'use client';

import Link from 'next/link';
import { ListFilter } from 'lucide-react';
import { Skeleton } from '@homebase/ui';

import { useDashboardPipeline } from '../hooks/use-dashboard';
import { PipelineStageCard } from './pipeline-stage-card';

const TEXT = {
  title: 'Order Pipeline',
  viewAll: 'View All Orders',
} as const;

export function PipelineSkeleton() {
  return <Skeleton className="h-[180px] w-full rounded-xl" />;
}

export function DashboardPipeline() {
  const { data, isLoading } = useDashboardPipeline();

  if (isLoading || !data) return <PipelineSkeleton />;

  return (
    <section aria-label="Order pipeline">
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListFilter className="h-5 w-5 text-navy-700" />
            <h2 className="text-lg font-semibold text-gray-900">{TEXT.title}</h2>
          </div>
          <Link
            href="/orders"
            className="text-xs font-medium text-brand-500 transition hover:text-brand-600"
          >
            {TEXT.viewAll}
          </Link>
        </div>

        {/* Pipeline Stages */}
        <div className="mb-5 flex items-stretch gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {data.stages.map((stage, i) => (
            <PipelineStageCard
              key={stage.label}
              stage={stage}
              showArrow={i < data.stages.length - 1}
            />
          ))}
        </div>

        {/* Pipeline Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-xs font-medium text-red-700">
              Cancellation {data.cancellationRate}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-xs font-medium text-amber-700">
              RTO {data.rtoRate}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span className="text-xs font-medium text-orange-700">
              Returns {data.returnRate}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
