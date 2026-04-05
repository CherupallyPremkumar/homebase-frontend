# Seller Inventory — API Contract

## Page: seller-inventory.html

**Note:** All table/list endpoints use Chenile's `SearchRequest/SearchResponse` pattern via POST. Stock adjustments use PATCH STM events. Stats use standard REST GET.

---

## Section 1: Stats Cards (4 cards)

**Description:** Inventory summary — total SKUs, in stock, low stock, out of stock
**API:** `GET /api/seller/inventory/stats`
**Fetch/XHR name:** `stats`

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "totalSKUs": 89,
    "inStock": 72,
    "inStockPercent": 81,
    "lowStock": 12,
    "lowStockPercent": 13,
    "outOfStock": 5,
    "outOfStockPercent": 6
  }
}
```

---

## Section 2: Low Stock Alert Banner

**Description:** Alert showing count of out-of-stock and low-stock products
**API:** No separate API — derived from stats (Section 1)

---

## Section 3: Inventory Table (search, filter, paginate — Chenile Query)

**Description:** Inventory list showing stock levels with inline editing
**API:** `POST /api/query/seller-inventory`
**Fetch/XHR name:** `seller-inventory`

**Request (SearchRequest):**
```json
{
  "queryName": "SellerInventory.allInventory",
  "pageNum": 1,
  "numRowsInPage": 8,
  "sortCriteria": [
    { "name": "currentStock", "ascendingOrder": true }
  ],
  "filters": {
    "q": "",
    "category": "",
    "stockStatus": "ALL"
  }
}
```

**Response (GenericResponse<SearchResponse>):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "list": [
      {
        "row": {
          "id": "prod-001",
          "name": "Pro Max Wireless Headphone",
          "sku": "HB-EL-0012",
          "category": "Electronics",
          "image": "/images/products/headphone.jpg",
          "currentStock": 148,
          "lowStockThreshold": 10,
          "stockStatus": "IN_STOCK",
          "price": 4999,
          "totalValue": 739852,
          "lastRestocked": "2026-03-15T10:00:00Z",
          "updatedTime": "2026-03-28T09:00:00Z"
        },
        "allowedActions": [
          { "allowedAction": "adjustStock", "acls": "SELLER", "bodyType": "StockAdjustPayload" }
        ]
      }
    ],
    "currentPage": 1,
    "maxPages": 12,
    "maxRows": 89,
    "numRowsInPage": 8,
    "numRowsReturned": 8,
    "startRow": 1,
    "endRow": 8,
    "columnMetadata": {
      "name": { "name": "Product", "columnType": "Text", "filterable": true, "sortable": true, "display": true },
      "sku": { "name": "SKU", "columnType": "Text", "filterable": true, "sortable": false, "display": true },
      "currentStock": { "name": "Stock", "columnType": "Number", "filterable": true, "sortable": true, "display": true },
      "stockStatus": { "name": "Status", "columnType": "Text", "filterable": true, "sortable": true, "display": true }
    },
    "hiddenColumns": ["id"],
    "availableCannedReports": [
      { "name": "allInventory", "description": "All inventory" },
      { "name": "lowStock", "description": "Low stock items" },
      { "name": "outOfStock", "description": "Out of stock items" }
    ]
  }
}
```

---

## Section 4: Update Stock (STM Event)

**Description:** Update stock quantity for a product (inline or via modal)
**API:** `PATCH /api/inventory/{id}/adjustStock`
**Fetch/XHR name:** `inventory/{id}/adjustStock`

**Request Body:**
```json
{
  "quantity": 50,
  "adjustmentType": "ADD",
  "reason": "Restocked from supplier"
}
```

