'use client';

import Link from 'next/link';
import {
  ArrowLeft, ChevronRight, Check, X, RotateCcw, Banknote,
  CheckCircle, AlertCircle, User, Store, Truck, Image,
  ShieldCheck, Package, Clock,
} from 'lucide-react';
import { SectionSkeleton, ErrorSection, formatPriceRupees } from '@homebase/shared';
import { useReturnDetail, useReturnAdminAction } from '../hooks/use-returns';
import type { ReturnTimelineStep } from '../services/return-detail-mock';

// ----------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------

function StatusBadge({ label, color }: { label: string; color: string }) {
  const map: Record<string, string> = {
    green: 'bg-green-50 text-green-700',
    blue: 'bg-blue-50 text-blue-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    red: 'bg-red-50 text-red-700',
  };
  const dotMap: Record<string, string> = {
    green: 'bg-green-500', blue: 'bg-blue-500', yellow: 'bg-yellow-500', red: 'bg-red-500',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${map[color] ?? 'bg-gray-50 text-gray-600'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotMap[color] ?? 'bg-gray-400'}`} />
      {label}
    </span>
  );
}

function VerticalTimeline({ steps }: { steps: ReturnTimelineStep[] }) {
  return (
    <div className="relative pl-8" role="list" aria-label="Return progress">
      <div className="absolute bottom-2 left-3 top-2 w-0.5 bg-gray-200" aria-hidden="true" />
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const completed = step.status === 'completed';
        const current = step.status === 'current';
        return (
          <div key={step.label} className={`relative flex gap-4 ${isLast ? '' : 'mb-6'}`} role="listitem">
            <div
              className={`absolute -left-5 z-10 flex h-6 w-6 items-center justify-center rounded-full ${
                completed ? 'bg-green-500' : current ? 'bg-yellow-500' : 'bg-gray-200'
              }`}
              aria-current={current ? 'step' : undefined}
            >
              {completed ? (
                <Check className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
              ) : current ? (
                <Truck className="h-3.5 w-3.5 text-white" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-gray-400" />
              )}
            </div>
            <div>
              <p className={`text-sm font-semibold ${current ? 'text-yellow-700' : completed ? 'text-gray-900' : 'text-gray-400'}`}>
                {step.label}
              </p>
              <p className={`text-xs ${completed || current ? 'text-gray-400' : 'text-gray-300'}`}>
                {step.date ?? 'Pending'}
                {step.actor && <> &middot; {step.actor}</>}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ----------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------

interface ReturnDetailProps {
  id: string;
}

export function ReturnDetail({ id }: ReturnDetailProps) {
  const { data: ret, isLoading, error, refetch } = useReturnDetail(id);
  const adminAction = useReturnAdminAction();

  // -- 4 states --
  if (isLoading) {
    return (
      <div className="space-y-6" role="status" aria-label="Loading return details">
        <SectionSkeleton rows={2} />
        <SectionSkeleton rows={4} />
        <SectionSkeleton rows={6} />
      </div>
    );
  }

  if (error) {
    return <ErrorSection error={error} onRetry={() => refetch()} />;
  }

  if (!ret) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center" role="alert">
        <RotateCcw className="h-12 w-12 text-gray-300" />
        <p className="mt-4 text-lg font-semibold text-gray-600">Return not found</p>
        <p className="mt-1 text-sm text-gray-400">The return you are looking for does not exist.</p>
        <Link href="/returns" className="mt-4 text-sm font-medium text-orange-600 hover:text-orange-700">
          Back to Returns
        </Link>
      </div>
    );
  }

  const handleAction = (action: string) => {
    adminAction.mutate({ id: ret.id, action });
  };

  return (
    <article className="space-y-6" aria-label={`Return ${ret.id} details`}>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
        <Link href="/returns" className="text-gray-400 hover:text-orange-500">Returns</Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
        <span className="font-medium text-gray-700">{ret.id}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/returns" className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50" aria-label="Back to returns">
            <ArrowLeft className="h-4 w-4 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Return {ret.id}</h1>
          <StatusBadge label={ret.status} color={ret.statusColor} />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { if (confirm('Approve this return request?')) handleAction('approve'); }}
            disabled={adminAction.isPending}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            <Check className="h-4 w-4" /> Approve
          </button>
          <button
            onClick={() => { if (confirm('Reject this return request?')) handleAction('reject'); }}
            disabled={adminAction.isPending}
            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <X className="h-4 w-4" /> Reject
          </button>
          <button
            onClick={() => { if (confirm('Override policy and approve?')) handleAction('override'); }}
            disabled={adminAction.isPending}
            className="flex items-center gap-2 rounded-lg border border-yellow-300 px-4 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-50 disabled:opacity-50"
          >
            <ShieldCheck className="h-4 w-4" /> Override
          </button>
          <button
            onClick={() => { if (confirm('Force refund immediately?')) handleAction('force-refund'); }}
            disabled={adminAction.isPending}
            className="flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50"
          >
            <Banknote className="h-4 w-4" /> Force Refund
          </button>
        </div>
      </div>

      {/* Timeline */}
      <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Return progress">
        <h3 className="mb-4 font-semibold text-gray-900">Return Progress</h3>
        <VerticalTimeline steps={ret.timeline} />
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT (2/3) */}
        <div className="space-y-6 lg:col-span-2">

          {/* Return Items */}
          <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Return items">
            <h3 className="mb-4 font-semibold text-gray-900">Return Items</h3>
            {ret.items.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.id}`}
                className="flex gap-4 rounded-lg bg-gray-50 p-4 transition hover:bg-gray-100"
              >
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-3xl" aria-hidden="true">
                  {item.emoji}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                  <p className="mt-0.5 text-xs text-gray-400">SKU: {item.sku}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="text-xs text-gray-500">Qty: <span className="font-medium text-gray-900">{item.qty}</span></span>
                    <span className="text-xs text-gray-500">Price: <span className="font-medium text-gray-900">{formatPriceRupees(item.price)}</span></span>
                  </div>
                  <div className="mt-2 flex items-center gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Reason</p>
                      <p className="text-xs font-medium text-red-600">{item.reason}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Condition</p>
                      <p className="text-xs font-medium text-yellow-600">{item.condition}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </section>

          {/* Original Order */}
          <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Original order">
            <h3 className="mb-4 font-semibold text-gray-900">Original Order</h3>
            <Link
              href={`/orders/${ret.originalOrder.id.replace('#', '')}`}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-4 transition hover:bg-gray-100"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Order <span className="font-mono text-orange-600">{ret.originalOrder.id}</span>
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  Placed: {ret.originalOrder.placedDate} &middot; Delivered: {ret.originalOrder.deliveredDate}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{formatPriceRupees(ret.originalOrder.amount)}</p>
                <StatusBadge label={ret.originalOrder.status} color={ret.originalOrder.statusColor} />
              </div>
            </Link>
          </section>

          {/* Refund Breakdown */}
          <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Refund breakdown">
            <h3 className="mb-4 font-semibold text-gray-900">Refund Breakdown</h3>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Item Value</dt><dd className="font-medium">{formatPriceRupees(ret.refund.itemValue)}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Shipping Refund</dt><dd className="font-medium">{formatPriceRupees(ret.refund.shippingRefund)} ({ret.refund.shippingLabel})</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Discount Adjustment</dt><dd className="font-medium text-red-500">-{formatPriceRupees(ret.refund.discountAdjustment)}</dd></div>
              <div className="flex justify-between border-t border-gray-100 pt-3">
                <dt className="font-bold text-gray-900">Total Refund</dt>
                <dd className="text-lg font-bold text-green-600">{formatPriceRupees(ret.refund.totalRefund)}</dd>
              </div>
              <div className="flex justify-between"><dt className="text-gray-500">Refund Method</dt><dd className="font-medium">{ret.refund.refundMethod}</dd></div>
            </dl>
          </section>

          {/* Customer Comments & Evidence */}
          <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Customer evidence">
            <h3 className="mb-4 font-semibold text-gray-900">Customer Comments &amp; Evidence</h3>
            <blockquote className="mb-4 rounded-lg bg-gray-50 p-4">
              <p className="text-sm leading-relaxed text-gray-700">&ldquo;{ret.customerComment}&rdquo;</p>
              <p className="mt-2 text-xs text-gray-400">Submitted on {ret.commentDate}</p>
            </blockquote>
            <div className="grid grid-cols-3 gap-3" role="list" aria-label="Evidence photos">
              {ret.evidence.map((e, i) => (
                <div
                  key={i}
                  className="flex aspect-square items-center justify-center rounded-lg border border-gray-300 bg-gray-200 text-xs text-gray-400"
                  role="listitem"
                >
                  <div className="text-center">
                    <Image className="mx-auto mb-1 h-8 w-8 text-gray-300" />
                    {e.filename}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT (1/3) */}
        <div className="space-y-6">

          {/* Customer Info */}
          <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Customer">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Customer</h3>
            <div className="mb-3 flex items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${ret.customer.avatarBg}`}>
                {ret.customer.initials}
              </div>
              <div>
                <Link href={`/users/${ret.customer.id}`} className="text-sm font-medium text-orange-600 hover:underline">{ret.customer.name}</Link>
                <p className="text-xs text-gray-400">{ret.customer.email}</p>
              </div>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Phone</dt><dd>{ret.customer.phone}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Total Returns</dt><dd className="font-medium">{ret.customer.totalReturns}</dd></div>
            </dl>
          </section>

          {/* Seller Info */}
          <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Seller">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Seller</h3>
            <div className="mb-3 flex items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${ret.seller.avatarBg}`}>
                {ret.seller.initials}
              </div>
              <div>
                <Link href={`/suppliers/${ret.seller.id}`} className="text-sm font-medium text-orange-600 hover:underline">{ret.seller.name}</Link>
                <p className="text-xs text-gray-400">{ret.seller.tier}</p>
              </div>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Response Status</dt>
                <dd><StatusBadge label={ret.seller.responseStatus} color={ret.seller.responseStatusColor} /></dd>
              </div>
              <div className="flex justify-between"><dt className="text-gray-500">Response Date</dt><dd>{ret.seller.responseDate}</dd></div>
            </dl>
          </section>

          {/* Policy Compliance */}
          <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Return policy check">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Return Policy Check</h3>
            <dl className="space-y-2.5 text-sm">
              {ret.policyChecks.map((check, i) => (
                <div key={i} className="flex items-center justify-between">
                  <dt className="text-gray-500">{check.label}</dt>
                  <dd className={`flex items-center gap-1 font-medium ${check.passed ? 'text-green-600' : 'text-red-600'}`}>
                    {check.passed ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    {check.detail}
                  </dd>
                </div>
              ))}
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                <dt className="font-semibold text-gray-700">Verdict</dt>
                <dd>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    ret.policyVerdictColor === 'green' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${ret.policyVerdictColor === 'green' ? 'bg-green-500' : 'bg-red-500'}`} />
                    {ret.policyVerdict}
                  </span>
                </dd>
              </div>
            </dl>
          </section>

          {/* Pickup Details */}
          <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Pickup details">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Pickup Details</h3>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Scheduled Date</dt><dd className="font-medium">{ret.pickup.scheduledDate}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Time Slot</dt><dd className="font-medium">{ret.pickup.timeSlot}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Carrier</dt><dd className="font-medium">{ret.pickup.carrier}</dd></div>
              <div><dt className="text-gray-500">Pickup Address</dt></div>
              <dd className="text-sm text-gray-600">{ret.pickup.address}</dd>
            </dl>
          </section>
        </div>
      </div>
    </article>
  );
}
