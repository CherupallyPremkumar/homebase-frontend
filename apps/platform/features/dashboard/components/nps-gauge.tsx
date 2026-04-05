interface NpsGaugeProps {
  score: number;
}

export function NpsGauge({ score }: NpsGaugeProps) {
  const position = ((score + 100) / 200) * 100;

  return (
    <div>
      <div className="relative mb-2">
        <div className="h-4 overflow-hidden rounded-full bg-gradient-to-r from-red-400 via-amber-400 to-green-500" />
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${position}%` }}
        >
          <div className="h-6 w-6 rounded-full border-[3px] border-green-600 bg-white shadow-md" />
        </div>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[10px] text-gray-400">-100 (Detractors)</span>
        <span className="text-2xl font-bold text-green-600">{score}</span>
        <span className="text-[10px] text-gray-400">+100 (Promoters)</span>
      </div>
    </div>
  );
}
