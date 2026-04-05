'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight, Star, ImageIcon, Pause, Ban,
  Check, TrendingUp, MessageSquare, BarChart3,
  Send, AlertTriangle, Info, Phone, Clock, Truck,
  Package,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { SectionSkeleton, ErrorSection } from '@homebase/shared';

import { useProductAdminDetail, useProductMutation } from '../hooks/use-product';
import type { ProductDetailData, ProductDetailState } from '../types';
import { ProductDetailDraft } from './product-detail-draft';
import { ProductDetailReview } from './product-detail-review';
import { ProductDetailSuspended } from './product-detail-suspended';

function resolveDetailState(status: string): ProductDetailState {
  const n = status.toLowerCase().replace(/_/g, ' ');
  if (n.includes('draft') || n.includes('created')) return 'Draft';
  if (n.includes('review') || n.includes('pending')) return 'Under Review';
  if (n.includes('suspend') || n.includes('flagged') || n.includes('disabled')) return 'Suspended';
  return 'Published';
}

// ----------------------------------------------------------------
// Published Detail — pixel-perfect match to prototype
// ----------------------------------------------------------------

const TABS = ['Overview', 'Variants & Inventory', 'Images', 'Compliance', 'Reviews', 'Activity Log'] as const;

const COMPLIANCE_BADGE = <span className="ml-1 rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">Passed</span>;
const REVIEWS_BADGE = (count: number) => <span className="ml-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-600">{count}</span>;

