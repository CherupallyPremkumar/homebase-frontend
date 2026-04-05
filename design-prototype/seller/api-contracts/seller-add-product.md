# Seller Add/Edit Product — API Contract

## Page: seller-add-product.html

**Note:** Product create uses Chenile Command POST pattern. Product update uses PATCH STM event. Retrieve uses GET with `StateEntityServiceResponse`. Categories and media use standard REST.

---

## Section 1: Categories Dropdown

**Description:** Fetch category tree for product categorization
**API:** `GET /api/catalog/categories`
**Fetch/XHR name:** `categories`

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "categories": [
      {
        "id": "cat-electronics",
        "name": "Electronics",
        "subCategories": [
          { "id": "sub-headphones", "name": "Headphones" },
          { "id": "sub-speakers", "name": "Speakers" },
          { "id": "sub-mobiles", "name": "Mobile Phones" }
        ]
      },
      {
        "id": "cat-fashion",
        "name": "Fashion",
        "subCategories": [
          { "id": "sub-men-clothing", "name": "Men's Clothing" },
          { "id": "sub-women-clothing", "name": "Women's Clothing" }
        ]
      }
    ]
  }
}
```

---

## Section 2: Load Product (Edit Mode — Command Retrieve)

**Description:** When editing, fetch existing product data by ID
**API:** `GET /api/product/{id}`
**Fetch/XHR name:** `product/{id}`

**Response (GenericResponse<StateEntityServiceResponse<Product>>):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "mutatedEntity": {
      "id": "prod-001",
      "name": "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
      "brand": "Sony",
      "categoryId": "cat-electronics",
      "subCategoryId": "sub-headphones",
      "shortDescription": "Premium wireless headphones with industry-leading noise cancellation",
      "longDescription": "<p>Experience the next level of silence...</p>",
      "sku": "HB-EL-0012",
      "price": 4999,
      "compareAtPrice": 6999,
      "costPrice": 3200,
      "taxRate": 18,
      "stock": 148,
      "lowStockThreshold": 10,
      "weight": 0.254,
      "weightUnit": "kg",
      "dimensions": { "length": 20, "width": 18, "height": 8 },
      "dimensionUnit": "cm",
      "tags": ["wireless", "noise-cancelling", "bluetooth", "headphones"],
      "media": [
        { "id": "media-001", "url": "/images/products/headphone-1.jpg", "type": "IMAGE", "isPrimary": true, "sortOrder": 0 },
        { "id": "media-002", "url": "/images/products/headphone-2.jpg", "type": "IMAGE", "isPrimary": false, "sortOrder": 1 }
      ],
      "variants": [
        { "id": "var-001", "name": "Black", "sku": "HB-EL-0012-BLK", "price": 4999, "stock": 80 },
        { "id": "var-002", "name": "Silver", "sku": "HB-EL-0012-SLV", "price": 4999, "stock": 68 }
      ],
      "seoTitle": "Sony WH-1000XM5 Wireless Headphones | HomeBase",
      "seoDescription": "Buy Sony WH-1000XM5 at best price...",
      "seoSlug": "sony-wh-1000xm5-wireless-headphones",
      "stateId": "ACTIVE",
      "isPublished": true,
      "createdTime": "2026-02-15T10:00:00Z",
      "updatedTime": "2026-03-20T14:30:00Z"
    },
    "allowedActionsAndMetadata": [
      { "allowedAction": "update", "acls": "SELLER", "bodyType": "Product" },
      { "allowedAction": "deactivate", "acls": "SELLER" },
      { "allowedAction": "delete", "acls": "SELLER" }
    ]
  }
}
```

---

## Section 3: Upload Media

**Description:** Upload product images and videos
**API:** `POST /api/product/media`
**Fetch/XHR name:** `product/media`

