// ----------------------------------------------------------------
// Strategy Pattern: Currency Formatting
// ----------------------------------------------------------------

export interface CurrencyStrategy {
  /** Identifier for this strategy */
  name: string;
  /** Currency symbol */
  symbol: string;
  /** Format a numeric value into a human-readable currency string */
  format: (value: number) => string;
  /** Short format for compact display (chart labels, table cells) */
  formatCompact: (value: number) => string;
}

// ----------------------------------------------------------------
// INR Strategy — formats in lakhs and crores
// ----------------------------------------------------------------

export const INR_STRATEGY: CurrencyStrategy = {
  name: 'INR',
  symbol: '\u20B9',

  format(value: number): string {
    if (value >= 10_000_000) {
      return `\u20B9${(value / 10_000_000).toFixed(1)} Cr`;
    }
    if (value >= 100_000) {
      return `\u20B9${(value / 100_000).toFixed(1)}L`;
    }
    return `\u20B9${value.toLocaleString('en-IN')}`;
  },

  formatCompact(value: number): string {
    const lakhs = value / 100_000;
    return `\u20B9${lakhs.toFixed(1)}L`;
  },
};

// ----------------------------------------------------------------
// USD Strategy (future-proofing)
// ----------------------------------------------------------------

export const USD_STRATEGY: CurrencyStrategy = {
  name: 'USD',
  symbol: '$',

  format(value: number): string {
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(1)}B`;
    }
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString('en-US')}`;
  },

  formatCompact(value: number): string {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    return `$${(value / 1_000).toFixed(1)}K`;
  },
};

// ----------------------------------------------------------------
// Default strategy for the platform
// ----------------------------------------------------------------

const DEFAULT_STRATEGY = INR_STRATEGY;

/**
 * Format a currency value using the given strategy.
 * Falls back to INR_STRATEGY if none provided.
 */
export function formatCurrency(
  value: number,
  strategy: CurrencyStrategy = DEFAULT_STRATEGY,
): string {
  return strategy.format(value);
}

/**
 * Format a currency value in compact form (for tables, chart labels).
 */
export function formatCurrencyCompact(
  value: number,
  strategy: CurrencyStrategy = DEFAULT_STRATEGY,
): string {
  return strategy.formatCompact(value);
}
