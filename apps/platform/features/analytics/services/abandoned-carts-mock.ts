/**
 * Mock data for Abandoned Carts analytics.
 *
 * Each export matches the shape returned by the real API contract.
 * When the backend endpoints are ready, swap the mock imports in
 * the hook for real fetch calls -- no component changes needed.
 */

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export type CartLikelihood = 'high' | 'medium' | 'low';
export type CartStatus = 'abandoned' | 'recovered' | 'expired';

export interface AbandonedCartStats {
  totalAbandoned: number;
  totalAbandonedTrendText: string;
  recoveryRate: string;
  recoveryRateTrendText: string;
  revenueLost: string;
  revenueLostSubText: string;
  revenueRecovered: string;
  revenueRecoveredSubText: string;
}

export interface RecoveryTier {
  id: CartLikelihood;
  label: string;
  subtitle: string;
  carts: number;
  value: string;
  recommendedTitle: string;
  recommendedDescription: string;
  expectedRecoveryAlert: string;
}

export interface AbandonedCartEntry {
  id: string;
  customerName: string;
  items: string;
  cartValue: string;
  abandoned: string;
  recoveryEmailSent: boolean;
  likelihood: CartLikelihood;
  status: CartStatus;
}

export interface AbandonedProduct {
  id: string;
  rank: number;
  name: string;
  category: string;
  price: string;
  cartCount: number;
  cartCountPercent: number;
  avgTimeBeforeAbandon: string;
  abandonRate: number;
}

export interface AbandonedProductCard {
  id: string;
  name: string;
  abandonedCount: number;
  abandonedPercent: number;
}

export interface AbandonedCartsData {
  stats: AbandonedCartStats;
  tiers: RecoveryTier[];
  carts: AbandonedCartEntry[];
  topProducts: AbandonedProduct[];
  productCards: AbandonedProductCard[];
  totalCartsInTier: {
    high: number;
    highPercent: number;
    medium: number;
    mediumPercent: number;
    low: number;
    lowPercent: number;
  };
}

// ----------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------

export const mockAbandonedCartStats: AbandonedCartStats = {
  totalAbandoned: 1245,
  totalAbandonedTrendText: '+142 from last 30 days',
  recoveryRate: '18.4%',
  recoveryRateTrendText: '+3.1% vs last month',
  revenueLost: '\u20B948.2L',
  revenueLostSubText: '\u20B91.6L/day average',
  revenueRecovered: '\u20B98.9L',
  revenueRecoveredSubText: '229 carts recovered',
};

export const mockRecoveryTiers: RecoveryTier[] = [
  {
    id: 'high',
    label: 'High Likelihood',
    subtitle: 'Abandoned < 2 hours ago',
    carts: 320,
    value: '\u20B912.8L',
    recommendedTitle: 'Recommended Action',
    recommendedDescription: 'Send 10% coupon code with 24-hour expiry. Expected recovery: 45%',
    expectedRecoveryAlert: 'Recovery campaign launched for 320 high-likelihood carts.\n\nStrategy: 10% discount coupon\nExpiry: 24 hours\nExpected recovery: ~144 carts (\u20B95.76L)',
  },
  {
    id: 'medium',
    label: 'Medium Likelihood',
    subtitle: 'Abandoned 2-24 hours ago',
    carts: 580,
    value: '\u20B922.1L',
    recommendedTitle: 'Recommended Action',
    recommendedDescription: 'Send cart reminder email with product images. Expected recovery: 18%',
    expectedRecoveryAlert: 'Recovery campaign launched for 580 medium-likelihood carts.\n\nStrategy: Cart reminder email with product images\nExpected recovery: ~104 carts (\u20B93.98L)',
  },
  {
    id: 'low',
    label: 'Low Likelihood',
    subtitle: 'Abandoned 24-72 hours ago',
    carts: 345,
    value: '\u20B913.3L',
    recommendedTitle: 'Recommended Action',
    recommendedDescription: 'Send last-chance email with urgency messaging. Expected recovery: 6%',
    expectedRecoveryAlert: 'Recovery campaign launched for 345 low-likelihood carts.\n\nStrategy: Last-chance urgency email\nExpected recovery: ~21 carts (\u20B90.80L)',
  },
];

