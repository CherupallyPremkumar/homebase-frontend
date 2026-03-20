'use client';

import { EntityList, formatPrice } from '@homebase/ui';
import { getApiClient } from '@homebase/api-client';
import type { SearchRequest, SearchResponse } from '@homebase/types';

interface Payment { id: string; orderId: string; amount: number; paymentMethod?: string; gatewayName?: string; createdTime: string; stateId: string; }

const searchPayments = (params: SearchRequest) =>
  getApiClient().post<SearchResponse<Payment>>('/api/v1/payments/search', params);

export function PaymentList() {
  return (
    <EntityList<Payment>
      title="Payments"
      queryKey="finance-payments"
      queryFn={searchPayments}
      display="table"
      searchable
      emptyTitle="No payments"
      emptyDescription="Payment records will appear here as transactions are processed."
      columns={[
        { key: 'orderId', header: 'Order', linkTo: (item) => `/payments/${item.id}` },
        {
          key: 'amount',
          header: 'Amount',
          render: (item) => <span className="font-semibold">{formatPrice(item.amount)}</span>,
        },
        {
          key: 'paymentMethod',
          header: 'Method',
          render: (item) => <span>{item.paymentMethod?.replace(/_/g, ' ') || 'N/A'}</span>,
        },
        { key: 'gatewayName', header: 'Gateway' },
        { key: 'createdTime', header: 'Date', type: 'date' },
        { key: 'stateId', header: 'Status', type: 'state' },
      ]}
    />
  );
}
