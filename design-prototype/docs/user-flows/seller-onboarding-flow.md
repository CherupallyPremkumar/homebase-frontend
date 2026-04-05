# Seller Onboarding Flow

New seller journey from registration to first product going live.

---

## Flow Overview

```
+----------+     +-----------+     +----------+     +----------+
| Register |---->| Business  |---->| KYC      |---->| Bank     |
|          |     | Details   |     | Documents|     | Details  |
+----------+     +-----------+     +----------+     +----------+
                                                         |
                                                         v
+----------+     +-----------+     +----------+     +----------+
| LIVE     |<----| First     |<----| Approved |<----| Admin    |
| Store    |     | Product   |     |          |     | Review   |
+----------+     +-----------+     +----------+     +----------+
```

---

## Detailed Flow Diagram

```
    [START]
       |
       v
+===========================+
| SELLER REGISTRATION       |
| (Separate seller portal)  |
+===========================+
       |
       v
+----------------------------+
| STEP 1: PERSONAL INFO      |
| seller-profile.html        |
|                             |
| Full Name:    [___________] |
| Email:        [___________] |
| Phone:        [___________] |
| Password:     [___________] |
|                             |
| [Continue]                  |
+----------------------------+
       |
       v
+----------------------------+
| STEP 2: BUSINESS DETAILS   |
| seller-profile.html        |
|                             |
| Store Name:   [___________] |
| Business Type:              |
| ( ) Sole Proprietorship     |
| ( ) Partnership             |
| ( ) Pvt Ltd Company         |
|                             |
| GSTIN:       [22AAAAA0000A] |
| PAN Number:  [ABCDE1234F]   |
|                             |
| Business Address:           |
| [_________________________] |
|                             |
| Store Description:          |
| [_________________________] |
|                             |
| Categories:                 |
| [x] Electronics             |
| [x] Fashion                 |
| [ ] Home & Living           |
|                             |
| [Continue]                  |
+----------------------------+
       |
       v
+===========================+
| STEP 3: KYC DOCUMENTS     |
| seller-documents.html     |
+===========================+
       |
       v
+----------------------------+
| REQUIRED DOCUMENTS         |
|                             |
| GST Certificate     [    ] |
|   Status: NOT_UPLOADED      |
|   [+ Upload]               |
|                             |
| PAN Card             [    ] |
|   Status: NOT_UPLOADED      |
|   [+ Upload]               |
|                             |
| Business License     [    ] |
|   Status: NOT_UPLOADED      |
|   [+ Upload]               |
|                             |
| Cancelled Cheque     [    ] |
|   Status: NOT_UPLOADED      |
|   [+ Upload]               |
|                             |
| Address Proof        [    ] |
|   Status: NOT_UPLOADED      |
|   [+ Upload]               |
|                             |
| Identity Proof       [    ] |
|   Status: NOT_UPLOADED      |
|   [+ Upload]               |
|                             |
| Compliance: 0% complete     |
|                             |
| [Continue]                  |
+----------------------------+
       |
       | Upload each document
       v
+----------------------------+
| DOCUMENT UPLOAD PROCESS     |
|                             |
| For each document:          |
|                             |
| 1. Click [+ Upload]        |
| 2. Select PDF/JPG file     |
| 3. POST /api/onboarding/   |
|    document                 |
| 4. Status: PENDING          |
|                             |
| After all uploaded:         |
| Compliance: 100% uploaded   |
| (Verification pending)      |
+----------------------------+
       |
       v
+----------------------------+
| STEP 4: BANK DETAILS       |
| seller-profile.html        |
|                             |
| Account Holder: [_________] |
| Bank Name:      [_________] |
| Account Number: [_________] |
| IFSC Code:      [_________] |
| Branch Name:    [_________] |
| Account Type:               |
| ( ) Current                 |
| ( ) Savings                 |
|                             |
| [Submit for Review]         |
+----------------------------+
       |
       v
+----------------------------+
| VERIFICATION MESSAGE        |
|                             |
| "Bank details submitted.    |
|  Verification will be       |
|  completed within 24-48     |
|  hours."                    |
+----------------------------+
       |
       v
+================================+
| APPLICATION SUBMITTED          |
| (State: APPLICATION_SUBMITTED) |
+================================+
       |
       v (Admin begins review)
+----------------------------+
| ADMIN REVIEW PROCESS        |
| (admin-sellers.html)        |
|                             |
| 1. Document Verification    |
|    (State: DOCUMENT_        |
|     VERIFICATION)           |
|                             |
|    +------+--------+        |
|    |               |        |
|    v               v        |
| Docs OK?      Docs Missing? |
|    |               |        |
|    |               v        |
|    |    +-------------------+|
|    |    |DOCUMENTS_REQUESTED||
|    |    |Seller must        ||
|    |    |resubmit           ||
|    |    +-------------------+|
|    |          |              |
|    |          v              |
|    |    Seller resubmits     |
|    |    (resubmitDocuments)  |
|    |          |              |
|    +----------+              |
|    |                         |
|    v                         |
| 2. Business Verification    |
|    (State: BUSINESS_        |
|     VERIFICATION)           |
|    - GSTIN validation       |
|    - PAN verification       |
|    - Bank account check     |
|                             |
| 3. Final Decision           |
+----------------------------+
       |
       +-------+--------+
       |                |
       v                v
+-----------+    +-----------+
| APPROVED  |    | REJECTED  |
| (State:   |    | (State:   |
| APPROVED) |    | REJECTED) |
+-----------+    +-----------+
       |                |
       |                v
       |         +-----------+
       |         | "Application
       |         | rejected.
       |         | Reason:
       |         | Incomplete
       |         | documents"
       |         |
       |         | [Reapply]
       |         +-----------+
       |
       v
+----------------------------+
| TRAINING (Optional)         |
| (State: TRAINING)           |
|                             |
| Platform guidelines         |
| Listing best practices      |
| Shipping requirements       |
|                             |
| [Complete Training]         |
+----------------------------+
       |
       v
+----------------------------+
| ONBOARDED                   |
| (State: ONBOARDED)          |
|                             |
| Account activated!          |
| seller-dashboard.html       |
+----------------------------+
       |
       v
+===========================+
| FIRST PRODUCT LISTING     |
| seller-add-product.html   |
+===========================+
       |
       v
+----------------------------+
| CREATE PRODUCT              |
|                             |
| Product Name:  [__________] |
| Category:      [__________] |
| Price:         [__________] |
| Stock:         [__________] |
| Images:        [+ Upload]   |
| Description:   [__________] |
|                             |
| [Save as Draft]             |
| [Submit for Review]         |
+----------------------------+
       |
       +-------+--------+
       |                |
       v                v
  +---------+    +-----------+
  | DRAFT   |    | UNDER_    |
  | (saved) |    | REVIEW    |
  +---------+    | (submitted|
       |         | to admin) |
       |         +-----------+
       |              |
       |              v (Admin reviews)
       |         +-----------+
       |         | PUBLISHED |
       |         | Product   |
       |         | is live!  |
       |         +-----------+
       |              |
       +--------------+
              |
              v
+----------------------------+
| STORE IS LIVE              |
| seller-dashboard.html      |
|                             |
| - Products: 1 active       |
| - Store visible on         |
|   marketplace              |
| - Ready for orders         |
+----------------------------+
              |
              v
           [END]
```

