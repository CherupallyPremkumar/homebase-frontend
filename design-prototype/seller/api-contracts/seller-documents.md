# Seller Documents — API Contract

## Page: seller-documents.html

**Note:** Document list uses Chenile's `SearchRequest/SearchResponse` pattern via POST. Upload/delete use standard REST. Compliance status uses REST GET.

---

## Section 1: Document List (with category tabs — Chenile Query)

**Description:** List of uploaded business documents with verification status, filterable by category tabs
**API:** `POST /api/query/seller-documents`
**Fetch/XHR name:** `seller-documents`

**Request (SearchRequest):**
```json
{
  "queryName": "SellerOnboarding.documents",
  "pageNum": 1,
  "numRowsInPage": 20,
  "sortCriteria": [
    { "name": "uploadedAt", "ascendingOrder": false }
  ],
  "filters": {
    "category": "ALL",
    "status": "ALL"
  }
}
```

**Response (GenericResponse<SearchResponse>):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "list": [
      {
        "row": {
          "id": "doc-001",
          "name": "GST Registration Certificate",
          "category": "TAX",
          "type": "GST_CERTIFICATE",
          "fileName": "gst-certificate.pdf",
          "fileUrl": "/uploads/documents/gst-certificate.pdf",
          "fileSize": 245760,
          "stateId": "VERIFIED",
          "verifiedAt": "2026-01-15T10:00:00Z",
          "expiryDate": "2027-03-31",
          "uploadedAt": "2026-01-10T14:00:00Z"
        },
        "allowedActions": [
          { "allowedAction": "delete", "acls": "SELLER" },
          { "allowedAction": "download", "acls": "SELLER" }
        ]
      }
    ],
    "currentPage": 1,
    "maxPages": 1,
    "maxRows": 8,
    "numRowsInPage": 20,
    "numRowsReturned": 8,
    "startRow": 1,
    "endRow": 8,
    "columnMetadata": {
      "name": { "name": "Document", "columnType": "Text", "filterable": false, "sortable": true, "display": true },
      "category": { "name": "Category", "columnType": "Text", "filterable": true, "sortable": false, "display": true },
      "stateId": { "name": "Status", "columnType": "Text", "filterable": true, "sortable": true, "display": true },
      "uploadedAt": { "name": "Uploaded", "columnType": "Date", "filterable": false, "sortable": true, "display": true }
    },
    "hiddenColumns": ["id"]
  }
}
```

---

## Section 2: Upload Document

**Description:** Upload a new business document for verification
**API:** `POST /api/onboarding/document`
**Fetch/XHR name:** `onboarding/document`

**Request:** `multipart/form-data`
- `file` — the document file (PDF, JPG, PNG)
- `type` — document type (e.g. `GST_CERTIFICATE`, `PAN_CARD`, `BUSINESS_LICENSE`)
- `name` — display name
- `expiryDate` — optional expiry date (ISO date)

**Response (GenericResponse<StateEntityServiceResponse<Document>>):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "mutatedEntity": {
      "id": "doc-009",
      "name": "Business License (Renewed)",
      "type": "BUSINESS_LICENSE",
      "stateId": "PENDING"
    },
    "allowedActionsAndMetadata": [
      { "allowedAction": "delete", "acls": "SELLER" }
    ]
  }
}
```

---

## Section 3: Delete Document

**Description:** Remove an uploaded document
**API:** `PATCH /api/onboarding/{id}/delete`
**Fetch/XHR name:** `onboarding/{id}/delete`

