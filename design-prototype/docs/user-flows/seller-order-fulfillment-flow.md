# Seller Order Fulfillment Flow

Order processing from new order notification to delivery, including cancellation and return handling.

---

## Flow Overview

```
+-----------+     +-----------+     +-----------+     +-----------+
| New Order |---->| Confirm   |---->| Pack &    |---->| Ship      |
| Received  |     | Order     |     | Enter     |     |           |
|           |     |           |     | Tracking  |     |           |
+-----------+     +-----------+     +-----------+     +-----------+
                                                           |
                                                           v
                                                     +-----------+
                                                     | Delivered |
                                                     +-----------+
```

---

## Detailed Flow Diagram

```
    [START]
       |
       v
+===========================+
| NEW ORDER NOTIFICATION    |
| seller-orders.html        |
|                           |
| Order: HB-78234           |
| Customer: Ankit Kumar     |
| Items: 2                  |
| Amount: INR 4,299         |
| Payment: UPI (Paid)       |
+===========================+
       |
       v
+----------------------------+
| ORDER STATE: PAID          |
| (Payment confirmed by      |
|  payment gateway)           |
|                             |
| Dashboard shows order in    |
| "Pending" tab               |
| Stats: pending count + 1    |
+----------------------------+
       |
       v
+-------------------+
| SELLER REVIEWS    |
| ORDER DETAIL      |
| (slide-over panel)|
|                   |
| Customer info     |
| Shipping address  |
| Item list + SKUs  |
| Payment status    |
+-------------------+
       |
       +-------+---------+
       |                 |
       v                 v
+-----------+     +-------------+
| CONFIRM   |     | CANCEL      |
| ORDER     |     | ORDER       |
| (start    |     |             |
| processing|     | Reason:     |
| )         |     | - Out of    |
|           |     |   stock     |
| PATCH     |     | - Cannot    |
| /order/   |     |   fulfill   |
| {id}/     |     |             |
| confirm   |     | PATCH       |
+-----------+     | /order/     |
       |          | {id}/cancel |
       |          +-------------+
       |                 |
       |                 v
       |          +-------------+
       |          | CANCELLED   |
       |          | Refund      |
       |          | initiated   |
       |          | to customer |
       |          +-------------+
       |                 |
       |                 v
       |              [END]
       |
       v
+----------------------------+
| ORDER STATE: PROCESSING    |
|                             |
| Seller must now:            |
| 1. Pick items from stock    |
| 2. Pack the order           |
| 3. Generate shipping label  |
| 4. Enter tracking number    |
+----------------------------+
       |
       v
+----------------------------+
| PACK ORDER                  |
|                             |
| Items to pack:              |
| [x] Wireless Bluetooth      |
|     Speaker (HB-EL-0042)   |
| [x] USB-C Cable             |
|     (HB-EL-0088)           |
|                             |
| Packaging:                  |
| ( ) Box - Small             |
| (x) Box - Medium            |
| ( ) Box - Large             |
|                             |
| Weight: [0.85] kg           |
+----------------------------+
       |
       v
+----------------------------+
| ENTER TRACKING INFO         |
|                             |
| Courier Partner:            |
| [Delhivery      v]         |
|                             |
| Tracking Number:            |
| [DL123456789IN  ]          |
|                             |
| [Mark as Shipped]           |
+----------------------------+
       |
       v
+----------------------------+
| SHIP ORDER (STM Event)     |
|                             |
| PATCH /api/order/{id}/ship  |
| {                           |
|   trackingNumber:           |
|     "DL123456789IN",       |
|   courierPartner:           |
|     "Delhivery"            |
| }                           |
+----------------------------+
       |
       v
+----------------------------+
| ORDER STATE: SHIPPED        |
|                             |
| - Tracking active           |
| - Customer notified         |
| - Courier has package       |
| - Seller: read-only view    |
+----------------------------+
       |
       v (Carrier delivers)
+----------------------------+
| ORDER STATE: DELIVERED      |
|                             |
| Delivered: 2026-03-28       |
| Signed by: Customer         |
| POD: Available              |
+----------------------------+
       |
       v
+-------------------+
| Customer confirms |
| delivery          |
| (or auto-confirm  |
|  after 7 days)    |
+-------------------+
       |
       v
+----------------------------+
| ORDER STATE: COMPLETED      |
|                             |
| - Payment settled           |
| - Seller payout scheduled   |
| - Order archived            |
+----------------------------+
       |
       v
     [END]
```

