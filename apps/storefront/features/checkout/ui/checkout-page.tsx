'use client';

import { useState, useReducer, useEffect } from 'react';
import Link from 'next/link';
import { Separator, Button } from '@homebase/ui';
import {
  useCartStore,
  formatPriceRupees,
  FREE_SHIPPING_THRESHOLD,
  ErrorSection,
  SectionSkeleton,
  track,
  getErrorMessage,
} from '@homebase/shared';
import {
  checkoutReducer,
  initialCheckoutState,
  isEventAllowed,
} from '../model/checkout-machine';
import { useCreateCheckout, useSetCheckoutAddress, useSetCheckoutPayment, usePlaceOrder } from '../api/queries';
import { CheckoutStepIndicator } from './checkout-step-indicator';
import { CheckoutAddressSection } from './checkout-address-section';
import { CheckoutShippingSection } from './checkout-shipping-section';
import { CheckoutPaymentSection } from './checkout-payment-section';
import { CheckoutOrderSummary } from './checkout-order-summary';
import type { Address } from '@homebase/types';
import { Lock, Shield } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Mock data                                                           */
/* ------------------------------------------------------------------ */
const MOCK_ADDRESSES = [
  {
    id: 'addr-1',
    fullName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    addressLine1: 'Flat 402, Sunshine Towers',
    addressLine2: 'MG Road, Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034',
    country: 'India',
    type: 'HOME' as const,
    label: 'Home',
    isDefault: true,
  },
  {
    id: 'addr-2',
    fullName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    addressLine1: '3rd Floor, WeWork Galaxy',
    addressLine2: 'Residency Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560025',
    country: 'India',
    type: 'WORK' as const,
    label: 'Office',
    isDefault: false,
  },
];

const MOCK_ITEMS = [
  {
    id: 'mock-1',
    productId: 'prod-sony-wh1000xm5',
    productName: 'Sony WH-1000XM5 Wireless',
    variantName: 'Color: Black | Qty: 1',
    imageUrl: '/images/products/headphones.jpg',
    sku: 'SONY-WH1000XM5-BLK',
    quantity: 1,
    unitPrice: 22490,
    mrp: 29990,
    totalPrice: 22490,
    currency: 'INR',
    inStock: true,
    maxQuantity: 5,
  },
  {
    id: 'mock-2',
    productId: 'prod-apple-watch-ultra2',
    productName: 'Apple Watch Ultra 2 GPS',
    variantName: 'Size: 49mm | Qty: 1',
    imageUrl: '/images/products/watch.jpg',
    sku: 'APPL-WU2-49-SLV',
    quantity: 1,
    unitPrice: 89900,
    mrp: 89900,
    totalPrice: 89900,
    currency: 'INR',
    inStock: true,
    maxQuantity: 3,
  },
  {
    id: 'mock-3',
    productId: 'prod-nike-airmax270',
    productName: 'Nike Air Max 270 React',
    variantName: 'Size: UK 9 | Qty: 1',
    imageUrl: '/images/products/shoes.jpg',
    sku: 'NIKE-AM270-WORG-UK9',
    quantity: 1,
    unitPrice: 8995,
    mrp: 12995,
    totalPrice: 8995,
    currency: 'INR',
    inStock: true,
    maxQuantity: 5,
  },
];

