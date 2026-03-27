'use client';

import { SectionSkeleton, ErrorSection, formatNumber } from '@homebase/shared';
import { Package, Users, Building2, Star } from 'lucide-react';
import { usePlatformStats } from '../api/queries';
import { StatCard } from './stat-card';
import { PlatformHealth } from './platform-health';
import { RecentActivity } from './recent-activity';

export function DashboardPage() {
  const { data: stats, isLoading: statsLoading, error: statsError } = usePlatformStats();

  if (statsError) return <ErrorSection error={statsError} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Platform Dashboard</h1>

      {statsLoading ? (
        <div className="grid gap-4 md:grid-cols-4">
          <SectionSkeleton rows={4} variant="card" />
        </div>
      ) : stats ? (
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard title="Published Products" value={formatNumber(stats.publishedProducts ?? 0)} icon={Package} />
          <StatCard title="Total Customers" value={formatNumber(stats.totalCustomers ?? 0)} icon={Users} />
          <StatCard title="Active Suppliers" value={formatNumber(stats.activeSuppliers ?? 0)} icon={Building2} />
          <StatCard title="Pending Reviews" value={formatNumber(stats.pendingReviewProducts ?? 0)} icon={Star} />
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <PlatformHealth />
        <RecentActivity />
      </div>
    </div>
  );
}
