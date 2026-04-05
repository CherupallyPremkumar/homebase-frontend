'use client';

import { Lock, Shield, Tag, Check, ShoppingCart } from 'lucide-react';
import { formatPriceRupees } from '@homebase/shared';
import type { CartItem } from '@homebase/types';

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  couponDiscount: number;
  gst: number;
  total: number;
  savings: number;
  couponInput: string;
  onCouponInputChange: (value: string) => void;
  couponApplied: boolean;
  onApplyCoupon: () => void;
  onPlaceOrder: () => void;
  isPlacingOrder: boolean;
}

export function CheckoutOrderSummary({
  items,
  subtotal,
  shipping,
  couponDiscount,
  gst,
  total,
  savings,
  couponInput,
  onCouponInputChange,
  couponApplied,
  onApplyCoupon,
  onPlaceOrder,
  isPlacingOrder,
}: CheckoutOrderSummaryProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy-900">Order Summary</h2>
          <span className="text-xs text-gray-400">{items.length} items</span>
        </div>
      </div>

      <div className="p-6">
        {/* Order Items */}
        <div className="mb-6 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.productName} className="h-full w-full rounded-lg object-cover" />
                ) : (
                  <ShoppingCart className="h-6 w-6 text-gray-300" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-medium text-gray-800">{item.productName}</p>
                {item.variantName && (
                  <p className="mt-0.5 text-xs text-gray-400">{item.variantName}</p>
                )}
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm font-bold text-navy-900">{formatPriceRupees(item.unitPrice)}</span>
                  {item.mrp > item.unitPrice && (
                    <span className="text-xs text-gray-400 line-through">{formatPriceRupees(item.mrp)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coupon Code */}
        <div className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponInput}
                onChange={(e) => onCouponInputChange(e.target.value.toUpperCase())}
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200"
              />
            </div>
            <button
              onClick={onApplyCoupon}
              className="rounded-lg border-2 border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-600 transition hover:border-brand-300 hover:bg-brand-50"
            >
              Apply
            </button>
          </div>
          {couponApplied && (
            <div className="mt-2 flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-green-600" />
              <span className="text-xs font-medium text-green-600">
                Coupon SAVE10 applied - {formatPriceRupees(couponDiscount)} off
              </span>
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Subtotal</span>
            <span className="text-sm font-medium text-gray-800">{formatPriceRupees(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Shipping</span>
            <span className="text-sm font-medium text-green-600">{shipping === 0 ? 'FREE' : formatPriceRupees(shipping)}</span>
          </div>
          {couponDiscount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Coupon Discount</span>
              <span className="text-sm font-medium text-green-600">-{formatPriceRupees(couponDiscount)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">GST (18%)</span>
            <span className="text-sm font-medium text-gray-800">{formatPriceRupees(gst)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-3">
            <span className="text-base font-bold text-navy-900">Total</span>
            <span className="text-xl font-extrabold text-navy-900">{formatPriceRupees(total)}</span>
          </div>
          {savings > 0 && (
            <div className="flex items-center justify-end gap-1">
              <span className="text-xs font-medium text-green-600">
                You save {formatPriceRupees(savings)} on this order
              </span>
            </div>
          )}
        </div>

        {/* Place Order Button */}
        <button
          onClick={onPlaceOrder}
          disabled={isPlacingOrder}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-4 text-base font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-brand-600 disabled:opacity-60"
        >
          <Lock className="h-5 w-5" />
          {isPlacingOrder ? 'Processing...' : 'Place Order'}
        </button>

        {/* Security Badges */}
        <div className="mt-4 flex items-center justify-center gap-4 rounded-lg border border-gray-100 bg-gray-50 py-3">
          <div className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-[10px] font-medium text-gray-500">SSL Secure</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] font-medium text-gray-500">Verified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="h-4 w-4 text-green-600" />
            <span className="text-[10px] font-medium text-gray-500">Encrypted</span>
          </div>
        </div>

        {/* Payment icons */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {['VISA', 'MC', 'RuPay', 'UPI', 'COD'].map((m) => (
            <span
              key={m}
              className="rounded border border-gray-100 bg-gray-50 px-2 py-1 text-[10px] font-medium text-gray-400"
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