---

## Onboarding State Machine (STM)

```
APPLICATION_SUBMITTED
       |
       v
DOCUMENT_VERIFICATION ----> DOCUMENTS_REQUESTED
       |                           |
       v                           | (resubmitDocuments)
BUSINESS_VERIFICATION <------------+
       |
       +------+--------+
       |               |
       v               v
   APPROVED        REJECTED
       |
       v
   TRAINING
       |
       v (completeTraining)
   ONBOARDED
       |
       v
   COMPLETED
```

---

## Page References

| Step | Prototype Page | URL Path |
|------|---------------|----------|
| Registration | `seller/seller-profile.html` | `/seller/register` |
| Business Details | `seller/seller-profile.html` | `/seller/profile` |
| KYC Documents | `seller/seller-documents.html` | `/seller/documents` |
| Bank Details | `seller/seller-profile.html` | `/seller/profile#bank` |
| Dashboard | `seller/seller-dashboard.html` | `/seller/dashboard` |
| Add Product | `seller/seller-add-product.html` | `/seller/products/new` |
| Products List | `seller/seller-products.html` | `/seller/products` |
| Store Settings | `seller/seller-store-settings.html` | `/seller/settings/store` |
| Admin Onboarding Queue | `admin/admin-onboarding.html` | `/admin/onboarding` |
| Admin Onboarding Detail | `admin/admin-onboarding-detail.html` | `/admin/onboarding/{{sellerId}}` |

