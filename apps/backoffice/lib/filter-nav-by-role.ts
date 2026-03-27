export interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles?: string[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
  roles?: string[];
}

export function filterNavByRole(groups: NavGroup[], roles: string[]): NavGroup[] {
  return groups
    .filter((g) => !g.roles || g.roles.some((r) => roles.includes(r)))
    .map((g) => ({
      ...g,
      items: g.items.filter((item) => !item.roles || item.roles.some((r) => roles.includes(r))),
    }))
    .filter((g) => g.items.length > 0);
}
