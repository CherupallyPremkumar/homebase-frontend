# Admin Compliance — API Contract

## Page: admin-compliance.html

**Note:** Compliance table and document queue use Chenile's `SearchRequest/SearchResponse` pattern via POST. Document moderation actions (approve/reject) use PATCH STM events. Stats use REST GET.

---

## Section 1: Page Header

**Data needed:** None
**API:** No API call needed — static content with Export Report button

---

## Section 2: Stats Cards (4 cards)

**API:** `GET /api/admin/compliance/stats`

**Response:**
```json
{
  "totalSellers": {
    "value": 284
  },
  "fullyCompliant": {
    "value": 198,
    "percentage": 69.7
  },
  "partiallyCompliant": {
    "value": 54,
    "percentage": 19.0
  },
  "nonCompliant": {
    "value": 32,
    "percentage": 11.3,
    "needsAttention": true
  }
}
```

---

## Section 3: Compliance Table (paginated, filterable)

**API:** `POST /api/query/admin-compliance`
**Fetch/XHR name:** `admin-compliance`

**Request (SearchRequest):**
```json
{
  "queryName": "AdminCompliance.sellerCompliance",
  "pageNum": 1,
  "numRowsInPage": 8,
  "sortCriteria": [{ "name": "complianceScore", "ascendingOrder": true }],
  "filters": { "complianceStatus": "", "search": "" }
}
```

**Response:**
```json
{
  "list": [
    {
      "row": {
        "id": "seller-001",
        "storeName": "Rajesh Store",
        "ownerName": "Rajesh Kumar",
        "complianceStatus": "FULLY_COMPLIANT",
        "complianceScore": 100,
        "documents": {
          "gst": { "status": "VERIFIED", "expiryDate": "2027-03-31" },
          "pan": { "status": "VERIFIED", "expiryDate": null },
          "bankAccount": { "status": "VERIFIED", "expiryDate": null },
          "addressProof": { "status": "VERIFIED", "expiryDate": null }
        },
        "lastReviewDate": "2026-03-15T00:00:00Z",
        "issues": []
      }
    },
    {
      "row": {
        "id": "seller-003",
        "storeName": "Meera Crafts",
        "ownerName": "Meera Devi",
        "complianceStatus": "PARTIALLY_COMPLIANT",
        "complianceScore": 75,
        "documents": {
          "gst": { "status": "PENDING", "expiryDate": null },
          "pan": { "status": "VERIFIED", "expiryDate": null },
          "bankAccount": { "status": "VERIFIED", "expiryDate": null },
          "addressProof": { "status": "VERIFIED", "expiryDate": null }
        },
        "lastReviewDate": "2026-03-20T00:00:00Z",
        "issues": ["GST certificate pending submission"]
      }
    },
    {
      "row": {
        "id": "seller-008",
        "storeName": "Quick Mart",
        "ownerName": "Vikram Singh",
        "complianceStatus": "NON_COMPLIANT",
        "complianceScore": 25,
        "documents": {
          "gst": { "status": "EXPIRED", "expiryDate": "2026-01-31" },
          "pan": { "status": "VERIFIED", "expiryDate": null },
          "bankAccount": { "status": "NOT_VERIFIED", "expiryDate": null },
          "addressProof": { "status": "VERIFIED", "expiryDate": null }
        },
        "lastReviewDate": "2026-02-28T00:00:00Z",
        "issues": ["GST certificate expired", "Bank account not verified"]
      }
    }
  ],
  "totalCount": 284,
  "numRowsInPage": 8
}
```

**Note:** Uses Chenile SearchRequest format.

---

## Section 4: Document Review Queue

**API:** `GET /api/admin/compliance/documents?stateId=PENDING&pageSize=5`

**Query Params:**
- `stateId` — `PENDING`, `APPROVED`, `REJECTED`
- `pageSize` — number of documents to fetch
- `documentType` — `GST`, `PAN`, `BANK`, `ADDRESS`

