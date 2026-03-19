'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@homebase/api-client';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { SectionSkeleton, CACHE_TIMES } from '@homebase/shared';

const COLORS = ['#2563eb', '#16a34a', '#eab308', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#6b7280'];

export default function OrdersDonut() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-orders-by-state'],
    queryFn: () => dashboardApi.ordersByState(),
    ...CACHE_TIMES.dashboard,
  });

  if (isLoading) return <SectionSkeleton rows={1} />;
  if (!data?.length) return <p className="text-sm text-gray-500">No data available</p>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="state" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number, name: string) => [value, name.replace(/_/g, ' ')]} />
        <Legend formatter={(value: string) => value.replace(/_/g, ' ')} />
      </PieChart>
    </ResponsiveContainer>
  );
}
