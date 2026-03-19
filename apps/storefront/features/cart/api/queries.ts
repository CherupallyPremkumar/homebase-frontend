'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CACHE_TIMES } from '@homebase/shared';

// Cart state is managed via Zustand (cart-store) with localStorage persistence.
// These hooks are placeholders for when the cart syncs with the backend API.
// For now, all cart operations go through the Zustand store directly.

export const CART_QUERY_KEY = ['cart'] as const;

export function useCartSync() {
  // Future: sync local cart state with backend
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => null, // Will call cartApi.getCart() when backend is wired
    ...CACHE_TIMES.cart,
    enabled: false, // Disabled until backend cart API is ready
  });
}