**Response:**
```json
{
  "list": [
    {
      "id": "doc-001",
      "sellerId": "seller-015",
      "sellerName": "Sharma Electronics",
      "documentType": "GST",
      "fileName": "gst_certificate_2026.pdf",
      "uploadedAt": "2026-03-27T14:30:00Z",
      "stateId": "PENDING",
      "fileUrl": "/uploads/documents/doc-001.pdf"
    },
    {
      "id": "doc-002",
      "sellerId": "seller-022",
      "sellerName": "Patel Home Furnishings",
      "documentType": "PAN",
      "fileName": "pan_card_scan.jpg",
      "uploadedAt": "2026-03-27T11:15:00Z",
      "stateId": "PENDING",
      "fileUrl": "/uploads/documents/doc-002.jpg"
    }
  ],
  "totalCount": 12,
  "numRowsInPage": 5
}
```

---

## Section 5: Document Actions

### Approve Document (STM Event)
**API:** `PATCH /api/onboarding/{id}/approve`
**Fetch/XHR name:** `onboarding/{id}/approve`

**Request:**
```json
{
  "notes": "Document verified, all details match"
}
```

**Response:**
```json
{
  "id": "doc-001",
  "stateId": "APPROVED",
  "approvedBy": "admin-001",
  "updatedTime": "2026-03-28T10:30:00Z"
}
```

### Reject Document (STM Event)
**API:** `PATCH /api/onboarding/{id}/reject`
**Fetch/XHR name:** `onboarding/{id}/reject`

**Request:**
```json
{
  "reason": "Document is blurry, please re-upload with clearer image",
  "notifySeller": true
}
```

**Response:**
```json
{
  "id": "doc-002",
  "stateId": "REJECTED",
  "rejectedBy": "admin-001",
  "updatedTime": "2026-03-28T10:35:00Z"
}
```

### Send Compliance Reminder
**API:** `POST /api/admin/compliance/sellers/{id}/remind`

**Request:**
```json
{
  "documents": ["GST", "BANK"],
  "deadline": "2026-04-15",
  "message": "Please submit pending documents by the deadline to avoid account suspension."
}
```

