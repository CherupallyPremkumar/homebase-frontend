import type { CatalogItem, Category, SearchSuggestion, ProductFilter, Banner, SearchRequest, SearchResponse } from '@homebase/types';
import { getApiClient } from './client';

// Row types matching MyBatis query column aliases
export interface CategoryTreeRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string;
  level: number;
  displayOrder: number;
  active: boolean;
  featured: boolean;
  imageUrl: string;
  icon: string;
  showInMenu: boolean;
  hasChildren: boolean;
}

export interface CategoryRuleRow {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryLevel: number;
  commissionRate: number;
  gstRate: number;
  hsnCode: string;
  returnDays: number;
  returnType: string;
  maxWeightKg: number;
  shippingType: string;
  restrictionType: string;
  requiredLicense: string;
  minImages: number;
  minDescriptionLength: number;
  eanRequired: boolean;
}

export interface CategoryStatRow {
  categoryId: string;
  categoryName: string;
  active: boolean;
  productCount: number;
  sellerCount: number;
}

export interface CategoryAttributeRow {
  id: string;
  categoryId: string;
  categoryName: string;
  attributeName: string;
  attributeType: string;
  isRequired: boolean;
  allowedValues: string;
  sortOrder: number;
}

export interface CategorySummaryRow {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
  rootCount: number;
  subCount: number;
  leafCount: number;
}

export const catalogApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<CatalogItem>>('/catalog/catalogItems', params);
  },
  categories(params: SearchRequest) {
    return getApiClient().post<SearchResponse<Category>>('/catalog/catalogCategories', params);
  },

  storefrontProducts(params: SearchRequest) {
    return getApiClient().post<SearchResponse<CatalogItem>>('/storefront/storefront-products', params);
  },
  storefrontCategories(params: SearchRequest) {
    return getApiClient().post<SearchResponse<Category>>('/storefront/storefront-categories', params);
  },
  suggestions(q: string) {
    return getApiClient().post<SearchResponse<SearchSuggestion>>('/storefront/suggestions', {
      pageNum: 1,
      pageSize: 10,
      filters: { q },
    });
  },
  featuredProducts(params?: SearchRequest) {
    return getApiClient().post<SearchResponse<CatalogItem>>('/storefront/featured-products', params ?? {
      pageNum: 1,
      pageSize: 20,
    });
  },
  banners(params?: SearchRequest) {
    return getApiClient().post<SearchResponse<Banner>>('/storefront/banners', params ?? {
      pageNum: 1,
      pageSize: 10,
    });
  },
  filters(params: SearchRequest) {
    return getApiClient().post<SearchResponse<ProductFilter>>('/storefront/filters', params);
  },
  async getProduct(id: string) {
    const response = await getApiClient().post<SearchResponse<CatalogItem>>('/storefront/storefront-products', {
      pageNum: 1,
      pageSize: 1,
      filters: { id },
    });
    const item = response.list?.[0]?.row;
    if (!item) throw new Error('Product not found');
    return item;
  },
  categoryMenu(params?: SearchRequest) {
    return getApiClient().post<SearchResponse<Category>>('/catalog/categoryMenu', params ?? { pageNum: 1, pageSize: 100 });
  },
  // Admin queries — via CatalogQueryController /catalog/{queryName}
  categoryTree(params: SearchRequest) {
    return getApiClient().post<SearchResponse<CategoryTreeRow>>('/catalog/categoryTree', params);
  },
  categoryRules(params: SearchRequest) {
    return getApiClient().post<SearchResponse<CategoryRuleRow>>('/catalog/categoryRules', params);
  },
  categoryStats(params: SearchRequest) {
    return getApiClient().post<SearchResponse<CategoryStatRow>>('/catalog/categoryStats', params);
  },
  categoryAttributes(params: SearchRequest) {
    return getApiClient().post<SearchResponse<CategoryAttributeRow>>('/catalog/categoryAttributes', params);
  },
  categorySummary() {
    return getApiClient().post<SearchResponse<CategorySummaryRow>>('/catalog/categorySummary', {});
  },

  // ---- Mutations (TODO: wire to real backend endpoints) ----

  createCategory(payload: CreateCategoryDto) {
    // TODO: POST /catalog — Chenile STM create. Returns StateEntityServiceResponse<Category>
    return Promise.reject(new Error('createCategory API not yet implemented'));
  },
  deleteCategory(id: string) {
    // TODO: PATCH /catalog/{id}/delete — Chenile STM processById. Returns StateEntityServiceResponse<Category>
    return Promise.reject(new Error('deleteCategory API not yet implemented'));
  },
  exportCategories(format: 'csv' | 'xlsx' = 'csv') {
    // TODO: GET /catalog/export?format={format} — returns Blob for download
    return Promise.reject(new Error('exportCategories API not yet implemented'));
  },
};

// ---- Mutation DTOs ----

export interface CreateCategoryDto {
  name: string;
  parentId: string;
  commissionRate: number;
  gstRate: number;
  hsnCode: string;
  returnDays: number;
  returnType: string;
  maxWeightKg: number;
  restrictionType: string;
  minImages: number;
  minDescriptionLength: number;
  eanRequired: boolean;
  description: string;
}
