'use client';

import { useState, useCallback, useEffect } from 'react';
import { Inbox, AlertTriangle } from 'lucide-react';

import {
  useEnhancedProductStats,
  useEnhancedProductList,
  useLowStockAlert,
  useFilterOptions,
} from '../hooks/use-product';
import { useProductSelection } from '../hooks/use-product-selection';
import { useProductFilters } from '../hooks/use-product-filters';
import { mockEnhancedTabs } from '../services/product-list-mock';

import { ProductListHeader } from './product-list-header';
import { ProductListAlertBar } from './product-list-alert-bar';
import { ProductListStats } from './product-list-stats';
import { ProductListFilterSidebar } from './product-list-filter-sidebar';
import { ProductListToolbar } from './product-list-toolbar';
import { ProductListTable } from './product-list-table';
import { ProductListPagination } from './product-list-pagination';
import { ProductListSkeleton } from './product-list-skeleton';

const TEXT = {
  errorTitle: 'Failed to load products',
  retry: 'Retry',
  emptyTitle: 'No products found',
  emptySubtitle: 'Try adjusting your search or filter criteria.',
} as const;

const DEBOUNCE_MS = 300;

export function ProductList() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(searchInput); setPage(1); }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Hooks
  const tabKey = mockEnhancedTabs[activeTab]?.key ?? 'all';

  const statsQuery = useEnhancedProductStats();
  const listQuery = useEnhancedProductList(tabKey);
  const alertQuery = useLowStockAlert();
  const filterOptionsQuery = useFilterOptions();
  const filters = useProductFilters();

  const resetKey = `${activeTab}-${page}-${debouncedSearch}`;
  const selection = useProductSelection(resetKey);

  const products = listQuery.data ?? [];
  const total = 8920; // mock total
  const totalPages = Math.ceil(total / pageSize);

  const handleTabChange = useCallback((index: number) => { setActiveTab(index); setPage(1); }, []);
  const handlePageSizeChange = useCallback((size: number) => { setPageSize(size); setPage(1); }, []);

  const toggleAll = useCallback(() => {
    const ids = products.map((p) => p.id);
    if (selection.isAllSelected(ids)) selection.deselectAll();
    else selection.selectAll(ids);
  }, [products, selection]);

  // Loading
  if (statsQuery.isLoading || listQuery.isLoading) return <ProductListSkeleton />;

  // Error
  if (statsQuery.isError || listQuery.isError) {
    return (
      <section className="flex flex-col items-center justify-center py-32">
        <AlertTriangle className="h-12 w-12 text-red-400" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">{TEXT.errorTitle}</h2>
        <button
          onClick={() => { statsQuery.refetch(); listQuery.refetch(); }}
          className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          {TEXT.retry}
        </button>
      </section>
    );
  }

  const isEmpty = products.length === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <ProductListHeader
        onToggleFilters={() => setFilterSidebarOpen((v) => !v)}
        onApplyPreset={() => {}}
      />

      {/* Smart Alert Bar */}
      {alertQuery.data && <ProductListAlertBar alert={alertQuery.data} />}

      {/* Stats Cards */}
      <ProductListStats />

      {/* Content Area: Filter Sidebar + Table */}
      <div className="flex gap-6">
        {/* Advanced Filter Sidebar */}
        {filterOptionsQuery.data && (
          <ProductListFilterSidebar
            isOpen={filterSidebarOpen}
            filters={filters.pending}
            options={filterOptionsQuery.data}
            onUpdate={filters.updatePending}
            onApply={filters.apply}
            onReset={filters.reset}
          />
        )}

        {/* Table Card */}
        <div className="min-w-0 flex-1">
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
            {/* Toolbar: Tabs + Search + Bulk */}
            <ProductListToolbar
              tabs={mockEnhancedTabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              searchInput={searchInput}
              onSearchChange={setSearchInput}
              selectedCount={selection.count}
              onDeselectAll={selection.deselectAll}
            />

            {/* Table or Empty */}
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Inbox className="h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-base font-semibold text-gray-900">{TEXT.emptyTitle}</h3>
                <p className="mt-1 text-sm text-gray-500">{TEXT.emptySubtitle}</p>
              </div>
            ) : (
              <ProductListTable
                products={products}
                isAllSelected={selection.isAllSelected(products.map((p) => p.id))}
                isSelected={selection.isSelected}
                onToggle={selection.toggle}
                onToggleAll={toggleAll}
              />
            )}

            {/* Pagination */}
            {!isEmpty && (
              <ProductListPagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                total={total}
                onPageChange={setPage}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
