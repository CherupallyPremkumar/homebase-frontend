'use client';

import Link from 'next/link';
import {
  ArrowLeft, ChevronRight, Ban, Mail, Lock, Trash2,
  CheckCircle, AlertCircle, User, LogIn, ShoppingCart,
  Star, RotateCcw,
} from 'lucide-react';
import { SectionSkeleton, ErrorSection, formatPriceRupees, formatNumber } from '@homebase/shared';
import { useUserAdminDetail, useUserMutation } from '../hooks/use-user';
import type { UserActivityEntry } from '../services/user-detail-mock';

// ----------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------

function StatusBadge({ label, color }: { label: string; color: string }) {
  const map: Record<string, string> = {
    green: 'bg-green-50 text-green-700',
    blue: 'bg-blue-50 text-blue-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    red: 'bg-red-50 text-red-700',
  };
  const dotMap: Record<string, string> = {
    green: 'bg-green-500', blue: 'bg-blue-500', yellow: 'bg-yellow-500', red: 'bg-red-500',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${map[color] ?? 'bg-gray-50 text-gray-600'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotMap[color] ?? 'bg-gray-400'}`} />
      {label}
    </span>
  );
}

function ActivityIcon({ entry }: { entry: UserActivityEntry }) {
  const iconMap: Record<string, { icon: typeof LogIn; color: string }> = {
    login: { icon: LogIn, color: 'text-green-600' },
    order: { icon: ShoppingCart, color: 'text-orange-600' },
    review: { icon: Star, color: 'text-yellow-600' },
    return: { icon: RotateCcw, color: 'text-red-600' },
  };
  const { icon: Icon, color } = iconMap[entry.iconType] ?? iconMap.login;
  return (
    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${entry.iconBg}`}>
      <Icon className={`h-4 w-4 ${color}`} />
    </div>
  );
}

function VerificationRow({ label, verified }: { label: string; verified: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      {verified ? (
        <span className="flex items-center gap-1 font-medium text-green-600">
          <CheckCircle className="h-4 w-4" /> Yes
        </span>
      ) : (
        <span className="flex items-center gap-1 font-medium text-yellow-600">
          <AlertCircle className="h-4 w-4" /> Not Enabled
        </span>
      )}
    </div>
  );
}

// ----------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------

interface UserDetailProps {
  id: string;
}

