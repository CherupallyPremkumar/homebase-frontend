'use client';

import { useState } from 'react';
import {
  Tag, CheckCircle, Clock, XCircle,
  Download, Plus, Eye, Search,
} from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

type BrandStatus = 'Verified' | 'Pending' | 'Rejected';

interface BrandRow {
  name: string;
  website: string;
  initial: string;
  initialBg: string;
  category: string;
  products: number;
  sellers: number;
  status: BrandStatus;
  appliedDate: string;
}

// ----------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------

const mockBrands: BrandRow[] = [
  { name: 'Bosch India', website: 'bosch-india.com', initial: 'B', initialBg: 'bg-blue-600', category: 'Power Tools', products: 234, sellers: 12, status: 'Verified', appliedDate: '14 Jan 2025' },
  { name: 'Asian Paints', website: 'asianpaints.com', initial: 'A', initialBg: 'bg-red-500', category: 'Paints & Coatings', products: 567, sellers: 45, status: 'Verified', appliedDate: '03 Dec 2024' },
  { name: 'Havells', website: 'havells.com', initial: 'H', initialBg: 'bg-brand-500', category: 'Electrical', products: 891, sellers: 67, status: 'Verified', appliedDate: '28 Nov 2024' },
  { name: 'Godrej', website: 'godrej.com', initial: 'G', initialBg: 'bg-emerald-600', category: 'Home & Living', products: 345, sellers: 23, status: 'Verified', appliedDate: '15 Oct 2024' },
  { name: 'Crompton', website: 'crompton.co.in', initial: 'C', initialBg: 'bg-sky-500', category: 'Fans & Lighting', products: 78, sellers: 5, status: 'Pending', appliedDate: '28 Mar 2026' },
  { name: 'Bajaj Electricals', website: 'bajajelectricals.com', initial: 'B', initialBg: 'bg-indigo-600', category: 'Appliances', products: 456, sellers: 34, status: 'Verified', appliedDate: '09 Sep 2024' },
  { name: 'Philips India', website: 'philips.co.in', initial: 'P', initialBg: 'bg-blue-500', category: 'Lighting', products: 123, sellers: 8, status: 'Verified', appliedDate: '21 Aug 2024' },
  { name: 'Orient Electric', website: 'orientelectric.com', initial: 'O', initialBg: 'bg-teal-500', category: 'Fans', products: 45, sellers: 3, status: 'Pending', appliedDate: '31 Mar 2026' },
  { name: 'Anchor by Panasonic', website: 'anchor-panasonic.com', initial: 'A', initialBg: 'bg-navy-700', category: 'Switches & Wiring', products: 234, sellers: 15, status: 'Verified', appliedDate: '07 Jul 2024' },
  { name: 'Syska LED', website: 'syska.co.in', initial: 'S', initialBg: 'bg-gray-400', category: 'Lighting', products: 12, sellers: 1, status: 'Rejected', appliedDate: '15 Mar 2026' },
  { name: 'Usha International', website: 'usha.com', initial: 'U', initialBg: 'bg-purple-500', category: 'Appliances', products: 67, sellers: 4, status: 'Pending', appliedDate: '01 Apr 2026' },
  { name: 'V-Guard', website: 'vguard.in', initial: 'V', initialBg: 'bg-rose-500', category: 'Stabilizers', products: 89, sellers: 6, status: 'Verified', appliedDate: '12 May 2024' },
];

const TABS = [
  { key: 'all', label: 'All', count: '847', badgeColor: 'bg-gray-100 text-gray-600' },
  { key: 'verified', label: 'Verified', count: '612', badgeColor: 'bg-green-100 text-green-700' },
  { key: 'pending', label: 'Pending', count: '89', badgeColor: 'bg-yellow-100 text-yellow-700' },
  { key: 'rejected', label: 'Rejected', count: '146', badgeColor: 'bg-red-100 text-red-700' },
];

const STATS = [
  { label: 'Total Brands', value: '847', subtitle: 'Registered on the platform', iconBg: 'bg-gray-50', iconColor: 'text-gray-500', icon: Tag },
  { label: 'Verified', value: '612', subtitle: '72.3% approval rate', iconBg: 'bg-green-50', iconColor: 'text-green-600', valueColor: 'text-green-600', subtitleColor: 'text-green-600', icon: CheckCircle },
  { label: 'Pending Approval', value: '89', subtitle: 'Awaiting review', iconBg: 'bg-yellow-50', iconColor: 'text-yellow-600', valueColor: 'text-yellow-600', subtitleColor: 'text-yellow-600', icon: Clock },
  { label: 'Rejected', value: '146', subtitle: 'Failed verification', iconBg: 'bg-red-50', iconColor: 'text-red-600', valueColor: 'text-red-600', subtitleColor: 'text-red-600', icon: XCircle },
];

