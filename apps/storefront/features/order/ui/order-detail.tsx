'use client';

import Link from 'next/link';
import {
  Printer,
  Truck,
  RefreshCw,
  HelpCircle,
  ArrowLeft,
  MapPin,
  CreditCard,
  Calendar,
  Check,
} from 'lucide-react';
import { AccountSidebar, OrderTimeline, StatusBadge } from '@homebase/ui';
import type { TimelineStep } from '@homebase/ui';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const ORDER = {
  id: 'HB-20260322-5103',
  date: 'March 22, 2026 at 2:34 PM',
  status: 'Shipped' as const,
  items: [
    {
      emoji: '\uD83D\uDCF1',
      name: 'iPhone 16 Pro Max',
      detail: 'Storage: 256GB \u00B7 Color: Natural Titanium',
      sku: 'APL-IP16PM-256-NT',
      price: '\u20B91,34,900',
      priceDetail: '\u20B91,34,900 x 1',
      qty: 1,
      status: 'Shipped',
    },
    {
      emoji: '\uD83D\uDD12',
      name: 'Apple MagSafe Clear Case',
      detail: 'Model: iPhone 16 Pro Max \u00B7 Color: Clear',
      sku: 'APL-CASE-16PM-CLR',
      price: '\u20B94,900',
      priceDetail: '\u20B94,900 x 1',
      qty: 1,
      status: 'Shipped',
    },
  ],
  subtotal: '\u20B91,39,800',
  shipping: 'FREE',
  discountCode: 'SAVE10',
  discount: '- \u20B95,000',
  tax: '\u20B910,100',
  total: '\u20B91,44,900',
  address: {
    name: 'Premkumar',
    line1: 'Flat 302, Sunshine Apartments',
    line2: 'MG Road, Bengaluru',
    state: 'Karnataka - 560001',
    country: 'India',
    phone: '+91 98765 43210',
  },
  payment: {
    method: 'UPI (Google Pay)',
    txnId: 'TXN-4829173650',
    status: 'Paid',
    date: 'March 22, 2026',
  },
  delivery: {
    carrier: 'Delhivery Express',
    tracking: 'DLV-9284710563',
    from: 'Mumbai, Maharashtra',
    estimated: 'March 28 - 30, 2026',
  },
};

