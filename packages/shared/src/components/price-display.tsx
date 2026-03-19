'use client';

import { cn } from '@homebase/ui/src/lib/utils';
import { formatPriceRupees, calculateDiscount } from '../lib/format';

interface PriceDisplayProps {
  price: number;
  mrp?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: { price: 'text-sm font-semibold', mrp: 'text-xs', discount: 'text-xs' },
  md: { price: 'text-lg font-bold', mrp: 'text-sm', discount: 'text-sm' },
  lg: { price: 'text-2xl font-bold', mrp: 'text-base', discount: 'text-base' },
};

export function PriceDisplay({ price, mrp, size = 'md', className }: PriceDisplayProps) {
  const discount = mrp ? calculateDiscount(mrp, price) : 0;
  const classes = sizeClasses[size];

  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <span className={cn(classes.price, 'text-gray-900')}>
        {formatPriceRupees(price)}
      </span>
      {mrp && mrp > price && (
        <>
          <span className={cn(classes.mrp, 'text-gray-500 line-through')}>
            {formatPriceRupees(mrp)}
          </span>
          <span className={cn(classes.discount, 'font-medium text-green-600')}>
            {discount}% off
          </span>
        </>
      )}
    </div>
  );
}
