import type { CommandMetric as CommandMetricType } from '../types';
import { Sparkline } from './sparkline';

interface CommandMetricProps {
  metric: CommandMetricType;
}

export function CommandMetric({ metric }: CommandMetricProps) {
  return (
    <div className="cmd-metric flex items-center gap-3 rounded-lg px-3 py-1.5 transition-all hover:bg-white/[0.08]">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
          {metric.label}
        </p>
        <p className="text-base font-bold text-white">{metric.value}</p>
      </div>
      <Sparkline
        data={metric.sparklineData}
        color={metric.sparklineColor}
        height={20}
        barWidth={3}
      />
      {metric.trend && (
        <span className="text-[10px] font-semibold text-green-400">
          {metric.trend}
        </span>
      )}
      {metric.trendLabel && (
        <span className="text-[10px] font-semibold text-green-400">
          {metric.trendLabel}
        </span>
      )}
    </div>
  );
}
