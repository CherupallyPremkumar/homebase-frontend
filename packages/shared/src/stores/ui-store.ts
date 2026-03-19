'use client';

import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  cartDrawerOpen: boolean;
  mobileMenuOpen: boolean;
  searchOpen: boolean;

  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setCartDrawerOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  closeAll: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  cartDrawerOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  closeAll: () =>
    set({
      cartDrawerOpen: false,
      mobileMenuOpen: false,
      searchOpen: false,
    }),
}));
