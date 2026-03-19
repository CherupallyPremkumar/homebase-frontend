'use client';

import { SectionSkeleton, ErrorSection } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle, Button, Separator, Badge } from '@homebase/ui';
import { Building2, Mail, Phone, MapPin, CreditCard, Edit } from 'lucide-react';
import { useSellerProfile } from '../api/queries';

export function SellerProfile() {
  const { data, isLoading, error, refetch } = useSellerProfile();

  if (isLoading) return <SectionSkeleton rows={4} />;
  if (error) return <ErrorSection error={error} onRetry={() => refetch()} />;
  if (!data) return null;

  const seller = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Business Profile</h1>
          <p className="text-sm text-gray-500">Your seller account details</p>
        </div>
        <Button variant="outline"><Edit className="mr-1 h-4 w-4" />Edit Profile</Button>
      </div>

      {/* Business info */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" />Business Information</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Business Name" value={seller.businessName} />
          <Field label="Legal Name" value={seller.legalName} />
          <Field label="Contact Person" value={seller.contactPerson} />
          <Field label="GSTIN" value={seller.gstin} />
          <Field label="PAN" value={seller.pan} />
          <Field label="Commission Rate" value={seller.commissionRate ? `${seller.commissionRate}%` : undefined} />
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" />Contact Details</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{seller.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{seller.phone}</span>
          </div>
        </CardContent>
      </Card>

      {/* Addresses */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" />Addresses</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {seller.businessAddress && (
            <div>
              <Badge variant="outline" className="mb-2">Business</Badge>
              <p className="text-sm text-gray-600">{seller.businessAddress.addressLine1}</p>
              <p className="text-sm text-gray-600">{seller.businessAddress.city}, {seller.businessAddress.state} {seller.businessAddress.pincode}</p>
            </div>
          )}
          {seller.warehouseAddress && (
            <div>
              <Badge variant="outline" className="mb-2">Warehouse</Badge>
              <p className="text-sm text-gray-600">{seller.warehouseAddress.addressLine1}</p>
              <p className="text-sm text-gray-600">{seller.warehouseAddress.city}, {seller.warehouseAddress.state} {seller.warehouseAddress.pincode}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bank details */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />Bank Details</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Bank Name" value={seller.bankName} />
          <Field label="Account Number" value={seller.bankAccountNumber ? `****${seller.bankAccountNumber.slice(-4)}` : undefined} />
          <Field label="IFSC Code" value={seller.bankIfsc} />
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-0.5 font-medium">{value || '—'}</p>
    </div>
  );
}
