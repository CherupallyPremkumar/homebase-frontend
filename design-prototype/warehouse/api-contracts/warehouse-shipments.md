# Warehouse Shipments -- API Contract

## Page: warehouse-shipments.html

**Note:** Shipments table uses Chenile's `SearchRequest/SearchResponse` pattern via POST. Dispatch uses PATCH STM event. Stats, tracking, carrier performance, and pickup schedule use REST GET.

---

## Section 1: Page Header
**Data needed:** Page title, "Export" and "Schedule Pickup" actions
**API:** No API call needed -- static content

---

## Section 2: Stats Cards (5 cards)

**API:** `GET /api/warehouse/shipments/stats?date=2026-03-28`

**Query Params:**
- `date` -- ISO date string, defaults to today

**Response:**
```json
{
  "totalShipments": {
    "value": 89,
    "label": "Today"
  },
  "pickedUp": {
    "value": 45,
    "percent": 50.6
  },
  "inTransit": {
    "value": 32,
    "percent": 36.0
  },
  "delivered": {
    "value": 12,
    "percent": 13.5
  },
  "failed": {
    "value": 0,
    "percent": 0
  }
}
```

---

## Section 3: Shipments Table (Filtered + Searchable)

**API:** `POST /api/query/warehouse-shipments`
**Fetch/XHR name:** `warehouse-shipments`

**Request (SearchRequest):**
```json
{
  "queryName": "WarehouseShipment.allShipments",
  "pageNum": 1,
  "numRowsInPage": 20,
  "sortCriteria": [{ "name": "shippedDate", "ascendingOrder": false }],
  "filters": { "status": "ALL", "carrier": "ALL", "dateFrom": "", "dateTo": "", "search": "" }
}
```

**Response:**
```json
{
  "list": [
    {
      "row": {
        "awbNumber": "DL284719305IN",
        "orderId": "HB-20260328-001",
        "customer": {
          "name": "Rahul Sharma",
          "city": "Delhi"
        },
        "carrier": "Delhivery",
        "weight": "1.2 kg",
        "stateId": "DELIVERED",
        "shippedDate": "2026-03-26",
        "expectedDelivery": "2026-03-28",
        "deliveredDate": "2026-03-28"
      }
    },
    {
      "row": {
        "awbNumber": "BD938271645IN",
        "orderId": "HB-20260328-002",
        "customer": {
          "name": "Priya Nair",
          "city": "Kochi"
        },
        "carrier": "BlueDart",
        "weight": "0.8 kg",
        "stateId": "IN_TRANSIT",
        "shippedDate": "2026-03-27",
        "expectedDelivery": "2026-03-30",
        "deliveredDate": null
      }
    },
    {
      "row": {
        "awbNumber": "DTDC50293847IN",
        "orderId": "HB-20260328-003",
        "customer": {
          "name": "Amit Patel",
          "city": "Ahmedabad"
        },
        "carrier": "DTDC",
        "weight": "2.5 kg",
        "stateId": "PICKED_UP",
        "shippedDate": "2026-03-28",
        "expectedDelivery": "2026-03-31",
        "deliveredDate": null
      }
    },
    {
      "row": {
        "awbNumber": "IP781234560IN",
        "orderId": "HB-20260328-004",
        "customer": {
          "name": "Sunita Devi",
          "city": "Patna"
        },
        "carrier": "India Post",
        "weight": "3.1 kg",
        "stateId": "IN_TRANSIT",
        "shippedDate": "2026-03-25",
        "expectedDelivery": "2026-04-01",
        "deliveredDate": null
      }
    },
    {
      "row": {
        "awbNumber": "DL284719412IN",
        "orderId": "HB-20260328-005",
        "customer": {
          "name": "Vikram Singh",
          "city": "Jaipur"
        },
        "carrier": "Delhivery",
        "weight": "0.5 kg",
        "stateId": "READY_FOR_PICKUP",
        "shippedDate": "2026-03-28",
        "expectedDelivery": "2026-03-31",
        "deliveredDate": null
      }
    }
  ],
  "totalCount": 89,
  "numRowsInPage": 20
}
```

**Note:** Uses Chenile SearchRequest format. Response follows `GenericResponse<Shipment>` wrapper.

---

## Section 4: Carrier Tracking (Track Shipment)

**API:** `GET /api/warehouse/shipments/{awbNumber}/track`

