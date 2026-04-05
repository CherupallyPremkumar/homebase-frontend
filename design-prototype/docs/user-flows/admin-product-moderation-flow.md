# Admin Product Moderation Flow

Product review, approval, flagging, and removal workflow for marketplace quality control.

---

## Flow Overview

```
+------------+     +----------+     +----------+     +----------+
| New Product|---->| Auto-    |---->| Manual   |---->| Approve/ |
| Submitted  |     | Check    |     | Review   |     | Flag/    |
|            |     |          |     |          |     | Reject   |
+------------+     +----------+     +----------+     +----------+

+------------+     +----------+     +----------+
| Flagged    |---->| Review   |---->| Approve/ |
| Product    |     | Issue    |     | Remove   |
+------------+     +----------+     +----------+
```

---

## Detailed Flow Diagram

### New Product Moderation

```
    [START]
       |
       v
+=========================+
| NEW PRODUCT SUBMITTED   |
| (State: UNDER_REVIEW)   |
|                         |
| admin-products.html     |
| Stats: pendingReview: 45|
+=========================+
       |
       v
+===========================+
| PHASE 1: AUTOMATED CHECKS |
| (System)                   |
+===========================+
       |
       v
+----------------------------+
| AUTO-CHECK PIPELINE         |
|                             |
| 1. Prohibited Items Check   |
|    - Banned keywords scan   |
|    - Restricted category    |
|    Result: [PASS/FAIL]      |
|                             |
| 2. Image Quality Check      |
|    - Min resolution         |
|    - No watermarks          |
|    - No text overlays       |
|    Result: [PASS/WARN]      |
|                             |
| 3. Pricing Sanity Check     |
|    - Price > 0              |
|    - Compare price > price  |
|    - Not absurdly high/low  |
|    Result: [PASS/WARN]      |
|                             |
| 4. Description Quality      |
|    - Min length (50 chars)  |
|    - No HTML injection      |
|    - No contact info        |
|    Result: [PASS/WARN]      |
|                             |
| 5. Duplicate Detection      |
|    - SKU uniqueness         |
|    - Image similarity       |
|    - Title similarity       |
|    Result: [PASS/FLAG]      |
+----------------------------+
       |
       +------+--------+
       |               |
       v               v
+----------+    +-------------+
| ALL PASS |    | WARNINGS or |
| (auto-   |    | FLAGS found |
| approve  |    | (needs      |
| eligible)|    | manual      |
|          |    | review)     |
+----------+    +-------------+
       |               |
       v               v
  +---------+   +================+
  | Fast-   |   | MANUAL REVIEW  |
  | track   |   | QUEUE          |
  | to      |   +================+
  | manual  |          |
  | review  |          v
  +---------+   +--------------+
       |        | Admin opens  |
       |        | product      |
       +--------+ detail       |
                +--------------+
                       |
                       v
+=========================+
| PHASE 2: MANUAL REVIEW  |
| admin-products.html     |
| (Product detail panel)  |
+=========================+
       |
       v
+----------------------------+
| REVIEW CHECKLIST            |
|                             |
| Product: Cordless Power     |
|          Drill Set          |
| Seller:  ToolMaster Pro     |
| Price:   INR 18,999         |
| Category: Tools             |
|                             |
| == Images ==                |
| [img1] [img2] [img3]       |
| Quality: OK                 |
| Relevant: YES               |
|                             |
| == Title & Description ==   |
| Accurate:    [x] Yes        |
| Misleading:  [ ] No         |
| Specs match: [x] Yes        |
|                             |
| == Pricing ==               |
| Reasonable:  [x] Yes        |
| Inflated:    [ ] No         |
| Compare valid: [x] Yes      |
|                             |
| == Category ==              |
| Correct cat:  [x] Yes       |
| Correct sub:  [x] Yes       |
|                             |
| == Compliance ==            |
| Safety cert needed: [x] Yes |
| Cert uploaded:      [x] Yes |
| Age restriction:    [ ] No  |
|                             |
| == Auto-Check Results ==    |
| Prohibited: PASS             |
| Images:     PASS             |
| Pricing:    PASS             |
| Description: PASS            |
| Duplicate:  PASS             |
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
| APPROVE   |   | FLAG    | | REJECT   |
|           |   |         | |          |
| PATCH     |   | PATCH   | | PATCH    |
| /product/ |   | /product| | /product/|
| {id}/     |   | /{id}/  | | {id}/    |
| approve   |   | flag    | | reject   |
| Product   |   |         | | Product  |
|           |   |         | |          |
| {reason:  |   |{reason: | | {reason: |
| "Meets    |   |"Mislead-| | "Incom-  |
| listing   |   |ing desc"| | plete    |
| guide-    |   |flagType:| | specs"}  |
| lines"}   |   |"MISLEAD"| |          |
|           |   | }       | |          |
+-----------+   +---------+ +----------+
       |              |            |
       v              v            v
+-----------+  +-----------+ +-----------+
| PUBLISHED |  | FLAGGED   | | REJECTED  |
| (Live on  |  | (Hidden   | |           |
| store)    |  | from      | | Seller    |
|           |  | store,    | | notified: |
| Seller    |  | under     | | "Product  |
| notified: |  | investig- | | rejected. |
| "Product  |  | ation)    | | Reason:   |
| approved!"|  |           | | [reason]" |
+-----------+  +-----------+ +-----------+
                    |
                    v
            (see Flagged
             Review below)
```

