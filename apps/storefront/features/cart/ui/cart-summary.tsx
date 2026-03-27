'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Input, Separator } from '@homebase/ui';
import { formatPriceRupees, FREE_SHIPPING_THRESHOLD } from '@homebase/shared';
import { toast } from 'sonner';
import { useApplyCoupon, useRemoveCoupon } from '../api/queries';

interface CartSummaryProps {
  subtotal: number;
  couponCode: string | null;
  /** Backend cart ID — required when authenticated */
  cartId?: string;
  /** Whether the user is authenticated (determines coupon mutation source) */
  isAuthenticated: boolean;
  /** Guest-mode coupon apply callback */
  onApplyCoupon: (code: string) => void;
  /** Guest-mode coupon remove callback */
  onRemoveCoupon: () => void;
}

export function CartSummary({
  subtotal,
  couponCode,
  cartId,
  isAuthenticated,
  onApplyCoupon,
  onRemoveCoupon,
}: CartSummaryProps) {
  const [couponInput, setCouponInput] = useState('');
  const applyCoupon = useApplyCoupon();
  const removeCoupon = useRemoveCoupon();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 49;
  const total = subtotal + shipping;

  const isCouponPending = applyCoupon.isPending || removeCoupon.isPending;

  const handleApplyCoupon = () => {
    if (!couponInput) return;

    if (isAuthenticated && cartId) {
      applyCoupon.mutate(
        { cartId, couponCode: couponInput },
        {
          onSuccess: () => {
            setCouponInput('');
            toast.success('Coupon applied');
          },
          onError: () => {
            toast.error('Invalid coupon code');
          },
        },
      );
    } else {
      onApplyCoupon(couponInput);
      setCouponInput('');
      toast.success('Coupon applied');
    }
  };

  const handleRemoveCoupon = () => {
    if (isAuthenticated && cartId) {
      removeCoupon.mutate(
        { cartId },
        {
          onSuccess: () => {
            toast.success('Coupon removed');
          },
        },
      );
    } else {
      onRemoveCoupon();
    }
  };

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

      <div className="mt-4">
        {couponCode ? (
          <div className="flex items-center justify-between rounded bg-green-50 px-3 py-2 text-sm">
            <span className="font-medium text-green-700">{couponCode} applied</span>
            <button
              onClick={handleRemoveCoupon}
              disabled={isCouponPending}
              className="text-xs text-red-500 hover:underline disabled:opacity-50"
            >
              {removeCoupon.isPending ? 'Removing...' : 'Remove'}
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
              onClick={handleApplyCoupon}
              disabled={!couponInput || isCouponPending}
            >
              {applyCoupon.isPending ? 'Applying...' : 'Apply'}
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
