'use client';

import { useState } from 'react';
import { Check, Star, ThumbsUp, ThumbsDown, ChevronDown } from 'lucide-react';
import { cn } from '@homebase/ui';

/* ---------- Types ---------- */

interface Specification {
  label: string;
  value: string;
}

interface ReviewData {
  initials: string;
  initialsColor: string;
  initialsBg: string;
  name: string;
  date: string;
  rating: number;
  title: string;
  body: string;
  helpfulCount: number;
  notHelpfulCount: number;
}

interface RatingBreakdown {
  star: number;
  percentage: number;
}

interface ProductTabsProps {
  description: string;
  featureHighlights: { emoji: string; title: string; description: string }[];
  keyFeatures: string[];
  specifications: Specification[];
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: RatingBreakdown[];
  reviews: ReviewData[];
}

/* ---------- Sub-components ---------- */

function StarDisplay({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(
            cls,
            s <= Math.round(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
          )}
        />
      ))}
    </div>
  );
}

/* ---------- Main Component ---------- */

const TABS = ['Description', 'Specifications', 'Reviews'] as const;
type TabName = (typeof TABS)[number];

export function ProductTabs({
  description,
  featureHighlights,
  keyFeatures,
  specifications,
  averageRating,
  totalReviews,
  ratingBreakdown,
  reviews,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabName>('Description');

  const tabLabel = (tab: TabName) =>
    tab === 'Reviews' ? `Reviews (${totalReviews})` : tab;

  return (
    <section className="bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Tab Buttons */}
        <div className="mb-8 flex items-center gap-0 border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'border-b-2 px-6 py-3 text-sm font-semibold transition',
                activeTab === tab
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-brand-500'
              )}
            >
              {tabLabel(tab)}
            </button>
          ))}
        </div>

        {/* Description */}
        {activeTab === 'Description' && (
          <div className="rounded-2xl border border-gray-100 bg-white p-8">
            <h3 className="mb-4 text-xl font-bold text-navy-900">Industry-Leading Noise Cancellation</h3>
            <p className="mb-5 text-sm leading-relaxed text-gray-600">{description}</p>

            {/* Feature highlights */}
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              {featureHighlights.map((f) => (
                <div key={f.title} className="rounded-xl bg-gray-50 p-5 text-center">
                  <span className="mb-3 block text-4xl">{f.emoji}</span>
                  <h4 className="text-sm font-bold text-navy-900">{f.title}</h4>
                  <p className="mt-1 text-xs text-gray-500">{f.description}</p>
                </div>
              ))}
            </div>

            <h4 className="mb-3 font-bold text-navy-900">Key Features</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {keyFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Specifications */}
        {activeTab === 'Specifications' && (
          <div className="rounded-2xl border border-gray-100 bg-white p-8">
            <h3 className="mb-6 text-xl font-bold text-navy-900">Technical Specifications</h3>
            <div className="overflow-hidden rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <tbody>
                  {specifications.map((spec, i) => (
                    <tr
                      key={spec.label}
                      className={i < specifications.length - 1 ? 'border-b border-gray-50' : ''}
                    >
                      <td className="w-1/3 bg-gray-50 px-5 py-3.5 font-semibold text-navy-900">
                        {spec.label}
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reviews */}
        {activeTab === 'Reviews' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Rating Summary */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="mb-6 text-center">
                <p className="text-5xl font-extrabold text-navy-900">{averageRating}</p>
                <div className="mt-2 flex items-center justify-center">
                  <StarDisplay rating={averageRating} size="lg" />
                </div>
                <p className="mt-1 text-sm text-gray-500">Based on {totalReviews} reviews</p>
              </div>

              {/* Star Breakdown */}
              <div className="space-y-2.5">
                {ratingBreakdown.map((rb) => (
                  <div key={rb.star} className="flex items-center gap-3">
                    <span className="w-6 text-xs font-medium text-gray-600">
                      {rb.star}
                      <Star className="mb-0.5 ml-0.5 inline h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-yellow-400 transition-all duration-600"
                        style={{ width: `${rb.percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-xs text-gray-500">{rb.percentage}%</span>
                  </div>
                ))}
              </div>

              <button className="mt-6 w-full rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600">
                Write a Review
              </button>
            </div>

            {/* Review Cards */}
            <div className="space-y-4 lg:col-span-2">
              {reviews.map((review) => (
                <div
                  key={review.name}
                  className="rounded-2xl border border-gray-100 bg-white p-6 transition hover:shadow-md"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold',
                          review.initialsBg,
                          review.initialsColor
                        )}
                      >
                        {review.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy-900">{review.name}</p>
                        <p className="text-xs text-gray-400">Verified Purchase - {review.date}</p>
                      </div>
                    </div>
                    <StarDisplay rating={review.rating} />
                  </div>
                  <h4 className="mb-1.5 text-sm font-semibold text-navy-900">{review.title}</h4>
                  <p className="text-sm leading-relaxed text-gray-600">{review.body}</p>
                  <div className="mt-4 flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-xs text-gray-400 transition hover:text-brand-500">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      Helpful ({review.helpfulCount})
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-gray-400 transition hover:text-gray-600">
                      <ThumbsDown className="h-3.5 w-3.5" />
                      Not Helpful ({review.notHelpfulCount})
                    </button>
                  </div>
                </div>
              ))}

              {/* Load More */}
              <div className="pt-2 text-center">
                <button className="mx-auto flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition hover:text-brand-700">
                  Load More Reviews
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