**Response (GenericResponse<StateEntityServiceResponse<Inventory>>):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "mutatedEntity": {
      "id": "prod-001",
      "previousStock": 148,
      "currentStock": 198,
      "stateId": "IN_STOCK"
    },
    "allowedActionsAndMetadata": [
      { "allowedAction": "adjustStock", "acls": "SELLER" }
    ]
  }
}
```

---

## Section 5: Stock Movement History (Chenile Query)

**Description:** View history of stock changes for a product
**API:** `POST /api/query/seller-inventory-movements`
**Fetch/XHR name:** `seller-inventory-movements`

**Request (SearchRequest):**
```json
{
  "queryName": "SellerInventory.movements",
  "pageNum": 1,
  "numRowsInPage": 20,
  "sortCriteria": [
    { "name": "createdTime", "ascendingOrder": false }
  ],
  "filters": {
    "productId": "prod-001"
  }
}
```

**Response (GenericResponse<SearchResponse>):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "list": [
      {
        "row": {
          "id": "mov-001",
          "type": "ADD",
          "quantity": 50,
          "previousStock": 148,
          "newStock": 198,
          "reason": "Restocked from supplier",
          "createdTime": "2026-03-28T09:00:00Z",
          "createdBy": "Rajesh Store"
        },
        "allowedActions": []
      }
    ],
    "currentPage": 1,
    "maxPages": 3,
    "maxRows": 45,
    "numRowsInPage": 20,
    "numRowsReturned": 20,
    "startRow": 1,
    "endRow": 20
  }
}
```

---

## Section 6: Bulk Stock Update

**Description:** Upload CSV for bulk stock updates
**API:** `POST /api/seller/inventory/bulk`
**Fetch/XHR name:** `bulk`

**Request:** `multipart/form-data` with file field `file`

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "updated": 45,
    "errors": 2,
    "errorDetails": [
      { "row": 12, "sku": "HB-XX-0099", "message": "SKU not found" }
    ]
  }
}
```

---

## Section 7: Export Inventory

**Description:** Export inventory to CSV
**API:** `GET /api/seller/inventory/export`
**Fetch/XHR name:** `export`

**Query Params:**
- `format` — `csv` or `xlsx`
- `stockStatus` — optional filter

**Response:** Binary file download.

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name | Type | Cache |
|---|---------|-------------|--------|----------------|------|-------|
| 1 | Stats Cards | `/api/seller/inventory/stats` | GET | `stats` | REST | 30s |
| 2 | Alert Banner | Derived from stats | — | — | — | — |
| 3 | Inventory Table | `/api/query/seller-inventory` | POST | `seller-inventory` | Chenile Query | 30s |
| 4 | Update Stock | `/api/inventory/{id}/adjustStock` | PATCH | `inventory/{id}/adjustStock` | STM Event | — |
| 5 | Movement History | `/api/query/seller-inventory-movements` | POST | `seller-inventory-movements` | Chenile Query | 15s |
| 6 | Bulk Update | `/api/seller/inventory/bulk` | POST | `bulk` | REST | — |
| 7 | Export | `/api/seller/inventory/export` | GET | `export` | REST | — |

**Total API calls on page load: 2 (parallel)**

---

## Frontend Integration Pattern

```typescript
// Server component
import { getApiClient } from '@homebase/api-client';

