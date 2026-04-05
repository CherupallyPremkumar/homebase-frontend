import type { ActivityItem, ActivityBadgeColor } from '../types';

// ----------------------------------------------------------------
// Adapter: Raw ActivityItem[] -> feed item render props
// ----------------------------------------------------------------

export interface BadgeStyle {
  bg: string;
  text: string;
}

/** Map badge color key to Tailwind classes */
export const BADGE_STYLES: Record<ActivityBadgeColor, BadgeStyle> = {
  green: { bg: 'bg-green-50', text: 'text-green-600' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  red: { bg: 'bg-red-50', text: 'text-red-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
};

export interface AdaptedActivityItem {
  id: string;
  title: string;
  subtitle: string;
  relativeTime: string;
  navigateTo: string;
  iconType: string;
  iconBgColor: string;
  iconColor: string;
  badgeLabel: string;
  badgeStyle: BadgeStyle;
}

/**
 * Transforms raw activity items into a flat shape that the
 * DashboardActivity component can render without digging
 * into nested objects.
 */
export function adaptActivity(
  items: ActivityItem[] | undefined,
): AdaptedActivityItem[] {
  if (!items) return [];

  return items.map((item) => ({
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    relativeTime: item.relativeTime,
    navigateTo: item.navigateTo,
    iconType: item.icon.type,
    iconBgColor: item.icon.bgColor,
    iconColor: item.icon.iconColor,
    badgeLabel: item.badge.label,
    badgeStyle: BADGE_STYLES[item.badge.color] ?? BADGE_STYLES.green,
  }));
}
