'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';
import type { SearchResponse } from '@homebase/types';
import {
  Button,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from '@homebase/ui';
import {
  ArrowLeft,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  ClipboardList,
} from 'lucide-react';
import { toast } from 'sonner';
import { ScannerInput } from '../../ui/scanner-input';

interface InventoryAtLocation {
  warehouseInventoryId: string;
  productId: string;
  variantId: string;
  sku: string;
  expectedQuantity: number;
  quantityReserved: number;
  quantityAvailable: number;
  quantityDamaged: number;
  lastCountedAt: string | null;
  locationId: string;
  locationCode: string;
  zone: string;
  aisle: string;
  shelf: string;
  bin: string;
  locationType: string;
  productName: string;
  brand: string;
}

interface CountExecutionProps {
  taskId: string;
}

export function CountExecution({ taskId }: CountExecutionProps) {
  const router = useRouter();
  const [actualCounts, setActualCounts] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [highlightedSku, setHighlightedSku] = useState<string | null>(null);

  const { data: inventoryItems, isLoading, error } = useQuery({
    queryKey: ['warehouse-inventory-by-location', taskId],
    queryFn: async (): Promise<InventoryAtLocation[]> => {
      const api = getApiClient();
      const res = await api.post<SearchResponse<InventoryAtLocation>>(
        '/warehouse/warehouse-inventory-by-location',
        { filters: { locationId: taskId } },
      );
      return res?.list?.map((entry) => entry.row) ?? [];
    },
    enabled: !!taskId,
  });

  const submitCount = useMutation({
    mutationFn: () => {
      const adjustments = (inventoryItems ?? [])
        .filter((item) => actualCounts[item.warehouseInventoryId] !== undefined)
        .map((item) => ({
          warehouseInventoryId: item.warehouseInventoryId,
          locationId: item.locationId,
          productId: item.productId,
          sku: item.sku,
          expectedQuantity: item.expectedQuantity,
          actualQuantity: parseInt(actualCounts[item.warehouseInventoryId] ?? '0', 10),
        }));

      return getApiClient().post<void>('/warehouse/cycle-count', {
        warehouseId: inventoryItems?.[0]?.locationId ? undefined : undefined,
        locationId: taskId,
        adjustments,
      });
    },
    onSuccess: () => {
      toast.success('Cycle count submitted successfully');
      router.push('/warehouse/cycle-count');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to submit cycle count');
      setShowConfirmation(false);
    },
  });

  const handleScan = (code: string) => {
    if (!inventoryItems) return;
    const match = inventoryItems.find((item) => item.sku === code);
    if (match) {
      setHighlightedSku(match.sku);
      // Focus the input for this item
      const el = document.getElementById(`count-${match.warehouseInventoryId}`);
      el?.focus();
      setTimeout(() => setHighlightedSku(null), 2000);
    } else {
      toast.error(`SKU "${code}" not found at this location`);
    }
  };

  const updateCount = (inventoryId: string, value: string) => {
    setActualCounts((prev) => ({ ...prev, [inventoryId]: value }));
  };

  const discrepancies = useMemo(() => {
    if (!inventoryItems) return [];
    return inventoryItems.filter((item) => {
      const actual = actualCounts[item.warehouseInventoryId];
      if (actual === undefined || actual === '') return false;
      return parseInt(actual, 10) !== item.expectedQuantity;
    });
  }, [inventoryItems, actualCounts]);

  const countedItems = Object.values(actualCounts).filter((v) => v !== '').length;
  const totalItems = inventoryItems?.length ?? 0;
  const allCounted = totalItems > 0 && countedItems === totalItems;
  const locationCode = inventoryItems?.[0]?.locationCode ?? taskId;

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
        <p className="text-red-600">Failed to load inventory for this location</p>
        <Button variant="outline" onClick={() => router.push('/warehouse/cycle-count')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Counts
        </Button>
      </div>
    );
  }

  // Confirmation view
  if (showConfirmation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setShowConfirmation(false)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-bold">Confirm Cycle Count</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Summary for {locationCode}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-4">
              <div className="rounded-lg bg-blue-50 px-4 py-2">
                <p className="text-sm text-gray-500">Items Counted</p>
                <p className="text-2xl font-bold">{countedItems}</p>
              </div>
              <div className="rounded-lg bg-yellow-50 px-4 py-2">
                <p className="text-sm text-gray-500">Discrepancies</p>
                <p className="text-2xl font-bold text-yellow-700">{discrepancies.length}</p>
              </div>
            </div>

            {discrepancies.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Discrepancies:</h4>
                <div className="divide-y rounded-lg border">
                  {discrepancies.map((item) => {
                    const actual = parseInt(actualCounts[item.warehouseInventoryId] ?? '0', 10);
                    const diff = actual - item.expectedQuantity;
                    return (
                      <div key={item.warehouseInventoryId} className="flex items-center justify-between p-3">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            Expected: {item.expectedQuantity} | Actual: {actual}
                          </p>
                          <Badge variant={diff > 0 ? 'default' : 'destructive'}>
                            {diff > 0 ? '+' : ''}{diff}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {discrepancies.length === 0 && (
              <p className="text-green-700">
                <CheckCircle2 className="mr-1 inline h-4 w-4" />
                No discrepancies found. All counts match expected quantities.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="touch-target"
            onClick={() => setShowConfirmation(false)}
          >
            Back to Counting
          </Button>
          <Button
            size="lg"
            className="flex-1 touch-target text-lg"
            disabled={submitCount.isPending}
            onClick={() => submitCount.mutate()}
          >
            {submitCount.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" /> Submit Count
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push('/warehouse/cycle-count')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-xl font-bold">Cycle Count</h2>
            <p className="text-sm text-gray-500">Location: {locationCode}</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-base px-3 py-1">
          {countedItems} / {totalItems} counted
        </Badge>
      </div>

      {/* Scanner to find items */}
      <ScannerInput
        onScan={handleScan}
        placeholder="Scan SKU to find item in list..."
      />

      {/* Inventory table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardList className="h-5 w-5" />
            Inventory Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3 pr-4 font-medium">Product</th>
                  <th className="pb-3 pr-4 font-medium">SKU</th>
                  <th className="pb-3 pr-4 font-medium text-right">Expected</th>
                  <th className="pb-3 pr-4 font-medium text-right">Actual</th>
                  <th className="pb-3 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {inventoryItems?.map((item) => {
                  const actual = actualCounts[item.warehouseInventoryId];
                  const hasValue = actual !== undefined && actual !== '';
                  const isDiscrepancy = hasValue && parseInt(actual, 10) !== item.expectedQuantity;
                  const isHighlighted = highlightedSku === item.sku;

                  return (
                    <tr
                      key={item.warehouseInventoryId}
                      className={`transition-colors ${
                        isHighlighted
                          ? 'bg-blue-50'
                          : isDiscrepancy
                            ? 'bg-yellow-50'
                            : ''
                      }`}
                    >
                      <td className="py-3 pr-4">
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        {item.brand && (
                          <p className="text-xs text-gray-500">{item.brand}</p>
                        )}
                      </td>
                      <td className="py-3 pr-4 font-mono text-gray-600">
                        {item.sku}
                      </td>
                      <td className="py-3 pr-4 text-right font-semibold">
                        {item.expectedQuantity}
                      </td>
                      <td className="py-3 pr-4 text-right">
                        <Input
                          id={`count-${item.warehouseInventoryId}`}
                          type="number"
                          min="0"
                          step="1"
                          className={`w-24 text-right ${
                            isDiscrepancy ? 'border-yellow-500 bg-yellow-50' : ''
                          }`}
                          placeholder="--"
                          value={actual ?? ''}
                          onChange={(e) =>
                            updateCount(item.warehouseInventoryId, e.target.value)
                          }
                        />
                      </td>
                      <td className="py-3 text-center">
                        {!hasValue && (
                          <Badge variant="outline" className="text-gray-400">
                            Pending
                          </Badge>
                        )}
                        {hasValue && !isDiscrepancy && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Match
                          </Badge>
                        )}
                        {hasValue && isDiscrepancy && (
                          <Badge variant="destructive">
                            <AlertTriangle className="mr-1 h-3 w-3" /> Mismatch
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalItems === 0 && (
            <div className="py-12 text-center text-gray-500">
              <RotateCcw className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              No inventory found at this location.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit button */}
      {totalItems > 0 && (
        <div className="sticky bottom-4 pt-4">
          <Button
            size="lg"
            className="w-full touch-target text-lg"
            disabled={countedItems === 0}
            onClick={() => setShowConfirmation(true)}
          >
            <ClipboardList className="mr-2 h-5 w-5" />
            Review &amp; Submit ({countedItems}/{totalItems} counted)
          </Button>
          {discrepancies.length > 0 && (
            <p className="mt-2 text-center text-sm text-yellow-600">
              <AlertTriangle className="mr-1 inline h-4 w-4" />
              {discrepancies.length} discrepanc{discrepancies.length === 1 ? 'y' : 'ies'} detected
            </p>
          )}
        </div>
      )}
    </div>
  );
}
