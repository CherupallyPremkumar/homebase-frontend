'use client';

import * as React from 'react';
import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  MoreVertical,
  Search,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Inbox,
  Pencil,
} from 'lucide-react';
import { cn } from '../lib/utils';
import {
  categorizeActions,
  formatEventLabel,
} from '../lib/action-utils';
import { StateBadge } from '../display/state-badge';
import { StarRating } from '../display/star-rating';
import { EmptyState } from '../display/empty-state';
import { ErrorState } from '../display/error-state';
import { formatDate, formatNumber, formatPrice } from '../display/format';
import { Button } from '../button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '../dropdown-menu';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '../alert-dialog';
import { EntityCard, type EntityCardProps } from './entity-card';
import type { ColumnConfig } from './types';
import type { AllowedAction } from '@homebase/types';

/** Chenile query SearchRequest -- 1-based pagination */
interface SearchRequest {
  pageNum: number;
  pageSize: number;
  sortCriteria?: { field: string; order: 'ASC' | 'DESC' }[];
  q?: string;
  filters?: Record<string, unknown>;
}

/** Chenile query SearchResponse -- rows in list[].row */
interface SearchResponse<T> {
  list: { row: T; allowedActions?: AllowedAction[] }[];
  currentPage: number;
  maxPages: number;
  maxRows: number;
  numRowsInPage: number;
  numRowsReturned: number;
  startRow: number;
  endRow: number;
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

  // Row actions
  onRowAction?: (id: string, eventId: string, payload?: unknown) => void;
  rowActionLoading?: boolean;

