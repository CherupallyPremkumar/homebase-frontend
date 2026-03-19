import { cn } from '../lib/utils';

interface StarRatingProps {
  rating: number;      // 0-5
  count?: number;      // review count
  size?: 'sm' | 'md';
  className?: string;
}

export function StarRating({ rating, count, size = 'sm', className }: StarRatingProps) {
  if (!rating || rating <= 0) return null;

  const label = `${rating.toFixed(1)} out of 5 stars${count ? `, ${count.toLocaleString('en-IN')} ratings` : ''}`;

  return (
    <div className={cn('flex items-center gap-1.5', className)} role="img" aria-label={label}>
      <span className={cn(
        'inline-flex items-center gap-0.5 rounded px-1 py-0.5 font-medium text-white',
        rating >= 4 ? 'bg-success-600' : rating >= 3 ? 'bg-accent-500' : 'bg-error-500',
        size === 'sm' ? 'text-[10px]' : 'text-xs',
      )}>
        {rating.toFixed(1)} ★
      </span>
      {count != null && (
        <span className={cn('text-gray-400', size === 'sm' ? 'text-[10px]' : 'text-xs')}>
          ({count.toLocaleString('en-IN')})
        </span>
      )}
    </div>
  );
}