**Response (GenericResponse<StateEntityServiceResponse<Document>>):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "mutatedEntity": {
      "id": "doc-003",
      "stateId": "DELETED"
    },
    "allowedActionsAndMetadata": []
  }
}
```

---

## Section 4: Download Document

**Description:** Download a previously uploaded document
**API:** `GET /api/onboarding/{id}/download`
**Fetch/XHR name:** `download`

**Response:** Binary file download with `Content-Disposition: attachment` header.

---

## Section 5: Compliance Status

**Description:** Overall compliance status showing required vs verified documents
**API:** `GET /api/seller/documents/compliance`
**Fetch/XHR name:** `compliance`

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "overallStatus": "PARTIALLY_COMPLIANT",
    "completionPercent": 75,
    "required": [
      { "type": "GST_CERTIFICATE", "name": "GST Registration", "status": "VERIFIED" },
      { "type": "PAN_CARD", "name": "PAN Card", "status": "VERIFIED" },
      { "type": "BUSINESS_LICENSE", "name": "Business License", "status": "EXPIRED" },
      { "type": "CANCELLED_CHEQUE", "name": "Cancelled Cheque", "status": "VERIFIED" },
      { "type": "ADDRESS_PROOF", "name": "Address Proof", "status": "PENDING" },
      { "type": "IDENTITY_PROOF", "name": "Identity Proof", "status": "NOT_UPLOADED" }
    ],
    "warnings": [
      { "type": "BUSINESS_LICENSE", "message": "Business License expired on 15 Mar 2026. Upload renewed copy." }
    ]
  }
}
```

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name | Type | Cache |
|---|---------|-------------|--------|----------------|------|-------|
| 1 | Document List | `/api/query/seller-documents` | POST | `seller-documents` | Chenile Query | 30s |
| 2 | Upload Document | `/api/onboarding/document` | POST | `onboarding/document` | Command Create | — |
| 3 | Delete Document | `/api/onboarding/{id}/delete` | PATCH | `onboarding/{id}/delete` | STM Event | — |
| 4 | Download Document | `/api/onboarding/{id}/download` | GET | `download` | REST | — |
| 5 | Compliance Status | `/api/seller/documents/compliance` | GET | `compliance` | REST | 60s |

**Total API calls on page load: 2 (parallel)**

---

## Frontend Integration Pattern

```typescript
// Server component
import { getApiClient } from '@homebase/api-client';

export default async function SellerDocuments({ searchParams }) {
  const api = getApiClient();

  const [documents, compliance] = await Promise.allSettled([
    api.post('/query/seller-documents', {
      queryName: 'SellerOnboarding.documents',
      pageNum: 1,
      numRowsInPage: 20,
      sortCriteria: [{ name: 'uploadedAt', ascendingOrder: false }],
      filters: { category: searchParams.category || 'ALL' },
    }),
    api.get('/seller/documents/compliance'),
  ]);

  return (
    <>
      <CategoryTabs />
      <DocumentList data={unwrap(documents)} />
      <UploadSection />
      <ComplianceStatus data={unwrap(compliance)} />
    </>
  );
}
```

---

## Backend Endpoints

| Endpoint | Exists? | Backend Module |
|----------|---------|---------------|
| `POST /query/seller-documents` | New | onboarding-query module (MyBatis) |
| `POST /onboarding/document` | New | onboarding service (Command Create) |
| `PATCH /onboarding/{id}/{eventID}` | New | onboarding service (STM) |
| `GET /onboarding/{id}/download` | New | onboarding service |
| `GET /seller/documents/compliance` | New | seller service (aggregation) |

---

## Allowed Actions -> UI Mapping

The backend returns `allowedActions` per row based on the entity's current state (STM).
The frontend reads these and renders only the allowed buttons.

**STM Source:** `onboarding-states.xml` (onboarding-flow)
**Seller ACL filter:** Only events with `SELLER` in `meta-acls` are shown to sellers.

### State -> Allowed Actions -> UI Buttons

| State | allowedActions (seller-visible) | UI Button | Icon | Color | Event ID |
|-------|-------------------------------|-----------|------|-------|----------|
| APPLICATION_SUBMITTED | -- | (read-only, pending verification) | -- | -- | -- |
| DOCUMENT_VERIFICATION | -- | (read-only, under review) | -- | -- | -- |
| DOCUMENTS_REQUESTED | resubmitDocuments | Resubmit Documents | Upload | blue | resubmitDocuments |
| BUSINESS_VERIFICATION | -- | (read-only, under review) | -- | -- | -- |
| TRAINING | completeTraining | Complete Training | GraduationCap | green | completeTraining |
| ONBOARDED | -- | (read-only, awaiting activation) | -- | -- | -- |
| COMPLETED | -- | (read-only, terminal) | -- | -- | -- |
| REJECTED | -- | (read-only, terminal) | -- | -- | -- |

### Frontend Pattern

```typescript
const SELLER_DOCUMENTS_ACTION_CONFIG: Record<string, ActionButtonConfig> = {
  resubmitDocuments: { label: 'Resubmit Documents', icon: 'Upload', color: 'blue' },
  completeTraining: { label: 'Complete Training', icon: 'GraduationCap', color: 'green' },
};

// Render only allowed actions
{allowedActions.map(a => {
  const config = SELLER_DOCUMENTS_ACTION_CONFIG[a.allowedAction];
  return config ? <ActionButton {...config} onClick={() => triggerEvent(id, a.allowedAction)} /> : null;
})}
```