const TIMELINE_STEPS: TimelineStep[] = [
  { title: 'Placed', date: 'Mar 22, 2:34 PM', status: 'completed' },
  { title: 'Confirmed', date: 'Mar 22, 3:10 PM', status: 'completed' },
  { title: 'Shipped', date: 'Mar 24, 9:15 AM', status: 'current' },
  { title: 'Out for Delivery', date: 'Pending', status: 'pending' },
  { title: 'Delivered', date: 'Pending', status: 'pending' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function OrderDetail({ orderId }: { orderId: string }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <AccountSidebar
            userName="Premkumar"
            userEmail="premkumar@email.com"
            activePage="orders"
          />
        </div>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-400 hover:text-brand-500 transition">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/profile" className="text-gray-400 hover:text-brand-500 transition">My Account</Link>
            <span className="text-gray-300">/</span>
            <Link href="/orders" className="text-gray-400 hover:text-brand-500 transition">My Orders</Link>
            <span className="text-gray-300">/</span>
            <span className="text-navy-900 font-medium">Order #{ORDER.id}</span>
          </nav>

          {/* Order Header */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-5 gap-4">
              <div className="flex items-center gap-6 flex-wrap">
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Order ID</p>
                  <p className="text-lg font-bold text-navy-900 mt-0.5">#{ORDER.id}</p>
                </div>
                <div className="hidden sm:block w-px h-10 bg-gray-200" />
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Order Date</p>
                  <p className="text-sm font-medium text-gray-700 mt-0.5">{ORDER.date}</p>
                </div>
                <div className="hidden sm:block w-px h-10 bg-gray-200" />
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Status</p>
                  <div className="mt-0.5">
                    <StatusBadge status={ORDER.status} />
                  </div>
                </div>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg px-4 py-2.5 hover:border-brand-400 hover:text-brand-600 transition bg-white"
              >
                <Printer className="w-4 h-4" />
                Print Invoice
              </button>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6 p-6">
            <h2 className="text-sm font-semibold text-navy-900 mb-6">Order Tracking</h2>
            <OrderTimeline steps={TIMELINE_STEPS} direction="horizontal" />
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-navy-900">Order Items ({ORDER.items.length})</h2>
              <span className="text-xs text-gray-400">Sold by: HomeBase Marketplace</span>
            </div>
            {ORDER.items.map((item, idx) => (
              <div key={idx} className={`px-6 py-5 ${idx < ORDER.items.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center text-4xl shrink-0">
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-navy-900">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{item.detail}</p>
                        <p className="text-xs text-gray-400 mt-0.5">SKU: {item.sku}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-navy-900">{item.price}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{item.priceDetail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">Qty: {item.qty}</span>
                      <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        <span className="w-1 h-1 bg-blue-500 rounded-full" />
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Price Summary + Shipping Address */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Price Summary */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-navy-900">Price Summary</h2>
              </div>
              <div className="px-6 py-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Subtotal (2 items)</span>
                  <span className="text-gray-700 font-medium">{ORDER.subtotal}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-600 font-medium">{ORDER.shipping}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    Discount
                    <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-medium">{ORDER.discountCode}</span>
                  </span>
                  <span className="text-green-600 font-medium">{ORDER.discount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">GST (18%)</span>
                  <span className="text-gray-700 font-medium">{ORDER.tax}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-navy-900">Total Paid</span>
                    <span className="text-lg font-extrabold text-brand-600">{ORDER.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-navy-900">Shipping Address</h2>
              </div>
              <div className="px-6 py-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">{ORDER.address.name}</p>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      {ORDER.address.line1}<br />
                      {ORDER.address.line2}<br />
                      {ORDER.address.state}<br />
                      {ORDER.address.country}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
                      {ORDER.address.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment + Delivery Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Payment Info */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-navy-900">Payment Information</h2>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Payment Method</span>
                  <span className="text-sm font-medium text-navy-900 flex items-center gap-2">
                    <span className="w-7 h-7 bg-purple-50 rounded-md flex items-center justify-center text-xs font-bold text-purple-600">UPI</span>
                    {ORDER.payment.method}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Transaction ID</span>
                  <span className="text-sm font-mono text-gray-700">{ORDER.payment.txnId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Payment Status</span>
                  <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200">
                    <Check className="w-3 h-3" />
                    {ORDER.payment.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Paid On</span>
                  <span className="text-sm text-gray-700">{ORDER.payment.date}</span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-navy-900">Delivery Information</h2>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Carrier</span>
                  <span className="text-sm font-medium text-navy-900 flex items-center gap-2">
                    <span className="w-7 h-7 bg-blue-50 rounded-md flex items-center justify-center">
                      <Truck className="w-4 h-4 text-blue-600" />
                    </span>
                    {ORDER.delivery.carrier}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Tracking Number</span>
                  <span className="text-sm font-mono text-brand-600 underline underline-offset-2 cursor-pointer">
                    {ORDER.delivery.tracking}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Shipped From</span>
                  <span className="text-sm text-gray-700">{ORDER.delivery.from}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Estimated Delivery</span>
                  <span className="text-sm font-semibold text-green-600 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {ORDER.delivery.estimated}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
            <div className="px-6 py-5">
              <div className="flex flex-wrap items-center gap-3">
                <button className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-all hover:-translate-y-px hover:shadow-md">
                  <Truck className="w-4 h-4" />
                  Track Order
                </button>
                <button className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 border-2 border-brand-500 rounded-lg px-5 py-2.5 hover:bg-brand-50 transition">
                  <RefreshCw className="w-4 h-4" />
                  Buy Again
                </button>
                <Link
                  href="/returns"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg px-5 py-2.5 hover:border-red-300 hover:text-red-500 transition bg-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return / Refund
                </Link>
                <button className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg px-5 py-2.5 hover:border-brand-400 hover:text-brand-600 transition bg-white">
                  <HelpCircle className="w-4 h-4" />
                  Need Help
                </button>
              </div>
            </div>
          </div>

          {/* Back link */}
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 transition font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Orders
          </Link>
        </main>
      </div>
    </div>
  );
}
