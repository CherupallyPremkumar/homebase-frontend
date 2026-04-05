interface StackedBarSegment {
  label: string;
  percentage: number;
  color: string;
}

interface StackedBarProps {
  segments: StackedBarSegment[];
  height?: string;
}

export function StackedBar({ segments, height = 'h-8' }: StackedBarProps) {
  return (
    <div className={`flex overflow-hidden rounded-lg ${height}`}>
      {segments.map((seg) => (
        <div
          key={seg.label}
          className={`flex items-center justify-center ${seg.color}`}
          style={{ width: `${seg.percentage}%` }}
        >
          {seg.percentage >= 8 && (
            <span className="text-[10px] font-bold text-white">
              {seg.label} {seg.percentage}%
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
