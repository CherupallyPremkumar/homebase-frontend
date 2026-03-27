'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { SectionSkeleton } from '@homebase/shared';
import { useSettlementsByState } from '../api/queries';

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];

export function SettlementStatusChart() {
  const { data, isLoading } = useSettlementsByState();

  if (isLoading) return <SectionSkeleton rows={1} />;
  if (!data?.length) return <p className="text-sm text-gray-500">No settlement data available</p>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="state"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [value, name.replace(/_/g, ' ')]}
        />
        <Legend formatter={(value: string) => value.replace(/_/g, ' ')} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default SettlementStatusChart;
