'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Printer, MoreVertical, ChevronRight,
  Package, Banknote, Settings, PenLine, Clock,
  User, Store, MapPin, CreditCard, Truck, BarChart3,
  CheckCircle, Flag, Copy, Send, X,
} from 'lucide-react';
import { SectionSkeleton, ErrorSection, formatPriceRupees } from '@homebase/shared';
import { useOrderDetail, useOrderAdminAction } from '../hooks/use-order';
import type {
  OrderTimelineStep,
  OrderItem,
  OrderAuditEntry,
} from '../services/order-detail-mock';

// ----------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------

function StatusDot({ color }: { color: string }) {
  const map: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    gray: 'bg-gray-400',
  };
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${map[color] ?? 'bg-gray-400'}`} />;
}

function StatusBadge({ label, color }: { label: string; color: string }) {
  const map: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    red: 'bg-red-50 text-red-700',
    gray: 'bg-gray-50 text-gray-600',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${map[color] ?? map.gray}`}>
      <StatusDot color={color} />
      {label}
    </span>
  );
}

function TimelineStepper({ steps }: { steps: OrderTimelineStep[] }) {
  return (
    <div className="flex items-start" role="list" aria-label="Order timeline">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const completed = step.status === 'completed';
        const current = step.status === 'current';
        return (
          <div key={step.label} className="flex flex-1 items-start" role="listitem">
            <div className="flex flex-col items-center flex-1 relative">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full z-10 ${
                  completed ? 'bg-green-500 text-white'
                  : current ? 'bg-blue-500 text-white ring-4 ring-blue-100'
                  : 'bg-gray-200 text-gray-400'
                }`}
                aria-current={current ? 'step' : undefined}
              >
                {completed ? (
                  <CheckCircle className="h-5 w-5" />
                ) : current ? (
                  <Truck className="h-5 w-5" />
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full bg-current" />
                )}
              </div>
              <p className={`mt-2 text-xs font-semibold ${current ? 'text-blue-600' : completed ? 'text-gray-900' : 'text-gray-400'}`}>
                {step.label}
              </p>
              <p className={`text-[10px] ${current ? 'text-blue-400' : completed ? 'text-gray-400' : 'text-gray-300'}`}>
                {step.date ?? 'Pending'}
              </p>
            </div>
            {!isLast && (
              <div className="flex flex-1 items-center" style={{ marginTop: 18 }}>
                <div className={`h-0.5 w-full rounded-full ${completed ? 'bg-green-500' : 'bg-gray-200'}`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ItemRow({ item }: { item: OrderItem }) {
  return (
    <Link
      href={`/products/${item.id}`}
      className="flex gap-4 rounded-lg bg-gray-50 p-4 transition hover:bg-gray-100"
    >
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-3xl" aria-hidden="true">
        {item.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900">{item.name}</p>
        <p className="mt-0.5 font-mono text-xs text-gray-400">SKU: {item.sku}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {item.variants.map((v) => (
            <span key={v.label} className="inline-flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-0.5 text-xs text-gray-600">
              {v.label}: <span className="font-medium text-gray-900">{v.value}</span>
            </span>
          ))}
          <span className="inline-flex items-center rounded border border-blue-100 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
            Qty: {item.qty}
          </span>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-bold text-gray-900">{formatPriceRupees(item.totalPrice)}</p>
        <p className="mt-0.5 text-xs text-gray-400">{formatPriceRupees(item.unitPrice)}/unit</p>
      </div>
    </Link>
  );
}

function AuditEntry({ entry }: { entry: OrderAuditEntry }) {
  return (
    <div className="relative flex gap-3.5">
      <div className={`mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full ${entry.color} z-10 ring-2 ring-white`} />
      <div>
        <p className="text-sm font-medium text-gray-900">{entry.event}</p>
        <p className="mt-0.5 text-xs text-gray-400">By {entry.actor} &middot; {entry.date}</p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------

interface OrderDetailProps {
  id: string;
}

export function OrderDetail({ id }: OrderDetailProps) {
  const { data: order, isLoading, error, refetch } = useOrderDetail(id);
  const adminAction = useOrderAdminAction();
  const [noteText, setNoteText] = useState('');

  // -- 4 states --
  if (isLoading) {
    return (
      <div className="space-y-6" role="status" aria-label="Loading order details">
        <SectionSkeleton rows={2} />
        <SectionSkeleton rows={4} />
        <SectionSkeleton rows={6} />
      </div>
    );
  }

  if (error) {
    return <ErrorSection error={error} onRetry={() => refetch()} />;
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center" role="alert">
        <Package className="h-12 w-12 text-gray-300" />
        <p className="mt-4 text-lg font-semibold text-gray-600">Order not found</p>
        <p className="mt-1 text-sm text-gray-400">The order you are looking for does not exist.</p>
        <Link href="/orders" className="mt-4 text-sm font-medium text-orange-600 hover:text-orange-700">
          Back to Orders
        </Link>
      </div>
    );
  }

  const handleAction = (action: string) => {
    adminAction.mutate({ id: order.id, action });
  };

  return (
    <article className="space-y-6" aria-label={`Order ${order.id} details`}>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
        <Link href="/orders" className="text-gray-400 hover:text-orange-500">Orders</Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
        <span className="font-medium text-gray-700">#{order.id}</span>
      </nav>

      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/orders" className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50" aria-label="Back to orders">
            <ArrowLeft className="h-4 w-4 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
          <StatusBadge label={order.status} color={order.statusColor} />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Printer className="h-4 w-4" /> Print Invoice
          </button>
          <div className="relative group">
            <button className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
              <MoreVertical className="h-4 w-4" /> More Actions
            </button>
            <div className="absolute right-0 top-full z-10 mt-1 hidden w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg group-hover:block">
              <button onClick={() => handleAction('duplicate')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Duplicate Order</button>
              <button onClick={() => handleAction('export')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Export as CSV</button>
              <button onClick={() => handleAction('notify')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Notify Customer</button>
              <div className="my-1 border-t border-gray-100" />
              <button onClick={() => handleAction('flag')} className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">Flag for Review</button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Banner */}
      <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Order summary">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <Package className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">Order #{order.id}</h2>
              <StatusBadge label="In Transit" color="blue" />
            </div>
            <div className="mt-1.5 flex items-center gap-4 text-sm text-gray-500">
              <span>Placed on {order.placedAt}</span>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <span>Customer: <Link href={`/users/${order.customer.id}`} className="font-medium text-orange-600 hover:underline">{order.customer.name}</Link></span>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <span className="font-semibold text-gray-900">{formatPriceRupees(order.priceSummary.total)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Order progress timeline">
        <TimelineStepper steps={order.timeline} />
      </section>

      {/* Main 2/3 + 1/3 Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* LEFT COLUMN */}
        <div className="space-y-6 lg:col-span-2">

          {/* Order Items */}
          <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Order items">
            <div className="mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900">Order Items ({order.items.length})</h3>
            </div>
            <div className="space-y-3">
              {order.items.map((item) => (
                <ItemRow key={item.id} item={item} />
              ))}
            </div>
          </section>

          {/* Price Summary */}
          <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Price summary">
            <div className="mb-4 flex items-center gap-2">
              <Banknote className="h-5 w-5 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900">Price Summary</h3>
            </div>
            <dl className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Subtotal ({order.priceSummary.itemCount} items)</dt>
                <dd className="font-medium text-gray-900">{formatPriceRupees(order.priceSummary.subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Shipping</dt>
                <dd className="font-medium text-green-600">{order.priceSummary.shippingLabel}</dd>
              </div>
              {order.priceSummary.discountCode && (
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-gray-500">
                    Discount
                    <span className="inline-flex rounded border border-red-100 bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-600">
                      {order.priceSummary.discountCode}
                    </span>
                  </dt>
                  <dd className="font-medium text-red-500">-{formatPriceRupees(order.priceSummary.discount)}</dd>
                </div>
              )}
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">GST ({order.priceSummary.gstPercent}%)</dt>
                <dd className="font-medium text-gray-900">{formatPriceRupees(order.priceSummary.gst)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <dt className="font-bold text-gray-900">Total</dt>
                <dd className="text-lg font-bold text-gray-900">{formatPriceRupees(order.priceSummary.total)}</dd>
              </div>
            </dl>
          </section>

          {/* Admin Actions */}
          <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Admin actions">
            <div className="mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900">Admin Actions</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { if (confirm('Override status to Delivered?')) handleAction('override-delivered'); }}
                disabled={adminAction.isPending}
                className="flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700 transition hover:bg-green-100 disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4" /> Override &rarr; Delivered
              </button>
              <button
                onClick={() => { if (confirm('Force cancel this order?')) handleAction('force-cancel'); }}
                disabled={adminAction.isPending}
                className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                <X className="h-4 w-4" /> Force Cancel
              </button>
              <button
                onClick={() => handleAction('force-refund')}
                disabled={adminAction.isPending}
                className="flex items-center justify-center gap-2 rounded-lg border border-yellow-300 bg-white px-4 py-2.5 text-sm font-medium text-yellow-700 transition hover:bg-yellow-50 disabled:opacity-50"
              >
                <Banknote className="h-4 w-4" /> Force Refund
              </button>
              <button
                onClick={() => handleAction('reassign')}
                disabled={adminAction.isPending}
                className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50 disabled:opacity-50"
              >
                <Send className="h-4 w-4" /> Reassign Seller
              </button>
            </div>
          </section>

          {/* Admin Notes */}
          <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Admin notes">
            <div className="mb-4 flex items-center gap-2">
              <PenLine className="h-5 w-5 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900">Admin Notes</h3>
            </div>
            <div className="space-y-3">
              {order.adminNotes.map((note, i) => (
                <div key={i} className="rounded-lg border border-yellow-100 bg-yellow-50 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-gray-500">{note.author}</p>
                    <p className="text-[10px] text-gray-400">{note.date}</p>
                  </div>
                  <p className="mt-1.5 text-sm text-gray-700">{note.content}</p>
                </div>
              ))}
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note about this order..."
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm placeholder-gray-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                aria-label="Add admin note"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => { handleAction('add-note'); setNoteText(''); }}
                  disabled={!noteText.trim()}
                  className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600 disabled:opacity-50"
                >
                  Save Note
                </button>
              </div>
            </div>
          </section>

          {/* Audit Trail */}
          <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Audit trail">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900">Audit Trail</h3>
            </div>
            <div className="relative">
              <div className="absolute bottom-2 left-[7px] top-2 w-px bg-gray-200" aria-hidden="true" />
              <div className="space-y-4" role="list" aria-label="Audit events">
                {order.auditTrail.map((entry, i) => (
                  <AuditEntry key={i} entry={entry} />
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          {/* Customer Card */}
          <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Customer information">
            <div className="mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900">Customer</h3>
            </div>
            <div className="mb-3 flex items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${order.customer.avatarBg}`}>
                {order.customer.initials}
              </div>
              <div>
                <Link href={`/users/${order.customer.id}`} className="text-sm font-medium text-orange-600 hover:underline">{order.customer.name}</Link>
                <p className="text-xs text-gray-400">{order.customer.email}</p>
              </div>
            </div>
            <dl className="space-y-2 border-t border-gray-100 pt-3 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Phone</dt><dd className="text-gray-900">{order.customer.phone}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Total Orders</dt><dd className="font-medium text-gray-900">{order.customer.totalOrders}</dd></div>
            </dl>
            <Link href={`/users/${order.customer.id}`} className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700">
              View Profile <ChevronRight className="h-3 w-3" />
            </Link>
          </section>

          {/* Seller Card */}
          <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Seller information">
            <div className="mb-3 flex items-center gap-2">
              <Store className="h-4 w-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900">Seller</h3>
            </div>
            <div className="mb-3 flex items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${order.seller.avatarBg}`}>
                {order.seller.initials}
              </div>
              <div>
                <Link href={`/suppliers/${order.seller.id}`} className="text-sm font-medium text-orange-600 hover:underline">{order.seller.name}</Link>
                <span className="ml-1.5 inline-flex items-center gap-0.5 rounded-full bg-purple-50 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700">
                  {order.seller.tier}
                </span>
              </div>
            </div>
            <dl className="space-y-2 border-t border-gray-100 pt-3 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Rating</dt><dd className="font-medium text-yellow-600">{order.seller.rating} &#9733;</dd></div>
            </dl>
            <Link href={`/suppliers/${order.seller.id}`} className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700">
              View Store <ChevronRight className="h-3 w-3" />
            </Link>
          </section>

          {/* Shipping Address */}
          <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Shipping address">
            <div className="mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900">Shipping Address</h3>
            </div>
            <address className="text-sm leading-relaxed text-gray-600 not-italic">
              <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
              <p className="mt-1">{order.shippingAddress.line1}</p>
              <p>{order.shippingAddress.line2}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
              <p className="mt-2 text-xs text-gray-400">{order.shippingAddress.phone}</p>
            </address>
          </section>

          {/* Payment */}
          <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Payment information">
            <div className="mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900">Payment</h3>
            </div>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Method</dt><dd className="font-medium text-gray-900">{order.payment.method} ({order.payment.provider})</dd></div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Transaction ID</dt>
                <dd className="rounded border border-gray-100 bg-gray-50 px-2 py-0.5 font-mono text-xs">{order.payment.transactionId}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Status</dt>
                <dd className="flex items-center gap-1 font-medium text-green-600">
                  <CheckCircle className="h-3.5 w-3.5" /> {order.payment.status}
                </dd>
              </div>
            </dl>
          </section>

          {/* Delivery */}
          <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Delivery information">
            <div className="mb-3 flex items-center gap-2">
              <Truck className="h-4 w-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900">Delivery</h3>
            </div>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Carrier</dt><dd className="font-medium text-gray-900">{order.delivery.carrier}</dd></div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Tracking</dt>
                <dd className="rounded border border-gray-100 bg-gray-50 px-2 py-0.5 font-mono text-xs text-orange-600">{order.delivery.trackingId}</dd>
              </div>
              <div className="flex justify-between"><dt className="text-gray-500">Est. Delivery</dt><dd className="font-medium text-gray-900">{order.delivery.estimatedDate}</dd></div>
            </dl>
          </section>

          {/* Financial Breakdown (Admin Only) */}
          <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Financial breakdown">
            <div className="mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900">Financial Breakdown</h3>
              <span className="ml-auto inline-flex rounded border border-red-100 bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-600">
                Admin Only
              </span>
            </div>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Order Value</dt><dd className="font-medium text-gray-900">{formatPriceRupees(order.financials.orderValue)}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Platform Fee ({order.financials.platformFeePercent}%)</dt><dd className="text-red-500">-{formatPriceRupees(order.financials.platformFee)}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Gateway Fee ({order.financials.gatewayFeePercent}%)</dt><dd className="text-red-500">-{formatPriceRupees(order.financials.gatewayFee)}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">GST on Fees (18%)</dt><dd className="text-red-500">-{formatPriceRupees(order.financials.gstOnFees)}</dd></div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-2.5">
                <dt className="font-bold text-gray-900">Seller Payout</dt>
                <dd className="font-bold text-green-600">{formatPriceRupees(order.financials.sellerPayout)}</dd>
              </div>
              <div className="flex justify-between pt-1 text-xs text-gray-400">
                <dt>Settlement Ref</dt>
                <dd className="font-mono">{order.financials.settlementRef}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </article>
  );
}
