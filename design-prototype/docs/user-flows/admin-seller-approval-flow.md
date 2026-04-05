# Admin Seller Approval Flow

Seller application moderation, KYC verification, performance monitoring, and account management.

---

## Flow Overview

```
+------------+     +----------+     +----------+     +----------+
| Application|---->| Review   |---->| Verify   |---->| Approve  |
| Received   |     | Documents|     | KYC/Bank |     | or       |
|            |     |          |     |          |     | Reject   |
+------------+     +----------+     +----------+     +----------+
                                                          |
                                                          v
+------------+     +----------+                    +----------+
| Suspend /  |<----| Monitor  |<-------------------| Active   |
| Reactivate |     | Perf.    |                    | Seller   |
+------------+     +----------+                    +----------+
```

---

## Detailed Flow Diagram

```
    [START]
       |
       v
+=========================+
| NEW APPLICATION         |
| admin-sellers.html      |
|                         |
| Notification: "18       |
| sellers pending         |
| approval"               |
|                         |
| Stats Card:             |
| pendingApproval: 18     |
| needsAttention: true    |
+=========================+
       |
       v
+----------------------------+
| APPLICATION LIST            |
| (Filter: Pending Approval)  |
|                             |
| POST /api/query/            |
| admin-sellers               |
| filters: {stateId:          |
|   "APPLIED"}               |
|                             |
| +--+--+--+--+--+           |
| |Name |Docs|Date|Actions|   |
| +--+--+--+--+--+           |
| |Priya|3/6 |Mar |[Review]|  |
| |Store|    |27  |        |  |
| +--+--+--+--+--+           |
+----------------------------+
       |
       | Admin clicks "Review Application"
       v
+=========================+
| STEP 1: REVIEW          |
| APPLICATION              |
| (State: APPLIED ->       |
|  UNDER_REVIEW)           |
|                          |
| PATCH /api/seller/{id}/  |
| reviewSupplier           |
+=========================+
       |
       v
+----------------------------+
| SELLER DETAIL PANEL         |
| GET /api/seller/{id}        |
|                             |
| == Personal Info ==          |
| Name:  Priya Gupta          |
| Email: priya@store.com      |
| Phone: +91 98765 43210      |
|                             |
| == Business Info ==          |
| Store: Priya's Fashion      |
| Type:  Sole Proprietorship   |
| GSTIN: 27AAACR5055K1Z5      |
| PAN:   AAACR5055K           |
| Addr:  Shop 15, MG Road     |
|                             |
| == Documents ==              |
| GST Certificate:   VERIFIED |
| PAN Card:          VERIFIED |
| Business License:  PENDING  |
| Cancelled Cheque:  VERIFIED |
| Address Proof:     PENDING  |
| Identity Proof:    MISSING  |
|                             |
| == Bank Details ==           |
| Bank:    SBI                 |
| Account: XXXX XXXX 4523     |
| IFSC:    SBIN0001234        |
| Status:  VERIFIED            |
+----------------------------+
       |
       v
+=========================+
| STEP 2: DOCUMENT         |
| VERIFICATION              |
| (State: UNDER_REVIEW)    |
+=========================+
       |
       v
+----------------------------+
| VERIFY EACH DOCUMENT        |
|                             |
| For each document:          |
|                             |
| GST Certificate:            |
|   [View PDF] -> Verify      |
|   GSTIN matches? [x] Yes    |
|   Valid date?    [x] Yes    |
|   Status: VERIFIED           |
|                             |
| PAN Card:                    |
|   [View Image] -> Verify    |
|   Name matches?  [x] Yes    |
|   Number valid?  [x] Yes    |
|   Status: VERIFIED           |
|                             |
| Business License:            |
|   [View PDF] -> Review      |
|   Valid license? [ ] No      |
|   Status: EXPIRED            |
|                             |
| Identity Proof:              |
|   NOT UPLOADED               |
+----------------------------+
       |
       v
  +----------+
  | All docs |
  | valid?   |
  +----------+
     |      |
    YES    NO
     |      |
     |      v
     | +----------------------------+
     | | REQUEST ADDITIONAL DOCS     |
     | | (State: DOCUMENTS_REQUESTED)|
     | |                             |
     | | PATCH /api/seller/{id}/     |
     | | requestDocuments             |
     | |                             |
     | | Message to seller:           |
     | | "Please upload:              |
     | |  - Renewed business license  |
     | |  - Identity proof (Aadhaar   |
     | |    or Passport)"            |
     | +----------------------------+
     |        |
     |        v
     |  Seller resubmits
     |  (resubmitDocuments event)
     |        |
     |        v
     |  Back to Document Review
     |
     v
+=========================+
| STEP 3: KYC VERIFICATION|
| (Business Verification)  |
+=========================+
       |
       v
+----------------------------+
| AUTOMATED CHECKS            |
|                             |
| 1. GSTIN Validation:        |
|    API check against GST    |
|    portal                    |
|    Result: VALID             |
|                             |
| 2. PAN Verification:        |
|    Cross-reference with      |
|    IT database               |
|    Result: VALID             |
|                             |
| 3. Bank Account:             |
|    Penny drop test           |
|    Result: VERIFIED          |
|                             |
| 4. Address Verification:     |
|    Pincode + state match     |
|    Result: VALID             |
+----------------------------+
       |
       v
+----------------------------+
| ADMIN DECISION              |
+----------------------------+
       |
       +------+--------+--------+
       |               |        |
       v               v        v
+-----------+   +---------+ +----------+
| APPROVE   |   | REJECT  | | NEED     |
|           |   |         | | MORE     |
| PATCH     |   | PATCH   | | INFO     |
| /seller/  |   | /seller/| | (back to |
| {id}/     |   | {id}/   | | docs     |
| approve   |   | reject  | | request) |
| Supplier  |   | Supplier| |          |
|           |   |         | |          |
| {reason:  |   | {reason:| |          |
|  "All docs|   |  "Incom-| |          |
|  verified"|   |  plete  | |          |
|  tier:    |   |  docs"} | |          |
|  "Standr" |   |         | |          |
| }         |   |         | |          |
+-----------+   +---------+ +----------+
       |               |
       |               v
       |        +-----------+
       |        | REJECTED  |
       |        | [TERMINAL]|
       |        |           |
       |        | Email:    |
       |        | "Applica- |
       |        | tion      |
       |        | rejected. |
       |        | Reason:   |
       |        | ..."      |
       |        |           |
       |        | Seller can|
       |        | reapply   |
       |        +-----------+
       |
       v
+----------------------------+
| APPROVED                    |
| -> ACTIVATE                 |
|                             |
| PATCH /api/seller/{id}/     |
| activateSupplier            |
|                             |
| Seller account activated    |
| Can now list products       |
| Store visible on            |
| marketplace                 |
+----------------------------+
       |
       v
+=========================+
| ONGOING MONITORING      |
| admin-sellers.html      |
| admin-analytics.html    |
+=========================+
       |
       v
+----------------------------+
| PERFORMANCE METRICS         |
|                             |
| Rating:          4.8 / 5    |
| Order Fill Rate: 97%        |
| Ship On Time:    94%        |
| Return Rate:     2.1%       |
| Customer Complaints: 3      |
| Revenue:     INR 38,20,000  |
+----------------------------+
       |
       v
  +----------+
  | Issues   |
  | Found?   |
  +----------+
     |      |
    YES    NO
     |      |
     |      v
     |  Continue monitoring
     |
     +------+--------+--------+
     |               |        |
     v               v        v
+-----------+ +---------+ +-----------+
| PROBATION | | SUSPEND | | TERMINATE |
|           | |         | |           |
| putOnPro- | |suspend- | |terminate- |
| bation    | |Supplier | |Supplier   |
|           | |         | |           |
| Warning   | |Temp ban | |Permanent  |
| period    | |on sales | |removal    |
+-----------+ +---------+ +-----------+
     |              |            |
     |              |            v
     |              |       [TERMINAL]
     |              |
     +------+       |
     |      |       |
     v      v       v
  Resolve  Suspend  Reactivate
  Probation         Supplier
     |                  |
     v                  v
  ACTIVE            ACTIVE
  (back to          (restored)
  normal)
```

