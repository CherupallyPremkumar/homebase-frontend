'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SectionSkeleton } from '@homebase/shared';
import { useDailyOrders } from '../api/queries';

export function RevenueChart() {
  const { data, isLoading } = useDailyOrders(30);

  if (isLoading) return <SectionSkeleton rows={1} />;
  if (!data?.length) return <p className="text-sm text-gray-500">No data available</p>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(v) => new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `\u20B9${(v / 1000).toFixed(0)}k`} />
        <Tooltip formatter={(value: number) => [`\u20B9${value.toLocaleString('en-IN')}`, 'Revenue']} labelFormatter={(label) => new Date(label).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
        <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default RevenueChart;
