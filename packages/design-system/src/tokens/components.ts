/**
 * Component dimensions — ensures visual consistency.
 * Every button, input, card follows the same sizing.
 */
export const components = {
  // Buttons
  button: {
    height: { sm: '36px', md: '40px', lg: '48px' },
    paddingX: { sm: '12px', md: '16px', lg: '24px' },
    fontSize: { sm: '13px', md: '14px', lg: '16px' },
    radius: '8px',
  },

  // Inputs
  input: {
    height: '40px',
    paddingX: '12px',
    fontSize: '14px',
    radius: '8px',
    borderColor: '#d1d5db', // gray-300
    focusRing: '#2563eb',   // primary
  },

  // Cards
  card: {
    padding: '12px',
    radius: '8px',
    borderColor: '#e5e7eb', // gray-200
    hoverBg: '#f9fafb',    // gray-50
  },

  // Table
  table: {
    headerHeight: '40px',
    rowHeight: '44px',
    headerBg: '#f9fafb',   // gray-50
    cellPaddingX: '12px',
    cellPaddingY: '8px',
  },

  // Sidebar
  sidebar: {
    width: '240px',
    collapsedWidth: '64px',
    itemHeight: '40px',
    activeIndicator: '2px',
  },

  // Header
  header: {
    height: '56px',
    storefrontHeight: '64px',
  },

  // Avatar
  avatar: {
    sizes: { sm: '32px', md: '40px', lg: '48px' },
  },

  // Badge
  badge: {
    paddingX: '8px',
    paddingY: '2px',
    fontSize: '12px',
    dotSize: '6px',
  },
} as const;
