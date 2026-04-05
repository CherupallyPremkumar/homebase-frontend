# Warehouse Inbound Receiving -- API Contract

## Page: warehouse-inbound.html

**Note:** Inbound shipments table uses Chenile's `SearchRequest/SearchResponse` pattern via POST. Receiving/completion actions use PATCH STM events. Stats use REST GET.

---

## Section 1: Page Header
**Data needed:** Expected shipments count for today
**API:** Derived from stats call (Section 2)

---

## Section 2: Stats Cards (4 cards)

**API:** `GET /api/warehouse/inbound/stats`

**Response:**
```json
{
  "totalInbound": {
    "value": 8,
    "label": "Today"
  },
  "arrived": {
    "value": 3,
    "recentChange": "+1 this hour"
  },
  "inProgress": {
    "value": 2,
    "label": "Active"
  },
  "scheduled": {
    "value": 3,
    "label": "Pending"
  }
}
```

---

## Section 3: Inbound Shipments Table

**API:** `POST /api/query/warehouse-inbound`
**Fetch/XHR name:** `warehouse-inbound`

**Request (SearchRequest):**
```json
{
  "queryName": "WarehouseInbound.allShipments",
  "pageNum": 1,
  "numRowsInPage": 20,
  "sortCriteria": [{ "name": "expectedDate", "ascendingOrder": true }],
  "filters": { "status": "ALL", "search": "" }
}
```

**Response:**
```json
{
  "list": [
    {
      "row": {
        "id": "INB-20260328-001",
        "seller": {
          "name": "TechMart India",
          "code": "SLR-1042",
          "initials": "TM"
        },
        "productCount": 12,
        "expectedDate": "2026-03-28",
        "arrivedTime": "2026-03-28T09:15:00Z",
        "stateId": "ARRIVED",
        "assignedTo": "Rajesh S.",
        "items": [
          {
            "sku": "HB-EL-4521",
            "name": "Samsung Galaxy S24",
            "expectedQty": 50,
            "receivedQty": null
          }
        ]
      }
    },
    {
      "row": {
        "id": "INB-20260328-002",
        "seller": {
          "name": "GreenHome Essentials",
          "code": "SLR-1087",
          "initials": "GH"
        },
        "productCount": 8,
        "expectedDate": "2026-03-28",
        "arrivedTime": "2026-03-28T08:42:00Z",
        "stateId": "IN_PROGRESS",
        "assignedTo": "Priya M.",
        "receivingProgress": {
          "received": 5,
          "total": 8,
          "percent": 62
        }
      }
    },
    {
      "row": {
        "id": "INB-20260328-003",
        "seller": {
          "name": "FashionHub India",
          "code": "SLR-1023",
          "initials": "FH"
        },
        "productCount": 25,
        "expectedDate": "2026-03-28",
        "arrivedTime": null,
        "stateId": "SCHEDULED",
        "assignedTo": null,
        "eta": "2026-03-28T14:00:00Z"
      }
    }
  ],
  "totalCount": 8,
  "numRowsInPage": 8
}
```

**Note:** Uses Chenile SearchRequest format. Response follows `GenericResponse<InboundShipment>` wrapper.

---

## Section 4: Inbound Shipment Detail

**API:** `GET /api/warehouse/inbound/{shipmentId}`

**Response:**
```json
{
  "id": "INB-20260328-001",
  "seller": {
    "name": "TechMart India",
    "code": "SLR-1042"
  },
  "expectedDate": "2026-03-28",
  "arrivedTime": "2026-03-28T09:15:00Z",
  "stateId": "ARRIVED",
  "assignedTo": "Rajesh S.",
  "items": [
    {
      "sku": "HB-EL-4521",
      "name": "Samsung Galaxy S24",
      "expectedQty": 50,
      "receivedQty": null,
      "condition": null,
      "binLocation": null
    },
    {
      "sku": "HB-EL-4522",
      "name": "Samsung Galaxy S24 Ultra",
      "expectedQty": 30,
      "receivedQty": null,
      "condition": null,
      "binLocation": null
    }
  ],
  "notes": null,
  "documents": [
    {
      "type": "INVOICE",
      "url": "/documents/INB-20260328-001/invoice.pdf"
    }
  ]
}
```

---

## Section 5: Receiving Form (Mark Items Received)

**Action -- Receive Individual Item:**

**API:** `PATCH /api/warehouseinbound/{shipmentId}/receive`
**Fetch/XHR name:** `warehouseinbound/{shipmentId}/receive`

