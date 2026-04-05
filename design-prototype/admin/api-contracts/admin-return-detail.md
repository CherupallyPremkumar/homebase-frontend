# Admin Return Detail — API Contract

## Page: admin-return-detail.html

**Note:** Return detail is a single entity retrieve page using GET with `StateEntityServiceResponse`. Includes return timeline, return items, original order, refund breakdown, customer evidence, seller response, and return policy compliance check. Admin override actions use PATCH with STM event IDs. Return states: `REQUESTED -> APPROVED -> PICKUP_SCHEDULED -> RECEIVED -> REFUNDED | REJECTED`.

---

## Section 1: Return Retrieve

**API:** `GET /api/admin/returns/{returnId}`
**Fetch/XHR name:** `return-detail`

**Response (StateEntityServiceResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "RET-00456",
    "orderId": "HB-10234",
    "status": "Pickup Scheduled",
    "stateLabel": "Pickup Scheduled",
    "timeline": [
      { "state": "Return Requested", "timestamp": "2026-03-22T11:00:00Z", "actor": "Customer", "completed": true },
      { "state": "Approved", "timestamp": "2026-03-23T09:30:00Z", "actor": "Super Admin", "completed": true },
      { "state": "Pickup Scheduled", "timestamp": null, "scheduledFor": "2026-03-29", "completed": false, "isCurrent": true },
      { "state": "Received at Warehouse", "timestamp": null, "completed": false },
      { "state": "Refunded", "timestamp": null, "completed": false }
    ],
    "returnItems": [
      {
        "productId": "PRD-00142",
        "name": "Modern Velvet Sofa",
        "sku": "HB-FUR-00142",
        "qty": 1,
        "price": 129900,
        "reason": "Product damaged on delivery",
        "condition": "Damaged - Tear on left arm"
      }
    ],
    "originalOrder": {
      "orderId": "HB-10234",
      "placedDate": "2026-03-25",
      "deliveredDate": "2026-03-27",
      "totalAmount": 146429,
      "status": "Delivered"
    },
    "refundBreakdown": {
      "itemValue": 129900,
      "shippingRefund": 0,
      "discountAdjustment": -12990,
      "totalRefund": 116910,
      "refundMethod": "Original Payment (UPI)"
    },
    "customerEvidence": {
      "comment": "The sofa arrived with a noticeable tear on the left armrest...",
      "submittedAt": "2026-03-22T11:00:00Z",
      "photos": ["damage_1.jpg", "damage_2.jpg", "packaging.jpg"]
    },
    "customer": {
      "id": "USR-05678",
      "name": "Ankit Kumar",
      "email": "ankit.kumar@email.com",
      "phone": "+91 99876 54321",
      "totalReturns": 2
    },
    "seller": {
      "id": "SLR-00142",
      "name": "Rajesh Store",
      "tier": "Premium Seller",
      "responseStatus": "Accepted",
      "responseDate": "2026-03-22T15:00:00Z"
    },
    "policyCheck": {
      "withinReturnWindow": { "pass": true, "detail": "5 days (within 30-day window)" },
      "productUnused": { "pass": true },
      "originalPackaging": { "pass": false, "detail": "Packaging damaged" },
      "photosProvided": { "pass": true }
    },
    "allowedActions": ["approveRefund", "overrideReject", "schedulePickup", "addNote"]
  }
}
```

---

## Command: Approve Return (STM Action)

**API:** `PATCH /api/admin/returns/{returnId}/approve`
**Fetch/XHR name:** `approve-return`

**Request:**
```json
{ "note": "Damage confirmed from photos. Approved for full refund." }
```

**Response:**
```json
{ "success": true, "payload": { "id": "RET-00456", "status": "Approved", "allowedActions": ["schedulePickup"] } }
```

---

## Command: Reject Return (STM Action)

**API:** `PATCH /api/admin/returns/{returnId}/reject`
**Fetch/XHR name:** `reject-return`

**Request:**
```json
{ "reason": "Product shows signs of use beyond normal wear", "notifyCustomer": true }
```

**Response:**
```json
{ "success": true, "payload": { "id": "RET-00456", "status": "Rejected", "allowedActions": [] } }
```

---

## Command: Override Refund (Admin Override — STM Action)

**API:** `PATCH /api/admin/returns/{returnId}/overrideRefund`
**Fetch/XHR name:** `override-refund`

**Request:**
```json
{
  "refundAmount": 116910,
  "reason": "Customer escalation - override policy due to damaged packaging",
  "bypassPolicyCheck": true
}
```

---

## Command: Schedule Pickup

**API:** `PATCH /api/admin/returns/{returnId}/schedulePickup`
**Fetch/XHR name:** `schedule-pickup`

**Request:**
```json
{ "carrierId": "CARRIER-001", "pickupDate": "2026-03-29", "timeSlot": "10:00-14:00" }
```

---

## Command: Add Admin Note

**API:** `POST /api/admin/returns/{returnId}/notes`
**Fetch/XHR name:** `add-return-note`

**Request:**
```json
{ "note": "Contacted seller - they accept responsibility for shipping damage" }
```

---

## Allowed Actions Mapping (STM)

| Current State | Allowed Actions | Buttons |
|---------------|----------------|---------|
| `REQUESTED` | `approve`, `reject`, `addNote` | Approve, Reject |
| `APPROVED` | `schedulePickup`, `addNote` | Schedule Pickup |
| `PICKUP_SCHEDULED` | `overrideRefund`, `reject`, `addNote` | Override Refund, Reject |
| `RECEIVED` | `approveRefund`, `reject`, `addNote` | Process Refund, Reject |
| `REFUNDED` | `view` | — |
| `REJECTED` | `overrideRefund` | Override (reopen) |

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name |
|---|---------|-------------|--------|----------------|
| 1 | Retrieve | `/api/admin/returns/{id}` | GET | `return-detail` |
| 2 | Approve | `PATCH /api/admin/returns/{id}/approve` | PATCH (STM) | `approve-return` |
| 3 | Reject | `PATCH /api/admin/returns/{id}/reject` | PATCH (STM) | `reject-return` |
| 4 | Override Refund | `PATCH /api/admin/returns/{id}/overrideRefund` | PATCH (STM) | `override-refund` |
| 5 | Schedule Pickup | `PATCH /api/admin/returns/{id}/schedulePickup` | PATCH (STM) | `schedule-pickup` |
| 6 | Add Note | `POST /api/admin/returns/{id}/notes` | POST | `add-return-note` |

**Total API calls on page load: 1 (single return GET)**