**Request:** `multipart/form-data`
- `file` — the image/video file
- `productId` — optional (if uploading for existing product)

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "media-003",
    "url": "/images/products/headphone-3.jpg",
    "thumbnailUrl": "/images/products/headphone-3-thumb.jpg",
    "type": "IMAGE",
    "size": 245760,
    "mimeType": "image/jpeg"
  }
}
```

---

## Section 4: Create Product (Command Create)

**Description:** Create a new product and publish it
**API:** `POST /api/product`
**Fetch/XHR name:** `product`

**Request Body:**
```json
{
  "name": "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
  "brand": "Sony",
  "categoryId": "cat-electronics",
  "subCategoryId": "sub-headphones",
  "shortDescription": "Premium wireless headphones...",
  "longDescription": "<p>Experience the next level...</p>",
  "sku": "HB-EL-0012",
  "price": 4999,
  "compareAtPrice": 6999,
  "costPrice": 3200,
  "taxRate": 18,
  "stock": 148,
  "lowStockThreshold": 10,
  "weight": 0.254,
  "weightUnit": "kg",
  "dimensions": { "length": 20, "width": 18, "height": 8 },
  "dimensionUnit": "cm",
  "tags": ["wireless", "noise-cancelling"],
  "mediaIds": ["media-001", "media-002"],
  "primaryMediaId": "media-001",
  "variants": [
    { "name": "Black", "sku": "HB-EL-0012-BLK", "price": 4999, "stock": 80 }
  ],
  "seoTitle": "Sony WH-1000XM5 Wireless Headphones | HomeBase",
  "seoDescription": "Buy Sony WH-1000XM5...",
  "seoSlug": "sony-wh-1000xm5-wireless-headphones",
  "status": "ACTIVE"
}
```

**Response (GenericResponse<StateEntityServiceResponse<Product>>):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "mutatedEntity": {
      "id": "prod-090",
      "name": "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
      "stateId": "ACTIVE"
    },
    "allowedActionsAndMetadata": [
      { "allowedAction": "update", "acls": "SELLER", "bodyType": "Product" },
      { "allowedAction": "deactivate", "acls": "SELLER" }
    ]
  }
}
```

---

## Section 5: Save Draft

**Description:** Save product as draft (not published)
**API:** `POST /api/product`
**Fetch/XHR name:** `product`

Same request body as Section 4, but with `"status": "DRAFT"`.

**Response:** Same structure as Section 4, with `stateId: "DRAFT"`.

---

## Section 6: Update Product (STM Event — Edit Mode)

**Description:** Update an existing product
**API:** `PATCH /api/product/{id}/update`
**Fetch/XHR name:** `product/{id}/update`

**Request Body:** Same structure as create (Section 4), only changed fields are required.

**Response (GenericResponse<StateEntityServiceResponse<Product>>):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "mutatedEntity": {
      "id": "prod-001",
      "name": "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
      "stateId": "ACTIVE"
    },
    "allowedActionsAndMetadata": [
      { "allowedAction": "update", "acls": "SELLER", "bodyType": "Product" },
      { "allowedAction": "deactivate", "acls": "SELLER" }
    ]
  }
}
```

---

## Section 7: Delete Media

**Description:** Remove an uploaded media file from product
**API:** `DELETE /api/product/media/{mediaId}`
**Fetch/XHR name:** `product/media/{mediaId}`

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "deleted": true
  }
}
```

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name | Type | Cache |
|---|---------|-------------|--------|----------------|------|-------|
| 1 | Categories | `/api/catalog/categories` | GET | `categories` | REST | 5min |
| 2 | Load Product | `/api/product/{id}` | GET | `product/{id}` | Command Retrieve | 30s |
| 3 | Upload Media | `/api/product/media` | POST | `product/media` | REST | — |
| 4 | Create Product | `/api/product` | POST | `product` | Command Create | — |
| 5 | Save Draft | `/api/product` | POST | `product` | Command Create | — |
| 6 | Update Product | `/api/product/{id}/update` | PATCH | `product/{id}/update` | STM Event | — |
| 7 | Delete Media | `/api/product/media/{mediaId}` | DELETE | `product/media/{mediaId}` | REST | — |

**Total API calls on page load: 1 (categories) or 2 (categories + product in edit mode)**

---

## Frontend Integration Pattern

```typescript
// Server component
import { getApiClient } from '@homebase/api-client';

export default async function AddProduct({ params }) {
  const api = getApiClient();
  const isEdit = !!params?.id;

  const promises = [api.get('/catalog/categories')];
  if (isEdit) {
    promises.push(api.get(`/product/${params.id}`));
  }

  const [categories, product] = await Promise.allSettled(promises);

  return (
    <ProductForm
      categories={unwrap(categories)}
      product={isEdit ? unwrap(product) : null}
      onSaveDraft={handleSaveDraft}
      onPublish={handlePublish}
    />
  );
}
```

---

## Backend Endpoints

| Endpoint | Exists? | Backend Module |
|----------|---------|---------------|
| `GET /catalog/categories` | New | catalog service |
| `GET /product/{id}` | Exists | product service (Command Retrieve) |
| `POST /product` | Exists | product service (Command Create) |
| `PATCH /product/{id}/{eventID}` | Exists | product service (STM) |
| `POST /product/media` | New | product service |
| `DELETE /product/media/{mediaId}` | New | product service |
