'use client';

import Link from 'next/link';
import { EntityDetailLayout, SectionSkeleton, ErrorSection, formatDate } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@homebase/ui';
import { MapPin, Truck, CheckCircle2 } from 'lucide-react';
import { useShipmentDetail, useShipmentMutation } from '../api/queries';

interface ShipmentDetailProps {
  id: string;
}

export function ShipmentDetail({ id }: ShipmentDetailProps) {
  const { data, isLoading, error, refetch } = useShipmentDetail(id);
  const mutation = useShipmentMutation();

  if (isLoading) return <SectionSkeleton rows={6} />;
  if (error) return <ErrorSection error={error} onRetry={() => refetch()} />;
  if (!data) return null;

  const shipment = data.mutatedEntity;

  return (
    <EntityDetailLayout
      breadcrumbs={[{ label: 'Shipments', href: '/shipments' }, { label: shipment.trackingNumber || 'Pending' }]}
      title={`Shipment ${shipment.trackingNumber || 'Pending'}`}
      subtitle={`Order: ${shipment.orderId}`}
      state={shipment.stateId}
      allowedActions={data.allowedActionsAndMetadata}
      onAction={(eventId) => mutation.mutate({ id, eventId })}
      actionLoading={mutation.isPending}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Shipment info */}
        <Card>
          <CardHeader><CardTitle>Shipment Info</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Tracking #</span>
              <span className="font-medium">{shipment.trackingNumber || 'Pending'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Carrier</span>
              <span className="font-medium">{shipment.carrier || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Est. Delivery</span>
              <span className="font-medium">{shipment.estimatedDelivery ? formatDate(shipment.estimatedDelivery) : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Order</span>
              <Link href={`/orders/${shipment.orderId}`} className="font-medium text-primary hover:underline">
                View Order
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Tracking events */}
        <Card>
          <CardHeader><CardTitle>Tracking Events</CardTitle></CardHeader>
          <CardContent>
            {shipment.trackingEvents?.length ? (
              <div className="relative space-y-4 pl-6">
                <div className="absolute left-[9px] top-2 bottom-2 w-px bg-gray-200" />
                {shipment.trackingEvents.map((event, i) => (
                  <div key={i} className="relative flex gap-3 text-sm">
                    <div className="absolute -left-6 mt-0.5">
                      {i === 0 ? (
                        <Truck className="h-4 w-4 text-primary" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{event.status}</p>
                      {event.location && (
                        <p className="flex items-center gap-1 text-gray-500">
                          <MapPin className="h-3 w-3" />{event.location}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">{formatDate(event.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No tracking events yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </EntityDetailLayout>
  );
}
