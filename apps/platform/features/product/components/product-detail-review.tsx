'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight, Clock, Check, X, AlertTriangle, Star,
  ImageIcon, Eye, Upload, Pencil, UserCircle, RefreshCw,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';

import type { ProductDetailData } from '../types';
import {
  mockSlaInfo, mockReviewerInfo, mockSubmissionInfo, mockComplianceIssues,
} from '../services/product-detail-state-mock';

const REVIEW_TABS = ['Compliance', 'Overview', 'Variants & Inventory', 'Images', 'Activity Log'] as const;

interface ProductDetailReviewProps {
  product: ProductDetailData;
}

export function ProductDetailReview({ product: p }: ProductDetailReviewProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <article className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/products" className="text-gray-400 hover:text-brand-500">Products</Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
        <span className="font-medium text-gray-700">{p.name}</span>
      </nav>

      {/* ===== REVIEW BANNER ===== */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <Clock className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-800">This product is awaiting your review</p>
          <p className="mt-0.5 text-xs text-amber-700">Submitted by {p.seller.name} on {p.listedDate}. Compliance check found 2 issues that need your attention.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
            <Check className="h-4 w-4" />Approve
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50">
            <X className="h-4 w-4" />Reject
          </button>
        </div>
      </div>

      {/* ===== SLA + REVIEWER + SUBMISSION (3-col) ===== */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* SLA Countdown */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <h3 className="text-sm font-semibold text-gray-900">SLA Countdown</h3>
          </div>
          <p className="mb-1 text-2xl font-bold text-amber-600">{mockSlaInfo.remainingHours}h remaining</p>
          <p className="mb-3 text-xs text-gray-500">SLA: 48 hours from submission</p>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-gradient-to-r from-green-500 via-amber-500 to-amber-500" style={{ width: '62.5%' }} />
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <p className="text-[10px] text-gray-400">Submitted 28 Mar, 3:45 PM</p>
            <p className="text-[10px] text-gray-400">Due 30 Mar, 3:45 PM</p>
          </div>
          <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2">
            <p className="text-xs text-amber-700"><span className="font-semibold">Warning:</span> Approaching SLA deadline. Products not reviewed within 48 hours are auto-escalated to senior admin.</p>
          </div>
        </div>

        {/* Reviewer Assignment */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-blue-500" />
            <h3 className="text-sm font-semibold text-gray-900">Reviewer Assignment</h3>
          </div>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-bold text-white">SK</div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Sneha K</p>
              <p className="text-xs text-gray-500">Category Specialist — Paints &amp; Finishes</p>
            </div>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-gray-400">Assigned</span><span className="text-gray-700">28 Mar, 4:00 PM</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Reviews today</span><span className="text-gray-700">7 of 15 queue</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Avg. review time</span><span className="text-gray-700">{mockReviewerInfo.avgReviewTime}</span></div>
          </div>
          <button className="mt-3 w-full rounded-lg bg-blue-50 px-3 py-2 text-center text-xs font-medium text-blue-600 transition hover:bg-blue-100">Reassign Reviewer</button>
        </div>

        {/* Submission History */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-900">Submission History</h3>
          </div>
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-lg font-bold text-amber-700">#2</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">Submission #2</p>
              <p className="text-xs text-gray-500">Current submission under review</p>
            </div>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="mb-1.5 text-xs font-semibold text-gray-600">Previous Rejection</p>
            <div className="flex items-start gap-2">
              <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <div>
                <p className="text-xs text-gray-700">Rejected on <span className="font-semibold">28 Feb 2026</span></p>
                <p className="mt-0.5 text-xs text-gray-500">Reason: Missing brand authorization and incomplete product specifications</p>
              </div>
            </div>
          </div>
          <p className="mt-2 text-[10px] text-gray-400">Sellers with 3+ rejections on same product are flagged for quality review</p>
        </div>
      </div>

      {/* ===== PRODUCT HEADER CARD ===== */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="shrink-0">
            <div className="mb-3 flex h-48 w-48 items-center justify-center rounded-xl border border-gray-200 bg-gray-100">
              <ImageIcon className="h-16 w-16 text-gray-300" strokeWidth={0.5} />
            </div>
            <div className="flex gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-brand-500 bg-gray-100"><ImageIcon className="h-5 w-5 text-gray-300" strokeWidth={1} /></div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-gray-100"><ImageIcon className="h-5 w-5 text-gray-300" strokeWidth={1} /></div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-xs text-gray-400">+1</div>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />Under Review
                  </span>
                  <span className="text-xs text-gray-400">Submitted {p.listedDate}</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">{p.name}</h1>
                <p className="mt-0.5 text-sm text-gray-400">{p.category}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600">SKU: {p.sku}</span>
                  <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600">HSN: {p.hsnCode || '32091010'}</span>
                  <span className="text-xs text-gray-400">No reviews yet</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className={cn('flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white', p.seller.avatarBg || 'bg-emerald-500')}>{p.seller.initials}</div>
                  <div>
                    <Link href={`/suppliers/${p.seller.id}`} className="text-sm font-medium text-brand-600 hover:underline">{p.seller.name}</Link>
                    <span className="ml-1 text-xs text-gray-400">{p.seller.tier}</span>
                  </div>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs text-gray-400 line-through">MRP {'\u20B9'}{(p.mrp / 100).toLocaleString('en-IN')}</p>
                <p className="text-2xl font-bold text-gray-900">{'\u20B9'}{(p.sellingPrice / 100).toLocaleString('en-IN')}</p>
                <p className="text-xs font-semibold text-green-600">{p.discountPercent}% off &middot; GST {p.gstPercent}%</p>
                <button className="ml-auto mt-3 flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200">
                  <Eye className="h-3.5 w-3.5" />Preview on Storefront
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TABS ===== */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6">
          <div className="-mb-px flex gap-0">
            {REVIEW_TABS.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)} className={cn('border-b-2 px-5 py-4 text-sm font-medium transition', activeTab === i ? 'border-brand-500 font-semibold text-brand-500' : 'border-transparent text-gray-500 hover:text-gray-700')}>
                {tab}
                {tab === 'Compliance' && <span className="ml-1 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700">2 Issues</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 0 && <CompliancePanel />}
          {activeTab === 1 && <OverviewPanel product={p} />}
          {activeTab === 2 && <VariantsPanel />}
          {activeTab === 3 && <ImagesPanel />}
          {activeTab === 4 && <ActivityLogPanel />}
        </div>
      </div>
    </article>
  );
}

// ----------------------------------------------------------------
// Compliance Panel
// ----------------------------------------------------------------
function CompliancePanel() {
  const failed = mockComplianceIssues.filter((i) => i.status === 'fail');
  const passed = mockComplianceIssues.filter((i) => i.status === 'pass');

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100"><AlertTriangle className="h-5 w-5 text-amber-600" /></div>
        <div>
          <p className="text-sm font-semibold text-amber-800">2 issues found — review required</p>
          <p className="text-xs text-gray-500">5 checks passed, 2 failed. Admin must decide whether to approve with warnings or reject.</p>
        </div>
      </div>
      <div className="space-y-3">
        {failed.map((issue) => (
          <div key={issue.label} className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <X className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{issue.label}</p>
              <p className="mt-0.5 text-xs text-red-600">{issue.description}</p>
            </div>
            {issue.action && (
              <button className="flex shrink-0 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50">
                {issue.action === 'Request Upload' ? <Upload className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
                {issue.action}
              </button>
            )}
          </div>
        ))}
        {passed.map((issue) => (
          <div key={issue.label} className="flex items-center gap-3 rounded-lg border border-green-100 bg-green-50/50 p-3">
            <Check className="h-5 w-5 shrink-0 text-green-500" />
            <div className="flex-1"><p className="text-sm text-gray-700">{issue.label}</p><p className="text-xs text-gray-400">{issue.description}</p></div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
        <p className="text-xs text-gray-400">Approving with issues will send a warning to the seller to fix within 7 days.</p>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50">
            <X className="h-4 w-4" />Reject &amp; Return to Seller
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600">
            <AlertTriangle className="h-4 w-4" />Approve with Warnings
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
            <Check className="h-4 w-4" />Approve &amp; Publish
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Overview Panel
// ----------------------------------------------------------------
function OverviewPanel({ product: p }: { product: ProductDetailData }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Vital Information</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            {[['Brand', p.brand], ['Manufacturer', `${p.brand} Ltd.`], ['Volume', '10 Litres'], ['Finish', 'Matt'], ['Weight', p.weight], ['Coverage', '120-140 sq.ft/litre (2 coats)'], ['Warranty', 'N/A (consumable)'], ['Country of Origin', 'India']].map(([label, val]) => (
              <div key={label}><p className="mb-0.5 text-xs uppercase tracking-wider text-gray-400">{label}</p><p className="font-medium text-gray-800">{val}</p></div>
            ))}
          </div>
        </div>
        <hr className="border-gray-100" />
        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Description <span className="ml-1 text-xs text-red-500">(below minimum length)</span></h3>
          <p className="rounded-lg border border-red-200 bg-red-50/30 p-3 text-sm leading-relaxed text-gray-600">{p.description}</p>
          <p className="mt-1 text-xs text-red-500">45 characters — minimum 100 required for Paints category</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Listing Info</h4>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Status</dt><dd className="font-semibold text-amber-600">Under Review</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Submitted</dt><dd>{p.listedDate}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Variants</dt><dd>6</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Stock</dt><dd>{p.stock} units</dd></div>
          </dl>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Variants Panel
// ----------------------------------------------------------------
function VariantsPanel() {
  const shades = [
    { name: 'White Lily N101', sku: 'AP-ROY-10L-N101', price: '\u20B93,850', stock: 2 },
    { name: 'Ivory Dream L109', sku: 'AP-ROY-10L-L109', price: '\u20B93,850', stock: 1 },
    { name: 'Beige Harmony N204', sku: 'AP-ROY-10L-N204', price: '\u20B93,950', stock: 1 },
    { name: 'Peach Blush L311', sku: 'AP-ROY-10L-L311', price: '\u20B93,950', stock: 0 },
    { name: 'Sky Blue L501', sku: 'AP-ROY-10L-L501', price: '\u20B94,050', stock: 1 },
    { name: 'Sage Green L602', sku: 'AP-ROY-10L-L602', price: '\u20B94,050', stock: 0 },
  ];
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-gray-900">6 Variants <span className="text-xs font-normal text-gray-400">— Variation: Color Shade</span></h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-200">
            {['Shade', 'SKU', 'Price', 'Stock'].map((h) => (
              <th key={h} className={cn('py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400', h === 'Price' ? 'text-right' : h === 'Stock' ? 'text-center' : 'text-left')}>{h}</th>
            ))}
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {shades.map((s) => (
              <tr key={s.sku}><td className="px-4 py-3 font-medium">{s.name}</td><td className="px-4 py-3 font-mono text-xs text-gray-500">{s.sku}</td><td className="px-4 py-3 text-right">{s.price}</td><td className="px-4 py-3 text-center">{s.stock}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Images Panel
// ----------------------------------------------------------------
function ImagesPanel() {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-gray-900">3 Images uploaded</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {[true, false, false].map((isMain, i) => (
          <div key={i} className="relative flex aspect-square items-center justify-center rounded-xl border border-gray-200 bg-gray-100">
            <ImageIcon className="h-12 w-12 text-gray-300" strokeWidth={0.5} />
            {isMain && <span className="absolute left-2 top-2 rounded bg-brand-500 px-1.5 py-0.5 text-[9px] font-bold text-white">MAIN</span>}
            <span className="absolute bottom-2 right-2 rounded bg-green-100 px-1.5 py-0.5 text-[9px] font-bold text-green-700">OK</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Activity Log Panel (Timeline)
// ----------------------------------------------------------------
function ActivityLogPanel() {
  const events = [
    { label: 'Under Review', actor: 'System', date: '28 Mar 2026, 4:00 PM', detail: 'Auto-compliance check: 2 issues found. Awaiting admin review.', color: 'bg-amber-500', pulse: true },
    { label: 'Submitted for Review', actor: 'By Krishna Home Decor', date: '28 Mar 2026, 3:45 PM', color: 'bg-blue-500' },
    { label: 'Rejected', actor: 'By Sneha K', date: '28 Feb 2026, 11:30 AM', detail: 'Reason: Missing brand authorization and incomplete product specifications', detailColor: 'text-red-600', color: 'bg-red-400' },
    { label: 'Submitted for Review (1st attempt)', actor: 'By Krishna Home Decor', date: '27 Feb 2026, 2:00 PM', color: 'bg-blue-500' },
    { label: 'Draft Created', actor: 'By Krishna Home Decor', date: '27 Feb 2026, 11:00 AM', color: 'bg-gray-400' },
  ];
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-gray-900">State Transition History</h3>
      <div className="relative space-y-6 border-l-2 border-gray-200 pl-6">
        {events.map((e, i) => (
          <div key={i} className="relative">
            <div className={cn('absolute -left-[25px] h-4 w-4 rounded-full border-2 border-white', e.color, e.pulse && 'animate-pulse')} />
            <p className="text-sm font-medium text-gray-900">{e.label}</p>
            <p className="text-xs text-gray-400">{e.actor} &middot; {e.date}</p>
            {e.detail && <p className={cn('mt-1 text-xs', e.detailColor ?? 'text-gray-500')}>{e.detail}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
