'use client';

import { EntityList, formatDate } from '@homebase/ui';
import { returnRequestsApi } from '@homebase/api-client';

export function ReturnList() {
  return (
    <div className="container mx-auto px-4 py-6">
      <EntityList
        title="My Returns"
        queryKey="my-returns"
        queryFn={returnRequestsApi.myReturns}
        display="cards"
        pageSize={10}
        emptyTitle="No return requests"
        emptyDescription="You haven't requested any returns yet."
        cardConfig={{
          variant: 'horizontal',
          map: (ret) => ({
            title: ret.productName || 'Return Request',
            subtitle: `Reason: ${ret.reason || 'N/A'} · ${formatDate(ret.createdTime)}`,
            state: ret.stateId,
          }),
          gridCols: 'grid-cols-1',
        }}
      />
    </div>
  );
}
