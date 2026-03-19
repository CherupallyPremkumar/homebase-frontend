'use client';

import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@homebase/api-client';
import {
  EntityDetailLayout, SectionSkeleton, ErrorSection, formatPriceRupees, CACHE_TIMES,
} from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Badge } from '@homebase/ui';
import { useSellerProductMutation } from '../api/queries';
import type { Product } from '@homebase/types';

interface SellerProductDetailProps {
  productId: string;
}

export function SellerProductDetail({ productId }: SellerProductDetailProps) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['seller-products', productId],
    queryFn: () => productsApi.getById(productId),
    ...CACHE_TIMES.productDetail,
  });

  const mutation = useSellerProductMutation();

  if (isLoading) return <SectionSkeleton rows={6} />;
  if (error) return <ErrorSection error={error} onRetry={() => refetch()} />;
  if (!data) return null;

  const product = data.mutatedEntity;

  return (
    <EntityDetailLayout
      breadcrumbs={[
        { label: 'Products', href: '/products' },
        { label: product.name },
      ]}
      title={product.name}
      subtitle={`SKU: ${product.sku || 'N/A'} · Listed ${new Date(product.createdTime).toLocaleDateString('en-IN')}`}
      state={product.stateId}
      allowedActions={data.allowedActionsAndMetadata}
      onAction={(eventId) => mutation.mutate({ id: productId, eventId })}
      actionLoading={mutation.isPending}
    >
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="variants">Variants ({product.variants.length})</TabsTrigger>
          <TabsTrigger value="media">Media ({product.media.length})</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <Card>
            <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
              <Field label="Name" value={product.name} />
              <Field label="Brand" value={product.brandName} />
              <Field label="Category" value={product.categoryName} />
              <Field label="HSN Code" value={product.hsnCode} />
              <Field label="Selling Price" value={formatPriceRupees(product.sellingPrice)} />
              <Field label="MRP" value={formatPriceRupees(product.mrp)} />
              <div className="sm:col-span-2">
                <Field label="Description" value={product.description} />
              </div>
              {product.tags.length > 0 && (
                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-500">Tags</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variants" className="mt-4">
          <Card>
            <CardContent className="p-6">
              {product.variants.length ? (
                <div className="space-y-3">
                  {product.variants.map((v) => (
                    <div key={v.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium">{v.name}</p>
                        <p className="text-sm text-gray-500">SKU: {v.sku}</p>
                        <div className="mt-1 flex gap-2">
                          {v.attributes.map((a) => (
                            <Badge key={a.name} variant="outline">{a.name}: {a.value}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPriceRupees(v.price)}</p>
                        <p className={`text-sm ${v.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {v.stockQuantity} in stock
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No variants — single product listing</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="mt-4">
          <Card>
            <CardContent className="p-6">
              {product.media.length ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {product.media.map((m) => (
                    <div key={m.id} className="overflow-hidden rounded-lg border">
                      <img src={m.url} alt={m.altText || ''} className="aspect-square w-full object-cover" />
                      {m.isPrimary && <p className="bg-primary/10 p-1 text-center text-xs font-medium text-primary">Primary</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No media uploaded</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardContent className="p-6">
              {product.activities.length ? (
                <div className="space-y-3">
                  {product.activities.map((a, i) => (
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
                <p className="text-sm text-gray-500">No activity yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </EntityDetailLayout>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-0.5 font-medium">{value || 'N/A'}</p>
    </div>
  );
}
