'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@homebase/auth';
import { useCartStore } from '@homebase/shared';
import { cartApi } from '@homebase/api-client';
import { useQueryClient } from '@tanstack/react-query';
import { CART_QUERY_KEY, useActiveCart } from '../api/queries';

/**
 * Hook that synchronizes the cart when the user's authentication state changes.
 *
 * On login (session transitions from null to valid):
 * 1. Fetches the backend cart
 * 2. If there are guest cart items, merges them into the backend cart via addItem() calls
 * 3. Clears the guest cart after merge
 * 4. Syncs the backend cart into the Zustand store
 *
 * On logout:
 * 1. Clears the backend cart reference from the store
 */
export function useCartSync() {
  const { isAuthenticated, isLoading } = useAuth();
  const wasAuthenticated = useRef<boolean | null>(null);
  const isMerging = useRef(false);
  const { data: backendCart } = useActiveCart();
  const queryClient = useQueryClient();
  const { setBackendCart, setAuthenticated, mergeGuestCart, items: guestItems } = useCartStore();

  useEffect(() => {
    // Wait for auth to finish loading before tracking transitions
    if (isLoading) return;

    const prevAuth = wasAuthenticated.current;
    wasAuthenticated.current = isAuthenticated;

    // Update store auth state
    setAuthenticated(isAuthenticated);

    // Detect login transition: was not authenticated, now is
    if (prevAuth === false && isAuthenticated && !isMerging.current) {
      isMerging.current = true;
      mergeGuestCartToBackend().finally(() => {
        isMerging.current = false;
      });
    }

    // Detect logout transition: was authenticated, now is not
    if (prevAuth === true && !isAuthenticated) {
      // Clear backend cart reference on logout
      useCartStore.getState().clear();
    }
  }, [isAuthenticated, isLoading]);

  // Keep Zustand store in sync when backend cart data changes
  useEffect(() => {
    if (isAuthenticated && backendCart) {
      setBackendCart(backendCart);
    }
  }, [isAuthenticated, backendCart, setBackendCart]);

  async function mergeGuestCartToBackend() {
    try {
      // Get guest items before clearing
      const itemsToMerge = mergeGuestCart();

      if (itemsToMerge.length === 0) {
        // No guest items to merge, just refresh
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
        return;
      }

      // Fetch the current backend cart to get its ID
      const response = await cartApi.storefrontCart({ pageNum: 1, pageSize: 1 });
      const cart = response.list?.[0]?.row;

      if (!cart) {
        // No active backend cart — create one first, then add items
        const createResponse = await cartApi.create({});
        const newCart = createResponse.mutatedEntity;

        for (const item of itemsToMerge) {
          await cartApi.addItem(newCart.id, {
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          });
        }
      } else {
        // Merge guest items into existing backend cart
        for (const item of itemsToMerge) {
          await cartApi.addItem(cart.id, {
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          });
        }
      }

      // Refresh the cart query so UI picks up merged data
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    } catch (error) {
      console.error('Failed to merge guest cart:', error);
      // Invalidate anyway to get latest backend state
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    }
  }
}
