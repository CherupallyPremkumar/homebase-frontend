'use client';

import { useState } from 'react';
import { ShoppingCart, Heart, Truck } from 'lucide-react';
import { Button, Tabs, TabsContent, TabsList, TabsTrigger, Input, Separator } from '@homebase/ui';
import { ImageGallery, PriceDisplay, QuantitySelector, useDebounce } from '@homebase/shared';
import type { CatalogItem } from '@homebase/types';

interface ProductDetailProps {
  product: CatalogItem;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');

  const images = product.imageUrl
    ? [{ url: product.imageUrl, altText: product.name }]
    : [];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Left: Image gallery */}
        <ImageGallery images={images} />

        {/* Right: Product info */}
        <div className="space-y-4">
          {product.brandName && (
            <p className="text-sm font-medium text-gray-500">{product.brandName}</p>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

          {product.averageRating != null && product.averageRating > 0 && (
            <div className="flex items-center gap-2">
              <span className="rounded bg-green-600 px-2 py-0.5 text-sm font-bold text-white">
                {product.averageRating.toFixed(1)} ★
              </span>
              <span className="text-sm text-gray-500">
                ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          <Separator />

          <PriceDisplay price={product.price} mrp={product.mrp} size="lg" />
          <p className="text-xs text-gray-500">Inclusive of all taxes</p>

          {/* Stock indicator */}
          <p className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </p>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4">
            <QuantitySelector value={quantity} onChange={setQuantity} min={1} max={10} />
            <Button size="lg" className="flex-1" disabled={!product.inStock}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>

          <Button variant="outline" size="lg" className="w-full">
            <Heart className="mr-2 h-5 w-5" />
            Add to Wishlist
          </Button>

          {/* Delivery estimate */}
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

      {/* Tabs: Description, Specifications, Reviews */}
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
            <p className="text-sm text-gray-500">Reviews coming soon.</p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-14 left-0 right-0 z-40 border-t bg-white p-3 md:hidden">
        <div className="flex items-center gap-3">
          <PriceDisplay price={product.price} mrp={product.mrp} size="sm" />
          <Button className="flex-1" disabled={!product.inStock}>
            <ShoppingCart className="mr-1 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
