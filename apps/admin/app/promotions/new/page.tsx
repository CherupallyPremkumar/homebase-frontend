'use client';

import { DynamicForm } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@homebase/ui';
import { promosApi } from '@homebase/api-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function NewCouponPage() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New Coupon</h1>
      <Card>
        <CardHeader><CardTitle>Coupon Details</CardTitle></CardHeader>
        <CardContent>
          <DynamicForm
            schemaKey="promo.coupon.form.schema"
            onSubmit={async (data) => {
              try {
                await promosApi.create(data as Record<string, unknown>);
                toast.success('Coupon created');
                router.push('/promotions');
              } catch { toast.error('Failed to create coupon'); }
            }}
            submitLabel="Create Coupon"
          />
        </CardContent>
      </Card>
    </div>
  );
}