function PublishedDetail({ product: p, onAction, isPending }: { product: ProductDetailData; onAction: (e: string) => void; isPending: boolean }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <article className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/products" className="text-gray-400 hover:text-brand-500">Products</Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
        <span className="font-medium text-gray-700">{p.name}</span>
      </nav>

      {/* ===== PRODUCT HEADER CARD ===== */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Image Gallery */}
          <div className="shrink-0">
            <div className="mb-3 flex h-48 w-48 items-center justify-center rounded-xl border border-gray-200 bg-gray-100">
              <ImageIcon className="h-16 w-16 text-gray-300" strokeWidth={0.5} />
            </div>
            <div className="flex gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-brand-500 bg-gray-100"><ImageIcon className="h-5 w-5 text-gray-300" strokeWidth={1} /></div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-gray-100"><ImageIcon className="h-5 w-5 text-gray-300" strokeWidth={1} /></div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-gray-100"><ImageIcon className="h-5 w-5 text-gray-300" strokeWidth={1} /></div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-xs text-gray-400">+2</div>
            </div>
          </div>

          {/* Product Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />Published
                  </span>
                  <span className="text-xs text-gray-400">Listed {p.listedDate}</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">{p.name}</h1>
                <p className="mt-0.5 text-sm text-gray-400">{p.category}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600">SKU: {p.sku}</span>
                  <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600">HSN: {p.hsnCode}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-gray-700">{p.avgRating}</span>
                    <span className="text-xs text-gray-400">({p.reviewCount} reviews)</span>
                  </div>
                </div>
                {/* Seller */}
                <div className="mt-3 flex items-center gap-2">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white ${p.seller.avatarBg || 'bg-blue-500'}`}>
                    {p.seller.initials}
                  </div>
                  <div>
                    <Link href={`/suppliers/${p.seller.id}`} className="text-sm font-medium text-brand-600 hover:underline">{p.seller.name}</Link>
                    <span className="ml-1 text-xs text-gray-400">{p.seller.tier}</span>
                  </div>
                </div>
              </div>

              {/* Price + Actions */}
              <div className="shrink-0 text-right">
                <div className="mb-3">
                  <p className="text-xs text-gray-400 line-through">MRP {'\u20B9'}{(p.mrp / 100).toLocaleString('en-IN')}</p>
                  <p className="text-2xl font-bold text-gray-900">{'\u20B9'}{(p.sellingPrice / 100).toLocaleString('en-IN')}</p>
                  <p className="text-xs font-semibold text-green-600">{p.discountPercent}% off &middot; GST {p.gstPercent}%</p>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => { if (confirm('Suspend this product?')) onAction('suspend'); }} disabled={isPending} className="flex items-center gap-1.5 rounded-lg border border-orange-200 px-3 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-50 disabled:opacity-50">
                    <Pause className="h-4 w-4" />Suspend
                  </button>
                  <button onClick={() => { if (confirm('Disable this product?')) onAction('disable'); }} disabled={isPending} className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50">
                    <Ban className="h-4 w-4" />Disable
                  </button>
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
            {TABS.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)} className={cn('border-b-2 px-5 py-4 text-sm font-medium transition', activeTab === i ? 'border-brand-500 font-semibold text-brand-500' : 'border-transparent text-gray-500 hover:text-gray-700')}>
                {tab}
                {tab === 'Compliance' && COMPLIANCE_BADGE}
                {tab === 'Reviews' && REVIEWS_BADGE(p.reviewCount)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 0 && <OverviewTab product={p} />}
          {activeTab === 1 && <VariantsTab />}
          {activeTab === 2 && <p className="py-8 text-center text-sm text-gray-400">Image gallery coming soon</p>}
          {activeTab === 3 && <ComplianceTab />}
          {activeTab === 4 && <ReviewsTab product={p} />}
          {activeTab === 5 && <ActivityTab product={p} />}
        </div>
      </div>

      {/* ===== BELOW TABS: Performance + Sentiment (2-col) ===== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PerformanceHealthCard />
        <ReviewSentimentCard />
      </div>

      {/* ===== Restock Forecast + Supplier Contact (2-col) ===== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RestockForecastCard product={p} />
        <SupplierContactCard product={p} />
      </div>

      {/* ===== Competitor Pricing ===== */}
      <CompetitorPricingCard />
    </article>
  );
}

// ----------------------------------------------------------------
// Tab: Overview
// ----------------------------------------------------------------
function OverviewTab({ product: p }: { product: ProductDetailData }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Vital Information</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            {[['Brand', p.brand], ['Manufacturer', p.brand], ['Model Number', p.sku], ['EAN / Barcode', '8901234567890'], ['Weight', p.weight], ['Dimensions', p.dimensions], ['Warranty', '1 Year Manufacturer'], ['Country of Origin', 'India']].map(([label, val]) => (
              <div key={label}><p className="mb-0.5 text-xs uppercase tracking-wider text-gray-400">{label}</p><p className="font-medium text-gray-800">{val}</p></div>
            ))}
          </div>
        </div>
        <hr className="border-gray-100" />
        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Description</h3>
          <p className="text-sm leading-relaxed text-gray-600">{p.description}</p>
        </div>
        <hr className="border-gray-100" />
        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Key Features</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {p.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />{f}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Performance</h4>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Views (30d)</dt><dd className="font-semibold">{p.views.toLocaleString('en-IN')}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Orders (30d)</dt><dd className="font-semibold">{p.orders}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Conversion</dt><dd className="font-semibold text-green-600">{p.returnRate}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Returns</dt><dd className="font-semibold">{p.returns} ({p.returnRate})</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Revenue (30d)</dt><dd className="font-semibold">{'\u20B9'}1,67,952</dd></div>
          </dl>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Shipping</h4>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Shipping Weight</dt><dd>{p.shippingWeight}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Free Shipping</dt><dd className={p.freeShipping ? 'font-medium text-green-600' : ''}>{p.freeShipping ? 'Yes' : 'No'}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Est. Delivery</dt><dd>{p.estDelivery}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Returnable</dt><dd>Yes ({p.returnable})</dd></div>
          </dl>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Tab: Variants & Inventory
// ----------------------------------------------------------------
function VariantsTab() {
  const variants = [
    { name: 'Standard Kit (10pc)', sku: 'BOS-GSB-500W-10', mrp: '\u20B93,499', price: '\u20B92,999', avail: 52, reserved: 8, inbound: 0, status: 'Active' },
    { name: 'Professional Kit (50pc)', sku: 'BOS-GSB-500W-50', mrp: '\u20B94,299', price: '\u20B93,499', avail: 60, reserved: 4, inbound: 100, status: 'Active' },
    { name: 'Complete Kit (100pc)', sku: 'BOS-GSB-500W-100', mrp: '\u20B95,499', price: '\u20B94,499', avail: 30, reserved: 0, inbound: 0, status: 'Active' },
  ];
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">3 Variants</h3>
        <p className="text-xs text-gray-400">Variation theme: <span className="font-medium text-gray-600">Kit Size</span></p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {['Variant', 'SKU', 'MRP', 'Selling Price', 'Available', 'Reserved', 'Inbound', 'Status'].map((h) => (
                <th key={h} className={cn('py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400', h === 'MRP' || h === 'Selling Price' ? 'text-right' : h === 'Available' || h === 'Reserved' || h === 'Inbound' || h === 'Status' ? 'text-center' : 'text-left')}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {variants.map((v) => (
              <tr key={v.sku} className="transition-colors hover:bg-brand-50/40">
                <td className="px-4 py-3 font-medium text-gray-800">{v.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{v.sku}</td>
                <td className="px-4 py-3 text-right text-gray-400 line-through">{v.mrp}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">{v.price}</td>
                <td className="px-4 py-3 text-center font-medium text-green-700">{v.avail}</td>
                <td className="px-4 py-3 text-center text-gray-500">{v.reserved}</td>
                <td className="px-4 py-3 text-center">{v.inbound > 0 ? <span className="font-medium text-blue-600">{v.inbound}</span> : <span className="text-gray-300">-</span>}</td>
                <td className="px-4 py-3 text-center"><span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">{v.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Tab: Compliance
// ----------------------------------------------------------------
function ComplianceTab() {
  const checks = [
    { label: 'Product Title', status: 'pass', detail: 'Meets guidelines (42/200 chars)' },
    { label: 'Description', status: 'pass', detail: '156 chars, minimum 100 required' },
    { label: 'Images', status: 'pass', detail: '5 images uploaded, minimum 3' },
    { label: 'HSN Code', status: 'pass', detail: 'HSN 84672100 valid' },
    { label: 'Brand Authorization', status: 'pass', detail: 'Document verified' },
    { label: 'Pricing', status: 'pass', detail: 'Within category range' },
    { label: 'GST Category', status: 'pass', detail: '18% GST configured' },
  ];
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-green-700">All compliance checks passed</p>
      {checks.map((c) => (
        <div key={c.label} className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-800">{c.label}</span>
          <span className="ml-auto text-xs text-gray-400">{c.detail}</span>
        </div>
      ))}
    </div>
  );
}

// ----------------------------------------------------------------
// Tab: Reviews
// ----------------------------------------------------------------
function ReviewsTab({ product: p }: { product: ProductDetailData }) {
  if (p.reviewCount === 0) return <p className="py-8 text-center text-sm text-gray-400">No reviews yet</p>;
  return (
    <div className="flex items-start gap-8">
      <div className="text-center">
        <p className="text-5xl font-bold text-gray-900">{p.avgRating}</p>
        <div className="mt-1 flex justify-center gap-0.5">{Array.from({ length: 5 }, (_, i) => <Star key={i} className={cn('h-4 w-4', i < Math.floor(p.avgRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200')} />)}</div>
        <p className="mt-1 text-xs text-gray-400">{p.reviewCount} reviews</p>
      </div>
      <div className="flex-1 space-y-1.5">
        {p.ratingBreakdown.map((r) => (
          <div key={r.stars} className="flex items-center gap-2">
            <span className="w-8 text-xs text-gray-500">{r.stars} <Star className="inline h-3 w-3 fill-current text-amber-400" /></span>
            <div className="h-2 flex-1 rounded-full bg-gray-100"><div className="h-2 rounded-full bg-amber-400" style={{ width: `${r.percent}%` }} /></div>
            <span className="w-10 text-right text-xs text-gray-400">{r.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Tab: Activity Log
// ----------------------------------------------------------------
function ActivityTab({ product: p }: { product: ProductDetailData }) {
  return (
    <div className="space-y-3">
      {p.moderationHistory.map((e, i) => (
        <div key={i} className="flex gap-3">
          <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${e.color}`} />
          <div><p className="text-sm text-gray-900">{e.event}</p><p className="text-xs text-gray-400">By {e.actor} &middot; {e.date}</p></div>
        </div>
      ))}
    </div>
  );
}

