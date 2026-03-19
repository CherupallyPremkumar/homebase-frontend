'use client';

import { DynamicForm } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@homebase/ui';
import { productsApi } from '@homebase/api-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New Product</h1>
      <Card>
        <CardHeader><CardTitle>Product Details</CardTitle></CardHeader>
        <CardContent>
          <DynamicForm
            schemaKey="product.listing.form.schema"
            onSubmit={async (data) => {
              try {
                const result = await productsApi.create(data as Record<string, unknown>);
                toast.success('Product created successfully');
                router.push(`/products/${result.mutatedEntity.id}`);
              } catch (error) {
                toast.error('Failed to create product');
              }
            }}
            submitLabel="Create Product"
          />
        </CardContent>
      </Card>
    </div>
  );
}