---

## Admin Onboarding Page

The admin onboarding page (`admin/admin-onboarding.html`) provides a dedicated queue for managing seller applications. This supplements the existing admin review process described above.

### Admin Onboarding Queue View

```
+-------------------------------------------+
| SELLER ONBOARDING QUEUE                   |
| admin-onboarding.html                     |
|                                           |
| Filters:                                  |
| [All] [Pending] [Under Review] [Approved] |
| [Rejected] [Documents Requested]          |
|                                           |
| Search: [_________________] [Search]      |
|                                           |
| +-------+----------+--------+----------+  |
| | Name  | Status   | Date   | Action   |  |
| +-------+----------+--------+----------+  |
| | Acme  | PENDING  | Mar 25 | [Review] |  |
| | Beta  | DOCS_REQ | Mar 24 | [Review] |  |
| | Gamma | APPROVED | Mar 23 | [View]   |  |
| +-------+----------+--------+----------+  |
|                                           |
| Bulk Actions:                             |
| [Send Reminder to Pending]               |
+-------------------------------------------+
```

### Admin Onboarding Detail View

```
+-------------------------------------------+
| SELLER APPLICATION: {{sellerName}}        |
| admin-onboarding-detail.html              |
|                                           |
| Status: {{currentState}}                  |
| Applied: {{applicationDate}}              |
|                                           |
| --- Personal Info ---                     |
| Name:    {{name}}                         |
| Email:   {{email}}                        |
| Phone:   {{phone}}                        |
|                                           |
| --- Business Details ---                  |
| Store:   {{storeName}}                    |
| Type:    {{businessType}}                 |
| GSTIN:   {{gstin}}                        |
| PAN:     {{pan}}                          |
|                                           |
| --- Documents ---                         |
| GST Certificate:  [View] Verified / Pending |
| PAN Card:         [View] Verified / Pending |
| Business License: [View] Verified / Pending |
| Cancelled Cheque: [View] Verified / Pending |
| Address Proof:    [View] Verified / Pending |
| Identity Proof:   [View] Verified / Pending |
|                                           |
| --- Bank Details ---                      |
| Bank:    {{bankName}}                     |
| Account: ****{{last4}}                    |
| IFSC:    {{ifsc}}                         |
| Penny drop: Verified / Pending / Failed   |
|                                           |
| --- Admin Actions ---                     |
| [Approve Seller]                          |
| [Reject Seller]                           |
| [Request Documents]                       |
| [Send Reminder]                           |
|                                           |
| Admin Notes:                              |
| [_________________________]               |
| [Save Note]                               |
+-------------------------------------------+
```

### Admin Onboarding Actions

| Action | API Call | Toast Message |
|--------|---------|---------------|
| Approve seller | `PATCH /api/onboarding/{{id}}/approve` | "Seller approved" |
| Reject seller | `PATCH /api/onboarding/{{id}}/reject` | "Seller rejected" |
| Request documents | `PATCH /api/onboarding/{{id}}/requestDocuments` | "Documents requested" |
| Send reminder | `POST /api/onboarding/{{id}}/reminder` | "Document reminder sent" |
| Save admin note | `POST /api/onboarding/{{id}}/note` | "Note saved" |

---

## API Calls at Each Step

