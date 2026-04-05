import type { ProductDetailData } from '../types';

// ----------------------------------------------------------------
// Adapter: Raw ProductDetailData -> UI-ready view models
// ----------------------------------------------------------------

export interface PricingView {
  mrpFormatted: string;
  sellingPriceFormatted: string;
  discountLabel: string;
  savingsFormatted: string;
  stockLabel: string;
  stockColor: string;
}

/**
 * Transforms raw pricing data into display-ready format.
 */
export function adaptPricing(product: ProductDetailData): PricingView {
  const savings = product.mrp - product.sellingPrice;
  const stockColor = product.stock === 0
    ? 'text-red-600'
    : product.stock < 10
      ? 'text-yellow-600'
      : 'text-green-600';

  return {
    mrpFormatted: formatINR(product.mrp),
    sellingPriceFormatted: formatINR(product.sellingPrice),
    discountLabel: `${product.discountPercent}% OFF`,
    savingsFormatted: formatINR(savings),
    stockLabel: product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`,
    stockColor,
  };
}

export interface RatingBreakdownView {
  stars: number;
  percent: number;
  barWidth: string;
}

/**
 * Transforms rating breakdown into chart-ready data.
 */
export function adaptRatingBreakdown(
  breakdown: ProductDetailData['ratingBreakdown'],
): RatingBreakdownView[] {
  return breakdown.map((row) => ({
    stars: row.stars,
    percent: row.percent,
    barWidth: `${row.percent}%`,
  }));
}

export interface ProductMetadataView {
  fields: { label: string; value: string }[];
}

/**
 * Transforms raw product metadata into a flat list of label-value pairs.
 */
export function adaptProductMetadata(product: ProductDetailData): ProductMetadataView {
  return {
    fields: [
      { label: 'Product ID', value: product.productId },
      { label: 'Created', value: product.createdDate },
      { label: 'Last Updated', value: product.lastUpdated },
      { label: 'Views', value: product.views.toLocaleString('en-IN') },
      { label: 'Orders', value: product.orders.toLocaleString('en-IN') },
      { label: 'Returns', value: `${product.returns} (${product.returnRate})` },
      { label: 'GST', value: `${product.gstPercent}%` },
      { label: 'HSN Code', value: product.hsnCode },
      { label: 'Weight', value: product.weight },
      { label: 'Dimensions', value: product.dimensions },
    ],
  };
}

function formatINR(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
