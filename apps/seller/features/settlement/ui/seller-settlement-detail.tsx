'use client';

import { useQuery } from '@tanstack/react-query';
import { settlementsApi } from '@homebase/api-client';
import { EntityDetailLayout, SectionSkeleton, ErrorSection, formatPriceRupees, formatDate, CACHE_TIMES } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle, Separator, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@homebase/ui';

interface Props {
  settlementId: string;
}

export function SellerSettlementDetail({ settlementId }: Props) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['seller-settlements', settlementId],
    queryFn: () => settlementsApi.getById(settlementId),
    ...CACHE_TIMES.orderDetail,
  });

  if (isLoading) return <SectionSkeleton rows={6} />;
  if (error) return <ErrorSection error={error} onRetry={() => refetch()} />;
  if (!data) return null;

  const settlement = data.mutatedEntity;

  return (
    <EntityDetailLayout
      breadcrumbs={[
        { label: 'Settlements', href: '/settlements' },
        { label: `${formatDate(settlement.periodStart)} — ${formatDate(settlement.periodEnd)}` },
      ]}
      title="Settlement Details"
      subtitle={`Period: ${formatDate(settlement.periodStart)} — ${formatDate(settlement.periodEnd)}`}
      state={settlement.stateId}
    >
      {/* Breakdown */}
      <Card>
        <CardHeader><CardTitle>Payout Breakdown</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Gross Sales</span><span className="font-medium">{formatPriceRupees(settlement.grossAmount)}</span></div>
          <div className="flex justify-between text-red-600"><span>Commission</span><span>-{formatPriceRupees(settlement.commission)}</span></div>
          <div className="flex justify-between text-red-600"><span>Platform Fees</span><span>-{formatPriceRupees(settlement.platformFees)}</span></div>
          {settlement.returnDeductions > 0 && (
            <div className="flex justify-between text-red-600"><span>Return Deductions</span><span>-{formatPriceRupees(settlement.returnDeductions)}</span></div>
          )}
          {settlement.chargebackDeductions > 0 && (
            <div className="flex justify-between text-red-600"><span>Chargeback Deductions</span><span>-{formatPriceRupees(settlement.chargebackDeductions)}</span></div>
          )}
          <div className="flex justify-between text-red-600"><span>GST on Commission</span><span>-{formatPriceRupees(settlement.gstOnCommission)}</span></div>
          <div className="flex justify-between text-red-600"><span>TDS</span><span>-{formatPriceRupees(settlement.tds)}</span></div>
          <Separator />
          <div className="flex justify-between text-lg font-bold text-green-600"><span>Net Payout</span><span>{formatPriceRupees(settlement.netPayout)}</span></div>
        </CardContent>
      </Card>

      {/* Line items */}
      {settlement.lineItems.length > 0 && (
        <Card className="mt-6">
          <CardHeader><CardTitle>Order Breakdown</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Net</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settlement.lineItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">{item.orderId.slice(0, 8)}...</TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{formatPriceRupees(item.orderAmount)}</TableCell>
                    <TableCell className="text-red-600">-{formatPriceRupees(item.commission)}</TableCell>
                    <TableCell className="font-medium">{formatPriceRupees(item.netAmount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </EntityDetailLayout>
  );
}
