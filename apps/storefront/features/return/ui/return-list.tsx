'use client';

import { useQuery } from '@tanstack/react-query';
import { returnRequestsApi } from '@homebase/api-client';
import { useSearchQuery, StateBadge, SectionSkeleton, ErrorSection, EmptyState, formatDate } from '@homebase/shared';
import { Button } from '@homebase/ui';
import { Undo2 } from 'lucide-react';

export function ReturnList() {
  const { searchRequest, page, setPage } = useSearchQuery({ size: 10 });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['my-returns', searchRequest],
    queryFn: () => returnRequestsApi.myReturns(searchRequest),
  });

  if (error) return <div className="container mx-auto px-4 py-6"><ErrorSection error={error} onRetry={() => refetch()} /></div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">My Returns</h1>

      {isLoading ? (
        <SectionSkeleton rows={3} />
      ) : !data?.content.length ? (
        <EmptyState
          icon={<Undo2 className="h-16 w-16" />}
          title="No return requests"
          description="You haven't requested any returns yet."
        />
      ) : (
        <div className="space-y-4">
          {data.content.map((ret) => (
            <div key={ret.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{ret.productName}</p>
                  <p className="text-xs text-gray-500">Reason: {ret.reason}</p>
                  <p className="text-xs text-gray-500">{formatDate(ret.createdTime)}</p>
                </div>
                <StateBadge state={ret.stateId} />
              </div>
            </div>
          ))}
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={!data.hasPrevious}>Previous</Button>
            <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={!data.hasNext}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
