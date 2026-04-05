'use client';

import { useState } from 'react';
import {
  Shield, Mail, Phone, MapPin, Calendar, User, Key, Monitor,
  Smartphone, Globe, AlertTriangle, Edit, Download, ChevronRight,
  CheckCircle, Pencil, Banknote, Ban, BarChart3, AlertCircle,
  Truck, MessageSquare, Sun, Moon, Plus,
} from 'lucide-react';
import { Skeleton } from '@homebase/ui';
import { cn } from '@homebase/ui/src/lib/utils';

import { useProfilePage } from '../hooks/use-profile';
import type {
  ActivityTimelineEntry,
  LoginHistoryEntry,
  DelegatedAccessEntry,
  TrustedDevice,
} from '../types';

// ----------------------------------------------------------------
// Constants
// ----------------------------------------------------------------

const TEXT = {
  breadcrumbHome: 'Dashboard',
  pageTitle: 'My Profile',
  editProfile: 'Edit Profile',
  personalInfo: 'Personal Information',
  security: 'Security',
  activityTimeline: 'My Activity Timeline',
  viewAuditLog: 'View Full Audit Log',
  notificationPrefs: 'Notification Preferences',
  displayPrefs: 'Display Preferences',
  loginHistory: 'Login History',
  delegatedAccess: 'Delegated Access',
  delegatedAccessDesc: 'Temporary access grants to other team members',
  grantAccess: 'Grant Temporary Access',
  downloadReport: 'Download Report',
  saveChanges: 'Save Changes',
  edit: 'Edit',
  change: 'Change',
  update: 'Update',
  manage: 'Manage',
  remove: 'Remove',
  revoke: 'Revoke',
  revokeAll: 'Revoke All',
  renew: 'Renew',
  online: 'Online',
  lastSeen: 'Last seen 2 minutes ago',
  activeSince: 'Active Since',
  actionsToday: 'Actions Today',
  reportsGenerated: 'Reports Generated',
  platformUptime: 'Platform Uptime',
  fullName: 'Full Name',
  email: 'Email',
  phone: 'Phone',
  location: 'Location',
  lastLogin: 'Last Login',
  verified: 'Verified',
  enabled: 'Enabled',
  disabled: 'Disabled',
  password: 'Password',
  twoFactor: 'Two-Factor Authentication',
  recoveryEmail: 'Recovery Email',
  recoveryPhone: 'Recovery Phone',
  activeSessions: 'Active Sessions',
  apiKeys: 'API Keys',
  trustedDevices: 'Trusted Devices',
  downloadMyData: 'Download My Data (GDPR)',
  emailNotifications: 'Email Notifications',
  otherChannels: 'Other Channels',
  digestReports: 'Digest Reports',
  theme: 'Theme',
  light: 'Light',
  dark: 'Dark',
  auto: 'Auto',
  errorTitle: 'Failed to load profile',
  retry: 'Retry',
} as const;

const QUICK_STATS: readonly { value: string; label: string; accent?: boolean }[] = [
  { value: 'Jan 2024', label: TEXT.activeSince },
  { value: '342', label: TEXT.actionsToday },
  { value: '18', label: TEXT.reportsGenerated },
  { value: '99.9%', label: TEXT.platformUptime, accent: true },
];

const TIMELINE_ICON_MAP: Record<ActivityTimelineEntry['color'], { bg: string; text: string; Icon: typeof CheckCircle }> = {
  green: { bg: 'bg-green-100', text: 'text-green-600', Icon: CheckCircle },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', Icon: Pencil },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', Icon: Banknote },
  red: { bg: 'bg-red-100', text: 'text-red-600', Icon: Ban },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', Icon: BarChart3 },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', Icon: AlertCircle },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', Icon: Truck },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600', Icon: MessageSquare },
};

const AVATAR_COLORS: Record<string, string> = {
  purple: 'bg-purple-100 text-purple-700',
  teal: 'bg-teal-100 text-teal-700',
  gray: 'bg-gray-100 text-gray-500',
};

const DASHBOARD_OPTIONS = ['Platform Overview', 'Orders Dashboard', 'Seller Dashboard', 'Finance Dashboard', 'Analytics'];
const TIMEZONE_OPTIONS = ['Asia/Kolkata (IST +5:30)', 'UTC (+0:00)', 'America/New_York (EST -5:00)', 'Europe/London (GMT +0:00)', 'Asia/Tokyo (JST +9:00)'];
const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu'];
const DATE_FORMAT_OPTIONS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];
const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

