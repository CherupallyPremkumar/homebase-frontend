# Warehouse Dashboard -- API Contract

## Page: warehouse-dashboard.html

**Note:** Dashboard stats and activity use standard REST GET with `GenericResponse` wrapper. Expedite/assign actions use PATCH STM events.

---

## Section 1: Welcome Banner
**Data needed:** Warehouse name, location, current date, current shift info
**API:** No API call needed -- warehouse name and shift from auth session/config, date from browser

---

## Section 2: Stats Cards (6 cards)

**API:** `GET /api/warehouse/dashboard/stats`

**Response:**
```json
{
  "totalItems": {
    "value": 24560,
    "trend": 2.4,
    "trendDirection": "up"
  },
  "pendingInbound": {
    "value": 8,
    "label": "Pending"
  },
  "ordersToPick": {
    "value": 45,
    "label": "Active"
  },
  "ordersPacking": {
    "value": 12,
    "label": "In Progress"
  },
  "shippedToday": {
    "value": 89,
    "addedToday": 15
  },
  "capacityUsed": {
    "percentage": 72,
    "totalSlots": 34000,
    "usedSlots": 24560
  }
}
```

---

## Section 3: Today's Activity Timeline

**API:** `GET /api/warehouse/dashboard/activity?date=2026-03-28`

**Query Params:**
- `date` -- ISO date string, defaults to today

**Response:**
```json
{
  "activities": [
    {
      "id": "act-001",
      "type": "INBOUND_RECEIVED",
      "title": "Received shipment from TechWorld Pvt Ltd",
      "description": "450 items, 12 SKUs verified and shelved to Zone A",
      "timestamp": "2026-03-28T06:15:00Z",
      "icon": "inbound"
    },
    {
      "id": "act-002",
      "type": "BATCH_PICKED",
      "title": "Batch #B2026-0328 picked for 18 orders",
      "description": "Assigned to Picker Team Alpha, Zone A & B",
      "timestamp": "2026-03-28T07:30:00Z",
      "icon": "pick"
    },
    {
      "id": "act-003",
      "type": "ORDERS_PACKED",
      "title": "15 orders packed and labelled",
      "description": "Packing Station 3, ready for dispatch",
      "timestamp": "2026-03-28T08:45:00Z",
      "icon": "pack"
    },
    {
      "id": "act-004",
      "type": "DISPATCHED",
      "title": "Dispatched 22 parcels via BlueDart",
      "description": "AWB numbers generated, courier pickup completed",
      "timestamp": "2026-03-28T09:10:00Z",
      "icon": "dispatch"
    },
    {
      "id": "act-005",
      "type": "DAMAGE_REPORT",
      "title": "Damage report: 3 items from Inbound #IN-4521",
      "description": "SKUs quarantined, seller notified for replacement",
      "timestamp": "2026-03-28T09:45:00Z",
      "icon": "alert"
    },
    {
      "id": "act-006",
      "type": "CYCLE_COUNT",
      "title": "Cycle count completed for Zone C",
      "description": "Variance: 0.2%, within acceptable threshold",
      "timestamp": "2026-03-28T10:30:00Z",
      "icon": "check"
    },
    {
      "id": "act-007",
      "type": "RETURN_PROCESSED",
      "title": "Return processed: Order #HB-89234",
      "description": "Item inspected, restocked to Zone B shelf B-14",
      "timestamp": "2026-03-28T11:15:00Z",
      "icon": "return"
    },
    {
      "id": "act-008",
      "type": "INBOUND_RECEIVED",
      "title": "Received shipment from FashionHub India",
      "description": "280 items, 8 SKUs, routed to Zone B intake",
      "timestamp": "2026-03-28T12:00:00Z",
      "icon": "inbound"
    }
  ]
}
```

---

## Section 4: Urgent Orders Due for Dispatch

**API:** `GET /api/warehouse/dashboard/urgent-dispatch`

**Response:**
```json
{
  "totalUrgent": 5,
  "orders": [
    {
      "orderId": "HB-78234",
      "itemCount": 3,
      "priority": "Critical",
      "dueTime": "2026-03-28T13:00:00Z",
      "stateId": "PICKING",
      "actions": ["expedite"]
    },
    {
      "orderId": "HB-78190",
      "itemCount": 1,
      "priority": "Critical",
      "dueTime": "2026-03-28T13:30:00Z",
      "stateId": "PACKING",
      "actions": ["expedite"]
    },
    {
      "orderId": "HB-78156",
      "itemCount": 5,
      "priority": "High",
      "dueTime": "2026-03-28T14:00:00Z",
      "stateId": "PICKING",
      "actions": ["expedite"]
    },
    {
      "orderId": "HB-78101",
      "itemCount": 2,
      "priority": "High",
      "dueTime": "2026-03-28T15:00:00Z",
      "stateId": "QUEUED",
      "actions": ["assign"]
    },
    {
      "orderId": "HB-78088",
      "itemCount": 4,
      "priority": "Normal",
      "dueTime": "2026-03-28T17:00:00Z",
      "stateId": "QUEUED",
      "actions": ["assign"]
    }
  ]
}
```

**Action -- Expedite Order:**

**API:** `PATCH /api/warehouseorder/{orderId}/expedite`
**Fetch/XHR name:** `warehouseorder/{orderId}/expedite`