---

## Seller State Machine (Admin-Managed)

```
APPLIED --> UNDER_REVIEW --> APPROVED --> ACTIVE
                |                           |
                v                      +----+----+----+
           REJECTED               |         |        |
           (can reapply)     ON_PROBATION SUSPENDED TERMINATED
                               |    |       |    |      |
                               v    v       v    v   [TERMINAL]
                           Resolve Susp  React. Term.
                               |    |       |    |
                               v    v       v    v
                           ACTIVE SUSP  ACTIVE  TERM

Also: UNDER_REVIEW can go to DOCUMENTS_REQUESTED -> back to UNDER_REVIEW
```

Admin-visible STM actions:

| State | Admin Actions |
|-------|--------------|
| APPLIED | Review Application |
| UNDER_REVIEW | Approve, Reject |
| APPROVED | Activate |
| REJECTED | (terminal, seller can reapply) |
| ACTIVE | Suspend, Put on Probation, Terminate |
| ON_PROBATION | Resolve Probation, Suspend, Terminate |
| SUSPENDED | Reactivate, Terminate |
| TERMINATED | (terminal) |

---

## Page References

| Step | Prototype Page | URL Path |
|------|---------------|----------|
| Sellers Dashboard | `admin/admin-sellers.html` | `/admin/sellers` |
| Seller Detail | `admin/admin-sellers.html` (slide-over) | `/admin/sellers?id={sellerId}` |
| Analytics | `admin/admin-analytics.html` | `/admin/analytics` |
| Compliance | `admin/admin-compliance.html` | `/admin/compliance` |

