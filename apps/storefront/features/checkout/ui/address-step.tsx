'use client';

import { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@homebase/ui';
import type { Address } from '@homebase/types';

interface AddressStepProps {
  onSubmit: (address: Address) => void;
  loading: boolean;
  savedAddresses?: Address[];
}

export function AddressStep({ onSubmit, loading, savedAddresses = [] }: AddressStepProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    savedAddresses.find((a) => a.isDefault)?.id ?? null,
  );
  const [showNew, setShowNew] = useState(savedAddresses.length === 0);

  // New address form state
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    pincode: '',
    city: '',
    state: '',
    country: 'India',
  });

  const handleSubmit = () => {
    if (selectedId && !showNew) {
      const addr = savedAddresses.find((a) => a.id === selectedId);
      if (addr) onSubmit(addr);
    } else {
      onSubmit({ ...form, type: 'HOME' } as Address);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Address</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Saved addresses */}
        {savedAddresses.length > 0 && !showNew && (
          <div className="space-y-3">
            {savedAddresses.map((addr) => (
              <label
                key={addr.id}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                  selectedId === addr.id ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  checked={selectedId === addr.id}
                  onChange={() => setSelectedId(addr.id!)}
                  className="mt-1"
                />
                <div className="text-sm">
                  <p className="font-medium">{addr.fullName}</p>
                  <p className="text-gray-500">{addr.addressLine1}</p>
                  <p className="text-gray-500">
                    {addr.city}, {addr.state} {addr.pincode}
                  </p>
                  <p className="text-gray-500">{addr.phone}</p>
                </div>
              </label>
            ))}
            <Button variant="outline" size="sm" onClick={() => setShowNew(true)}>
              Add new address
            </Button>
          </div>
        )}

        {/* New address form */}
        {showNew && (
          <>
            {savedAddresses.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setShowNew(false)}>
                Use saved address
              </Button>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="address1">Address Line 1</Label>
              <Input id="address1" value={form.addressLine1} onChange={(e) => updateField('addressLine1', e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="address2">Address Line 2 (optional)</Label>
              <Input id="address2" value={form.addressLine2} onChange={(e) => updateField('addressLine2', e.target.value)} className="mt-1" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" value={form.pincode} onChange={(e) => updateField('pincode', e.target.value)} maxLength={6} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" value={form.city} onChange={(e) => updateField('city', e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" value={form.state} onChange={(e) => updateField('state', e.target.value)} className="mt-1" />
              </div>
            </div>
          </>
        )}

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : 'Continue to Payment'}
        </Button>
      </CardContent>
    </Card>
  );
}
