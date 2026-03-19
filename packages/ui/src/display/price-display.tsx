'use client';

import { cn } from '../lib/utils';

interface PriceDisplayProps {
  price: number;
  mrp?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const formatINR = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const sizeMap = {
  sm: { price: 'text-sm font-semibold', mrp: 'text-xs', discount: 'text-xs' },
  md: { price: 'text-base font-bold', mrp: 'text-sm', discount: 'text-sm' },
  lg: { price: 'text-lg font-bold', mrp: 'text-sm', discount: 'text-sm' },
};

export function PriceDisplay({ price, mrp, size = 'md', className }: PriceDisplayProps) {
  const discount = mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const s = sizeMap[size];

  return (
    <div className={cn('flex items-baseline gap-1.5', className)} aria-label={`Price ${formatINR(price)}`}>
      <span className={cn(s.price, 'text-gray-900')}>{formatINR(price)}</span>
      {mrp && mrp > price && (
        <>
          <span className={cn(s.mrp, 'text-gray-400 line-through')}>{formatINR(mrp)}</span>
          <span className={cn(s.discount, 'font-medium text-success-600')}>{discount}% off</span>
        </>
      )}
    </div>
  );
}
