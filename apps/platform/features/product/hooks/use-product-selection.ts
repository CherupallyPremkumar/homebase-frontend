'use client';

import { useState, useCallback, useEffect } from 'react';

interface ProductSelectionResult {
  selectedIds: Set<string>;
  toggle: (id: string) => void;
  selectAll: (ids: string[]) => void;
  deselectAll: () => void;
  isSelected: (id: string) => boolean;
  isAllSelected: (ids: string[]) => boolean;
  count: number;
}

export function useProductSelection(resetKey: string): ProductSelectionResult {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Reset selection when page/tab/filter changes
  useEffect(() => {
    setSelectedIds(new Set());
  }, [resetKey]);

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds]);

  const isAllSelected = useCallback(
    (ids: string[]) => ids.length > 0 && ids.every((id) => selectedIds.has(id)),
    [selectedIds],
  );

  return { selectedIds, toggle, selectAll, deselectAll, isSelected, isAllSelected, count: selectedIds.size };
}
