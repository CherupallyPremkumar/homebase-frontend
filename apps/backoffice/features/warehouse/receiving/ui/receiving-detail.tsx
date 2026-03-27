'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@homebase/ui';
import { PackageOpen } from 'lucide-react';

interface ReceivingDetailProps {
  shipmentId: string;
}

export function ReceivingDetail({ shipmentId }: ReceivingDetailProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
      <PackageOpen className="h-16 w-16 text-gray-400" />
      <h2 className="text-xl font-bold">Receiving Detail</h2>
      <p className="text-center text-gray-500">
        Detailed receiving view for item {shipmentId.substring(0, 8)}... will be available
        when the receiving API is implemented.
      </p>
      <Button size="lg" className="touch-target" onClick={() => router.push('/warehouse/receiving')}>
        Back to Receiving
      </Button>
    </div>
  );
}
