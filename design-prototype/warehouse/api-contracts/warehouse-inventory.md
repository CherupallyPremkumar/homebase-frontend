# Warehouse Inventory -- API Contract

## Page: warehouse-inventory.html

**Note:** Inventory table uses Chenile's `SearchRequest/SearchResponse` pattern via POST. Stock adjustments use PATCH STM events. Stats and zone map use REST GET.

---

## Section 1: Page Header
**Data needed:** Page title, action buttons (Stock Audit, Export)
**API:** No API call needed -- static content

---

## Section 2: Stats Cards (4 cards)

**API:** `GET /api/warehouse/inventory/stats`

**Response:**
```json
{
  "totalSkus": {
    "value": 2450,
    "change": 12,
    "changeDirection": "up"
  },
  "totalUnits": {
    "value": 24560,
    "change": 340,
    "changeDirection": "up"
  },
  "lowStock": {
    "value": 34,
    "change": 5,
    "changeDirection": "up"
  },
  "outOfStock": {
    "value": 8,
    "change": 2,
    "changeDirection": "up"
  }
}
```

---

## Section 3: Inventory Table (Search + Filter + Paginated)

**API:** `POST /api/query/warehouse-inventory`
**Fetch/XHR name:** `warehouse-inventory`

**Request (SearchRequest):**
```json
{
  "queryName": "WarehouseInventory.allItems",
  "pageNum": 1,
  "numRowsInPage": 20,
  "sortCriteria": [{ "name": "sku", "ascendingOrder": true }],
  "filters": { "search": "", "zone": "ALL", "category": "ALL", "status": "ALL" }
}
```

**Response:**
```json
{
  "list": [
    {
      "row": {
        "sku": "HB-EL-4521",
        "productName": "Samsung Galaxy S24",
        "category": "Electronics",
        "seller": "TechWorld India",
        "zone": "A",
        "binLocation": "A3-R2-S5",
        "qty": 120,
        "reserved": 18,
        "available": 102,
        "status": "IN_STOCK",
        "lastMovement": "2026-03-28T10:24:00Z"
      }
    },
    {
      "row": {
        "sku": "HB-HK-8823",
        "productName": "Prestige Coffee Maker",
        "category": "Home & Kitchen",
        "seller": "HomeGoods Ltd",
        "zone": "B",
        "binLocation": "B1-R4-S2",
        "qty": 85,
        "reserved": 12,
        "available": 73,
        "status": "IN_STOCK",
        "lastMovement": "2026-03-28T09:15:00Z"
      }
    },
    {
      "row": {
        "sku": "HB-CL-3347",
        "productName": "Nike Dri-FIT T-Shirt",
        "category": "Clothing",
        "seller": "FashionHub",
        "zone": "C",
        "binLocation": "C2-R1-S8",
        "qty": 8,
        "reserved": 3,
        "available": 5,
        "status": "LOW_STOCK",
        "lastMovement": "2026-03-27T16:32:00Z"
      }
    },
    {
      "row": {
        "sku": "HB-EL-9912",
        "productName": "Sony WH-1000XM5",
        "category": "Electronics",
        "seller": "AudioMax Pvt Ltd",
        "zone": "A",
        "binLocation": "A1-R5-S3",
        "qty": 0,
        "reserved": 0,
        "available": 0,
        "status": "OUT_OF_STOCK",
        "lastMovement": "2026-03-26T14:18:00Z"
      }
    },
    {
      "row": {
        "sku": "HB-BT-5567",
        "productName": "Dove Body Wash 500ml",
        "category": "Beauty",
        "seller": "BeautyEssentials",
        "zone": "D",
        "binLocation": "D2-R3-S1",
        "qty": 340,
        "reserved": 45,
        "available": 295,
        "status": "IN_STOCK",
        "lastMovement": "2026-03-28T08:40:00Z"
      }
    },
    {
      "row": {
        "sku": "HB-SP-7741",
        "productName": "Yonex Badminton Racket",
        "category": "Sports",
        "seller": "SportsZone India",
        "zone": "B",
        "binLocation": "B4-R2-S6",
        "qty": 12,
        "reserved": 7,
        "available": 5,
        "status": "LOW_STOCK",
        "lastMovement": "2026-03-27T11:05:00Z"
      }
    }
  ],
  "totalCount": 2450,
  "numRowsInPage": 20
}
```