export default async function SellerInventory({ searchParams }) {
  const api = getApiClient();

  const [stats, inventory] = await Promise.allSettled([
    api.get('/seller/inventory/stats'),
    api.post('/query/seller-inventory', {
      queryName: 'SellerInventory.allInventory',
      pageNum: Number(searchParams.page) || 1,
      numRowsInPage: 8,
      sortCriteria: [{ name: searchParams.sortBy || 'currentStock', ascendingOrder: searchParams.sortOrder === 'asc' }],
      filters: {
        q: searchParams.q,
        category: searchParams.category,
        stockStatus: searchParams.stockStatus || 'ALL',
      },
    }),
  ]);

  return (
    <>
      <StatsCards data={unwrap(stats)} />
      <LowStockAlert data={unwrap(stats)} />
      <SearchFilters />
      <InventoryTable data={unwrap(inventory)} />
    </>
  );
}
```

---

## Backend Endpoints

| Endpoint | Exists? | Backend Module |
|----------|---------|---------------|
| `GET /seller/inventory/stats` | New | seller service (aggregation) |
| `POST /query/seller-inventory` | New | inventory-query module (MyBatis) |
| `PATCH /inventory/{id}/{eventID}` | New | inventory service (STM) |
| `POST /query/seller-inventory-movements` | New | inventory-query module (MyBatis) |
| `POST /seller/inventory/bulk` | New | seller service |
| `GET /seller/inventory/export` | New | seller service |

---

## Allowed Actions -> UI Mapping

The backend returns `allowedActions` per row based on the entity's current state (STM).
The frontend reads these and renders only the allowed buttons.

**STM Source:** `inventory-states.xml` (inventory-flow)
**Seller ACL filter:** Inventory transitions are primarily `WAREHOUSE`/`SYSTEM` ACL. Sellers see stock levels and can trigger warehouse actions if they have warehouse access.

### State -> Allowed Actions -> UI Buttons

| State | allowedActions (seller-visible) | UI Button | Icon | Color | Event ID |
|-------|-------------------------------|-----------|------|-------|----------|
| STOCK_PENDING | inspectStock | Start Inspection | ClipboardCheck | blue | inspectStock |
| STOCK_INSPECTION | approveStock | Approve Stock | CheckCircle | green | approveStock |
| STOCK_INSPECTION | rejectStock | Reject Stock | XCircle | red | rejectStock |
| STOCK_INSPECTION | damageFound | Report Damage | AlertTriangle | amber | damageFound |
| STOCK_APPROVED | allocateToWarehouse | Allocate to Warehouse | Warehouse | blue | allocateToWarehouse |
| IN_WAREHOUSE | returnDamaged | Report Damage | AlertTriangle | amber | returnDamaged |
| IN_WAREHOUSE | discardDamaged | Discard Damaged | Trash2 | red | discardDamaged |
| IN_WAREHOUSE | repairDamaged | Repair Stock | Wrench | blue | repairDamaged |
| OUT_OF_STOCK | -- | (read-only, awaiting restock) | -- | -- | -- |
| PARTIAL_DAMAGE | repairDamageds | Repair Damaged | Wrench | blue | repairDamageds |
| PARTIAL_DAMAGE | discardDamaged | Discard Damaged | Trash2 | red | discardDamaged |
| PARTIAL_DAMAGE | returnToSupplier | Return to Supplier | Undo2 | amber | returnToSupplier |
| DAMAGED_AT_WAREHOUSE | repairDamaged | Repair Stock | Wrench | blue | repairDamaged |
| DAMAGED_AT_WAREHOUSE | discardDamaged | Discard All | Trash2 | red | discardDamaged |
| STOCK_REJECTED | returnRejectedStock | Return to Supplier | Undo2 | amber | returnRejectedStock |
| RETURN_TO_SUPPLIER | returnCompleted | Confirm Return | CheckCircle | green | returnCompleted |
| RETURNED_TO_SUPPLIER | -- | (read-only, terminal) | -- | -- | -- |
| DISCARDED | -- | (read-only, terminal) | -- | -- | -- |

### Frontend Pattern

```typescript
const SELLER_INVENTORY_ACTION_CONFIG: Record<string, ActionButtonConfig> = {
  inspectStock: { label: 'Start Inspection', icon: 'ClipboardCheck', color: 'blue' },
  approveStock: { label: 'Approve Stock', icon: 'CheckCircle', color: 'green' },
  rejectStock: { label: 'Reject Stock', icon: 'XCircle', color: 'red' },
  damageFound: { label: 'Report Damage', icon: 'AlertTriangle', color: 'amber' },
  allocateToWarehouse: { label: 'Allocate to Warehouse', icon: 'Warehouse', color: 'blue' },
  returnDamaged: { label: 'Report Damage', icon: 'AlertTriangle', color: 'amber' },
  discardDamaged: { label: 'Discard Damaged', icon: 'Trash2', color: 'red' },
  repairDamaged: { label: 'Repair Stock', icon: 'Wrench', color: 'blue' },
  repairDamageds: { label: 'Repair Damaged', icon: 'Wrench', color: 'blue' },
  returnToSupplier: { label: 'Return to Supplier', icon: 'Undo2', color: 'amber' },
  returnRejectedStock: { label: 'Return to Supplier', icon: 'Undo2', color: 'amber' },
  returnCompleted: { label: 'Confirm Return', icon: 'CheckCircle', color: 'green' },
};

// Render only allowed actions
{allowedActions.map(a => {
  const config = SELLER_INVENTORY_ACTION_CONFIG[a.allowedAction];
  return config ? <ActionButton {...config} onClick={() => triggerEvent(id, a.allowedAction)} /> : null;
})}
```
