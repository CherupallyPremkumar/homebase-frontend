'use client';

import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@homebase/ui';
import { PriceDisplay } from '@homebase/shared';
import type { CatalogItem } from '@homebase/types';
import { cn } from '@homebase/ui/src/lib/utils';

interface ProductCardProps {
  product: CatalogItem;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <div className={cn('group relative flex flex-col rounded-lg border bg-white transition-shadow hover:shadow-md', className)}>
      {/* Wishlist heart */}
      <button
        className="absolute right-2 top-2 z-10 rounded-full bg-white/80 p-1.5 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
        aria-label="Add to wishlist"
      >
        <Heart className="h-4 w-4 text-gray-500" />
      </button>

      {/* Discount badge */}
      {product.discount > 0 && (
        <span className="absolute left-2 top-2 z-10 rounded bg-green-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
          {product.discount}% OFF
        </span>
      )}

      {/* Image */}
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-300">
              No image
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3">
        <Link href={`/products/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-medium text-gray-900 hover:text-primary">
            {product.name}
          </h3>
        </Link>

        {product.brandName && (
          <p className="mt-0.5 text-xs text-gray-500">{product.brandName}</p>
        )}

        <div className="mt-auto pt-2">
          <PriceDisplay price={product.price} mrp={product.mrp} size="sm" />

          {product.averageRating != null && product.averageRating > 0 && (
            <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
              <span className="rounded bg-green-600 px-1 py-0.5 text-[10px] font-bold text-white">
                {product.averageRating.toFixed(1)} ★
              </span>
              {product.reviewCount != null && (
                <span>({product.reviewCount})</span>
              )}
            </div>
          )}
        </div>

        {/* Add to cart button - mobile: icon, desktop: text */}
        <Button
          variant="outline"
          size="sm"
          className="mt-2 w-full"
          disabled={!product.inStock}
        >
          {product.inStock ? (
            <>
              <ShoppingCart className="mr-1 h-3.5 w-3.5 md:mr-2" />
              <span className="hidden md:inline">Add to Cart</span>
              <span className="md:hidden">Add</span>
            </>
          ) : (
            'Out of Stock'
          )}
        </Button>
      </div>
    </div>
  );
}
