'use client';

import { useState } from 'react';
import { SectionSkeleton, ErrorSection } from '@homebase/shared';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@homebase/ui';
import { ScannerInput } from '@/components/scanner-input';
import { Check, X, AlertTriangle } from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { useShipmentDetail, useReceiveItem } from '../api/queries';
import { toast } from 'sonner';

interface ReceivingDetailProps {
  shipmentId: string;
}

export function ReceivingDetail({ shipmentId }: ReceivingDetailProps) {
  const { data, isLoading, error } = useShipmentDetail(shipmentId);
  const receiveItem = useReceiveItem();
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState('');
  const [binLocation, setBinLocation] = useState('');
  const [condition, setCondition] = useState<'GOOD' | 'DAMAGED'>('GOOD');

  if (isLoading) return <SectionSkeleton rows={6} />;
  if (error) return <ErrorSection error={error} />;
  if (!data) return null;

  const handleScan = (code: string) => {
    const item = data.items.find((i) => i.sku === code);
    if (item) {
      setActiveItemId(item.id);
      setQuantity(String(item.expectedQuantity - item.receivedQuantity));
      toast.info(`Found: ${item.productName}`);
    } else {
      toast.error(`SKU ${code} not found in this shipment`);
    }
  };

  const handleReceive = () => {
    if (!activeItemId || !quantity || !binLocation) return;
    receiveItem.mutate({
      shipmentId,
      itemId: activeItemId,
      receivedQuantity: Number(quantity),
      binLocation,
      condition,
    }, {
      onSuccess: () => {
        setActiveItemId(null);
        setQuantity('');
        setBinLocation('');
        setCondition('GOOD');
      },
    });
  };

  const activeItem = data.items.find((i) => i.id === activeItemId);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">PO #{data.poNumber}</h1>
        <p className="text-sm text-gray-500">{data.supplierName} · {data.receivedItems}/{data.expectedItems} items received</p>
      </div>

      {/* Scanner */}
      <ScannerInput onScan={handleScan} placeholder="Scan item barcode..." />

      {/* Active item form */}
      {activeItem && (
        <Card className="border-2 border-primary">
          <CardHeader><CardTitle className="text-primary">{activeItem.productName}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">SKU: {activeItem.sku} · Expected: {activeItem.expectedQuantity}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Quantity Received</Label>
                <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="mt-1 scanner-input" min={0} max={activeItem.expectedQuantity} />
              </div>
              <div>
                <Label>Bin Location</Label>
                <Input value={binLocation} onChange={(e) => setBinLocation(e.target.value.toUpperCase())} className="mt-1 scanner-input" placeholder="A-01-03" />
              </div>
            </div>
            <div>
              <Label>Condition</Label>
              <div className="mt-2 flex gap-3">
                <Button variant={condition === 'GOOD' ? 'default' : 'outline'} size="lg" className="flex-1 touch-target" onClick={() => setCondition('GOOD')}>
                  <Check className="mr-2 h-5 w-5" /> Good
                </Button>
                <Button variant={condition === 'DAMAGED' ? 'destructive' : 'outline'} size="lg" className="flex-1 touch-target" onClick={() => setCondition('DAMAGED')}>
                  <X className="mr-2 h-5 w-5" /> Damaged
                </Button>
              </div>
            </div>
            <Button onClick={handleReceive} size="lg" className="w-full touch-target" disabled={receiveItem.isPending || !quantity || !binLocation}>
              {receiveItem.isPending ? 'Recording...' : 'Confirm Receipt'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Item list */}
      <div className="space-y-2">
        <h3 className="font-semibold">Items</h3>
        {data.items.map((item) => {
          const isComplete = item.receivedQuantity >= item.expectedQuantity;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveItemId(item.id); setQuantity(String(item.expectedQuantity - item.receivedQuantity)); }}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors',
                isComplete ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white hover:bg-gray-50',
                item.id === activeItemId && 'ring-2 ring-primary',
              )}
            >
              <div className={cn('flex h-8 w-8 items-center justify-center rounded-full', isComplete ? 'bg-green-500' : 'bg-gray-200')}>
                {isComplete ? <Check className="h-4 w-4 text-white" /> : <span className="text-xs font-bold text-gray-500">{item.receivedQuantity}/{item.expectedQuantity}</span>}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-gray-500">SKU: {item.sku} {item.binLocation ? `· Bin: ${item.binLocation}` : ''}</p>
              </div>
              {item.condition === 'DAMAGED' && <AlertTriangle className="h-5 w-5 text-red-500" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