---

## Partial Shipment Flow

```
+----------------------------+
| ORDER: 3 items              |
| State: PROCESSING           |
|                             |
| Item 1: In stock     [x]   |
| Item 2: In stock     [x]   |
| Item 3: Out of stock [ ]   |
+----------------------------+
       |
       v
+----------------------------+
| PARTIAL SHIP                |
| PATCH /order/{id}/          |
| partialShip                 |
|                             |
| Ship items 1 & 2 now       |
| Item 3: backordered         |
+----------------------------+
       |
       v
+----------------------------+
| ORDER STATE:                |
| PARTIALLY_SHIPPED           |
|                             |
| Shipped: Items 1, 2        |
| Pending: Item 3             |
|                             |
| Options:                    |
| [Ship Remaining]            |
| [Cancel Remaining]          |
+----------------------------+
       |
       +-------+--------+
       |                |
       v                v
  Ship Item 3     Cancel Item 3
  when ready      (partial refund)
```

---

## Cancel Flow (Seller-Initiated)

```
+----------------------------+
| ORDER STATE: PROCESSING     |
| (or PAID)                   |
+----------------------------+
       |
       v
+----------------------------+
| SELLER CANCELS ORDER        |
|                             |
| Reason:                     |
| ( ) Out of stock            |
| ( ) Cannot fulfill          |
| ( ) Pricing error           |
| ( ) Customer request        |
|                             |
| PATCH /order/{id}/cancel    |
| { reason: "Out of stock" }  |
+----------------------------+
       |
       v
+----------------------------+
| ORDER STATE: CANCELLED      |
|                             |
| - Refund auto-initiated     |
| - Customer notified via     |
|   email + push              |
| - Seller performance        |
|   impact noted              |
+----------------------------+
       |
       v
+----------------------------+
| REFUND PROCESSING           |
|                             |
| Original method: UPI        |
| Amount: INR 4,299           |
| Timeline: 5-7 business days |
+----------------------------+
```

---

## Return Handling (Seller Side)

```
+----------------------------+
| RETURN NOTIFICATION         |
| seller-returns.html         |
|                             |
| Customer requested return   |
| for Order HB-78234          |
| Reason: Defective           |
+----------------------------+
       |
       v
+----------------------------+
| SELLER REVIEWS RETURN       |
| (Return detail panel)       |
|                             |
| Item: Wireless Speaker      |
| Reason: Defective           |
| Photos: [img1] [img2]       |
| Customer note: "Left        |
|  speaker not working"       |
+----------------------------+
       |
       +-------+--------+
       |                |
       v                v
+-----------+    +-----------+
| APPROVE   |    | REJECT    |
| RETURN    |    | RETURN    |
|           |    |           |
| Item will |    | Reason:   |
| be picked |    | "Item     |
| up from   |    |  shows    |
| customer  |    |  normal   |
|           |    |  wear"    |
+-----------+    +-----------+
       |
       v
+----------------------------+
| RETURN STATE: APPROVED      |
|                             |
| - Pickup scheduled          |
| - Item returned to seller   |
|   or warehouse              |
| - QC inspection             |
+----------------------------+
       |
       v
+----------------------------+
| ITEM RECEIVED & INSPECTED   |
|                             |
| Condition: Defective        |
| (confirmed)                 |
|                             |
| Refund: Full (INR 3,499)   |
+----------------------------+
       |
       v
+----------------------------+
| REFUND PROCESSED            |
| Return marked COMPLETED     |
|                             |
| - Seller inventory updated  |
| - Defective item quarantined|
+----------------------------+
```

---

## Order State Machine (Seller View)

```
    CREATED --> PAYMENT_PENDING --> PAID
                                     |
                              +------+------+
                              |             |
                              v             v
                         PROCESSING     CANCELLED
                              |         (refund)
                      +-------+-------+
                      |               |
                      v               v
                   SHIPPED    PARTIALLY_SHIPPED
                      |               |
                      v               v
                  DELIVERED    Ship remaining
                      |        or cancel rest
                      v
                  COMPLETED
                      |
                      +------+------+
                      |             |
                      v             v
              RETURN_REQUESTED  (archived)
                      |
                      v
                  REFUNDED
```

