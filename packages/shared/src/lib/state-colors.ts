const stateColorMap: Record<string, { bg: string; text: string; dot: string }> = {
  // Generic
  CREATED: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
  ACTIVE: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  DRAFT: { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' },
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
  PROCESSING: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
  COMPLETED: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
  SUSPENDED: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
  REJECTED: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
  APPROVED: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  EXPIRED: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  ARCHIVED: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },

  // Order-specific
  PAID: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  SHIPPED: { bg: 'bg-indigo-100', text: 'text-indigo-800', dot: 'bg-indigo-500' },
  DELIVERED: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  REFUNDED: { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },
  RETURN_REQUESTED: { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },

  // Payment
  INITIATED: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
  SUCCEEDED: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  FAILED: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },

  // Inventory
  IN_STOCK: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  LOW_STOCK: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
  OUT_OF_STOCK: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },

  // Support
  OPEN: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
  IN_PROGRESS: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
  RESOLVED: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  CLOSED: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  ESCALATED: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },

  // Review
  PUBLISHED: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  FLAGGED: { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },

  // Settlement
  CALCULATING: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
  SETTLED: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
};

const defaultColor = { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' };

export function getStateColor(state: string) {
  return stateColorMap[state] ?? defaultColor;
}

export function getStateColorClasses(state: string): string {
  const color = getStateColor(state);
  return `${color.bg} ${color.text}`;
}
