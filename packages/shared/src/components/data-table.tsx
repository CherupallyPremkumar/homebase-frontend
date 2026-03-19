'use client';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@homebase/ui';
import type { SearchRequest, SearchResponse } from '@homebase/types';
import { useSearchQuery } from '../hooks/use-search-query';
import { useDebounce } from '../hooks/use-debounce';
import { EmptyState } from './empty-state';
import { ErrorSection } from './error-section';
import { SectionSkeleton } from './section-skeleton';
import { PAGINATION } from '../lib/constants';
import { useState } from 'react';

interface DataTableProps<T> {
  columns: ColumnDef<T, unknown>[];
  queryKey: string;
  queryFn: (params: SearchRequest) => Promise<SearchResponse<T>>;
  searchable?: boolean;
  searchPlaceholder?: string;
  staleTime?: number;
  toolbar?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T>({
  columns,
  queryKey,
  queryFn,
  searchable = false,
  searchPlaceholder = 'Search...',
  staleTime = 30_000,
  toolbar,
  emptyTitle = 'No results found',
  emptyDescription,
}: DataTableProps<T>) {
  const { searchRequest, page, setPage, size, setSize, q, setQ, sort, setSort, sortOrder, setSortOrder } = useSearchQuery();
  const [searchInput, setSearchInput] = useState(q || '');
  const debouncedSearch = useDebounce(searchInput, 300);

  const effectiveRequest: SearchRequest = {
    ...searchRequest,
    q: debouncedSearch || undefined,
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKey, 'list', effectiveRequest],
    queryFn: () => queryFn(effectiveRequest),
    staleTime,
    retry: 2,
  });

  const table = useReactTable({
    data: data?.content ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: data?.totalPages ?? 0,
    state: {
      pagination: { pageIndex: page - 1, pageSize: size },
    },
  });

  if (error) {
    return <ErrorSection error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {searchable && (
          <Input
            placeholder={searchPlaceholder}
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setQ(e.target.value || null);
              setPage(1);
            }}
            className="max-w-sm"
          />
        )}
        {toolbar}
      </div>

      {isLoading ? (
        <SectionSkeleton variant="table" rows={size} />
      ) : !data?.content.length ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * size + 1}–{Math.min(page * size, data.totalElements)} of{' '}
              {data.totalElements}
            </p>
            <div className="flex items-center gap-2">
              <Select value={String(size)} onValueChange={(v) => { setSize(Number(v)); setPage(1); }}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGINATION.sizes.map((s) => (
                    <SelectItem key={s} value={String(s)}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={!data.hasPrevious}
              >
                Previous
              </Button>
              <span className="text-sm">
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
          </div>
        </>
      )}
    </div>
  );
}
