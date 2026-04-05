'use client';

import { cn } from '@homebase/ui/src/lib/utils';

import { useDashboardCommandStrip } from '../hooks/use-dashboard';
import { CommandMetric } from './command-metric';

const TEXT = {
  system: 'System',
} as const;

const STATUS_COLOR: Record<string, string> = {
  up: 'bg-green-400',
  degraded: 'bg-amber-400',
  down: 'bg-red-400',
};

export function CommandStripSkeleton() {
  return (
    <div className="sticky top-16 z-30 -mx-6 -mt-6 mb-6 lg:-mx-8 lg:-mt-8">
      <div className="animate-pulse border-b border-navy-700 bg-navy-900 px-6 py-4" />
    </div>
  );
}

export function DashboardCommandStrip() {
  const { data } = useDashboardCommandStrip();

  if (!data) return <CommandStripSkeleton />;

  return (
    <div className="sticky top-16 z-30 -mx-6 -mt-6 mb-6 lg:-mx-8 lg:-mt-8">
      <div className="overflow-x-auto border-b border-navy-700 bg-navy-900 px-6 py-2.5 scrollbar-hide">
        <div className="flex items-center justify-between gap-4">
          {data.metrics.map((metric, i) => (
            <div key={metric.label} className="flex items-center gap-4">
              {i > 0 && <div className="h-8 w-px bg-white/10" />}
              <CommandMetric metric={metric} />
            </div>
          ))}

          <div className="h-8 w-px bg-white/10" />

          {/* System Health */}
          <div className="flex items-center gap-3 rounded-lg px-3 py-1.5">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                {TEXT.system}
              </p>
              <div className="mt-1 flex items-center gap-2">
                {data.services.map((svc) => (
                  <div key={svc.name} className="flex items-center gap-1">
                    <span
                      className={cn(
                        'h-2 w-2 rounded-full animate-pulse',
                        STATUS_COLOR[svc.status] ?? 'bg-gray-400',
                      )}
                    />
                    <span className="text-[9px] text-gray-300">{svc.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
