import type { ReactNode } from 'react';

import { ArrowDown, ArrowUp } from 'lucide-react';

import { cn } from '../lib/utils';

export interface StatCardProps {
  /** The metric label displayed below the value */
  title: string;
  /** The primary metric value */
  value: string | number;
  /** Icon rendered in the top-left badge */
  icon?: ReactNode;
  /** Trend percentage (e.g. 12.5 renders as "+12.5%" or "-12.5%") */
  trend?: number;
  /** Direction of the trend arrow */
  trendDirection?: 'up' | 'down';
  /**
   * Whether the current trend direction is positive for the business.
   * Defaults to true for 'up' and false for 'down'.
   * Set explicitly for inverse metrics (e.g. return rate where down is good).
   */
  trendIsPositive?: boolean;
  /** Secondary text shown below the value, if different from title */
  subtitle?: string;
  /** Progress bar fill value between 0 and 100 */
  progressBar?: number;
  /** Tailwind color class for the progress bar fill (e.g. "bg-blue-500") */
  progressColor?: string;
  /** Additional class names merged onto the root element */
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  trendDirection,
  trendIsPositive,
  subtitle,
  progressBar,
  progressColor = 'bg-brand-500',
  className,
}: StatCardProps) {
  // Resolve whether the trend is semantically positive (green) or negative (red).
  // By default, "up" is positive and "down" is negative, but callers can override
  // for inverse metrics like return rate or cancellation rate.
  const isPositive =
    trendIsPositive ?? (trendDirection === 'up' ? true : trendDirection === 'down' ? false : true);

  const clampedProgress =
    progressBar != null ? Math.max(0, Math.min(100, progressBar)) : undefined;

  return (
    <div
      className={cn(
        'rounded-xl border border-gray-100 bg-white p-5 shadow-sm',
        'transition-all duration-200 ease-in-out',
        'hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]',
        className
      )}
    >
      {/* Top row: title + icon/trend */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>

        <div className="flex items-center gap-2">
          {trend != null && trendDirection && (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold',
                isPositive
                  ? 'bg-green-50 text-green-600'
                  : 'bg-red-50 text-red-600'
              )}
            >
              {trendDirection === 'up' ? (
                <ArrowUp className="h-3 w-3" strokeWidth={2.5} />
              ) : (
                <ArrowDown className="h-3 w-3" strokeWidth={2.5} />
              )}
              {trendDirection === 'up' ? '+' : '-'}
              {Math.abs(trend)}%
            </span>
          )}

          {icon && (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">
              {icon}
            </div>
          )}
        </div>
      </div>

      {/* Value */}
      <p className="text-2xl font-bold text-gray-900">{value}</p>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
      )}

      {/* Optional progress bar */}
      {clampedProgress != null && (
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-gray-100">
          <div
            className={cn('h-full rounded-full', progressColor)}
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}
