'use client';

import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input, Label } from '@homebase/ui';
import {
  User, Building2, Mail, Phone, MapPin, CreditCard, Edit, Camera, Star, Shield,
  Calendar, Globe, Award,
} from 'lucide-react';

/* ---------- mock data ---------- */

const personalInfo = {
  name: 'Rajesh Kumar',
  email: 'rajesh@store.com',
  phone: '+91 98765 43210',
  altPhone: '+91 87654 32109',
  dateOfBirth: '15 Aug 1985',
  language: 'English, Hindi',
};

const businessInfo = {
  businessName: 'Rajesh Store',
  legalName: 'Rajesh Enterprises Pvt. Ltd.',
  gstin: '29ABCDE1234F1Z5',
  pan: 'ABCDE1234F',
  businessType: 'Private Limited Company',
  cin: 'U74120KA2020PTC123456',
  yearEstablished: '2020',
  employees: '15-25',
};

const storeInfo = {
  storeName: 'Rajesh Store',
  category: 'Home & Furniture',
  rating: 4.6,
  totalReviews: 1248,
  productsListed: 342,
  ordersCompleted: 5670,
  sellerSince: 'Jan 2022',
  sellerTier: 'Premium Seller',
};

const bankDetails = {
  bankName: 'HDFC Bank',
  accountNumber: '****4567',
  ifsc: 'HDFC0001234',
  accountHolder: 'Rajesh Enterprises Pvt. Ltd.',
  accountType: 'Current Account',
  branch: 'Koramangala, Bengaluru',
};

const addresses = {
  business: { line1: '42, 3rd Floor, Brigade Road', line2: 'Koramangala', city: 'Bengaluru', state: 'Karnataka', pincode: '560034' },
  warehouse: { line1: '15, Industrial Area, Phase II', line2: 'Electronic City', city: 'Bengaluru', state: 'Karnataka', pincode: '560100' },
};

export function SellerProfile() {
  return (
    <div className="space-y-6">
      {/* Profile Banner */}
      <div className="relative rounded-xl overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700" />
        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
          <div className="flex items-end gap-5">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                RS
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">
                <Camera className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <div className="mb-1">
              <h1 className="text-2xl font-bold text-white">{businessInfo.businessName}</h1>
              <div className="flex items-center gap-3 mt-1">
                <Badge className="bg-white/20 text-white border-white/30">{storeInfo.sellerTier}</Badge>
                <div className="flex items-center gap-1 text-white/90 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{storeInfo.rating}</span>
                  <span className="text-white/60">({storeInfo.totalReviews} reviews)</span>
                </div>
              </div>
            </div>
          </div>
          <Button variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
            <Edit className="mr-1.5 h-4 w-4" />Edit Profile
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Products Listed', value: storeInfo.productsListed.toLocaleString(), icon: Award },
          { label: 'Orders Completed', value: storeInfo.ordersCompleted.toLocaleString(), icon: CreditCard },
          { label: 'Seller Since', value: storeInfo.sellerSince, icon: Calendar },
          { label: 'Seller Tier', value: storeInfo.sellerTier, icon: Shield },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                <s.icon className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-semibold">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-5 w-5 text-orange-500" />Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full Name" value={personalInfo.name} />
            <Field label="Email Address" value={personalInfo.email} icon={<Mail className="h-4 w-4 text-gray-400" />} />
            <Field label="Phone Number" value={personalInfo.phone} icon={<Phone className="h-4 w-4 text-gray-400" />} />
            <Field label="Alternate Phone" value={personalInfo.altPhone} icon={<Phone className="h-4 w-4 text-gray-400" />} />
            <Field label="Date of Birth" value={personalInfo.dateOfBirth} />
            <Field label="Language" value={personalInfo.language} icon={<Globe className="h-4 w-4 text-gray-400" />} />
          </div>
        </CardContent>
      </Card>

      {/* Business Information */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-5 w-5 text-orange-500" />Business Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Business Name" value={businessInfo.businessName} />
            <Field label="Legal Name" value={businessInfo.legalName} />
            <Field label="GSTIN" value={businessInfo.gstin} badge="Verified" />
            <Field label="PAN" value={businessInfo.pan} badge="Verified" />
            <Field label="Business Type" value={businessInfo.businessType} />
            <Field label="CIN" value={businessInfo.cin} />
            <Field label="Year Established" value={businessInfo.yearEstablished} />
            <Field label="Employees" value={businessInfo.employees} />
          </div>
        </CardContent>
      </Card>

      {/* Store Info */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-5 w-5 text-orange-500" />Store Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Store Name" value={storeInfo.storeName} />
            <Field label="Category" value={storeInfo.category} />
            <Field label="Store Rating" value={`${storeInfo.rating} / 5.0`} />
            <Field label="Total Reviews" value={storeInfo.totalReviews.toLocaleString()} />
          </div>
        </CardContent>
      </Card>

      {/* Addresses */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-5 w-5 text-orange-500" />Addresses
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="p-4 bg-gray-50 rounded-lg">
              <Badge variant="outline" className="mb-2">Business Address</Badge>
              <p className="text-sm text-gray-600">{addresses.business.line1}</p>
              <p className="text-sm text-gray-600">{addresses.business.line2}</p>
              <p className="text-sm text-gray-600">{addresses.business.city}, {addresses.business.state} {addresses.business.pincode}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Badge variant="outline" className="mb-2">Warehouse Address</Badge>
              <p className="text-sm text-gray-600">{addresses.warehouse.line1}</p>
              <p className="text-sm text-gray-600">{addresses.warehouse.line2}</p>
              <p className="text-sm text-gray-600">{addresses.warehouse.city}, {addresses.warehouse.state} {addresses.warehouse.pincode}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="h-5 w-5 text-orange-500" />Bank Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Bank Name" value={bankDetails.bankName} />
            <Field label="Account Number" value={bankDetails.accountNumber} />
            <Field label="IFSC Code" value={bankDetails.ifsc} />
            <Field label="Account Holder" value={bankDetails.accountHolder} />
            <Field label="Account Type" value={bankDetails.accountType} />
            <Field label="Branch" value={bankDetails.branch} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value, icon, badge }: { label: string; value: string; icon?: React.ReactNode; badge?: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-0.5">{label}</p>
      <div className="flex items-center gap-2">
        {icon}
        <p className="font-medium">{value}</p>
        {badge && <Badge className="bg-green-100 text-green-700 text-[10px]">{badge}</Badge>}
      </div>
    </div>
  );
}
