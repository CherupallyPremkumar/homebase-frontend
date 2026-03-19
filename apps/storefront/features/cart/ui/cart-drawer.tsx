'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, Separator } from '@homebase/ui';
import { useCartStore, formatPriceRupees, PriceDisplay } from '@homebase/shared';

export function CartDrawer() {
  const { items, subtotal, removeItem } = useCartStore();
  const sub = subtotal();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative p-2" aria-label="Cart">
          <ShoppingCart className="h-5 w-5 text-gray-600" />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {count > 9 ? '9+' : count}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="flex w-80 flex-col sm:w-96">
        <SheetHeader>
          <SheetTitle>Cart ({count} items)</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <ShoppingCart className="mb-4 h-12 w-12 text-gray-300" />
            <p className="text-sm text-gray-500">Your cart is empty</p>
            <Link href="/products">
              <Button variant="outline" size="sm" className="mt-4">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto py-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                    {item.imageUrl && <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="line-clamp-1 font-medium">{item.productName}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    <PriceDisplay price={item.unitPrice} mrp={item.mrp} size="sm" />
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="self-start text-xs text-gray-400 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <Separator />
            <div className="space-y-3 pt-4">
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>{formatPriceRupees(sub)}</span>
              </div>
              <Link href="/cart" className="block">
                <Button variant="outline" className="w-full">View Cart</Button>
              </Link>
              <Link href="/checkout" className="block">
                <Button className="w-full">Checkout</Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