---

### Flagged Product Review

```
+=========================+
| FLAGGED PRODUCT         |
| (State: FLAGGED or      |
|  DISABLED)              |
|                         |
| Trigger:                |
| - Admin flags during    |
|   routine check         |
| - Customer reports      |
| - Automated detection   |
| - Seller complaint      |
+=========================+
       |
       v
+----------------------------+
| FLAG TYPES                  |
|                             |
| MISLEADING_DESCRIPTION      |
| COUNTERFEIT_SUSPECTED       |
| PRICING_MANIPULATION        |
| PROHIBITED_ITEM             |
| SAFETY_CONCERN              |
| IP_VIOLATION                |
| DUPLICATE_LISTING           |
| INAPPROPRIATE_CONTENT       |
+----------------------------+
       |
       v
+----------------------------+
| FLAGGED REVIEW QUEUE        |
| admin-products.html         |
| Filter: status = FLAGGED    |
|                             |
| Stats: flagged: 12          |
|        dailyChange: +3      |
+----------------------------+
       |
       v
+----------------------------+
| ADMIN REVIEWS FLAGGED       |
| PRODUCT                     |
|                             |
| Product:  [Product Name]    |
| Seller:   [Seller Name]     |
| Flag:     MISLEADING_DESC   |
| Flagged:  2026-03-28        |
| By:       admin-002         |
|                             |
| Original Description:       |
| "Premium genuine leather    |
|  wallet..."                 |
|                             |
| Issue:                      |
| "Product is synthetic       |
|  leather, not genuine"      |
+----------------------------+
       |
       v
+----------------------------+
| ADMIN DECISION              |
+----------------------------+
       |
       +------+--------+
       |               |
       v               v
+-----------+   +-----------+
| APPROVE   |   | REMOVE    |
| (Unflag)  |   |           |
|           |   | PATCH     |
| PATCH     |   | /product/ |
| /product/ |   | {id}/     |
| {id}/     |   | remove    |
| enable    |   |           |
| Product   |   | {reason:  |
|           |   | "Violates |
| {reason:  |   | policy",  |
| "False    |   | notify    |
| alarm,    |   | Seller:   |
| product   |   | true}     |
| verified"}|   |           |
+-----------+   +-----------+
       |               |
       v               v
+-----------+   +-----------+
| PUBLISHED |   | REMOVED   |
| (Restored |   | (Hidden   |
| to store) |   | permanent)|
|           |   |           |
| Seller    |   | Seller    |
| notified: |   | notified: |
| "Product  |   | "Product  |
| restored" |   | removed.  |
|           |   | Reason:   |
|           |   | [reason]" |
+-----------+   +-----------+
                      |
                      v
               +-------------+
               | Seller      |
               | Performance |
               | Impact:     |
               | -1 violation|
               | warning     |
               +-------------+
```

---

### Product Update Moderation

```
+=========================+
| SELLER REQUESTS UPDATE  |
| (State: PENDING_UPDATE) |
+=========================+
       |
       v
+----------------------------+
| UPDATE REVIEW               |
|                             |
| Current Version:            |
| Name: "Product ABC"         |
| Price: INR 4,999            |
| Desc: "Original desc..."    |
|                             |
| Proposed Changes:            |
| Name: "Product ABC Pro"     |
| Price: INR 5,499 (+10%)     |
| Desc: "Updated desc..."     |
|                             |
| [Diff View]                 |
+----------------------------+
       |
       +------+--------+
       |               |
       v               v
+-----------+   +-----------+
| APPROVE   |   | REJECT    |
| UPDATE    |   | UPDATE    |
|           |   |           |
| approve   |   | reject    |
| Update    |   | Update    |
|           |   |           |
| Product   |   | Product   |
| updated   |   | stays at  |
| to new    |   | current   |
| version   |   | version   |
+-----------+   +-----------+
```

---

## Product State Machine (Admin View)

```
DRAFT ----> UNDER_REVIEW ----> PUBLISHED
  |              |     |            |
  v              v     v       +----+----+----+
DELETED     APPROVED REJECTED |    |    |    |
                              v    v    v    v
                          DISABLED ARC  REC  DISC
                           |  | |   |   |    |
                           v  v v   v   v    v
                          Ena Arc Rec UnA Rec [TERM]
                           |   |  |   |   |
                           v   v  v   v   v
                          PUB ARC REC PUB REC

PENDING_UPDATE ----> PUBLISHED (approved)
       |                  or
       +-----------> PUBLISHED (rejected, unchanged)

FLAGGED (during PUBLISHED) ----> PUBLISHED (unflagged)
       |                              or
       +--------------------------> REMOVED
```

Admin-visible STM actions:

