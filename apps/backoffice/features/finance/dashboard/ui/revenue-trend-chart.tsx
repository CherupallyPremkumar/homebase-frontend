'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SectionSkeleton } from '@homebase/shared';
import { useRevenueTrend } from '../api/queries';

const formatCurrency = (value: number) => {
  if (value >= 10_000_000) return `${(value / 10_000_000).toFixed(1)}Cr`;
  if (value >= 100_000) return `${(value / 100_000).toFixed(1)}L`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
};

export function RevenueTrendChart() {
  const { data, isLoading } = useRevenueTrend(30);

  if (isLoading) return <SectionSkeleton rows={1} />;
  if (!data?.length) return <p className="text-sm text-gray-500">No revenue data available</p>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          tickFormatter={(d: string) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
          tick={{ fontSize: 12 }}
        />
        <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value: number, name: string) => [
            name === 'Revenue' ? `Rs. ${value.toLocaleString('en-IN')}` : value,
            name,
          ]}
          labelFormatter={(label: string) =>
            new Date(label).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
          }
        />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2} dot={false} name="Revenue" />
        <Line type="monotone" dataKey="orderCount" stroke="#10b981" strokeWidth={2} dot={false} name="Orders" strokeDasharray="5 5" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default RevenueTrendChart;