const STATUS_BADGE: Record<BrandStatus, string> = {
  Verified: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Rejected: 'bg-red-100 text-red-700',
};

const TEXT = {
  title: 'Brand Management',
  subtitle: 'Manage and verify brand registrations across the platform',
  export: 'Export',
  addBrand: 'Add Brand',
  approve: 'Approve',
  reject: 'Reject',
  reReview: 'Re-review',
} as const;

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export function BrandManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');

  const tabKey = TABS[activeTab]?.key ?? 'all';
  const filtered = mockBrands.filter((b) => {
    if (tabKey !== 'all' && b.status.toLowerCase() !== tabKey) return false;
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{TEXT.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{TEXT.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">
            <Download className="h-4 w-4" />{TEXT.export}
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-600">
            <Plus className="h-4 w-4" />{TEXT.addBrand}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="stat-card rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{s.label}</p>
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', s.iconBg)}>
                <s.icon className={cn('h-5 w-5', s.iconColor)} />
              </div>
            </div>
            <p className={cn('text-2xl font-bold', s.valueColor ?? 'text-gray-900')}>{s.value}</p>
            <p className={cn('mt-1 text-xs', s.subtitleColor ?? 'text-gray-400')}>{s.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Tabs + Search */}
        <div className="flex items-center justify-between px-6 pb-0 pt-5">
          <nav className="-mb-px flex items-center gap-0 border-b border-gray-200">
            {TABS.map((tab, i) => (
              <button key={tab.key} onClick={() => setActiveTab(i)} className={cn('border-b-2 px-4 pb-3 text-sm font-medium transition', activeTab === i ? 'border-brand-500 font-semibold text-brand-500' : 'border-transparent text-gray-500 hover:text-gray-700')}>
                {tab.label} <span className={cn('ml-1 rounded-full px-1.5 py-0.5 text-[11px] font-bold', tab.badgeColor)}>{tab.count}</span>
              </button>
            ))}
          </nav>
          <div className="mb-3 flex items-center gap-3">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 outline-none focus:border-brand-400">
              <option value="all">All Categories</option>
              {['Power Tools', 'Paints & Coatings', 'Electrical', 'Home & Living', 'Fans & Lighting', 'Appliances', 'Lighting', 'Switches & Wiring', 'Stabilizers'].map((c) => <option key={c}>{c}</option>)}
            </select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} type="search" placeholder="Search brand name..." className="w-56 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                {['Brand', 'Category', 'Products', 'Sellers', 'Status', 'Applied Date', 'Actions'].map((h) => (
                  <th key={h} className={cn('px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500', ['Products', 'Sellers'].includes(h) ? 'text-right' : '')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((b) => (
                <tr key={b.name} className="transition-colors hover:bg-brand-50/40">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white', b.initialBg)}>{b.initial}</div>
                      <div>
                        <p className="font-medium text-gray-900 transition hover:text-brand-500">{b.name}</p>
                        <p className="text-xs text-gray-400">{b.website}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{b.category}</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">{b.products.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">{b.sellers}</td>
                  <td className="px-6 py-4">
                    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', STATUS_BADGE[b.status])}>{b.status}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{b.appliedDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="rounded p-1 text-gray-400 transition hover:text-brand-500" title="View details"><Eye className="h-4 w-4" /></button>
                      {b.status === 'Pending' && (
                        <>
                          <button className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-600">{TEXT.approve}</button>
                          <button className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50">{TEXT.reject}</button>
                        </>
                      )}
                      {b.status === 'Rejected' && (
                        <button className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50">{TEXT.reReview}</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          <p className="text-xs text-gray-400">Showing 1-{filtered.length} of {TABS[activeTab]?.count ?? filtered.length} brands</p>
          <div className="flex items-center gap-1">
            <button className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-400">Previous</button>
            <button className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white">1</button>
            <button className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100">2</button>
            <span className="px-2 text-gray-400">...</span>
            <button className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100">85</button>
            <button className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
