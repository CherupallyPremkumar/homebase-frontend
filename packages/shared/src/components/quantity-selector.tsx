'use client';

import { useState, useCallback } from 'react';
import { Button } from '@homebase/ui';
import { Minus, Plus } from 'lucide-react';
import { useThrottle } from '../hooks/use-throttle';
import { cn } from '@homebase/ui/src/lib/utils';

interface QuantitySelectorProps {
  value: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 10,
  disabled = false,
  className,
}: QuantitySelectorProps) {
  const throttledOnChange = useThrottle(onChange, 500);

  const increment = useCallback(() => {
    if (value < max) throttledOnChange(value + 1);
  }, [value, max, throttledOnChange]);

  const decrement = useCallback(() => {
    if (value > min) throttledOnChange(value - 1);
  }, [value, min, throttledOnChange]);

  return (
    <div className={cn('inline-flex items-center rounded-md border', className)}>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-r-none"
        onClick={decrement}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="flex h-9 w-10 items-center justify-center border-x text-sm font-medium">
        {value}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-l-none"
        onClick={increment}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
