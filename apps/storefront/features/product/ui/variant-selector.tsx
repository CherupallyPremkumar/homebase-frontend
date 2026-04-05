'use client';

import { useState } from 'react';
import { cn } from '@homebase/ui';

interface VariantSelectorProps {
  label: string;
  options: string[];
  defaultIndex?: number;
  onChange?: (variant: string) => void;
}

export function VariantSelector({ label, options, defaultIndex = 0, onChange }: VariantSelectorProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    onChange?.(options[index]!);
  };

  return (
    <div className="mb-5">
      <p className="mb-3 text-sm font-semibold text-navy-900">{label}</p>
      <div className="flex items-center gap-2">
        {options.map((option, i) => (
          <button
            key={option}
            onClick={() => handleSelect(i)}
            className={cn(
              'rounded-lg border-2 px-4 py-2 text-sm font-medium transition',
              i === activeIndex
                ? 'border-brand-400 bg-brand-50 text-brand-600'
                : 'border-gray-200 text-gray-600 hover:border-brand-500 hover:text-brand-600'
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
