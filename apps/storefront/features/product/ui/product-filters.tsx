'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Star, X } from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';

// ---------------------------------------------------------------------------
// Filter option types
// ---------------------------------------------------------------------------

interface CheckboxOption {
  label: string;
  value: string;
  count?: number;
}

// ---------------------------------------------------------------------------
// Static filter data (mock)
// ---------------------------------------------------------------------------

const CATEGORIES: CheckboxOption[] = [
  { label: 'Laptops', value: 'laptops', count: 74 },
  { label: 'Smartphones', value: 'smartphones', count: 156 },
  { label: 'Headphones', value: 'headphones', count: 42 },
  { label: 'Cameras', value: 'cameras', count: 28 },
  { label: 'Gaming', value: 'gaming', count: 52 },
];

const BRANDS: CheckboxOption[] = [
  { label: 'Apple', value: 'apple', count: 38 },
  { label: 'Samsung', value: 'samsung', count: 45 },
  { label: 'Sony', value: 'sony', count: 29 },
  { label: 'Nike', value: 'nike', count: 18 },
  { label: 'boAt', value: 'boat', count: 33 },
  { label: 'OnePlus', value: 'oneplus', count: 21 },
];

const RATINGS = [5, 4, 3, 2] as const;

const AVAILABILITY: CheckboxOption[] = [
  { label: 'In Stock', value: 'in_stock', count: 142 },
  { label: 'Out of Stock', value: 'out_of_stock', count: 14 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseList(val: string | null): string[] {
  if (!val) return [];
  return val.split(',').filter(Boolean);
}

function toggleInList(list: string[], item: string): string[] {
  return list.includes(item)
    ? list.filter((v) => v !== item)
    : [...list, item];
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function FilterSection({
  title,
  children,
  first = false,
}: {
  title: string;
  children: React.ReactNode;
  first?: boolean;
}) {
  return (
    <div className={cn('pb-4', !first && 'border-t border-gray-100 pt-4')}>
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-navy-900">
        {title}
      </h4>
      {children}
    </div>
  );
}

function CheckboxFilter({
  options,
  selected,
  onChange,
}: {
  options: CheckboxOption[];
  selected: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          className="group flex cursor-pointer items-center gap-2"
        >
          <input
            type="checkbox"
            checked={selected.includes(opt.value)}
            onChange={() => onChange(opt.value)}
            className="h-3.5 w-3.5 rounded border-gray-300 text-brand-500 focus:ring-brand-400"
          />
          <span className="text-sm text-gray-700 group-hover:text-brand-600">
            {opt.label}
          </span>
          {opt.count != null && (
            <span className="ml-auto text-xs text-gray-400">({opt.count})</span>
          )}
        </label>
      ))}
    </div>
  );
}

function RatingFilter({
  selected,
  onChange,
}: {
  selected: number | null;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      {RATINGS.map((rating) => (
        <label key={rating} className="group flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            name="rating"
            checked={selected === rating}
            onChange={() => onChange(rating)}
            className="h-3.5 w-3.5 border-gray-300 text-brand-500 focus:ring-brand-400"
          />
          <span className="flex items-center gap-0.5 text-sm">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-3.5 w-3.5',
                  i < rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-none text-gray-300',
                )}
              />
            ))}
          </span>
          <span className="text-xs text-gray-500">& up</span>
        </label>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main filter sidebar component
// ---------------------------------------------------------------------------

export interface ProductFiltersProps {
  className?: string;
}

