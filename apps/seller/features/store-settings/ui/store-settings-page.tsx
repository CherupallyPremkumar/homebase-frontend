'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Switch, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '@homebase/ui';
import {
  Palette, Store, Clock, FileText, Share2, Upload, Image, Sun, Moon, Smartphone,
} from 'lucide-react';

/* ---------- mock data ---------- */

const themes = [
  { id: 'classic', name: 'Classic', desc: 'Clean and minimal', preview: 'bg-white border-gray-200' },
  { id: 'modern', name: 'Modern', desc: 'Bold and contemporary', preview: 'bg-gray-900 border-gray-700' },
  { id: 'warm', name: 'Warm', desc: 'Cozy and inviting', preview: 'bg-orange-50 border-orange-200' },
  { id: 'dark', name: 'Dark', desc: 'Sleek dark mode', preview: 'bg-gray-800 border-gray-600' },
];

const colorSwatches = ['#F97316', '#EF4444', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#6366F1'];

const businessHours = [
  { day: 'Monday', open: '09:00', close: '21:00', isOpen: true },
  { day: 'Tuesday', open: '09:00', close: '21:00', isOpen: true },
  { day: 'Wednesday', open: '09:00', close: '21:00', isOpen: true },
  { day: 'Thursday', open: '09:00', close: '21:00', isOpen: true },
  { day: 'Friday', open: '09:00', close: '21:00', isOpen: true },
  { day: 'Saturday', open: '10:00', close: '20:00', isOpen: true },
  { day: 'Sunday', open: '10:00', close: '18:00', isOpen: false },
];

const socialLinks = [
  { platform: 'Instagram', handle: '@rajeshstore', url: 'https://instagram.com/rajeshstore' },
  { platform: 'Facebook', handle: 'Rajesh Store', url: 'https://facebook.com/rajeshstore' },
  { platform: 'Twitter / X', handle: '@rajeshstore', url: '' },
  { platform: 'YouTube', handle: '', url: '' },
];

export function StoreSettingsPage() {
  const [selectedTheme, setSelectedTheme] = useState('classic');
  const [selectedColor, setSelectedColor] = useState('#F97316');
  const [hours, setHours] = useState(businessHours);

  const toggleDay = (idx: number) => {
    setHours((prev) => prev.map((h, i) => (i === idx ? { ...h, isOpen: !h.isOpen } : h)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Store Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Customize your storefront appearance, policies, and business hours</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Preview Store</Button>
          <Button>Save Changes</Button>
        </div>
      </div>

      {/* Store Appearance */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
              <Palette className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <CardTitle className="text-base">Store Appearance</CardTitle>
              <p className="text-xs text-gray-400">Customize your storefront look and feel</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-6">
          {/* Banner & Logo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label>Store Banner</Label>
              <div className="mt-1.5 border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-orange-400 hover:bg-orange-50/30 transition cursor-pointer">
                <Image className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Upload store banner</p>
                <p className="text-xs text-gray-400 mt-1">Recommended: 1200 x 300px, JPG/PNG</p>
              </div>
            </div>
            <div>
              <Label>Store Logo</Label>
              <div className="mt-1.5 border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-orange-400 hover:bg-orange-50/30 transition cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-2">RS</div>
                <p className="text-sm font-medium text-gray-600">Change logo</p>
                <p className="text-xs text-gray-400 mt-1">400 x 400px, PNG/JPG</p>
              </div>
            </div>
          </div>

          {/* Brand Color */}
          <div>
            <Label>Brand Color</Label>
            <div className="flex items-center gap-3 mt-2">
              {colorSwatches.map((c) => (
                <button
                  key={c}
                  className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${selectedColor === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setSelectedColor(c)}
                />
              ))}
              <div className="ml-2 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border">
                <div className="w-5 h-5 rounded" style={{ backgroundColor: selectedColor }} />
                <span className="text-sm text-gray-600 font-mono">{selectedColor}</span>
              </div>
            </div>
          </div>

          {/* Theme Selection */}
          <div>
            <Label>Store Theme</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${selectedTheme === t.id ? 'border-orange-500 shadow-md bg-orange-50/30' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => setSelectedTheme(t.id)}
                >
                  <div className={`w-full h-16 rounded-lg border mb-3 ${t.preview}`} />
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Store Information */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <Store className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-base">Store Information</CardTitle>
              <p className="text-xs text-gray-400">Basic details displayed on your storefront</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label>Store Display Name</Label>
              <Input defaultValue="Rajesh Store" className="mt-1.5" />
            </div>
            <div>
              <Label>Store Tagline</Label>
              <Input defaultValue="Premium Home Furnishings & Decor" className="mt-1.5" />
            </div>
            <div className="md:col-span-2">
              <Label>About the Store</Label>
              <Textarea
                defaultValue="We are a premium seller of home furnishings, decor and kitchenware. Established in 2020, we bring you the finest quality products for the modern Indian home. With over 300 carefully curated products, we strive to make every house a beautiful home."
                rows={4}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Contact Email (Public)</Label>
              <Input defaultValue="contact@rajeshstore.in" className="mt-1.5" />
            </div>
            <div>
              <Label>Contact Phone (Public)</Label>
              <Input defaultValue="+91 80 4567 8901" className="mt-1.5" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
              <Clock className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <CardTitle className="text-base">Business Hours</CardTitle>
              <p className="text-xs text-gray-400">Set your store operating hours</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="space-y-3">
            {hours.map((h, i) => (
              <div key={h.day} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50/50">
                <div className="flex items-center gap-4 flex-1">
                  <Switch checked={h.isOpen} onCheckedChange={() => toggleDay(i)} />
                  <span className={`text-sm font-medium w-24 ${h.isOpen ? 'text-gray-700' : 'text-gray-400'}`}>{h.day}</span>
                </div>
                {h.isOpen ? (
                  <div className="flex items-center gap-2">
                    <Input defaultValue={h.open} className="w-24 text-center text-sm h-8" />
                    <span className="text-gray-400 text-sm">to</span>
                    <Input defaultValue={h.close} className="w-24 text-center text-sm h-8" />
                  </div>
                ) : (
                  <span className="text-sm text-gray-400 italic">Closed</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Store Policies */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
                <FileText className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <CardTitle className="text-base">Store Policies</CardTitle>
                <p className="text-xs text-gray-400">Define return, shipping, and privacy policies</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div>
              <Label>Return Policy</Label>
              <Textarea
                defaultValue="We offer hassle-free returns within 7 days of delivery. Products must be unused and in original packaging. Refund will be processed within 5-7 business days."
                rows={3}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Shipping Policy</Label>
              <Textarea
                defaultValue="Free shipping on orders above Rs. 499. Standard delivery takes 5-7 business days. Express delivery available at additional cost."
                rows={3}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Privacy Policy</Label>
              <Textarea
                defaultValue="We respect your privacy and protect your personal data. Your information is never shared with third parties without consent."
                rows={3}
                className="mt-1.5"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-pink-50 flex items-center justify-center">
                <Share2 className="h-5 w-5 text-pink-500" />
              </div>
              <div>
                <CardTitle className="text-base">Social Media</CardTitle>
                <p className="text-xs text-gray-400">Connect your social media accounts</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {socialLinks.map((s) => (
              <div key={s.platform}>
                <Label>{s.platform}</Label>
                <Input
                  defaultValue={s.url}
                  placeholder={`Enter your ${s.platform} URL`}
                  className="mt-1.5"
                />
                {s.handle && (
                  <p className="text-xs text-gray-400 mt-1">Handle: {s.handle}</p>
                )}
              </div>
            ))}
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