**Request:**
```json
{
  "reason": "Same-day SLA"
}
```

**Response:**
```json
{
  "orderId": "HB-78234",
  "stateId": "PICKING",
  "priority": "Critical",
  "expedited": true
}
```

---

## Section 5: Warehouse Zones Overview (4 zones)

**API:** `GET /api/warehouse/zones`

**Response:**
```json
{
  "zones": [
    {
      "zoneId": "A",
      "name": "Zone A",
      "category": "Electronics",
      "totalSlots": 500,
      "usedSlots": 420,
      "utilizationPercent": 84,
      "skuCount": 145,
      "status": "normal"
    },
    {
      "zoneId": "B",
      "name": "Zone B",
      "category": "Fashion & Home",
      "totalSlots": 600,
      "usedSlots": 390,
      "utilizationPercent": 65,
      "skuCount": 230,
      "status": "normal"
    },
    {
      "zoneId": "C",
      "name": "Zone C",
      "category": "Beauty & Health",
      "totalSlots": 400,
      "usedSlots": 340,
      "utilizationPercent": 85,
      "skuCount": 180,
      "status": "high"
    },
    {
      "zoneId": "D",
      "name": "Zone D",
      "category": "FMCG & Bulk",
      "totalSlots": 800,
      "usedSlots": 480,
      "utilizationPercent": 60,
      "skuCount": 95,
      "status": "normal"
    }
  ]
}
```

---

## Section 6: Staff on Duty

**API:** `GET /api/warehouse/dashboard/staff-on-duty`

**Response:**
```json
{
  "shift": "Day",
  "shiftTime": "06:00 - 14:00",
  "totalStaff": 12,
  "staff": [
    {
      "id": "staff-001",
      "name": "Rajesh S.",
      "initials": "RS",
      "role": "Picker",
      "zone": "A",
      "status": "active",
      "tasksCompleted": 14,
      "tasksTotal": 20
    },
    {
      "id": "staff-002",
      "name": "Priya M.",
      "initials": "PM",
      "role": "Packer",
      "zone": "Packing Station 1",
      "status": "active",
      "tasksCompleted": 22,
      "tasksTotal": 30
    },
    {
      "id": "staff-003",
      "name": "Suresh K.",
      "initials": "SK",
      "role": "Receiver",
      "zone": "Dock 1",
      "status": "active",
      "tasksCompleted": 3,
      "tasksTotal": 5
    },
    {
      "id": "staff-004",
      "name": "Meena R.",
      "initials": "MR",
      "role": "Picker",
      "zone": "B",
      "status": "break",
      "tasksCompleted": 10,
      "tasksTotal": 18
    }
  ]
}
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Welcome Banner | None (session/config) | -- | -- |
| 2 | Stats Cards | `/api/warehouse/dashboard/stats` | GET | 15s |
| 3 | Activity Timeline | `/api/warehouse/dashboard/activity?date=2026-03-28` | GET | 30s |
| 4 | Urgent Dispatch | `/api/warehouse/dashboard/urgent-dispatch` | GET | 15s |
| 5 | Warehouse Zones | `/api/warehouse/zones` | GET | 60s |
| 6 | Staff on Duty | `/api/warehouse/dashboard/staff-on-duty` | GET | 30s |

**Total API calls on page load: 5 (parallel)**

---

## Warehouse-Specific Actions

| Action | Endpoint | Method | Trigger |
|--------|----------|--------|---------|
| Expedite Order | `/api/warehouseorder/{orderId}/expedite` | PATCH (STM Event) | "Expedite" button on urgent orders |
| Assign Picker | `/api/warehouseorder/{orderId}/assign` | PATCH (STM Event) | "Assign" button on queued orders |
| Export Report | `/api/warehouse/dashboard/export` | GET | "Export Report" button |

---

## Frontend Integration Pattern

```typescript
// In Next.js page (server component)
export default async function WarehouseDashboard() {
  const [stats, activity, urgent, zones, staff] = await Promise.allSettled([
    warehouseApi.dashboardStats(),
    warehouseApi.activity({ date: today() }),
    warehouseApi.urgentDispatch(),
    warehouseApi.zones(),
    warehouseApi.staffOnDuty(),
  ]);

  return (
    <>
      <WelcomeBanner />
      <StatsCards data={stats} />
      <div className="grid grid-cols-2 gap-6">
        <ActivityTimeline data={activity} />
        <UrgentDispatch data={urgent} />
      </div>
      <div className="grid grid-cols-3 gap-6">
        <ZonesOverview data={zones} className="col-span-2" />
        <StaffOnDuty data={staff} />
      </div>
    </>
  );
}
```

---

## Existing Backend Endpoints (from api-client)

These endpoints may already exist in `packages/api-client/src/`:
- `warehouse.ts` -- base warehouse API module

**New endpoints needed:**
1. `GET /api/warehouse/dashboard/stats` -- aggregated warehouse KPIs
2. `GET /api/warehouse/dashboard/activity` -- today's activity feed
3. `GET /api/warehouse/dashboard/urgent-dispatch` -- time-critical orders
4. `GET /api/warehouse/zones` -- zone utilization overview
5. `GET /api/warehouse/dashboard/staff-on-duty` -- current shift staff
