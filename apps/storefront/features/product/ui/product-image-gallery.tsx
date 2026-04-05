'use client';

import { useState } from 'react';
import { Heart, ZoomIn } from 'lucide-react';
import { cn } from '@homebase/ui';

interface GalleryImage {
  emoji: string;
  label: string;
}

interface ProductImageGalleryProps {
  images: GalleryImage[];
  discount?: number;
  onWishlistToggle?: () => void;
  isWishlisted?: boolean;
}

export function ProductImageGallery({
  images,
  discount,
  onWishlistToggle,
  isWishlisted = false,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) return null;

  return (
    <div>
      {/* Main image */}
      <div className="relative flex h-[480px] items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 group">
        {discount != null && discount > 0 && (
          <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
            -{discount}% OFF
          </span>
        )}
        {onWishlistToggle && (
          <button
            onClick={onWishlistToggle}
            className={cn(
              'absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition',
              isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            )}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className="h-5 w-5"
              fill={isWishlisted ? 'currentColor' : 'none'}
              strokeWidth={1.5}
            />
          </button>
        )}
        <span className="select-none text-[140px]">{images[activeIndex]?.emoji}</span>
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs text-gray-500 opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
          <ZoomIn className="h-3.5 w-3.5" />
          Hover to zoom
        </div>
      </div>

      {/* Thumbnails */}
      <div className="mt-4 flex items-center gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              'flex h-20 w-20 items-center justify-center rounded-xl border-2 bg-gray-50 text-3xl transition',
              i === activeIndex
                ? 'border-brand-400'
                : 'border-gray-200 hover:border-brand-300'
            )}
            aria-label={img.label}
          >
            {img.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
