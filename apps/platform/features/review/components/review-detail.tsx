'use client';

import { EntityDetailLayout, SectionSkeleton, ErrorSection, formatDate } from '@homebase/shared';
import { Card, CardContent, Tabs, TabsContent, TabsList, TabsTrigger } from '@homebase/ui';
import { useReviewDetail, useReviewMutation } from '../hooks/use-review';
import type { ReviewImage, ActivityLog } from '@homebase/types';

interface ReviewDetailProps {
  id: string;
}

export function ReviewDetail({ id }: ReviewDetailProps) {
  const { data, isLoading, error, refetch } = useReviewDetail(id);
  const mutation = useReviewMutation();

  if (isLoading) return <SectionSkeleton rows={6} />;
  if (error) return <ErrorSection error={error} onRetry={() => refetch()} />;
  if (!data) return null;

  const review = data.mutatedEntity;

  return (
    <EntityDetailLayout
      breadcrumbs={[
        { label: 'Reviews', href: '/reviews' },
        { label: `Review by ${review.userName || 'Anonymous'}` },
      ]}
      title={review.title || 'Untitled Review'}
      subtitle={`By ${review.userName || 'Anonymous'} on ${formatDate(review.createdTime)}`}
      state={review.stateId}
      allowedActions={data.allowedActionsAndMetadata}
      onAction={(eventId) => mutation.mutate({ id, eventId })}
      actionLoading={mutation.isPending}
    >
      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Review Content</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="mt-4">
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="text-2xl font-bold">{review.rating} / 5</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Verified Purchase</p>
                  <p className="font-medium">{review.isVerifiedPurchase ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Product ID</p>
                  <p className="font-medium font-mono text-sm">{review.productId}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Title</p>
                <p className="font-medium">{review.title || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Review</p>
                <p className="mt-1 text-sm">{review.body || 'No review text'}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="images" className="mt-4">
          <Card>
            <CardContent className="p-6">
              {review.images?.length ? (
                <div className="grid grid-cols-3 gap-4">
                  {review.images.map((img: ReviewImage, i: number) => (
                    <div key={i} className="aspect-square overflow-hidden rounded border bg-gray-100">
                      <img src={img.url} alt={`Review image ${i + 1}`} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No images attached</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardContent className="p-6">
              {review.activities?.length ? (
                <div className="space-y-3">
                  {review.activities.map((a: ActivityLog, i: number) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400" />
                      <div>
                        <p className="font-medium">{a.name}</p>
                        {a.comment && <p className="text-gray-500">{a.comment}</p>}
                        <p className="text-xs text-gray-400">{a.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No activity</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </EntityDetailLayout>
  );
}
