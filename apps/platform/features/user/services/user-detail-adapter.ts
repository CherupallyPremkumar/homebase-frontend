import type { UserDetailData, UserActivityEntry, UserAddress, UserOrderEntry } from '../types';

// ----------------------------------------------------------------
// Adapter: Raw UserDetailData -> UI-ready view models
// ----------------------------------------------------------------

/** Icon key mapping for activity types */
const ACTIVITY_ICON_MAP: Record<UserActivityEntry['iconType'], string> = {
  login: 'log-in',
  order: 'shopping-bag',
  review: 'star',
  return: 'rotate-ccw',
};

export interface ActivityView {
  event: string;
  iconBg: string;
  iconKey: string;
  detail: string;
  date: string;
}

/**
 * Transforms raw activity log entries into display-ready items.
 */
export function adaptActivities(activities: UserActivityEntry[]): ActivityView[] {
  return activities.map((a) => ({
    event: a.event,
    iconBg: a.iconBg,
    iconKey: ACTIVITY_ICON_MAP[a.iconType] ?? 'circle',
    detail: a.detail,
    date: a.date,
  }));
}

export interface AddressView {
  type: string;
  typeBg: string;
  isDefault: boolean;
  fullAddress: string;
  phone: string;
}

/**
 * Transforms raw addresses into a flat display format.
 */
export function adaptAddresses(addresses: UserAddress[]): AddressView[] {
  return addresses.map((addr) => ({
    type: addr.type,
    typeBg: addr.typeBg,
    isDefault: addr.isDefault,
    fullAddress: [addr.name, addr.line1, addr.line2, `${addr.city}, ${addr.state} ${addr.pincode}`]
      .filter(Boolean)
      .join(', '),
    phone: addr.phone,
  }));
}

export interface UserQuickStatsView {
  totalOrders: string;
  totalSpent: string;
  avgOrderValue: string;
  reviewsWritten: string;
}

/**
 * Transforms raw user stats into formatted display values.
 */
export function adaptUserQuickStats(user: UserDetailData): UserQuickStatsView {
  return {
    totalOrders: user.totalOrders.toLocaleString('en-IN'),
    totalSpent: new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(user.totalSpent),
    avgOrderValue: new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(user.avgOrderValue),
    reviewsWritten: user.reviewsWritten.toLocaleString('en-IN'),
  };
}

export interface OrderRowView {
  id: string;
  items: string;
  amountFormatted: string;
  status: string;
  statusColor: string;
  date: string;
}

/**
 * Transforms raw order entries into display rows.
 */
export function adaptUserOrders(orders: UserOrderEntry[]): OrderRowView[] {
  return orders.map((o) => ({
    id: o.id,
    items: o.items,
    amountFormatted: new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(o.amount),
    status: o.status,
    statusColor: o.statusColor,
    date: o.date,
  }));
}
