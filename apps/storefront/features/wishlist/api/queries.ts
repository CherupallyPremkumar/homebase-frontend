'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@homebase/api-client';
import { useAuth } from '@homebase/auth';

export const WISHLIST_QUERY_KEY = ['wishlist'] as const;

export function useWishlist() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: () => usersApi.getWishlist(),
    enabled: isAuthenticated,
    staleTime: 60_000,
    gcTime: 300_000,
  });
}

export function useIsInWishlist(productId: string) {
  const { data: wishlist } = useWishlist();
  return wishlist?.some((item) => item.productId === productId) ?? false;
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => usersApi.addToWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => usersApi.removeFromWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });
}
