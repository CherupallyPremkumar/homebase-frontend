# Warehouse Orders (Pick & Pack) -- API Contract

## Page: warehouse-orders.html

**Note:** Pick queue table uses Chenile's `SearchRequest/SearchResponse` pattern via POST. Pick/pack/assign actions use PATCH STM events. Stats use REST GET.

---

## Section 1: Page Header
**Data needed:** Page title, "Print Pick List" action
**API:** No API call needed -- static content

---

## Section 2: Stats Cards (5 cards)

**API:** `GET /api/warehouse/orders/stats`

**Response:**
```json
{
  "pendingPick": {
    "value": 45,
    "label": "Queued"
  },
  "picking": {
    "value": 12,
    "label": "Active"
  },
  "packing": {
    "value": 8,
    "label": "In Progress"
  },
  "readyToShip": {
    "value": 15,
    "label": "Ready"
  },
  "dispatchedToday": {
    "value": 89,
    "label": "Today"
  }
}
```

---

## Section 3: Pick & Pack Queue (Filtered Table)

**API:** `POST /api/query/warehouse-orders`
**Fetch/XHR name:** `warehouse-orders`

**Request (SearchRequest):**
```json
{
  "queryName": "WarehouseOrder.pickQueue",
  "pageNum": 1,
  "numRowsInPage": 20,
  "sortCriteria": [{ "name": "dueTime", "ascendingOrder": true }],
  "filters": { "status": "ALL", "search": "" }
}
```

**Response:**
```json
{
  "list": [
    {
      "row": {
        "orderId": "ORD-7841",
        "customer": "Priya Sharma",
        "itemCount": 3,
        "priority": "Same Day",
        "zone": "A-1",
        "assignedPicker": "Rajesh K.",
        "stateId": "PICKING",
        "dueTime": "2026-03-28T11:30:00Z",
        "isUrgent": true,
        "isExpress": false
      }
    },
    {
      "row": {
        "orderId": "ORD-7842",
        "customer": "Amit Patel",
        "itemCount": 2,
        "priority": "Express",
        "zone": "B-2",
        "assignedPicker": "Suresh K.",
        "stateId": "PICKING",
        "dueTime": "2026-03-28T14:00:00Z",
        "isUrgent": false,
        "isExpress": true
      }
    },
    {
      "row": {
        "orderId": "ORD-7843",
        "customer": "Deepa Nair",
        "itemCount": 1,
        "priority": "Standard",
        "zone": "C-1",
        "assignedPicker": null,
        "stateId": "PENDING_PICK",
        "dueTime": "2026-03-28T18:00:00Z",
        "isUrgent": false,
        "isExpress": false
      }
    }
  ],
  "totalCount": 169,
  "numRowsInPage": 20
}
```

**Note:** Uses Chenile SearchRequest format. Response follows `GenericResponse<WarehouseOrder>` wrapper.

---

## Section 4: Pick List Per Order (Expandable Row)

**API:** `GET /api/warehouse/orders/{orderId}/pick-list`

**Response:**
```json
{
  "orderId": "ORD-7841",
  "customer": "Priya Sharma",
  "zone": "A-1",
  "assignedPicker": "Rajesh K.",
  "priority": "Same Day",
  "items": [
    {
      "id": "pick-001",
      "sku": "WBH-2204",
      "name": "Wireless Bluetooth Headphones",
      "binLocation": "A-1-04-B",
      "qtyToPick": 1,
      "picked": false
    },
    {
      "id": "pick-002",
      "sku": "PPC-1190",
      "name": "Phone Protective Case (Black)",
      "binLocation": "A-1-07-C",
      "qtyToPick": 1,
      "picked": false
    },
    {
      "id": "pick-003",
      "sku": "UST-3301",
      "name": "USB-C Fast Charger 65W",
      "binLocation": "A-1-02-A",
      "qtyToPick": 1,
      "picked": false
    }
  ]
}
```

---

## Section 5: Pick Item (Mark Individual Item as Picked)

