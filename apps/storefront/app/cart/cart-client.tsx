'use client';

import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { Button, Input, Separator } from '@homebase/ui';
import { useCartStore, PriceDisplay, QuantitySelector, EmptyState, formatPriceRupees, FREE_SHIPPING_THRESHOLD } from '@homebase/shared';
import { useState } from 'react';
import { toast } from 'sonner';
import { ShoppingCart } from 'lucide-react';

export function CartPageClient() {
  const { items, couponCode, removeItem, updateQuantity, applyCoupon, removeCoupon, subtotal } = useCartStore();
  const [couponInput, setCouponInput] = useState('');

  const sub = subtotal();
  const shipping = sub >= FREE_SHIPPING_THRESHOLD ? 0 : 49;
  const total = sub + shipping;

  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState
          icon={<ShoppingCart className="h-16 w-16" />}
          title="Your cart is empty"
          description="Add products to your cart to see them here."
          action={
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-lg border p-4">
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-gray-400">No image</div>
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <Link href={`/products/${item.productId}`} className="text-sm font-medium hover:text-primary">
                  {item.productName}
                </Link>
                {item.variantName && <p className="text-xs text-gray-500">{item.variantName}</p>}
                <PriceDisplay price={item.unitPrice} mrp={item.mrp} size="sm" className="mt-1" />
                <div className="mt-auto flex items-center justify-between pt-2">
                  <QuantitySelector
                    value={item.quantity}
                    onChange={(qty) => updateQuantity(item.id, qty)}
                    max={item.maxQuantity}
                  />
                  <button
                    onClick={() => {
                      removeItem(item.id);
                      toast('Item removed from cart', { action: { label: 'Undo', onClick: () => {} } });
                    }}
                    className="p-1 text-gray-400 hover:text-red-500"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <Separator className="my-4" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>{formatPriceRupees(sub)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span>{shipping === 0 ? 'FREE' : formatPriceRupees(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-green-600">
                Add {formatPriceRupees(FREE_SHIPPING_THRESHOLD - sub)} more for free shipping
              </p>
            )}
          </div>

          {/* Coupon */}
          <div className="mt-4">
            {couponCode ? (
              <div className="flex items-center justify-between rounded bg-green-50 px-3 py-2 text-sm">
                <span className="font-medium text-green-700">{couponCode} applied</span>
                <button onClick={removeCoupon} className="text-xs text-red-500 hover:underline">
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (couponInput) {
                      applyCoupon(couponInput);
                      setCouponInput('');
                      toast.success('Coupon applied');
                    }
                  }}
                >
                  Apply
                </Button>
              </div>
            )}
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatPriceRupees(total)}</span>
          </div>

          <Link href="/checkout" className="mt-4 block">
            <Button size="lg" className="w-full">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
