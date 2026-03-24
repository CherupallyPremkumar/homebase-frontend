'use client';

import { EntityList, formatPrice, formatDate } from '@homebase/ui';
import { settlementsApi } from '@homebase/api-client';

export function SellerSettlementList() {
  return (
    <EntityList
      title="Settlements"
      subtitle="Your payout history and upcoming settlements"
      queryKey="seller-settlements"
      queryFn={settlementsApi.search}
      display="table"
      emptyTitle="No settlements yet"
      emptyDescription="Settlements will appear after your first order is delivered."
      columns={[
        {
          key: 'settlementPeriodStart',
          header: 'Period',
          render: (item) => (
            <span className="text-sm">{formatDate(item.settlementPeriodStart)} -- {formatDate(item.settlementPeriodEnd)}</span>
          ),
        },
        { key: 'orderAmount', header: 'Order Amount', type: 'price' },
        {
          key: 'commissionAmount',
          header: 'Commission',
          render: (item) => <span className="text-red-600">-{formatPrice(item.commissionAmount ?? 0)}</span>,
        },
        {
          key: 'netAmount',
          header: 'Net Payout',
          render: (item) => <span className="font-bold text-green-600">{formatPrice(item.netAmount ?? 0)}</span>,
        },
        { key: 'stateId', header: 'Status', type: 'state' },
      ]}
    />
  );
}
