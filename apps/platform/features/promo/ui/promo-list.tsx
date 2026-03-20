'use client';

import { EntityList, formatPrice } from '@homebase/ui';
import { promosApi } from '@homebase/api-client';

export function PromoList() {
  return (
    <EntityList
      title="Promotions"
      queryKey="platform-promotions"
      queryFn={promosApi.search}
      display="table"
      searchable
      searchPlaceholder="Search coupons..."
      createAction={{ label: 'New Coupon', href: '/promotions/new' }}
      emptyTitle="No coupons found"
      columns={[
        {
          key: 'code',
          header: 'Code',
          render: (item) => <span className="font-mono font-medium">{item.code}</span>,
        },
        { key: 'discountType', header: 'Type' },
        {
          key: 'discountValue',
          header: 'Discount',
          render: (item) =>
            item.discountType === 'PERCENTAGE'
              ? <span>{item.discountValue}%</span>
              : <span>{formatPrice(item.discountValue)}</span>,
        },
        {
          key: 'usedCount',
          header: 'Usage',
          render: (item) => <span>{item.usedCount}{item.usageLimit ? `/${item.usageLimit}` : ''}</span>,
        },
        { key: 'validUntil', header: 'Expires', type: 'date' },
        { key: 'stateId', header: 'Status', type: 'state' },
      ]}
    />
  );
}
