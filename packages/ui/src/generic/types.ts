/**
 * Type-safe field configuration for EntityCard.
 * Each field type has specific rendering logic built into the component.
 */
export interface EntityField<T = unknown> {
  type: 'price' | 'rating' | 'text' | 'date' | 'number' | 'change' | 'stock' | 'state' | 'custom';
  value: string | number | boolean;
  label?: string;
  extra?: string | number;    // mrp for price, count for rating
  render?: () => React.ReactNode;  // for type='custom'
}

export interface EntityAction {
  label: string;
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

export interface EntityBadge {
  label: string;
  variant: 'state' | 'priority' | 'info' | 'custom';
  color?: string;
}

export interface ColumnConfig<T> {
  key: string;
  header: string;
  type?: 'text' | 'price' | 'date' | 'state' | 'rating' | 'number' | 'custom';
  render?: (item: T) => React.ReactNode;     // escape hatch
  linkTo?: (item: T) => string;              // make cell a link
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'checkbox' | 'range' | 'date-range';
  options?: { label: string; value: string }[];
}
