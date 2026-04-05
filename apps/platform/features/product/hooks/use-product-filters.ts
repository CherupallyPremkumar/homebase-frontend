'use client';

import { useState, useCallback } from 'react';
import type { AdvancedFilters } from '../types';
import { defaultAdvancedFilters } from '../services/product-list-mock';

interface ProductFiltersResult {
  pending: AdvancedFilters;
  applied: AdvancedFilters;
  updatePending: (partial: Partial<AdvancedFilters>) => void;
  apply: () => void;
  reset: () => void;
  hasActiveFilters: boolean;
}

export function useProductFilters(): ProductFiltersResult {
  const [pending, setPending] = useState<AdvancedFilters>(defaultAdvancedFilters);
  const [applied, setApplied] = useState<AdvancedFilters>(defaultAdvancedFilters);

  const updatePending = useCallback((partial: Partial<AdvancedFilters>) => {
    setPending((prev) => ({ ...prev, ...partial }));
  }, []);

  const apply = useCallback(() => {
    setApplied(pending);
  }, [pending]);

  const reset = useCallback(() => {
    setPending(defaultAdvancedFilters);
    setApplied(defaultAdvancedFilters);
  }, []);

  const hasActiveFilters =
    applied.priceMin !== defaultAdvancedFilters.priceMin ||
    applied.priceMax !== defaultAdvancedFilters.priceMax ||
    applied.minRating !== 0 ||
    applied.category !== '' ||
    applied.seller !== '' ||
    applied.stockStatus !== '' ||
    applied.hasReviews !== '' ||
    applied.dateFrom !== '' ||
    applied.dateTo !== '';

  return { pending, applied, updatePending, apply, reset, hasActiveFilters };
}