| Step | API Endpoint | Method | Trigger |
|------|-------------|--------|---------|
| **Registration** | | | |
| Create seller account | `POST /api/auth/register` (seller role) | POST | Form submit |
| **Profile Setup** | | | |
| Update personal info | `PUT /api/seller/profile/personal` | PUT | Save click |
| Update business info | `PUT /api/seller/profile/business` | PUT | Save click |
| Upload avatar | `POST /api/seller/profile/avatar` | POST | File select |
| **KYC Documents** | | | |
| Load compliance status | `GET /api/seller/documents/compliance` | GET | Page load |
| Upload document | `POST /api/onboarding/document` | POST | Upload click |
| Delete document | `PATCH /api/onboarding/{id}/delete` | PATCH | Delete click |
| Download document | `GET /api/onboarding/{id}/download` | GET | Download click |
| List documents | `POST /api/query/seller-documents` | POST | Page load |
| Resubmit documents | `PATCH /api/onboarding/{id}/resubmitDocuments` | PATCH | Resubmit click |
| **Bank Details** | | | |
| Update bank details | `PUT /api/seller/profile/bank` | PUT | Submit click |
| **Training** | | | |
| Complete training | `PATCH /api/onboarding/{id}/completeTraining` | PATCH | Complete click |
| **First Product** | | | |
| Load categories | `GET /api/catalog/categories` | GET | Page load |
| Upload product images | `POST /api/product/media` | POST | File select |
| Create product (draft) | `POST /api/product` (status: DRAFT) | POST | Save Draft |
| Submit for review | `PATCH /api/product/{id}/submitForReview` | PATCH | Submit click |

---

## Decision Points

| Decision | Condition | Path A | Path B |
|----------|-----------|--------|--------|
| Business type? | Legal entity structure | Sole Prop (simple docs) | Company (more docs) |
| All docs uploaded? | Compliance 100% | Proceed to bank | Block with checklist |
| GSTIN valid? | Backend validation | Continue | "Invalid GSTIN format" |
| PAN matches? | PAN vs business name | Continue | "PAN does not match" |
| Bank verified? | Penny drop test | Verified (24-48h) | "Verification failed" |
| Docs approved? | Admin review | APPROVED state | DOCUMENTS_REQUESTED |
| Application approved? | Admin decision | Onboarded | Rejected with reason |
| First product approved? | Admin moderation | PUBLISHED (live) | Feedback for fixes |

---

## Error Paths

| Error | Trigger | User Experience | Recovery |
|-------|---------|----------------|----------|
| GSTIN invalid format | Business details | "Invalid GSTIN format" inline | Correct and retry |
| PAN mismatch | Business details | "PAN number does not match records" | Verify and correct |
| Document upload failed | File too large (>10MB) | "File too large. Max 10MB" | Compress and retry |
| Document rejected | Admin review | "Document rejected: Unreadable scan" | Re-upload clearer copy |
| Bank verification failed | Penny drop test | "Account could not be verified" | Check details and retry |
| Application rejected | Admin decision | Email + dashboard notification | Reapply after fixing issues |
| Product rejected | Admin moderation | "Product listing needs changes" | Edit and resubmit |
| Duplicate store name | Business details | "Store name already taken" | Choose different name |

---

## Time Estimates

| Step | User Action | Estimated Time |
|------|------------|---------------|
| **Seller-Side Actions** | | |
| Registration (personal info) | Fill form | 2-3 minutes |
| Business details | GSTIN, PAN, address | 3-5 minutes |
| Upload KYC documents (6 docs) | Scan/photo + upload each | 10-20 minutes |
| Bank details | Enter account info | 2-3 minutes |
| Complete training | Read guidelines | 10-15 minutes |
| First product listing | Fill all fields + images | 15-30 minutes |
| **Total seller effort** | | **45-75 minutes** |
| | | |
| **Admin/System Processing** | | |
| Document verification | Admin review | 1-2 business days |
| Business verification | GSTIN + PAN check | 1-2 business days |
| Bank verification | Penny drop test | 24-48 hours |
| Application approval | Final admin decision | 1 business day |
| Product moderation | Admin review | 1-24 hours |
| **Total end-to-end** | | **3-7 business days** |

---

## Onboarding Completion Checklist

```
Profile Completion: 85%
============================

[x] Personal Information     (Required)
[x] Business Details         (Required)
[x] GST Certificate          (Required)
[x] PAN Card                 (Required)
[ ] Business License         (Required - EXPIRED)
[x] Cancelled Cheque         (Required)
[ ] Address Proof            (Required - PENDING)
[ ] Identity Proof           (Required - NOT UPLOADED)
[x] Bank Details             (Required)
[x] Store Description        (Required)
[ ] Return Policy            (Optional)
```
