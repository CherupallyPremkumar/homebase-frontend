'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Package,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Printer,
  CheckCircle2,
  Box,
} from 'lucide-react';
import { toast } from 'sonner';

interface FulfillmentLineItem {
  lineItemId: string;
  fulfillmentOrderId: string;
  productId: string;
  sku: string;
  quantityOrdered: number;
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

type PackageType = 'BOX_SMALL' | 'BOX_MEDIUM' | 'BOX_LARGE' | 'ENVELOPE' | 'POLY_MAILER' | 'CUSTOM';

const PACKAGE_TYPES: { value: PackageType; label: string; icon: string }[] = [
  { value: 'ENVELOPE', label: 'Envelope', icon: 'letter' },
  { value: 'POLY_MAILER', label: 'Poly Mailer', icon: 'bag' },
  { value: 'BOX_SMALL', label: 'Small Box', icon: 'box-s' },
  { value: 'BOX_MEDIUM', label: 'Medium Box', icon: 'box-m' },
  { value: 'BOX_LARGE', label: 'Large Box', icon: 'box-l' },
  { value: 'CUSTOM', label: 'Custom', icon: 'custom' },
];

interface PackStationProps {
  taskId: string;
}

export function PackStation({ taskId }: PackStationProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [packageType, setPackageType] = useState<PackageType>('BOX_MEDIUM');
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    height: '',
    weight: '',
  });

  const { data: lineItems, isLoading, error } = useQuery({
    queryKey: ['fulfillment-line-items', taskId],
    queryFn: async (): Promise<FulfillmentLineItem[]> => {
      const api = getApiClient();
      const res = await api.post<SearchResponse<FulfillmentLineItem>>(
        '/fulfillment/fulfillment-line-items',
        { filters: { fulfillmentId: taskId } },
      );
      return res?.list?.map((entry) => entry.row) ?? [];
    },
    enabled: !!taskId,
  });

  const completePack = useMutation({
    mutationFn: () =>
      getApiClient().patch<unknown>(`/fulfillment/${taskId}/COMPLETE_PACK`, {
        packageType,
        lengthCm: dimensions.length ? parseFloat(dimensions.length) : null,
        widthCm: dimensions.width ? parseFloat(dimensions.width) : null,
        heightCm: dimensions.height ? parseFloat(dimensions.height) : null,
        weightGrams: dimensions.weight ? parseFloat(dimensions.weight) : null,
      }),
    onSuccess: () => {
      toast.success('Pack completed successfully');
      queryClient.invalidateQueries({ queryKey: ['wms-packing'] });
      queryClient.invalidateQueries({ queryKey: ['fulfillment-line-items', taskId] });
      router.push('/warehouse/packing');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to complete pack');
    },
  });

  const handlePrintLabel = () => {
    toast.info('Generating shipping label...');
    // In production, this would call an endpoint to generate and print the label
    window.print();
  };

  const totalWeight = lineItems?.reduce((sum, item) => sum + (item.weightGrams ?? 0) * item.quantityOrdered, 0) ?? 0;
  const isFormValid = packageType !== 'CUSTOM' || (dimensions.length && dimensions.width && dimensions.height);

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
        <p className="text-red-600">Failed to load packing items</p>
        <Button variant="outline" onClick={() => router.push('/warehouse/packing')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Queue
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push('/warehouse/packing')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-xl font-bold">Pack Station</h2>
          <p className="text-sm text-gray-500">
            Fulfillment {taskId.substring(0, 8)}...
          </p>
        </div>
      </div>

      {/* Items to pack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="h-5 w-5" />
            Items to Pack ({lineItems?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {lineItems?.map((item) => (
              <div key={item.lineItemId} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">{item.productName}</p>
                  <p className="text-sm text-gray-500">
                    SKU: {item.sku}
                    {item.brand && ` | ${item.brand}`}
                    {item.weightGrams > 0 && ` | ${item.weightGrams}g`}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">Qty: {item.quantityOrdered}</Badge>
                  {item.quantityPicked >= item.quantityOrdered ? (
                    <Badge variant="default" className="ml-2 bg-green-100 text-green-800">
                      Picked
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="ml-2">
                      Pending Pick
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          {totalWeight > 0 && (
            <p className="mt-3 text-sm text-gray-500 border-t pt-3">
              Estimated total weight: {(totalWeight / 1000).toFixed(2)} kg
            </p>
          )}
        </CardContent>
      </Card>

      {/* Package type selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Box className="h-5 w-5" />
            Package Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {PACKAGE_TYPES.map((pkg) => (
              <button
                key={pkg.value}
                onClick={() => setPackageType(pkg.value)}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                  packageType === pkg.value
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Box className="h-8 w-8" />
                <span className="text-sm font-medium">{pkg.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dimensions form (shown for CUSTOM or always editable) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Package Dimensions {packageType !== 'CUSTOM' && '(optional)'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Length (cm)
              </label>
              <Input
                type="number"
                min="0"
                step="0.1"
                placeholder="0.0"
                value={dimensions.length}
                onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Width (cm)
              </label>
              <Input
                type="number"
                min="0"
                step="0.1"
                placeholder="0.0"
                value={dimensions.width}
                onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Height (cm)
              </label>
              <Input
                type="number"
                min="0"
                step="0.1"
                placeholder="0.0"
                value={dimensions.height}
                onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Weight (g)
              </label>
              <Input
                type="number"
                min="0"
                step="1"
                placeholder={totalWeight > 0 ? String(totalWeight) : '0'}
                value={dimensions.weight}
                onChange={(e) => setDimensions({ ...dimensions, weight: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="sticky bottom-4 flex gap-3 pt-4">
        <Button
          variant="outline"
          size="lg"
          className="touch-target"
          onClick={handlePrintLabel}
        >
          <Printer className="mr-2 h-5 w-5" /> Print Label
        </Button>
        <Button
          size="lg"
          className="flex-1 touch-target text-lg"
          disabled={!isFormValid || completePack.isPending}
          onClick={() => completePack.mutate()}
        >
          {completePack.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Completing...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5" /> Complete Pack
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
