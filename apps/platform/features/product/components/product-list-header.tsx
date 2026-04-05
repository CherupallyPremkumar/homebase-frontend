'use client';

import { useState, useRef, useEffect } from 'react';
import { Bookmark, SlidersHorizontal, Download, ChevronDown, Plus } from 'lucide-react';
import { savedFilterPresets } from '../services/product-list-mock';

const TEXT = {
  title: 'Product Management',
  subtitle: 'Review, moderate, and manage all marketplace products',
  myFilters: 'My Filters',
  filters: 'Filters',
  export: 'Export',
  savedFilters: 'Saved Filters',
  saveCurrentFilter: 'Save Current Filter',
} as const;

interface ProductListHeaderProps {
  onToggleFilters: () => void;
  onApplyPreset: (key: string) => void;
}

export function ProductListHeader({ onToggleFilters, onApplyPreset }: ProductListHeaderProps) {
  const [showSavedFilters, setShowSavedFilters] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowSavedFilters(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{TEXT.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{TEXT.subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        {/* Saved Filters Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowSavedFilters((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <Bookmark className="h-4 w-4 text-gray-400" />
            {TEXT.myFilters}
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </button>
          {showSavedFilters && (
            <div className="absolute right-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
              <div className="border-b border-gray-100 px-3 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{TEXT.savedFilters}</p>
              </div>
              <div className="py-1">
                {savedFilterPresets.map((preset) => (
                  <button
                    key={preset.key}
                    onClick={() => { onApplyPreset(preset.key); setShowSavedFilters(false); }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-brand-50 hover:text-brand-700"
                  >
                    <span className={`h-2 w-2 rounded-full ${preset.dotColor}`} />
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-100 px-3 py-2">
                <button className="flex w-full items-center justify-center gap-1.5 py-1 text-xs font-semibold text-brand-500 transition hover:text-brand-700">
                  <Plus className="h-3.5 w-3.5" />
                  {TEXT.saveCurrentFilter}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Advanced Filters Toggle */}
        <button
          onClick={onToggleFilters}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {TEXT.filters}
        </button>

        {/* Export */}
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">
          <Download className="h-4 w-4" />
          {TEXT.export}
        </button>
      </div>
    </div>
  );
}
