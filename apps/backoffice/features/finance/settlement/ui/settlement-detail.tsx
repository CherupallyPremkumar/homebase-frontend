'use client';

import { EntityDetailLayout, SectionSkeleton, ErrorSection, formatPriceRupees, formatDate } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle, Separator } from '@homebase/ui';
import { useSettlementDetail, useSettlementMutation } from '../api/queries';

interface SettlementDetailProps {
  id: string;
}

export function SettlementDetail({ id }: SettlementDetailProps) {
  const { data, isLoading, error, refetch } = useSettlementDetail(id);
  const mutation = useSettlementMutation();

  if (isLoading) return <SectionSkeleton rows={6} />;
  if (error) return <ErrorSection error={error} onRetry={() => refetch()} />;
  if (!data) return null;

  const settlement = data.mutatedEntity;

  return (
    <EntityDetailLayout
      breadcrumbs={[
        { label: 'Settlements', href: '/finance/settlements' },
        { label: settlement.supplierName || settlement.supplierId },
      ]}
      title={`Settlement: ${settlement.supplierName || settlement.supplierId}`}
      subtitle={`${formatDate(settlement.periodStart)} \u2014 ${formatDate(settlement.periodEnd)}`}
      state={settlement.stateId}
      allowedActions={data.allowedActionsAndMetadata}
      onAction={(eventId) => mutation.mutate({ id, eventId })}
      actionLoading={mutation.isPending}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Payout Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Gross Amount</span>
                  <span className="font-medium">{formatPriceRupees(settlement.grossAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Commission</span>
                  <span className="font-medium text-red-600">- {formatPriceRupees(settlement.commission)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Platform Fees</span>
                  <span className="font-medium text-red-600">- {formatPriceRupees(settlement.platformFees)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Return Deductions</span>
                  <span className="font-medium text-red-600">- {formatPriceRupees(settlement.returnDeductions)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Chargeback Deductions</span>
                  <span className="font-medium text-red-600">- {formatPriceRupees(settlement.chargebackDeductions)}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">GST on Commission</span>
                  <span className="font-medium text-red-600">- {formatPriceRupees(settlement.gstOnCommission)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">TDS</span>
                  <span className="font-medium text-red-600">- {formatPriceRupees(settlement.tds)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>Net Payout</span>
                  <span className="text-primary">{formatPriceRupees(settlement.netPayout)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Currency</span>
                  <span className="font-medium">{settlement.currency}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Line Items</CardTitle></CardHeader>
          <CardContent>
            {settlement.lineItems?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="pb-2 font-medium">Product</th>
                      <th className="pb-2 font-medium">Order ID</th>
                      <th className="pb-2 text-right font-medium">Order Amount</th>
                      <th className="pb-2 text-right font-medium">Commission</th>
                      <th className="pb-2 text-right font-medium">Platform Fee</th>
                      <th className="pb-2 text-right font-medium">Net Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settlement.lineItems.map((item) => (
                      <tr key={item.id} className="border-b last:border-0">
                        <td className="py-2 font-medium">{item.productName}</td>
                        <td className="py-2 text-gray-500">{item.orderId}</td>
                        <td className="py-2 text-right">{formatPriceRupees(item.orderAmount)}</td>
                        <td className="py-2 text-right text-red-600">- {formatPriceRupees(item.commission)}</td>
                        <td className="py-2 text-right text-red-600">- {formatPriceRupees(item.platformFee)}</td>
                        <td className="py-2 text-right font-medium">{formatPriceRupees(item.netAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No line items</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Adjustments</CardTitle></CardHeader>
          <CardContent>
            {settlement.adjustments?.length ? (
              <div className="space-y-3">
                {settlement.adjustments.map((adj) => (
                  <div key={adj.id} className="flex items-start justify-between text-sm">
                    <div>
                      <p className="font-medium">{adj.type.replace(/_/g, ' ')}</p>
                      <p className="text-gray-500">{adj.reason}</p>
                      <p className="text-xs text-gray-400">{formatDate(adj.createdAt)}</p>
                    </div>
                    <span className={`font-medium ${adj.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {adj.amount >= 0 ? '+' : ''}{formatPriceRupees(adj.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No adjustments</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Activity</CardTitle></CardHeader>
          <CardContent>
            {settlement.activities?.length ? (
              <div className="space-y-3">
                {settlement.activities.map((activity, i) => (
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
      </div>
    </EntityDetailLayout>
  );
}
