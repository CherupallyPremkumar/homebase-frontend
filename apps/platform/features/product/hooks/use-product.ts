'use client';

import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';

import type { Product as SharedProduct } from '@homebase/types';

import type {
  ProductStats,
  ProductListResponse,
  ProductDetailData,
  ProductListFilters,
  EnhancedStatCard,
  EnhancedProduct,
  LowStockAlert,
  FilterOptions,
} from '../types';
import { adaptProductStats, adaptProductList } from '../services/adapters';
import {
  mockEnhancedStats,
  mockEnhancedProducts,
  mockLowStockAlert,
  mockProductDetails,
  mockFilterOptions,
} from '../services/product-list-mock';

export type { ProductListFilters } from '../types';
export { adaptProductStats, adaptProductList } from '../services/adapters';

// ----------------------------------------------------------------
// Product Stats (4 stat cards)
// ----------------------------------------------------------------

export function useProductStats() {
  return useQuery<ProductStats>({
    queryKey: ['product-stats'],
    queryFn: async () => {
      const res = await productsApi.search({ pageNum: 1, pageSize: 1 });
      return adaptProductStats(res);
    },
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// Product List (paginated table)
// ----------------------------------------------------------------

export function useProductList(filters: ProductListFilters) {
  return useQuery<ProductListResponse>({
    queryKey: ['product-list', filters],
    queryFn: async () => {
      const res = await productsApi.search({
        pageNum: filters.page,
        pageSize: filters.pageSize,
        filters: {
          ...(filters.status && filters.status !== 'all' ? { stateId: filters.status } : {}),
          ...(filters.search ? { searchText: filters.search } : {}),
        },
      });
      return adaptProductList(res, filters);
    },
    staleTime: 15_000,
  });
}

// ----------------------------------------------------------------
// Product Detail (rich admin view)
// ----------------------------------------------------------------

export function useProductAdminDetail(id: string) {
  return useQuery<ProductDetailData>({
    queryKey: ['product-admin-detail', id],
    queryFn: async () => {
      // Try mock data first (for mock product IDs)
      const mockDetail = mockProductDetails[id];
      if (mockDetail) return mockDetail;

      // Fall back to real API
      const stmResp = await productsApi.retrieve(id);
      const p = stmResp.mutatedEntity;
      return {
        id: p.id ?? '',
        name: p.name ?? '',
        sku: p.sku ?? '',
        emoji: '',
        status: p.stateId ?? '',
        statusColor: 'green',
        category: p.categoryName ?? p.categoryId ?? '',
        brand: p.brand ?? p.brandName ?? '',
        listedDate: p.createdTime ?? '',
        description: p.description ?? '',
        features: [],
        mrp: p.mrp ?? 0,
        sellingPrice: p.sellingPrice ?? 0,
        discountPercent: p.mrp ? Math.round(((p.mrp - p.sellingPrice) / p.mrp) * 100) : 0,
        stock: p.variants?.[0]?.stockQuantity ?? 0,
        avgRating: p.averageRating ?? 0,
        reviewCount: p.reviewCount ?? 0,
        ratingBreakdown: [],
        seller: {
          id: p.supplierId ?? '',
          name: p.supplierName ?? '',
          initials: '',
          avatarBg: '',
          tier: '',
          since: '',
          rating: 0,
          productCount: 0,
          orderCount: 0,
        },
        productId: p.id ?? '',
        createdDate: p.createdTime ?? '',
        lastUpdated: p.lastModifiedTime ?? '',
        views: 0,
        orders: 0,
        returns: 0,
        returnRate: '0%',
        gstPercent: 0,
        hsnCode: p.hsnCode ?? '',
        weight: '',
        dimensions: '',
        shippingWeight: '',
        freeShipping: false,
        estDelivery: '',
        returnable: '',
        moderationHistory: [],
      } satisfies ProductDetailData;
    },
    staleTime: 30_000,
    enabled: !!id,
  });
}

// ----------------------------------------------------------------
// Detail & Mutation (existing STM-based)
// ----------------------------------------------------------------

export function useProductDetail(id: string) {
  return useQuery({
    queryKey: ['platform-product', id],
    queryFn: () => productsApi.retrieve(id),
    ...CACHE_TIMES.productDetail,
    enabled: !!id,
  });
}

export function useProductMutation() {
  return useStmMutation<SharedProduct>({
    entityType: 'platform-product',
    mutationFn: productsApi.processById,
  });
}

// ================================================================
// ENHANCED HOOKS (prototype-matching)
// ================================================================

function mockFn<T>(data: T) {
  return async () => data;
}

export function useEnhancedProductStats() {
  return useQuery<EnhancedStatCard[]>({
    queryKey: ['product-enhanced-stats'],
    queryFn: mockFn(mockEnhancedStats),
    staleTime: 30_000,
  });
}

const TAB_STATUS_MAP: Record<string, string> = {
  published: 'Published',
  under_review: 'Under Review',
  suspended: 'Suspended',
  draft: 'Draft',
};

export function useEnhancedProductList(tabKey: string) {
  return useQuery<EnhancedProduct[]>({
    queryKey: ['product-enhanced-list', tabKey],
    queryFn: async () => {
      const statusFilter = TAB_STATUS_MAP[tabKey];
      if (!statusFilter) return mockEnhancedProducts;
      return mockEnhancedProducts.filter((p) => p.status === statusFilter);
    },
    staleTime: 15_000,
  });
}

export function useLowStockAlert() {
  return useQuery<LowStockAlert>({
    queryKey: ['product-low-stock-alert'],
    queryFn: mockFn(mockLowStockAlert),
    staleTime: 60_000,
  });
}

export function useFilterOptions() {
  return useQuery<FilterOptions>({
    queryKey: ['product-filter-options'],
    queryFn: mockFn(mockFilterOptions),
    staleTime: 300_000,
  });
}
