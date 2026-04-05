'use client';

import Link from 'next/link';
import {
  ChevronRight, FileText, Mail, Trash2, ImageIcon, Star,
  Check, X, Info, Clock, Calendar, FilePlus,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';

import type { ProductDetailData } from '../types';
import { mockComplianceChecklist, mockListingFields, mockCategoryRequirements } from '../services/product-detail-state-mock';

interface ProductDetailDraftProps {
  product: ProductDetailData;
}

export function ProductDetailDraft({ product: p }: ProductDetailDraftProps) {
  return (
    <article className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/products" className="text-gray-400 hover:text-brand-500">Products</Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
        <span className="font-medium text-gray-700">{p.name}</span>
      </nav>

      {/* ===== DRAFT BANNER ===== */}
      <div className="flex items-start gap-3 rounded-xl border border-gray-300 bg-gray-100 p-4">
        <FileText className="mt-0.5 h-6 w-6 shrink-0 text-gray-500" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-700">This product is still in draft</p>
          <p className="mt-0.5 text-xs text-gray-500">The seller has not submitted this for review yet. Created 2 days ago by {p.seller.name}. Not visible to customers.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            <Mail className="h-4 w-4" />Remind Seller
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50">
            <Trash2 className="h-4 w-4" />Delete Draft
          </button>
        </div>
      </div>

      {/* ===== PRODUCT HEADER (dashed border, greyed out) ===== */}
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="shrink-0">
            <div className="mb-3 flex h-48 w-48 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
              <ImageIcon className="h-12 w-12 text-gray-300" strokeWidth={0.5} />
              <p className="mt-2 text-xs text-gray-400">No images uploaded</p>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />Draft
                  </span>
                  <span className="text-xs text-gray-400">Created {p.listedDate}</span>
                </div>
                <h1 className="text-xl font-bold text-gray-500">{p.name}</h1>
                <p className="mt-0.5 text-sm text-gray-400">{p.category}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-500">SKU: {p.sku}</span>
                  <span className="text-xs text-gray-400">No HSN code yet</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className={cn('flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white', p.seller.avatarBg || 'bg-brand-500')}>{p.seller.initials}</div>
                  <div>
                    <Link href={`/suppliers/${p.seller.id}`} className="text-sm font-medium text-brand-600 hover:underline">{p.seller.name}</Link>
                    <span className="ml-1 text-xs text-gray-400">{p.seller.tier}</span>
                  </div>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-2xl font-bold text-gray-400">{'\u20B9'}{(p.sellingPrice / 100).toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-400">MRP not set</p>
                <p className="text-xs text-gray-400">GST not configured</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== PRE-FLIGHT COMPLIANCE CHECKLIST ===== */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <Check className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Pre-flight Compliance Checklist</h3>
              <p className="text-xs text-gray-500">All items must be green before this listing can be submitted for review</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {[{ color: 'bg-green-500', label: '3 Ready' }, { color: 'bg-amber-500', label: '1 Partial' }, { color: 'bg-red-500', label: '2 Missing' }].map((s) => (
              <div key={s.label} className="flex items-center gap-1.5 text-xs">
                <span className={cn('h-2 w-2 rounded-full', s.color)} />
                <span className="text-gray-500">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {mockComplianceChecklist.map((item) => {
            const colors = item.status === 'ready'
              ? { bg: 'bg-green-50/60', border: 'border-green-100', dot: 'bg-green-500', detailColor: 'text-gray-500', valueColor: 'text-green-700', barBg: 'bg-green-100', barFill: 'bg-green-500' }
              : item.status === 'partial'
              ? { bg: 'bg-amber-50/60', border: 'border-amber-200', dot: 'bg-amber-500', detailColor: 'text-amber-700', valueColor: 'text-amber-700', barBg: 'bg-amber-100', barFill: 'bg-amber-500' }
              : { bg: 'bg-red-50/60', border: 'border-red-200', dot: 'bg-red-500', detailColor: 'text-red-600', valueColor: 'text-red-600', barBg: 'bg-red-100', barFill: 'bg-red-500' };

            return (
              <div key={item.label} className={cn('flex items-center gap-3 rounded-lg border p-3', colors.bg, colors.border)}>
                <span className={cn('h-3 w-3 shrink-0 rounded-full', colors.dot)} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800">{item.label}</p>
                  <p className={cn('text-xs', colors.detailColor)}>
                    {item.label === 'Title' ? '"Havells Reo 5L Water Heater"' :
                     item.label === 'Description' ? 'Not provided — minimum 100 characters required' :
                     item.label === 'Images' ? '2 uploaded — minimum 3 required for this category' :
                     item.label === 'HSN Code' ? '85161000 — Electric water heaters' :
                     item.label === 'Brand Authorization' ? 'Havells requires authorized dealer certificate — not uploaded' :
                     '18% GST — Correctly mapped to Water Heaters'}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  {item.progress ? (
                    <>
                      <p className={cn('text-xs font-semibold', colors.valueColor)}>{item.detail}</p>
                      <div className={cn('mt-1 h-1.5 w-24 overflow-hidden rounded-full', colors.barBg)}>
                        <div className={cn('h-full rounded-full', colors.barFill)} style={{ width: item.label === 'Title' ? '21%' : item.label === 'Images' ? '66%' : '0%' }} />
                      </div>
                    </>
                  ) : (
                    <span className={cn('inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold', item.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                      {item.status === 'ready' ? <><Check className="h-3 w-3" />{item.detail}</> : <><X className="h-3 w-3" />{item.detail}</>}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== CATEGORY REQUIREMENTS + PUBLISH OPTIONS (2-col) ===== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Category Requirements */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            <h3 className="text-sm font-semibold text-gray-900">Category Requirements</h3>
          </div>
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-800">Bathroom &gt; Water Heaters &gt; Instant</p>
            <ul className="space-y-1.5">
              {mockCategoryRequirements.map((req, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-blue-900">
                  <ChevronRight className="h-4 w-4 shrink-0 text-blue-400" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-3 flex items-center gap-2 px-1">
            <Clock className="h-4 w-4 text-gray-400" />
            <p className="text-xs text-gray-500">Avg. approval time for this category: <span className="font-semibold text-gray-700">24 hours</span></p>
          </div>
        </div>

        {/* Publish Options */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Publish Options</h3>
          <div className="mb-5">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">Schedule Publish For</label>
            <div className="flex items-center gap-3">
              <input type="datetime-local" defaultValue="2026-04-05T09:00" className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500" />
              <button className="flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600">
                <Calendar className="h-4 w-4" />Schedule
              </button>
            </div>
            <p className="mt-1.5 text-xs text-gray-400">Product will be auto-submitted for review and published upon approval on the scheduled date.</p>
          </div>
          <hr className="mb-5 border-gray-100" />
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">Listing Template</label>
            <p className="mb-3 text-xs text-gray-500">Save this listing as a template for faster creation of similar products in this category.</p>
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
              <FilePlus className="h-4 w-4" />Save as Template
            </button>
          </div>
        </div>
      </div>

      {/* ===== LISTING COMPLETION ===== */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Listing Completion</h3>
          <span className="text-sm font-bold text-amber-600">4 of 8 required fields</span>
        </div>
        <div className="mb-5 h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-amber-500" style={{ width: '50%' }} />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {mockListingFields.map((field) => (
            <div key={field.label} className={cn('flex items-center gap-3 rounded-lg border p-3', field.completed ? 'border-green-100 bg-green-50/50' : 'border-red-100 bg-red-50/50')}>
              {field.completed ? <Check className="h-5 w-5 shrink-0 text-green-500" /> : <X className="h-5 w-5 shrink-0 text-red-400" />}
              <div>
                <p className="text-sm text-gray-700">{field.label}</p>
                <p className={cn('text-xs', field.completed ? 'text-gray-400' : 'text-red-500')}>
                  {field.completed
                    ? field.label === 'Product Title' ? 'Havells Reo 5L Water Heater'
                    : field.label === 'Category' ? 'Bathroom > Water Heaters > Instant'
                    : field.label === 'SKU' ? 'HAV-REO-5L'
                    : '\u20B93,500'
                    : field.label === 'Description' ? 'Not provided — minimum 100 characters'
                    : field.label === 'Images (min 3)' ? 'No images uploaded — minimum 3 required'
                    : field.label === 'Brand Authorization' ? 'Required for branded products'
                    : field.label === 'Shipping Weight' ? 'Required for delivery estimation'
                    : 'Required for GST compliance'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== ACTIVITY LOG ===== */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Activity Log</h3>
        <div className="relative space-y-6 border-l-2 border-gray-200 pl-6">
          <div className="relative">
            <div className="absolute -left-[25px] h-4 w-4 rounded-full border-2 border-white bg-gray-400" />
            <p className="text-sm font-medium text-gray-900">Draft Created</p>
            <p className="text-xs text-gray-400">By {p.seller.name} &middot; {p.listedDate}, 5:20 PM</p>
            <p className="mt-1 text-xs text-gray-500">Seller started listing. 4 of 8 fields completed.</p>
          </div>
        </div>
      </div>
    </article>
  );
}