**Response:**
```json
{
  "sellerId": "seller-008",
  "reminderSent": true,
  "sentAt": "2026-03-28T10:40:00Z"
}
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Page Header | None (static) | — | — |
| 2 | Stats Cards | `/api/admin/compliance/stats` | GET | 30s |
| 3 | Compliance Table | `/api/query/admin-compliance` | POST (Chenile Query) | 30s |
| 4 | Document Queue | `/api/query/admin-compliance` (with stateId=PENDING filter) | POST (Chenile Query) | 15s |
| 5a | Approve Document | `/api/onboarding/{id}/approve` | PATCH (STM Event) | — |
| 5b | Reject Document | `/api/onboarding/{id}/reject` | PATCH (STM Event) | — |
| 5c | Send Reminder | `/api/admin/compliance/sellers/{id}/remind` | POST | — |

**Total API calls on page load: 3 (parallel)**
**Total admin action endpoints: 3**

---

## Frontend Integration Pattern

```typescript
export default async function AdminCompliance() {
  const [stats, sellers, documentQueue] = await Promise.allSettled([
    adminApi.complianceStats(),
    adminApi.complianceSellers({ pageSize: 8, sortBy: 'complianceScore', sortOrder: 'asc' }),
    adminApi.complianceDocuments({ stateId: 'PENDING', pageSize: 5 }),
  ]);

  return (
    <>
      <PageHeader />
      <StatsCards data={stats} />
      <ComplianceTable data={sellers} />
      <DocumentReviewQueue data={documentQueue} />
    </>
  );
}
```

---

## New Endpoints Needed

1. `GET /api/admin/compliance/stats` — compliance status breakdown
2. `GET /api/admin/compliance/sellers` — seller compliance listing
3. `GET /api/admin/compliance/documents` — document review queue
4. `PUT /api/admin/compliance/documents/{id}/approve` — approve document
5. `PUT /api/admin/compliance/documents/{id}/reject` — reject document
6. `POST /api/admin/compliance/sellers/{id}/remind` — send compliance reminder

---

## Allowed Actions -> UI Mapping

The backend returns `allowedActions` per row based on the entity's current state (STM).
The frontend reads these and renders only the allowed buttons.

**STM Source (Onboarding):** `onboarding-states.xml` (onboarding-flow)
**STM Source (Agreement):** `agreement-states.xml` (agreement flow)
**Admin ACL filter:** Events with `ADMIN`, `COMPLIANCE`, or `LEGAL_ADMIN` in `meta-acls`.

### Onboarding: State -> Allowed Actions -> UI Buttons

| State | allowedActions (admin-visible) | UI Button | Icon | Color | Event ID |
|-------|------------------------------|-----------|------|-------|----------|
| APPLICATION_SUBMITTED | verifyDocuments | Verify Documents | FileCheck | blue | verifyDocuments |
| APPLICATION_SUBMITTED | reject | Reject Application | XCircle | red | reject |
| DOCUMENT_VERIFICATION | verifyBusiness | Verify Business | Building | blue | verifyBusiness |
| DOCUMENT_VERIFICATION | requestDocuments | Request Documents | FileQuestion | amber | requestDocuments |
| DOCUMENT_VERIFICATION | reject | Reject | XCircle | red | reject |
| DOCUMENTS_REQUESTED | -- | (read-only, awaiting seller) | -- | -- | -- |
| BUSINESS_VERIFICATION | reject | Reject | XCircle | red | reject |
| TRAINING | reject | Reject | XCircle | red | reject |
| ONBOARDED | -- | (read-only, awaiting activation) | -- | -- | -- |
| COMPLETED | -- | (read-only, terminal) | -- | -- | -- |
| REJECTED | -- | (read-only, terminal) | -- | -- | -- |

### Agreement: State -> Allowed Actions -> UI Buttons

| State | allowedActions (admin-visible) | UI Button | Icon | Color | Event ID |
|-------|------------------------------|-----------|------|-------|----------|
| DRAFT | publish | Publish Agreement | Globe | green | publish |
| PUBLISHED | supersede | Supersede | ArrowUpCircle | blue | supersede |
| PUBLISHED | suspend | Suspend | PauseCircle | amber | suspend |
| PUBLISHED | retire | Retire | Archive | gray | retire |
| SUSPENDED | reinstate | Reinstate | PlayCircle | green | reinstate |
| SUSPENDED | retire | Retire | Archive | gray | retire |
| SUPERSEDED | -- | (read-only, terminal) | -- | -- | -- |
| RETIRED | -- | (read-only, terminal) | -- | -- | -- |

### Frontend Pattern

```typescript
const ADMIN_COMPLIANCE_ACTION_CONFIG: Record<string, ActionButtonConfig> = {
  // Onboarding actions
  verifyDocuments: { label: 'Verify Documents', icon: 'FileCheck', color: 'blue' },
  verifyBusiness: { label: 'Verify Business', icon: 'Building', color: 'blue' },
  requestDocuments: { label: 'Request Documents', icon: 'FileQuestion', color: 'amber' },
  reject: { label: 'Reject', icon: 'XCircle', color: 'red' },
  // Agreement actions
  publish: { label: 'Publish', icon: 'Globe', color: 'green' },
  supersede: { label: 'Supersede', icon: 'ArrowUpCircle', color: 'blue' },
  suspend: { label: 'Suspend', icon: 'PauseCircle', color: 'amber' },
  reinstate: { label: 'Reinstate', icon: 'PlayCircle', color: 'green' },
  retire: { label: 'Retire', icon: 'Archive', color: 'gray' },
};

// Render only allowed actions
{allowedActions.map(a => {
  const config = ADMIN_COMPLIANCE_ACTION_CONFIG[a.allowedAction];
  return config ? <ActionButton {...config} onClick={() => triggerEvent(id, a.allowedAction)} /> : null;
})}
```
