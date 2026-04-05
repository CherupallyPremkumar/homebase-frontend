# Seller Products — API Contract

## Page: seller-products.html

**Note:** All table/list endpoints use Chenile's `SearchRequest/SearchResponse` pattern via POST. Retrieve uses GET with `StateEntityServiceResponse`. State transitions use PATCH STM events. Stats use standard REST GET.

---

## Section 1: Stats Cards (4 cards)

**Description:** Product summary stats — total, active, inactive, out of stock
**API:** `GET /api/seller/products/stats`
**Fetch/XHR name:** `stats`

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "total": 89,
    "active": 72,
    "activePercent": 80.9,
    "inactive": 12,
    "inactivePercent": 13.5,
    "outOfStock": 5,
    "outOfStockPercent": 5.6
  }
}
```

**Note:** This is a custom aggregation endpoint, NOT a Chenile query. Returns GenericResponse but no SearchResponse wrapper.

---

## Section 2: Products Table (search, filter, paginate — Chenile Query)

**Description:** Paginated product list with search, category filter, status filter, and sort
**API:** `POST /api/query/seller-products`
**Fetch/XHR name:** `seller-products`

**Request (SearchRequest):**
```json
{
  "queryName": "SellerProduct.allProducts",
  "pageNum": 1,
  "numRowsInPage": 10,
  "sortCriteria": [
    { "name": "createdTime", "ascendingOrder": false }
  ],
  "filters": {
    "q": "headphone",
    "category": "electronics",
    "status": "ACTIVE"
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
          "id": "prod-001",
          "name": "Pro Max Wireless Headphone",
          "sku": "HB-EL-0012",
          "category": "Electronics",
          "subCategory": "Audio",
          "price": 4999,
          "compareAtPrice": 6999,
          "stock": 148,
          "stateId": "ACTIVE",
          "rating": 4.8,
          "totalReviews": 245,
          "image": "/images/products/headphone.jpg",
          "createdTime": "2026-02-15T10:00:00Z"
        },
        "allowedActions": [
          { "allowedAction": "deactivate", "acls": "SELLER" },
          { "allowedAction": "editProduct", "mainPath": "/products/prod-001/edit" }
        ]
      }
    ],
    "currentPage": 1,
    "maxPages": 9,
    "maxRows": 89,
    "numRowsInPage": 10,
    "numRowsReturned": 10,
    "startRow": 1,
    "endRow": 10,
    "columnMetadata": {
      "name": { "name": "Product", "columnType": "Text", "filterable": true, "sortable": true, "display": true },
      "sku": { "name": "SKU", "columnType": "Text", "filterable": true, "sortable": false, "display": true },
      "category": { "name": "Category", "columnType": "Text", "filterable": true, "sortable": true, "display": true },
      "price": { "name": "Price", "columnType": "Number", "filterable": true, "sortable": true, "display": true },
      "stock": { "name": "Stock", "columnType": "Number", "filterable": true, "sortable": true, "display": true },
      "stateId": { "name": "Status", "columnType": "Text", "filterable": true, "sortable": true, "display": true },
      "createdTime": { "name": "Created", "columnType": "Date", "filterable": true, "sortable": true, "display": true }
    },
    "hiddenColumns": ["id"],
    "availableCannedReports": [
      { "name": "allProducts", "description": "All products" },
      { "name": "activeProducts", "description": "Active products only" },
      { "name": "lowStock", "description": "Low stock products" }
    ]
  }
}
```

**Note:** Uses Chenile SearchRequest format. The `queryName` maps to MyBatis mapper ID `SellerProduct.allProducts`. Backend applies `CustomerFilterInterceptor` to filter by logged-in seller's ID.

---

## Section 3: Bulk Actions (STM Batch)

**Description:** Bulk operations on selected products — activate, deactivate, delete
**API:** `PATCH /api/product/bulk/{eventID}`
**Fetch/XHR name:** `product/bulk/{eventID}`

**Request Body:**
```json
{
  "productIds": ["prod-001", "prod-002", "prod-003"]
}
```

**Allowed eventIDs:** `activate`, `deactivate`, `delete`

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "updatedCount": 3,
    "message": "3 products activated successfully"
  }
}
```

---

## Section 4: Delete Product (STM Event)

**Description:** Delete a single product (state transition to DELETED)
**API:** `PATCH /api/product/{id}/delete`
**Fetch/XHR name:** `product/{id}/delete`

**Response (GenericResponse<StateEntityServiceResponse<Product>>):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "mutatedEntity": {
      "id": "prod-003",
      "name": "Old Product",
      "stateId": "DELETED"
    },
    "allowedActionsAndMetadata": []
  }
}
```

---

## Section 5: Export Products

**Description:** Export products to CSV/Excel
**API:** `GET /api/seller/products/export`
**Fetch/XHR name:** `export`

**Query Params:**
- `format` — `csv` or `xlsx`
- `category` — optional filter
- `status` — optional filter

**Response:** Binary file download with `Content-Disposition: attachment` header.

---

## Section 6: Import Products

**Description:** Bulk import products via CSV/Excel
**API:** `POST /api/seller/products/import`
**Fetch/XHR name:** `import`

**Request:** `multipart/form-data` with file field `file`

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "imported": 25,
    "errors": 2,
    "errorDetails": [
      { "row": 12, "message": "Invalid category 'Eletronics'" },
      { "row": 18, "message": "SKU 'HB-EL-0099' already exists" }
    ]
  }
}
```

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name | Type | Cache |
|---|---------|-------------|--------|----------------|------|-------|
| 1 | Stats Cards | `/api/seller/products/stats` | GET | `stats` | REST | 30s |
| 2 | Products Table | `/api/query/seller-products` | POST | `seller-products` | Chenile Query | 30s |
| 3 | Bulk Actions | `/api/product/bulk/{eventID}` | PATCH | `product/bulk/{eventID}` | STM Event | — |
| 4 | Delete Product | `/api/product/{id}/delete` | PATCH | `product/{id}/delete` | STM Event | — |
| 5 | Export Products | `/api/seller/products/export` | GET | `export` | REST | — |
| 6 | Import Products | `/api/seller/products/import` | POST | `import` | REST | — |

