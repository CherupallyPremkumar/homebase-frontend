'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@homebase/api-client';
import { SectionSkeleton, ErrorSection, formatNumber } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle, Button, formatPrice } from '@homebase/ui';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const DATE_RANGES = [
  { label: '7 Days', days: 7 },
  { label: '30 Days', days: 30 },
  { label: '90 Days', days: 90 },
] as const;

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export function AnalyticsDashboard() {
  const [rangeDays, setRangeDays] = useState<number>(30);

  const dateFilters = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - rangeDays);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  }, [rangeDays]);

  const searchParams = useMemo(() => ({
    pageNum: 1,
    pageSize: 100,
    filters: dateFilters,
  }), [dateFilters]);

  const {
    data: salesData,
    isLoading: salesLoading,
    error: salesError,
  } = useQuery({
    queryKey: ['analytics-daily-sales', rangeDays],
    queryFn: () => analyticsApi.getDailySales(searchParams),
    select: (data) => data.list?.map((r) => r.row) ?? [],
    staleTime: 60_000,
  });

  const {
    data: productData,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ['analytics-product-performance', rangeDays],
    queryFn: () => analyticsApi.getProductPerformance({ ...searchParams, pageSize: 10 }),
    select: (data) => data.list?.map((r) => r.row) ?? [],
    staleTime: 60_000,
  });

  const {
    data: categoryData,
    isLoading: categoryLoading,
    error: categoryError,
  } = useQuery({
    queryKey: ['analytics-revenue-by-category', rangeDays],
    queryFn: () => analyticsApi.getRevenueByCategory(searchParams),
    select: (data) => data.list?.map((r) => r.row) ?? [],
    staleTime: 60_000,
  });

  const error = salesError || productsError || categoryError;
  if (error) return <ErrorSection error={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="flex gap-2">
          {DATE_RANGES.map((range) => (
            <Button
              key={range.days}
              variant={rangeDays === range.days ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRangeDays(range.days)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Daily Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Sales</CardTitle>
        </CardHeader>
        <CardContent>
          {salesLoading ? (
            <SectionSkeleton rows={1} variant="card" />
          ) : salesData && salesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v: string) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  fontSize={12}
                />
                <YAxis yAxisId="left" tickFormatter={(v: number) => `$${formatNumber(v)}`} fontSize={12} />
                <YAxis yAxisId="right" orientation="right" fontSize={12} />
                <Tooltip
                  formatter={(value: number, name: string) =>
                    name === 'totalRevenue' ? formatPrice(value) : formatNumber(value)
                  }
                  labelFormatter={(label: string) => new Date(label).toLocaleDateString()}
                />
                <Line yAxisId="left" type="monotone" dataKey="totalRevenue" stroke="#3b82f6" strokeWidth={2} name="Revenue" dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="totalOrders" stroke="#10b981" strokeWidth={2} name="Orders" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-8 text-center text-sm text-gray-500">No sales data available for this period.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryLoading ? (
              <SectionSkeleton rows={1} variant="card" />
            ) : categoryData && categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="revenue"
                    nameKey="categoryName"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ categoryName, percentage }: { categoryName: string; percentage: number }) =>
                      `${categoryName} (${percentage.toFixed(1)}%)`
                    }
                    labelLine
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatPrice(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-8 text-center text-sm text-gray-500">No category data available.</p>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <SectionSkeleton rows={5} variant="list" />
            ) : productData && productData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="pb-2 font-medium">Product</th>
                      <th className="pb-2 text-right font-medium">Qty Sold</th>
                      <th className="pb-2 text-right font-medium">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productData.map((product) => (
                      <tr key={product.productId} className="border-b last:border-0">
                        <td className="py-2 font-medium">{product.productName}</td>
                        <td className="py-2 text-right">{formatNumber(product.quantitySold)}</td>
                        <td className="py-2 text-right">{formatPrice(product.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-gray-500">No product performance data available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
