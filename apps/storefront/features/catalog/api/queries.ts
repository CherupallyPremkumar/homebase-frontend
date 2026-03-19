'use client';

import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@homebase/api-client';
import { CACHE_TIMES } from '@homebase/shared';

export function useBanners() {
  return useQuery({
    queryKey: ['banners'],
    queryFn: () => catalogApi.banners(),
    ...CACHE_TIMES.banners,
  });
}

export function useCategoryMenu() {
  return useQuery({
    queryKey: ['categories', 'menu'],
    queryFn: () => catalogApi.categoryMenu(),
    ...CACHE_TIMES.categoryMenu,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => catalogApi.featuredProducts(),
    ...CACHE_TIMES.productList,
  });
}
