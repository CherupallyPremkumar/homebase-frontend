'use client';

import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { useMemo } from 'react';
import type { SearchRequest, SortCriterion } from '@homebase/types';
import { PAGINATION } from '../lib/constants';

export function useSearchQuery(defaults?: { pageNum?: number; pageSize?: number }) {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(defaults?.pageNum ?? PAGINATION.defaultPage));
  const [size, setSize] = useQueryState('size', parseAsInteger.withDefault(defaults?.pageSize ?? PAGINATION.defaultSize));
  const [sort, setSort] = useQueryState('sort', parseAsString.withDefault(''));
  const [sortOrder, setSortOrder] = useQueryState('sortOrder', parseAsString.withDefault('DESC'));
  const [q, setQ] = useQueryState('q', parseAsString.withDefault(''));

  const searchRequest = useMemo<SearchRequest>(
    () => ({
      pageNum: page,
      pageSize: size,
      sortCriteria: sort ? [{ field: sort, order: sortOrder as 'ASC' | 'DESC' }] : undefined,
      filters: q ? { q } : undefined,
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
