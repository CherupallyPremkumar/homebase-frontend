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
          key: 'periodStart',
          header: 'Period',
          render: (item) => (
            <span className="text-sm">{formatDate(item.periodStart)} -- {formatDate(item.periodEnd)}</span>
          ),
        },
        { key: 'grossAmount', header: 'Gross Sales', type: 'price' },
        {
          key: 'commission',
          header: 'Commission',
          render: (item) => <span className="text-red-600">-{formatPrice(item.commission)}</span>,
        },
        {
          key: 'netPayout',
          header: 'Net Payout',
          render: (item) => <span className="font-bold text-green-600">{formatPrice(item.netPayout)}</span>,
        },
        { key: 'stateId', header: 'Status', type: 'state' },
      ]}
    />
  );
}
