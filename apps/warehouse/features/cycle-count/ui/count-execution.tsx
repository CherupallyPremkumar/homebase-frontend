'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SectionSkeleton, ErrorSection } from '@homebase/shared';
import { Button, Card, CardContent, Input, Label } from '@homebase/ui';
import { ScannerInput } from '@/components/scanner-input';
import { Check, AlertTriangle, MapPin } from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { useCycleCountDetail, useRecordCount } from '../api/queries';
import { toast } from 'sonner';

interface CountExecutionProps {
  taskId: string;
}

export function CountExecution({ taskId }: CountExecutionProps) {
  const router = useRouter();
  const { data, isLoading, error } = useCycleCountDetail(taskId);
  const recordCount = useRecordCount();
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [countValue, setCountValue] = useState('');

  if (isLoading) return <SectionSkeleton rows={4} />;
  if (error) return <ErrorSection error={error} />;
  if (!data) return null;

  const uncounted = data.items.filter((i) => !i.counted);
  const allCounted = uncounted.length === 0;
  const discrepancies = data.items.filter((i) => i.discrepancy);

  const handleScan = (code: string) => {
    const item = data.items.find((i) => i.sku === code && !i.counted);
    if (item) {
      setActiveItemId(item.id);
      setCountValue('');
      toast.info(`Counting: ${item.productName}`);
    } else {
      toast.error(`SKU ${code} not found or already counted`);
    }
  };

  const handleRecordCount = () => {
    if (!activeItemId || countValue === '') return;
    recordCount.mutate(
      { taskId, itemId: activeItemId, actualQuantity: Number(countValue) },
      { onSuccess: () => { setActiveItemId(null); setCountValue(''); } },
    );
  };

  const activeItem = data.items.find((i) => i.id === activeItemId);

  if (allCounted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <div className={cn('flex h-20 w-20 items-center justify-center rounded-full', discrepancies.length > 0 ? 'bg-yellow-100' : 'bg-green-100')}>
          {discrepancies.length > 0 ? <AlertTriangle className="h-10 w-10 text-yellow-600" /> : <Check className="h-10 w-10 text-green-600" />}
        </div>
        <h2 className="text-xl font-bold">{discrepancies.length > 0 ? 'Count Complete — Discrepancies Found' : 'Count Complete!'}</h2>
        <p className="text-gray-500">Bin: {data.binLocation}</p>
        {discrepancies.length > 0 && (
          <div className="w-full max-w-sm space-y-2">
            {discrepancies.map((item) => (
              <div key={item.id} className="flex justify-between rounded bg-yellow-50 p-3 text-sm">
                <span>{item.productName}</span>
                <span className="font-mono font-bold text-yellow-700">
                  Expected: {item.expectedQuantity} / Actual: {item.actualQuantity}
                </span>
              </div>
            ))}
          </div>
        )}
        <Button size="lg" className="touch-target" onClick={() => router.push('/cycle-count')}>
          Back to Counts
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bin location header */}
      <div className="flex items-center gap-3 rounded-lg bg-primary/10 p-4">
        <MapPin className="h-8 w-8 text-primary" />
        <div>
          <p className="text-xs text-primary">BIN LOCATION</p>
          <p className="text-3xl font-bold text-primary">{data.binLocation}</p>
          <p className="text-sm text-primary/70">Zone: {data.zone}</p>
        </div>
      </div>

      <ScannerInput onScan={handleScan} placeholder="Scan SKU to count..." />

      {/* Active count form */}
      {activeItem && (
        <Card className="border-2 border-primary">
          <CardContent className="space-y-4 p-6">
            <div>
              <p className="text-lg font-bold">{activeItem.productName}</p>
              <p className="font-mono text-gray-500">SKU: {activeItem.sku}</p>
            </div>
            <div>
              <Label className="text-base">Actual Count</Label>
              <Input
                type="number"
                value={countValue}
                onChange={(e) => setCountValue(e.target.value)}
                className="mt-2 scanner-input"
                min={0}
                autoFocus
                placeholder="Enter quantity..."
              />
            </div>
            <Button onClick={handleRecordCount} size="lg" className="w-full touch-target" disabled={recordCount.isPending || countValue === ''}>
              {recordCount.isPending ? 'Recording...' : 'Record Count'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Item list */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-500">Items in this bin ({uncounted.length} remaining)</h3>
        {data.items.map((item) => (
          <button
            key={item.id}
            onClick={() => { if (!item.counted) { setActiveItemId(item.id); setCountValue(''); } }}
            disabled={item.counted}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg border p-4 text-left',
              item.counted
                ? item.discrepancy
                  ? 'border-yellow-200 bg-yellow-50'
                  : 'border-green-200 bg-green-50'
                : 'border-gray-200 bg-white hover:bg-gray-50',
              item.id === activeItemId && 'ring-2 ring-primary',
            )}
          >
            <div className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full',
              item.counted
                ? item.discrepancy ? 'bg-yellow-500' : 'bg-green-500'
                : 'bg-gray-200',
            )}>
              {item.counted ? (
                item.discrepancy ? <AlertTriangle className="h-4 w-4 text-white" /> : <Check className="h-4 w-4 text-white" />
              ) : null}
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.productName}</p>
              <p className="text-sm text-gray-500">SKU: {item.sku}</p>
            </div>
            {item.counted && (
              <span className="text-sm font-mono">
                {item.actualQuantity}/{item.expectedQuantity}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
