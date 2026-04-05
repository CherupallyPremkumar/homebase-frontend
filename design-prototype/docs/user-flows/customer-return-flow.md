# Customer Return Flow

Return and refund journey from order history to refund completion.

---

## Flow Overview

```
+-----------+     +-------------+     +----------------+     +-------------+
| My Orders |---->| Order Detail|---->| Request Return |---->| Select Items|
| my-orders.|     | order-      |     | returns.html   |     | (Returnable |
| html      |     | detail.html |     |                |     |  items)     |
+-----------+     +-------------+     +----------------+     +-------------+
                                                                    |
                                                                    v
+-----------+     +-------------+     +----------------+     +-------------+
| Refund    |<----| Pickup      |<----| Return         |<----| Choose      |
| Processed |     | Scheduled   |     | Submitted      |     | Reason      |
|           |     |             |     |                |     |             |
+-----------+     +-------------+     +----------------+     +-------------+
```

---

## Detailed Flow Diagram

```
    [START]
       |
       v
+-------------------+
| MY ORDERS         |
| my-orders.html    |
|                   |
| Filter: Delivered |
| or Completed      |
+-------------------+
       |
       v
+-------------------+
| Select Order      |
| with returnable   |
| items             |
+-------------------+
       |
       v
+-------------------+
| ORDER DETAIL      |
| order-detail.html |
|                   |
| Click "Request    |
| Return" button    |
| (STM: DELIVERED   |
|  or COMPLETED     |
|  state only)      |
+-------------------+
       |
       v
  +----------+
  | Within   |
  | return   |--NO--> [Return window expired]
  | window?  |        "This item is no longer
  | (30 days)|        eligible for return"
  +----------+
       |
      YES
       |
       v
+-------------------+
| RETURNABLE ITEMS  |
| returns.html      |
| (New Return Modal)|
|                   |
| [ ] Item 1 - Sony|
|     Headphones    |
| [ ] Item 2 - MX  |
|     Keys Mini     |
+-------------------+
       |
       v
+-------------------+
| SELECT ITEMS      |
| Check items to    |
| return            |
+-------------------+
       |
       v
+-------------------+
| CHOOSE REASON     |
|                   |
| ( ) Defective     |
| ( ) Wrong Item    |
| ( ) Wrong Size    |
| ( ) Not as        |
|     Described     |
| ( ) Changed Mind  |
| ( ) Damaged in    |
|     Transit       |
| ( ) Other         |
+-------------------+
       |
       v
+-------------------+
| PROVIDE DETAILS   |
|                   |
| Description:      |
| [_______________] |
|                   |
| Upload Evidence:  |
| [+ Add Photos]    |
|                   |
| Refund Method:    |
| ( ) Original      |
|     payment       |
| ( ) Store credit  |
+-------------------+
       |
       v
+-------------------+
| REVIEW & SUBMIT   |
|                   |
| Items: 1          |
| Reason: Defective |
| Refund: INR 22490 |
| Method: Original  |
|                   |
| [Submit Return]   |
+-------------------+
       |
       v
+========================+
| RETURN PROCESSING      |
| (State Machine Flow)   |
+========================+
       |
       v
+-----------+
| REQUESTED |  <-- Initial state after submission
+-----------+
       |
       v (Admin/System reviews within 24h)
+-------------------+
| Review Decision   |
+-------------------+
   |            |
   v            v
+---------+ +----------+
| APPROVED| | REJECTED |
+---------+ +----------+
   |              |
   |              v
   |        +------------------+
   |        | "Return rejected.|
   |        | Reason: Does not |
   |        | meet policy"     |
   |        +------------------+
   |              |
   |              v
   |        +------------------+
   |        | ESCALATE option  |
   |        | (customer can    |
   |        | escalate if in   |
   |        | UNDER_REVIEW)    |
   |        +------------------+
   |
   v
+-------------------+
| SCHEDULE PICKUP   |
|                   |
| Date: [2026-03-28]|
| Slot:             |
| ( ) 10AM - 1PM   |
| ( ) 1PM - 4PM    |
| ( ) 4PM - 7PM    |
| Address: [addr-01]|
+-------------------+
       |
       v
+--------------------+
| PICKUP_SCHEDULED   |
| Awaiting courier   |
| pickup             |
+--------------------+
       |
       v (Courier picks up item)
+--------------------+
| RECEIVED           |
| Item received at   |
| warehouse          |
+--------------------+
       |
       v (QC inspection)
+----------+
| QC Pass? |
+----------+
   |      |
  YES    NO
   |      |
   |      v
   | +------------------+
   | | Partial refund   |
   | | or rejection     |
   | | (item damaged    |
   | | by customer)     |
   | +------------------+
   |
   v
+--------------------+
| REFUNDED           |
| Refund processed   |
| to original method |
|                    |
| Amount: INR 22,490 |
| Method: UPI        |
| Timeline: 5-7 days |
+--------------------+
       |
       v
     [END]
```

---

## Return Timeline Visualization