/* ------------------------------------------------------------------ */
/* Main Component                                                      */
/* ------------------------------------------------------------------ */
export function CheckoutPage() {
  const [machineState, dispatch] = useReducer(checkoutReducer, initialCheckoutState);
  const { items: storeItems, subtotal, clear: clearCart } = useCartStore();

  const createCheckout = useCreateCheckout();
  const setAddress = useSetCheckoutAddress();
  const setPayment = useSetCheckoutPayment();
  const placeOrder = usePlaceOrder();

  // Local UI state for the all-on-one-page checkout
  const [selectedAddressId, setSelectedAddressId] = useState<string>('addr-1');
  const [shippingMethod, setShippingMethod] = useState<string>('standard');
  const [paymentMethod, setPaymentMethod] = useState<string>('upi');
  const [couponInput, setCouponInput] = useState('');
  const [couponApplied, setCouponApplied] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Use store items if available, otherwise use mock
  const items = storeItems.length > 0 ? storeItems : MOCK_ITEMS;
  const sub = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const shippingCost = shippingMethod === 'express' ? 149 : shippingMethod === 'sameday' ? 299 : 0;
  const couponDiscount = couponApplied ? 1000 : 0;
  const gst = Math.round((sub - couponDiscount) * 0.18);
  const total = sub + shippingCost - couponDiscount + gst;
  const savings = items.reduce((sum, item) => sum + (item.mrp - item.unitPrice) * item.quantity, 0) + couponDiscount;

  useEffect(() => {
    if (storeItems.length === 0) return;
    createCheckout.mutate(undefined, {
      onSuccess: (data) => {
        dispatch({
          type: 'INIT_SUCCESS',
          checkoutId: data.mutatedEntity.id,
          checkout: data.mutatedEntity,
          allowedActions: data.allowedActionsAndMetadata,
        });
      },
      onError: (error) => {
        dispatch({ type: 'INIT_ERROR', error: getErrorMessage(error) });
      },
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);

    if (machineState.checkoutId && isEventAllowed(machineState.allowedActions, 'PLACE_ORDER')) {
      dispatch({ type: 'SUBMIT_START' });
      placeOrder.mutate(
        { id: machineState.checkoutId },
        {
          onSuccess: (data) => {
            const orderId = data.mutatedEntity.orderId || data.mutatedEntity.id;
            dispatch({ type: 'SUBMIT_SUCCESS', orderId });
            clearCart();
            track('purchase', { orderId, value: data.mutatedEntity.total });
          },
          onError: (error) => {
            dispatch({ type: 'SUBMIT_ERROR', error: getErrorMessage(error) });
            setIsPlacingOrder(false);
          },
        },
      );
    } else {
      // Mock mode
      setTimeout(() => {
        setIsPlacingOrder(false);
      }, 1500);
    }
  };

  if (machineState.step === 'SUCCESS') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <span className="text-3xl text-green-600">&#10003;</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Order Placed!</h2>
        <p className="mt-2 text-gray-500">Order ID: {machineState.orderId}</p>
        <div className="mt-6 flex gap-3">
          <Link href={`/orders/${machineState.orderId}`}>
            <Button>Track Order</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
        <p className="text-lg font-medium text-gray-900">Your cart is empty</p>
        <Link href="/products">
          <Button className="mt-4">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Simplified Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-navy-900">
              Home<span className="text-brand-500">Base</span>
            </span>
          </Link>

          {/* Desktop Step Indicator */}
          <CheckoutStepIndicator activeStep={1} className="hidden md:flex" />

          {/* Secure Badge */}
          <div className="flex items-center gap-2 text-gray-500">
            <Lock className="h-4 w-4 text-green-600" />
            <span className="text-xs font-medium text-green-600">Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Mobile Steps */}
      <div className="border-b border-gray-100 bg-white px-4 py-3 md:hidden">
        <CheckoutStepIndicator activeStep={1} mobile />
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* ===== LEFT COLUMN: CHECKOUT FORM ===== */}
          <div className="min-w-0 flex-1">
            {/* Section 1: Shipping Address */}
            <CheckoutAddressSection
              addresses={MOCK_ADDRESSES}
              selectedId={selectedAddressId}
              onSelect={setSelectedAddressId}
            />

            {/* Section 2: Shipping Method */}
            <CheckoutShippingSection
              selectedMethod={shippingMethod}
              onSelect={setShippingMethod}
            />

            {/* Section 3: Payment Method */}
            <CheckoutPaymentSection
              selectedMethod={paymentMethod}
              onSelect={setPaymentMethod}
            />
          </div>

          {/* ===== RIGHT COLUMN: ORDER SUMMARY (Sticky) ===== */}
          <div className="shrink-0 lg:w-[400px]">
            <div className="lg:sticky lg:top-24">
              <CheckoutOrderSummary
                items={items}
                subtotal={sub}
                shipping={shippingCost}
                couponDiscount={couponDiscount}
                gst={gst}
                total={total}
                savings={savings}
                couponInput={couponInput}
                onCouponInputChange={setCouponInput}
                couponApplied={couponApplied}
                onApplyCoupon={() => setCouponApplied(true)}
                onPlaceOrder={handlePlaceOrder}
                isPlacingOrder={isPlacingOrder}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
