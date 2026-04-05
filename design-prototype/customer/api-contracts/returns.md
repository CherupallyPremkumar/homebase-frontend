# Returns & Refunds — API Contract

## Page: returns.html

**Note:** Returns list uses Chenile's `SearchRequest/SearchResponse` pattern via POST. Return creation uses Command POST. Cancel/pickup scheduling use PATCH STM events. Stats and policy use REST GET.

---

## Section 1: Returns Summary Stats

**Data needed:** Counts of active returns, completed returns, total refunded amount
**API:** `GET /api/returns/stats`

**Response:**
```json
{
  "activeReturns": 1,
  "completedReturns": 1,
  "totalRefunded": 3698,
  "currency": "INR"
}
```

---

## Section 2: Returns List

**Data needed:** All return requests with status, timeline, product info
**API:** `POST /api/query/customer-returns`
**Fetch/XHR name:** `customer-returns`

**Request (SearchRequest):**
```json
{
  "queryName": "CustomerReturn.myReturns",
  "pageNum": 1,
  "numRowsInPage": 10,
  "sortCriteria": [
    { "name": "requestedAt", "ascendingOrder": false }
  ],
  "filters": {
    "status": "all"
  }
}
```

**Response (GenericResponse<SearchResponse>):**
```json
{
  "list": [
    {
      "row": {
        "id": "RET-001",
        "stateId": "PICKUP_SCHEDULED",
        "orderId": "ORD-2024-7845",
        "orderItemId": "oi-101",
        "product": {
          "id": "prod-305",
          "name": "boAt Rockerz 450 Bluetooth Headphones - Lush Red",
          "image": "/images/products/boat-rockerz.jpg"
        },
        "reason": "Defective",
        "description": "Left ear speaker not working properly",
        "refundAmount": 1299,
        "currency": "INR",
        "requestedAt": "2026-03-22T10:00:00Z",
        "timeline": [
          {
            "status": "REQUESTED",
            "label": "Requested",
            "timestamp": "2026-03-22T10:00:00Z",
            "completed": true
          },
          {
            "status": "APPROVED",
            "label": "Approved",
            "timestamp": "2026-03-23T11:00:00Z",
            "completed": true
          },
          {
            "status": "PICKUP_SCHEDULED",
            "label": "Pickup Scheduled",
            "timestamp": "2026-03-25T09:00:00Z",
            "completed": true,
            "isCurrent": true
          },
          {
            "status": "RECEIVED",
            "label": "Received",
            "timestamp": null,
            "completed": false
          },
          {
            "status": "REFUNDED",
            "label": "Refunded",
            "timestamp": null,
            "completed": false
          }
        ],
        "pickupDate": "2026-03-28T00:00:00Z",
        "pickupSlot": "10:00 AM - 1:00 PM"
      }
    },
    {
      "row": {
        "id": "RET-002",
        "stateId": "REFUNDED",
        "orderId": "ORD-2024-7200",
        "orderItemId": "oi-088",
        "product": {
          "id": "prod-601",
          "name": "Nike Air Max 270 React - White/Orange",
          "image": "/images/products/nike-airmax.jpg"
        },
        "reason": "Wrong size",
        "description": "Ordered size 10, received size 9",
        "refundAmount": 2399,
        "currency": "INR",
        "requestedAt": "2026-03-05T14:00:00Z",
        "completedAt": "2026-03-15T16:00:00Z",
        "refundMethod": "Original payment method (UPI)",
        "timeline": [
          {
            "status": "REQUESTED",
            "label": "Requested",
            "timestamp": "2026-03-05T14:00:00Z",
            "completed": true
          },
          {
            "status": "APPROVED",
            "label": "Approved",
            "timestamp": "2026-03-06T09:00:00Z",
            "completed": true
          },
          {
            "status": "PICKUP_SCHEDULED",
            "label": "Picked Up",
            "timestamp": "2026-03-08T11:00:00Z",
            "completed": true
          },
          {
            "status": "RECEIVED",
            "label": "Received",
            "timestamp": "2026-03-12T10:00:00Z",
            "completed": true
          },
          {
            "status": "REFUNDED",
            "label": "Refunded",
            "timestamp": "2026-03-15T16:00:00Z",
            "completed": true
          }
        ]
      }
    }
  ],
  "totalCount": 2,
  "numRowsInPage": 10,
  "currentPage": 1,
  "totalPages": 1
}
```

**Note:** Uses Chenile SearchRequest format. Response follows `GenericResponse<Return>` wrapper.

---

## Section 3: Return Policy

**Data needed:** Return policy text
**API:** `GET /api/returns/policy`

