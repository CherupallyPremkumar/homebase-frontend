'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HeroBannerCategory {
  name: string;
  icon: string;
  href: string;
}

export interface HeroBannerPromo {
  label: string;
  labelColor?: string;
  name: string;
  description: string;
  price: string;
  priceColor?: string;
  href: string;
  gradientFrom?: string;
  gradientTo?: string;
  borderColor?: string;
}

export interface HeroBannerProps {
  title: React.ReactNode;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  saleBadge?: string;
  categories?: HeroBannerCategory[];
  promos?: HeroBannerPromo[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HeroBanner({
  title,
  subtitle,
  ctaText,
  ctaLink,
  saleBadge,
  categories = [],
  promos = [],
  className,
}: HeroBannerProps) {
  return (
    <section
      className={cn(
        'bg-gradient-to-br from-[#0F1B2D] to-[#1E3A5F]',
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-8 px-4 py-10">
        {/* ---- Left: Category Sidebar ---- */}
        {categories.length > 0 && (
          <div className="hidden w-56 shrink-0 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm lg:block">
            <ul className="space-y-1 text-sm">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={cat.href}
                    className="flex items-center gap-2 rounded px-2 py-1.5 text-white/80 hover:bg-white/5 hover:text-brand-400"
                  >
                    <span>{cat.icon}</span> {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ---- Center: Main Banner ---- */}
        <div className="relative flex min-h-[360px] flex-1 items-center overflow-hidden rounded-2xl bg-gradient-to-r from-[#1A2E4A] to-[#1E3A5F] p-10">
          <div className="relative z-10 max-w-md">
            {saleBadge && (
              <span className="mb-4 inline-block rounded-full bg-brand-500 px-3 py-1 text-xs font-bold text-white">
                {saleBadge}
              </span>
            )}
            <h1 className="mb-3 text-4xl font-extrabold leading-tight text-white">
              {title}
            </h1>
            <p className="mb-6 text-sm leading-relaxed text-gray-300">
              {subtitle}
            </p>
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-600"
            >
              {ctaText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Decorative circles */}
          <div className="absolute right-0 top-0 h-80 w-80 -translate-y-1/4 translate-x-1/4 rounded-full bg-brand-500/10" />
          <div className="absolute bottom-0 right-20 h-60 w-60 translate-y-1/4 rounded-full bg-brand-400/10" />
        </div>

        {/* ---- Right: Side Promotions ---- */}
        {promos.length > 0 && (
          <div className="hidden w-64 shrink-0 flex-col gap-4 xl:flex">
            {promos.map((promo) => (
              <div
                key={promo.name}
                className={cn(
                  'rounded-xl border p-5',
                  promo.gradientFrom && promo.gradientTo
                    ? `bg-gradient-to-br ${promo.gradientFrom} ${promo.gradientTo}`
                    : 'bg-gradient-to-br from-orange-50 to-orange-100',
                  promo.borderColor ?? 'border-orange-200',
                )}
              >
                <span
                  className={cn(
                    'text-[10px] font-bold uppercase tracking-wider',
                    promo.labelColor ?? 'text-brand-600',
                  )}
                >
                  {promo.label}
                </span>
                <h3 className="mt-1 text-sm font-bold text-[#0F1B2D]">
                  {promo.name}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {promo.description}
                </p>
                <p
                  className={cn(
                    'mt-2 font-bold',
                    promo.priceColor ?? 'text-brand-600',
                  )}
                >
                  {promo.price}
                </p>
                <Link
                  href={promo.href}
                  className={cn(
                    'mt-2 inline-flex items-center gap-1 text-xs font-semibold hover:underline',
                    promo.priceColor ?? 'text-brand-600',
                  )}
                >
                  Shop Now &rarr;
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
