'use client';

import { useState } from 'react';
import { cn } from '@homebase/ui';

export interface ColorOption {
  name: string;
  bgClass: string;
}

interface ColorSwatchesProps {
  colors: ColorOption[];
  defaultIndex?: number;
  onChange?: (color: ColorOption) => void;
}

export function ColorSwatches({ colors, defaultIndex = 0, onChange }: ColorSwatchesProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    onChange?.(colors[index]!);
  };

  return (
    <div className="mb-5">
      <p className="mb-3 text-sm font-semibold text-navy-900">
        Color: <span className="font-normal text-gray-500">{colors[activeIndex]?.name}</span>
      </p>
      <div className="flex items-center gap-3">
        {colors.map((color, i) => (
          <button
            key={color.name}
            onClick={() => handleSelect(i)}
            title={color.name}
            className={cn(
              'h-9 w-9 rounded-full border-2 transition-transform hover:scale-110',
              color.bgClass,
              i === activeIndex
                ? 'ring-2 ring-brand-500 ring-offset-2'
                : 'border-gray-200'
            )}
            aria-label={color.name}
          />
        ))}
      </div>
    </div>
  );
}
