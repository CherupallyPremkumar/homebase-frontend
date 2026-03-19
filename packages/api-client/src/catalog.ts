import type { CatalogItem, CategoryMenu, SearchSuggestion, ProductFilter, Banner, SearchRequest, SearchResponse } from '@homebase/types';
import { getApiClient } from './client';

export const catalogApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<CatalogItem>>('/api/v1/catalog/search', params);
  },
  getProduct(id: string) {
    return getApiClient().get<CatalogItem>(`/api/v1/catalog/products/${id}`);
  },
  categoryMenu() {
    return getApiClient().get<CategoryMenu>('/api/v1/catalog/categories/menu');
  },
  getFilters(categoryId?: string) {
    const params = categoryId ? `?categoryId=${categoryId}` : '';
    return getApiClient().get<ProductFilter>(`/api/v1/catalog/filters${params}`);
  },
  suggestions(q: string) {
    return getApiClient().get<SearchSuggestion[]>(`/api/v1/catalog/suggestions?q=${encodeURIComponent(q)}`);
  },
  featuredProducts() {
    return getApiClient().get<CatalogItem[]>('/api/v1/catalog/featured');
  },
  banners() {
    return getApiClient().get<Banner[]>('/api/v1/catalog/banners');
  },
};
