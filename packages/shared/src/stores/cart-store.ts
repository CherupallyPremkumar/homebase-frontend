'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Cart } from '@homebase/types';

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  lastSyncedAt: string | null;
  isHydrated: boolean;

  /** Backend cart ID when authenticated — null for guest mode */
  backendCartId: string | null;
  /** Whether the user is currently authenticated */
  isAuthenticated: boolean;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  clear: () => void;
  setItems: (items: CartItem[]) => void;
  setHydrated: (hydrated: boolean) => void;
  syncFromServer: (items: CartItem[], couponCode: string | null) => void;

  /** Sync backend cart data into the store (used after fetch or mutation) */
  setBackendCart: (cart: Cart) => void;
  /** Set the authentication state */
  setAuthenticated: (authenticated: boolean) => void;
  /** Returns guest cart items for server-side merge, then clears guest cart */
  mergeGuestCart: () => CartItem[];

  // Computed
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      lastSyncedAt: null,
      isHydrated: false,
      backendCartId: null,
      isAuthenticated: false,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity, totalPrice: (i.quantity + item.quantity) * i.unitPrice }
                  : i,
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        })),

      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId
              ? { ...i, quantity, totalPrice: quantity * i.unitPrice }
              : i,
          ),
        })),

      applyCoupon: (code) => set({ couponCode: code }),
      removeCoupon: () => set({ couponCode: null }),
      clear: () => set({ items: [], couponCode: null, backendCartId: null }),
      setItems: (items) => set({ items }),
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),

      syncFromServer: (items, couponCode) =>
        set({
          items,
          couponCode,
          lastSyncedAt: new Date().toISOString(),
          isHydrated: true,
        }),

      setBackendCart: (cart: Cart) =>
        set({
          backendCartId: cart.id,
          items: cart.items,
          couponCode: cart.couponCode ?? null,
          lastSyncedAt: new Date().toISOString(),
          isHydrated: true,
        }),

      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),

      mergeGuestCart: () => {
        const { items } = get();
        const guestItems = [...items];
        // Clear guest cart items after extracting them
        set({ items: [], couponCode: null });
        return guestItems;
      },

      itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: () => get().items.reduce((sum, item) => sum + item.totalPrice, 0),
    }),
    {
      name: 'homebase-cart',
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        lastSyncedAt: state.lastSyncedAt,
      }),
    },
  ),
);