export const mockAbandonedCarts: AbandonedCartEntry[] = [
  { id: 'ac-1', customerName: 'Priya Sharma', items: '3 items', cartValue: '\u20B98,450', abandoned: '2 hrs ago', recoveryEmailSent: true, likelihood: 'high', status: 'abandoned' },
  { id: 'ac-2', customerName: 'Rahul Verma', items: '1 item', cartValue: '\u20B912,999', abandoned: '3 hrs ago', recoveryEmailSent: false, likelihood: 'medium', status: 'abandoned' },
  { id: 'ac-3', customerName: 'Anita Desai', items: '5 items', cartValue: '\u20B93,200', abandoned: '5 hrs ago', recoveryEmailSent: true, likelihood: 'medium', status: 'recovered' },
  { id: 'ac-4', customerName: 'Vikram Patel', items: '2 items', cartValue: '\u20B922,500', abandoned: '6 hrs ago', recoveryEmailSent: true, likelihood: 'medium', status: 'abandoned' },
  { id: 'ac-5', customerName: 'Meera Krishnan', items: '4 items', cartValue: '\u20B96,780', abandoned: '8 hrs ago', recoveryEmailSent: false, likelihood: 'medium', status: 'expired' },
  { id: 'ac-6', customerName: 'Suresh Reddy', items: '1 item', cartValue: '\u20B945,000', abandoned: '1 hr ago', recoveryEmailSent: false, likelihood: 'high', status: 'abandoned' },
  { id: 'ac-7', customerName: 'Deepa Nair', items: '2 items', cartValue: '\u20B91,890', abandoned: '4 hrs ago', recoveryEmailSent: true, likelihood: 'medium', status: 'recovered' },
  { id: 'ac-8', customerName: 'Amit Gupta', items: '6 items', cartValue: '\u20B915,340', abandoned: '30 min ago', recoveryEmailSent: false, likelihood: 'high', status: 'abandoned' },
];

export const mockTopProducts: AbandonedProduct[] = [
  { id: 'tp-1', rank: 1, name: 'Wireless Bluetooth Earbuds', category: 'Electronics', price: '\u20B92,499', cartCount: 142, cartCountPercent: 100, avgTimeBeforeAbandon: '8 min 12s', abandonRate: 68 },
  { id: 'tp-2', rank: 2, name: 'Premium LED Panel Light', category: 'Home & Lighting', price: '\u20B94,299', cartCount: 118, cartCountPercent: 83, avgTimeBeforeAbandon: '12 min 45s', abandonRate: 54 },
  { id: 'tp-3', rank: 3, name: 'Organic Cotton T-Shirt', category: 'Fashion', price: '\u20B9899', cartCount: 96, cartCountPercent: 68, avgTimeBeforeAbandon: '4 min 30s', abandonRate: 42 },
  { id: 'tp-4', rank: 4, name: 'Smart Home Hub', category: 'Smart Home', price: '\u20B98,999', cartCount: 84, cartCountPercent: 59, avgTimeBeforeAbandon: '18 min 05s', abandonRate: 38 },
  { id: 'tp-5', rank: 5, name: 'Tempered Glass Screen Guard', category: 'Accessories', price: '\u20B9349', cartCount: 71, cartCountPercent: 50, avgTimeBeforeAbandon: '2 min 18s', abandonRate: 28 },
];

export const mockProductCards: AbandonedProductCard[] = [
  { id: 'pc-1', name: 'Wireless Bluetooth Earbuds', abandonedCount: 28, abandonedPercent: 85 },
  { id: 'pc-2', name: 'Premium LED Panel Light', abandonedCount: 22, abandonedPercent: 68 },
  { id: 'pc-3', name: 'Organic Cotton T-Shirt', abandonedCount: 18, abandonedPercent: 55 },
  { id: 'pc-4', name: 'Smart Home Hub', abandonedCount: 14, abandonedPercent: 42 },
];

export const mockAbandonedCartsData: AbandonedCartsData = {
  stats: mockAbandonedCartStats,
  tiers: mockRecoveryTiers,
  carts: mockAbandonedCarts,
  topProducts: mockTopProducts,
  productCards: mockProductCards,
  totalCartsInTier: {
    high: 320,
    highPercent: 25.7,
    medium: 580,
    mediumPercent: 46.6,
    low: 345,
    lowPercent: 27.7,
  },
};
