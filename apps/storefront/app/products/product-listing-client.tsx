'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@homebase/api-client';
import type { SearchRequest } from '@homebase/types';
import { useSearchQuery, useDebounce, SectionSkeleton, ErrorSection, EmptyState, CACHE_TIMES } from '@homebase/shared';
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@homebase/ui';
import { SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '@/components/product-card';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Top Rated' },
  { value: 'newest', label: 'Newest First' },
];

export function ProductListingClient() {
  const { searchRequest, page, setPage, size, sort, setSort, q, setQ } = useSearchQuery({ size: 20 });
  const [searchInput, setSearchInput] = useState(q || '');
  const debouncedSearch = useDebounce(searchInput, 300);

  const request: SearchRequest = {
    ...searchRequest,
    q: debouncedSearch || undefined,
    sort: sort || undefined,
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['products', 'list', request],
    queryFn: () => catalogApi.search(request),
    ...CACHE_TIMES.productList,
  });

  if (error) return <ErrorSection error={error} onRetry={() => refetch()} />;

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {/* Mobile filter button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden">
                <SlidersHorizontal className="mr-1 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <p className="text-sm text-gray-500">Filter options coming soon</p>
              </div>
            </SheetContent>
          </Sheet>

          <Input
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setQ(e.target.value || null);
              setPage(1);
            }}
            className="max-w-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {data ? `${data.totalElements} products` : ''}
          </span>
          <Select value={sort || 'relevance'} onValueChange={(v) => { setSort(v === 'relevance' ? null : v); setPage(1); }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product grid */}
      {isLoading ? (
        <SectionSkeleton variant="card" rows={8} />
      ) : !data?.content.length ? (
        <EmptyState
          title="No products found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {data.content.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={!data.hasPrevious}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-500">
              Page {page} of {data.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={!data.hasNext}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
