'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi, suppliersApi, platformDashboardApi } from '@homebase/api-client';

import type {
  DateRange,
  MockDashboardStats as DashboardStatsType,
  RevenueChartData,
  ActivityItem,
  TopSeller,
  HealthMetrics,
  CommandStripData,
  RevenueComparison,
  KpiCard,
  PipelineMetrics,
  PaymentMixData,
  RegionPanelData,
  PlatformAlert,
  SellerHealthData,
  FunnelStage,
  CategoryPerformance,
  CustomerHealthData,
  TopProduct,
} from '../types';
import {
  adaptOverviewStats,
  adaptDailyOrderStatsToRevenue,
  adaptRecentOrdersToActivity,
  adaptSuppliersToTopSellers,
} from '../adapters';
import {
  mockCommandStrip,
  mockRevenueComparison,
  mockKpiCards,
  mockPipeline,
  mockPaymentMix,
  mockRegions,
  mockAlerts,
  mockSellerHealth,
  mockFunnel,
  mockCategories,
  mockCustomerHealth,
  mockTopProducts,
} from '../services/mock-data';
import {
  adaptKpiToCommandStrip,
  adaptKpiToRevenueComparison,
  adaptKpiToKpiCards,
  adaptPipeline,
  adaptPaymentMix,
  adaptRegionToPanel,
  adaptSellerHealth,
  adaptFunnel,
  adaptCategoryPerformance,
  adaptTopProducts,
  adaptAlerts,
  adaptCustomerHealth,
} from '../services/platform-dashboard-adapter';

// ----------------------------------------------------------------
// Helper: wrap mock data in a resolved promise for React Query
// ----------------------------------------------------------------

function mockFn<T>(data: T) {
  return async () => data;
}

// ================================================================
// EXISTING HOOKS (preserved)
// ================================================================

export function useDashboardStats(dateRange: DateRange) {
  return useQuery<DashboardStatsType>({
    queryKey: ['dashboard-stats', dateRange],
    queryFn: async () => {
      const response = await dashboardApi.overviewStats({
        pageNum: 1,
        pageSize: 1,
        filters: { dateFrom: dateRange.from, dateTo: dateRange.to },
      });
      return adaptOverviewStats(response);
    },
    staleTime: 30_000,
  });
}

export function useDashboardRevenue(dateRange: DateRange) {
  return useQuery<RevenueChartData>({
    queryKey: ['dashboard-revenue', dateRange],
    queryFn: async () => {
      const response = await dashboardApi.dailyOrderStats({
        pageNum: 1,
        pageSize: 365,
        filters: { dateFrom: dateRange.from, dateTo: dateRange.to },
      });
      return adaptDailyOrderStatsToRevenue(response);
    },
    staleTime: 60_000,
  });
}

export function useDashboardActivity() {
  return useQuery<ActivityItem[]>({
    queryKey: ['dashboard-activity'],
    queryFn: async () => {
      const response = await dashboardApi.recentOrders({
        pageNum: 1,
        pageSize: 6,
      });
      return adaptRecentOrdersToActivity(response);
    },
    staleTime: 15_000,
  });
}

export function useDashboardTopSellers() {
  return useQuery<TopSeller[]>({
    queryKey: ['dashboard-sellers'],
    queryFn: async () => {
      const response = await suppliersApi.search({
        pageNum: 1,
        pageSize: 5,
        sortCriteria: [{ field: 'rating', order: 'DESC' }],
      });
      return adaptSuppliersToTopSellers(response);
    },
    staleTime: 60_000,
  });
}

export function useDashboardHealth() {
  return useQuery<HealthMetrics>({
    queryKey: ['dashboard-health'],
    queryFn: async (): Promise<HealthMetrics> => {
      const res = await fetch('/api/proxy/actuator/health').catch(() => null);
      const isUp = res?.ok ? ((await res.json().catch(() => null))?.status === 'UP') : false;
      return {
        serverUptime: { value: isUp ? 99.9 : 0, unit: '%', status: isUp ? 'Healthy' : 'Down', lastDowntime: 'N/A', lastDowntimeDuration: 0 },
        apiResponse: { value: 0, unit: 'ms', percentile: 'p95', target: 200, status: 'Healthy' },
        activeSessions: { value: 0, capacity: 0, breakdown: { buyers: 0, sellers: 0, admin: 0 } },
        lastUpdated: new Date().toISOString(),
      };
    },
    staleTime: 10_000,
    refetchInterval: 30_000,
  });
}

// ================================================================
// NEW HOOKS — real API with mock fallback
// ================================================================

export function useDashboardCommandStrip() {
  return useQuery<CommandStripData>({
    queryKey: ['dashboard-command-strip'],
    queryFn: async () => {
      try {
        const res = await platformDashboardApi.platformKpi({ pageNum: 1, pageSize: 1 });
        return adaptKpiToCommandStrip(res);
      } catch {
        return mockCommandStrip;
      }
    },
    staleTime: 10_000,
  });
}

