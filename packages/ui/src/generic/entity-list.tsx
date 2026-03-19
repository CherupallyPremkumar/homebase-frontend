'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { cn } from '../lib/utils';
import { StateBadge } from '../display/state-badge';
import { StarRating } from '../display/star-rating';
import { EmptyState } from '../display/empty-state';
import { ErrorState } from '../display/error-state';
import { formatDate, formatNumber, formatPrice } from '../display/format';
import { EntityCard, type EntityCardProps } from './entity-card';
import type { ColumnConfig } from './types';

interface SearchRequest {
  page: number;
  size: number;
  sort?: string;
  sortOrder?: 'ASC' | 'DESC';
  q?: string;
  filters?: Record<string, unknown>;
}

interface SearchResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface EntityListProps<T> {
  // Header
  title: string;
  subtitle?: string;
  createAction?: { label: string; href: string; icon?: React.ReactNode };

  // Data
  queryKey: string;
  queryFn: (params: SearchRequest) => Promise<SearchResponse<T>>;

  // Display mode
  display: 'table' | 'grid' | 'cards';

  // Table config
  columns?: ColumnConfig<T>[];

  // Grid/card config
  cardConfig?: {
    variant?: EntityCardProps['variant'];
    map: (item: T) => Omit<EntityCardProps, 'variant'>;
    gridCols?: string; // tailwind grid class
  };

  // ESCAPE HATCH
  renderItem?: (item: T) => React.ReactNode;
  renderHeader?: () => React.ReactNode;

  // Features
  searchable?: boolean;
  searchPlaceholder?: string;
  tabs?: { label: string; filter: Record<string, unknown> }[];

  // Config
  staleTime?: number;
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
}

export function EntityList<T extends { id?: string }>({
  title,
  subtitle,
  createAction,
  queryKey,
  queryFn,
  display,
  columns,
  cardConfig,
  renderItem,
  renderHeader,
  searchable = false,
  searchPlaceholder = 'Search...',
  tabs,
  staleTime = 30_000,
  pageSize = 20,
  emptyTitle = 'No results found',
  emptyDescription,
  emptyIcon,
}: EntityListProps<T>) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Build request
  const request = useMemo<SearchRequest>(() => ({
    page,
    size: pageSize,
    q: debouncedSearch || undefined,
    filters: tabs?.[activeTab]?.filter,
  }), [page, pageSize, debouncedSearch, tabs, activeTab]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKey, 'list', request],
    queryFn: () => queryFn(request),
    staleTime,
    retry: 2,
  });

  // Dev warnings
  if (process.env.NODE_ENV === 'development') {
    if (display === 'table' && !columns?.length) {
      console.warn(`[EntityList "${title}"] display="table" but no columns provided`);
    }
    if (display === 'grid' && !cardConfig && !renderItem) {
      console.warn(`[EntityList "${title}"] display="grid" needs cardConfig or renderItem`);
    }
  }

  return (
    <div className="space-y-4">
      {/* === ListHeader === */}
      {renderHeader ? renderHeader() : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            {searchable && (
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            )}
            {createAction && (
              <Link
                href={createAction.href}
                className="inline-flex h-10 items-center gap-1.5 rounded-md bg-primary-600 px-4 text-sm font-medium text-white hover:bg-primary-700"
              >
                {createAction.icon}
                {createAction.label}
              </Link>
            )}
          </div>
        </div>
      )}

      {/* === ListTabs === */}
      {tabs && tabs.length > 0 && (
        <div className="flex gap-1 border-b border-gray-200">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => { setActiveTab(i); setPage(1); }}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors',
                i === activeTab
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* === ListContent === */}
      {error ? (
        <ErrorState message="Failed to load data" onRetry={() => refetch()} />
      ) : isLoading ? (
        <LoadingSkeleton display={display} columns={columns?.length || 4} rows={pageSize > 10 ? 10 : pageSize} />
      ) : !data?.content.length ? (
        <EmptyState title={emptyTitle} description={emptyDescription} icon={emptyIcon} />
      ) : display === 'table' && columns ? (
        <TableContent data={data.content} columns={columns} />
      ) : (
        <GridContent
          data={data.content}
          cardConfig={cardConfig}
          renderItem={renderItem}
          gridCols={cardConfig?.gridCols}
        />
      )}

      {/* === ListPagination === */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, data.totalElements)} of {data.totalElements}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={!data.hasPrevious}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="px-2 text-sm text-gray-500">
              {page} / {data.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!data.hasNext}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// === Internal sub-components (not exported) ===

function TableContent<T extends { id?: string }>({ data, columns }: { data: T[]; columns: ColumnConfig<T>[] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500',
                  col.align === 'right' && 'text-right',
                  col.align === 'center' && 'text-center',
                )}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item, rowIndex) => (
            <tr key={(item as Record<string, unknown>).id as string || rowIndex} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    'px-3 py-2.5',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                  )}
                >
                  {renderCell(item, col)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderCell<T>(item: T, col: ColumnConfig<T>): React.ReactNode {
  // Escape hatch — custom render
  if (col.render) return col.render(item);

  const value = (item as Record<string, unknown>)[col.key];

  // Link wrapper
  const content = renderCellByType(value, col.type);
  if (col.linkTo) {
    return <Link href={col.linkTo(item)} className="font-medium text-primary-600 hover:text-primary-700">{content}</Link>;
  }
  return content;
}

function renderCellByType(value: unknown, type?: string): React.ReactNode {
  if (value == null) return <span className="text-gray-300">&mdash;</span>;

  switch (type) {
    case 'price':
      return <span className="font-medium">{formatPrice(value as number)}</span>;
    case 'date':
      return <span className="text-gray-500">{formatDate(String(value))}</span>;
    case 'state':
      return <StateBadge state={String(value)} />;
    case 'rating':
      return <StarRating rating={value as number} />;
    case 'number':
      return <span>{formatNumber(value as number)}</span>;
    default:
      return <span>{String(value)}</span>;
  }
}

function GridContent<T extends { id?: string }>({
  data,
  cardConfig,
  renderItem,
  gridCols,
}: {
  data: T[];
  cardConfig?: EntityListProps<T>['cardConfig'];
  renderItem?: (item: T) => React.ReactNode;
  gridCols?: string;
}) {
  return (
    <div className={cn('grid gap-3', gridCols || 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5')}>
      {data.map((item, i) => {
        // Escape hatch
        if (renderItem) return <React.Fragment key={(item as Record<string, unknown>).id as string || i}>{renderItem(item)}</React.Fragment>;

        // Card config
        if (cardConfig) {
          const props = cardConfig.map(item);
          return <EntityCard key={(item as Record<string, unknown>).id as string || i} variant={cardConfig.variant || 'vertical'} {...props} />;
        }

        return null;
      })}
    </div>
  );
}

function LoadingSkeleton({ display, rows }: { display: string; columns: number; rows: number }) {
  if (display === 'table') {
    return (
      <div className="space-y-1">
        <div className="h-10 w-full animate-pulse rounded bg-gray-100" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-11 w-full animate-pulse rounded bg-gray-50" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="aspect-square w-full animate-pulse rounded-md bg-gray-100" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}
