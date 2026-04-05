import {
  Store,
  ShoppingBag,
  Flag,
  CheckCircle2,
  Banknote,
  RotateCcw,
  HelpCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ----------------------------------------------------------------
// Generic Icon Registry (Strategy/Registry pattern)
// ----------------------------------------------------------------

export class IconRegistry<K extends string = string> {
  private readonly registry = new Map<K, LucideIcon>();
  private readonly fallbackIcon: LucideIcon;

  constructor(fallback: LucideIcon) {
    this.fallbackIcon = fallback;
  }

  /** Register one or more icons by key */
  register(entries: Record<K, LucideIcon>): this {
    for (const [key, icon] of Object.entries(entries) as [K, LucideIcon][]) {
      this.registry.set(key, icon);
    }
    return this;
  }

  /** Resolve an icon by key, falling back to the default */
  resolve(key: K): LucideIcon {
    return this.registry.get(key) ?? this.fallbackIcon;
  }

  /** Check if a key has been registered */
  has(key: K): boolean {
    return this.registry.has(key);
  }

  /** Get all registered keys */
  keys(): K[] {
    return Array.from(this.registry.keys());
  }
}

// ----------------------------------------------------------------
// Activity icon registry instance
// ----------------------------------------------------------------

export type ActivityIconKey =
  | 'store'
  | 'shopping-bag'
  | 'flag'
  | 'badge-check'
  | 'currency'
  | 'return';

export const activityIcons = new IconRegistry<ActivityIconKey>(HelpCircle).register({
  'store': Store,
  'shopping-bag': ShoppingBag,
  'flag': Flag,
  'badge-check': CheckCircle2,
  'currency': Banknote,
  'return': RotateCcw,
});
