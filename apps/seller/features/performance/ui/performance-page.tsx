'use client';

import { SectionSkeleton, ErrorSection } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@homebase/ui';
import { useSellerPerformance } from '../api/queries';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';

export function PerformancePage() {
  const { data, isLoading, error } = useSellerPerformance();

  if (isLoading) return <SectionSkeleton variant="card" rows={4} />;
  if (error) return <ErrorSection error={error} />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Performance</h1>
        <p className="text-sm text-gray-500">Your seller performance metrics. Keep these healthy to maintain good standing.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Fulfillment Rate" value={`${data.fulfillmentRate}%`} target={95} actual={data.fulfillmentRate} description="Orders fulfilled on time" />
        <MetricCard title="Customer Rating" value={`${data.customerRating.toFixed(1)} ★`} target={4.0} actual={data.customerRating} description="Average product rating" />
        <MetricCard title="Return Rate" value={`${data.returnRate}%`} target={5} actual={data.returnRate} inverse description="Lower is better" />
        <MetricCard title="Response Time" value={`${data.responseTimeHours}h`} target={24} actual={data.responseTimeHours} inverse description="Avg reply to queries" />
      </div>

      <Card>
        <CardHeader><CardTitle>Detailed Metrics</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricRow label="Late Shipment Rate" value={`${data.lateShipmentRate}%`} target="< 4%" ok={data.lateShipmentRate < 4} />
            <MetricRow label="Cancellation Rate" value={`${data.cancellationRate}%`} target="< 2.5%" ok={data.cancellationRate < 2.5} />
            <MetricRow label="Defect Rate" value={`${data.defectRate}%`} target="< 1%" ok={data.defectRate < 1} />
            <MetricRow label="Avg Shipping Days" value={`${data.averageShippingDays} days`} target="< 3 days" ok={data.averageShippingDays < 3} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ title, value, target, actual, inverse = false, description }: {
  title: string; value: string; target: number; actual: number; inverse?: boolean; description: string;
}) {
  const isGood = inverse ? actual <= target : actual >= target;
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-gray-500">{title}</p>
        <p className={cn('mt-1 text-3xl font-bold', isGood ? 'text-green-600' : 'text-red-600')}>{value}</p>
        <p className="mt-1 text-xs text-gray-400">{description}</p>
      </CardContent>
    </Card>
  );
}

function MetricRow({ label, value, target, ok }: { label: string; value: string; target: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-xs text-gray-400">Target: {target}</p>
      </div>
      <span className={cn('text-lg font-bold', ok ? 'text-green-600' : 'text-red-600')}>{value}</span>
    </div>
  );
}
