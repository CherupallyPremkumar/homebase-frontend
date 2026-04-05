import type {
  AnalyticsData,
  CategoryOrderData,
  GeoSegment,
  TopSellerRow,
} from '../types';

// ----------------------------------------------------------------
// Adapter: Raw AnalyticsData -> UI-ready view models
// ----------------------------------------------------------------

export interface CategoryBarView {
  label: string;
  value: number;
  displayValue: string;
  percentOfMax: number;
}

/**
 * Transforms raw category order data into progress-bar-ready items.
 */
export function adaptCategoryBars(categories: CategoryOrderData[]): CategoryBarView[] {
  const maxVal = Math.max(...categories.map((c) => c.value));

  return categories.map((cat) => ({
    label: cat.label,
    value: cat.value,
    displayValue: cat.value.toLocaleString('en-IN'),
    percentOfMax: Math.round((cat.value / maxVal) * 100),
  }));
}

export interface GeoChartSegment {
  label: string;
  value: number;
  color: string;
  displayValue: string;
  percent: number;
}

/**
 * Transforms raw geographic data into donut-chart-ready segments.
 */
export function adaptGeoSegments(segments: GeoSegment[]): GeoChartSegment[] {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return segments.map((seg) => ({
    label: seg.label,
    value: seg.value,
    color: seg.color,
    displayValue: seg.value.toLocaleString('en-IN'),
    percent: Math.round((seg.value / total) * 100),
  }));
}

export interface TopSellerView {
  name: string;
  initials: string;
  gradient: string;
  revenue: string;
  ordersFormatted: string;
  growth: number;
  isPositiveGrowth: boolean;
}

/**
 * Transforms raw seller data into table-ready rows.
 */
export function adaptTopSellers(sellers: TopSellerRow[]): TopSellerView[] {
  return sellers.map((s) => ({
    name: s.name,
    initials: s.initials,
    gradient: s.bg,
    revenue: s.revenue,
    ordersFormatted: s.orders.toLocaleString('en-IN'),
    growth: Math.abs(s.growth),
    isPositiveGrowth: s.growth >= 0,
  }));
}