**API:** `PATCH /api/warehouseorder/{orderId}/pickItem`
**Fetch/XHR name:** `warehouseorder/{orderId}/pickItem`

**Request:**
```json
{
  "sku": "WBH-2204",
  "pickedQty": 1,
  "pickedBy": "staff-001",
  "binLocation": "A-1-04-B"
}
```

**Response:**
```json
{
  "orderId": "ORD-7841",
  "sku": "WBH-2204",
  "picked": true,
  "pickedAt": "2026-03-28T10:15:00Z",
  "remainingItems": 2
}
```

---

## Section 6: Mark Order as Picked (All Items)

**API:** `PATCH /api/warehouseorder/{orderId}/markPicked`
**Fetch/XHR name:** `warehouseorder/{orderId}/markPicked`

**Request:**
```json
{
  "pickedBy": "staff-001",
  "items": [
    { "sku": "WBH-2204", "pickedQty": 1 },
    { "sku": "PPC-1190", "pickedQty": 1 },
    { "sku": "UST-3301", "pickedQty": 1 }
  ]
}
```

**Response:**
```json
{
  "orderId": "ORD-7841",
  "stateId": "PACKING",
  "pickedAt": "2026-03-28T10:20:00Z",
  "pickedBy": "Rajesh K.",
  "totalItems": 3,
  "totalPicked": 3
}
```

---

## Section 7: Packing Checklist

**API:** `GET /api/warehouse/orders/{orderId}/packing-checklist`

**Response:**
```json
{
  "orderId": "ORD-7841",
  "customer": "Priya Sharma",
  "shippingAddress": {
    "line1": "42 MG Road",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "items": [
    { "sku": "WBH-2204", "name": "Wireless Bluetooth Headphones", "qty": 1, "packed": false },
    { "sku": "PPC-1190", "name": "Phone Protective Case (Black)", "qty": 1, "packed": false },
    { "sku": "UST-3301", "name": "USB-C Fast Charger 65W", "qty": 1, "packed": false }
  ],
  "packagingType": "BOX_MEDIUM",
  "includeInvoice": true,
  "fragile": false,
  "giftWrap": false
}
```

---

## Section 8: Mark Order as Packed

**API:** `PATCH /api/warehouseorder/{orderId}/markPacked`
**Fetch/XHR name:** `warehouseorder/{orderId}/markPacked`

**Request:**
```json
{
  "packedBy": "staff-002",
  "packagingType": "BOX_MEDIUM",
  "weight": 0.85,
  "dimensions": {
    "length": 30,
    "width": 20,
    "height": 12,
    "unit": "cm"
  },
  "items": [
    { "sku": "WBH-2204", "qty": 1 },
    { "sku": "PPC-1190", "qty": 1 },
    { "sku": "UST-3301", "qty": 1 }
  ]
}
```

**Response:**
```json
{
  "orderId": "ORD-7841",
  "stateId": "READY_TO_SHIP",
  "packedAt": "2026-03-28T10:45:00Z",
  "packedBy": "Priya M.",
  "weight": 0.85,
  "labelGenerated": true,
  "labelUrl": "/labels/ORD-7841.pdf"
}
```

---

## Section 9: Generate Shipping Label

**API:** `POST /api/warehouse/orders/{orderId}/generate-label`

**Request:**
```json
{
  "carrier": "Delhivery",
  "weight": 0.85,
  "dimensions": {
    "length": 30,
    "width": 20,
    "height": 12,
    "unit": "cm"
  }
}
```

**Response:**
```json
{
  "orderId": "ORD-7841",
  "awbNumber": "DL284719500IN",
  "carrier": "Delhivery",
  "labelUrl": "/labels/ORD-7841.pdf",
  "labelFormat": "PDF",
  "barcodeData": "DL284719500IN",
  "generatedAt": "2026-03-28T10:46:00Z"
}
```

---

## Section 10: Assign / Reassign Picker

**API:** `PATCH /api/warehouseorder/{orderId}/assign`
**Fetch/XHR name:** `warehouseorder/{orderId}/assign`

