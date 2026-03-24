'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@homebase/ui';
import { RotateCcw } from 'lucide-react';

interface CountExecutionProps {
  taskId: string;
}

export function CountExecution({ taskId }: CountExecutionProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
      <RotateCcw className="h-16 w-16 text-gray-400" />
      <h2 className="text-xl font-bold">Cycle Count Execution</h2>
      <p className="text-center text-gray-500">
        Cycle count execution for location {taskId} will be available
        when the cycle-count API is implemented.
      </p>
      <Button size="lg" className="touch-target" onClick={() => router.push('/cycle-count')}>
        Back to Counts
      </Button>
    </div>
  );
}
