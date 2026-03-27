'use client';

import { EntityCard } from '@homebase/ui';
import { useCartStore } from '@homebase/shared';
import { useAuth } from '@homebase/auth';
import type { CatalogItem } from '@homebase/types';
import { ShoppingCart, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useAddToCart, useActiveCart } from '../../cart/api/queries';
import {
  useIsInWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
} from '@/features/wishlist/api/queries';

interface ProductCardProps {
  product: CatalogItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated, login } = useAuth();
  const addToCartMutation = useAddToCart();
  const { data: backendCart } = useActiveCart();
  const guestStore = useCartStore();

  const inWishlist = useIsInWishlist(product.id);
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      login();
      return;
    }
    if (inWishlist) {
      removeFromWishlist.mutate(product.id, {
        onSuccess: () => toast('Removed from wishlist'),
      });
    } else {
      addToWishlist.mutate(product.id, {
        onSuccess: () => toast.success('Added to wishlist'),
      });
    }
  };

  const handleAddToCart = () => {
    if (!product.inStock) return;

    if (isAuthenticated && backendCart?.id) {
      addToCartMutation.mutate(
        {
          cartId: backendCart.id,
          payload: {
            productId: product.id,
            quantity: 1,
          },
        },
        {
          onSuccess: () => toast.success(`${product.name} added to cart`),
          onError: () => toast.error('Failed to add item to cart'),
        },
      );
    } else {
      guestStore.addItem({
        id: product.id,
        productId: product.id,
        productName: product.name,
        imageUrl: product.imageUrl,
        sku: '',
        quantity: 1,
        unitPrice: product.price,
        mrp: product.mrp,
        totalPrice: product.price,
        currency: 'INR',
        inStock: product.inStock,
        maxQuantity: 10,
      });
      toast.success(`${product.name} added to cart`);
    }
  };

  return (
    <div className="relative">
      <EntityCard
        variant="vertical"
        as="article"
        image={product.imageUrl ? { src: product.imageUrl, alt: product.name, aspectRatio: '1/1' } : undefined}
        title={product.name}
        subtitle={product.brandName}
        badges={product.discount > 0 ? [{ label: `${product.discount}% OFF`, variant: 'priority' }] : []}
        fields={[
          { type: 'price', value: product.price, extra: product.mrp },
          ...(product.averageRating ? [{ type: 'rating' as const, value: product.averageRating, extra: product.reviewCount }] : []),
          { type: 'stock', value: product.inStock ? 1 : 0 },
        ]}
        actions={[
          {
            label: product.inStock ? 'Add to Cart' : 'Out of Stock',
            variant: 'secondary' as const,
            icon: <ShoppingCart className="h-3.5 w-3.5" />,
            disabled: !product.inStock,
            loading: addToCartMutation.isPending,
            onClick: handleAddToCart,
          },
        ]}
        href={`/products/${product.id}`}
      />
      <button
        className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1.5 shadow-sm transition-colors hover:bg-white"
        onClick={handleWishlistToggle}
        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          className={`h-4 w-4 transition-colors ${
            inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'
          }`}
        />
      </button>
    </div>
  );
}
