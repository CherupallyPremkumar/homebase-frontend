'use client';

import { cn } from '../lib/utils';

export interface DonutSegment {
  /** Label for the legend */
  label: string;
  /** Numeric value */
  value: number;
  /** CSS color for the segment (e.g. "#F97316", "rgb(59,130,246)") */
  color: string;
}

export interface DonutChartProps {
  /** Segments to render in the donut */
  segments: DonutSegment[];
  /** Diameter of the SVG in pixels (default 200) */
  size?: number;
  /** Additional class names merged onto the root element */
  className?: string;
}

export function DonutChart({
  segments,
  size = 200,
  className,
}: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) return null;

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 12;

  // Calculate stroke-dasharray and rotation for each segment
  let cumulativeAngle = 0;
  const arcs = segments.map((segment) => {
    const fraction = segment.value / total;
    const dashLength = fraction * circumference;
    const gapLength = circumference - dashLength;
    const rotation = cumulativeAngle;
    cumulativeAngle += fraction * 360;

    return {
      ...segment,
      dasharray: `${dashLength} ${gapLength}`,
      rotation,
    };
  });

  // Format total for center display
  const formattedTotal =
    total >= 1000
      ? `${(total / 1000).toFixed(total >= 10000 ? 1 : 1)}K`
      : total.toLocaleString('en-IN');

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* SVG Donut */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="-rotate-90"
          viewBox="0 0 100 100"
          width={size}
          height={size}
        >
          {/* Background ring */}
          <circle
            cx={50}
            cy={50}
            r={radius}
            fill="none"
            stroke="#F3F4F6"
            strokeWidth={strokeWidth}
          />

          {/* Segments */}
          {arcs.map((arc, i) => (
            <circle
              key={i}
              cx={50}
              cy={50}
              r={radius}
              fill="none"
              stroke={arc.color}
              strokeWidth={strokeWidth}
              strokeDasharray={arc.dasharray}
              strokeLinecap="round"
              transform={`rotate(${arc.rotation}, 50, 50)`}
            />
          ))}
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-gray-900">{formattedTotal}</span>
          <span className="text-[10px] text-gray-400">Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-2">
            <div
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-sm text-gray-600">{segment.label}</span>
            <span className="text-sm font-semibold text-gray-900">
              {segment.value.toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
