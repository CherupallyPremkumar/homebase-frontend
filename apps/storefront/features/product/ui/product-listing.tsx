'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  X,
} from 'lucide-react';
import { ProductCard } from '@homebase/ui';
import type { ProductCardProps } from '@homebase/ui';
import { cn } from '@homebase/ui/src/lib/utils';
import { ProductFilters } from './product-filters';

// ---------------------------------------------------------------------------
// Mock product data (8 products matching the HTML prototype)
// ---------------------------------------------------------------------------

const MOCK_PRODUCTS: ProductCardProps[] = [
  {
    id: 'macbook-air-m3',
    name: 'MacBook Air M3 15" 256GB Space Gray Laptop',
    image: '/images/products/laptop-1.webp',
    price: '\u20B91,12,490',
    originalPrice: '\u20B91,49,900',
    rating: 5,
    reviewCount: 312,
    discount: 25,
    badges: [{ label: 'Free Shipping' }],
    seller: 'Rajesh Store',
  },
  {
    id: 'iphone-16-pro-max',
    name: 'iPhone 16 Pro Max 256GB Natural Titanium',
    image: '/images/products/phone-1.webp',
    price: '\u20B91,44,900',
    rating: 4,
    reviewCount: 89,
    isNew: true,
    badges: [{ label: 'Free Shipping' }, { label: 'Free Gift' }],
    seller: 'Priya Electronics',
  },
  {
    id: 'sony-wh1000xm5',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling',
    image: '/images/products/headphones-1.webp',
    price: '\u20B922,490',
    originalPrice: '\u20B934,990',
    rating: 5,
    reviewCount: 456,
    discount: 35,
    badges: [{ label: 'In Stock' }],
    seller: 'Kumar Fashions',
  },
  {
    id: 'canon-eos-r50',
    name: 'Canon EOS R50 Mirrorless Camera with 18-45mm',
    image: '/images/products/camera-1.webp',
    price: '\u20B962,990',
    rating: 4,
    reviewCount: 178,
    badges: [{ label: 'Free Shipping' }],
    seller: 'Anita Home Decor',
  },
  {
    id: 'ps5-slim-digital',
    name: 'PlayStation 5 Slim Digital Edition Console',
    image: '/images/products/gaming-1.webp',
    price: '\u20B929,990',
    originalPrice: '\u20B949,990',
    rating: 5,
    reviewCount: 534,
    discount: 40,
    badges: [
      { label: 'Free Shipping' },
      { label: 'Only 3 left', color: 'text-red-600', bgColor: 'bg-red-50' },
    ],
    seller: 'Vikram Sports',
  },
  {
    id: 'galaxy-watch-6',
    name: 'Samsung Galaxy Watch 6 Classic 47mm Silver',
    image: '/images/products/watch-1.webp',
    price: '\u20B927,999',
    originalPrice: '\u20B934,999',
    rating: 4,
    reviewCount: 203,
    discount: 20,
    badges: [{ label: 'In Stock' }],
    seller: 'Rajesh Store',
  },
  {
    id: 'dell-xps-15',
    name: 'Dell XPS 15 Intel Core i7 16GB RAM 512GB SSD',
    image: '/images/products/laptop-2.webp',
    price: '\u20B91,27,490',
    originalPrice: '\u20B91,49,990',
    rating: 4,
    reviewCount: 94,
    discount: 15,
    badges: [{ label: 'Free Shipping' }],
    seller: 'Priya Electronics',
  },
  {
    id: 'oneplus-12-5g',
    name: 'OnePlus 12 5G 256GB Flowy Emerald 12GB RAM',
    image: '/images/products/phone-2.webp',
    price: '\u20B952,999',
    originalPrice: '\u20B974,999',
    rating: 5,
    reviewCount: 267,
    discount: 30,
    badges: [
      { label: 'Free Shipping' },
      { label: 'Best Seller', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    ],
    seller: 'Kumar Fashions',
  },
];

// ---------------------------------------------------------------------------
// Sort options
// ---------------------------------------------------------------------------

const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Avg. Rating', value: 'rating_desc' },
] as const;

// ---------------------------------------------------------------------------
// Pagination helper
// ---------------------------------------------------------------------------

function buildPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = [];
  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }
  pages.push(1);
  if (current > 3) pages.push('ellipsis');
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push('ellipsis');
  pages.push(total);
  return pages;
}

// ---------------------------------------------------------------------------
// Active filter tag type
// ---------------------------------------------------------------------------

interface ActiveTag {
  label: string;
  param: string;
  value: string;
}