export function UserDetail({ id }: UserDetailProps) {
  const { data: user, isLoading, error, refetch } = useUserAdminDetail(id);
  const mutation = useUserMutation();

  // -- 4 states --
  if (isLoading) {
    return (
      <div className="space-y-6" role="status" aria-label="Loading user details">
        <SectionSkeleton rows={2} />
        <SectionSkeleton rows={6} />
      </div>
    );
  }

  if (error) {
    return <ErrorSection error={error} onRetry={() => refetch()} />;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center" role="alert">
        <User className="h-12 w-12 text-gray-300" />
        <p className="mt-4 text-lg font-semibold text-gray-600">User not found</p>
        <Link href="/users" className="mt-4 text-sm font-medium text-orange-600 hover:text-orange-700">Back to Users</Link>
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  const handleAction = (action: string) => {
    mutation.mutate({ id, eventId: action });
  };

  return (
    <article className="space-y-6" aria-label={`User: ${fullName}`}>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
        <Link href="/users" className="text-gray-400 hover:text-orange-500">Users</Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
        <span className="font-medium text-gray-700">{fullName}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/users" className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50" aria-label="Back to users">
            <ArrowLeft className="h-4 w-4 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
          <StatusBadge label={user.status} color={user.statusColor} />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { if (confirm('Suspend this user account?')) handleAction('suspend'); }}
            disabled={mutation.isPending}
            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <Ban className="h-4 w-4" /> Suspend
          </button>
          <button
            onClick={() => handleAction('contact')}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            <Mail className="h-4 w-4" /> Contact
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="User profile">
        <div className="flex items-center gap-5">
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold ${user.avatarBg}`}>
            {user.initials}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span>{user.email}</span>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <span>{user.phone}</span>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <span>Member since {user.memberSince}</span>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">{user.role}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT (2/3) */}
        <div className="space-y-6 lg:col-span-2">

          {/* Personal Info */}
          <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Personal information">
            <h3 className="mb-4 font-semibold text-gray-900">Personal Information</h3>
            <dl className="grid grid-cols-2 gap-4">
              <div><dt className="text-xs font-semibold uppercase text-gray-400">Full Name</dt><dd className="mt-1 text-sm font-medium text-gray-900">{fullName}</dd></div>
              <div><dt className="text-xs font-semibold uppercase text-gray-400">Email</dt><dd className="mt-1 text-sm text-gray-900">{user.email}</dd></div>
              <div><dt className="text-xs font-semibold uppercase text-gray-400">Phone</dt><dd className="mt-1 text-sm text-gray-900">{user.phone}</dd></div>
              <div><dt className="text-xs font-semibold uppercase text-gray-400">Date of Birth</dt><dd className="mt-1 text-sm text-gray-900">{user.dob}</dd></div>
              <div><dt className="text-xs font-semibold uppercase text-gray-400">Gender</dt><dd className="mt-1 text-sm text-gray-900">{user.gender}</dd></div>
              <div><dt className="text-xs font-semibold uppercase text-gray-400">Language</dt><dd className="mt-1 text-sm text-gray-900">{user.language}</dd></div>
            </dl>
          </section>

          {/* Order History */}
          <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Order history">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Order History</h3>
              <Link href="/orders" className="text-sm font-medium text-orange-500 hover:underline">View All &rarr;</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400">
                    <th className="pb-3 font-semibold">Order ID</th>
                    <th className="pb-3 font-semibold">Items</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {user.orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 font-mono text-xs text-orange-600">
                        <Link href={`/orders/${order.id.replace('#', '')}`} className="hover:underline">{order.id}</Link>
                      </td>
                      <td className="py-3">{order.items}</td>
                      <td className="py-3 font-medium">{formatPriceRupees(order.amount)}</td>
                      <td className="py-3"><StatusBadge label={order.status} color={order.statusColor} /></td>
                      <td className="py-3 text-gray-500">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Activity Log */}
          <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Activity log">
            <h3 className="mb-4 font-semibold text-gray-900">Activity Log</h3>
            <div className="space-y-4" role="list">
              {user.activities.map((activity, i) => (
                <div key={i} className="flex items-start gap-3" role="listitem">
                  <ActivityIcon entry={activity} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.event}</p>
                    <p className="text-xs text-gray-400">
                      {activity.date}
                      {activity.detail && <> &middot; {activity.detail}</>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Saved Addresses */}
          <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Saved addresses">
            <h3 className="mb-4 font-semibold text-gray-900">Saved Addresses</h3>
            <div className="grid grid-cols-2 gap-4">
              {user.addresses.map((addr, i) => (
                <div key={i} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${addr.typeBg}`}>{addr.type}</span>
                    {addr.isDefault && <span className="text-xs text-gray-400">Default</span>}
                  </div>
                  <address className="not-italic">
                    <p className="text-sm font-medium text-gray-900">{addr.name}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {addr.line1}<br />{addr.line2}<br />{addr.city}, {addr.state} {addr.pincode}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">{addr.phone}</p>
                  </address>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT (1/3) */}
        <div className="space-y-6">

          {/* Quick Stats */}
          <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Quick stats">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Quick Stats</h3>
            <dl className="space-y-3">
              <div className="flex items-center justify-between"><dt className="text-sm text-gray-500">Total Orders</dt><dd className="text-sm font-bold text-gray-900">{user.totalOrders}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-sm text-gray-500">Total Spent</dt><dd className="text-sm font-bold text-gray-900">{formatPriceRupees(user.totalSpent)}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-sm text-gray-500">Avg Order Value</dt><dd className="text-sm font-bold text-gray-900">{formatPriceRupees(user.avgOrderValue)}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-sm text-gray-500">Reviews Written</dt><dd className="text-sm font-bold text-gray-900">{user.reviewsWritten}</dd></div>
            </dl>
          </section>

          {/* Account Status */}
          <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Account status">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Account Status</h3>
            <div className="space-y-2.5 text-sm">
              <VerificationRow label="Email Verified" verified={user.emailVerified} />
              <VerificationRow label="Phone Verified" verified={user.phoneVerified} />
              <VerificationRow label="2FA Enabled" verified={user.twoFactorEnabled} />
            </div>
          </section>

          {/* Moderation Actions */}
          <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Moderation actions">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Moderation Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => { if (confirm(`Suspend ${fullName}? They will not be able to log in.`)) handleAction('suspend'); }}
                disabled={mutation.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
              >
                <Ban className="h-4 w-4" /> Suspend Account
              </button>
              <button
                onClick={() => { if (confirm(`Send password reset email to ${user.email}?`)) handleAction('reset-password'); }}
                disabled={mutation.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2.5 text-sm font-medium text-yellow-700 transition hover:bg-yellow-100 disabled:opacity-50"
              >
                <Lock className="h-4 w-4" /> Reset Password
              </button>
              <button
                onClick={() => { if (confirm('PERMANENTLY DELETE this user account? This cannot be undone!')) handleAction('delete'); }}
                disabled={mutation.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" /> Delete Account
              </button>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
