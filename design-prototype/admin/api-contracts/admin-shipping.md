# Admin Shipping Management — API Contract

## Page: admin-shipping.html

**Note:** Carrier list uses Chenile `SearchRequest/SearchResponse` via POST. Stats use GET. Carrier CRUD and zone config use REST. Carrier states: `ACTIVE | LIMITED | DISABLED`.

---

## Section 1: Shipping Stats Cards (4 cards)

**API:** `GET /api/admin/shipping/stats`
**Fetch/XHR name:** `shipping-stats`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "activeCarriers": 5,
    "allOperational": true,
    "avgDeliveryDays": 4.2,
    "deliveryTrend": -0.3,
    "onTimePercentage": 94.5,
    "onTimeTrend": 1.2,
    "pinCodeCoverage": { "covered": 19200, "total": 19600, "percentage": 98 }
  }
}
```

---

## Section 2: Carrier Table

**API:** `POST /api/query/admin-carriers`
**Fetch/XHR name:** `admin-carriers`

**Request (SearchRequest):**
```json
{
  "queryName": "AdminCarrier.list",
  "pageNum": 1,
  "numRowsInPage": 10,
  "sortCriteria": [{ "name": "rating", "ascendingOrder": false }],
  "filters": { "status": "all", "search": "" }
}
```

**Filter `status` values:** `all | active | limited`

**Response (SearchResponse):**
```json
{
  "list": [
    {
      "row": {
        "id": "CARRIER-001",
        "name": "Delhivery",
        "serviceTypes": "Express & Standard",
        "status": "Active",
        "zones": "All 5 zones",
        "avgDeliveryDays": 3.5,
        "costPerKg": 42,
        "sla": "48h dispatch",
        "rating": 4.6
      },
      "allowedActions": ["edit", "disable"]
    },
    {
      "row": {
        "id": "CARRIER-004",
        "name": "India Post",
        "serviceTypes": "Economy & Speed Post",
        "status": "Limited",
        "zones": "All 5 zones",
        "avgDeliveryDays": 6.5,
        "costPerKg": 22,
        "sla": "72h dispatch",
        "rating": 3.8
      },
      "allowedActions": ["edit", "enable"]
    }
  ],
  "totalCount": 5,
  "numRowsInPage": 10
}
```

---

## Section 3: Zone Configuration

**API:** `GET /api/admin/shipping/zones`
**Fetch/XHR name:** `shipping-zones`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": [
    { "id": "ZONE-A", "name": "Metro", "cities": ["Mumbai", "Delhi", "Bangalore", "Chennai"], "avgDays": 2, "surcharge": 0 },
    { "id": "ZONE-B", "name": "Tier-1", "cities": ["Pune", "Hyderabad", "Ahmedabad"], "avgDays": 3, "surcharge": 0 },
    { "id": "ZONE-C", "name": "Tier-2", "avgDays": 4, "surcharge": 15 },
    { "id": "ZONE-D", "name": "Remote", "avgDays": 6, "surcharge": 40 },
    { "id": "ZONE-E", "name": "Special", "avgDays": 8, "surcharge": 75 }
  ]
}
```

---

## Command: Create Carrier

**API:** `POST /api/admin/shipping/carriers`
**Fetch/XHR name:** `create-carrier`

**Request:**
```json
{
  "name": "Ecom Express",
  "serviceTypes": "Express & Standard",
  "zones": ["ZONE-A", "ZONE-B", "ZONE-C"],
  "costPerKg": 38,
  "slaDispatchHours": 48,
  "status": "Active",
  "apiKey": "ecom_live_xxxx",
  "trackingUrlTemplate": "https://ecomexpress.in/track/{trackingId}"
}
```

**Response:**
```json
{ "success": true, "code": 201, "payload": { "id": "CARRIER-006", "name": "Ecom Express", "status": "Active" } }
```

---

## Command: Update Carrier

**API:** `PUT /api/admin/shipping/carriers/{carrierId}`
**Fetch/XHR name:** `update-carrier`

**Request:**
```json
{ "costPerKg": 45, "slaDispatchHours": 24, "zones": ["ZONE-A", "ZONE-B", "ZONE-C", "ZONE-D"] }
```

**Response:**
```json
{ "success": true, "code": 200, "payload": { "id": "CARRIER-001", "name": "Delhivery" } }
```

---

## Command: Toggle Carrier (Enable/Disable — STM Action)

**API:** `PATCH /api/admin/shipping/carriers/{carrierId}/toggleStatus`
**Fetch/XHR name:** `toggle-carrier`

**Request:**
```json
{ "status": "Disabled", "reason": "Maintenance window" }
```

**Response:**
```json
{ "success": true, "code": 200, "payload": { "id": "CARRIER-001", "status": "Disabled" } }
```

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name |
|---|---------|-------------|--------|----------------|
| 1 | Stats | `/api/admin/shipping/stats` | GET | `shipping-stats` |
| 2 | Carrier Table | `POST /api/query/admin-carriers` | POST (Chenile) | `admin-carriers` |
| 3 | Zones | `/api/admin/shipping/zones` | GET | `shipping-zones` |
| 4 | Create Carrier | `POST /api/admin/shipping/carriers` | POST | `create-carrier` |
| 5 | Update Carrier | `PUT /api/admin/shipping/carriers/{id}` | PUT | `update-carrier` |
| 6 | Toggle Status | `PATCH /api/admin/shipping/carriers/{id}/toggleStatus` | PATCH (STM) | `toggle-carrier` |

**Total API calls on page load: 3 (stats + carriers + zones in parallel)**
