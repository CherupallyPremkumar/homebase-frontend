'use client';

import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';
import type { SearchResponse } from '@homebase/types';

import type { SegmentsData, CustomerSegment } from '../services/segments-mock';

// ----------------------------------------------------------------
// Adapters: transform backend SearchResponse → frontend types
// ----------------------------------------------------------------

const SEGMENT_COLORS: Array<{ bg: string; color: string }> = [
  { bg: 'bg-blue-100', color: 'text-blue-600' },
  { bg: 'bg-green-100', color: 'text-green-600' },
  { bg: 'bg-yellow-100', color: 'text-yellow-600' },
  { bg: 'bg-red-100', color: 'text-red-600' },
  { bg: 'bg-gray-100', color: 'text-gray-500' },
  { bg: 'bg-purple-100', color: 'text-purple-600' },
  { bg: 'bg-indigo-100', color: 'text-indigo-600' },
  { bg: 'bg-teal-100', color: 'text-teal-600' },
];

interface SegmentRow {
  id: string;
  name: string;
  description?: string;
  customerCount?: number;
  avgOrderValue?: number;
  totalRevenue?: number;
  growth?: number;
  status?: string;
}

function formatCurrency(value: number): string {
  if (value >= 10_000_000) return `Rs.${(value / 10_000_000).toFixed(2)}Cr`;
  if (value >= 100_000) return `Rs.${(value / 100_000).toFixed(1)}L`;
  if (value >= 1_000) return `Rs.${value.toLocaleString('en-IN')}`;
  return `Rs.${value}`;
}

function adaptSegments(response: SearchResponse<SegmentRow>): CustomerSegment[] {
  return (response.list ?? []).map((item, i) => {
    const row = item.row;
    const colors = SEGMENT_COLORS[i % SEGMENT_COLORS.length]!;
    return {
      id: row.id,
      name: row.name,
      description: row.description ?? '',
      customerCount: row.customerCount ?? 0,
      avgOrderValue: formatCurrency(row.avgOrderValue ?? 0),
      totalRevenue: formatCurrency(row.totalRevenue ?? 0),
      growth: row.growth ?? 0,
      status: (row.status === 'active' || row.status === 'draft' ? row.status : 'active') as 'active' | 'draft',
      iconBg: colors.bg,
      iconColor: colors.color,
    };
  });
}

// ----------------------------------------------------------------
// Customer Segments hook
// ----------------------------------------------------------------

export function useSegments() {
  return useQuery<SegmentsData>({
    queryKey: ['customer-segments'],
    queryFn: async () => {
      const response = await getApiClient().post<SearchResponse<SegmentRow>>(
        '/analytics/Analytics.getCustomerSegments',
        { pageNum: 1, pageSize: 20 },
      );
      return { segments: adaptSegments(response) };
    },
    staleTime: 30_000,
  });
}