**Note:** Uses Chenile SearchRequest format. Response follows `GenericResponse<InventoryItem>` wrapper.

---

## Section 4: Inventory Item Detail

**API:** `GET /api/warehouse/inventory/{sku}`

**Response:**
```json
{
  "sku": "HB-EL-4521",
  "productName": "Samsung Galaxy S24",
  "category": "Electronics",
  "seller": {
    "name": "TechWorld India",
    "code": "SLR-1042"
  },
  "zone": "A",
  "binLocation": "A3-R2-S5",
  "qty": 120,
  "reserved": 18,
  "available": 102,
  "reorderLevel": 20,
  "maxCapacity": 200,
  "status": "IN_STOCK",
  "weight": "0.19 kg",
  "dimensions": "15.8 x 7.6 x 0.78 cm",
  "lastMovement": "2026-03-28T10:24:00Z",
  "movements": [
    {
      "type": "INBOUND",
      "qty": 50,
      "timestamp": "2026-03-28T06:15:00Z",
      "reference": "INB-20260328-001",
      "performedBy": "Rajesh S."
    },
    {
      "type": "PICKED",
      "qty": -3,
      "timestamp": "2026-03-28T10:24:00Z",
      "reference": "ORD-7841",
      "performedBy": "Rajesh K."
    }
  ]
}
```

---

## Section 5: Adjust Stock (Edit Inventory)

**API:** `PATCH /api/warehouseinventory/{sku}/adjust`
**Fetch/XHR name:** `warehouseinventory/{sku}/adjust`

**Request:**
```json
{
  "adjustmentType": "MANUAL_ADJUST",
  "newQty": 118,
  "reason": "Cycle count correction",
  "binLocation": "A3-R2-S5",
  "adjustedBy": "staff-001"
}
```

**Response:**
```json
{
  "sku": "HB-EL-4521",
  "previousQty": 120,
  "newQty": 118,
  "adjustmentType": "MANUAL_ADJUST",
  "reason": "Cycle count correction",
  "timestamp": "2026-03-28T11:00:00Z"
}
```

**adjustmentType values:** `MANUAL_ADJUST`, `CYCLE_COUNT`, `DAMAGE_WRITEOFF`, `RETURN_RESTOCK`, `TRANSFER`

---

## Section 6: Stock Movements Log

**API:** `GET /api/warehouse/inventory/{sku}/movements?pageSize=10&page=1`

**Query Params:**
- `pageSize` -- default 10
- `page` -- page number
- `type` -- `INBOUND`, `PICKED`, `RETURNED`, `ADJUSTED`, `TRANSFERRED`, `DAMAGED`

**Response:**
```json
{
  "list": [
    {
      "row": {
        "id": "mov-001",
        "type": "INBOUND",
        "qty": 50,
        "direction": "in",
        "timestamp": "2026-03-28T06:15:00Z",
        "reference": "INB-20260328-001",
        "performedBy": "Rajesh S.",
        "fromLocation": null,
        "toLocation": "A3-R2-S5"
      }
    },
    {
      "row": {
        "id": "mov-002",
        "type": "PICKED",
        "qty": 3,
        "direction": "out",
        "timestamp": "2026-03-28T10:24:00Z",
        "reference": "ORD-7841",
        "performedBy": "Rajesh K.",
        "fromLocation": "A3-R2-S5",
        "toLocation": "Packing Station 3"
      }
    }
  ],
  "totalCount": 45
}
```

---

## Section 7: Zone Map Overview

**API:** `GET /api/warehouse/zones`

*Same endpoint as dashboard -- see warehouse-dashboard.md Section 5.*

---

## Section 8: Barcode/Scan for Inventory Lookup

**API:** `GET /api/warehouse/inventory/scan/{barcode}`

**Path Params:**
- `barcode` -- scanned barcode value (SKU barcode or bin location barcode)

**Response:**
```json
{
  "matchType": "SKU",
  "sku": "HB-EL-4521",
  "productName": "Samsung Galaxy S24",
  "zone": "A",
  "binLocation": "A3-R2-S5",
  "qty": 120,
  "available": 102,
  "status": "IN_STOCK"
}
```

