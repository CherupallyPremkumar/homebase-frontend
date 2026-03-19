'use client';

import { useState } from 'react';
import { Button, Input, Label } from '@homebase/ui';
import type { Address } from '@homebase/types';

interface AddressFormProps {
  initialValues?: Partial<Address>;
  onSubmit: (values: Omit<Address, 'id'>) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function AddressForm({ initialValues, onSubmit, onCancel, isLoading }: AddressFormProps) {
  const [fullName, setFullName] = useState(initialValues?.fullName || '');
  const [phone, setPhone] = useState(initialValues?.phone || '');
  const [addressLine1, setAddressLine1] = useState(initialValues?.addressLine1 || '');
  const [addressLine2, setAddressLine2] = useState(initialValues?.addressLine2 || '');
  const [pincode, setPincode] = useState(initialValues?.pincode || '');
  const [city, setCity] = useState(initialValues?.city || '');
  const [state, setState] = useState(initialValues?.state || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      fullName,
      phone,
      addressLine1,
      addressLine2,
      pincode,
      city,
      state,
      country: 'IN',
      isDefault: initialValues?.isDefault || false,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="af-fullName">Full Name</Label>
          <Input
            id="af-fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="af-phone">Phone</Label>
          <Input
            id="af-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
            required
            className="mt-1"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="af-address1">Address Line 1</Label>
        <Input
          id="af-address1"
          value={addressLine1}
          onChange={(e) => setAddressLine1(e.target.value)}
          placeholder="House/Flat No., Street"
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="af-address2">Address Line 2</Label>
        <Input
          id="af-address2"
          value={addressLine2}
          onChange={(e) => setAddressLine2(e.target.value)}
          placeholder="Landmark (optional)"
          className="mt-1"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="af-pincode">Pincode</Label>
          <Input
            id="af-pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="560001"
            maxLength={6}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="af-city">City</Label>
          <Input
            id="af-city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Bangalore"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="af-state">State</Label>
          <Input
            id="af-state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Karnataka"
            required
            className="mt-1"
          />
        </div>
      </div>
      <div className="flex gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Address'}
        </Button>
      </div>
    </form>
  );
}