**Request:**
```json
{
  "pickerId": "staff-001",
  "pickerName": "Rajesh K."
}
```

**Response:**
```json
{
  "orderId": "ORD-7843",
  "stateId": "PICKING",
  "assignedPicker": "Rajesh K.",
  "assignedAt": "2026-03-28T10:50:00Z"
}
```

---

## Section 11: Barcode/Scan for Order Lookup

**API:** `GET /api/warehouse/orders/scan/{barcode}`

**Path Params:**
- `barcode` -- scanned barcode (order ID, AWB number, or SKU)

**Response:**
```json
{
  "matchType": "ORDER",
  "orderId": "ORD-7841",
  "customer": "Priya Sharma",
  "stateId": "PICKING",
  "itemCount": 3,
  "zone": "A-1",
  "assignedPicker": "Rajesh K."
}
```

---

## Section 12: Print Pick List

**API:** `GET /api/warehouse/orders/pick-list/print?orderIds=ORD-7841,ORD-7842`

**Query Params:**
- `orderIds` -- comma-separated order IDs to include in print batch

**Response:** PDF binary stream (Content-Type: application/pdf)

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Page Header | None (static) | -- | -- |
| 2 | Stats Cards | `/api/warehouse/orders/stats` | GET | 15s |
| 3 | Pick Queue Table | `/api/query/warehouse-orders` | POST (Chenile Query) | 15s |
| 4 | Pick List (expand) | `/api/warehouse/orders/{orderId}/pick-list` | GET | 30s |
| 5 | Pick Item | `/api/warehouse/orders/{orderId}/pick-item` | PUT | -- |
| 6 | Mark Picked | `/api/warehouse/orders/{orderId}/picked` | PUT | -- |
| 7 | Packing Checklist | `/api/warehouse/orders/{orderId}/packing-checklist` | GET | 30s |
| 8 | Mark Packed | `/api/warehouse/orders/{orderId}/packed` | PUT | -- |
| 9 | Generate Label | `/api/warehouse/orders/{orderId}/generate-label` | POST | -- |
| 10 | Assign Picker | `/api/warehouse/orders/{orderId}/assign` | PUT | -- |
| 11 | Scan Barcode | `/api/warehouse/orders/scan/{barcode}` | GET | -- |
| 12 | Print Pick List | `/api/warehouse/orders/pick-list/print` | GET | -- |

**Total API calls on page load: 2 (parallel: stats, pick-queue)**
**User-triggered actions: 7 (pick-item, picked, packed, generate-label, assign, scan, print)**

---

## Warehouse-Specific Actions

| Action | Endpoint | Method | Trigger |
|--------|----------|--------|---------|
| Pick Single Item | `/api/warehouseorder/{orderId}/pickItem` | PATCH (STM Event) | Checkbox on pick list item |
| Mark All Picked | `/api/warehouseorder/{orderId}/markPicked` | PATCH (STM Event) | "Mark All Picked" button |
| Mark Packed | `/api/warehouseorder/{orderId}/markPacked` | PATCH (STM Event) | "Mark Packed" button in packing flow |
| Generate Label | `/api/warehouse/orders/{orderId}/generate-label` | POST | Auto after packed, or manual trigger |
| Assign Picker | `/api/warehouseorder/{orderId}/assign` | PATCH (STM Event) | "Assign" or "Reassign Picker" button |
| Scan Barcode | `/api/warehouse/orders/scan/{barcode}` | GET | Barcode scanner input |
| Print Pick List | `/api/warehouse/orders/pick-list/print` | GET | "Print Pick List" button |

---

## Frontend Integration Pattern

```typescript
// In Next.js page (server component)
export default async function WarehouseOrders({ searchParams }) {
  const [stats, queue] = await Promise.allSettled([
    warehouseApi.orderStats(),
    warehouseApi.pickQueue({
      status: searchParams.status || 'ALL',
      pageSize: 20,
      page: searchParams.page || 1,
      sortBy: 'dueTime',
      sortOrder: 'asc',
    }),
  ]);

  return (
    <>
      <PageHeader />
      <StatsCards data={stats} />
      <FilterTabs />
      <PickQueueTable data={queue} />
      {/* Client components for interactive actions */}
      <PickListExpandable />
      <PackingChecklistModal />
    </>
  );
}
```

