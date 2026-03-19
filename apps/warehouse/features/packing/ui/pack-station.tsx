'use client';

import { useRouter } from 'next/navigation';
import { SectionSkeleton, ErrorSection } from '@homebase/shared';
import { Button, Card, CardContent, Badge } from '@homebase/ui';
import { ScannerInput } from '@/components/scanner-input';
import { Check, Package, Printer } from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { usePackTaskDetail, useConfirmPackItem, useCompletePacking } from '../api/queries';
import { toast } from 'sonner';

interface PackStationProps {
  taskId: string;
}

export function PackStation({ taskId }: PackStationProps) {
  const router = useRouter();
  const { data, isLoading, error } = usePackTaskDetail(taskId);
  const confirmPack = useConfirmPackItem();
  const completePacking = useCompletePacking();

  if (isLoading) return <SectionSkeleton rows={4} />;
  if (error) return <ErrorSection error={error} />;
  if (!data) return null;

  const allPacked = data.items.every((i) => i.packed);
  const progress = data.totalItems > 0 ? Math.round((data.packedItems / data.totalItems) * 100) : 0;

  const handleScan = (code: string) => {
    const item = data.items.find((i) => i.sku === code && !i.packed);
    if (item) {
      confirmPack.mutate({ taskId, itemId: item.id });
    } else if (data.items.find((i) => i.sku === code && i.packed)) {
      toast.info('This item is already packed');
    } else {
      toast.error(`SKU ${code} not found in this order`);
    }
  };

  // Packing complete — show label
  if (data.status === 'PACKED' || data.status === 'LABELED') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <Package className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-green-700">Packed!</h2>
        <p className="text-gray-500">Order #{data.orderNumber}</p>
        {data.trackingNumber && (
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <p className="text-xs text-gray-500">Tracking</p>
            <p className="font-mono text-lg font-bold">{data.trackingNumber}</p>
            <p className="text-sm text-gray-500">{data.carrier}</p>
          </div>
        )}
        <div className="flex gap-3">
          <Button size="lg" className="touch-target" variant="outline">
            <Printer className="mr-2 h-5 w-5" /> Print Label
          </Button>
          <Button size="lg" className="touch-target" onClick={() => router.push('/packing')}>
            Next Order
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Order #{data.orderNumber}</span>
          <span className="text-gray-500">{data.packedItems}/{data.totalItems} packed</span>
        </div>
        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-gray-200">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Scanner */}
      <ScannerInput onScan={handleScan} placeholder="Scan item to pack..." />

      {/* Items checklist */}
      <div className="space-y-2">
        {data.items.map((item) => (
          <div
            key={item.id}
            className={cn(
              'flex items-center gap-3 rounded-lg border p-4',
              item.packed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white',
            )}
          >
            <div className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full',
              item.packed ? 'bg-green-500' : 'bg-gray-200',
            )}>
              {item.packed ? <Check className="h-4 w-4 text-white" /> : <span className="text-xs font-bold">x{item.quantity}</span>}
            </div>
            <div className="flex-1">
              <p className={cn('font-medium', item.packed && 'text-green-700')}>{item.productName}</p>
              <p className="text-sm text-gray-500">SKU: {item.sku} · Qty: {item.quantity}</p>
            </div>
            {!item.packed && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => confirmPack.mutate({ taskId, itemId: item.id })}
                disabled={confirmPack.isPending}
              >
                Pack
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Complete button */}
      {allPacked && (
        <Button
          size="lg"
          className="w-full touch-target"
          onClick={() => completePacking.mutate(taskId)}
          disabled={completePacking.isPending}
        >
          {completePacking.isPending ? 'Generating Label...' : 'Complete Packing & Print Label'}
        </Button>
      )}
    </div>
  );
}
