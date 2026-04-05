'use client';

import { useEffect, useState } from 'react';
import { cn } from '../lib/utils';

export interface CountdownTimerProps {
  endDate: Date;
  title?: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(endDate: Date): TimeLeft | null {
  const diff = endDate.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export function CountdownTimer({ endDate, title, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => calcTimeLeft(endDate));

  useEffect(() => {
    const id = setInterval(() => {
      const next = calcTimeLeft(endDate);
      setTimeLeft(next);
      if (!next) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (!timeLeft) return null;

  const boxes: { value: number; label: string }[] = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Mins' },
    { value: timeLeft.seconds, label: 'Secs' },
  ];

  return (
    <div className={cn(className)}>
      {title && (
        <p className="text-xs font-bold uppercase tracking-widest text-orange-200 mb-2">
          {title}
        </p>
      )}
      <div className="flex gap-3">
        {boxes.map((box) => (
          <div
            key={box.label}
            className="bg-white/15 backdrop-blur rounded-lg px-4 py-2 text-center"
          >
            <p className="text-2xl font-bold text-white">{pad(box.value)}</p>
            <p className="text-[10px] text-orange-200 uppercase">{box.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