**Request:**
```json
{
  "items": [
    {
      "sku": "HB-EL-4521",
      "receivedQty": 48,
      "condition": "GOOD",
      "damagedQty": 2,
      "damageNotes": "Packaging dented on 2 units",
      "binLocation": "A3-R2-S5"
    },
    {
      "sku": "HB-EL-4522",
      "receivedQty": 30,
      "condition": "GOOD",
      "damagedQty": 0,
      "damageNotes": null,
      "binLocation": "A3-R2-S6"
    }
  ],
  "receivedBy": "staff-001",
  "notes": "2 units damaged in transit, quarantined for seller review"
}
```

**Response:**
```json
{
  "id": "INB-20260328-001",
  "stateId": "COMPLETED",
  "totalExpected": 80,
  "totalReceived": 78,
  "totalDamaged": 2,
  "completedAt": "2026-03-28T10:30:00Z",
  "receivedBy": "Rajesh S."
}
```

**Condition values:** `GOOD`, `DAMAGED`, `MISSING`, `WRONG_ITEM`

---

## Section 6: Barcode/Scan for Inbound

**Action -- Scan Barcode to Look Up Shipment:**

**API:** `GET /api/warehouse/inbound/scan/{barcode}`

**Path Params:**
- `barcode` -- scanned barcode value (shipment ID or SKU)

**Response:**
```json
{
  "matchType": "SHIPMENT",
  "shipmentId": "INB-20260328-001",
  "seller": "TechMart India",
  "stateId": "ARRIVED",
  "productCount": 12,
  "expectedDate": "2026-03-28"
}
```

**Alternative (SKU match):**
```json
{
  "matchType": "SKU",
  "sku": "HB-EL-4521",
  "productName": "Samsung Galaxy S24",
  "pendingShipments": [
    {
      "shipmentId": "INB-20260328-001",
      "seller": "TechMart India",
      "expectedQty": 50
    }
  ]
}
```

---

## Section 7: Complete Receiving (Mark Shipment Done)

**API:** `PATCH /api/warehouseinbound/{shipmentId}/complete`
**Fetch/XHR name:** `warehouseinbound/{shipmentId}/complete`

**Request:**
```json
{
  "completedBy": "staff-001",
  "signatureUrl": "/signatures/INB-20260328-001.png",
  "notes": "All items verified and shelved"
}
```

