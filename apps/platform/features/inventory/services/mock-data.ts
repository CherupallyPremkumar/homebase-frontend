/**
 * Mock data for the Inventory Management page.
 *
 * Each export matches the shape returned by the real API contract.
 * When the backend endpoints are ready, swap the mock imports in
 * use-inventory.ts for real fetch calls -- no component changes needed.
 */

import type {
  InventoryStats,
  InventoryItem,
  InventoryListResponse,
  InventoryTab,
  InventoryAlert,
} from '../types';

// ----------------------------------------------------------------
// Stats
// ----------------------------------------------------------------

export const mockInventoryStats: InventoryStats = {
  totalSkus: { value: '4,856', subtitle: '+38 this week' },
  lowStock: { value: '145', subtitle: 'Below threshold' },
  outOfStock: { value: '34', subtitle: 'Needs restock' },
  inTransit: { value: '89', subtitle: 'Arriving soon' },
};

// ----------------------------------------------------------------
// Tabs
// ----------------------------------------------------------------

export const mockInventoryTabs: InventoryTab[] = [
  { key: 'all', label: 'All Items', count: '4,856' },
  { key: 'in-stock', label: 'In Stock', count: '4,588', badgeClass: 'bg-green-100 text-green-700' },
  { key: 'low-stock', label: 'Low Stock', count: '145', badgeClass: 'bg-yellow-100 text-yellow-700' },
  { key: 'out-of-stock', label: 'Out of Stock', count: '34', badgeClass: 'bg-red-100 text-red-700' },
  { key: 'in-transit', label: 'In Transit', count: '89', badgeClass: 'bg-blue-100 text-blue-700' },
];

// ----------------------------------------------------------------
// Inventory Items
// ----------------------------------------------------------------

export const mockInventoryItems: InventoryItem[] = [
  {
    id: 'INV-001',
    sku: 'HB-LED-01203',
    productName: 'Premium LED Panel 40W',
    productImage: '',
    category: 'Lighting',
    warehouse: 'Mumbai Central',
    totalQty: 0,
    availableQty: 0,
    reservedQty: 0,
    damagedQty: 2,
    inboundQty: 0,
    lowStockThreshold: 50,
    status: 'Out of Stock',
    lastRestocked: 'Mar 10, 2026',
  },
  {
    id: 'INV-002',
    sku: 'HB-WIR-00587',
    productName: 'Copper Wire 2.5mm (100m)',
    productImage: '',
    category: 'Wiring',
    warehouse: 'Delhi Hub',
    totalQty: 0,
    availableQty: 0,
    reservedQty: 0,
    damagedQty: 0,
    inboundQty: 50,
    lowStockThreshold: 30,
    status: 'Out of Stock',
    lastRestocked: 'Mar 05, 2026',
  },
  {
    id: 'INV-003',
    sku: 'HB-PVC-00891',
    productName: 'Industrial PVC Conduit 25mm',
    productImage: '',
    category: 'Conduits',
    warehouse: 'Mumbai Central',
    totalQty: 18,
    availableQty: 8,
    reservedQty: 10,
    damagedQty: 0,
    inboundQty: 0,
    lowStockThreshold: 40,
    status: 'Low Stock',
    lastRestocked: 'Mar 18, 2026',
  },
  {
    id: 'INV-004',
    sku: 'HB-DST-00334',
    productName: 'Distribution Box 8-Way',
    productImage: '',
    category: 'Switchgear',
    warehouse: 'Bangalore South',
    totalQty: 22,
    availableQty: 12,
    reservedQty: 10,
    damagedQty: 0,
    inboundQty: 0,
    lowStockThreshold: 35,
    status: 'Low Stock',
    lastRestocked: 'Mar 20, 2026',
  },
  {
    id: 'INV-005',
    sku: 'HB-EXF-01567',
    productName: 'Exhaust Fan 300mm Heavy Duty',
    productImage: '',
    category: 'Ventilation',
    warehouse: 'Delhi Hub',
    totalQty: 25,
    availableQty: 15,
    reservedQty: 8,
    damagedQty: 2,
    inboundQty: 0,
    lowStockThreshold: 50,
    status: 'Low Stock',
    lastRestocked: 'Mar 22, 2026',
  },
  {
    id: 'INV-006',
    sku: 'HB-CBL-00445',
    productName: 'Cable Ties 200mm (Pack 500)',
    productImage: '',
    category: 'Accessories',
    warehouse: 'Mumbai Central',
    totalQty: 2400,
    availableQty: 2200,
    reservedQty: 180,
    damagedQty: 20,
    inboundQty: 0,
    lowStockThreshold: 500,
    status: 'In Stock',
    lastRestocked: 'Mar 25, 2026',
  },
  {
    id: 'INV-007',
    sku: 'HB-MCB-00778',
    productName: 'Circuit Breaker 32A MCB',
    productImage: '',
    category: 'Switchgear',
    warehouse: 'Bangalore South',
    totalQty: 0,
    availableQty: 0,
    reservedQty: 0,
    damagedQty: 0,
    inboundQty: 100,
    lowStockThreshold: 25,
    status: 'Out of Stock',
    lastRestocked: 'Mar 08, 2026',
  },
  {
    id: 'INV-008',
    sku: 'HB-INS-00923',
    productName: 'PVC Insulation Tape (Pack 10)',
    productImage: '',
    category: 'Accessories',
    warehouse: 'Delhi Hub',
    totalQty: 1850,
    availableQty: 1700,
    reservedQty: 120,
    damagedQty: 30,
    inboundQty: 0,
    lowStockThreshold: 300,
    status: 'In Stock',
    lastRestocked: 'Mar 26, 2026',
  },
  {
    id: 'INV-009',
    sku: 'HB-SWT-01045',
    productName: 'Modular Switch 16A 2-Way',
    productImage: '',
    category: 'Switches',
    warehouse: 'Mumbai Central',
    totalQty: 560,
    availableQty: 420,
    reservedQty: 140,
    damagedQty: 0,
    inboundQty: 200,
    lowStockThreshold: 100,
    status: 'In Transit',
    lastRestocked: 'Mar 24, 2026',
  },
  {
    id: 'INV-010',
    sku: 'HB-TRF-00612',
    productName: 'Step-Down Transformer 500VA',
    productImage: '',
    category: 'Transformers',
    warehouse: 'Bangalore South',
    totalQty: 75,
    availableQty: 45,
    reservedQty: 20,
    damagedQty: 5,
    inboundQty: 50,
    lowStockThreshold: 20,
    status: 'In Transit',
    lastRestocked: 'Mar 27, 2026',
  },
];

