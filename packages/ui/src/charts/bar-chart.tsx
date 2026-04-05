'use client';

import { useEffect, useState } from 'react';

import { cn } from '../lib/utils';

export interface BarChartDataPoint {
  /** X-axis label (e.g. month name) */
  label: string;
  /** Numeric value for the primary bar */
  value: number;
  /** Optional target/comparison value (renders as a secondary bar) */
  target?: number;
}

export interface BarChartProps {
  /** Data points to render as bars */
  data: BarChartDataPoint[];
  /** Chart height in pixels (default 280) */
  height?: number;
  /** Additional class names merged onto the root element */
  className?: string;
}

function formatYLabel(n: number): string {
  if (n >= 10_000_000) return `${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `${(n / 100_000).toFixed(1)}L`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString('en-IN');
}

export function BarChart({
  data,
  height = 280,
  className,
}: BarChartProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (data.length === 0) {
    return (
      <div
        className={cn('flex items-center justify-center rounded-xl bg-gray-50/50 text-sm text-gray-400', className)}
        style={{ height }}
      >
        No data available
      </div>
    );
  }

  const hasTargets = data.some((d) => d.target != null && d.target > 0);
  const maxValue = Math.max(
    ...data.map((d) => Math.max(d.value, d.target ?? 0)),
    1,
  );

  // 5 Y-axis labels
  const yLabels: number[] = [];
  for (let i = 5; i >= 0; i--) {
    yLabels.push(Math.round((maxValue / 5) * i));
  }

  const barAreaHeight = height - 64;

  return (
    <div className={cn('relative', className)} style={{ height }}>
      {/* Horizontal grid lines */}
      <div className="absolute inset-0 ml-12 mr-2 mt-2" style={{ height: barAreaHeight }}>
        {yLabels.map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t border-gray-100"
            style={{ top: `${(i / 5) * 100}%` }}
          />
        ))}
      </div>

      <div className="flex h-full">
        {/* Y-axis labels */}
        <div className="flex w-12 flex-col justify-between pb-8 pt-0 pr-2">
          {yLabels.map((label, i) => (
            <span key={i} className="text-right text-[10px] font-medium text-gray-400 leading-none">
              {formatYLabel(label)}
            </span>
          ))}
        </div>

        {/* Chart area */}
        <div className="flex flex-1 items-end gap-1 pb-8 pt-2">
          {data.map((point, idx) => {
            const valuePct = maxValue > 0 ? (point.value / maxValue) * 100 : 0;
            const targetPct =
              point.target != null && maxValue > 0
                ? (point.target / maxValue) * 100
                : 0;

            return (
              <div key={point.label} className="group flex flex-1 flex-col items-center gap-1.5">
                {/* Bars container */}
                <div
                  className="relative flex w-full items-end justify-center gap-[2px]"
                  style={{ height: barAreaHeight }}
                >
                  {/* Target bar (lighter) */}
                  {hasTargets && (
                    <div
                      className="w-[42%] rounded-t-[4px] bg-orange-200 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
                      style={{
                        height: animate ? `${targetPct}%` : '0%',
                        transitionDelay: `${idx * 40}ms`,
                      }}
                    />
                  )}
                  {/* Value bar (primary) */}
                  <div
                    className={cn(
                      'rounded-t-[4px] bg-orange-500 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]',
                      hasTargets ? 'w-[42%]' : 'w-[65%]',
                    )}
                    style={{
                      height: animate ? `${valuePct}%` : '0%',
                      transitionDelay: `${idx * 40 + 80}ms`,
                    }}
                  />

                  {/* Tooltip on hover */}
                  <div className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1.5 text-[10px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 whitespace-nowrap">
                    {point.value.toLocaleString('en-IN')}
                    {point.target != null && (
                      <span className="text-gray-400"> / {point.target.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </div>

                {/* X-axis label */}
                <span className="text-[10px] font-medium text-gray-400">{point.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