**Response:**
```json
{
  "awbNumber": "DL284719305IN",
  "orderId": "HB-20260328-001",
  "carrier": "Delhivery",
  "stateId": "DELIVERED",
  "currentLocation": "Delhi Hub",
  "estimatedDelivery": "2026-03-28",
  "trackingEvents": [
    {
      "timestamp": "2026-03-28T14:30:00Z",
      "location": "Delhi - Delivered",
      "status": "DELIVERED",
      "description": "Package delivered to customer"
    },
    {
      "timestamp": "2026-03-28T06:00:00Z",
      "location": "Delhi Hub",
      "status": "OUT_FOR_DELIVERY",
      "description": "Out for delivery"
    },
    {
      "timestamp": "2026-03-27T22:00:00Z",
      "location": "Delhi Hub",
      "status": "ARRIVED_AT_HUB",
      "description": "Arrived at destination hub"
    },
    {
      "timestamp": "2026-03-27T08:00:00Z",
      "location": "Mumbai - In Transit",
      "status": "IN_TRANSIT",
      "description": "Shipment in transit to destination"
    },
    {
      "timestamp": "2026-03-26T14:00:00Z",
      "location": "Mumbai Hub",
      "status": "PICKED_UP",
      "description": "Picked up by courier"
    },
    {
      "timestamp": "2026-03-26T10:00:00Z",
      "location": "Mumbai Warehouse",
      "status": "MANIFESTED",
      "description": "Shipment manifested, awaiting pickup"
    }
  ]
}
```

---

## Section 5: Dispatch Shipment

**API:** `PATCH /api/warehouseorder/{orderId}/dispatch`
**Fetch/XHR name:** `warehouseorder/{orderId}/dispatch`

**Request:**
```json
{
  "carrier": "Delhivery",
  "awbNumber": "DL284719500IN",
  "weight": 0.85,
  "dimensions": {
    "length": 30,
    "width": 20,
    "height": 12,
    "unit": "cm"
  },
  "dispatchedBy": "staff-001"
}
```

**Response:**
```json
{
  "orderId": "ORD-7841",
  "awbNumber": "DL284719500IN",
  "carrier": "Delhivery",
  "stateId": "READY_FOR_PICKUP",
  "dispatchedAt": "2026-03-28T11:00:00Z",
  "estimatedPickup": "2026-03-28T14:00:00Z",
  "labelUrl": "/labels/ORD-7841.pdf"
}
```

---

## Section 6: Carrier Performance

**API:** `GET /api/warehouse/shipments/carrier-performance?period=30d`

**Query Params:**
- `period` -- `7d`, `30d`, `90d`, `1y`

**Response:**
```json
{
  "period": "30d",
  "carriers": [
    {
      "name": "Delhivery",
      "totalShipments": 342,
      "onTimePercent": 94.2,
      "avgDeliveryDays": 2.8,
      "rtoPercent": 1.2,
      "rating": 4.5,
      "costPerShipment": 85
    },
    {
      "name": "BlueDart",
      "totalShipments": 278,
      "onTimePercent": 96.1,
      "avgDeliveryDays": 2.4,
      "rtoPercent": 0.8,
      "rating": 4.7,
      "costPerShipment": 110
    },
    {
      "name": "DTDC",
      "totalShipments": 195,
      "onTimePercent": 89.5,
      "avgDeliveryDays": 3.5,
      "rtoPercent": 2.1,
      "rating": 3.9,
      "costPerShipment": 65
    },
    {
      "name": "India Post",
      "totalShipments": 124,
      "onTimePercent": 82.3,
      "avgDeliveryDays": 5.2,
      "rtoPercent": 3.5,
      "rating": 3.4,
      "costPerShipment": 42
    }
  ]
}
```

---

## Section 7: Pickup Schedule

**API:** `GET /api/warehouse/shipments/pickup-schedule?date=2026-03-28`

**Query Params:**
- `date` -- ISO date string, defaults to today

**Response:**
```json
{
  "date": "2026-03-28",
  "slots": [
    {
      "id": "slot-001",
      "carrier": "Delhivery",
      "scheduledTime": "2026-03-28T10:00:00Z",
      "endTime": "2026-03-28T11:00:00Z",
      "parcelsReady": 18,
      "parcelsTotal": 22,
      "stateId": "COMPLETED",
      "pickedUpAt": "2026-03-28T10:25:00Z",
      "driverName": "Raju M."
    },
    {
      "id": "slot-002",
      "carrier": "BlueDart",
      "scheduledTime": "2026-03-28T14:00:00Z",
      "endTime": "2026-03-28T15:00:00Z",
      "parcelsReady": 12,
      "parcelsTotal": 15,
      "stateId": "SCHEDULED",
      "pickedUpAt": null,
      "driverName": null
    },
    {
      "id": "slot-003",
      "carrier": "DTDC",
      "scheduledTime": "2026-03-28T16:00:00Z",
      "endTime": "2026-03-28T17:00:00Z",
      "parcelsReady": 8,
      "parcelsTotal": 10,
      "stateId": "SCHEDULED",
      "pickedUpAt": null,
      "driverName": null
    }
  ]
}
```

