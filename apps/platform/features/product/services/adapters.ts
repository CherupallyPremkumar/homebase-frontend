/**
 * Adapter functions that transform backend SearchResponse data into UI-specific shapes.
 * Shared between server-side prefetching (page.tsx) and client hooks (use-product.ts).
 *
 * This file must NOT have 'use client' so it can be imported in Server Components.
 */

import type { Product as SharedProduct, SearchResponse } from '@homebase/types';
import type { ProductStats, ProductListResponse, ProductListFilters } from '../types';

export function adaptProductStats(res: SearchResponse<SharedProduct>): ProductStats {
  const total = res.maxRows ?? 0;
  return {
    totalProducts: { value: total.toLocaleString(), subtitle: 'From catalog' },
    pendingReview: { value: '0', subtitle: 'Needs attention' },
    flagged: { value: '0', subtitle: 'From catalog' },
    removed: { value: '0', subtitle: 'From catalog' },
  };
}

export function adaptProductList(
  res: SearchResponse<SharedProduct>,
  filters: ProductListFilters,
): ProductListResponse {
  const products = (res.list ?? []).map((item, idx) => ({
    id: idx + 1,
    name: item.row.name ?? '',
    sku: item.row.sku ?? '',
    emoji: '',
    emojiBg: '',
    seller: item.row.supplierName ?? item.row.supplierId ?? '',
    category: item.row.categoryName ?? item.row.categoryId ?? '',
    price: String(item.row.sellingPrice ?? item.row.basePrice ?? ''),
    stock: item.row.variants?.[0]?.stockQuantity ?? 0,
    status: (item.row.stateId ?? 'Active') as 'Active' | 'Pending' | 'Flagged' | 'Removed',
    date: item.row.createdTime ?? '',
  }));

  const total = res.maxRows ?? products.length;
  const pageSize = filters.pageSize || 10;
  return {
    products,
    total,
    page: res.currentPage ?? filters.page,
    pageSize,
    totalPages: res.maxPages ?? Math.ceil(total / pageSize),
  };
}