// ----------------------------------------------------------------
// Performance Health Score Card
// ----------------------------------------------------------------
function PerformanceHealthCard() {
  const metrics = [
    { label: 'Conversion Rate', value: '3.1%', avg: 'vs 2.4% avg', pct: 78 },
    { label: 'Return Rate', value: '2.8%', avg: 'vs 4.1% avg', pct: 28 },
    { label: 'Avg Review Rating', value: '4.6', avg: 'vs 4.2 avg', pct: 92 },
    { label: 'Views / Day', value: '142', avg: 'vs 89 avg', pct: 80 },
  ];
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50"><TrendingUp className="h-4 w-4 text-green-600" /></div>
        <div><h3 className="text-sm font-semibold text-gray-900">Performance Health Score</h3><p className="text-xs text-gray-400">How this product ranks vs category averages</p></div>
        <span className="ml-auto rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">92/100</span>
      </div>
      <div className="space-y-4">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-600">{m.label}</p>
              <div className="mt-1 flex items-center gap-3"><div className="h-2 max-w-[180px] flex-1 rounded-full bg-gray-100"><div className="h-2 rounded-full bg-green-500" style={{ width: `${m.pct}%` }} /></div></div>
            </div>
            <div className="ml-4 shrink-0 text-right"><span className="text-sm font-bold text-green-600">{m.value}</span><span className="ml-1 text-xs text-gray-400">{m.avg}</span></div>
            <Check className="ml-2 h-4 w-4 shrink-0 text-green-500" />
          </div>
        ))}
      </div>
      <div className="mt-4 border-t border-gray-100 pt-4"><p className="text-xs text-gray-400">All metrics beat category averages. This is a <span className="font-semibold text-green-600">top-performing</span> listing in Power Tools.</p></div>
    </div>
  );
}