---

## API Calls at Each Step

| Step | API Endpoint | Method | Trigger |
|------|-------------|--------|---------|
| **Sellers Page** | | | |
| Load seller stats | `GET /api/admin/sellers/stats` | GET | Page load |
| Load sellers list | `POST /api/query/admin-sellers` | POST | Page load |
| View seller detail | `GET /api/seller/{id}` | GET | Row click |
| **Review Actions** | | | |
| Review application | `PATCH /api/seller/{id}/reviewSupplier` | PATCH | Review click |
| Approve seller | `PATCH /api/seller/{id}/approveSupplier` | PATCH | Approve click |
| Reject seller | `PATCH /api/seller/{id}/rejectSupplier` | PATCH | Reject click |
| Activate seller | `PATCH /api/seller/{id}/activateSupplier` | PATCH | Activate click |
| **Management Actions** | | | |
| Suspend seller | `PATCH /api/seller/{id}/suspendSupplier` | PATCH | Suspend click |
| Reactivate seller | `PATCH /api/seller/{id}/reactivateSupplier` | PATCH | Reactivate click |
| Put on probation | `PATCH /api/seller/{id}/putOnProbation` | PATCH | Probation click |
| Resolve probation | `PATCH /api/seller/{id}/resolveFromProbation` | PATCH | Resolve click |
| Terminate seller | `PATCH /api/seller/{id}/terminateSupplier` | PATCH | Terminate click |

---

## Decision Points

| Decision | Condition | Path A | Path B |
|----------|-----------|--------|--------|
| Documents complete? | All required docs uploaded | Proceed to KYC | Request missing docs |
| Documents valid? | Admin verification | Pass verification | Reject or request re-upload |
| GSTIN valid? | Automated API check | Valid, continue | "GSTIN invalid or not found" |
| PAN matches business? | Cross-reference | Match confirmed | Mismatch, investigate |
| Bank verified? | Penny drop test | Verified | "Account not verified" |
| Approve or reject? | Overall assessment | Approve + set tier | Reject with reason |
| Performance acceptable? | Metrics within SLA | Continue active | Probation or suspend |
| Seller fixable? | Nature of violations | Probation (warning) | Suspend (temporary ban) |
| Repeat offender? | History of violations | Terminate (permanent) | Probation (second chance) |

---

## Error Paths

| Error | Trigger | User Experience | Recovery |
|-------|---------|----------------|----------|
| Incomplete application | Missing fields | "Cannot review: seller profile incomplete" | Contact seller to complete |
| GSTIN validation failed | External API error | "GSTIN check unavailable. Manual verify required" | Manual verification |
| Penny drop failed | Bank API timeout | "Bank verification pending. Retry in 24h" | Retry later |
| Seller appeals rejection | Post-rejection | Support ticket from seller | Re-review if valid |
| Mass suspension needed | Fraud ring detected | Bulk suspend not available | Suspend one by one |
| Seller data inconsistent | PAN/GSTIN mismatch | Flag for manual review | Deep investigation |

---

## Time Estimates

| Step | Admin Action | Estimated Time |
|------|-------------|---------------|
| Review application overview | Scan seller details | 1-2 minutes |
| Verify each document (6 docs) | Open, check, verify | 5-10 minutes |
| Automated KYC checks | System processing | 10-30 seconds |
| Make approval decision | Review all findings | 1-2 minutes |
| Write approval/rejection note | Type reason | 30-60 seconds |
| **Total per application** | | **8-15 minutes** |
| | | |
| Performance review (existing seller) | Check metrics | 2-5 minutes |
| Suspension decision | Review complaints | 5-10 minutes |
| **Total per moderation action** | | **5-15 minutes** |
| | | |
| **Daily admin workload** | | |
| Process 18 pending applications | At 10 min each | ~3 hours |
| Review 5 flagged sellers | At 10 min each | ~50 minutes |
