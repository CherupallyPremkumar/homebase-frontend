'use client';

import Link from 'next/link';
import {
  Package,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';
import { Button, Separator } from '@homebase/ui';
import { formatDate, formatDateTime } from '@homebase/shared';
import { useOrderTracking } from '../api/tracking-queries';

interface OrderTrackingProps {
  orderId: string;
}

const TRACKING_STEPS = [
  { key: 'CREATED', label: 'Order Placed', icon: Package },
  { key: 'PAID', label: 'Payment Confirmed', icon: CreditCard },
  { key: 'PROCESSING', label: 'Processing', icon: Clock },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
];

function getStepIndex(stateId: string | undefined): number {
  if (!stateId) return 0;
  const idx = TRACKING_STEPS.findIndex((s) => s.key === stateId);
  return idx >= 0 ? idx : 0;
}

export function OrderTracking({ orderId }: OrderTrackingProps) {
  const { data, isLoading, error } = useOrderTracking(orderId);

  const order = data?.mutatedEntity;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-48 rounded bg-gray-200" />
          <div className="h-4 w-32 rounded bg-gray-100" />
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="h-3 w-16 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto flex min-h-[40vh] flex-col items-center justify-center px-4">
        <p className="text-gray-500">Unable to load tracking information.</p>
        <Link href={`/orders/${orderId}`}>
          <Button variant="outline" className="mt-4">
            Back to Order
          </Button>
        </Link>
      </div>
    );
  }

  const currentStepIndex = getStepIndex(order.stateId);
  const isCancelled = order.stateId === 'CANCELLED';

  return (
    <div className="container mx-auto px-4 py-6">
      <Link
        href={`/orders/${orderId}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Order
      </Link>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          Track Order #{order.orderNumber}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Placed {formatDate(order.createdAt || order.createdTime)}
        </p>
      </div>

      {/* Status Banner */}
      {isCancelled ? (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="font-medium text-red-800">This order has been cancelled.</p>
          {order.cancellationReason && (
            <p className="mt-1 text-sm text-red-600">Reason: {order.cancellationReason}</p>
          )}
        </div>
      ) : (
        <>
          {/* Visual Stepper */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex min-w-[500px] items-start justify-between">
              {TRACKING_STEPS.map((step, idx) => {
                const isComplete = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="flex flex-1 flex-col items-center">
                    <div className="relative flex w-full items-center">
                      {idx > 0 && (
                        <div
                          className={`absolute left-0 right-1/2 top-5 h-0.5 ${
                            idx <= currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                        />
                      )}
                      {idx < TRACKING_STEPS.length - 1 && (
                        <div
                          className={`absolute left-1/2 right-0 top-5 h-0.5 ${
                            idx < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                        />
                      )}
                      <div
                        className={`relative z-10 mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                          isCurrent
                            ? 'border-green-500 bg-green-500 text-white shadow-md shadow-green-200'
                            : isComplete
                              ? 'border-green-500 bg-green-50 text-green-600'
                              : 'border-gray-200 bg-white text-gray-400'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <span
                      className={`mt-2 text-center text-xs font-medium ${
                        isCurrent
                          ? 'text-green-700'
                          : isComplete
                            ? 'text-gray-700'
                            : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <Separator />

      {/* Tracking Details */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Shipping Info */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Shipping Details</h3>
          <dl className="space-y-2 text-sm">
            {order.trackingNumber && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Tracking Number</dt>
                <dd className="font-medium text-gray-900">{order.trackingNumber}</dd>
              </div>
            )}
            {order.estimatedDelivery && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Estimated Delivery</dt>
                <dd className="font-medium text-gray-900">
                  {formatDate(order.estimatedDelivery)}
                </dd>
              </div>
            )}
            {order.deliveredAt && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Delivered On</dt>
                <dd className="font-medium text-green-600">
                  {formatDate(order.deliveredAt)}
                </dd>
              </div>
            )}
            {!order.trackingNumber && !order.estimatedDelivery && !order.deliveredAt && (
              <p className="text-gray-400">Shipping details will appear once the order is shipped.</p>
            )}
          </dl>
        </div>

        {/* Activity Timeline */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Activity Log</h3>
          {order.activities && order.activities.length > 0 ? (
            <div className="relative space-y-4">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-200" />
              {order.activities.map((activity, i) => (
                <div key={i} className="relative flex gap-3 pl-6">
                  <div
                    className={`absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-white ${
                      i === 0 ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {activity.name.replace(/_/g, ' ')}
                    </p>
                    {activity.comment && (
                      <p className="text-xs text-gray-500">{activity.comment}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      {formatDateTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No activity recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
