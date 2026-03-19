'use client';

import { EntityDetailLayout, SectionSkeleton, ErrorSection, formatPriceRupees, formatDate, formatNumber } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@homebase/ui';
import { useReconciliationDetail, useReconciliationMismatches, useReconciliationMutation } from '../api/queries';

interface ReconciliationDetailProps {
  id: string;
}

const MISMATCH_TYPE_LABELS: Record<string, string> = {
  MISSING_IN_SYSTEM: 'Missing in System',
  MISSING_IN_GATEWAY: 'Missing in Gateway',
  AMOUNT_MISMATCH: 'Amount Mismatch',
  STATUS_MISMATCH: 'Status Mismatch',
};

const MISMATCH_TYPE_COLORS: Record<string, string> = {
  MISSING_IN_SYSTEM: 'bg-red-100 text-red-800',
  MISSING_IN_GATEWAY: 'bg-orange-100 text-orange-800',
  AMOUNT_MISMATCH: 'bg-yellow-100 text-yellow-800',
  STATUS_MISMATCH: 'bg-purple-100 text-purple-800',
};

export function ReconciliationDetail({ id }: ReconciliationDetailProps) {
  const { data, isLoading, error, refetch } = useReconciliationDetail(id);
  const { data: mismatches, isLoading: mismatchesLoading } = useReconciliationMismatches(id);
  const mutation = useReconciliationMutation();

  if (isLoading) return <SectionSkeleton rows={6} />;
  if (error) return <ErrorSection error={error} onRetry={() => refetch()} />;
  if (!data) return null;

  const batch = data.mutatedEntity;
  const matchRate = batch.totalTransactions > 0
    ? ((batch.matchedCount / batch.totalTransactions) * 100).toFixed(1)
    : '0';

  return (
    <EntityDetailLayout
      breadcrumbs={[
        { label: 'Reconciliation', href: '/reconciliation' },
        { label: `${formatDate(batch.batchDate)} - ${batch.gatewayName}` },
      ]}
      title={`Reconciliation: ${batch.gatewayName}`}
      subtitle={formatDate(batch.batchDate)}
      state={batch.stateId}
      allowedActions={data.allowedActionsAndMetadata}
      onAction={(eventId) => mutation.mutate({ id, eventId })}
      actionLoading={mutation.isPending}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Match Summary */}
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Match Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{formatNumber(batch.totalTransactions)}</p>
                <p className="text-sm text-gray-500">Total Transactions</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{formatNumber(batch.matchedCount)}</p>
                <p className="text-sm text-gray-500">Matched</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{formatNumber(batch.mismatchedCount)}</p>
                <p className="text-sm text-gray-500">Mismatched</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{matchRate}%</p>
                <p className="text-sm text-gray-500">Match Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amounts */}
        <Card>
          <CardHeader><CardTitle>Amounts</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Amount</span>
              <span className="font-medium">{formatPriceRupees(batch.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Matched Amount</span>
              <span className="font-medium text-green-600">{formatPriceRupees(batch.matchedAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Mismatched Amount</span>
              <span className="font-medium text-red-600">{formatPriceRupees(batch.mismatchedAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Duplicates Found</span>
              <span className="font-medium">{formatNumber(batch.duplicateCount)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Activity */}
        <Card>
          <CardHeader><CardTitle>Activity</CardTitle></CardHeader>
          <CardContent>
            {batch.activities?.length ? (
              <div className="space-y-3">
                {batch.activities.map((activity, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium">{activity.name}</p>
                      {activity.comment && <p className="text-gray-500">{activity.comment}</p>}
                      <p className="text-xs text-gray-400">{formatDate(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No activity recorded</p>
            )}
          </CardContent>
        </Card>

        {/* Mismatched Transactions */}
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Mismatched Transactions</CardTitle></CardHeader>
          <CardContent>
            {mismatchesLoading ? (
              <SectionSkeleton rows={3} variant="list" />
            ) : mismatches?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="pb-2 font-medium">Type</th>
                      <th className="pb-2 font-medium">Gateway Txn ID</th>
                      <th className="pb-2 font-medium">System Txn ID</th>
                      <th className="pb-2 text-right font-medium">Gateway Amt</th>
                      <th className="pb-2 text-right font-medium">System Amt</th>
                      <th className="pb-2 font-medium">Resolution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mismatches.map((mm) => (
                      <tr key={mm.id} className="border-b last:border-0">
                        <td className="py-2">
                          <Badge variant="outline" className={MISMATCH_TYPE_COLORS[mm.type] || ''}>
                            {MISMATCH_TYPE_LABELS[mm.type] || mm.type}
                          </Badge>
                        </td>
                        <td className="py-2 font-mono text-xs">{mm.gatewayTransactionId}</td>
                        <td className="py-2 font-mono text-xs">{mm.systemTransactionId || '--'}</td>
                        <td className="py-2 text-right">
                          {mm.gatewayAmount !== undefined ? formatPriceRupees(mm.gatewayAmount) : '--'}
                        </td>
                        <td className="py-2 text-right">
                          {mm.systemAmount !== undefined ? formatPriceRupees(mm.systemAmount) : '--'}
                        </td>
                        <td className="py-2">
                          {mm.resolution ? (
                            <span className="text-green-600">{mm.resolution}</span>
                          ) : (
                            <span className="text-gray-400">Pending</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No mismatched transactions</p>
            )}
          </CardContent>
        </Card>
      </div>
    </EntityDetailLayout>
  );
}