---

## Existing Backend Endpoints (from api-client)

**New endpoints needed:**
1. `GET /api/warehouse/orders/stats` -- pick & pack KPIs
2. `GET /api/warehouse/orders/pick-queue` -- paginated order queue with filters
3. `GET /api/warehouse/orders/{orderId}/pick-list` -- items to pick for an order
4. `PUT /api/warehouse/orders/{orderId}/pick-item` -- mark single item picked
5. `PUT /api/warehouse/orders/{orderId}/picked` -- mark full order picked
6. `GET /api/warehouse/orders/{orderId}/packing-checklist` -- packing checklist with address
7. `PUT /api/warehouse/orders/{orderId}/packed` -- mark order packed with weight/dimensions
8. `POST /api/warehouse/orders/{orderId}/generate-label` -- create shipping label + AWB
9. `PUT /api/warehouse/orders/{orderId}/assign` -- assign/reassign picker
10. `GET /api/warehouse/orders/scan/{barcode}` -- barcode lookup

---

## Allowed Actions -> UI Mapping

The backend returns `allowedActions` per row based on the entity's current state (STM).
The frontend reads these and renders only the allowed buttons.

**STM Source (Order):** `order-states.xml` (order-flow) -- WAREHOUSE ACL events
**STM Source (Fulfillment):** `fulfillment-states.xml` (fulfillment-flow) -- warehouse fulfillment saga

### Order Flow: State -> Allowed Actions -> UI Buttons

| State | allowedActions (warehouse-visible) | UI Button | Icon | Color | Event ID |
|-------|-----------------------------------|-----------|------|-------|----------|
| PAID | startProcessing | Start Processing | Play | green | startProcessing |
| PROCESSING | markShipped | Mark Shipped | Truck | blue | markShipped |
| PROCESSING | partialShip | Partial Ship | PackageCheck | amber | partialShip |
| PARTIALLY_SHIPPED | markShipped | Mark All Shipped | Truck | blue | markShipped |
| PARTIALLY_SHIPPED | partialShip | Ship More Items | PackageCheck | amber | partialShip |
| SHIPPED | -- | (read-only, in transit) | -- | -- | -- |
| DELIVERED | -- | (read-only) | -- | -- | -- |
| COMPLETED | -- | (read-only) | -- | -- | -- |

### Fulfillment Saga: State -> Allowed Actions -> UI Buttons

| State | allowedActions (warehouse-visible) | UI Button | Icon | Color | Event ID |
|-------|-----------------------------------|-----------|------|-------|----------|
| INITIATED | -- | (system-driven) | -- | -- | -- |
| INVENTORY_RESERVED | createShipment | Create Shipment | Package | blue | createShipment |
| SHIPMENT_CREATED | ship | Dispatch | Truck | green | ship |
| SHIPPED | -- | (read-only, in transit) | -- | -- | -- |
| COMPLETED | -- | (read-only, terminal) | -- | -- | -- |

### Frontend Pattern

```typescript
const WAREHOUSE_ORDER_ACTION_CONFIG: Record<string, ActionButtonConfig> = {
  startProcessing: { label: 'Start Processing', icon: 'Play', color: 'green' },
  markShipped: { label: 'Mark Shipped', icon: 'Truck', color: 'blue' },
  partialShip: { label: 'Partial Ship', icon: 'PackageCheck', color: 'amber' },
  createShipment: { label: 'Create Shipment', icon: 'Package', color: 'blue' },
  ship: { label: 'Dispatch', icon: 'Truck', color: 'green' },
};

// Render only allowed actions
{allowedActions.map(a => {
  const config = WAREHOUSE_ORDER_ACTION_CONFIG[a.allowedAction];
  return config ? <ActionButton {...config} onClick={() => triggerEvent(id, a.allowedAction)} /> : null;
})}
```