export function ProductFilters({ className }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Derived state from URL search params
  const selectedCategories = parseList(searchParams.get('category'));
  const selectedBrands = parseList(searchParams.get('brand'));
  const selectedAvailability = parseList(searchParams.get('availability'));
  const minPrice = searchParams.get('minPrice') ?? '';
  const maxPrice = searchParams.get('maxPrice') ?? '';
  const selectedRating = searchParams.get('rating')
    ? Number(searchParams.get('rating'))
    : null;

  // Build active filter tags for display
  const activeTags: { label: string; param: string; value: string }[] = [];
  selectedCategories.forEach((v) => {
    const opt = CATEGORIES.find((c) => c.value === v);
    if (opt) activeTags.push({ label: opt.label, param: 'category', value: v });
  });
  selectedBrands.forEach((v) => {
    const opt = BRANDS.find((b) => b.value === v);
    if (opt) activeTags.push({ label: opt.label, param: 'brand', value: v });
  });
  if (selectedRating) {
    activeTags.push({
      label: `${selectedRating} Stars & up`,
      param: 'rating',
      value: String(selectedRating),
    });
  }

  // ---- URL update helper ----
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === '') {
          params.delete(key);
        } else {
          params.set(key, val);
        }
      });
      // Reset to page 1 when filters change
      params.delete('page');
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const toggleFilter = useCallback(
    (param: string, currentList: string[], value: string) => {
      const next = toggleInList(currentList, value);
      updateParams({ [param]: next.length > 0 ? next.join(',') : null });
    },
    [updateParams],
  );

  const clearAll = useCallback(() => {
    router.push('?', { scroll: false });
  }, [router]);

  const removeTag = useCallback(
    (param: string, value: string) => {
      if (param === 'rating') {
        updateParams({ rating: null });
        return;
      }
      const current = parseList(searchParams.get(param));
      const next = current.filter((v) => v !== value);
      updateParams({ [param]: next.length > 0 ? next.join(',') : null });
    },
    [searchParams, updateParams],
  );

  const hasAnyFilter =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedAvailability.length > 0 ||
    selectedRating !== null ||
    minPrice !== '' ||
    maxPrice !== '';

  return (
    <div className={className}>
      <div className="sticky top-36 rounded-xl border border-gray-100 bg-white p-5">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-navy-900">Filters</h3>
          {hasAnyFilter && (
            <button
              onClick={clearAll}
              className="text-xs font-medium text-brand-500 hover:underline"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Active filter tags (shown inside sidebar) */}
        {activeTags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {activeTags.map((tag) => (
              <span
                key={`${tag.param}-${tag.value}`}
                className="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-0.5 text-[11px] font-medium text-brand-700"
              >
                {tag.label}
                <button
                  onClick={() => removeTag(tag.param, tag.value)}
                  className="hover:text-brand-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Category */}
        <FilterSection title="Category" first>
          <CheckboxFilter
            options={CATEGORIES}
            selected={selectedCategories}
            onChange={(val) => toggleFilter('category', selectedCategories, val)}
          />
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Min"
              defaultValue={minPrice}
              onBlur={(e) => updateParams({ minPrice: e.target.value || null })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateParams({ minPrice: (e.target as HTMLInputElement).value || null });
                }
              }}
              className="w-full rounded-md border border-gray-200 px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:border-brand-400"
            />
            <span className="text-xs text-gray-400">-</span>
            <input
              type="text"
              placeholder="Max"
              defaultValue={maxPrice}
              onBlur={(e) => updateParams({ maxPrice: e.target.value || null })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateParams({ maxPrice: (e.target as HTMLInputElement).value || null });
                }
              }}
              className="w-full rounded-md border border-gray-200 px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:border-brand-400"
            />
          </div>
          <button
            onClick={() => {
              /* price inputs update on blur; this is a visual affordance */
            }}
            className="mt-2.5 w-full rounded-md bg-navy-900 py-1.5 text-xs font-medium text-white transition hover:bg-navy-800"
          >
            Apply
          </button>
        </FilterSection>

        {/* Brand */}
        <FilterSection title="Brand">
          <CheckboxFilter
            options={BRANDS}
            selected={selectedBrands}
            onChange={(val) => toggleFilter('brand', selectedBrands, val)}
          />
        </FilterSection>

        {/* Rating */}
        <FilterSection title="Customer Rating">
          <RatingFilter
            selected={selectedRating}
            onChange={(val) =>
              updateParams({
                rating: selectedRating === val ? null : String(val),
              })
            }
          />
        </FilterSection>

        {/* Availability */}
        <FilterSection title="Availability">
          <CheckboxFilter
            options={AVAILABILITY}
            selected={selectedAvailability}
            onChange={(val) =>
              toggleFilter('availability', selectedAvailability, val)
            }
          />
        </FilterSection>
      </div>
    </div>
  );
}