**Response:**
```json
{
  "policy": {
    "returnWindow": 30,
    "returnWindowUnit": "days",
    "conditions": [
      "Items must be unused and in original packaging",
      "Electronics must include all original accessories",
      "Fashion items must have tags attached",
      "Perishable items are non-returnable"
    ],
    "refundTimeline": "5-7 business days after item is received",
    "freeReturns": true,
    "freeReturnNote": "Free return pickup for all eligible items"
  }
}
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Returns Stats | `/api/returns/stats` | GET | 30s |
| 2 | Returns List | `/api/query/customer-returns` | POST (Chenile Query) | No |
| 3 | Return Policy | `/api/returns/policy` | GET | 5m |

**Total API calls on page load: 3 (parallel)**

---

## User Actions

### Action: Request New Return (Command Create)
**Trigger:** User clicks "Request New Return" and fills out the return form
**API:** `POST /api/returnrequest`
**Fetch/XHR name:** `returnrequest`

**Request:**
```json
{
  "orderId": "HB-20260322-5103",
  "orderItemId": "oi-003",
  "reason": "Defective",
  "description": "Screen has a dead pixel in the top-right corner",
  "images": [
    "/uploads/return-evidence-1.jpg",
    "/uploads/return-evidence-2.jpg"
  ],
  "preferredRefundMethod": "original_payment"
}
```

**Response:** `201 Created`
```json
{
  "id": "RET-003",
  "stateId": "REQUESTED",
  "refundAmount": 144900,
  "message": "Your return request has been submitted. We will review it within 24 hours."
}
```

### Action: Upload Return Evidence Image
**Trigger:** User attaches photos to the return request form
**API:** `POST /api/uploads`
**Content-Type:** `multipart/form-data`
**Body:** Form data with `file` field
**Response:**
```json
{ "url": "/uploads/return-evidence-1.jpg" }
```

### Action: Cancel Return Request (STM Event)
**Trigger:** User clicks "Cancel Return" on a pending return
**API:** `PATCH /api/returnrequest/{returnId}/cancel`
**Fetch/XHR name:** `returnrequest/{returnId}/cancel`
**Response (GenericResponse<StateEntityServiceResponse<ReturnRequest>>):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "mutatedEntity": { "id": "RET-003", "stateId": "CANCELLED" },
    "allowedActionsAndMetadata": []
  }
}
```

### Action: Schedule Pickup (STM Event)
**Trigger:** User selects a pickup date and slot for an approved return
**API:** `PATCH /api/returnrequest/{returnId}/schedulePickup`
**Fetch/XHR name:** `returnrequest/{returnId}/schedulePickup`
```json
{
  "pickupDate": "2026-03-28",
  "pickupSlot": "10:00 AM - 1:00 PM",
  "pickupAddress": "addr-001"
}
```
**Response:** `200 OK`
```json
{ "id": "RET-001", "stateId": "PICKUP_SCHEDULED", "pickupDate": "2026-03-28" }
```

### Action: View Eligible Items for Return
**Trigger:** User opens the "New Return" dialog — need to show only returnable items
**API:** `GET /api/orders/returnable-items`

**Response:**
```json
{
  "items": [
    {
      "orderId": "HB-20260315-4821",
      "orderItemId": "oi-001",
      "productId": "prod-201",
      "productName": "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
      "image": "/images/products/sony-xm5.jpg",
      "price": 22490,
      "deliveredAt": "2026-03-20T14:00:00Z",
      "returnDeadline": "2026-04-19T14:00:00Z",
      "eligible": true
    }
  ]
}
```

---

## Frontend Integration Pattern

```typescript
// In Next.js page (server + client hybrid)
export default async function ReturnsPage() {
  const [stats, returns, policy] = await Promise.allSettled([
    returnsApi.stats(),
    returnsApi.list(),
    returnsApi.policy(),
  ]);

  return (
    <AccountLayout>
      <ReturnsHeader stats={stats} />
      <ReturnsStats stats={stats} />
      <ReturnsList returns={returns} />
      <ReturnPolicy policy={policy} />
      <NewReturnModal /> {/* Client component */}
    </AccountLayout>
  );
}

// Client component for creating returns
function NewReturnModal() {
  const createReturn = async (data) => {
    const result = await returnsApi.create(data);
    toast.success('Return request submitted');
    router.refresh();
  };

  const { data: returnableItems } = useSWR('/api/orders/returnable-items', ordersApi.returnableItems);

  return (
    <Modal>
      <SelectReturnItem items={returnableItems} />
      <ReturnReasonForm onSubmit={createReturn} />
    </Modal>
  );
}
```

---

## Allowed Actions -> UI Mapping

The backend returns `allowedActions` per return request based on its current state (STM).
The frontend reads these and renders only the allowed buttons.

**STM Source:** `returnrequest-states.xml` (return-request-flow)
**Customer ACL filter:** Only events with `CUSTOMER` in `meta-acls` are shown.

### State -> Allowed Actions -> UI Buttons

| State | allowedActions (customer-visible) | UI Button | Icon | Color | Event ID |
|-------|----------------------------------|-----------|------|-------|----------|
| REQUESTED | -- | (read-only, pending review) | -- | -- | -- |
| UNDER_REVIEW | escalate | Escalate | ArrowUpCircle | red | escalate |
| ESCALATED | -- | (read-only, being reviewed) | -- | -- | -- |
| APPROVED | -- | (read-only, ship item back) | -- | -- | -- |
| PARTIALLY_APPROVED | -- | (read-only) | -- | -- | -- |
| ITEM_RECEIVED | -- | (read-only, inspection pending) | -- | -- | -- |
| INSPECTED | -- | (read-only, refund pending) | -- | -- | -- |
| REFUND_INITIATED | -- | (read-only, processing) | -- | -- | -- |
| COMPLETED | -- | (read-only, terminal) | -- | -- | -- |
| REJECTED | -- | (read-only, terminal) | -- | -- | -- |

### Frontend Pattern

```typescript
const CUSTOMER_RETURN_ACTION_CONFIG: Record<string, ActionButtonConfig> = {
  escalate: { label: 'Escalate', icon: 'ArrowUpCircle', color: 'red' },
};

// Render only allowed actions
{allowedActions.map(a => {
  const config = CUSTOMER_RETURN_ACTION_CONFIG[a.allowedAction];
  return config ? <ActionButton {...config} onClick={() => triggerEvent(id, a.allowedAction)} /> : null;
})}
```
