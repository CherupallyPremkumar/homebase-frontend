'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@homebase/types';

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  lastSyncedAt: string | null;
  isHydrated: boolean;

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
      clear: () => set({ items: [], couponCode: null }),
      setItems: (items) => set({ items }),
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),

      syncFromServer: (items, couponCode) =>
        set({
          items,
          couponCode,
          lastSyncedAt: new Date().toISOString(),
          isHydrated: true,
        }),

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
