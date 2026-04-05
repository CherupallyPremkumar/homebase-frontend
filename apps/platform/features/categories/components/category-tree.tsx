'use client';

import { useState, useCallback } from 'react';
import { Search, RefreshCw, AlertCircle, Inbox } from 'lucide-react';
import { Skeleton } from '@homebase/ui';

import { useCategoryTree, useCategoryStats } from '../hooks/use-categories';
import type { CategoryNode, CategoryFilter } from '../types';
import { CategoryTreeNode } from './category-tree-node';

// ----------------------------------------------------------------
// Text constants
// ----------------------------------------------------------------

const TEXT = {
  sectionLabel: 'Category tree',
  tabsLabel: 'Category filter tabs',
  searchPlaceholder: 'Search categories...',
  searchLabel: 'Search categories',
  all: 'All',
  active: 'Active',
  inactive: 'Inactive',
  noMatch: 'No categories match your search',
  errorTitle: 'Failed to load categories',
  errorSubtitle: 'Please check your connection and try again.',
  retry: 'Retry',
  emptyTitle: 'No categories found',
  emptySubtitle: 'Categories will appear here once created.',
  loadingLabel: 'Loading category tree',
} as const;

// ----------------------------------------------------------------
// Filter logic
// ----------------------------------------------------------------

function filterNodes(nodes: CategoryNode[], filter: CategoryFilter): CategoryNode[] {
  if (filter === 'all') return nodes;
  return nodes
    .map((node) => ({
      ...node,
      children: filterNodes(node.children, filter),
    }))
    .filter(
      (node) =>
        (filter === 'active' ? node.active : !node.active) ||
        node.children.length > 0,
    );
}

// ----------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------

function TreeSkeleton() {
  return (
    <div className="space-y-3 px-6 py-5" role="status" aria-label={TEXT.loadingLabel}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-lg" />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

function TreeError({ onRetry }: { onRetry: () => void }) {
  return (
    <section
      className="mx-6 my-5 flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-12"
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="mb-4 h-12 w-12 text-red-400" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-gray-900">{TEXT.errorTitle}</h2>
      <p className="mt-1 text-sm text-gray-500">{TEXT.errorSubtitle}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        {TEXT.retry}
      </button>
    </section>
  );
}

function TreeEmpty() {
  return (
    <section className="mx-6 my-5 flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-12">
      <Inbox className="mb-4 h-12 w-12 text-gray-300" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-gray-900">{TEXT.emptyTitle}</h2>
      <p className="mt-1 text-sm text-gray-500">{TEXT.emptySubtitle}</p>
    </section>
  );
}

// ----------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------

interface CategoryTreeProps {
  onEdit: (node: CategoryNode) => void;
  onToggleActive: (node: CategoryNode) => void;
  onDelete: (node: CategoryNode) => void;
}

export function CategoryTree({ onEdit, onToggleActive, onDelete }: CategoryTreeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');

  const statsQuery = useCategoryStats();
  const { data: treeData, isLoading: treeLoading, isError: treeError, refetch, loadChildren, loadingParents } = useCategoryTree();

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const stats = statsQuery.data;

  const tabs = [
    {
      key: 'all' as const,
      label: TEXT.all,
      count: stats?.totalCategories ?? 0,
      badgeClass: 'bg-gray-100 text-gray-600',
    },
    {
      key: 'active' as const,
      label: TEXT.active,
      count: stats?.activeCategories ?? 0,
      badgeClass: 'bg-green-100 text-green-700',
    },
    {
      key: 'inactive' as const,
      label: TEXT.inactive,
      count: stats?.inactiveCategories ?? 0,
      badgeClass: 'bg-red-100 text-red-700',
    },
  ];

  const filteredTree = filterNodes(treeData ?? [], activeFilter);

  return (
    <section aria-label={TEXT.sectionLabel}>
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Tabs + Search */}
        <div className="flex items-center justify-between px-6 pb-0 pt-5">
          <nav
            className="-mb-px flex items-center gap-0 border-b border-gray-200"
            aria-label={TEXT.tabsLabel}
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveFilter(tab.key)}
                aria-current={activeFilter === tab.key ? 'page' : undefined}
                className={`border-b-2 px-4 pb-3 text-sm font-medium transition ${
                  activeFilter === tab.key
                    ? 'border-orange-500 text-orange-500 font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}{' '}
                <span
                  className={`ml-1 rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                    activeFilter === tab.key
                      ? 'bg-gray-100 text-gray-600'
                      : tab.badgeClass
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
          <div className="relative mb-3">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder={TEXT.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={TEXT.searchLabel}
              className="w-64 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </div>

        {/* Tree content */}
        {treeLoading ? (
          <TreeSkeleton />
        ) : treeError ? (
          <TreeError onRetry={handleRetry} />
        ) : filteredTree.length === 0 ? (
          searchQuery ? (
            <div className="px-6 py-8 text-center text-sm text-gray-400">
              {TEXT.noMatch}
            </div>
          ) : (
            <TreeEmpty />
          )
        ) : (
          <div className="px-6 py-5" role="tree" aria-label="Category hierarchy">
            {filteredTree.map((node) => (
              <div key={node.id} className="mb-3 rounded-lg border border-gray-100">
                <CategoryTreeNode
                  node={node}
                  depth={0}
                  searchQuery={searchQuery}
                  onExpand={loadChildren}
                  loadingParents={loadingParents}
                  onEdit={onEdit}
                  onToggleActive={onToggleActive}
                  onDelete={onDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
