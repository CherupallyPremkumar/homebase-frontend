'use client';

import Link from 'next/link';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@homebase/ui';
import { formatPrice, formatRelativeTime } from '@homebase/shared';
import { toast } from 'sonner';
import { useWishlist, useRemoveFromWishlist } from '../api/queries';

export function WishlistList() {
  const { data: wishlist, isLoading } = useWishlist();
  const removeMutation = useRemoveFromWishlist();

  function handleRemove(productId: string, productName: string) {
    removeMutation.mutate(productId, {
      onSuccess: () => toast('Removed from wishlist', { description: productName }),
    });
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-lg border p-4">
            <div className="h-40 rounded bg-gray-200" />
            <div className="mt-3 h-4 w-3/4 rounded bg-gray-200" />
            <div className="mt-2 h-3 w-1/2 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Heart className="mb-4 h-12 w-12 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900">Your wishlist is empty</h3>
        <p className="mt-1 text-sm text-gray-500">
          Save items you love to buy them later.
        </p>
        <Link href="/products">
          <Button variant="outline" className="mt-4">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {wishlist.map((item) => (
        <div
          key={item.id}
          className="group relative rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
        >
          <Link href={`/products/${item.productId}`} className="block">
            <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-50">
              {item.productImage ? (
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="h-full w-full object-contain transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-300">
                  No Image
                </div>
              )}
            </div>
            <div className="p-3">
              <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                {item.productName}
              </h4>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {formatPrice(item.price)}
              </p>
              <p className="mt-0.5 text-xs text-gray-400">
                Added {formatRelativeTime(item.addedAt)}
              </p>
            </div>
          </Link>

          <button
            className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow-sm transition-colors hover:bg-red-50"
            onClick={() => handleRemove(item.productId, item.productName)}
            aria-label={`Remove ${item.productName} from wishlist`}
          >
            <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
          </button>
        </div>
      ))}
    </div>
  );
}