export const mockInventoryListResponse: InventoryListResponse = {
  items: mockInventoryItems,
  total: 4_856,
  page: 1,
  pageSize: 10,
  totalPages: 486,
};

// ----------------------------------------------------------------
// Alerts
// ----------------------------------------------------------------

export const mockInventoryAlerts: InventoryAlert[] = [
  {
    id: 'ALT-001',
    sku: 'HB-LED-01203',
    productName: 'Premium LED Panel 40W',
    type: 'out-of-stock',
    currentQty: 0,
    threshold: 50,
    severity: 'critical',
    warehouse: 'Mumbai Central',
    lastChecked: 'Mar 30, 2026',
  },
  {
    id: 'ALT-002',
    sku: 'HB-WIR-00587',
    productName: 'Copper Wire 2.5mm (100m)',
    type: 'out-of-stock',
    currentQty: 0,
    threshold: 30,
    severity: 'critical',
    warehouse: 'Delhi Hub',
    lastChecked: 'Mar 30, 2026',
  },
  {
    id: 'ALT-003',
    sku: 'HB-PVC-00891',
    productName: 'Industrial PVC Conduit 25mm',
    type: 'low-stock',
    currentQty: 8,
    threshold: 40,
    severity: 'warning',
    warehouse: 'Mumbai Central',
    lastChecked: 'Mar 30, 2026',
  },
  {
    id: 'ALT-004',
    sku: 'HB-DST-00334',
    productName: 'Distribution Box 8-Way',
    type: 'low-stock',
    currentQty: 12,
    threshold: 35,
    severity: 'warning',
    warehouse: 'Bangalore South',
    lastChecked: 'Mar 30, 2026',
  },
  {
    id: 'ALT-005',
    sku: 'HB-CBL-00445',
    productName: 'Cable Ties 200mm (Pack 500)',
    type: 'overstock',
    currentQty: 2400,
    threshold: 500,
    severity: 'info',
    warehouse: 'Mumbai Central',
    lastChecked: 'Mar 30, 2026',
  },
  {
    id: 'ALT-006',
    sku: 'HB-MCB-00778',
    productName: 'Circuit Breaker 32A MCB',
    type: 'out-of-stock',
    currentQty: 0,
    threshold: 25,
    severity: 'critical',
    warehouse: 'Bangalore South',
    lastChecked: 'Mar 30, 2026',
  },
];