**Response:**
```json
{
  "id": "INB-20260328-001",
  "stateId": "COMPLETED",
  "completedAt": "2026-03-28T10:30:00Z"
}
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Page Header | Derived from stats | -- | -- |
| 2 | Stats Cards | `/api/warehouse/inbound/stats` | GET | 15s |
| 3 | Shipments Table | `/api/query/warehouse-inbound` | POST (Chenile Query) | 15s |
| 4 | Shipment Detail | `/api/warehouse/inbound/{shipmentId}` | GET | 30s |
| 5 | Receive Items | `/api/warehouse/inbound/{shipmentId}/receive` | PUT | -- |
| 6 | Scan Barcode | `/api/warehouse/inbound/scan/{barcode}` | GET | -- |
| 7 | Complete Receiving | `/api/warehouse/inbound/{shipmentId}/complete` | PUT | -- |

**Total API calls on page load: 2 (parallel)**
**User-triggered actions: 3 (receive, scan, complete)**

---

## Warehouse-Specific Actions

| Action | Endpoint | Method | Trigger |
|--------|----------|--------|---------|
| Receive Items | `/api/warehouseinbound/{shipmentId}/receive` | PATCH (STM Event) | "Receive" button per shipment row |
| Scan Barcode | `/api/warehouse/inbound/scan/{barcode}` | GET | "Scan Barcode" button in header |
| Complete Receiving | `/api/warehouseinbound/{shipmentId}/complete` | PATCH (STM Event) | "Complete" button in receiving form |
| Export Inbound Data | `/api/warehouse/inbound/export?format=csv` | GET | "Export" button in header |
| Assign Staff | `/api/warehouse/inbound/{shipmentId}/assign` | PUT | Assign dropdown on scheduled rows |

---

## Frontend Integration Pattern

```typescript
// In Next.js page (server component)
export default async function WarehouseInbound() {
  const [stats, shipments] = await Promise.allSettled([
    warehouseApi.inboundStats(),
    warehouseApi.inbound({ status: 'ALL', pageSize: 20, sortBy: 'expectedDate' }),
  ]);

  return (
    <>
      <PageHeader expectedToday={stats.totalInbound} />
      <StatsCards data={stats} />
      <InboundTable data={shipments} />
      <ReceivingFormModal /> {/* Client component, shown on "Receive" click */}
    </>
  );
}
```

---

## Existing Backend Endpoints (from api-client)

**New endpoints needed:**
1. `GET /api/warehouse/inbound/stats` -- inbound summary counts
2. `GET /api/warehouse/inbound` -- paginated inbound shipments list
3. `GET /api/warehouse/inbound/{shipmentId}` -- single shipment detail
4. `PUT /api/warehouse/inbound/{shipmentId}/receive` -- mark items received with condition
5. `PUT /api/warehouse/inbound/{shipmentId}/complete` -- finalize receiving
6. `GET /api/warehouse/inbound/scan/{barcode}` -- barcode lookup

---

## Allowed Actions -> UI Mapping

The backend returns `allowedActions` per row based on the entity's current state (STM).
The frontend reads these and renders only the allowed buttons.

**STM Source:** `inventory-states.xml` (inventory-flow)
**Warehouse ACL filter:** Events with `WAREHOUSE` in `meta-acls`. Warehouse staff handle all inbound receiving and QC.

### State -> Allowed Actions -> UI Buttons

| State | allowedActions (warehouse-visible) | UI Button | Icon | Color | Event ID |
|-------|-----------------------------------|-----------|------|-------|----------|
| STOCK_PENDING | inspectStock | Start QC Inspection | ClipboardCheck | blue | inspectStock |
| STOCK_INSPECTION | approveStock | Pass QC | CheckCircle | green | approveStock |
| STOCK_INSPECTION | rejectStock | Fail QC | XCircle | red | rejectStock |
| STOCK_INSPECTION | damageFound | Report Damage | AlertTriangle | amber | damageFound |
| STOCK_APPROVED | allocateToWarehouse | Put Away | Warehouse | green | allocateToWarehouse |
| PARTIAL_DAMAGE | repairDamageds | Repair & Approve | Wrench | blue | repairDamageds |
| PARTIAL_DAMAGE | discardDamaged | Discard Damaged | Trash2 | red | discardDamaged |
| PARTIAL_DAMAGE | returnToSupplier | Return to Supplier | Undo2 | amber | returnToSupplier |
| IN_WAREHOUSE | returnDamaged | Report Damage | AlertTriangle | amber | returnDamaged |
| IN_WAREHOUSE | discardDamaged | Discard Damaged | Trash2 | red | discardDamaged |
| IN_WAREHOUSE | repairDamaged | Repair | Wrench | blue | repairDamaged |
| DAMAGED_AT_WAREHOUSE | repairDamaged | Repair | Wrench | blue | repairDamaged |
| DAMAGED_AT_WAREHOUSE | discardDamaged | Write Off | Trash2 | red | discardDamaged |
| STOCK_REJECTED | returnRejectedStock | Return to Supplier | Undo2 | amber | returnRejectedStock |
| RETURN_TO_SUPPLIER | returnCompleted | Confirm Return Complete | CheckCircle | green | returnCompleted |
| RETURNED_TO_SUPPLIER | -- | (read-only, terminal) | -- | -- | -- |
| DISCARDED | -- | (read-only, terminal) | -- | -- | -- |

### Frontend Pattern

```typescript
const WAREHOUSE_INBOUND_ACTION_CONFIG: Record<string, ActionButtonConfig> = {
  inspectStock: { label: 'Start QC Inspection', icon: 'ClipboardCheck', color: 'blue' },
  approveStock: { label: 'Pass QC', icon: 'CheckCircle', color: 'green' },
  rejectStock: { label: 'Fail QC', icon: 'XCircle', color: 'red' },
  damageFound: { label: 'Report Damage', icon: 'AlertTriangle', color: 'amber' },
  allocateToWarehouse: { label: 'Put Away', icon: 'Warehouse', color: 'green' },
  repairDamageds: { label: 'Repair & Approve', icon: 'Wrench', color: 'blue' },
  discardDamaged: { label: 'Discard Damaged', icon: 'Trash2', color: 'red' },
  returnToSupplier: { label: 'Return to Supplier', icon: 'Undo2', color: 'amber' },
  returnDamaged: { label: 'Report Damage', icon: 'AlertTriangle', color: 'amber' },
  repairDamaged: { label: 'Repair', icon: 'Wrench', color: 'blue' },
  returnRejectedStock: { label: 'Return to Supplier', icon: 'Undo2', color: 'amber' },
  returnCompleted: { label: 'Confirm Return Complete', icon: 'CheckCircle', color: 'green' },
};

// Render only allowed actions
{allowedActions.map(a => {
  const config = WAREHOUSE_INBOUND_ACTION_CONFIG[a.allowedAction];
  return config ? <ActionButton {...config} onClick={() => triggerEvent(id, a.allowedAction)} /> : null;
})}
```
