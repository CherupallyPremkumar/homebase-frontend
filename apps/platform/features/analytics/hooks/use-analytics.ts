'use client';

import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@homebase/api-client';
import type { DailySales, RevenueByCategory } from '@homebase/api-client';

import type { AnalyticsData, ChartDataPoint, DonutSegment, TopSellerItem } from '../services/mock-data';

// ----------------------------------------------------------------
// Adapters: transform backend SearchResponse → frontend types
// ----------------------------------------------------------------

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function adaptDailySalesToRevenueData(rows: DailySales[]): ChartDataPoint[] {
  const monthMap = new Map<string, number>();
  for (const row of rows) {
    const date = new Date(row.date);
    const label = MONTH_LABELS[date.getMonth()]!;
    monthMap.set(label, (monthMap.get(label) ?? 0) + row.totalRevenue);
  }
  return Array.from(monthMap.entries()).map(([label, value]) => ({ label, value }));
}

function adaptRevenueByCategoryToOrders(rows: RevenueByCategory[]): ChartDataPoint[] {
  return rows.map((row) => ({
    label: row.categoryName,
    value: row.orderCount,
  }));
}

const CATEGORY_COLORS = ['#F97316', '#3B82F6', '#10B981', '#8B5CF6', '#EAB308', '#6B7280'];

function adaptRevenueByCategoryToGeo(rows: RevenueByCategory[]): DonutSegment[] {
  return rows.map((row, i) => ({
    label: row.categoryName,
    value: row.orderCount,
    color: CATEGORY_COLORS[i % CATEGORY_COLORS.length]!,
  }));
}

// ----------------------------------------------------------------
// Analytics Dashboard (all chart data + top sellers)
// ----------------------------------------------------------------

export function useAnalytics(range: string = '30D') {
  return useQuery<AnalyticsData>({
    queryKey: ['analytics', range],
    queryFn: async () => {
      const pageSize = range === '7D' ? 7 : range === '90D' ? 90 : 30;

      const [dailySalesRes, categoryRes] = await Promise.all([
        analyticsApi.getDailySales({ pageNum: 1, pageSize }),
        analyticsApi.getRevenueByCategory({ pageNum: 1, pageSize: 20 }),
      ]);

      const dailySalesRows = dailySalesRes.list?.map((item) => item.row) ?? [];
      const categoryRows = categoryRes.list?.map((item) => item.row) ?? [];

      const revenueData = adaptDailySalesToRevenueData(dailySalesRows);
      const categoryOrders = adaptRevenueByCategoryToOrders(categoryRows);
      const geoSegments = adaptRevenueByCategoryToGeo(categoryRows);

      // Payment segments and top sellers are not available from the analytics API.
      // Return empty arrays — the UI should handle empty gracefully.
      const paymentSegments: DonutSegment[] = [];
      const topSellers: TopSellerItem[] = [];

      return {
        revenueData,
        categoryOrders,
        geoSegments,
        paymentSegments,
        topSellers,
      };
    },
    staleTime: 30_000,
  });
}
