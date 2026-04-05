import type {
  OrderDetail,
  OrderItem,
  OrderTimelineStep,
  OrderPriceSummary,
  OrderFinancials,
} from '../types';

// ----------------------------------------------------------------
// Adapter: Raw OrderDetail -> UI-ready view models
// ----------------------------------------------------------------

export interface TimelineStepView {
  label: string;
  date: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

/**
 * Transforms raw timeline steps into a flat shape for rendering.
 */
export function adaptTimeline(steps: OrderTimelineStep[]): TimelineStepView[] {
  return steps.map((step) => ({
    label: step.label,
    date: step.date ?? '--',
    isCompleted: step.status === 'completed',
    isCurrent: step.status === 'current',
  }));
}

export interface OrderItemView {
  id: string;
  name: string;
  sku: string;
  emoji: string;
  qty: number;
  unitPriceFormatted: string;
  totalPriceFormatted: string;
  variantSummary: string;
}

/**
 * Transforms raw order items into display-ready rows.
 * All currency formatting happens here.
 */
export function adaptOrderItems(items: OrderItem[]): OrderItemView[] {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    sku: item.sku,
    emoji: item.emoji,
    qty: item.qty,
    unitPriceFormatted: formatINR(item.unitPrice),
    totalPriceFormatted: formatINR(item.totalPrice),
    variantSummary: item.variants.map((v) => `${v.label}: ${v.value}`).join(', '),
  }));
}

export interface PriceSummaryView {
  subtotal: string;
  itemCount: number;
  shipping: string;
  discountLabel: string | null;
  discount: string;
  gstLabel: string;
  gst: string;
  total: string;
}

/**
 * Transforms raw price summary into formatted strings for display.
 */
export function adaptPriceSummary(summary: OrderPriceSummary): PriceSummaryView {
  return {
    subtotal: formatINR(summary.subtotal),
    itemCount: summary.itemCount,
    shipping: summary.shipping === 0 ? summary.shippingLabel : formatINR(summary.shipping),
    discountLabel: summary.discountCode ? `Coupon: ${summary.discountCode}` : null,
    discount: summary.discount > 0 ? `-${formatINR(summary.discount)}` : formatINR(0),
    gstLabel: `GST (${summary.gstPercent}%)`,
    gst: formatINR(summary.gst),
    total: formatINR(summary.total),
  };
}

export interface FinancialsView {
  orderValue: string;
  platformFeeLabel: string;
  platformFee: string;
  gatewayFeeLabel: string;
  gatewayFee: string;
  gstOnFees: string;
  sellerPayout: string;
  settlementRef: string;
}

/**
 * Transforms raw financials into formatted breakdown for admin view.
 */
export function adaptFinancials(fin: OrderFinancials): FinancialsView {
  return {
    orderValue: formatINR(fin.orderValue),
    platformFeeLabel: `Platform Fee (${fin.platformFeePercent}%)`,
    platformFee: `-${formatINR(fin.platformFee)}`,
    gatewayFeeLabel: `Gateway Fee (${fin.gatewayFeePercent}%)`,
    gatewayFee: `-${formatINR(fin.gatewayFee)}`,
    gstOnFees: `-${formatINR(fin.gstOnFees)}`,
    sellerPayout: formatINR(fin.sellerPayout),
    settlementRef: fin.settlementRef,
  };
}

/** Format a paise/smallest-unit value as INR string */
function formatINR(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
