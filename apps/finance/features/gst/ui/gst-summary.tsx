'use client';

import { SectionSkeleton, ErrorSection, formatPriceRupees } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@homebase/ui';
import { useGstSummary } from '../api/queries';
import type { GstSummary } from '../model/types';

const FILING_STATUS_COLORS: Record<string, string> = {
  FILED: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  OVERDUE: 'bg-red-100 text-red-800',
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatMonth(month: string): string {
  const monthNum = parseInt(month, 10);
  if (monthNum >= 1 && monthNum <= 12) return MONTH_NAMES[monthNum - 1];
  return month;
}

export function GstSummaryPage() {
  const { data, isLoading, error, refetch } = useGstSummary();

  if (isLoading) return <SectionSkeleton rows={6} />;
  if (error) return <ErrorSection error={error} onRetry={() => refetch()} />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">GST Reports</h1>

      {/* Totals */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">Taxable Amount</p>
            <p className="mt-1 text-lg font-bold">{formatPriceRupees(data.totalTaxableAmount)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">CGST</p>
            <p className="mt-1 text-lg font-bold">{formatPriceRupees(data.totalCgst)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">SGST</p>
            <p className="mt-1 text-lg font-bold">{formatPriceRupees(data.totalSgst)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">IGST</p>
            <p className="mt-1 text-lg font-bold">{formatPriceRupees(data.totalIgst)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">Total GST</p>
            <p className="mt-1 text-lg font-bold text-primary">{formatPriceRupees(data.totalGst)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">TCS</p>
            <p className="mt-1 text-lg font-bold">{formatPriceRupees(data.totalTcs)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader><CardTitle>Monthly GST Breakdown</CardTitle></CardHeader>
        <CardContent>
          {data.summaries?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-2 font-medium">Month</th>
                    <th className="pb-2 text-right font-medium">Taxable Amount</th>
                    <th className="pb-2 text-right font-medium">CGST</th>
                    <th className="pb-2 text-right font-medium">SGST</th>
                    <th className="pb-2 text-right font-medium">IGST</th>
                    <th className="pb-2 text-right font-medium">Total GST</th>
                    <th className="pb-2 text-right font-medium">TCS</th>
                    <th className="pb-2 font-medium">Filing Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.summaries.map((row: GstSummary) => (
                    <tr key={`${row.year}-${row.month}`} className="border-b last:border-0">
                      <td className="py-3 font-medium">{formatMonth(row.month)} {row.year}</td>
                      <td className="py-3 text-right">{formatPriceRupees(row.totalTaxableAmount)}</td>
                      <td className="py-3 text-right">{formatPriceRupees(row.cgst)}</td>
                      <td className="py-3 text-right">{formatPriceRupees(row.sgst)}</td>
                      <td className="py-3 text-right">{formatPriceRupees(row.igst)}</td>
                      <td className="py-3 text-right font-medium">{formatPriceRupees(row.totalGst)}</td>
                      <td className="py-3 text-right">{formatPriceRupees(row.tcs)}</td>
                      <td className="py-3">
                        <Badge variant="outline" className={FILING_STATUS_COLORS[row.filingStatus] || ''}>
                          {row.filingStatus}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No GST data available for this year</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
