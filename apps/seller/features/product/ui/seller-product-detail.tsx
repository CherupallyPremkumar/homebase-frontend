'use client';

import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@homebase/api-client';
import { EntityDetail, Badge, formatPrice } from '@homebase/ui';
import { CACHE_TIMES } from '@homebase/shared';
import { useSellerProductMutation } from '../api/queries';
import type { ProductVariant, ProductMedia, ActivityLog } from '@homebase/types';

interface SellerProductDetailProps {
  productId: string;
}

export function SellerProductDetail({ productId }: SellerProductDetailProps) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['seller-products', productId],
    queryFn: () => productsApi.retrieve(productId),
    ...CACHE_TIMES.productDetail,
  });

  const mutation = useSellerProductMutation();
  const product = data?.mutatedEntity;
  const variants = product?.variants ?? [];
  const media = product?.media ?? [];
  const activities = product?.activities ?? [];
  const tags: string[] = product?.tags ?? [];

  return (
    <EntityDetail
      breadcrumbs={[
        { label: 'Products', href: '/products' },
        { label: product?.name || 'Loading...' },
      ]}
      title={product?.name || ''}
      subtitle={product ? `SKU: ${product.sku || 'N/A'} · Listed ${product.createdTime ? new Date(product.createdTime).toLocaleDateString('en-IN') : '\u2014'}` : undefined}
      state={product?.stateId}
      allowedActions={data?.allowedActionsAndMetadata}
      onAction={(eventId) => mutation.mutate({ id: productId, eventId })}
      actionLoading={mutation.isPending}
      loading={isLoading}
      error={error ? 'Failed to load product' : null}
      onRetry={() => refetch()}
      tabs={[
        {
          key: 'details',
          label: 'Details',
          content: product ? (
            <div className="rounded-md border p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" value={product.name} />
                <Field label="Brand" value={product.brandName || product.brand} />
                <Field label="Category" value={product.categoryName} />
                <Field label="HSN Code" value={product.hsnCode} />
                <Field label="Selling Price" value={formatPrice(product.sellingPrice || product.basePrice)} />
                <Field label="MRP" value={formatPrice(product.mrp || product.basePrice)} />
                <div className="sm:col-span-2">
                  <Field label="Description" value={product.description} />
                </div>
                {tags.length > 0 && (
                  <div className="sm:col-span-2">
                    <p className="text-sm text-gray-500">Tags</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null,
        },
        {
          key: 'variants',
          label: 'Variants',
          badge: variants.length || undefined,
          content: product ? (
            <div className="rounded-md border p-6">
              {variants.length > 0 ? (
                <div className="space-y-3">
                  {variants.map((v: ProductVariant) => (
                    <div key={v.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium">{v.name || v.sku || 'Variant'}</p>
                        <p className="text-sm text-gray-500">SKU: {v.sku || 'N/A'}</p>
                        {v.attributes?.length > 0 && (
                          <div className="mt-1 flex gap-2">
                            {v.attributes.map((a) => (
                              <Badge key={a.name} variant="outline">{a.name}: {a.value}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        {v.price != null && <p className="font-medium">{formatPrice(v.price)}</p>}
                        {v.stockQuantity != null && (
                          <p className={`text-sm ${v.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {v.stockQuantity} in stock
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No variants -- single product listing</p>
              )}
            </div>
          ) : null,
        },
        {
          key: 'media',
          label: 'Media',
          badge: media.length || undefined,
          content: product ? (
            <div className="rounded-md border p-6">
              {media.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {media.map((m: ProductMedia) => (
                    <div key={m.id} className="overflow-hidden rounded-lg border">
                      <img src={m.url} alt={m.altText || ''} className="aspect-square w-full object-cover" />
                      {m.isPrimary && <p className="bg-primary/10 p-1 text-center text-xs font-medium text-primary">Primary</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No media uploaded</p>
              )}
            </div>
          ) : null,
        },
        {
          key: 'activity',
          label: 'Activity',
          content: product ? (
            <div className="rounded-md border p-6">
              {activities.length > 0 ? (
                <div className="space-y-3">
                  {activities.map((a: ActivityLog, i: number) => (
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
                <p className="text-sm text-gray-500">No activity yet</p>
              )}
            </div>
          ) : null,
        },
      ]}
    />
  );
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-0.5 font-medium">{value != null ? String(value) : 'N/A'}</p>
    </div>
  );
}
