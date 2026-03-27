'use client';

import { useState } from 'react';
import { ShoppingCart, Heart, Truck, Loader2 } from 'lucide-react';
import { Button, Tabs, TabsContent, TabsList, TabsTrigger, Input, Separator } from '@homebase/ui';
import { ImageGallery, PriceDisplay, QuantitySelector, useCartStore } from '@homebase/shared';
import { useAuth } from '@homebase/auth';
import type { CatalogItem } from '@homebase/types';
import { toast } from 'sonner';
import { useAddToCart, useActiveCart } from '../../cart/api/queries';
import { ProductReviews } from '@/features/review/ui/product-reviews';
import { useReviewSummary } from '@/features/review/api/queries';
import {
  useIsInWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
} from '@/features/wishlist/api/queries';

interface ProductDetailProps {
  product: CatalogItem;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const { isAuthenticated, login } = useAuth();
  const addToCartMutation = useAddToCart();
  const { data: backendCart } = useActiveCart();
  const guestStore = useCartStore();

  const inWishlist = useIsInWishlist(product.id);
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { data: summaryData } = useReviewSummary(product.id);
  const reviewSummary = summaryData?.list?.[0]?.row;

  const images = product.imageUrl
    ? [{ url: product.imageUrl, altText: product.name }]
    : [];

  const handleAddToCart = () => {
    if (isAuthenticated && backendCart?.id) {
      addToCartMutation.mutate(
        {
          cartId: backendCart.id,
          payload: {
            productId: product.id,
            quantity,
          },
        },
        {
          onSuccess: () => {
            toast.success(`${product.name} added to cart`);
            setQuantity(1);
          },
          onError: () => {
            toast.error('Failed to add item to cart');
          },
        },
      );
    } else {
      guestStore.addItem({
        id: product.id,
        productId: product.id,
        productName: product.name,
        imageUrl: product.imageUrl,
        sku: '',
        quantity,
        unitPrice: product.price,
        mrp: product.mrp,
        totalPrice: product.price * quantity,
        currency: 'INR',
        inStock: product.inStock,
        maxQuantity: 10,
      });
      toast.success(`${product.name} added to cart`);
      setQuantity(1);
    }
  };

  const isAddingToCart = addToCartMutation.isPending;

  const handleWishlistToggle = () => {
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

  const isWishlistLoading = addToWishlist.isPending || removeFromWishlist.isPending;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid gap-8 md:grid-cols-2">
        <ImageGallery images={images} />

        <div className="space-y-4">
          {product.brandName && (
            <p className="text-sm font-medium text-gray-500">{product.brandName}</p>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

          {(reviewSummary || (product.averageRating != null && product.averageRating > 0)) && (
            <div className="flex items-center gap-2">
              <span className="rounded bg-green-600 px-2 py-0.5 text-sm font-bold text-white">
                {(reviewSummary?.averageRating ?? product.averageRating ?? 0).toFixed(1)} ★
              </span>
              <span className="text-sm text-gray-500">
                ({reviewSummary?.totalReviews ?? product.reviewCount ?? 0} reviews)
              </span>
            </div>
          )}

          <Separator />

          <PriceDisplay price={product.price} mrp={product.mrp} size="lg" />
          <p className="text-xs text-gray-500">Inclusive of all taxes</p>

          <p className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </p>

          <div className="flex items-center gap-4">
            <QuantitySelector value={quantity} onChange={setQuantity} min={1} max={10} />
            <Button
              size="lg"
              className="flex-1"
              disabled={!product.inStock || isAddingToCart}
              onClick={handleAddToCart}
            >
              {isAddingToCart ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <ShoppingCart className="mr-2 h-5 w-5" />
              )}
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
          >
            <Heart
              className={`mr-2 h-5 w-5 transition-colors ${
                inWishlist ? 'fill-red-500 text-red-500' : ''
              }`}
            />
            {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </Button>

          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium">Check delivery</span>
            </div>
            <div className="mt-2 flex gap-2">
              <Input
                placeholder="Enter pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
                className="max-w-[200px]"
              />
              <Button variant="outline" size="sm">
                Check
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <div className="prose max-w-none text-gray-700">
              {product.description || 'No description available.'}
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="mt-4">
            <p className="text-sm text-gray-500">Specifications coming soon.</p>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4">
            <ProductReviews productId={product.id} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="fixed bottom-14 left-0 right-0 z-40 border-t bg-white p-3 md:hidden">
        <div className="flex items-center gap-3">
          <PriceDisplay price={product.price} mrp={product.mrp} size="sm" />
          <Button
            className="flex-1"
            disabled={!product.inStock || isAddingToCart}
            onClick={handleAddToCart}
          >
            {isAddingToCart ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="mr-1 h-4 w-4" />
            )}
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
}
