/**
 * HomeBase brand colors — used by ALL apps.
 * Apps are distinguished by name/icon in header, NOT by color.
 * Primary: Orange (brand identity, CTAs, buttons)
 * Navy: Dark backgrounds (sidebars, hero sections)
 */
export const colors = {
  // Brand — Orange primary (matching prototype)
  primary: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
    950: '#431407',
    DEFAULT: '#F97316',
  },

  // Navy — dark backgrounds (sidebars, headers, hero)
  navy: {
    700: '#1E3A5F',
    800: '#1A2E4A',
    900: '#0F1B2D',
    DEFAULT: '#0F1B2D',
  },

  // Admin — darker navy for platform admin
  admin: {
    DEFAULT: '#0A1628',
  },

  // Warehouse — dark teal for warehouse app
  warehouse: {
    DEFAULT: '#0F2027',
  },

  // Semantic
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    DEFAULT: '#16a34a',
  },
  warning: {
    50: '#fefce8',
    100: '#fef9c3',
    500: '#eab308',
    600: '#ca8a04',
    DEFAULT: '#eab308',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    DEFAULT: '#dc2626',
  },

  // Neutral — gray scale
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },

  // Fixed
  white: '#ffffff',
  black: '#000000',
} as const;

export type ColorToken = typeof colors;
