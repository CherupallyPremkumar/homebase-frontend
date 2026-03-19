'use client';

import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { useMemo } from 'react';
import type { SearchRequest } from '@homebase/types';
import { PAGINATION } from '../lib/constants';

export function useSearchQuery(defaults?: Partial<SearchRequest>) {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(defaults?.page ?? PAGINATION.defaultPage));
  const [size, setSize] = useQueryState('size', parseAsInteger.withDefault(defaults?.size ?? PAGINATION.defaultSize));
  const [sort, setSort] = useQueryState('sort', parseAsString.withDefault(defaults?.sort ?? ''));
  const [sortOrder, setSortOrder] = useQueryState('sortOrder', parseAsString.withDefault(defaults?.sortOrder ?? 'DESC'));
  const [q, setQ] = useQueryState('q', parseAsString.withDefault(''));

  const searchRequest = useMemo<SearchRequest>(
    () => ({
      page,
      size,
      sort: sort || undefined,
      sortOrder: (sortOrder as 'ASC' | 'DESC') || undefined,
      q: q || undefined,
    }),
    [page, size, sort, sortOrder, q],
  );

  return {
    searchRequest,
    page,
    setPage,
    size,
    setSize,
    sort,
    setSort,
    sortOrder,
    setSortOrder,
    q,
    setQ,
  };
}
