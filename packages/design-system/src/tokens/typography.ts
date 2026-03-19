/**
 * Strict typography scale — 5 sizes only.
 * NEVER use arbitrary values like 13px or 17px.
 */
export const typography = {
  fontSize: {
    xs: ['12px', { lineHeight: '16px' }],
    sm: ['14px', { lineHeight: '20px' }],
    base: ['16px', { lineHeight: '24px' }],
    lg: ['18px', { lineHeight: '28px' }],
    xl: ['24px', { lineHeight: '32px' }],
  },

  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  fontFamily: {
    sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
  },
} as const;

/**
 * Semantic typography — use these in components.
 *
 * page-title:   24px bold      (h1 — one per page)
 * section-title: 18px semibold (h2 — section headers)
 * card-title:   14px semibold  (h3 — inside cards)
 * body:         14px normal    (all text)
 * caption:      12px normal    (timestamps, secondary info)
 * badge:        12px medium    (badges, labels)
 * price:        18px bold      (prices — big and clear)
 * price-small:  14px semibold  (prices in cards/tables)
 */
export const textStyles = {
  'page-title': 'text-xl font-bold text-gray-900',
  'section-title': 'text-lg font-semibold text-gray-900',
  'card-title': 'text-sm font-semibold text-gray-900',
  'body': 'text-sm text-gray-700',
  'body-muted': 'text-sm text-gray-500',
  'caption': 'text-xs text-gray-400',
  'badge': 'text-xs font-medium',
  'price': 'text-lg font-bold text-gray-900',
  'price-small': 'text-sm font-semibold text-gray-900',
  'price-original': 'text-xs text-gray-400 line-through',
  'price-discount': 'text-xs font-medium text-success-600',
  'link': 'text-sm font-medium text-primary-600 hover:text-primary-700',
} as const;

export type TextStyle = keyof typeof textStyles;