export function useDashboardRevenueComparison() {
  return useQuery<RevenueComparison>({
    queryKey: ['dashboard-revenue-comparison'],
    queryFn: async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const [todayRes] = await Promise.all([
          platformDashboardApi.platformKpi({ pageNum: 1, pageSize: 1, filters: { date: today } }),
        ]);
        const todayRow = todayRes.list?.[0]?.row ?? {};
        return adaptKpiToRevenueComparison(todayRow, todayRow, todayRow, todayRow);
      } catch {
        return mockRevenueComparison;
      }
    },
    staleTime: 30_000,
  });
}

export function useDashboardKpis() {
  return useQuery<KpiCard[]>({
    queryKey: ['dashboard-kpis'],
    queryFn: async () => {
      try {
        const res = await platformDashboardApi.platformKpi({ pageNum: 1, pageSize: 1 });
        return adaptKpiToKpiCards(res);
      } catch {
        return mockKpiCards;
      }
    },
    staleTime: 30_000,
  });
}

export function useDashboardPipeline() {
  return useQuery<PipelineMetrics>({
    queryKey: ['dashboard-pipeline'],
    queryFn: async () => {
      try {
        const res = await platformDashboardApi.liveOrderPipeline({ pageNum: 1, pageSize: 1 });
        return adaptPipeline(res);
      } catch {
        return mockPipeline;
      }
    },
    staleTime: 15_000,
  });
}

export function useDashboardPaymentMix() {
  return useQuery<PaymentMixData>({
    queryKey: ['dashboard-payment-mix'],
    queryFn: async () => {
      try {
        const res = await platformDashboardApi.platformKpi({ pageNum: 1, pageSize: 1 });
        return adaptPaymentMix(res);
      } catch {
        return mockPaymentMix;
      }
    },
    staleTime: 60_000,
  });
}

export function useDashboardRegions() {
  return useQuery<RegionPanelData>({
    queryKey: ['dashboard-regions'],
    queryFn: async () => {
      try {
        const res = await platformDashboardApi.revenueByRegion({ pageNum: 1, pageSize: 50 });
        return adaptRegionToPanel(res);
      } catch {
        return mockRegions;
      }
    },
    staleTime: 60_000,
  });
}

export function useDashboardAlerts() {
  return useQuery<PlatformAlert[]>({
    queryKey: ['dashboard-alerts'],
    queryFn: async () => {
      try {
        const res = await platformDashboardApi.platformAlerts({ pageNum: 1, pageSize: 20, filters: { is_active: true } });
        return adaptAlerts(res);
      } catch {
        return mockAlerts;
      }
    },
    staleTime: 30_000,
  });
}

export function useDashboardSellerHealth() {
  return useQuery<SellerHealthData>({
    queryKey: ['dashboard-seller-health'],
    queryFn: async () => {
      try {
        const res = await platformDashboardApi.sellerHealthSummary({ pageNum: 1, pageSize: 1 });
        return adaptSellerHealth(res);
      } catch {
        return mockSellerHealth;
      }
    },
    staleTime: 60_000,
  });
}

export function useDashboardFunnel() {
  return useQuery<FunnelStage[]>({
    queryKey: ['dashboard-funnel'],
    queryFn: async () => {
      try {
        const res = await platformDashboardApi.conversionFunnel({ pageNum: 1, pageSize: 1 });
        return adaptFunnel(res);
      } catch {
        return mockFunnel;
      }
    },
    staleTime: 30_000,
  });
}

export function useDashboardCategories() {
  return useQuery<CategoryPerformance[]>({
    queryKey: ['dashboard-categories'],
    queryFn: async () => {
      try {
        const res = await platformDashboardApi.categoryPerformance({ pageNum: 1, pageSize: 50 });
        return adaptCategoryPerformance(res);
      } catch {
        return mockCategories;
      }
    },
    staleTime: 60_000,
  });
}

export function useDashboardCustomerHealth() {
  return useQuery<CustomerHealthData>({
    queryKey: ['dashboard-customer-health'],
    queryFn: async () => {
      try {
        const res = await platformDashboardApi.customerHealth({ pageNum: 1, pageSize: 1 });
        return adaptCustomerHealth(res);
      } catch {
        return mockCustomerHealth;
      }
    },
    staleTime: 60_000,
  });
}

export function useDashboardTopProducts() {
  return useQuery<TopProduct[]>({
    queryKey: ['dashboard-top-products'],
    queryFn: async () => {
      try {
        const res = await platformDashboardApi.topProductsToday({ pageNum: 1, pageSize: 10 });
        return adaptTopProducts(res);
      } catch {
        return mockTopProducts;
      }
    },
    staleTime: 30_000,
  });
}
