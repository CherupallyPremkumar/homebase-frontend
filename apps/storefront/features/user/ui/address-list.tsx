'use client';

import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@homebase/ui';
import type { Address } from '@homebase/types';

interface AddressListProps {
  addresses: Address[];
  onAddAddress?: () => void;
}

export function AddressList({ addresses, onAddAddress }: AddressListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Addresses</CardTitle>
        <Button variant="outline" size="sm" onClick={onAddAddress}>Add Address</Button>
      </CardHeader>
      <CardContent>
        {addresses.length === 0 ? (
          <p className="text-sm text-gray-500">No addresses saved yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {addresses.map((addr) => (
              <div key={addr.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                    <div className="text-sm">
                      <p className="font-medium">{addr.fullName}</p>
                      <p className="text-gray-500">{addr.addressLine1}</p>
                      {addr.addressLine2 && <p className="text-gray-500">{addr.addressLine2}</p>}
                      <p className="text-gray-500">{addr.city}, {addr.state} {addr.pincode}</p>
                      <p className="text-gray-500">{addr.phone}</p>
                    </div>
                  </div>
                  {addr.isDefault && (
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Default</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
