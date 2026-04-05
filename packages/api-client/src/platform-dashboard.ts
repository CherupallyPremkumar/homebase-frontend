import type { SearchRequest, SearchResponse } from '@homebase/types';
import { getApiClient } from './client';

/**
 * Platform Dashboard API — OLAP queries against hm_query.* tables.
 *
 * Data format contract:
 *   - Money: paisa (BIGINT) — divide by 100 for ₹
 *   - Rates: basis points (INT) — divide by 100 for %
 *   - Dates: ISO timestamps
 *   - IDs: UUID strings
 */
export const platformDashboardApi = {
  /** Daily KPI snapshots — GMV, orders, AOV, users, sellers, payment success rate */
  platformKpi(params?: SearchRequest) {
    return getApiClient().post<SearchResponse<Record<string, unknown>>>('/platform-dashboard/platformKpi', params ?? {
      pageNum: 1,
      pageSize: 30,
    });
  },

  /** Live order pipeline — placed/confirmed/packed/shipped/delivered counts + SLA breaches */
  liveOrderPipeline(params?: SearchRequest) {
    return getApiClient().post<SearchResponse<Record<string, unknown>>>('/platform-dashboard/liveOrderPipeline', params ?? {
      pageNum: 1,
      pageSize: 1,
    });
  },

  /** Top selling products today — name, SKU, units sold, revenue, rating, stock status */
  topProductsToday(params?: SearchRequest) {
    return getApiClient().post<SearchResponse<Record<string, unknown>>>('/platform-dashboard/topProductsToday', params ?? {
      pageNum: 1,
      pageSize: 10,
    });
  },

  /** Top sellers today — store name, tier, GMV, fulfillment rate, rating */
  topSellersToday(params?: SearchRequest) {
    return getApiClient().post<SearchResponse<Record<string, unknown>>>('/platform-dashboard/topSellersToday', params ?? {
      pageNum: 1,
      pageSize: 5,
    });
  },

  /** Category performance — GMV, units, return rate per category per day */
  categoryPerformance(params?: SearchRequest) {
    return getApiClient().post<SearchResponse<Record<string, unknown>>>('/platform-dashboard/categoryPerformance', params ?? {
      pageNum: 1,
      pageSize: 50,
    });
  },

  /** Seller health summary — healthy/at-risk/unhealthy counts per day */
  sellerHealthSummary(params?: SearchRequest) {
    return getApiClient().post<SearchResponse<Record<string, unknown>>>('/platform-dashboard/sellerHealthSummary', params ?? {
      pageNum: 1,
      pageSize: 7,
    });
  },

  /** Conversion funnel — sessions/views/cart/checkout/purchase per day */
  conversionFunnel(params?: SearchRequest) {
    return getApiClient().post<SearchResponse<Record<string, unknown>>>('/platform-dashboard/conversionFunnel', params ?? {
      pageNum: 1,
      pageSize: 7,
    });
  },

  /** Revenue by region — state-wise GMV, orders, growth per day */
  revenueByRegion(params?: SearchRequest) {
    return getApiClient().post<SearchResponse<Record<string, unknown>>>('/platform-dashboard/revenueByRegion', params ?? {
      pageNum: 1,
      pageSize: 50,
    });
  },

  /** Platform alerts — P0/P1/P2 severity, active/acknowledged status */
  platformAlerts(params?: SearchRequest) {
    return getApiClient().post<SearchResponse<Record<string, unknown>>>('/platform-dashboard/platformAlerts', params ?? {
      pageNum: 1,
      pageSize: 20,
      filters: { is_active: true },
    });
  },

  /** Customer health — cohort retention, NPS, DAU/MAU, LTV */
  customerHealth(params?: SearchRequest) {
    return getApiClient().post<SearchResponse<Record<string, unknown>>>('/platform-dashboard/customerHealth', params ?? {
      pageNum: 1,
      pageSize: 10,
    });
  },
};