**Total API calls on page load: 2 (parallel)**

---

## Request Flow

```
Browser -> Next.js /api/proxy/[...path] -> injects JWT -> Backend

For Chenile queries:
  POST /api/proxy/query/seller-products
    -> Next.js adds Authorization header
    -> Backend query controller receives SearchRequest
    -> CustomerFilterInterceptor adds seller ID filter
    -> MyBatis executes SellerProduct.allProducts query
    -> STM enriches with allowedActions
    -> Returns GenericResponse<SearchResponse>

For STM events:
  PATCH /api/proxy/product/{id}/delete
    -> Next.js adds Authorization header
    -> Backend OrderController.processById receives (id, eventID, payload)
    -> STM validates transition from current state
    -> Returns GenericResponse<StateEntityServiceResponse<Product>>
```

---

## Frontend Integration Pattern

```typescript
// Server component
import { getApiClient } from '@homebase/api-client';

export default async function SellerProducts({ searchParams }) {
  const api = getApiClient();

  const [stats, products] = await Promise.allSettled([
    api.get('/seller/products/stats'),
    api.post('/query/seller-products', {
      queryName: 'SellerProduct.allProducts',
      pageNum: Number(searchParams.page) || 1,
      numRowsInPage: 10,
      sortCriteria: [{ name: searchParams.sortBy || 'createdTime', ascendingOrder: searchParams.sortOrder === 'asc' }],
      filters: {
        q: searchParams.q,
        category: searchParams.category,
        status: searchParams.status,
      },
    }),
  ]);

  return (
    <>
      <StatsCards data={unwrap(stats)} />
      <SearchFilters />
      <ProductsTable data={unwrap(products)} />
      <BulkActionBar />
    </>
  );
}
```

---

## Backend Endpoints

| Endpoint | Exists? | Backend Module |
|----------|---------|---------------|
| `GET /seller/products/stats` | New | seller service (aggregation) |
| `POST /query/seller-products` | New | product-query module (MyBatis) |
| `PATCH /product/{id}/{eventID}` | Exists | product service (STM) |
| `GET /seller/products/export` | New | seller service |
| `POST /seller/products/import` | New | seller service |

**MyBatis mappers needed:**
- `SellerProduct.allProducts` — in `product-query/mapper/seller-product.xml`
- `SellerProduct.allProducts-count` — count query
- `SellerProduct.activeProducts` — canned report for active only
- `SellerProduct.lowStock` — canned report for low stock

**JSON definitions needed:**
- `seller-product.json` — query metadata for SellerProduct queries

---

## Allowed Actions -> UI Mapping

The backend returns `allowedActions` per row based on the entity's current state (STM).
The frontend reads these and renders only the allowed buttons.

**STM Source:** `product-states.xml` (product-flow)
**Seller ACL filter:** Only events with `SUPPLIER` in `meta-acls` are shown.

### State -> Allowed Actions -> UI Buttons

| State | allowedActions (seller-visible) | UI Button | Icon | Color | Event ID |
|-------|-------------------------------|-----------|------|-------|----------|
| DRAFT | submitForReview | Submit for Review | Send | blue | submitForReview |
| DRAFT | deleteProduct | Delete | Trash2 | red | deleteProduct |
| UNDER_REVIEW | -- | (read-only, pending admin) | -- | -- | -- |
| PUBLISHED | requestUpdate | Request Update | Edit | amber | requestUpdate |
| PUBLISHED | discontinueProduct | Discontinue | XCircle | red | discontinueProduct |
| PENDING_UPDATE | -- | (read-only, pending admin) | -- | -- | -- |
| DISABLED | -- | (read-only, admin action needed) | -- | -- | -- |
| ARCHIVED | -- | (read-only) | -- | -- | -- |
| RECALLED | -- | (read-only) | -- | -- | -- |
| DISCONTINUED | -- | (read-only, terminal) | -- | -- | -- |

### Frontend Pattern

```typescript
const SELLER_PRODUCT_ACTION_CONFIG: Record<string, ActionButtonConfig> = {
  submitForReview: { label: 'Submit for Review', icon: 'Send', color: 'blue' },
  deleteProduct: { label: 'Delete', icon: 'Trash2', color: 'red' },
  requestUpdate: { label: 'Request Update', icon: 'Edit', color: 'amber' },
  discontinueProduct: { label: 'Discontinue', icon: 'XCircle', color: 'red' },
};

// Render only allowed actions
{allowedActions.map(a => {
  const config = SELLER_PRODUCT_ACTION_CONFIG[a.allowedAction];
  return config ? <ActionButton {...config} onClick={() => triggerEvent(id, a.allowedAction)} /> : null;
})}
```
