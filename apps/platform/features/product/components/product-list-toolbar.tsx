'use client';

import { Search } from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';

import type { EnhancedProductTab } from '../types';

const TEXT = {
  searchPlaceholder: 'Search products...',
  selected: 'products selected',
  deselectAll: 'Deselect all',
  approve: 'Approve',
  suspend: 'Suspend',
  remove: 'Remove',
} as const;

interface ProductListToolbarProps {
  tabs: EnhancedProductTab[];
  activeTab: number;
  onTabChange: (index: number) => void;
  searchInput: string;
  onSearchChange: (value: string) => void;
  selectedCount: number;
  onDeselectAll: () => void;
}

export function ProductListToolbar({
  tabs, activeTab, onTabChange, searchInput, onSearchChange, selectedCount, onDeselectAll,
}: ProductListToolbarProps) {
  const isBulkMode = selectedCount > 0;

  return (
    <>
      {/* Tabs + Search */}
      <div className="flex items-center justify-between px-6 pb-0 pt-5">
        <div className="-mb-px flex items-center gap-0 border-b border-gray-200">
          {tabs.map((tab, i) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(i)}
              className={cn(
                'border-b-2 px-4 pb-3 text-sm font-medium transition',
                activeTab === i
                  ? 'border-brand-500 font-semibold text-brand-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700',
              )}
            >
              {tab.label}{' '}
              <span className={cn('ml-1 rounded-full px-1.5 py-0.5 text-[11px] font-bold', tab.badgeColor)}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={TEXT.searchPlaceholder}
            className="w-64 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {isBulkMode && (
        <div className="flex items-center justify-between border-b border-brand-200 bg-brand-50 px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-brand-700">
              {selectedCount} {TEXT.selected}
            </span>
            <button onClick={onDeselectAll} className="text-xs text-brand-500 underline hover:text-brand-700">
              {TEXT.deselectAll}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700">
              {TEXT.approve}
            </button>
            <button className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-600">
              {TEXT.suspend}
            </button>
            <button className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700">
              {TEXT.remove}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
