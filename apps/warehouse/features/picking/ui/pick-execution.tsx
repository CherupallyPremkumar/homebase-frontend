'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@homebase/ui';
import { Package } from 'lucide-react';

interface PickExecutionProps {
  pickListId: string;
}

export function PickExecution({ pickListId }: PickExecutionProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
      <Package className="h-16 w-16 text-gray-400" />
      <h2 className="text-xl font-bold">Pick Execution</h2>
      <p className="text-center text-gray-500">
        Individual pick execution for fulfillment order {pickListId.substring(0, 8)}... will be available
        when the pick-list API is implemented.
      </p>
      <Button size="lg" className="touch-target" onClick={() => router.push('/picking')}>
        Back to Queue
      </Button>
    </div>
  );
}
