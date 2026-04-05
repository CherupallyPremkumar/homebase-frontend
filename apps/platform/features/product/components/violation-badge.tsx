interface ViolationBadgeProps {
  count: number;
}

export function ViolationBadge({ count }: ViolationBadgeProps) {
  if (count === 0) {
    return <span className="text-sm text-gray-400">0</span>;
  }

  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700 animate-[violationPulse_2s_ease-in-out_infinite]">
      {count}
    </span>
  );
}
