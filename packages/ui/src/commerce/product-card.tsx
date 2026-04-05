'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { cn } from '../lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProductBadge {
  /** Display label, e.g. "Free Shipping", "Free Gift", "In Stock" */
  label: string;
  /** Tailwind text colour class, e.g. "text-green-600" */
  color?: string;
  /** Tailwind background colour class, e.g. "bg-green-50" */
  bgColor?: string;
}

export interface ProductCardProps {
  /** Unique product identifier used for the product link. */
  id: string;
  /** Product display name. */
  name: string;
  /** Product image URL. */
  image: string;
  /** Current selling price (already formatted string or number). */
  price: string;
  /** Original price shown as strikethrough when present. */
  originalPrice?: string;
  /** Average rating from 0 to 5. */
  rating: number;
  /** Total number of reviews. */
  reviewCount: number;
  /** Discount percentage (e.g. 25 for 25% off). Renders a red badge. */
  discount?: number;
  /** If true a green "NEW" badge is shown instead of the discount badge. */
  isNew?: boolean;
  /** Informational badges rendered below the price row. */
  badges?: ProductBadge[];
  /** Seller / shop name rendered beneath badges. */
  seller?: string;
  /** Callback when the "Add to Cart" button is clicked. When omitted the button is hidden. */
  onAddToCart?: (id: string) => void;
  /** Callback when the wishlist heart icon is toggled. */
  onWishlist?: (id: string) => void;
  /** Whether the product is currently wishlisted. */
  isWishlisted?: boolean;
  /** Optional extra class names merged onto the root element. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-1 text-xs">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-3 w-3',
            i < Math.round(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-none text-gray-300',
          )}
        />
      ))}
      <span className="text-gray-400">({reviewCount})</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Badge colour defaults
// ---------------------------------------------------------------------------

const BADGE_DEFAULTS: Record<string, { color: string; bgColor: string }> = {
  'free shipping': { color: 'text-green-600', bgColor: 'bg-green-50' },
  'in stock':      { color: 'text-green-600', bgColor: 'bg-green-50' },
  'free gift':     { color: 'text-purple-600', bgColor: 'bg-purple-50' },
};

function resolveBadgeClasses(badge: ProductBadge) {
  const key = badge.label.toLowerCase();
  const defaults = BADGE_DEFAULTS[key];
  return {
    color: badge.color ?? defaults?.color ?? 'text-blue-600',
    bgColor: badge.bgColor ?? defaults?.bgColor ?? 'bg-blue-50',
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductCard({
  id,
  name,
  image,
  price,
  originalPrice,
  rating,
  reviewCount,
  discount,
  isNew,
  badges,
  seller,
  onAddToCart,
  onWishlist,
  isWishlisted = false,
  className,
}: ProductCardProps) {
  const productHref = `/products/${id}`;

  return (
    <div
      className={cn(
        'group relative rounded-xl border border-gray-100 bg-white p-4',
        'cursor-pointer transition-all duration-200 ease-in-out',
        'hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)]',
        className,
      )}
    >
      {/* ---- Image area ---- */}
      <div className="relative">
        {/* Top-left badge: discount or NEW */}
        {discount != null && discount > 0 && (
          <span className="absolute left-0 top-0 z-10 rounded-br-lg rounded-tl-lg bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
            -{discount}%
          </span>
        )}
        {!discount && isNew && (
          <span className="absolute left-0 top-0 z-10 rounded-br-lg rounded-tl-lg bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white">
            NEW
          </span>
        )}

        {/* Wishlist button (top-right) */}
        {onWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onWishlist(id);
            }}
            className={cn(
              'absolute right-0 top-0 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow transition',
              isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500',
            )}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className="h-4 w-4"
              fill={isWishlisted ? 'currentColor' : 'none'}
              strokeWidth={1.5}
            />
          </button>
        )}

        {/* Product image */}
        <Link href={productHref} className="block">
          <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 768px) 50vw, 20vw"
              className="object-contain p-2"
            />
          </div>
        </Link>
      </div>

      {/* ---- Details ---- */}
      <div className="mt-3">
        {/* Star rating */}
        <StarRating rating={rating} reviewCount={reviewCount} />

        {/* Product name */}
        <Link href={productHref}>
          <p className="mt-1 line-clamp-2 text-sm font-medium text-gray-800">
            {name}
          </p>
        </Link>

        {/* Price row */}
        <div className="mt-2 flex items-center gap-2">
          <span className="font-bold text-brand-600">{price}</span>
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              {originalPrice}
            </span>
          )}
        </div>

        {/* Info badges */}
        {badges && badges.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1">
            {badges.map((badge) => {
              const { color, bgColor } = resolveBadgeClasses(badge);
              return (
                <span
                  key={badge.label}
                  className={cn(
                    'rounded px-1.5 py-0.5 text-[10px] font-medium',
                    color,
                    bgColor,
                  )}
                >
                  {badge.label}
                </span>
              );
            })}
          </div>
        )}

        {/* Seller */}
        {seller && (
          <p className="mt-1.5 truncate text-[11px] text-gray-400">
            Sold by {seller}
          </p>
        )}

        {/* Add to Cart */}
        {onAddToCart && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(id);
            }}
            className={cn(
              'mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2',
              'bg-brand-500 text-sm font-medium text-white transition-colors',
              'hover:bg-brand-600 active:bg-brand-700',
            )}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
