'use client';

import Link from 'next/link';
import { Button } from '@homebase/ui';
import { useCartStore, EmptyState } from '@homebase/shared';
import { useAuth } from '@homebase/auth';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { CartItem } from './cart-item';
import { CartSummary } from './cart-summary';
import { useActiveCart, useRemoveFromCart, useUpdateCartItem } from '../api/queries';

export function CartPage() {
  const { isAuthenticated } = useAuth();
  const guestStore = useCartStore();
  const { data: backendCart, isLoading: isCartLoading } = useActiveCart();
  const removeFromCart = useRemoveFromCart();
  const updateCartItem = useUpdateCartItem();

  // Determine data source based on authentication
  const items = isAuthenticated ? (backendCart?.items ?? []) : guestStore.items;
  const couponCode = isAuthenticated ? (backendCart?.couponCode ?? null) : guestStore.couponCode;
  const subtotalValue = isAuthenticated
    ? (backendCart?.subtotal ?? 0)
    : guestStore.subtotal();
  const cartId = backendCart?.id;

  const handleRemove = (itemId: string) => {
    if (isAuthenticated && cartId) {
      removeFromCart.mutate({ cartId, itemId });
    } else {
      guestStore.removeItem(itemId);
    }
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (isAuthenticated && cartId) {
      updateCartItem.mutate({ cartId, itemId, quantity });
    } else {
      guestStore.updateQuantity(itemId, quantity);
    }
  };

  if (isAuthenticated && isCartLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

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
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={handleRemove}
              onUpdateQuantity={handleUpdateQuantity}
              isRemoving={removeFromCart.isPending}
              isUpdating={updateCartItem.isPending}
            />
          ))}
        </div>

        <CartSummary
          subtotal={subtotalValue}
          couponCode={couponCode}
          cartId={cartId}
          isAuthenticated={isAuthenticated}
          onApplyCoupon={guestStore.applyCoupon}
          onRemoveCoupon={guestStore.removeCoupon}
        />
      </div>
    </div>
  );
}
