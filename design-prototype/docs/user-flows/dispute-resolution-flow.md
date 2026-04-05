# Dispute Resolution Flow

End-to-end flow from a customer filing a dispute through to final resolution.

---

## Flow Overview

```
+----------+     +-----------+     +----------+     +------------+
| Customer |---->| Seller    |---->| Admin    |---->| Resolution |
| Files    |     | Responds  |     | Reviews  |     |            |
+----------+     +-----------+     +----------+     +------------+
```

---

## Detailed Flow Diagram

```
    [START]
       |
       v
+===========================+
| CUSTOMER FILES DISPUTE    |
| (Customer App)            |
+===========================+
       |
       v
+----------------------------+
| STEP 1: SELECT ORDER       |
| customer-orders.html        |
|                             |
| Order ID:    {{orderId}}    |
| Item:        {{productName}}|
| Amount:      {{amount}}     |
|                             |
| [File Dispute]              |
+----------------------------+
       |
       v
+----------------------------+
| STEP 2: DISPUTE DETAILS    |
| customer-dispute-form.html  |
|                             |
| Reason:                     |
| ( ) Item not received       |
| ( ) Item damaged            |
| ( ) Item not as described   |
| ( ) Wrong item received     |
| ( ) Charged incorrectly     |
| ( ) Other                   |
|                             |
| Description:                |
| [_________________________] |
|                             |
| Evidence (optional):        |
| [+ Upload Photos]           |
|                             |
| Preferred Resolution:       |
| ( ) Full refund             |
| ( ) Partial refund          |
| ( ) Replacement             |
| ( ) Store credit            |
|                             |
| [Submit Dispute]            |
+----------------------------+
       |
       v
+================================+
| DISPUTE CREATED                |
| (State: OPEN)                  |
| disputeId: {{disputeId}}       |
+================================+
       |
       | Notification sent to seller
       v
+===========================+
| SELLER RESPONDS           |
| (Seller App)              |
+===========================+
       |
       v
+----------------------------+
| STEP 3: SELLER REVIEW      |
| seller-disputes.html        |
|                             |
| Dispute:   {{disputeId}}    |
| Customer:  {{customerName}} |
| Order:     {{orderId}}      |
| Reason:    {{reason}}       |
| Evidence:  [View Uploads]   |
|                             |
| Seller Response:            |
| [_________________________] |
|                             |
| Seller Evidence (optional): |
| [+ Upload]                  |
|                             |
| Action:                     |
| [Accept & Refund]           |
| [Counter with Evidence]     |
| [Request Mediation]         |
+----------------------------+
       |
       +-------+---------+---------+
       |                 |         |
       v                 v         v
  +---------+    +----------+  +----------+
  | Accept  |    | Counter  |  | Request  |
  | & Refund|    | (seller  |  | Mediation|
  | (auto-  |    | provides |  | (escalate|
  | resolve)|    | evidence)|  | to admin)|
  +---------+    +----------+  +----------+
       |              |              |
       |              v              |
       |     +---------------+       |
       |     | State:        |       |
       |     | SELLER_       |       |
       |     | RESPONDED     |       |
       |     +---------------+       |
       |              |              |
       |              v              |
       |     (Customer reviews       |
       |      seller response)       |
       |              |              |
       |         +----+----+         |
       |         |         |         |
       |         v         v         |
       |    +--------+ +--------+   |
       |    | Accept | | Reject |   |
       |    | seller | | (auto  |   |
       |    | counter| | escalate)  |
       |    +--------+ +--------+   |
       |         |         |         |
       |         |         +---------+
       |         |                   |
       v         v                   v
+================================+
| ADMIN REVIEW                   |
| (State: UNDER_REVIEW)         |
| admin-disputes.html            |
+================================+
       |
       v
+----------------------------+
| STEP 4: ADMIN ASSESSMENT    |
| admin-dispute-detail.html   |
|                             |
| Dispute:    {{disputeId}}   |
| Status:     Under Review    |
|                             |
| --- Customer Side ---       |
| Reason:     {{reason}}      |
| Evidence:   [View]          |
| Requested:  {{resolution}}  |
|                             |
| --- Seller Side ---         |
| Response:   {{response}}    |
| Evidence:   [View]          |
|                             |
| --- Order Details ---       |
| Order ID:   {{orderId}}     |
| Amount:     {{amount}}      |
| Date:       {{orderDate}}   |
| Shipping:   {{tracking}}    |
|                             |
| --- Admin Actions ---       |
| [Assign to Agent]           |
| [Escalate]                  |
|                             |
| Resolution:                 |
| ( ) Full refund to customer |
| ( ) Partial refund          |
|     Amount: [___]           |
| ( ) Side with seller        |
| ( ) Split (partial refund   |
|     + seller credit)        |
| ( ) Replacement order       |
|                             |
| Admin Notes:                |
| [_________________________] |
|                             |
| [Resolve Dispute]           |
+----------------------------+
       |
       +-----+------+------+------+
       |            |      |      |
       v            v      v      v
+---------+ +--------+ +-----+ +-------+
| Full    | |Partial | |Side | |Split  |
| Refund  | |Refund  | |with | |       |
|         | |        | |Seller| |       |
+---------+ +--------+ +-----+ +-------+
       |            |      |      |
       v            v      v      v
+================================+
| RESOLUTION APPLIED             |
| (State: RESOLVED)              |
+================================+
       |
       v
+----------------------------+
| NOTIFICATIONS SENT          |
|                             |
| To Customer:                |
|   "Your dispute has been    |
|    resolved. {{outcome}}"   |
|                             |
| To Seller:                  |
|   "Dispute {{disputeId}}    |
|    resolved. {{outcome}}"   |
+----------------------------+
       |
       v
    [END]
```

