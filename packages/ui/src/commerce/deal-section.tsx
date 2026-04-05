'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { CountdownTimer } from './countdown-timer';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DealProduct {
  id: string;
  name: string;
  icon: string;
  price: string;
  originalPrice: string;
  discount: number;
  rating: number;
  reviewCount: number;
}

export interface DealSectionProps {
  title: string;
  subtitle: string;
  endDate: Date;
  products: DealProduct[];
  ctaLink: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderStars(rating: number) {
  return Array.from({ length: 5 })
    .map((_, i) => (i < Math.round(rating) ? '\u2605' : '\u2606'))
    .join('');
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DealSection({
  title,
  subtitle,
  endDate,
  products,
  ctaLink,
  className,
}: DealSectionProps) {
  return (
    <section className={cn('py-8', className)}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-8 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 p-8 md:flex-row">
          {/* ---- Left: Timer & Info ---- */}
          <div className="max-w-md text-white">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-200">
              Deal of the Day
            </span>
            <h2 className="mb-1 mt-2 text-3xl font-extrabold">{title}</h2>
            <p className="mb-5 text-sm text-orange-100">{subtitle}</p>

            <CountdownTimer endDate={endDate} className="mb-6" />

            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand-600 transition hover:bg-orange-50"
            >
              View All Deals
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* ---- Right: Deal Products ---- */}
          <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="cursor-pointer rounded-xl bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)]"
              >
                <div className="relative">
                  <span className="absolute left-0 top-0 rounded-br-lg rounded-tl-lg bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    -{product.discount}%
                  </span>
                  <div className="flex h-32 items-center justify-center rounded-lg bg-gray-100 text-4xl">
                    {product.icon}
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center gap-1 text-xs text-yellow-400">
                    {renderStars(product.rating)}{' '}
                    <span className="text-gray-400">({product.reviewCount})</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm font-medium text-gray-800">
                    {product.name}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-bold text-brand-600">{product.price}</span>
                    <span className="text-xs text-gray-400 line-through">
                      {product.originalPrice}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
