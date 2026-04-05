import { Star } from 'lucide-react';
import { formatNumber } from '@homebase/shared';
import type { ProductDetailData } from '../types';

interface ProductDetailReviewsProps {
  product: ProductDetailData;
}

export function ProductDetailReviews({ product }: ProductDetailReviewsProps) {
  if (product.reviewCount === 0) return null;

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Customer reviews">
      <h3 className="mb-4 font-semibold text-gray-900">Customer Reviews</h3>
      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-900">{product.avgRating}</p>
          <div className="mt-1 flex justify-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className={`h-4 w-4 fill-current ${i < Math.floor(product.avgRating) ? 'text-yellow-400' : 'text-gray-300'}`} />
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-400">{formatNumber(product.reviewCount)} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {product.ratingBreakdown.map((r) => (
            <div key={r.stars} className="flex items-center gap-2">
              <span className="w-8 text-xs text-gray-500">{r.stars} <Star className="inline h-3 w-3 fill-current text-yellow-400" /></span>
              <div className="h-2 flex-1 rounded-full bg-gray-100">
                <div className="h-2 rounded-full bg-yellow-400" style={{ width: `${r.percent}%` }} />
              </div>
              <span className="w-8 text-xs text-gray-400">{r.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