function getActiveTags(searchParams: URLSearchParams): ActiveTag[] {
  const tags: ActiveTag[] = [];
  const categories = (searchParams.get('category') ?? '').split(',').filter(Boolean);
  const brands = (searchParams.get('brand') ?? '').split(',').filter(Boolean);
  const rating = searchParams.get('rating');

  categories.forEach((v) => tags.push({ label: v.charAt(0).toUpperCase() + v.slice(1), param: 'category', value: v }));
  brands.forEach((v) => tags.push({ label: v.charAt(0).toUpperCase() + v.slice(1), param: 'brand', value: v }));
  if (rating) tags.push({ label: `${rating} Stars & up`, param: 'rating', value: rating });

  return tags;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductListing() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Pagination from search params
  const currentPage = Number(searchParams.get('page') ?? '1');
  const totalResults = 156;
  const perPage = 24;
  const totalPages = Math.ceil(totalResults / perPage);

  // Sort
  const currentSort = searchParams.get('sort') ?? 'relevance';

  // Active tags for the bar above the grid
  const activeTags = getActiveTags(searchParams);

  // URL helpers
  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const removeTag = useCallback(
    (param: string, value: string) => {
      if (param === 'rating') {
        updateParam('rating', null);
        return;
      }
      const current = (searchParams.get(param) ?? '').split(',').filter(Boolean);
      const next = current.filter((v) => v !== value);
      updateParam(param, next.length > 0 ? next.join(',') : null);
    },
    [searchParams, updateParam],
  );

  const goToPage = useCallback(
    (page: number) => {
      updateParam('page', page > 1 ? String(page) : null);
    },
    [updateParam],
  );

  const handleAddToCart = useCallback((id: string) => {
    // In a real app this would dispatch to cart store
    console.log('Add to cart:', id);
  }, []);

  const handleWishlist = useCallback((id: string) => {
    console.log('Toggle wishlist:', id);
  }, []);

  // Range for "Showing X-Y of Z"
  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalResults);

  return (
    <div className="flex gap-6">
      {/* ---- Left sidebar filters (hidden on small screens) ---- */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <ProductFilters />
      </aside>

      {/* ---- Main content area ---- */}
      <main className="min-w-0 flex-1">
        {/* Top results bar */}
        <div className="mb-5 flex flex-col items-start justify-between gap-3 rounded-xl border border-gray-100 bg-white px-5 py-3.5 sm:flex-row sm:items-center">
          <p className="text-sm text-gray-600">
            Showing{' '}
            <strong className="text-navy-900">
              {startItem}-{endItem}
            </strong>{' '}
            of <strong className="text-navy-900">{totalResults}</strong> results
            for{' '}
            <strong className="text-navy-900">&ldquo;Electronics&rdquo;</strong>
          </p>

          <div className="flex items-center gap-3">
            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Sort by:</span>
              <select
                value={currentSort}
                onChange={(e) => updateParam('sort', e.target.value === 'relevance' ? null : e.target.value)}
                className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-brand-400"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Grid / List toggle */}
            <div className="flex overflow-hidden rounded-lg border border-gray-200">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'px-2.5 py-1.5 transition',
                  viewMode === 'grid'
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-50 text-gray-500',
                )}
                title="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'px-2.5 py-1.5 transition',
                  viewMode === 'list'
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-50 text-gray-500',
                )}
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active filter tags */}
        {activeTags.length > 0 && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs text-gray-500">Active Filters:</span>
            {activeTags.map((tag) => (
              <span
                key={`${tag.param}-${tag.value}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
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

        {/* Product grid / list */}
        <div
          className={cn(
            viewMode === 'grid'
              ? 'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'
              : 'flex flex-col gap-4',
          )}
        >
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onAddToCart={handleAddToCart}
              onWishlist={handleWishlist}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-1.5">
          {/* Previous */}
          <button
            disabled={currentPage <= 1}
            onClick={() => goToPage(currentPage - 1)}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white transition',
              currentPage <= 1
                ? 'cursor-not-allowed text-gray-300'
                : 'text-gray-400 hover:border-brand-400 hover:text-brand-500',
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page numbers */}
          {buildPageNumbers(currentPage, totalPages).map((page, idx) =>
            page === 'ellipsis' ? (
              <span
                key={`ellipsis-${idx}`}
                className="flex h-9 w-9 items-center justify-center text-sm text-gray-400"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition',
                  page === currentPage
                    ? 'bg-brand-500 font-semibold text-white'
                    : 'border border-gray-200 bg-white text-gray-700 hover:border-brand-400 hover:text-brand-500',
                )}
              >
                {page}
              </button>
            ),
          )}

          {/* Next */}
          <button
            disabled={currentPage >= totalPages}
            onClick={() => goToPage(currentPage + 1)}
            className={cn(
              'flex h-9 w-auto items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium transition',
              currentPage >= totalPages
                ? 'cursor-not-allowed text-gray-300'
                : 'text-gray-700 hover:border-brand-400 hover:text-brand-500',
            )}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Results per page info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Showing {startItem}-{endItem} of {totalResults} products &bull; Page{' '}
            {currentPage} of {totalPages}
          </p>
        </div>
      </main>
    </div>
  );
}