  // Filters
  baseFilter?: Record<string, unknown>;

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
  onRowAction,
  rowActionLoading = false,
  baseFilter,
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
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Build request -- Chenile 1-based pagination
  const request = useMemo<SearchRequest>(
    () => ({
      pageNum: page,
      pageSize,
      q: debouncedSearch || undefined,
      filters: { ...baseFilter, ...tabs?.[activeTab]?.filter },
    }),
    [page, pageSize, debouncedSearch, baseFilter, tabs, activeTab],
  );

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKey, 'list', request],
    queryFn: () => queryFn(request),
    staleTime,
    retry: 2,
  });

  // Extract rows with their allowed actions
  const rows = useMemo(
    () =>
      data?.list?.map((entry) => ({
        item: entry.row,
        allowedActions: entry.allowedActions ?? [],
      })) ?? [],
    [data],
  );
  const totalPages = data?.maxPages ?? 0;
  const totalElements = data?.maxRows ?? 0;
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  // Dev warnings
  if (process.env.NODE_ENV === 'development') {
    if (display === 'table' && !columns?.length) {
      console.warn(
        `[EntityList "${title}"] display="table" but no columns provided`,
      );
    }
    if (display === 'grid' && !cardConfig && !renderItem) {
      console.warn(
        `[EntityList "${title}"] display="grid" needs cardConfig or renderItem`,
      );
    }
  }

  return (
    <div className="space-y-4">
      {/* === List Header === */}
      {renderHeader ? (
        renderHeader()
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  aria-label={searchPlaceholder}
                  className="h-9 rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>
            )}
            {createAction && (
              <Button asChild size="sm">
                <Link href={createAction.href}>
                  {createAction.icon}
                  {createAction.label}
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* === List Tabs === */}
      {tabs && tabs.length > 0 && (
        <div className="flex gap-1 border-b border-gray-200" role="tablist">
          {tabs.map((tab, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeTab}
              onClick={() => {
                setActiveTab(i);
                setPage(1);
              }}
              className={cn(
                'px-4 py-2.5 text-sm font-medium transition-colors',
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

      {/* === List Content === */}
      {error ? (
        <ErrorState message="Failed to load data" onRetry={() => refetch()} />
      ) : isLoading ? (
        <LoadingSkeleton
          display={display}
          columns={columns?.length || 4}
          rows={pageSize > 10 ? 10 : pageSize}
        />
      ) : !rows.length ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          icon={
            emptyIcon ?? (
              <Inbox className="h-12 w-12 text-gray-300" />
            )
          }
        />
      ) : display === 'table' && columns ? (
        <TableContent
          rows={rows}
          columns={columns}
          onRowAction={onRowAction}
          rowActionLoading={rowActionLoading}
        />
      ) : (
        <GridContent
          data={rows.map((r) => r.item)}
          cardConfig={cardConfig}
          renderItem={renderItem}
          gridCols={cardConfig?.gridCols}
        />
      )}

      {/* === List Pagination === */}
      {data && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-500">
            Showing{' '}
            <span className="font-medium text-gray-700">
              {(page - 1) * pageSize + 1}
            </span>
            {' - '}
            <span className="font-medium text-gray-700">
              {Math.min(page * pageSize, totalElements)}
            </span>
            {' of '}
            <span className="font-medium text-gray-700">{totalElements}</span>
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p - 1)}
              disabled={!hasPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            {/* Page indicators */}
            <div className="hidden items-center gap-1 sm:flex">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Show pages around current page
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors',
                      page === pageNum
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100',
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <span className="px-2 text-sm text-gray-500 sm:hidden">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNext}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// === Internal sub-components (not exported) ===

function TableContent<T extends { id?: string }>({
  rows,
  columns,
  onRowAction,
  rowActionLoading,
}: {
  rows: { item: T; allowedActions: AllowedAction[] }[];
  columns: ColumnConfig<T>[];
  onRowAction?: (id: string, eventId: string, payload?: unknown) => void;
  rowActionLoading?: boolean;
}) {
  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    action: AllowedAction;
  } | null>(null);
  const hasActions = onRowAction && rows.some((r) => r.allowedActions.length > 0);

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                  )}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
              {hasActions && (
                <th className="w-12 px-2 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row, rowIndex) => (
              <tr
                key={
                  (row.item as Record<string, unknown>).id as string ||
                  rowIndex
                }
                className={cn(
                  'transition-colors hover:bg-gray-50/70',
                  rowIndex % 2 === 1 && 'bg-gray-50/30',
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-4 py-3',
                      col.align === 'right' && 'text-right',
                      col.align === 'center' && 'text-center',
                    )}
                  >
                    {renderCell(row.item, col)}
                  </td>
                ))}
                {hasActions && (
                  <td className="px-2 py-3 text-right">
                    <RowActionsMenu
                      itemId={
                        ((row.item as Record<string, unknown>).id as string) ??
                        ''
                      }
                      actions={row.allowedActions}
                      onAction={onRowAction!}
                      loading={rowActionLoading}
                      onDangerousAction={(id, action) =>
                        setConfirmAction({ id, action })
                      }
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation dialog for dangerous row actions */}
      <AlertDialog
        open={confirmAction !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmAction(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction
                ? `Confirm: ${formatEventLabel(confirmAction.action.allowedAction)}`
                : ''}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action may not be reversible. Are you sure you want to
              proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmAction) {
                  onRowAction?.(
                    confirmAction.id,
                    confirmAction.action.allowedAction,
                  );
                }
                setConfirmAction(null);
              }}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            >
              {confirmAction
                ? formatEventLabel(confirmAction.action.allowedAction)
                : ''}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/** Kebab menu for a single table row. */
function RowActionsMenu({
  itemId,
  actions,
  onAction,
  loading,
  onDangerousAction,
}: {
  itemId: string;
  actions: AllowedAction[];
  onAction: (id: string, eventId: string) => void;
  loading?: boolean;
  onDangerousAction: (id: string, action: AllowedAction) => void;
}) {
  const categorized = useMemo(() => categorizeActions(actions), [actions]);

  const visibleCount =
    categorized.primary.length +
    categorized.secondary.length +
    categorized.dangerous.length +
    categorized.edit.length;

  if (visibleCount === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
          disabled={loading}
          aria-label="Row actions"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MoreVertical className="h-4 w-4" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {/* Primary actions first */}
        {categorized.primary.map((action) => (
          <DropdownMenuItem
            key={action.allowedAction}
            onClick={() => onAction(itemId, action.allowedAction)}
            className="font-medium"
          >
            {formatEventLabel(action.allowedAction)}
          </DropdownMenuItem>
        ))}

        {/* Edit actions */}
        {categorized.edit.map((action) => (
          <DropdownMenuItem
            key={action.allowedAction}
            onClick={() => onAction(itemId, action.allowedAction)}
          >
            <Pencil className="mr-2 h-3.5 w-3.5 text-gray-500" />
            {formatEventLabel(action.allowedAction)}
          </DropdownMenuItem>
        ))}

        {/* Separator before secondary if there were primary/edit items */}
        {(categorized.primary.length > 0 || categorized.edit.length > 0) &&
          categorized.secondary.length > 0 && <DropdownMenuSeparator />}

        {/* Secondary actions */}
        {categorized.secondary.map((action) => (
          <DropdownMenuItem
            key={action.allowedAction}
            onClick={() => onAction(itemId, action.allowedAction)}
          >
            {formatEventLabel(action.allowedAction)}
          </DropdownMenuItem>
        ))}

        {/* Separator before dangerous */}
        {categorized.dangerous.length > 0 &&
          (categorized.primary.length > 0 ||
            categorized.secondary.length > 0 ||
            categorized.edit.length > 0) && <DropdownMenuSeparator />}

        {/* Dangerous actions */}
        {categorized.dangerous.map((action) => (
          <DropdownMenuItem
            key={action.allowedAction}
            onClick={() => onDangerousAction(itemId, action)}
            className="text-red-600 focus:bg-red-50 focus:text-red-700"
          >
            <AlertTriangle className="mr-2 h-3.5 w-3.5" />
            {formatEventLabel(action.allowedAction)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function renderCell<T>(item: T, col: ColumnConfig<T>): React.ReactNode {
  // Escape hatch -- custom render
  if (col.render) return col.render(item);

  const value = (item as Record<string, unknown>)[col.key];

  // Link wrapper
  const content = renderCellByType(value, col.type);
  if (col.linkTo) {
    return (
      <Link
        href={col.linkTo(item)}
        className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
      >
        {content}
      </Link>
    );
  }
  return content;
}

function renderCellByType(value: unknown, type?: string): React.ReactNode {
  if (value == null)
    return <span className="text-gray-300">&mdash;</span>;

  switch (type) {
    case 'price':
      return (
        <span className="font-medium tabular-nums">
          {formatPrice(value as number)}
        </span>
      );
    case 'date':
      return (
        <span className="text-gray-500">{formatDate(String(value))}</span>
      );
    case 'state':
      return <StateBadge state={String(value)} />;
    case 'rating':
      return <StarRating rating={value as number} />;
    case 'number':
      return (
        <span className="tabular-nums">{formatNumber(value as number)}</span>
      );
    default:
      return <span className="text-gray-700">{String(value)}</span>;
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
    <div
      className={cn(
        'grid gap-4',
        gridCols ||
          'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
      )}
    >
      {data.map((item, i) => {
        // Escape hatch
        if (renderItem)
          return (
            <React.Fragment
              key={
                ((item as Record<string, unknown>).id as string) || i
              }
            >
              {renderItem(item)}
            </React.Fragment>
          );

        // Card config
        if (cardConfig) {
          const props = cardConfig.map(item);
          return (
            <EntityCard
              key={
                ((item as Record<string, unknown>).id as string) || i
              }
              variant={cardConfig.variant || 'vertical'}
              {...props}
            />
          );
        }

        return null;
      })}
    </div>
  );
}

function LoadingSkeleton({
  display,
  columns,
  rows,
}: {
  display: string;
  columns: number;
  rows: number;
}) {
  if (display === 'table') {
    return (
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex gap-4 border-b border-gray-200 bg-gray-50/80 px-4 py-3">
          {Array.from({ length: columns }).map((_, i) => (
            <div
              key={i}
              className="h-4 flex-1 animate-pulse rounded bg-gray-200/60"
              style={{ maxWidth: i === 0 ? '120px' : '80px' }}
            />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex gap-4 px-4 py-3.5',
              i < rows - 1 && 'border-b border-gray-100',
              i % 2 === 1 && 'bg-gray-50/30',
            )}
          >
            {Array.from({ length: columns }).map((_, j) => (
              <div
                key={j}
                className="h-4 flex-1 animate-pulse rounded bg-gray-100"
                style={{
                  maxWidth:
                    j === 0 ? '140px' : j === columns - 1 ? '60px' : '100px',
                  animationDelay: `${(i * columns + j) * 50}ms`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-lg border border-gray-200 bg-white"
        >
          <div
            className="aspect-square w-full animate-pulse bg-gray-100"
            style={{ animationDelay: `${i * 100}ms` }}
          />
          <div className="space-y-2 p-3">
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
