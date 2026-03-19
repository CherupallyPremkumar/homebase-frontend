'use client';

import { useRouter } from 'next/navigation';
import { DynamicForm } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@homebase/ui';
import { productsApi } from '@homebase/api-client';
import { toast } from 'sonner';

export function SellerProductCreate() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <p className="text-sm text-gray-500">List a new product on HomeBase marketplace</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Product Details</CardTitle></CardHeader>
        <CardContent>
          <DynamicForm
            schemaKey="product.listing.form.schema"
            onSubmit={async (data) => {
              try {
                const result = await productsApi.create(data as Record<string, unknown>);
                toast.success('Product created! It will be reviewed before going live.');
                router.push(`/products/${result.mutatedEntity.id}`);
              } catch {
                toast.error('Failed to create product');
              }
            }}
            submitLabel="Submit for Review"
          />
        </CardContent>
      </Card>
    </div>
  );
}
