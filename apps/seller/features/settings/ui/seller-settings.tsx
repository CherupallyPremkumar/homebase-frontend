'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Switch, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '@homebase/ui';
import {
  Store, Bell, Truck, Receipt, Shield, Upload, Globe, Monitor, Smartphone, Mail,
} from 'lucide-react';

/* ---------- mock data ---------- */

const notificationSettings = [
  { id: 'new-order', label: 'New Order', desc: 'Get notified when a new order is placed', defaultOn: true },
  { id: 'order-shipped', label: 'Order Shipped', desc: 'Confirmation when order is shipped', defaultOn: true },
  { id: 'low-stock', label: 'Low Stock Alert', desc: 'Alert when inventory falls below threshold', defaultOn: true },
  { id: 'payment-received', label: 'Payment Received', desc: 'Notification on successful payment', defaultOn: true },
  { id: 'customer-review', label: 'Customer Review', desc: 'Alert when a customer leaves a review', defaultOn: false },
];

const channels = [
  { id: 'email', label: 'Email', detail: 'rajesh@store.com', icon: Mail, defaultOn: true },
  { id: 'sms', label: 'SMS', detail: '+91 98765 43210', icon: Smartphone, defaultOn: true },
  { id: 'push', label: 'Push Notifications', detail: 'Browser & mobile app', icon: Bell, defaultOn: false },
];

const loginHistory = [
  { device: 'Chrome on macOS', ip: '103.21.58.xxx', location: 'Bengaluru, India', time: 'Active now', current: true },
  { device: 'HomeBase Seller App', ip: '103.21.58.xxx', location: 'Bengaluru, India', time: '2 hours ago', current: false },
  { device: 'Safari on iPhone', ip: '49.37.12.xxx', location: 'Mumbai, India', time: 'Mar 25, 2026', current: false },
];