---

## Section 8: Schedule New Pickup

**API:** `POST /api/warehouse/shipments/pickup-schedule`

**Request:**
```json
{
  "carrier": "Delhivery",
  "scheduledDate": "2026-03-28",
  "scheduledTime": "2026-03-28T18:00:00Z",
  "endTime": "2026-03-28T19:00:00Z",
  "parcelCount": 5,
  "notes": "Late pickup for same-day orders"
}
```

**Response:**
```json
{
  "id": "slot-004",
  "carrier": "Delhivery",
  "scheduledTime": "2026-03-28T18:00:00Z",
  "endTime": "2026-03-28T19:00:00Z",
  "parcelCount": 5,
  "stateId": "SCHEDULED",
  "createdAt": "2026-03-28T11:30:00Z"
}
```

---

## Section 9: Generate / Reprint Shipping Label

**API:** `GET /api/warehouse/shipments/{awbNumber}/label`

**Response:** PDF binary stream (Content-Type: application/pdf)

**Query Params:**
- `format` -- `PDF`, `ZPL` (for thermal printers)

---

## Section 10: Barcode/Scan for Shipment Lookup

**API:** `GET /api/warehouse/shipments/scan/{barcode}`

**Path Params:**
- `barcode` -- scanned barcode value (AWB number, order ID)

