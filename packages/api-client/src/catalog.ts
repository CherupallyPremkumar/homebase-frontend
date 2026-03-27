import type { CatalogItem, Category, SearchSuggestion, ProductFilter, Banner, SearchRequest, SearchResponse } from '@homebase/types';
import { getApiClient } from './client';

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
};
