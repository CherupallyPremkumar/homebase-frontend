'use client';

import { create } from 'zustand';

interface ConfigEntry {
  value: string;
  fetchedAt: number;
}

interface ConfigState {
  configs: Record<string, ConfigEntry>;
  setConfig: (key: string, value: string) => void;
  getConfig: (key: string) => string | null;
  isStale: (key: string, ttlMs?: number) => boolean;
  clearAll: () => void;
}

const DEFAULT_TTL = 15 * 60 * 1000; // 15 minutes

export const useConfigStore = create<ConfigState>()((set, get) => ({
  configs: {},

  setConfig: (key, value) =>
    set((state) => ({
      configs: {
        ...state.configs,
        [key]: { value, fetchedAt: Date.now() },
      },
    })),

  getConfig: (key) => {
    const entry = get().configs[key];
    if (!entry) return null;
    if (Date.now() - entry.fetchedAt > DEFAULT_TTL) return null;
    return entry.value;
  },

  isStale: (key, ttlMs = DEFAULT_TTL) => {
    const entry = get().configs[key];
    if (!entry) return true;
    return Date.now() - entry.fetchedAt > ttlMs;
  },

  clearAll: () => set({ configs: {} }),
}));
