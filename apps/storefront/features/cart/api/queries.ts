'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@homebase/api-client';
import { useAuth } from '@homebase/auth';
import { CACHE_TIMES } from '@homebase/shared';
import type { AddToCartPayload } from '@homebase/types';

export const CART_QUERY_KEY = ['cart', 'active'] as const;

/**
 * Fetches the active cart for the authenticated user.
 * Only enabled when the user is authenticated.
 */
export function useActiveCart() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      const response = await cartApi.storefrontCart({ pageNum: 1, pageSize: 1 });
      const cart = response.list?.[0]?.row ?? null;
      return cart;
    },
    ...CACHE_TIMES.cart,
    enabled: isAuthenticated,
  });
}

/**
 * Mutation to add an item to the backend cart.
 * Invalidates the cart query on success.
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId, payload }: { cartId: string; payload: AddToCartPayload }) =>
      cartApi.addItem(cartId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

/**
 * Mutation to remove an item from the backend cart.
 * Invalidates the cart query on success.
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId, itemId }: { cartId: string; itemId: string }) =>
      cartApi.removeItem(cartId, { itemId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

/**
 * Mutation to update a cart item's quantity.
 * Invalidates the cart query on success.
 */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId, itemId, quantity }: { cartId: string; itemId: string; quantity: number }) =>
      cartApi.updateItem(cartId, { itemId, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

/**
 * Mutation to apply a coupon to the cart.
 * Invalidates the cart query on success.
 */
export function useApplyCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId, couponCode }: { cartId: string; couponCode: string }) =>
      cartApi.applyCoupon(cartId, { couponCode }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

/**
 * Mutation to remove a coupon from the cart.
 * Invalidates the cart query on success.
 */
export function useRemoveCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId }: { cartId: string }) =>
      cartApi.removeCoupon(cartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}
