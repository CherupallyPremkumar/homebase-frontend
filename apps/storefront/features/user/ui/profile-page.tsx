'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit3,
  Plus,
  Home,
  Briefcase,
  Trash2,
  ShoppingBag,
  Truck,
  Heart,
  RefreshCw,
  MessageSquare,
  Settings,
  Clock,
  Star,
} from 'lucide-react';
import { AccountSidebar } from '@homebase/ui';

// ---------------------------------------------------------------------------
// Toggle switch sub-component
// ---------------------------------------------------------------------------
function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-brand-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// ProfilePage
// ---------------------------------------------------------------------------
export function ProfilePage() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [twoFA, setTwoFA] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <AccountSidebar
            userName="Premkumar"
            userEmail="premkumar@email.com"
            activePage="profile"
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-navy-900 to-navy-700 rounded-2xl p-8 mb-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-brand-500/10 rounded-full -translate-y-1/3 translate-x-1/4" />
            <div className="absolute right-16 bottom-0 w-40 h-40 bg-brand-400/10 rounded-full translate-y-1/3" />
            <div className="relative z-10">
              <h1 className="text-2xl font-extrabold text-white">Hello, Premkumar!</h1>
              <p className="text-gray-400 text-sm mt-1">Welcome back to your account dashboard</p>
              <div className="flex items-center gap-4 mt-4">
                <span className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Clock className="w-3.5 h-3.5 text-brand-400" />
                  Member since January 2024
                </span>
                <span className="inline-flex items-center gap-1.5 bg-brand-500/20 text-brand-300 text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Star className="w-3.5 h-3.5" />
                  Gold Member
                </span>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-navy-900">Personal Information</h2>
              <button className="text-sm text-brand-500 font-medium hover:underline flex items-center gap-1">
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { icon: User, label: 'Full Name', value: 'Premkumar Shanmugam' },
                { icon: Mail, label: 'Email Address', value: 'premkumar@email.com' },
                { icon: Phone, label: 'Phone Number', value: '+91 98765 43210' },
                { icon: Calendar, label: 'Date of Birth', value: '15 March 1990' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm text-navy-900 font-medium mt-0.5">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-navy-900">Saved Addresses</h2>
              <button className="text-sm text-brand-500 font-medium hover:underline flex items-center gap-1">
                <Plus className="w-4 h-4" />
                Add New
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Home Address (Default) */}
              <div className="border border-brand-200 bg-brand-50/30 rounded-xl p-5 relative">
                <span className="absolute top-3 right-3 bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Default</span>
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-4 h-4 text-brand-500" />
                  <p className="text-sm font-semibold text-navy-900">Home</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  42, Rajaji Nagar, 2nd Main Road,<br />
                  Bangalore, Karnataka - 560010
                </p>
                <p className="text-xs text-gray-400 mt-2">Phone: +91 98765 43210</p>
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-brand-100">
                  <button className="text-xs text-brand-600 font-medium hover:underline flex items-center gap-1">
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button className="text-xs text-red-500 font-medium hover:underline flex items-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>

              {/* Office Address */}
              <div className="border border-gray-200 rounded-xl p-5 relative">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <p className="text-sm font-semibold text-navy-900">Office</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Tech Park, Tower B, 5th Floor,<br />
                  Whitefield, Bangalore - 560066
                </p>
                <p className="text-xs text-gray-400 mt-2">Phone: +91 98765 43211</p>
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
                  <button className="text-xs text-brand-600 font-medium hover:underline flex items-center gap-1">
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button className="text-xs text-red-500 font-medium hover:underline flex items-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                  <button className="text-xs text-gray-500 font-medium hover:underline flex items-center gap-1 ml-auto">
                    Set as Default
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-navy-900">Payment Methods</h2>
              <button className="text-sm text-brand-500 font-medium hover:underline flex items-center gap-1">
                <Plus className="w-4 h-4" />
                Add New
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-brand-200 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-[10px] font-bold">VISA</div>
                  <div>
                    <p className="text-sm font-medium text-navy-900">Visa ending in 4827</p>
                    <p className="text-xs text-gray-400">Expires 09/2028</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded font-medium">Default</span>
                  <button className="text-xs text-gray-400 hover:text-brand-500">Edit</button>
                  <button className="text-xs text-gray-400 hover:text-red-500">Remove</button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-brand-200 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-purple-600 rounded flex items-center justify-center text-white text-[10px] font-bold">UPI</div>
                  <div>
                    <p className="text-sm font-medium text-navy-900">premkumar@okicici</p>
                    <p className="text-xs text-gray-400">UPI ID</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-xs text-gray-400 hover:text-brand-500">Set Default</button>
                  <button className="text-xs text-gray-400 hover:text-red-500">Remove</button>
                </div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-bold text-navy-900 mb-5">Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-50">
                <div>
                  <p className="text-sm font-medium text-navy-900">Email Notifications</p>
                  <p className="text-xs text-gray-400">Receive order updates and promotions via email</p>
                </div>
                <Toggle enabled={emailNotif} onToggle={() => setEmailNotif(!emailNotif)} />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-50">
                <div>
                  <p className="text-sm font-medium text-navy-900">SMS Notifications</p>
                  <p className="text-xs text-gray-400">Get delivery updates via SMS</p>
                </div>
                <Toggle enabled={smsNotif} onToggle={() => setSmsNotif(!smsNotif)} />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-50">
                <div>
                  <p className="text-sm font-medium text-navy-900">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-400">Add an extra layer of security to your account</p>
                </div>
                <Toggle enabled={twoFA} onToggle={() => setTwoFA(!twoFA)} />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-red-600">Delete Account</p>
                  <p className="text-xs text-gray-400">Permanently delete your account and data</p>
                </div>
                <button className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition">
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links Grid */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-navy-900 mb-4">Quick Links</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: ShoppingBag, label: 'My Orders', desc: 'Track, return or buy again', href: '/orders', bgColor: 'bg-brand-50', iconColor: 'text-brand-500' },
                { icon: Truck, label: 'Track Order', desc: 'Check delivery status', href: '/orders', bgColor: 'bg-blue-50', iconColor: 'text-blue-500' },
                { icon: Heart, label: 'Wishlist', desc: 'Your saved items', href: '/wishlist', bgColor: 'bg-red-50', iconColor: 'text-red-400' },
                { icon: RefreshCw, label: 'Returns', desc: 'Manage your returns', href: '/returns', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-500' },
                { icon: MessageSquare, label: 'Support', desc: 'Get help & contact us', href: '#', bgColor: 'bg-purple-50', iconColor: 'text-purple-500' },
                { icon: Settings, label: 'Settings', desc: 'Password & preferences', href: '#', bgColor: 'bg-gray-100', iconColor: 'text-gray-500' },
              ].map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4 transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-brand-500"
                  >
                    <div className={`w-11 h-11 rounded-xl ${link.bgColor} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${link.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy-900">{link.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{link.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
