import { cn } from '../lib/utils';

export interface PriceBadgeProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  discount?: number;
  className?: string;
}

export function PriceBadge({
  price,
  originalPrice,
  currency = '\u20B9',
  discount,
  className,
}: PriceBadgeProps) {
  const computedDiscount =
    discount ??
    (originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined);

  return (
    <div className={cn('flex items-end gap-3', className)}>
      <span className="text-2xl font-bold text-brand-600">
        {currency}
        {price.toLocaleString('en-IN')}
      </span>

      {originalPrice !== undefined && originalPrice > price && (
        <span className="text-base text-gray-400 line-through">
          {currency}
          {originalPrice.toLocaleString('en-IN')}
        </span>
      )}

      {computedDiscount !== undefined && computedDiscount > 0 && (
        <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
          Save {computedDiscount}%
        </span>
      )}
    </div>
  );
}
