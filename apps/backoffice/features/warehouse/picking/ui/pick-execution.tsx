'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';
import type { SearchResponse } from '@homebase/types';
import { Button, Badge, Card, CardContent } from '@homebase/ui';
import { Package, CheckCircle2, AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ScannerInput } from '../../ui/scanner-input';

interface FulfillmentLineItem {
  lineItemId: string;
  fulfillmentOrderId: string;
  productId: string;
  variantId: string;
  sku: string;
  quantityOrdered: number;
  quantityAllocated: number;
  quantityPicked: number;
  quantityPacked: number;
  binLocation: string;
  itemStatus: string;
  productName: string;
  brand: string;
  weightGrams: number;
  unitPrice: number;
  totalPrice: number;
}

interface PickExecutionProps {
  pickListId: string;
}

export function PickExecution({ pickListId }: PickExecutionProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pickedItems, setPickedItems] = useState<Set<string>>(new Set());
  const [scanError, setScanError] = useState<string | null>(null);

  const { data: lineItems, isLoading, error } = useQuery({
    queryKey: ['fulfillment-line-items', pickListId],
    queryFn: async (): Promise<FulfillmentLineItem[]> => {
      const api = getApiClient();
      const res = await api.post<SearchResponse<FulfillmentLineItem>>(
        '/fulfillment/fulfillment-line-items',
        { filters: { fulfillmentId: pickListId } },
      );
      return res?.list?.map((entry) => entry.row) ?? [];
    },
    enabled: !!pickListId,
  });

  const completePick = useMutation({
    mutationFn: () =>
      getApiClient().patch<unknown>(`/fulfillment/${pickListId}/COMPLETE_PICK`, {}),
    onSuccess: () => {
      toast.success('Pick completed successfully');
      queryClient.invalidateQueries({ queryKey: ['wms-picks'] });
      queryClient.invalidateQueries({ queryKey: ['fulfillment-line-items', pickListId] });
      router.push('/warehouse/picking');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to complete pick');
    },
  });

  const handleScan = useCallback(
    (code: string) => {
      setScanError(null);
      if (!lineItems) return;

      const matchedItem = lineItems.find(
        (item) => item.sku === code || item.lineItemId === code,
      );

      if (!matchedItem) {
        setScanError(`Item "${code}" not found in this pick list`);
        toast.error(`Item "${code}" not found in this pick list`);
        return;
      }

      if (pickedItems.has(matchedItem.lineItemId)) {
        setScanError(`Item "${matchedItem.productName}" already picked`);
        toast.warning(`Item "${matchedItem.productName}" already picked`);
        return;
      }

      setPickedItems((prev) => new Set(prev).add(matchedItem.lineItemId));
      toast.success(`Picked: ${matchedItem.productName}`);
    },
    [lineItems, pickedItems],
  );

  const toggleItem = useCallback((lineItemId: string) => {
    setPickedItems((prev) => {
      const next = new Set(prev);
      if (next.has(lineItemId)) {
        next.delete(lineItemId);
      } else {
        next.add(lineItemId);
      }
      return next;
    });
  }, []);

  const totalItems = lineItems?.length ?? 0;
  const pickedCount = pickedItems.size;
  const allPicked = totalItems > 0 && pickedCount === totalItems;
  const progressPct = totalItems > 0 ? Math.round((pickedCount / totalItems) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-400" />
        <p className="text-red-600">Failed to load pick list items</p>
        <Button variant="outline" onClick={() => router.push('/warehouse/picking')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Queue
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push('/warehouse/picking')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-xl font-bold">Pick Execution</h2>
            <p className="text-sm text-gray-500">
              Fulfillment {pickListId.substring(0, 8)}...
            </p>
          </div>
        </div>
        <Badge variant={allPicked ? 'default' : 'secondary'} className="text-base px-3 py-1">
          {pickedCount} / {totalItems} picked
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="h-3 w-full rounded-full bg-gray-200">
        <div
          className="h-3 rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Scanner */}
      <div className="space-y-2">
        <ScannerInput
          onScan={handleScan}
          placeholder="Scan item barcode or enter SKU..."
          disabled={allPicked}
        />
        {scanError && (
          <p className="flex items-center gap-1 text-sm text-red-600">
            <AlertTriangle className="h-4 w-4" /> {scanError}
          </p>
        )}
      </div>

      {/* Item list */}
      <div className="space-y-3">
        {lineItems?.map((item) => {
          const isPicked = pickedItems.has(item.lineItemId);
          return (
            <Card
              key={item.lineItemId}
              className={`cursor-pointer transition-all ${
                isPicked ? 'border-green-300 bg-green-50' : 'hover:shadow-md'
              }`}
              onClick={() => toggleItem(item.lineItemId)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    isPicked
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isPicked && <CheckCircle2 className="h-5 w-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${isPicked ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                    {item.productName}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                    <span>SKU: {item.sku}</span>
                    {item.brand && <span>Brand: {item.brand}</span>}
                    <span>Qty: {item.quantityOrdered}</span>
                  </div>
                </div>

                {item.binLocation && (
                  <Badge variant="outline" className="flex-shrink-0 font-mono text-sm">
                    <Package className="mr-1 h-3 w-3" />
                    {item.binLocation}
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}

        {totalItems === 0 && (
          <div className="py-12 text-center text-gray-500">
            No items found for this fulfillment order.
          </div>
        )}
      </div>

      {/* Complete button */}
      {totalItems > 0 && (
        <div className="sticky bottom-4 pt-4">
          <Button
            size="lg"
            className="w-full touch-target text-lg"
            disabled={!allPicked || completePick.isPending}
            onClick={() => completePick.mutate()}
          >
            {completePick.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Completing...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" /> Complete Pick ({pickedCount}/{totalItems})
              </>
            )}
          </Button>
          {!allPicked && (
            <p className="mt-2 text-center text-sm text-gray-500">
              Pick all items before completing
            </p>
          )}
        </div>
      )}
    </div>
  );
}
