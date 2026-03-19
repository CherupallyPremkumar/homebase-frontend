'use client';

import Link from 'next/link';
import { Button } from '@homebase/ui';
import { useCartStore, EmptyState } from '@homebase/shared';
import { ShoppingCart } from 'lucide-react';
import { CartItem } from './cart-item';
import { CartSummary } from './cart-summary';

export function CartPage() {
  const { items, couponCode, removeItem, updateQuantity, applyCoupon, removeCoupon, subtotal } = useCartStore();

  const sub = subtotal();

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
            <CartItem
              key={item.id}
              item={item}
              onRemove={removeItem}
              onUpdateQuantity={updateQuantity}
            />
          ))}
        </div>

        {/* Order summary */}
        <CartSummary
          subtotal={sub}
          couponCode={couponCode}
          onApplyCoupon={applyCoupon}
          onRemoveCoupon={removeCoupon}
        />
      </div>
    </div>
  );
}