export function SellerSettings() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const m: Record<string, boolean> = {};
    notificationSettings.forEach((n) => (m[n.id] = n.defaultOn));
    channels.forEach((c) => (m[`ch-${c.id}`] = c.defaultOn));
    return m;
  });

  const toggle = (key: string) => setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your store preferences, notifications, and account security</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Last saved: 28 Mar 2026, 10:45 AM</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-green-600 font-medium">All changes saved</span>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Store Settings - spans full width */}
        <Card className="xl:col-span-2">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
                <Store className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <CardTitle className="text-base">Store Settings</CardTitle>
                <p className="text-xs text-gray-400">Configure your store profile and branding</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label>Store Name</Label>
                <Input defaultValue="Rajesh Store" className="mt-1.5" />
              </div>
              <div>
                <Label>Store Category</Label>
                <Select defaultValue="home-furniture">
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home-furniture">Home & Furniture</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                    <SelectItem value="kitchen">Kitchen & Dining</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>Store Description</Label>
                <Textarea
                  defaultValue="Premium home furnishings and decor at affordable prices. We offer handpicked furniture, kitchenware, and lifestyle products for the modern Indian home."
                  rows={3}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Store Logo</Label>
                <div className="mt-1.5 border-2 border-dashed border-gray-200 rounded-lg p-5 text-center hover:border-orange-400 hover:bg-orange-50/30 transition cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">RS</div>
                  <p className="text-sm font-medium text-gray-600">Click to upload new logo</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB. Recommended 400x400px</p>
                </div>
              </div>
              <div>
                <Label>Store URL</Label>
                <div className="flex items-stretch mt-1.5">
                  <span className="inline-flex items-center bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg px-3.5 text-sm text-gray-500 whitespace-nowrap">homebase.in/store/</span>
                  <Input defaultValue="rajesh-store" className="rounded-l-none" />
                </div>
                <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-green-100 flex items-center justify-center"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /></span>
                  This URL is available
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <Bell className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-base">Notification Preferences</CardTitle>
                <p className="text-xs text-gray-400">Choose what alerts you receive</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-5">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Order Alerts</p>
              <div className="space-y-3">
                {notificationSettings.map((n) => (
                  <div key={n.id} className="flex items-center justify-between py-1.5">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{n.label}</p>
                      <p className="text-xs text-gray-400">{n.desc}</p>
                    </div>
                    <Switch checked={toggles[n.id]} onCheckedChange={() => toggle(n.id)} />
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Notification Channels</p>
              <div className="space-y-3">
                {channels.map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                        <c.icon className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{c.label}</p>
                        <p className="text-xs text-gray-400">{c.detail}</p>
                      </div>
                    </div>
                    <Switch checked={toggles[`ch-${c.id}`]} onCheckedChange={() => toggle(`ch-${c.id}`)} />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Settings */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                <Truck className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <CardTitle className="text-base">Shipping Settings</CardTitle>
                <p className="text-xs text-gray-400">Configure delivery methods and rates</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div>
              <Label>Default Shipping Method</Label>
              <Select defaultValue="standard">
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Delivery (5-7 days)</SelectItem>
                  <SelectItem value="express">Express Delivery (2-3 days)</SelectItem>
                  <SelectItem value="same-day">Same Day Delivery</SelectItem>
                  <SelectItem value="economy">Economy (7-10 days)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Free Shipping Threshold</Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">Rs.</span>
                  <Input defaultValue="499" className="pl-10" />
                </div>
              </div>
              <div>
                <Label>Flat Shipping Rate</Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">Rs.</span>
                  <Input defaultValue="49" className="pl-10" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <div>
                <p className="text-sm font-medium text-gray-700">COD (Cash on Delivery)</p>
                <p className="text-xs text-gray-400">Allow customers to pay on delivery</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between py-1.5">
              <div>
                <p className="text-sm font-medium text-gray-700">International Shipping</p>
                <p className="text-xs text-gray-400">Enable shipping to other countries</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Tax Settings */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                <Receipt className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <CardTitle className="text-base">Tax Settings</CardTitle>
                <p className="text-xs text-gray-400">Manage tax rates and GST configuration</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div>
              <Label>GSTIN</Label>
              <Input defaultValue="29ABCDE1234F1Z5" className="mt-1.5" readOnly />
            </div>
            <div>
              <Label>Default GST Rate</Label>
              <Select defaultValue="18">
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0% (Exempt)</SelectItem>
                  <SelectItem value="5">5% GST</SelectItem>
                  <SelectItem value="12">12% GST</SelectItem>
                  <SelectItem value="18">18% GST</SelectItem>
                  <SelectItem value="28">28% GST</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <div>
                <p className="text-sm font-medium text-gray-700">Inclusive Tax Pricing</p>
                <p className="text-xs text-gray-400">Product prices include GST</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between py-1.5">
              <div>
                <p className="text-sm font-medium text-gray-700">Auto-generate Invoices</p>
                <p className="text-xs text-gray-400">Create GST invoices automatically on each order</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                <Shield className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <CardTitle className="text-base">Account Security</CardTitle>
                <p className="text-xs text-gray-400">Manage passwords and login activity</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between py-2 px-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Password</p>
                <p className="text-xs text-gray-400">Last changed 45 days ago</p>
              </div>
              <Button variant="outline" size="sm">Change Password</Button>
            </div>
            <div className="flex items-center justify-between py-2 px-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Two-Factor Authentication</p>
                <p className="text-xs text-gray-400">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm">Enable 2FA</Button>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-4">Recent Login History</p>
              <div className="space-y-3">
                {loginHistory.map((lh, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Monitor className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{lh.device}</p>
                        <p className="text-xs text-gray-400">{lh.ip} &middot; {lh.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {lh.current ? (
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Active now</span>
                      ) : (
                        <span className="text-xs text-gray-400">{lh.time}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Bar */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Discard Changes</Button>
        <Button>Save All Settings</Button>
      </div>
    </div>
  );
}
