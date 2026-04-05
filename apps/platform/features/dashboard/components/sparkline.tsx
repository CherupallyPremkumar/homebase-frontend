import { cn } from '@homebase/ui/src/lib/utils';

interface SparklineProps {
  data: number[];
  color: string;
  height?: number;
  barWidth?: number;
  className?: string;
}

export function Sparkline({
  data,
  color,
  height = 20,
  barWidth = 3,
  className,
}: SparklineProps) {
  const max = Math.max(...data, 1);

  return (
    <div
      className={cn('inline-flex items-end gap-px', className)}
      style={{ height }}
      aria-hidden="true"
    >
      {data.map((value, i) => (
        <div
          key={i}
          className={cn('rounded-[1px]', color)}
          style={{
            width: barWidth,
            height: Math.max(2, (value / max) * height),
            transition: 'height 0.3s ease',
          }}
        />
      ))}
    </div>
  );
}
