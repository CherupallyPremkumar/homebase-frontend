import type { TopSeller } from '../types';
import { formatCurrencyCompact, INR_STRATEGY } from '../../../lib/formatters/currency';

// ----------------------------------------------------------------
// Adapter: Raw TopSeller[] -> table row render props
// ----------------------------------------------------------------

/** Gradient palette for seller avatars; cycled by index */
const SELLER_GRADIENTS = [
  'from-orange-400 to-orange-600',
  'from-emerald-400 to-emerald-600',
  'from-blue-400 to-blue-600',
  'from-violet-400 to-violet-600',
  'from-rose-400 to-rose-600',
];

export interface AdaptedSellerRow {
  id: string;
  storeName: string;
  initials: string;
  tier: string;
  gradient: string;
  products: number;
  orders: string;
  revenue: string;
  rating: number;
}

/**
 * Transforms raw seller data into table-ready rows.
 * All formatting (initials, currency, locale numbers) happens here
 * so the component is purely presentational.
 */
export function adaptSellers(
  sellers: TopSeller[] | undefined,
): AdaptedSellerRow[] {
  if (!sellers) return [];

  return sellers.map((seller, idx) => ({
    id: seller.id,
    storeName: seller.storeName,
    initials: seller.storeName
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    tier: seller.tier,
    gradient: SELLER_GRADIENTS[idx % SELLER_GRADIENTS.length],
    products: seller.products,
    orders: seller.orders.toLocaleString('en-IN'),
    revenue: formatCurrencyCompact(seller.revenue, INR_STRATEGY),
    rating: seller.rating,
  }));
}