---

## Dispute State Machine (STM)

```
OPEN
  |
  v
SELLER_NOTIFIED
  |
  +------+----------+----------+
  |                  |          |
  v                  v          v
SELLER_ACCEPTED   SELLER_     MEDIATION_
(auto-resolve)    RESPONDED   REQUESTED
  |                  |          |
  |                  v          |
  |         CUSTOMER_REVIEWED   |
  |           |         |       |
  |           v         v       |
  |       ACCEPTED   ESCALATED--+
  |       (resolve)     |
  |                     v
  +----------->  UNDER_REVIEW
  |                     |
  |              +------+------+------+
  |              |      |      |      |
  v              v      v      v      v
RESOLVED     RESOLVED RESOLVED RESOLVED RESOLVED
(refund)     (full)  (partial)(seller)(split)
  |              |      |      |      |
  +-----+--------+------+------+------+
        |
        v
     CLOSED
```

---

## Resolution Types

| Resolution | Description | Financial Impact |
|------------|-------------|-----------------|
| Full Refund | Customer receives full order amount back | Seller debited full amount |
| Partial Refund | Customer receives agreed partial amount | Seller debited partial amount |
| Side with Seller | Dispute dismissed, no refund | No financial impact |
| Split | Partial refund + seller receives partial payment | Platform may absorb difference |
| Replacement | New order shipped to customer at no charge | Seller ships replacement |

---

## Page References

| Step | Prototype Page | URL Path |
|------|---------------|----------|
| File Dispute | `customer/customer-orders.html` | `/customer/orders/{{orderId}}/dispute` |
| Dispute Form | `customer/customer-dispute-form.html` | `/customer/disputes/new` |
| Customer Disputes List | `customer/customer-disputes.html` | `/customer/disputes` |
| Seller Disputes List | `seller/seller-disputes.html` | `/seller/disputes` |
| Seller Dispute Detail | `seller/seller-dispute-detail.html` | `/seller/disputes/{{disputeId}}` |
| Admin Disputes List | `admin/admin-disputes.html` | `/admin/disputes` |
| Admin Dispute Detail | `admin/admin-dispute-detail.html` | `/admin/disputes/{{disputeId}}` |

---

## API Calls at Each Step

| Step | API Endpoint | Method | Trigger |
|------|-------------|--------|---------|
| **Customer Files Dispute** | | | |
| Create dispute | `POST /api/dispute` | POST | Form submit |
| Upload evidence | `POST /api/dispute/{{disputeId}}/evidence` | POST | File select |
| **Seller Responds** | | | |
| Load dispute detail | `GET /api/dispute/{{disputeId}}` | GET | Page load |
| Submit response | `PATCH /api/dispute/{{disputeId}}/respond` | PATCH | Submit click |
| Upload seller evidence | `POST /api/dispute/{{disputeId}}/evidence` | POST | File select |
| Accept and refund | `PATCH /api/dispute/{{disputeId}}/accept` | PATCH | Accept click |
| Request mediation | `PATCH /api/dispute/{{disputeId}}/escalate` | PATCH | Mediation click |
| **Customer Reviews Response** | | | |
| Accept seller counter | `PATCH /api/dispute/{{disputeId}}/acceptCounter` | PATCH | Accept click |
| Reject and escalate | `PATCH /api/dispute/{{disputeId}}/rejectCounter` | PATCH | Reject click |
| **Admin Reviews** | | | |
| List all disputes | `POST /api/query/disputes` | POST | Page load |
| Load dispute detail | `GET /api/dispute/{{disputeId}}` | GET | Page load |
| Assign to agent | `PATCH /api/dispute/{{disputeId}}/assign` | PATCH | Assign click |
| Escalate | `PATCH /api/dispute/{{disputeId}}/escalate` | PATCH | Escalate click |
| Resolve dispute | `PATCH /api/dispute/{{disputeId}}/resolve` | PATCH | Resolve click |

---

## Decision Points

| Decision | Condition | Path A | Path B |
|----------|-----------|--------|--------|
| Seller accepts? | Seller agrees with customer | Auto-resolve with refund | Seller counters or requests mediation |
| Customer accepts counter? | Customer agrees with seller response | Dispute closed (no refund) | Escalated to admin |
| Evidence sufficient? | Admin assessment | Resolve in favour of one party | Request additional evidence |
| Refund type? | Admin decision | Full / Partial / Split / None | -- |
| Auto-escalation? | No seller response in 48 hours | Auto-escalate to admin | -- |

---

## SLA and Timelines

| Stage | SLA | Auto-Action on Breach |
|-------|-----|-----------------------|
| Seller must respond | 48 hours | Auto-escalate to admin |
| Customer must review counter | 72 hours | Auto-escalate to admin |
| Admin must resolve | 5 business days | Escalate to Platform Admin |
| Refund processing | 5-7 business days | Alert finance team |

---

## Error Paths

| Error | Trigger | User Experience | Recovery |
|-------|---------|----------------|----------|
| Dispute already exists | Duplicate filing | "A dispute already exists for this order." | View existing dispute |
| Order not eligible | Outside dispute window (30 days) | "This order is past the dispute period." | Contact support |
| Evidence upload failed | File too large (>10MB) | "File too large. Maximum 10MB." | Compress and retry |
| Refund processing failed | Payment gateway error | "Refund could not be processed." toast | Admin retries manually |
| Seller account suspended | Seller cannot respond | Auto-escalate to admin | Admin resolves directly |
