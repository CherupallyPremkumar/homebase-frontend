'use client';

import { SectionSkeleton, ErrorSection, formatPriceRupees, formatNumber } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@homebase/ui';
import { IndianRupee, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useFinanceStats } from '../api/queries';
import { StatCard } from './stat-card';
import { RecentSettlements } from './recent-settlements';

const RevenueTrendChart = dynamic(() => import('./revenue-trend-chart'), { ssr: false });
const SettlementStatusChart = dynamic(() => import('./settlement-status-chart'), { ssr: false });

export function DashboardPage() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useFinanceStats();

  if (statsError) return <ErrorSection error={statsError} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Finance Dashboard</h1>

      {/* Stats row */}
      {statsLoading ? (
        <div className="grid gap-4 md:grid-cols-4"><SectionSkeleton rows={4} variant="card" /></div>
      ) : stats ? (
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={formatPriceRupees(stats.totalRevenue)}
            change={stats.revenueChange}
            icon={IndianRupee}
          />
          <StatCard
            title="Pending Settlements"
            value={formatNumber(stats.pendingSettlements)}
            change={stats.pendingSettlementsChange}
            icon={Clock}
            accent="bg-yellow-500"
          />
          <StatCard
            title="Completed Payouts"
            value={formatPriceRupees(stats.completedPayouts)}
            change={stats.completedPayoutsChange}
            icon={CheckCircle}
            accent="bg-green-500"
          />
          <StatCard
            title="Active Disputes"
            value={formatNumber(stats.activeDisputes)}
            change={stats.disputesChange}
            icon={AlertTriangle}
            accent="bg-red-500"
          />
        </div>
      ) : null}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Revenue Trend (30 Days)</CardTitle></CardHeader>
          <CardContent className="h-72">
            <RevenueTrendChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Settlement Status</CardTitle></CardHeader>
          <CardContent className="h-72">
            <SettlementStatusChart />
          </CardContent>
        </Card>
      </div>

      {/* Recent settlements */}
      <RecentSettlements />
    </div>
  );
}
