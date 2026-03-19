'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@homebase/ui';
import { AlertTriangle, Clock, Truck } from 'lucide-react';
import { useDelayedShipments } from '../api/queries';
import { formatDate } from '@homebase/shared';

export function OpsAlerts() {
  const { data: delayed } = useDelayedShipments();
  const shipments = delayed?.content ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Operations Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {shipments.length > 0 ? (
          <div className="space-y-3">
            {shipments.slice(0, 5).map((shipment) => (
              <Link
                key={shipment.id}
                href={`/shipments/${shipment.id}`}
                className="flex items-center justify-between rounded p-2 text-sm hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="font-medium">Delayed: {shipment.trackingNumber || 'Pending'}</p>
                    <p className="text-xs text-gray-500">
                      Est. {shipment.estimatedDelivery ? formatDate(shipment.estimatedDelivery) : 'N/A'}
                    </p>
                  </div>
                </div>
                <Clock className="h-4 w-4 text-red-400" />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-green-600">No active alerts. All operations running smoothly.</p>
        )}
      </CardContent>
    </Card>
  );
}