**Alternative (bin location scan):**
```json
{
  "matchType": "BIN",
  "binLocation": "A3-R2-S5",
  "zone": "A",
  "items": [
    {
      "sku": "HB-EL-4521",
      "productName": "Samsung Galaxy S24",
      "qty": 120
    }
  ]
}
```

---

## Section 9: Stock Audit

**API:** `POST /api/warehouse/inventory/audit`

**Request:**
```json
{
  "zone": "A",
  "auditType": "CYCLE_COUNT",
  "items": [
    {
      "sku": "HB-EL-4521",
      "binLocation": "A3-R2-S5",
      "systemQty": 120,
      "countedQty": 118,
      "variance": -2,
      "notes": "2 units missing, possible mispick"
    }
  ],
  "auditedBy": "staff-001"
}
```

**Response:**
```json
{
  "auditId": "AUD-20260328-001",
  "zone": "A",
  "totalItems": 1,
  "totalVariance": -2,
  "variancePercent": 0.2,
  "status": "COMPLETED",
  "completedAt": "2026-03-28T10:30:00Z"
}
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Page Header | None (static) | -- | -- |
| 2 | Stats Cards | `/api/warehouse/inventory/stats` | GET | 15s |
| 3 | Inventory Table | `/api/query/warehouse-inventory` | POST (Chenile Query) | 15s |
| 4 | Item Detail | `/api/warehouse/inventory/{sku}` | GET | 30s |
| 5 | Adjust Stock | `/api/warehouse/inventory/{sku}/adjust` | PUT | -- |
| 6 | Movements Log | `/api/warehouse/inventory/{sku}/movements` | GET | 30s |
| 7 | Zone Map | `/api/warehouse/zones` | GET | 60s |
| 8 | Scan Barcode | `/api/warehouse/inventory/scan/{barcode}` | GET | -- |
| 9 | Stock Audit | `/api/warehouse/inventory/audit` | POST | -- |

**Total API calls on page load: 3 (parallel: stats, inventory list, zones)**
**User-triggered actions: 4 (adjust, scan, audit, export)**

---

## Warehouse-Specific Actions

| Action | Endpoint | Method | Trigger |
|--------|----------|--------|---------|
| Adjust Stock | `/api/warehouseinventory/{sku}/adjust` | PATCH (STM Event) | Edit button on inventory row |
| Scan Barcode | `/api/warehouse/inventory/scan/{barcode}` | GET | Scan/search action |
| Stock Audit | `/api/warehouse/inventory/audit` | POST | "Stock Audit" button in header |
| Export Inventory | `/api/warehouse/inventory/export?format=csv` | GET | "Export" button in header |
| Transfer Item | `/api/warehouse/inventory/{sku}/transfer` | PUT | Move item between zones/bins |

---

## Frontend Integration Pattern

```typescript
// In Next.js page (server component)
export default async function WarehouseInventory({ searchParams }) {
  const [stats, inventory, zones] = await Promise.allSettled([
    warehouseApi.inventoryStats(),
    warehouseApi.inventory({
      search: searchParams.q,
      zone: searchParams.zone || 'ALL',
      category: searchParams.category || 'ALL',
      status: searchParams.status || 'ALL',
      pageSize: 20,
      page: searchParams.page || 1,
    }),
    warehouseApi.zones(),
  ]);

  return (
    <>
      <PageHeader />
      <StatsCards data={stats} />
      <SearchFilterBar />
      <InventoryTable data={inventory} />
      <ZoneMap data={zones} />
      <StockAdjustModal /> {/* Client component */}
    </>
  );
}
```

---

## Existing Backend Endpoints (from api-client)

**New endpoints needed:**
1. `GET /api/warehouse/inventory/stats` -- inventory summary KPIs
2. `GET /api/warehouse/inventory` -- paginated inventory list with search/filter
3. `GET /api/warehouse/inventory/{sku}` -- single item detail with movements
4. `PUT /api/warehouse/inventory/{sku}/adjust` -- manual stock adjustment
5. `GET /api/warehouse/inventory/{sku}/movements` -- movement history
6. `GET /api/warehouse/inventory/scan/{barcode}` -- barcode lookup
7. `POST /api/warehouse/inventory/audit` -- submit cycle count / audit
