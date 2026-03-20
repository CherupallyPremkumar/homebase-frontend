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
        { key: 'userName', header: 'User' },
        { key: 'rating', header: 'Rating', type: 'rating' },
        {
          key: 'isVerifiedPurchase',
          header: 'Verified',
          render: (item) => <span>{item.isVerifiedPurchase ? 'Yes' : 'No'}</span>,
        },
        { key: 'stateId', header: 'Status', type: 'state' },
      ]}
    />
  );
}