// ----------------------------------------------------------------
// Toggle Switch (matches prototype styling)
// ----------------------------------------------------------------

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200',
        checked ? 'bg-orange-500' : 'bg-gray-200'
      )}
    >
      <span
        className={cn(
          'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
          checked ? 'translate-x-4' : 'translate-x-0.5',
          'mt-0.5'
        )}
      />
    </button>
  );
}

// ----------------------------------------------------------------
// Skeleton
// ----------------------------------------------------------------

function ProfileSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading profile">
      <Skeleton className="h-5 w-56" />
      <Skeleton className="h-48 rounded-2xl" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-72 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------

export function AdminProfile() {
  const profileQuery = useProfilePage();
  const [notifState, setNotifState] = useState<Record<string, boolean>>({});
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'auto'>('light');

  if (profileQuery.isLoading) {
    return <ProfileSkeleton />;
  }

  if (profileQuery.isError) {
    return (
      <section className="flex flex-col items-center justify-center py-32" role="alert">
        <AlertTriangle className="h-12 w-12 text-red-400" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">{TEXT.errorTitle}</h2>
        <p className="mt-1 text-sm text-gray-500">{profileQuery.error?.message}</p>
        <button
          onClick={() => profileQuery.refetch()}
          className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          {TEXT.retry}
        </button>
      </section>
    );
  }

  const data = profileQuery.data;
  if (!data) return null;

  const { profile, security, trustedDevices, activityTimeline, notifications, display, loginHistory, delegatedAccess } = data;

  function getNotifChecked(key: string, defaultVal: boolean): boolean {
    return notifState[key] ?? defaultVal;
  }

  function toggleNotif(key: string, defaultVal: boolean) {
    setNotifState((prev) => ({ ...prev, [key]: !(prev[key] ?? defaultVal) }));
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
        <a href="/" className="text-gray-400 transition hover:text-orange-500">{TEXT.breadcrumbHome}</a>
        <ChevronRight className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
        <span className="font-medium text-gray-700">{TEXT.pageTitle}</span>
      </nav>

      {/* ================================================ */}
      {/* SECTION 1: Profile Header                        */}
      {/* ================================================ */}
      <header className="rounded-2xl bg-gradient-to-r from-gray-900 to-gray-700 p-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/20 bg-green-600 text-3xl font-bold text-white"
              role="img"
              aria-label={`Avatar for ${profile.fullName}`}
            >
              {profile.initials}
            </div>
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-gray-900 bg-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{profile.fullName}</h1>
            <div className="mt-2 flex items-center gap-3">
              <span className="flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-xs font-medium text-white">
                <Shield className="h-3 w-3" aria-hidden="true" />
                {profile.role}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-green-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                {TEXT.online}
              </span>
              <span className="text-xs text-gray-400">{TEXT.lastSeen}</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20">
              {TEXT.editProfile}
            </button>
          </div>
        </div>
        {/* Quick Stats Row */}
        <div className="mt-6 grid grid-cols-4 gap-4 border-t border-white/10 pt-6">
          {QUICK_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className={cn('text-2xl font-bold', stat.accent ? 'text-orange-400' : 'text-white')}>
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* ================================================ */}
        {/* SECTION 2: Personal Information                  */}
        {/* ================================================ */}
        <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Personal information">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{TEXT.personalInfo}</h3>
            <button className="text-xs font-medium text-orange-500 transition hover:underline">{TEXT.edit}</button>
          </div>
          <div className="space-y-4">
            <InfoRow icon={User} label={TEXT.fullName} value={profile.fullName} />
            <InfoRow icon={Mail} label={TEXT.email} value={profile.email} verified={profile.emailVerified} />
            <InfoRow icon={Phone} label={TEXT.phone} value={profile.phone} verified={profile.phoneVerified} />
            <InfoRow icon={MapPin} label={TEXT.location} value={profile.location} />
            <InfoRow icon={Calendar} label={TEXT.lastLogin} value={profile.lastLogin} />
          </div>
        </section>

        {/* ================================================ */}
        {/* SECTION 3: Security                              */}
        {/* ================================================ */}
        <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Security settings">
          <h3 className="mb-5 font-semibold text-gray-900">{TEXT.security}</h3>
          <div className="space-y-3">
            <SecurityRow
              title={TEXT.password}
              subtitle={`Last changed ${security.passwordLastChanged}`}
              action={<ActionLink label={TEXT.change} />}
            />
            <SecurityRow
              title={TEXT.twoFactor}
              subtitle={security.twoFactorMethod}
              action={
                <span className={cn(
                  'rounded-full px-2 py-1 text-xs font-medium',
                  security.twoFactorEnabled ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                )}>
                  {security.twoFactorEnabled ? TEXT.enabled : TEXT.disabled}
                </span>
              }
            />
            <SecurityRow
              title={TEXT.recoveryEmail}
              subtitle={security.recoveryEmail}
              action={<ActionLink label={TEXT.update} />}
            />
            <SecurityRow
              title={TEXT.recoveryPhone}
              subtitle={security.recoveryPhone}
              action={<ActionLink label={TEXT.update} />}
            />
            <SecurityRow
              title={TEXT.activeSessions}
              subtitle={`${security.activeSessions} active sessions`}
              action={<ActionLink label={TEXT.revokeAll} variant="danger" />}
            />
            <SecurityRow
              title={TEXT.apiKeys}
              subtitle={`${security.apiKeys} active keys`}
              action={<ActionLink label={TEXT.manage} />}
            />

            {/* Trusted Devices */}
            <div className="pt-2">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">{TEXT.trustedDevices}</p>
              <div className="space-y-2">
                {trustedDevices.map((device) => (
                  <TrustedDeviceRow key={device.id} device={device} />
                ))}
              </div>
            </div>

            {/* GDPR */}
            <div className="mt-3 border-t border-gray-100 pt-3">
              <button className="flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-orange-500">
                <Download className="h-4 w-4" aria-hidden="true" />
                {TEXT.downloadMyData}
              </button>
            </div>
          </div>
        </section>

        {/* ================================================ */}
        {/* SECTION 4: Activity Timeline (full-width)        */}
        {/* ================================================ */}
        <section className="rounded-xl border border-gray-100 bg-white p-6 lg:col-span-2" aria-label="Activity timeline">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{TEXT.activityTimeline}</h3>
            <a href="/system/audit-log" className="text-xs font-medium text-orange-500 transition hover:underline">{TEXT.viewAuditLog}</a>
          </div>
          <div className="relative">
            <div className="absolute bottom-2 left-[15px] top-2 w-px bg-gray-100" />
            <div className="space-y-0">
              {activityTimeline.map((entry) => (
                <TimelineRow key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        </section>

        {/* ================================================ */}
        {/* SECTION 5: Notification Preferences              */}
        {/* ================================================ */}
        <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Notification preferences">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{TEXT.notificationPrefs}</h3>
            <button className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-orange-600">
              {TEXT.saveChanges}
            </button>
          </div>

          {/* Email Notifications */}
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">{TEXT.emailNotifications}</p>
          <div className="mb-5 space-y-3">
            {notifications.email.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{item.label}</span>
                <Toggle
                  checked={getNotifChecked(`email-${item.label}`, item.enabled)}
                  onChange={() => toggleNotif(`email-${item.label}`, item.enabled)}
                />
              </div>
            ))}
          </div>

          {/* Other Channels */}
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">{TEXT.otherChannels}</p>
          <div className="mb-5 space-y-3">
            {notifications.channels.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <p className="text-xs text-gray-400">{item.description}</p>
                </div>
                <Toggle
                  checked={getNotifChecked(`channel-${item.label}`, item.enabled)}
                  onChange={() => toggleNotif(`channel-${item.label}`, item.enabled)}
                />
              </div>
            ))}
          </div>

          {/* Digest Reports */}
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">{TEXT.digestReports}</p>
          <div className="space-y-3">
            {notifications.digest.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <p className="text-xs text-gray-400">{item.description}</p>
                </div>
                <Toggle
                  checked={getNotifChecked(`digest-${item.label}`, item.enabled)}
                  onChange={() => toggleNotif(`digest-${item.label}`, item.enabled)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ================================================ */}
        {/* SECTION 6: Display Preferences                   */}
        {/* ================================================ */}
        <section className="rounded-xl border border-gray-100 bg-white p-6" aria-label="Display preferences">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{TEXT.displayPrefs}</h3>
            <button className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-orange-600">
              {TEXT.saveChanges}
            </button>
          </div>

          {/* Theme */}
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">{TEXT.theme}</p>
          <div className="mb-5 flex gap-3">
            <ThemeButton
              icon={Sun}
              label={TEXT.light}
              iconColor="text-yellow-500"
              selected={selectedTheme === 'light'}
              onClick={() => setSelectedTheme('light')}
            />
            <ThemeButton
              icon={Moon}
              label={TEXT.dark}
              iconColor="text-indigo-500"
              selected={selectedTheme === 'dark'}
              onClick={() => setSelectedTheme('dark')}
            />
            <ThemeButton
              icon={Monitor}
              label={TEXT.auto}
              iconColor="text-gray-500"
              selected={selectedTheme === 'auto'}
              onClick={() => setSelectedTheme('auto')}
            />
          </div>

          {/* Settings Grid */}
          <div className="space-y-4">
            <SelectRow label="Dashboard Default View" description="Landing page after login" options={DASHBOARD_OPTIONS} defaultValue={display.dashboardView} />
            <SelectRow label="Timezone" description="All timestamps shown in this zone" options={TIMEZONE_OPTIONS} defaultValue={display.timezone} />
            <SelectRow label="Language" description="Interface language" options={LANGUAGE_OPTIONS} defaultValue={display.language} />
            <SelectRow label="Date Format" description="How dates appear across the platform" options={DATE_FORMAT_OPTIONS} defaultValue={display.dateFormat} />
            <SelectRow label="Items per Page" description="Default pagination for tables" options={ITEMS_PER_PAGE_OPTIONS.map(String)} defaultValue={String(display.itemsPerPage)} />
          </div>
        </section>

        {/* ================================================ */}
        {/* SECTION 7: Login History (full-width)            */}
        {/* ================================================ */}
        <section className="rounded-xl border border-gray-100 bg-white p-6 lg:col-span-2" aria-label="Login history">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{TEXT.loginHistory}</h3>
            <button className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200">
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              {TEXT.downloadReport}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-gray-400">Device</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-gray-400">Browser</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-gray-400">IP Address</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-gray-400">Location</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-gray-400">Status</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-gray-400">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loginHistory.map((entry) => (
                  <LoginHistoryRow key={entry.id} entry={entry} />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ================================================ */}
        {/* SECTION 8: Delegated Access (full-width)         */}
        {/* ================================================ */}
        <section className="rounded-xl border border-gray-100 bg-white p-6 lg:col-span-2" aria-label="Delegated access">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{TEXT.delegatedAccess}</h3>
              <p className="mt-0.5 text-xs text-gray-400">{TEXT.delegatedAccessDesc}</p>
            </div>
            <button className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-orange-600">
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              {TEXT.grantAccess}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-gray-400">Person</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-gray-400">Role / Team</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-gray-400">Access Scope</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-gray-400">Expires</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-gray-400">Status</th>
                  <th className="px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {delegatedAccess.map((entry) => (
                  <DelegatedAccessRow key={entry.id} entry={entry} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------

function InfoRow({
  icon: Icon,
  label,
  value,
  verified,
}: {
  icon: typeof User;
  label: string;
  value: string;
  verified?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium">{value}</p>
        {verified && (
          <span className="rounded bg-green-50 px-1.5 py-0.5 text-[10px] font-medium text-green-600">{TEXT.verified}</span>
        )}
      </div>
    </div>
  );
}

function SecurityRow({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-50 py-3">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function ActionLink({ label, variant = 'primary' }: { label: string; variant?: 'primary' | 'danger' }) {
  return (
    <button className={cn(
      'text-xs font-medium transition hover:underline',
      variant === 'danger' ? 'text-red-500' : 'text-orange-500'
    )}>
      {label}
    </button>
  );
}

function TrustedDeviceRow({ device }: { device: TrustedDevice }) {
  const DeviceIcon = device.type === 'mobile' ? Smartphone : Monitor;
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
      <div className="flex items-center gap-3">
        <DeviceIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium">{device.name}</p>
          <p className="text-xs text-gray-400">{device.location} - Added {device.addedDate}</p>
        </div>
      </div>
      <button className="text-xs font-medium text-red-500 transition hover:underline">{TEXT.remove}</button>
    </div>
  );
}

function TimelineRow({ entry }: { entry: ActivityTimelineEntry }) {
  const config = TIMELINE_ICON_MAP[entry.color];
  const { Icon } = config;
  return (
    <div className="relative flex items-start gap-4 rounded-lg px-2 py-3 transition hover:bg-orange-50/40">
      <div className={cn('z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full', config.bg)}>
        <Icon className={cn('h-4 w-4', config.text)} aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-700">
          {entry.description} <span className="font-semibold text-gray-900">{entry.highlight}</span>
        </p>
        <p className="mt-0.5 text-xs text-gray-400">{entry.category}</p>
      </div>
      <span className="shrink-0 pt-0.5 text-xs text-gray-400">{entry.time}</span>
    </div>
  );
}

function ThemeButton({
  icon: Icon,
  label,
  iconColor,
  selected,
  onClick,
}: {
  icon: typeof Sun;
  label: string;
  iconColor: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 rounded-lg border-2 p-3 text-center transition',
        selected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'
      )}
    >
      <Icon className={cn('mx-auto mb-1 h-5 w-5', iconColor)} aria-hidden="true" />
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </button>
  );
}

function SelectRow({
  label,
  description,
  options,
  defaultValue,
}: {
  label: string;
  description: string;
  options: string[];
  defaultValue: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-700">{label}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <select
        defaultValue={defaultValue}
        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function LoginHistoryRow({ entry }: { entry: LoginHistoryEntry }) {
  const DeviceIcon = entry.deviceType === 'mobile' ? Smartphone : Monitor;
  const statusConfig: Record<LoginHistoryEntry['status'], { label: string; className: string }> = {
    current: { label: 'Current Session', className: 'bg-green-50 text-green-600' },
    success: { label: 'Success', className: 'bg-green-50 text-green-600' },
    failed: { label: 'Failed', className: 'bg-red-50 text-red-600' },
  };
  const status = statusConfig[entry.status];

  return (
    <tr className="hover:bg-gray-50/50">
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <DeviceIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
          <span className="font-medium text-gray-700">{entry.device}</span>
        </div>
      </td>
      <td className="px-3 py-3 text-gray-600">{entry.browser}</td>
      <td className="px-3 py-3 font-mono text-xs text-gray-600">{entry.ip}</td>
      <td className="px-3 py-3 text-gray-600">{entry.location}</td>
      <td className="px-3 py-3">
        <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', status.className)}>
          {status.label}
        </span>
      </td>
      <td className="px-3 py-3 text-gray-500">{entry.time}</td>
    </tr>
  );
}

function DelegatedAccessRow({ entry }: { entry: DelegatedAccessEntry }) {
  const isExpired = entry.status === 'expired';
  const avatarClass = AVATAR_COLORS[entry.avatarColor] ?? 'bg-gray-100 text-gray-500';

  return (
    <tr className="hover:bg-gray-50/50">
      <td className="px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className={cn('flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold', avatarClass)}>
            {entry.initials}
          </div>
          <span className={cn('font-medium', isExpired ? 'text-gray-400' : 'text-gray-700')}>{entry.person}</span>
        </div>
      </td>
      <td className={cn('px-3 py-3', isExpired ? 'text-gray-400' : 'text-gray-600')}>{entry.role}</td>
      <td className="px-3 py-3">
        <span className={cn(
          'rounded-full px-2 py-0.5 text-xs font-medium',
          isExpired ? 'bg-gray-50 text-gray-500' : 'bg-blue-50 text-blue-700'
        )}>
          {entry.scope}
        </span>
      </td>
      <td className={cn('px-3 py-3', isExpired ? 'text-gray-400' : 'text-gray-600')}>{entry.expires}</td>
      <td className="px-3 py-3">
        <span className={cn(
          'rounded-full px-2 py-0.5 text-[10px] font-medium',
          isExpired ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-green-600'
        )}>
          {isExpired ? 'Expired' : 'Active'}
        </span>
      </td>
      <td className="px-3 py-3 text-right">
        <button className={cn(
          'text-xs font-medium transition hover:underline',
          isExpired ? 'text-orange-500' : 'text-red-500'
        )}>
          {isExpired ? TEXT.renew : TEXT.revoke}
        </button>
      </td>
    </tr>
  );
}
