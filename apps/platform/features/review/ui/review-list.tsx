'use client';

import { EntityList } from '@homebase/ui';
import { reviewsApi } from '@homebase/api-client';

export function ReviewList() {
  return (
    <EntityList
      title="Reviews"
      queryKey="platform-reviews"
      queryFn={reviewsApi.search}
      display="table"
      searchable
      searchPlaceholder="Search reviews..."
      emptyTitle="No reviews found"
      columns={[
        { key: 'productId', header: 'Product', linkTo: (item) => `/reviews/${item.id}` },
        { key: 'customerId', header: 'Customer' },
        { key: 'rating', header: 'Rating', type: 'rating' },
        {
          key: 'verifiedPurchase',
          header: 'Verified',
          render: (item) => <span>{item.verifiedPurchase ? 'Yes' : 'No'}</span>,
        },
        { key: 'reportCount', header: 'Reports', type: 'number' },
        { key: 'stateId', header: 'Status', type: 'state' },
        { key: 'createdAt', header: 'Date', type: 'date' },
      ]}
    />
  );
}
