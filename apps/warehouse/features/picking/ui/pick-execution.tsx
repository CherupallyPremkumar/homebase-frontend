'use client';

import { useRouter } from 'next/navigation';
import { SectionSkeleton, ErrorSection } from '@homebase/shared';
import { Button, Card, CardContent, Badge } from '@homebase/ui';
import { ScannerInput } from '@/components/scanner-input';
import { Check, MapPin, ArrowRight, Package } from 'lucide-react';
import { usePickListDetail, useConfirmPick, useStartPickList } from '../api/queries';
import { toast } from 'sonner';

interface PickExecutionProps {
  pickListId: string;
}

export function PickExecution({ pickListId }: PickExecutionProps) {
  const router = useRouter();
  const { data, isLoading, error } = usePickListDetail(pickListId);
  const confirmPick = useConfirmPick();
  const startPick = useStartPickList();

  if (isLoading) return <SectionSkeleton rows={4} />;
  if (error) return <ErrorSection error={error} />;
  if (!data) return null;

  const unpickedItems = data.items.filter((i) => !i.picked);
  const nextItem = unpickedItems[0];
  const progress = data.totalItems > 0 ? Math.round((data.pickedItems / data.totalItems) * 100) : 0;

  // Not started yet
  if (data.status === 'PENDING') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <Package className="h-16 w-16 text-primary" />
        <h2 className="text-xl font-bold">Order #{data.orderNumber}</h2>
        <p className="text-gray-500">{data.totalItems} items to pick</p>
        <Button size="lg" className="touch-target px-8" onClick={() => startPick.mutate(pickListId)} disabled={startPick.isPending}>
          {startPick.isPending ? 'Starting...' : 'Start Picking'}
        </Button>
      </div>
    );
  }

  // Completed
  if (!nextItem) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-green-700">Pick Complete!</h2>
        <p className="text-gray-500">All {data.totalItems} items picked for Order #{data.orderNumber}</p>
        <Button size="lg" className="touch-target" onClick={() => router.push('/picking')}>
          Back to Queue
        </Button>
      </div>
    );
  }

  const handleScan = (code: string) => {
    if (code === nextItem.sku) {
      confirmPick.mutate({ pickListId, itemId: nextItem.id, quantity: nextItem.quantity });
    } else {
      toast.error(`Wrong item! Expected ${nextItem.sku}, scanned ${code}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Order #{data.orderNumber}</span>
          <span className="text-gray-500">{data.pickedItems}/{data.totalItems} picked</span>
        </div>
        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-gray-200">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Current item to pick -- BIG and prominent */}
      <Card className="border-2 border-primary">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-start justify-between">
            <div>
              <Badge className="mb-2">PICK NEXT</Badge>
              <h2 className="text-xl font-bold">{nextItem.productName}</h2>
              <p className="mt-1 font-mono text-lg text-gray-600">SKU: {nextItem.sku}</p>
            </div>
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
              x{nextItem.quantity}
            </span>
          </div>

          {/* Location -- big and visible from across the warehouse */}
          <div className="flex items-center gap-3 rounded-lg bg-yellow-50 p-4">
            <MapPin className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-xs text-yellow-600">GO TO</p>
              <p className="text-3xl font-bold text-yellow-800">{nextItem.binLocation}</p>
              <p className="text-sm text-yellow-600">Zone: {nextItem.zone}</p>
            </div>
          </div>

          {/* Scanner */}
          <ScannerInput onScan={handleScan} placeholder={`Scan ${nextItem.sku} to confirm...`} />

          {/* Manual confirm */}
          <Button
            variant="outline"
            size="lg"
            className="w-full touch-target"
            onClick={() => confirmPick.mutate({ pickListId, itemId: nextItem.id, quantity: nextItem.quantity })}
            disabled={confirmPick.isPending}
          >
            {confirmPick.isPending ? 'Confirming...' : 'Confirm Without Scan'}
          </Button>
        </CardContent>
      </Card>

      {/* Remaining items */}
      {unpickedItems.length > 1 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-500">Up Next ({unpickedItems.length - 1} remaining)</h3>
          {unpickedItems.slice(1, 4).map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded border bg-white p-3 mb-2">
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.productName}</p>
                <p className="text-xs text-gray-500">Bin: {item.binLocation} · Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
