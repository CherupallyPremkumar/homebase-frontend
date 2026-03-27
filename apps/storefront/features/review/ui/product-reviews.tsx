'use client';

import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Separator } from '@homebase/ui';
import { formatRelativeTime } from '@homebase/shared';
import { useAuth } from '@homebase/auth';
import { useProductReviews, useReviewSummary, useVoteReview } from '../api/queries';
import { ReviewForm } from './review-form';

interface ProductReviewsProps {
  productId: string;
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${cls} ${
            star <= Math.round(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-8 text-right text-gray-600">{star} ★</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-yellow-400 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-gray-500">{count}</span>
    </div>
  );
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const pageSize = 5;

  const { data: reviewsData, isLoading } = useProductReviews(productId, page, pageSize);
  const { data: summaryData } = useReviewSummary(productId);
  const voteMutation = useVoteReview();

  const summary = summaryData?.list?.[0]?.row;
  const reviews = reviewsData?.list ?? [];
  const maxPages = reviewsData?.maxPages ?? 1;

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      {summary && (
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex flex-col items-center gap-1">
            <span className="text-4xl font-bold text-gray-900">
              {summary.averageRating.toFixed(1)}
            </span>
            <StarRating rating={summary.averageRating} size="lg" />
            <span className="text-sm text-gray-500">
              {summary.totalReviews} review{summary.totalReviews !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => (
              <RatingBar
                key={star}
                star={star}
                count={summary.ratingDistribution[star] ?? 0}
                total={summary.totalReviews}
              />
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Write Review CTA */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
        {isAuthenticated ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Write a Review'}
          </Button>
        ) : (
          <a href="/login">
            <Button variant="outline" size="sm">
              Login to Review
            </Button>
          </a>
        )}
      </div>

      {showForm && (
        <ReviewForm
          productId={productId}
          onSuccess={() => {
            setShowForm(false);
            setPage(1);
          }}
        />
      )}

      {/* Review List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-3 w-full rounded bg-gray-100" />
              <div className="h-3 w-3/4 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">
          No reviews yet. Be the first to share your experience!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((item) => {
            const review = item.row;
            return (
              <div key={review.id} className="rounded-lg border border-gray-100 p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} />
                      {review.title && (
                        <span className="text-sm font-semibold text-gray-900">
                          {review.title}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{review.userName || 'Anonymous'}</span>
                      {review.isVerifiedPurchase && (
                        <span className="rounded bg-green-50 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
                          Verified Purchase
                        </span>
                      )}
                      {review.createdAt && (
                        <span>{formatRelativeTime(review.createdAt)}</span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="mt-2 text-sm text-gray-700">{review.body}</p>

                {/* Vote Buttons */}
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xs text-gray-400">Was this helpful?</span>
                  <button
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600 transition-colors"
                    onClick={() => voteMutation.mutate({ reviewId: review.id, helpful: true })}
                    disabled={voteMutation.isPending}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>{review.helpfulCount > 0 ? review.helpfulCount : ''}</span>
                  </button>
                  <button
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
                    onClick={() => voteMutation.mutate({ reviewId: review.id, helpful: false })}
                    disabled={voteMutation.isPending}
                  >
                    <ThumbsDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {maxPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {maxPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(maxPages, p + 1))}
            disabled={page >= maxPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