```
Day 0         Day 1          Day 3           Day 5-7        Day 10-12
  |             |              |                |               |
  v             v              v                v               v
+--------+  +--------+  +----------+  +---------+  +----------+
|Request |  |Approved|  |Pickup    |  |Received |  |Refunded  |
|Submitted|  |        |  |Completed |  |at       |  |          |
|        |  |        |  |          |  |Warehouse|  |          |
+--------+  +--------+  +----------+  +---------+  +----------+
```

---

## Page References

| Step | Prototype Page | URL Path |
|------|---------------|----------|
| Order History | `customer/my-orders.html` | `/account/orders` |
| Order Detail | `customer/order-detail.html` | `/orders/{orderId}` |
| Returns & Refunds | `customer/returns.html` | `/account/returns` |
| Return Request Modal | `customer/returns.html` (modal) | `/account/returns?new=true` |
| Return Tracking | `customer/returns.html` (timeline) | `/account/returns` |

---

## API Calls at Each Step

| Step | API Endpoint | Method | Trigger |
|------|-------------|--------|---------|
| **My Orders** | | | |
| Load orders (delivered) | `POST /api/query/customer-orders` | POST | Page load |
| **Initiate Return** | | | |
| Fetch returnable items | `GET /api/orders/returnable-items` | GET | "New Return" click |
| Upload evidence images | `POST /api/uploads` | POST | Photo attach |
| Submit return request | `POST /api/returnrequest` | POST | Submit click |
| **Returns Page** | | | |
| Load return stats | `GET /api/returns/stats` | GET | Page load |
| Load returns list | `POST /api/query/customer-returns` | POST | Page load |
| Load return policy | `GET /api/returns/policy` | GET | Page load |
| **Return Actions** | | | |
| Cancel return | `PATCH /api/returnrequest/{id}/cancel` | PATCH | Cancel click |
| Schedule pickup | `PATCH /api/returnrequest/{id}/schedulePickup` | PATCH | Schedule click |
| Escalate return | `PATCH /api/returnrequest/{id}/escalate` | PATCH | Escalate click |

---

## Decision Points

| Decision | Condition | Path A | Path B |
|----------|-----------|--------|--------|
| Within return window? | `deliveredAt + 30 days > now` | Show return option | Hide return button |
| Item eligible? | Item in returnable list | Allow selection | Show "Not eligible" |
| Reason requires photos? | Defective, Damaged | Photo upload mandatory | Photo upload optional |
| Approved or Rejected? | Admin review decision | Schedule pickup | Show rejection reason |
| Full or Partial refund? | QC inspection result | Full refund | Partial refund with note |
| Refund method? | Customer preference | Original payment method | Store credit (instant) |

---

## State Machine (Return Request STM)

```
REQUESTED --> UNDER_REVIEW --> APPROVED --> PICKUP_SCHEDULED
    |              |               |
    |              v               v
    |          ESCALATED      ITEM_RECEIVED --> INSPECTED
    |                              |                |
    |                              v                v
    +-------> REJECTED        REFUND_INITIATED --> COMPLETED
```

Allowed actions per state (customer-visible):

| State | Actions Available |
|-------|-----------------|
| REQUESTED | (waiting -- read only) |
| UNDER_REVIEW | Escalate |
| APPROVED | (ship item back -- read only) |
| PICKUP_SCHEDULED | (waiting for courier) |
| ITEM_RECEIVED | (inspection pending) |
| REFUND_INITIATED | (processing) |
| COMPLETED | (terminal -- read only) |
| REJECTED | (terminal -- read only) |

---

## Error Paths

| Error | Trigger | User Experience | Recovery |
|-------|---------|----------------|----------|
| Return window expired | Request return after 30 days | "Return window has expired for this item" | Contact support |
| Non-returnable item | Perishable/custom item | "This item category is non-returnable" | None |
| Upload failed | Large file or network error | "File upload failed. Max 5MB, JPG/PNG" | Retry with smaller file |
| Return rejected | Policy violation | "Return rejected: Items must be unused" | Contact support or escalate |
| Pickup not available | Remote area | "Pickup not available. Please ship via courier" | Self-ship option |
| Refund delayed | Bank processing | "Refund is being processed (5-7 business days)" | Wait or contact support |

---

## Time Estimates

| Step | User Action | Estimated Time |
|------|------------|---------------|
| Navigate to My Orders | Click from account menu | 5 seconds |
| Find delivered order | Scroll/filter orders | 10-30 seconds |
| Select items to return | Check items | 10-20 seconds |
| Choose reason + details | Fill form + upload photos | 1-3 minutes |
| Review and submit | Verify and click submit | 15-30 seconds |
| Schedule pickup | Select date + slot | 15-30 seconds |
| **Total (user actions)** | | **2-5 minutes** |
| | | |
| Admin review | System/admin approval | 1-24 hours |
| Courier pickup | Scheduled pickup window | 1-3 days |
| Warehouse receipt + QC | Receive and inspect | 2-3 days |
| Refund processing | Bank/payment processing | 5-7 business days |
| **Total (end to end)** | | **7-14 days** |
