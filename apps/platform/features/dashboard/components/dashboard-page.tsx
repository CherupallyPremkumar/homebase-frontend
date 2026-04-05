'use client';

import { Suspense } from 'react';

import { DateRangeProvider } from '../context/date-range-context';
import { SectionErrorBoundary } from '../../../components/section-error-boundary';

import { DashboardCommandStrip, CommandStripSkeleton } from './dashboard-command-strip';
import { DashboardHeader } from './dashboard-header';
import { DashboardRevenueComparison, RevenueComparisonSkeleton } from './dashboard-revenue-comparison';
import { DashboardKpiGrid, KpiGridSkeleton } from './dashboard-kpi-grid';
import { DashboardPipeline, PipelineSkeleton } from './dashboard-pipeline';
import { DashboardPaymentRegion } from './dashboard-payment-region';
import { DashboardAlerts, AlertsSkeleton } from './dashboard-alerts';
import { DashboardSellerFunnel } from './dashboard-seller-funnel';
import { DashboardCategoryCustomer } from './dashboard-category-customer';
import { DashboardTopProducts, TopProductsSkeleton } from './dashboard-top-products';
import { DashboardActivity, ActivitySkeleton } from './dashboard-activity';
import { DashboardSellers, SellersSkeleton } from './dashboard-sellers';
import { DashboardQuickActions } from './dashboard-quick-actions';

// ----------------------------------------------------------------
// Orchestrator — all 10 dashboard sections + footer
//
// Each section:
//   1. Subscribes to DateRangeContext independently (Observer)
//   2. Fetches its own data via React Query
//   3. Is wrapped in its own ErrorBoundary (per-section isolation)
//   4. Has a Suspense fallback for streaming/lazy scenarios
// ----------------------------------------------------------------

export function DashboardPage() {
  return (
    <DateRangeProvider>
      {/* Section 1: Live Command Strip (sticky, full-bleed) */}
      <SectionErrorBoundary section="Command Strip">
        <Suspense fallback={<CommandStripSkeleton />}>
          <DashboardCommandStrip />
        </Suspense>
      </SectionErrorBoundary>

      {/* Sections 2-10: Normal padded flow */}
      <div className="space-y-6 pb-20">
        {/* Section 2: Header */}
        <SectionErrorBoundary section="Header">
          <DashboardHeader />
        </SectionErrorBoundary>

        {/* Section 3: Revenue Comparison */}
        <SectionErrorBoundary section="Revenue Comparison">
          <Suspense fallback={<RevenueComparisonSkeleton />}>
            <DashboardRevenueComparison />
          </Suspense>
        </SectionErrorBoundary>

        {/* Section 4: KPI Cards (2 rows of 4) */}
        <SectionErrorBoundary section="KPI Cards">
          <Suspense fallback={<KpiGridSkeleton />}>
            <DashboardKpiGrid />
          </Suspense>
        </SectionErrorBoundary>

        {/* Section 5: Order Pipeline */}
        <SectionErrorBoundary section="Order Pipeline">
          <Suspense fallback={<PipelineSkeleton />}>
            <DashboardPipeline />
          </Suspense>
        </SectionErrorBoundary>

        {/* Section 6: Payment Mix + Revenue by Region */}
        <SectionErrorBoundary section="Payment & Region">
          <DashboardPaymentRegion />
        </SectionErrorBoundary>

        {/* Section 7: Smart Alerts Panel */}
        <SectionErrorBoundary section="Alerts">
          <Suspense fallback={<AlertsSkeleton />}>
            <DashboardAlerts />
          </Suspense>
        </SectionErrorBoundary>

        {/* Section 8: Seller Health + Conversion Funnel */}
        <SectionErrorBoundary section="Seller Health & Funnel">
          <DashboardSellerFunnel />
        </SectionErrorBoundary>

        {/* Section 9: Category Performance + Customer Health */}
        <SectionErrorBoundary section="Categories & Customers">
          <DashboardCategoryCustomer />
        </SectionErrorBoundary>

        {/* Section 10: Top Selling Products */}
        <SectionErrorBoundary section="Top Products">
          <Suspense fallback={<TopProductsSkeleton />}>
            <DashboardTopProducts />
          </Suspense>
        </SectionErrorBoundary>

        {/* Section 11: Activity Feed + Top Sellers */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <SectionErrorBoundary section="Recent Activity">
            <Suspense fallback={<ActivitySkeleton />}>
              <DashboardActivity />
            </Suspense>
          </SectionErrorBoundary>
          <SectionErrorBoundary section="Top Sellers">
            <Suspense fallback={<SellersSkeleton />}>
              <DashboardSellers />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      </div>

      {/* Sticky Footer: Quick Actions */}
      <DashboardQuickActions />
    </DateRangeProvider>
  );
}
