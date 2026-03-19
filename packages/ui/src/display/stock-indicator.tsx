import { cn } from '../lib/utils';

interface StockIndicatorProps {
  inStock: boolean;
  quantity?: number;
  className?: string;
}

export function StockIndicator({ inStock, quantity, className }: StockIndicatorProps) {
  if (!inStock) {
    return <p className={cn('text-xs font-medium text-error-600', className)}>Out of Stock</p>;
  }
  if (quantity != null && quantity <= 5) {
    return <p className={cn('text-xs font-medium text-accent-600', className)}>Only {quantity} left</p>;
  }
  return <p className={cn('text-xs font-medium text-success-600', className)}>In Stock</p>;
}
