'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, ArrowLeft, Tag, Trash2, Lock, Shield, RefreshCw, Truck, MessageCircle } from 'lucide-react';
import { useCartStore, formatPriceRupees, QuantitySelector, EmptyState, FREE_SHIPPING_THRESHOLD } from '@homebase/shared';
import { useAuth } from '@homebase/auth';
import { ProductCard } from '@homebase/ui';
import { Loader2 } from 'lucide-react';
import { useActiveCart, useRemoveFromCart, useUpdateCartItem, useApplyCoupon, useRemoveCoupon } from '../api/queries';
import { toast } from 'sonner';

/* ------------------------------------------------------------------ */
/* Mock data for recommendations (would come from an API)             */
/* ------------------------------------------------------------------ */
const MOCK_CART_ITEMS = [
  {
    id: 'mock-1',
    productId: 'prod-sony-wh1000xm5',
    productName: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    variantName: 'Color: Midnight Black | Size: One Size',
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
    productId: 'prod-nike-airmax270',
    productName: 'Nike Air Max 270 React Running Shoes',
    variantName: 'Color: White/Orange | Size: UK 9',
    imageUrl: '/images/products/shoes.jpg',
    sku: 'NIKE-AM270-WORG-UK9',
    quantity: 2,
    unitPrice: 8995,
    mrp: 12995,
    totalPrice: 17990,
    currency: 'INR',
    inStock: true,
    maxQuantity: 5,
  },
  {
    id: 'mock-3',
    productId: 'prod-apple-watch-ultra2',
    productName: 'Apple Watch Ultra 2 GPS + Cellular 49mm',
    variantName: 'Color: Titanium Silver | Size: 49mm',
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
];

const RECOMMENDATIONS = [
  {
    id: 'rec-1',
    name: 'iPad Air M2 11" 256GB Wi-Fi Space Gray',
    image: '/images/products/ipad.jpg',
    price: '\u20B959,900',
    originalPrice: '\u20B974,900',
    rating: 5,
    reviewCount: 245,
    discount: 20,
  },
  {
    id: 'rec-2',
    name: 'Samsung Galaxy S24 Ultra 512GB Titanium',
    image: '/images/products/samsung.jpg',
    price: '\u20B91,29,999',
    rating: 4,
    reviewCount: 128,
    isNew: true,
  },
  {
    id: 'rec-3',
    name: 'PlayStation 5 Slim Digital Edition Console',
    image: '/images/products/ps5.jpg',
    price: '\u20B937,990',
    originalPrice: '\u20B957,990',
    rating: 5,
    reviewCount: 312,
    discount: 35,
  },
  {
    id: 'rec-4',
    name: 'Canon EOS R50 Mirrorless Camera 18-45mm Kit',
    image: '/images/products/camera.jpg',
    price: '\u20B962,995',
    rating: 4,
    reviewCount: 87,
  },
];

/* ------------------------------------------------------------------ */
/* Trust badges data                                                   */
/* ------------------------------------------------------------------ */
const TRUST_BADGES = [
  { icon: Lock, title: 'Secure Payment', subtitle: '256-bit SSL encryption', bg: 'bg-green-50', color: 'text-green-600' },
  { icon: RefreshCw, title: 'Free Returns', subtitle: '30-day money back guarantee', bg: 'bg-blue-50', color: 'text-blue-500' },
  { icon: Truck, title: 'Free Shipping', subtitle: 'On orders over \u20B9999', bg: 'bg-brand-50', color: 'text-brand-500' },
  { icon: MessageCircle, title: '24/7 Support', subtitle: 'Live chat & phone support', bg: 'bg-purple-50', color: 'text-purple-500' },
];

const PAYMENT_METHODS = ['VISA', 'MasterCard', 'UPI', 'PayTM', 'COD', 'Net Banking'];

/* ------------------------------------------------------------------ */
/* Main Component                                                      */
/* ------------------------------------------------------------------ */
export function CartPage() {
  const { isAuthenticated } = useAuth();
  const guestStore = useCartStore();
  const { data: backendCart, isLoading: isCartLoading } = useActiveCart();
  const removeFromCart = useRemoveFromCart();
  const updateCartItem = useUpdateCartItem();
  const applyCouponMutation = useApplyCoupon();
  const removeCouponMutation = useRemoveCoupon();

  const [couponInput, setCouponInput] = useState('');

  // Determine data source based on authentication
  const backendItems = backendCart?.items ?? [];
  const items = isAuthenticated ? backendItems : (guestStore.items.length > 0 ? guestStore.items : MOCK_CART_ITEMS);
  const couponCode = isAuthenticated ? (backendCart?.couponCode ?? null) : guestStore.couponCode;
  const cartId = backendCart?.id;

  const subtotalValue = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = subtotalValue >= FREE_SHIPPING_THRESHOLD ? 0 : 49;
  const discount = couponCode ? Math.round(subtotalValue * 0.1) : 0;
  const gst = Math.round((subtotalValue - discount) * 0.18);
  const total = subtotalValue - discount + gst + shipping;
  const savings = items.reduce((sum, item) => sum + (item.mrp - item.unitPrice) * item.quantity, 0) + discount;

  const handleRemove = (itemId: string) => {
    if (isAuthenticated && cartId) {
      removeFromCart.mutate({ cartId, itemId });
    } else {
      guestStore.removeItem(itemId);
    }
    toast('Item removed from cart');
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (isAuthenticated && cartId) {
      updateCartItem.mutate({ cartId, itemId, quantity });
    } else {
      guestStore.updateQuantity(itemId, quantity);
    }
  };

  const handleApplyCoupon = () => {
    if (!couponInput) return;
    if (isAuthenticated && cartId) {
      applyCouponMutation.mutate(
        { cartId, couponCode: couponInput },
        {
          onSuccess: () => { setCouponInput(''); toast.success('Coupon applied'); },
          onError: () => { toast.error('Invalid coupon code'); },
        },
      );
    } else {
      guestStore.applyCoupon(couponInput);
      setCouponInput('');
      toast.success('Coupon applied');
    }
  };

  const handleRemoveCoupon = () => {
    if (isAuthenticated && cartId) {
      removeCouponMutation.mutate({ cartId }, { onSuccess: () => toast.success('Coupon removed') });
    } else {
      guestStore.removeCoupon();
    }
  };

  if (isAuthenticated && isCartLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <EmptyState
          icon={<ShoppingCart className="h-16 w-16" />}
          title="Your cart is empty"
          description="Add products to your cart to see them here."
          action={
            <Link href="/products">
              <button className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600">
                Continue Shopping
              </button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="transition hover:text-brand-500">Home</Link>
            <svg className="h-3.5 w-3.5 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            <span className="font-medium text-navy-900">Shopping Cart</span>
          </nav>
        </div>
      </div>

      {/* Cart Content */}
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4">
          {/* Page Title */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-extrabold text-navy-900">
              Shopping Cart{' '}
              <span className="text-lg font-semibold text-gray-400">({itemCount} items)</span>
            </h1>
            <Link
              href="/products"
              className="flex items-center gap-1 text-sm font-medium text-brand-500 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* ===== LEFT: Cart Items ===== */}
            <div className="min-w-0 flex-1">
              {/* Cart Header (Desktop) */}
              <div className="hidden rounded-t-xl bg-navy-900 px-6 py-3 md:grid md:grid-cols-12 md:gap-4">
                <div className="col-span-5 text-xs font-semibold uppercase tracking-wider text-gray-300">Product</div>
                <div className="col-span-2 text-center text-xs font-semibold uppercase tracking-wider text-gray-300">Price</div>
                <div className="col-span-2 text-center text-xs font-semibold uppercase tracking-wider text-gray-300">Quantity</div>
                <div className="col-span-2 text-center text-xs font-semibold uppercase tracking-wider text-gray-300">Subtotal</div>
                <div className="col-span-1 text-center"><span className="sr-only">Remove</span></div>
              </div>

              {/* Cart Items */}
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`grid grid-cols-1 items-center gap-4 border border-t-0 border-gray-100 bg-white px-6 py-5 transition hover:bg-[#FFFBF7] md:grid-cols-12 ${
                    index === 0 ? 'rounded-t-xl border-t md:rounded-t-none' : ''
                  } ${index === items.length - 1 ? 'rounded-b-xl' : ''}`}
                >
                  {/* Product Info */}
                  <div className="col-span-5 flex items-center gap-4">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-4xl text-gray-300">
                          <ShoppingCart className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <div>
                      <Link href={`/products/${item.productId}`}>
                        <h3 className="text-sm font-semibold leading-snug text-navy-900 hover:text-brand-500">
                          {item.productName}
                        </h3>
                      </Link>
                      {item.variantName && (
                        <div className="mt-1.5 flex items-center gap-3">
                          {item.variantName.split('|').map((v, i) => (
                            <span key={i} className="text-xs text-gray-400">
                              {v.trim().split(':')[0]}:{' '}
                              <span className="font-medium text-gray-600">{v.trim().split(':')[1]?.trim()}</span>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-1.5 flex items-center gap-2">
                        {item.inStock && (
                          <span className="rounded bg-green-50 px-1.5 py-0.5 text-[10px] font-medium text-green-600">
                            In Stock
                          </span>
                        )}
                        {subtotalValue >= FREE_SHIPPING_THRESHOLD && (
                          <span className="rounded bg-green-50 px-1.5 py-0.5 text-[10px] font-medium text-green-600">
                            Free Shipping
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 text-center">
                    <span className="text-sm font-semibold text-navy-900">{formatPriceRupees(item.unitPrice)}</span>
                    {item.mrp > item.unitPrice && (
                      <span className="block text-xs text-gray-400 line-through">{formatPriceRupees(item.mrp)}</span>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2 flex items-center justify-center">
                    <QuantitySelector
                      value={item.quantity}
                      onChange={(qty) => handleUpdateQuantity(item.id, qty)}
                      max={item.maxQuantity}
                    />
                  </div>

                  {/* Subtotal */}
                  <div className="col-span-2 text-center">
                    <span className="text-sm font-bold text-brand-600">{formatPriceRupees(item.totalPrice)}</span>
                  </div>

                  {/* Remove */}
                  <div className="col-span-1 text-center">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="rounded-lg p-1.5 text-gray-300 transition hover:bg-red-50 hover:text-red-500"
                      title="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Coupon Code Section */}
              <div className="mt-6 rounded-xl border border-gray-100 bg-white px-6 py-5">
                <div className="mb-3 flex items-center gap-3">
                  <Tag className="h-5 w-5 text-brand-500" />
                  <h3 className="text-sm font-semibold text-navy-900">Have a Promo Code?</h3>
                </div>
                {couponCode ? (
                  <div className="flex items-center justify-between rounded-lg bg-green-50 px-4 py-3 text-sm">
                    <span className="font-medium text-green-700">{couponCode} applied</span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-brand-400 focus:ring-1 focus:ring-brand-200"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={!couponInput}
                        className="whitespace-nowrap rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
                      >
                        Apply Code
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">
                      Try:{' '}
                      <button
                        onClick={() => setCouponInput('HOMEBASE10')}
                        className="cursor-pointer font-medium text-brand-500 hover:underline"
                      >
                        HOMEBASE10
                      </button>{' '}
                      for 10% off your first order
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* ===== RIGHT: Order Summary Sidebar ===== */}
            <div className="w-full shrink-0 lg:w-96">
              {/* Order Summary Card */}
              <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
                <div className="bg-navy-900 px-6 py-4">
                  <h2 className="text-base font-bold text-white">Order Summary</h2>
                </div>
                <div className="space-y-4 px-6 py-5">
                  {/* Line Items */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal ({itemCount} items)</span>
                    <span className="font-semibold text-navy-900">{formatPriceRupees(subtotalValue)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-semibold text-green-600">{shipping === 0 ? 'FREE' : formatPriceRupees(shipping)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1 text-gray-500">
                        Discount
                        <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-medium text-brand-500">
                          {couponCode}
                        </span>
                      </span>
                      <span className="font-semibold text-green-600">- {formatPriceRupees(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax (GST 18%)</span>
                    <span className="font-semibold text-navy-900">{formatPriceRupees(gst)}</span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-dashed border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-navy-900">Total</span>
                      <span className="text-2xl font-extrabold text-brand-600">{formatPriceRupees(total)}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-gray-400">Inclusive of all taxes</p>
                  </div>

                  {/* Savings Banner */}
                  {savings > 0 && (
                    <div className="flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-4 py-2.5">
                      <svg className="h-4 w-4 shrink-0 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs font-medium text-green-700">
                        You are saving <span className="font-bold">{formatPriceRupees(savings)}</span> on this order!
                      </p>
                    </div>
                  )}

                  {/* Checkout Button */}
                  <Link
                    href="/checkout"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-brand-600"
                  >
                    <Lock className="h-5 w-5" />
                    Proceed to Checkout
                  </Link>

                  {/* Continue Shopping */}
                  <Link
                    href="/products"
                    className="block py-1 text-center text-sm font-medium text-brand-500 hover:underline"
                  >
                    &larr; Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 rounded-xl border border-gray-100 bg-white px-6 py-5">
                <div className="mb-4 flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <h3 className="text-sm font-semibold text-navy-900">Safe & Secure Shopping</h3>
                </div>
                <div className="space-y-3">
                  {TRUST_BADGES.map((badge) => (
                    <div key={badge.title} className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${badge.bg}`}>
                        <badge.icon className={`h-4 w-4 ${badge.color}`} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-navy-900">{badge.title}</p>
                        <p className="text-[11px] text-gray-400">{badge.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Payment Methods */}
                <div className="mt-5 border-t border-gray-100 pt-4">
                  <p className="mb-2 text-xs font-medium text-gray-400">We Accept</p>
                  <div className="flex flex-wrap gap-2">
                    {PAYMENT_METHODS.map((method) => (
                      <span
                        key={method}
                        className="rounded border border-gray-100 bg-gray-50 px-2.5 py-1.5 text-[11px] font-medium text-gray-600"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ===== YOU MIGHT ALSO LIKE ===== */}
      <section className="border-t border-gray-100 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-navy-900">You Might Also Like</h2>
            <Link href="/products" className="text-sm font-medium text-brand-500 hover:underline">
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {RECOMMENDATIONS.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={(id) => toast.success('Added to cart')}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
