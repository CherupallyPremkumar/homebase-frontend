import { Star } from 'lucide-react';
import { cn } from '../lib/utils';

export interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { star: 'w-3.5 h-3.5', text: 'text-xs', gap: 'gap-0.5' },
  md: { star: 'w-4 h-4', text: 'text-sm', gap: 'gap-0.5' },
  lg: { star: 'w-5 h-5', text: 'text-base', gap: 'gap-1' },
};

export function RatingStars({
  rating,
  count,
  size = 'md',
  className,
}: RatingStarsProps) {
  const clampedRating = Math.max(0, Math.min(5, rating));
  const fullStars = Math.floor(clampedRating);
  const hasHalf = clampedRating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  const s = sizeMap[size];

  return (
    <div className={cn('flex items-center', s.gap, className)}>
      <div className={cn('flex items-center', s.gap)}>
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={cn(s.star, 'text-yellow-400 fill-yellow-400')}
          />
        ))}
        {hasHalf && (
          <div className={cn('relative', s.star)}>
            <Star className={cn(s.star, 'text-gray-200 fill-gray-200 absolute inset-0')} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={cn(s.star, 'text-yellow-400 fill-yellow-400')} />
            </div>
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={cn(s.star, 'text-gray-200 fill-gray-200')}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className={cn(s.text, 'text-gray-500 ml-1')}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
