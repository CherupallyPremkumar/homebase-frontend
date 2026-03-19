'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Input, Separator } from '@homebase/ui';
import { formatPriceRupees, FREE_SHIPPING_THRESHOLD } from '@homebase/shared';
import { toast } from 'sonner';

interface CartSummaryProps {
  subtotal: number;
  couponCode: string | null;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
}

export function CartSummary({ subtotal, couponCode, onApplyCoupon, onRemoveCoupon }: CartSummaryProps) {
  const [couponInput, setCouponInput] = useState('');
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 49;
  const total = subtotal + shipping;

  return (
    <div className="rounded-lg border p-6">
      <h2 className="text-lg font-semibold">Order Summary</h2>
      <Separator className="my-4" />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span>{formatPriceRupees(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Shipping</span>
          <span>{shipping === 0 ? 'FREE' : formatPriceRupees(shipping)}</span>
        </div>
        {shipping > 0 && (
          <p className="text-xs text-green-600">
            Add {formatPriceRupees(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
          </p>
        )}
      </div>

      {/* Coupon */}
      <div className="mt-4">
        {couponCode ? (
          <div className="flex items-center justify-between rounded bg-green-50 px-3 py-2 text-sm">
            <span className="font-medium text-green-700">{couponCode} applied</span>
            <button onClick={onRemoveCoupon} className="text-xs text-red-500 hover:underline">
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
                  onApplyCoupon(couponInput);
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
  );
}
