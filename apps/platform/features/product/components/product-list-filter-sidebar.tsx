'use client';

import { Filter, Star } from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';

import type { AdvancedFilters, FilterOptions } from '../types';

const TEXT = {
  title: 'Advanced Filters',
  resetAll: 'Reset All',
  priceRange: 'Price Range',
  minRating: 'Minimum Rating',
  category: 'Category',
  allCategories: 'All Categories',
  seller: 'Seller',
  allSellers: 'All Sellers',
  stockStatus: 'Stock Status',
  hasReviews: 'Has Reviews',
  dateListed: 'Date Listed',
  from: 'From',
  to: 'To',
  applyFilters: 'Apply Filters',
} as const;

const STOCK_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'in_stock', label: 'In Stock (>20)' },
  { value: 'low_stock', label: 'Low Stock (<20)' },
  { value: 'critical', label: 'Critical (<5)' },
  { value: 'out_of_stock', label: 'Out of Stock' },
];

const REVIEW_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

interface ProductListFilterSidebarProps {
  isOpen: boolean;
  filters: AdvancedFilters;
  options: FilterOptions;
  onUpdate: (partial: Partial<AdvancedFilters>) => void;
  onApply: () => void;
  onReset: () => void;
}

export function ProductListFilterSidebar({
  isOpen, filters, options, onUpdate, onApply, onReset,
}: ProductListFilterSidebarProps) {
  return (
    <div
      className={cn(
        'shrink-0 overflow-hidden transition-all duration-300',
        isOpen ? 'w-[280px] opacity-100' : 'w-0 opacity-0 pointer-events-none',
      )}
    >
      <div className="w-[280px] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3.5">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-700">{TEXT.title}</span>
          </div>
          <button onClick={onReset} className="text-[10px] font-semibold uppercase tracking-wide text-brand-500 hover:text-brand-700">
            {TEXT.resetAll}
          </button>
        </div>

        <div className="max-h-[calc(100vh-320px)] space-y-5 overflow-y-auto p-4">
          {/* Price Range */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.priceRange}</label>
            <div className="mb-2 flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">{'\u20B9'}</span>
                <input type="number" value={filters.priceMin} min={0} onChange={(e) => onUpdate({ priceMin: +e.target.value })} className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-6 pr-2 text-xs text-gray-700 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-100" />
              </div>
              <span className="text-xs text-gray-400">to</span>
              <div className="relative flex-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">{'\u20B9'}</span>
                <input type="number" value={filters.priceMax} min={0} onChange={(e) => onUpdate({ priceMax: +e.target.value })} className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-6 pr-2 text-xs text-gray-700 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-100" />
              </div>
            </div>
            <input type="range" min={0} max={50000} step={500} value={filters.priceMax} onChange={(e) => onUpdate({ priceMax: +e.target.value })} className="w-full accent-brand-500" />
          </div>

          {/* Rating */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.minRating}</label>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  onClick={() => onUpdate({ minRating: r })}
                  className={cn(
                    'flex items-center gap-0.5 rounded px-1.5 py-0.5 transition hover:bg-amber-50',
                    filters.minRating === r && 'bg-amber-50 ring-1 ring-amber-300',
                  )}
                >
                  {r === 0 ? (
                    <span className="text-[10px] font-medium text-gray-400">Any</span>
                  ) : (
                    <>
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-[10px] text-gray-500">{r}+</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.category}</label>
            <select value={filters.category} onChange={(e) => onUpdate({ category: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-100">
              <option value="">{TEXT.allCategories}</option>
              {options.categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          {/* Seller */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.seller}</label>
            <select value={filters.seller} onChange={(e) => onUpdate({ seller: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-100">
              <option value="">{TEXT.allSellers}</option>
              {options.sellers.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {/* Stock Status */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.stockStatus}</label>
            <div className="space-y-1.5">
              {STOCK_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex cursor-pointer items-center gap-2 group">
                  <input type="radio" name="stockStatus" value={opt.value} checked={filters.stockStatus === opt.value} onChange={(e) => onUpdate({ stockStatus: e.target.value })} className="accent-brand-500" />
                  <span className="text-xs text-gray-600 group-hover:text-gray-900">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Has Reviews */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.hasReviews}</label>
            <div className="flex items-center gap-2">
              {REVIEW_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex cursor-pointer items-center gap-2 group">
                  <input type="radio" name="hasReviews" value={opt.value} checked={filters.hasReviews === opt.value} onChange={(e) => onUpdate({ hasReviews: e.target.value })} className="accent-brand-500" />
                  <span className="text-xs text-gray-600 group-hover:text-gray-900">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Listed */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">{TEXT.dateListed}</label>
            <div className="space-y-2">
              <div>
                <label className="mb-0.5 block text-[10px] text-gray-400">{TEXT.from}</label>
                <input type="date" value={filters.dateFrom} onChange={(e) => onUpdate({ dateFrom: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-700 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-100" />
              </div>
              <div>
                <label className="mb-0.5 block text-[10px] text-gray-400">{TEXT.to}</label>
                <input type="date" value={filters.dateTo} onChange={(e) => onUpdate({ dateTo: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-700 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-100" />
              </div>
            </div>
          </div>

          {/* Apply */}
          <button onClick={onApply} className="w-full rounded-lg bg-brand-500 py-2.5 text-xs font-semibold text-white transition hover:bg-brand-600">
            {TEXT.applyFilters}
          </button>
        </div>
      </div>
    </div>
  );
}
