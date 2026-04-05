import type { RevenueChartData } from '../types';

// ----------------------------------------------------------------
// Adapter: Raw RevenueChartData -> BarChart component props
// ----------------------------------------------------------------

export interface ChartDataPoint {
  label: string;
  value: number;
  target: number;
}

/**
 * Transforms the revenue API response into the shape expected
 * by the BarChart component.
 */
export function adaptRevenue(
  data: RevenueChartData | undefined,
): ChartDataPoint[] {
  if (!data?.data) return [];

  return data.data.map((d) => ({
    label: d.label,
    value: d.revenue,
    target: d.target,
  }));
}