Seller-visible STM actions:

| State | Seller Actions |
|-------|---------------|
| PAID | (read-only, payment confirmed) |
| PROCESSING | Mark Shipped, Partial Ship |
| PARTIALLY_SHIPPED | Mark Shipped, Ship More Items |
| SHIPPED | (read-only, in transit) |
| DELIVERED | (read-only) |
| COMPLETED | (read-only) |
| RETURN_REQUESTED | (handle via returns page) |

---

## Page References

| Step | Prototype Page | URL Path |
|------|---------------|----------|
| Orders Dashboard | `seller/seller-orders.html` | `/seller/orders` |
| Order Detail | `seller/seller-orders.html` (slide-over) | `/seller/orders?id={orderId}` |
| Returns Dashboard | `seller/seller-returns.html` | `/seller/returns` |
| Seller Dashboard | `seller/seller-dashboard.html` | `/seller/dashboard` |
| Performance | `seller/seller-performance.html` | `/seller/performance` |

---

## API Calls at Each Step

| Step | API Endpoint | Method | Trigger |
|------|-------------|--------|---------|
| **Orders Page** | | | |
| Load order stats | `GET /api/seller/orders/stats` | GET | Page load |
| Load orders list | `POST /api/query/seller-orders` | POST | Page load |
| View order detail | `GET /api/order/{id}` | GET | Row click |
| **Order Actions** | | | |
| Confirm order | `PATCH /api/order/{id}/confirm` | PATCH | Confirm click |
| Ship order | `PATCH /api/order/{id}/ship` | PATCH | Ship click |
| Partial ship | `PATCH /api/order/{id}/partialShip` | PATCH | Partial Ship click |
| Cancel order | `PATCH /api/order/{id}/cancel` | PATCH | Cancel click |
| **Returns Page** | | | |
| Load return stats | `GET /api/seller/returns/stats` | GET | Page load |
| Load returns list | `POST /api/query/seller-returns` | POST | Page load |
| Approve return | `PATCH /api/returnrequest/{id}/approve` | PATCH | Approve click |
| Reject return | `PATCH /api/returnrequest/{id}/reject` | PATCH | Reject click |
| **Export** | | | |
| Export orders CSV | `GET /api/seller/orders/export?format=csv` | GET | Export click |

---

## Decision Points

| Decision | Condition | Path A | Path B |
|----------|-----------|--------|--------|
| In stock? | Inventory check | Confirm + process | Cancel (out of stock) |
| All items available? | Partial stock | Ship all | Partial ship + backorder |
| Ship method? | Seller ships or warehouse | Enter tracking manually | Warehouse handles |
| Return valid? | Policy check + evidence | Approve return | Reject with reason |
| Return condition? | QC inspection | Full refund | Partial refund or reject |

---

## Error Paths

| Error | Trigger | User Experience | Recovery |
|-------|---------|----------------|----------|
| Order already cancelled | Confirm stale order | "Order was cancelled by customer" | Refresh order list |
| Invalid tracking number | Format check | "Invalid tracking number format" | Re-enter correct number |
| Courier not available | Ship to remote area | "Courier not serviceable" | Choose alternate courier |
| Ship deadline missed | SLA breach | "Ship by deadline missed. Order at risk" | Ship immediately or cancel |
| Return window expired | Late return request | Auto-rejected by system | None |

---

## Time Estimates

| Step | User Action | Estimated Time |
|------|------------|---------------|
| Review new order | Read order details | 30-60 seconds |
| Confirm order | Click confirm | 5 seconds |
| Pick items | Physical warehouse pick | 5-15 minutes |
| Pack order | Physical packing | 5-10 minutes |
| Enter tracking | Input number + courier | 15-30 seconds |
| Mark shipped | Click ship button | 5 seconds |
| **Total (per order)** | | **15-30 minutes** |
| | | |
| Shipping transit | Carrier delivery | 2-7 days |
| Delivery confirmation | Customer or auto | 0-7 days |
| Settlement | Payment to seller | 7-14 days after delivery |
| **Total end-to-end** | | **9-28 days** |