**Response:**
```json
{
  "matchType": "AWB",
  "awbNumber": "DL284719305IN",
  "orderId": "HB-20260328-001",
  "carrier": "Delhivery",
  "stateId": "DELIVERED",
  "customer": "Rahul Sharma",
  "weight": "1.2 kg"
}
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Page Header | None (static) | -- | -- |
| 2 | Stats Cards | `/api/warehouse/shipments/stats` | GET | 15s |
| 3 | Shipments Table | `/api/query/warehouse-shipments` | POST (Chenile Query) | 15s |
| 4 | Carrier Tracking | `/api/warehouse/shipments/{awbNumber}/track` | GET | 60s |
| 5 | Dispatch Shipment | `/api/warehouse/shipments/{orderId}/dispatch` | POST | -- |
| 6 | Carrier Performance | `/api/warehouse/shipments/carrier-performance` | GET | 300s |
| 7 | Pickup Schedule | `/api/warehouse/shipments/pickup-schedule` | GET | 30s |
| 8 | Schedule Pickup | `/api/warehouse/shipments/pickup-schedule` | POST | -- |
| 9 | Shipping Label | `/api/warehouse/shipments/{awbNumber}/label` | GET | -- |
| 10 | Scan Barcode | `/api/warehouse/shipments/scan/{barcode}` | GET | -- |

**Total API calls on page load: 4 (parallel: stats, shipments, carrier-performance, pickup-schedule)**
**User-triggered actions: 4 (dispatch, schedule-pickup, label, scan, track)**

---

## Warehouse-Specific Actions

| Action | Endpoint | Method | Trigger |
|--------|----------|--------|---------|
| Dispatch Shipment | `/api/warehouseorder/{orderId}/dispatch` | PATCH (STM Event) | Dispatch button on ready orders |
| Track Shipment | `/api/warehouse/shipments/{awbNumber}/track` | GET | "Track" button on shipment row |
| Generate Label | `/api/warehouse/shipments/{awbNumber}/label` | GET | "Label" button on shipment row |
| Schedule Pickup | `/api/warehouse/shipments/pickup-schedule` | POST | "Schedule Pickup" button in header |
| Scan Barcode | `/api/warehouse/shipments/scan/{barcode}` | GET | Barcode scanner input |
| Export Shipments | `/api/warehouse/shipments/export?format=csv` | GET | "Export" button in header |

---

## Frontend Integration Pattern

```typescript
// In Next.js page (server component)
export default async function WarehouseShipments({ searchParams }) {
  const [stats, shipments, performance, schedule] = await Promise.allSettled([
    warehouseApi.shipmentStats({ date: today() }),
    warehouseApi.shipments({
      status: searchParams.status || 'ALL',
      carrier: searchParams.carrier || 'ALL',
      dateFrom: searchParams.from || today(),
      dateTo: searchParams.to || today(),
      search: searchParams.q,
      pageSize: 20,
      page: searchParams.page || 1,
    }),
    warehouseApi.carrierPerformance({ period: '30d' }),
    warehouseApi.pickupSchedule({ date: today() }),
  ]);

  return (
    <>
      <PageHeader />
      <StatsCards data={stats} />
      <FilterTabs />
      <ShipmentsTable data={shipments} />
      <div className="grid grid-cols-2 gap-6">
        <CarrierPerformance data={performance} />
        <PickupSchedule data={schedule} />
      </div>
      <TrackingModal /> {/* Client component */}
      <SchedulePickupModal /> {/* Client component */}
    </>
  );
}
```

---

## Existing Backend Endpoints (from api-client)

**New endpoints needed:**
1. `GET /api/warehouse/shipments/stats` -- shipment summary KPIs by date
2. `GET /api/warehouse/shipments` -- paginated shipments list with filters
3. `GET /api/warehouse/shipments/{awbNumber}/track` -- carrier tracking timeline
4. `POST /api/warehouse/shipments/{orderId}/dispatch` -- dispatch a packed order
5. `GET /api/warehouse/shipments/carrier-performance` -- carrier SLA/performance metrics
6. `GET /api/warehouse/shipments/pickup-schedule` -- daily pickup slots
7. `POST /api/warehouse/shipments/pickup-schedule` -- schedule new carrier pickup
8. `GET /api/warehouse/shipments/{awbNumber}/label` -- download shipping label
9. `GET /api/warehouse/shipments/scan/{barcode}` -- barcode lookup

---

## Allowed Actions -> UI Mapping

The backend returns `allowedActions` per row based on the entity's current state (STM).
The frontend reads these and renders only the allowed buttons.

**STM Source:** `shipping-states.xml` (shipping-flow)
**Warehouse ACL filter:** Events with `WAREHOUSE` in `meta-acls`. Warehouse staff manage label creation, dispatch, and failed delivery handling.

### State -> Allowed Actions -> UI Buttons

| State | allowedActions (warehouse-visible) | UI Button | Icon | Color | Event ID |
|-------|-----------------------------------|-----------|------|-------|----------|
| PENDING | createLabel | Create Label | Tag | blue | createLabel |
| PENDING | cancelShipment | Cancel Shipment | XCircle | red | cancelShipment |
| LABEL_CREATED | cancelShipment | Cancel Shipment | XCircle | red | cancelShipment |
| PICKED_UP | -- | (read-only, carrier has it) | -- | -- | -- |
| IN_TRANSIT | -- | (read-only, track only) | -- | -- | -- |
| HELD_AT_HUB | -- | (read-only, customer pickup) | -- | -- | -- |
| OUT_FOR_DELIVERY | -- | (read-only, carrier delivering) | -- | -- | -- |
| DELIVERED | -- | (read-only, terminal) | -- | -- | -- |
| DELIVERY_FAILED | retryDelivery | Retry Delivery | RefreshCw | blue | retryDelivery |
| DELIVERY_FAILED | returnShipment | Return to Warehouse | Undo2 | amber | returnShipment |
| LOST | -- | (read-only, claim initiated) | -- | -- | -- |
| RETURNED | -- | (read-only, terminal) | -- | -- | -- |
| CANCELLED | -- | (read-only, terminal) | -- | -- | -- |

### Frontend Pattern

```typescript
const WAREHOUSE_SHIPMENT_ACTION_CONFIG: Record<string, ActionButtonConfig> = {
  createLabel: { label: 'Create Label', icon: 'Tag', color: 'blue' },
  cancelShipment: { label: 'Cancel Shipment', icon: 'XCircle', color: 'red' },
  retryDelivery: { label: 'Retry Delivery', icon: 'RefreshCw', color: 'blue' },
  returnShipment: { label: 'Return to Warehouse', icon: 'Undo2', color: 'amber' },
};

// Render only allowed actions
{allowedActions.map(a => {
  const config = WAREHOUSE_SHIPMENT_ACTION_CONFIG[a.allowedAction];
  return config ? <ActionButton {...config} onClick={() => triggerEvent(id, a.allowedAction)} /> : null;
})}
```
