'use client';

import { EntityDetailLayout, SectionSkeleton, ErrorSection, formatPriceRupees } from '@homebase/shared';
import { Card, CardContent, Tabs, TabsContent, TabsList, TabsTrigger } from '@homebase/ui';
import { useProductDetail, useProductMutation } from '../api/queries';

interface ProductDetailProps {
  id: string;
}

export function ProductDetail({ id }: ProductDetailProps) {
  const { data, isLoading, error, refetch } = useProductDetail(id);
  const mutation = useProductMutation();

  if (isLoading) return <SectionSkeleton rows={6} />;
  if (error) return <ErrorSection error={error} onRetry={() => refetch()} />;
  if (!data) return null;

  const product = data.mutatedEntity;
  const variants = product.variants ?? [];
  const activities = product.activities ?? [];

  return (
    <EntityDetailLayout
      breadcrumbs={[
        { label: 'Products', href: '/products' },
        { label: product.name },
      ]}
      title={product.name}
      subtitle={`SKU: ${product.sku || 'N/A'}`}
      state={product.stateId}
      allowedActions={data.allowedActionsAndMetadata}
      onAction={(eventId) => mutation.mutate({ id, eventId })}
      actionLoading={mutation.isPending}
    >
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="variants">Variants ({variants.length})</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-4">
          <Card>
            <CardContent className="grid gap-4 p-6 md:grid-cols-2">
              <div><p className="text-sm text-gray-500">Name</p><p className="font-medium">{product.name}</p></div>
              <div><p className="text-sm text-gray-500">Brand</p><p className="font-medium">{product.brandName || product.brand || 'N/A'}</p></div>
              <div><p className="text-sm text-gray-500">Category</p><p className="font-medium">{product.categoryName || 'N/A'}</p></div>
              <div><p className="text-sm text-gray-500">Selling Price</p><p className="font-medium">{formatPriceRupees(product.sellingPrice || product.basePrice)}</p></div>
              <div><p className="text-sm text-gray-500">MRP</p><p className="font-medium">{formatPriceRupees(product.mrp || product.basePrice)}</p></div>
              <div><p className="text-sm text-gray-500">HSN Code</p><p className="font-medium">{product.hsnCode || 'N/A'}</p></div>
              <div className="md:col-span-2"><p className="text-sm text-gray-500">Description</p><p className="mt-1 text-sm">{product.description || 'No description'}</p></div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="variants" className="mt-4">
          <Card>
            <CardContent className="p-6">
              {variants.length > 0 ? (
                <div className="space-y-3">
                  {variants.map((v: any) => (
                    <div key={v.id} className="flex items-center justify-between rounded border p-3 text-sm">
                      <div>
                        <p className="font-medium">{v.name || v.sku || 'Variant'}</p>
                        <p className="text-gray-500">SKU: {v.sku || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        {v.price != null && <p className="font-medium">{formatPriceRupees(v.price)}</p>}
                        {v.stockQuantity != null && <p className="text-gray-500">Stock: {v.stockQuantity}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No variants</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardContent className="p-6">
              {activities.length > 0 ? (
                <div className="space-y-3">
                  {activities.map((a: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400" />
                      <div>
                        <p className="font-medium">{a.name}</p>
                        {a.comment && <p className="text-gray-500">{a.comment}</p>}
                        {a.timestamp && <p className="text-xs text-gray-400">{a.timestamp}</p>}
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
