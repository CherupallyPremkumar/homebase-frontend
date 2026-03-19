export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const TIMEOUTS = {
  default: 5000,
  search: 15000,
  checkout: 30000,
  debounce: 300,
  throttle: 1000,
  quantityDebounce: 500,
} as const;

export const PAGINATION = {
  defaultPage: 1,
  defaultSize: 20,
  sizes: [10, 20, 50, 100],
} as const;

export const CACHE_TIMES = {
  productList: { staleTime: 60_000, gcTime: 300_000 },
  productDetail: { staleTime: 300_000, gcTime: 600_000 },
  categoryMenu: { staleTime: 600_000, gcTime: 1_800_000 },
  banners: { staleTime: 300_000, gcTime: 900_000 },
  cart: { staleTime: 0, gcTime: 300_000 },
  orderList: { staleTime: 30_000, gcTime: 300_000 },
  orderDetail: { staleTime: 10_000, gcTime: 120_000 },
  userProfile: { staleTime: 120_000, gcTime: 600_000 },
  cconfig: { staleTime: 900_000, gcTime: 3_600_000 },
  dashboard: { staleTime: 30_000, gcTime: 120_000 },
  search: { staleTime: 0, gcTime: 60_000 },
} as const;

export const CURRENCY = {
  code: 'INR',
  symbol: '\u20B9',
  locale: 'en-IN',
} as const;

export const FREE_SHIPPING_THRESHOLD = 499;

export const MAX_CART_QUANTITY = 10;

export const RECENTLY_VIEWED_MAX = 20;