// ----------------------------------------------------------------
// Review Sentiment Analysis Card
// ----------------------------------------------------------------
function ReviewSentimentCard() {
  const sentiments = [{ label: 'Positive', pct: 89, color: 'green' }, { label: 'Neutral', pct: 7, color: 'gray' }, { label: 'Negative', pct: 4, color: 'red' }];
  const snippets = [
    { type: 'positive', text: '"Powerful motor, drilled through concrete effortlessly. Best value in this range."', author: 'Amit S.' },
    { type: 'neutral', text: '"Does the job but nothing extraordinary. Carry case is decent."', author: 'Sanjay M.' },
    { type: 'negative', text: '"Accessory bits broke on first use. Drill itself is fine but kit quality is poor."', author: 'Priya R.' },
  ];
  const snippetStyles = { positive: { bg: 'bg-green-50/60', border: 'border-green-100', dot: 'bg-green-100', icon: 'text-green-600' }, neutral: { bg: 'bg-gray-50', border: 'border-gray-100', dot: 'bg-gray-200', icon: 'text-gray-500' }, negative: { bg: 'bg-red-50/60', border: 'border-red-100', dot: 'bg-red-100', icon: 'text-red-500' } };
  const colorMap: Record<string, { label: string; bar: string }> = { green: { label: 'text-green-700', bar: 'bg-green-500' }, gray: { label: 'text-gray-500', bar: 'bg-gray-400' }, red: { label: 'text-red-600', bar: 'bg-red-500' } };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50"><MessageSquare className="h-4 w-4 text-violet-600" /></div>
        <div><h3 className="text-sm font-semibold text-gray-900">Review Sentiment Analysis</h3><p className="text-xs text-gray-400">Based on 128 reviews, AI-analyzed</p></div>
      </div>
      <div className="mb-5 space-y-3">
        {sentiments.map((s) => { const c = colorMap[s.color]; return (
          <div key={s.label}><div className="mb-1 flex items-center justify-between"><span className={cn('text-sm font-medium', c.label)}>{s.label}</span><span className={cn('text-sm font-bold', c.label)}>{s.pct}%</span></div><div className="h-2.5 w-full rounded-full bg-gray-100"><div className={cn('h-2.5 rounded-full', c.bar)} style={{ width: `${s.pct}%` }} /></div></div>
        ); })}
      </div>
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Recent Snippets</h4>
      <div className="space-y-2.5">
        {snippets.map((s, i) => { const st = snippetStyles[s.type as keyof typeof snippetStyles]; return (
          <div key={i} className={cn('flex items-start gap-2 rounded-lg border p-2.5', st.bg, st.border)}>
            <span className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full', st.dot)}>
              {s.type === 'positive' ? <Check className={cn('h-3 w-3', st.icon)} /> : s.type === 'negative' ? <span className={cn('text-xs font-bold', st.icon)}>✕</span> : <span className={cn('text-xs', st.icon)}>—</span>}
            </span>
            <p className="text-xs leading-relaxed text-gray-600">{s.text} <span className="text-gray-400">— {s.author}</span></p>
          </div>
        ); })}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Restock Forecast Card
// ----------------------------------------------------------------
function RestockForecastCard({ product: p }: { product: ProductDetailData }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50"><Package className="h-4 w-4 text-amber-600" /></div>
        <div><h3 className="text-sm font-semibold text-gray-900">Restock Forecast</h3><p className="text-xs text-gray-400">Based on 30-day sales velocity</p></div>
      </div>
      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100"><AlertTriangle className="h-5 w-5 text-amber-600" /></div>
          <div><p className="text-sm font-semibold text-amber-800">Stock running low</p><p className="mt-0.5 text-xs text-amber-700">At current velocity (<span className="font-semibold">12 units/day</span>), stock runs out in <span className="font-bold">8 days</span>.</p></div>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-3 gap-3">
        {[{ val: p.stock, label: 'Available' }, { val: '12', label: 'Units/Day' }, { val: '8', label: 'Days Left', color: 'text-amber-600' }].map((s) => (
          <div key={s.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-center">
            <p className={cn('text-lg font-bold text-gray-900', s.color)}>{s.val}</p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
        <div className="flex items-start gap-2"><Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" /><p className="text-xs text-blue-800">Recommended reorder: <span className="font-bold">200 units</span> by <span className="font-bold">Apr 10, 2026</span> to maintain 14-day buffer stock.</p></div>
      </div>
      <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600">
        <Send className="h-4 w-4" />Send Reorder Request
      </button>
    </div>
  );
}

// ----------------------------------------------------------------
// Supplier Contact Card
// ----------------------------------------------------------------
function SupplierContactCard({ product: p }: { product: ProductDetailData }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50"><BarChart3 className="h-4 w-4 text-blue-600" /></div>
        <div><h3 className="text-sm font-semibold text-gray-900">Supplier Contact</h3><p className="text-xs text-gray-400">Primary supplier for this product</p></div>
      </div>
      <div className="mb-5 flex items-center gap-4 border-b border-gray-100 pb-5">
        <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white', p.seller.avatarBg || 'bg-emerald-500')}>{p.seller.initials}</div>
        <div><p className="text-base font-semibold text-gray-900">{p.seller.name}</p><p className="mt-0.5 text-xs text-gray-400">Verified Supplier &middot; Since {p.seller.since}</p>
          <div className="mt-1 flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /><span className="text-xs font-medium text-gray-600">{p.seller.rating} supplier rating</span></div>
        </div>
      </div>
      <div className="mb-5 space-y-3">
        {[{ icon: Phone, label: 'Contact Number', value: '+91 98765 43210' }, { icon: Clock, label: 'Avg Lead Time', value: '5 days' }, { icon: Truck, label: 'Last Restock', value: '22 Mar 2026 (11 days ago)' }].map((c) => (
          <div key={c.label} className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50"><c.icon className="h-4 w-4 text-gray-500" /></div>
            <div><p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{c.label}</p><p className="text-sm font-medium text-gray-800">{c.value}</p></div>
          </div>
        ))}
      </div>
      <button className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600">
        <MessageSquare className="h-4 w-4" />Message Supplier
      </button>
    </div>
  );
}

// ----------------------------------------------------------------
// Competitor Pricing Card
// ----------------------------------------------------------------
function CompetitorPricingCard() {
  const competitors = [
    { name: 'Bosch GSB 500W Drill (10pc Kit)', sku: 'BOS-GSB-500-10PC', seller: 'Kumar Hardware', sellerInitials: 'KH', sellerGradient: 'from-green-400 to-green-600', price: '\u20B93,299', rating: 4.3, diff: '-\u20B9200', diffType: 'cheaper' },
    { name: 'Stanley SDH600 Impact Drill Kit', sku: 'STN-SDH-600', seller: 'Patel Tools', sellerInitials: 'PT', sellerGradient: 'from-yellow-400 to-yellow-600', price: '\u20B93,599', rating: 4.1, diff: '+\u20B9100', diffType: 'more' },
    { name: 'Black+Decker KR504RE Drill Kit', sku: 'BD-KR504-RE', seller: 'Anand Tools', sellerInitials: 'AT', sellerGradient: 'from-orange-400 to-orange-600', price: '\u20B93,199', rating: 3.9, diff: '-\u20B9300', diffType: 'cheaper' },
  ];
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50"><BarChart3 className="h-4 w-4 text-rose-600" /></div>
          <div><h3 className="text-sm font-semibold text-gray-900">Competitor Pricing</h3><p className="text-xs text-gray-400">Similar products on platform — cannibalization detection</p></div>
        </div>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">3 Similar Listings</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-200">
            {['Product Name', 'Seller', 'Price', 'Rating', 'Price Diff'].map((h) => (
              <th key={h} className={cn('py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400', h === 'Price' ? 'text-right' : h === 'Rating' || h === 'Price Diff' ? 'text-center' : 'text-left')}>{h}</th>
            ))}
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {competitors.map((c) => (
              <tr key={c.sku} className="transition-colors hover:bg-brand-50/40">
                <td className="px-4 py-3"><p className="font-medium text-gray-800">{c.name}</p><p className="mt-0.5 text-xs text-gray-400">SKU: {c.sku}</p></td>
                <td className="px-4 py-3"><div className="flex items-center gap-2"><div className={cn('flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br text-[9px] font-bold text-white', c.sellerGradient)}>{c.sellerInitials}</div><span className="text-gray-700">{c.seller}</span></div></td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">{c.price}</td>
                <td className="px-4 py-3 text-center"><div className="flex items-center justify-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /><span className="text-gray-700">{c.rating}</span></div></td>
                <td className="px-4 py-3 text-center"><span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', c.diffType === 'cheaper' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600')}>{c.diff}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
        <p className="text-xs text-gray-400">This product is priced <span className="font-semibold text-gray-600">mid-range</span> among similar listings. 1 competitor is cheaper with lower rating.</p>
        <button className="text-xs font-semibold text-brand-500 transition hover:text-brand-600">View Full Market Analysis →</button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// ORCHESTRATOR
// ----------------------------------------------------------------
interface ProductDetailProps { id: string; }

export function ProductDetail({ id }: ProductDetailProps) {
  const { data: product, isLoading, error, refetch } = useProductAdminDetail(id);
  const mutation = useProductMutation();

  if (isLoading) return <div className="space-y-6"><SectionSkeleton rows={2} /><SectionSkeleton rows={6} /></div>;
  if (error) return <ErrorSection error={error} onRetry={() => refetch()} />;
  if (!product) return <div className="flex flex-col items-center justify-center py-20 text-center"><Package className="h-12 w-12 text-gray-300" /><p className="mt-4 text-lg font-semibold text-gray-600">Product not found</p><Link href="/products" className="mt-4 text-sm font-medium text-orange-600 hover:text-orange-700">Back to Products</Link></div>;

  const state = resolveDetailState(product.status);
  const handleAction = (eventId: string) => mutation.mutate({ id, eventId });

  switch (state) {
    case 'Draft': return <ProductDetailDraft product={product} />;
    case 'Under Review': return <ProductDetailReview product={product} />;
    case 'Suspended': return <ProductDetailSuspended product={product} />;
    default: return <PublishedDetail product={product} onAction={handleAction} isPending={mutation.isPending} />;
  }
}