| State | Admin Actions |
|-------|--------------|
| DRAFT | Delete Product |
| UNDER_REVIEW | Approve Product, Reject Product |
| PUBLISHED | Disable, Archive, Recall, Discontinue |
| PENDING_UPDATE | Approve Update, Reject Update |
| DISABLED | Enable, Archive, Recall, Discontinue |
| ARCHIVED | Unarchive, Recall, Discontinue |
| RECALLED | Resolve Recall |
| DISCONTINUED | (terminal) |

---

## Page References

| Step | Prototype Page | URL Path |
|------|---------------|----------|
| Products Dashboard | `admin/admin-products.html` | `/admin/products` |
| Product Detail | `admin/admin-products.html` (slide-over) | `/admin/products?id={productId}` |
| Reviews Management | `admin/admin-reviews.html` | `/admin/reviews` |
| Compliance | `admin/admin-compliance.html` | `/admin/compliance` |

---

## API Calls at Each Step

| Step | API Endpoint | Method | Trigger |
|------|-------------|--------|---------|
| **Products Page** | | | |
| Load product stats | `GET /api/admin/products/stats` | GET | Page load |
| Load products list | `POST /api/query/admin-products` | POST | Page load |
| **Moderation Actions** | | | |
| Approve product | `PATCH /api/product/{id}/approveProduct` | PATCH | Approve click |
| Reject product | `PATCH /api/product/{id}/rejectProduct` | PATCH | Reject click |
| Flag product | `PATCH /api/product/{id}/flag` | PATCH | Flag click |
| Remove product | `PATCH /api/product/{id}/remove` | PATCH | Remove click |
| Disable product | `PATCH /api/product/{id}/disableProduct` | PATCH | Disable click |
| Enable product | `PATCH /api/product/{id}/enableProduct` | PATCH | Enable click |
| Archive product | `PATCH /api/product/{id}/archiveProduct` | PATCH | Archive click |
| Unarchive product | `PATCH /api/product/{id}/unarchiveProduct` | PATCH | Unarchive click |
| Recall product | `PATCH /api/product/{id}/recallProduct` | PATCH | Recall click |
| Resolve recall | `PATCH /api/product/{id}/resolveRecall` | PATCH | Resolve click |
| Discontinue product | `PATCH /api/product/{id}/discontinueProduct` | PATCH | Discontinue click |
| **Update Moderation** | | | |
| Approve update | `PATCH /api/product/{id}/approveUpdate` | PATCH | Approve click |
| Reject update | `PATCH /api/product/{id}/rejectUpdate` | PATCH | Reject click |

---

## Decision Points

| Decision | Condition | Path A | Path B |
|----------|-----------|--------|--------|
| Auto-checks pass? | All checks PASS | Fast-track to manual review | Queue with warnings |
| Prohibited item? | Keyword/category match | Auto-reject | Continue review |
| Images acceptable? | Quality + relevance | Pass | Request better images |
| Description accurate? | Manual verification | Pass | Flag or reject |
| Pricing reasonable? | Within category norms | Pass | Flag for investigation |
| Duplicate listing? | Similarity > threshold | Flag for review | Pass |
| Safety cert needed? | Category requires it | Check cert uploaded | N/A for category |
| Flag valid? | Investigation confirms | Remove product | Unflag (restore) |
| Update acceptable? | Changes within policy | Approve update | Reject update |

---

## Error Paths

| Error | Trigger | User Experience | Recovery |
|-------|---------|----------------|----------|
| Product has active orders | Attempt to remove | "Cannot remove: 5 active orders pending" | Wait for orders to complete |
| Seller appeals removal | Post-removal | Support ticket from seller | Admin re-review |
| Mass flagging (spam) | Competitor reports | Flag threshold filter | Investigate reporter |
| Auto-check false positive | Keyword match on valid product | Product stuck in queue | Manual override |
| Update breaks existing orders | Price change on ordered item | "Price locked for pending orders" | Update applies to new orders only |

---

## Time Estimates

| Step | Admin Action | Estimated Time |
|------|-------------|---------------|
| **New Product Review** | | |
| Open product detail | Load and scan | 15-30 seconds |
| Check images (3-5 images) | View each | 30-60 seconds |
| Read title + description | Verify accuracy | 30-60 seconds |
| Check pricing | Compare with similar | 15-30 seconds |
| Verify category | Correct placement | 10 seconds |
| Check compliance | Safety certs | 15-30 seconds |
| Write decision note | Type reason | 15-30 seconds |
| **Total per product** | | **2-4 minutes** |
| | | |
| **Flagged Product Review** | | |
| Review flag details | Read report | 30-60 seconds |
| Investigate issue | Compare evidence | 2-5 minutes |
| Make decision | Approve or remove | 30 seconds |
| **Total per flag** | | **3-7 minutes** |
| | | |
| **Daily admin workload** | | |
| Review 45 pending products | At 3 min each | ~2.5 hours |
| Review 12 flagged products | At 5 min each | ~1 hour |
| Review 3 update requests | At 2 min each | ~6 minutes |
