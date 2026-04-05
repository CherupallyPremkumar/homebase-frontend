import { cn } from '@homebase/ui/src/lib/utils';

import type { PipelineStage } from '../types';

const COLOR_MAP: Record<string, { border: string; bg: string; label: string; count: string }> = {
  blue: { border: 'border-blue-200', bg: 'bg-blue-50/60', label: 'text-blue-600', count: 'text-blue-800' },
  indigo: { border: 'border-indigo-200', bg: 'bg-indigo-50/60', label: 'text-indigo-600', count: 'text-indigo-800' },
  violet: { border: 'border-violet-200', bg: 'bg-violet-50/60', label: 'text-violet-600', count: 'text-violet-800' },
  purple: { border: 'border-purple-200', bg: 'bg-purple-50/60', label: 'text-purple-600', count: 'text-purple-800' },
  amber: { border: 'border-amber-200', bg: 'bg-amber-50/60', label: 'text-amber-700', count: 'text-amber-800' },
  green: { border: 'border-green-200', bg: 'bg-green-50/60', label: 'text-green-700', count: 'text-green-800' },
};

interface PipelineStageCardProps {
  stage: PipelineStage;
  showArrow: boolean;
}

export function PipelineStageCard({ stage, showArrow }: PipelineStageCardProps) {
  const colors = COLOR_MAP[stage.colorScheme] ?? COLOR_MAP.blue;

  return (
    <div
      className={cn(
        'relative min-w-[140px] flex-1 rounded-xl border p-4 text-center transition-all hover:-translate-y-px hover:shadow-md',
        colors.border,
        colors.bg,
      )}
    >
      <p className={cn('text-[10px] font-semibold uppercase tracking-wider', colors.label)}>
        {stage.label}
      </p>
      <p className={cn('text-2xl font-bold', colors.count)}>
        {stage.count.toLocaleString('en-IN')}
      </p>
      {stage.breachLabel && (
        <div className="mt-2">
          <span
            className={cn(
              'rounded px-1.5 py-0.5 text-[9px] font-semibold',
              stage.breachCount && stage.breachCount > 5
                ? 'bg-red-100 text-red-600'
                : 'bg-amber-100 text-amber-600',
            )}
          >
            {stage.breachLabel}
          </span>
        </div>
      )}
      {!stage.breachLabel && stage.colorScheme === 'green' && (
        <div className="mt-2">
          <span className="rounded bg-green-100 px-1.5 py-0.5 text-[9px] font-semibold text-green-600">
            Today
          </span>
        </div>
      )}

      {showArrow && (
        <div
          className="absolute -right-2.5 top-1/2 -translate-y-1/2"
          aria-hidden="true"
        >
          <div className="h-0 w-0 border-b-[6px] border-l-[6px] border-t-[6px] border-b-transparent border-l-gray-300 border-t-transparent" />
        </div>
      )}
    </div>
  );
}
