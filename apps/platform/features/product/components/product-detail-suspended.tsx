'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight, AlertTriangle, Check, Ban, Mail, Star,
  ImageIcon, Clock, Upload, Send, Calendar,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';

import type { ProductDetailData } from '../types';
import {
  mockSuspensionInfo, mockRemediationSteps, mockSuspensionHistory, mockAccountImpact,
} from '../services/product-detail-state-mock';

const SUSPENDED_TABS = ['Activity Log', 'Overview', 'Reviews'] as const;

interface ProductDetailSuspendedProps {
  product: ProductDetailData;
}

export function ProductDetailSuspended({ product: p }: ProductDetailSuspendedProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <article className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/products" className="text-gray-400 hover:text-brand-500">Products</Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
        <span className="font-medium text-gray-700">{p.name}</span>
      </nav>

      {/* ===== SUSPENSION BANNER ===== */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-red-600" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">This product has been suspended</p>
            <p className="mt-0.5 text-xs text-red-700">Suspended by {mockSuspensionInfo.suspendedBy} on {new Date(mockSuspensionInfo.suspendedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Suspension Reason */}
        <div className="ml-9 mt-3 rounded-lg border border-red-100 bg-white p-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-red-700">Suspension Reason</p>
          <p className="text-sm text-gray-800">{mockSuspensionInfo.reason}</p>
        </div>

        {/* Buyer Complaints */}
        <div className="ml-9 mt-3 rounded-lg border border-amber-100 bg-white p-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-700">Buyer Complaints ({mockSuspensionInfo.complaints.length})</p>
          <div className="mt-2 space-y-2">
            {mockSuspensionInfo.complaints.map((c, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 shrink-0 text-xs text-gray-400">#{i + 1}</span>
                <div>
                  <p className="text-gray-700">&ldquo;{c.text}&rdquo;</p>
                  <p className="text-xs text-gray-400">By buyer &middot; {c.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="ml-9 mt-4 flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
            <Check className="h-4 w-4" />Reactivate
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50">
            <Ban className="h-4 w-4" />Permanently Disable
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            <Mail className="h-4 w-4" />Message Seller
          </button>
        </div>
      </div>

      {/* ===== REMEDIATION + APPEAL/IMPACT (3-col) ===== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Remediation Checklist (2/3) */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-brand-500" />
              <h3 className="text-sm font-semibold text-gray-900">Remediation Checklist</h3>
            </div>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">1 of 3 completed</span>
          </div>
          <p className="mb-4 text-xs text-gray-500">The seller must complete all steps below before this product can be reactivated.</p>
          <div className="space-y-3">
            {mockRemediationSteps.map((step, i) => (
              <div key={i} className={cn('flex items-start gap-3 rounded-lg border p-3', step.status === 'done' ? 'border-green-200 bg-green-50/50' : 'border-amber-200 bg-amber-50/50')}>
                <input type="checkbox" checked={step.status === 'done'} readOnly disabled className={cn('mt-1 h-4 w-4 rounded border-gray-300', step.status === 'done' ? 'text-green-600' : 'text-brand-500')} />
                <div className="flex-1">
                  <p className={cn('text-sm font-medium text-gray-800', step.status === 'done' && 'line-through')}>{step.label}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{step.description}</p>
                </div>
                <span className={cn('inline-flex shrink-0 items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold', step.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')}>
                  {step.status === 'done' ? <><Check className="h-3 w-3" />Done</> : <><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Pending</>}
                </span>
              </div>
            ))}
          </div>
          {/* Estimated Reactivation */}
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
            <Calendar className="h-5 w-5 shrink-0 text-blue-500" />
            <div>
              <p className="text-sm text-blue-900">If remediation completed by <span className="font-semibold">Apr 5, 2026</span>, estimated reactivation: <span className="font-semibold">Apr 7, 2026</span></p>
              <p className="mt-0.5 text-xs text-blue-600">Review takes 24-48 hours after all remediation steps are completed.</p>
            </div>
          </div>
        </div>

        {/* Appeal + Account Impact (1/3) */}
        <div className="space-y-6">
          {/* Submit Appeal */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-900">Submit Appeal</h3>
            </div>
            <p className="mb-3 text-xs text-gray-500">If the seller believes this suspension is incorrect, they may submit an appeal with supporting documents.</p>
            <textarea placeholder="Reason for appeal (optional admin notes)..." rows={3} className="mb-3 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500" />
            <div className="mb-3 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition hover:border-brand-400">
              <Upload className="mx-auto mb-1 h-8 w-8 text-gray-300" />
              <p className="text-xs text-gray-500">Drop files here or click to upload</p>
              <p className="mt-0.5 text-[10px] text-gray-400">PDF, JPG, PNG up to 10MB each</p>
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600">
              <Send className="h-4 w-4" />Submit Appeal
            </button>
          </div>

          {/* Account Impact Warning */}
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h3 className="text-sm font-semibold text-red-800">Account Impact</h3>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-red-700">Active suspensions</span>
                <span className="font-semibold text-red-800">{mockAccountImpact.activeSuspensions} of {mockAccountImpact.maxSuspensions} max</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-red-100">
                <div className="h-full rounded-full bg-red-500" style={{ width: `${(mockAccountImpact.activeSuspensions / mockAccountImpact.maxSuspensions) * 100}%` }} />
              </div>
            </div>
            <div className="mt-3 rounded-lg border border-red-100 bg-white/60 px-3 py-2">
              <p className="text-xs font-semibold text-red-700">{mockAccountImpact.warning}</p>
              <p className="mt-0.5 text-[10px] text-red-600">Account review may result in temporary marketplace access restriction for all products.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== SUSPENSION HISTORY ===== */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-900">Suspension History for This Product</h3>
        </div>
        <div className="space-y-3">
          {mockSuspensionHistory.map((entry) => (
            <div key={entry.number} className={cn('flex items-start gap-4 rounded-lg border p-4', entry.status === 'active' ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50')}>
              <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', entry.status === 'active' ? 'bg-red-100' : 'bg-gray-200')}>
                <span className={cn('text-xs font-bold', entry.status === 'active' ? 'text-red-700' : 'text-gray-600')}>#{entry.number}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={cn('text-sm font-semibold', entry.status === 'active' ? 'text-red-800' : 'text-gray-700')}>
                    {entry.status === 'active' ? 'Current Suspension' : 'Previous Suspension'}
                  </p>
                  <span className={cn('inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold', entry.status === 'active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700')}>
                    {entry.status === 'active' ? <><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />Active</> : <><Check className="h-3 w-3" />Resolved</>}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-gray-600">Suspended {entry.date} — {entry.reason}</p>
                {entry.resolvedDate && <p className="mt-0.5 text-xs text-gray-400">Reactivated {entry.resolvedDate}. Seller corrected spec sheet at that time.</p>}
                {entry.status === 'active' && <p className="mt-0.5 text-xs text-gray-400">Duration so far: 8 days</p>}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-xs text-amber-800">This product was previously suspended for a similar issue on 15 Jan 2026 and reactivated on 22 Jan 2026. Repeated violations on the same product may result in permanent listing removal.</p>
        </div>
      </div>

      {/* ===== PRODUCT HEADER (grayed out) ===== */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 opacity-75 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="shrink-0">
            <div className="mb-3 flex h-48 w-48 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 opacity-60 grayscale">
              <ImageIcon className="h-16 w-16 text-gray-300" strokeWidth={0.5} />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />Suspended
                  </span>
                  <span className="text-xs text-gray-400">Since 25 Mar 2026</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">{p.name}</h1>
                <p className="mt-0.5 text-sm text-gray-400">{p.category}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600">SKU: {p.sku}</span>
                  <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600">HSN: {p.hsnCode || '85395000'}</span>
                  {p.avgRating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium text-gray-700">{p.avgRating}</span>
                      <span className="text-xs text-gray-400">({p.reviewCount} reviews)</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className={cn('flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white', p.seller.avatarBg || 'bg-violet-500')}>{p.seller.initials}</div>
                  <div>
                    <Link href={`/suppliers/${p.seller.id}`} className="text-sm font-medium text-brand-600 hover:underline">{p.seller.name}</Link>
                    <span className="ml-1 text-xs text-gray-400">{p.seller.tier}</span>
                  </div>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs text-gray-400 line-through">MRP {'\u20B9'}{(p.mrp / 100).toLocaleString('en-IN')}</p>
                <p className="text-2xl font-bold text-gray-500 line-through">{'\u20B9'}{(p.sellingPrice / 100).toLocaleString('en-IN')}</p>
                <p className="text-xs font-semibold text-red-500">Not available for sale</p>
                <div className="mt-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-center">
                  <p className="text-xs font-semibold text-red-600">Stock: Frozen</p>
                  <p className="text-[10px] text-red-500">Was: {p.stock} available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TABS ===== */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6">
          <div className="-mb-px flex gap-0">
            {SUSPENDED_TABS.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)} className={cn('border-b-2 px-5 py-4 text-sm font-medium transition', activeTab === i ? 'border-brand-500 font-semibold text-brand-500' : 'border-transparent text-gray-500 hover:text-gray-700')}>
                {tab}
                {tab === 'Reviews' && <span className="ml-1 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700">3 negative</span>}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          {activeTab === 0 && <SuspendedActivityLog />}
          {activeTab === 1 && <SuspendedOverview product={p} />}
          {activeTab === 2 && <SuspendedReviews />}
        </div>
      </div>
    </article>
  );
}

// ----------------------------------------------------------------
// Activity Log (Timeline)
// ----------------------------------------------------------------
function SuspendedActivityLog() {
  const events = [
    { label: 'Suspended', actor: 'By Super Admin', date: '25 Mar 2026, 2:15 PM', detail: 'Reason: Misleading wattage claim — 3 buyer complaints', detailColor: 'text-red-600', color: 'bg-orange-500' },
    { label: 'Published', actor: 'By Super Admin', date: '10 Mar 2026, 11:00 AM', detail: 'Approved and made live. Was active for 15 days before suspension.', color: 'bg-green-500' },
    { label: 'Under Review', actor: 'System', date: '10 Mar 2026, 10:00 AM', color: 'bg-amber-500' },
    { label: 'Reactivated (from 1st suspension)', actor: 'By Super Admin', date: '22 Jan 2026, 3:00 PM', detail: 'Seller corrected spec sheet. Product returned to Published state.', color: 'bg-green-500' },
    { label: 'Suspended (1st time)', actor: 'By Super Admin', date: '15 Jan 2026, 10:30 AM', detail: 'Reason: Inaccurate brightness specification reported by 1 buyer', detailColor: 'text-red-600', color: 'bg-orange-500' },
    { label: 'Published (initial)', actor: 'By Super Admin', date: '10 Jan 2026, 11:00 AM', color: 'bg-green-500' },
    { label: 'Submitted for Review', actor: 'By Patel Lighting Solutions', date: '10 Mar 2026, 9:30 AM', color: 'bg-blue-500' },
    { label: 'Draft Created', actor: 'By Patel Lighting Solutions', date: '9 Mar 2026, 4:00 PM', color: 'bg-gray-400' },
  ];
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-gray-900">State Transition History</h3>
      <div className="relative space-y-6 border-l-2 border-gray-200 pl-6">
        {events.map((e, i) => (
          <div key={i} className="relative">
            <div className={cn('absolute -left-[25px] h-4 w-4 rounded-full border-2 border-white', e.color)} />
            <p className="text-sm font-medium text-gray-900">{e.label}</p>
            <p className="text-xs text-gray-400">{e.actor} &middot; {e.date}</p>
            {e.detail && <p className={cn('mt-1 text-xs', e.detailColor ?? 'text-gray-500')}>{e.detail}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Overview
// ----------------------------------------------------------------
function SuspendedOverview({ product: p }: { product: ProductDetailData }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Vital Information</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            {[
              ['Brand', p.brand], ['Manufacturer', `${p.brand} India Ltd.`],
              ['Wattage', <span key="w">9W <span className="ml-1 text-xs text-red-500">(disputed)</span></span>], ['Pack Size', '10 bulbs'],
              ['Base Type', 'B22'], ['Color Temperature', '6500K (Cool Daylight)'],
              ['Warranty', '2 Years'], ['Country of Origin', 'India'],
            ].map(([label, val], i) => (
              <div key={i}><p className="mb-0.5 text-xs uppercase tracking-wider text-gray-400">{label as string}</p><p className="font-medium text-gray-800">{val}</p></div>
            ))}
          </div>
        </div>
        <hr className="border-gray-100" />
        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Description</h3>
          <p className="text-sm leading-relaxed text-gray-600">{p.description}</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-red-600">Suspension Impact</h4>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between"><dt className="text-red-500">Days Suspended</dt><dd className="font-semibold text-red-700">7</dd></div>
            <div className="flex justify-between"><dt className="text-red-500">Lost Revenue (est.)</dt><dd className="font-semibold text-red-700">{'\u20B9'}18,200</dd></div>
            <div className="flex justify-between"><dt className="text-red-500">Cancelled Orders</dt><dd className="font-semibold text-red-700">4</dd></div>
            <div className="flex justify-between"><dt className="text-red-500">Frozen Stock</dt><dd className="font-semibold text-red-700">156 units</dd></div>
          </dl>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Before Suspension</h4>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Views (30d)</dt><dd>892</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Orders (30d)</dt><dd>28</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Conversion</dt><dd>3.1%</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Return Rate</dt><dd className="font-semibold text-red-600">12.5%</dd></div>
          </dl>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Reviews (negative reviews that led to suspension)
// ----------------------------------------------------------------
function SuspendedReviews() {
  const reviews = [
    { stars: 1, title: 'Very dim, not 9W', author: 'Vikram K.', date: '22 Mar 2026', text: 'Bulb is very dim. Not even close to 9W. Feels like 5W max. Very disappointed.', verified: true },
    { stars: 2, title: 'False advertising', author: 'Rahul P.', date: '24 Mar 2026', text: 'False advertising. Returned the product. Will never buy from this seller again.', verified: true, returned: true },
  ];
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <h3 className="text-sm font-semibold text-gray-900">Recent Negative Reviews</h3>
        <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">These led to suspension</span>
      </div>
      <div className="space-y-2">
        {reviews.map((r, i) => (
          <div key={i} className="rounded-lg bg-red-50/30 px-4 py-4">
            <div className="mb-1 flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, j) => (
                  <Star key={j} className={cn('h-3.5 w-3.5', j < r.stars ? 'fill-amber-400 text-amber-400' : 'fill-gray-300 text-gray-300')} />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-800">{r.title}</span>
            </div>
            <p className="mb-1 text-xs text-gray-400">
              By {r.author} &middot; {r.date} &middot; Verified Purchase{r.returned ? ' · Returned' : ''}
            </p>
            <p className="text-sm text-gray-600">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
