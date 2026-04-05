# Seller Product Lifecycle Flow

Product management from draft creation to end-of-life, including moderation and updates.

---

## Flow Overview

```
+---------+     +----------+     +-----------+     +----------+     +----------+
| DRAFT   |---->| SUBMIT   |---->| UNDER     |---->| PUBLISHED|---->| ACTIVE   |
|         |     | for      |     | REVIEW    |     | (Live on |     | (Selling)|
|         |     | Review   |     | (Admin)   |     | store)   |     |          |
+---------+     +----------+     +-----------+     +----------+     +----------+
                                       |                                 |
                                       v                          +------+------+
                                  +---------+                     |      |      |
                                  | REJECTED|                     v      v      v
                                  +---------+                  Deact.  Edit   Delete
                                                               ivate
```

---

## Detailed Flow Diagram

```
    [START]
       |
       v
+=========================+
| CREATE NEW PRODUCT      |
| seller-add-product.html |
+=========================+
       |
       v
+----------------------------+
| PRODUCT FORM               |
|                             |
| == Basic Info ==            |
| Name:     [_______________] |
| Brand:    [_______________] |
| Category: [Electronics  v]  |
| Sub-Cat:  [Headphones   v]  |
|                             |
| == Pricing ==               |
| Price:        [4999]        |
| Compare At:   [6999]        |
| Cost Price:   [3200]        |
| Tax Rate:     [18%]         |
|                             |
| == Inventory ==             |
| SKU:          [HB-EL-0012] |
| Stock:        [148]         |
| Low Stock:    [10]          |
|                             |
| == Media ==                 |
| [img1] [img2] [+ Add]      |
|                             |
| == Description ==           |
| Short: [________________]  |
| Long:  [WYSIWYG editor ]   |
|                             |
| == Variants ==              |
| Color: Black   SKU: ..BLK  |
| Color: Silver  SKU: ..SLV  |
| [+ Add Variant]             |
|                             |
| == Shipping ==              |
| Weight: [0.254] kg          |
| L/W/H:  [20/18/8] cm       |
|                             |
| == SEO ==                   |
| Title:  [_______________]  |
| Desc:   [_______________]  |
| Slug:   [_______________]  |
|                             |
| == Tags ==                  |
| [wireless] [bluetooth] [+] |
+----------------------------+
       |
       +------+--------+
       |               |
       v               v
+-----------+   +----------------+
| SAVE AS   |   | SUBMIT FOR     |
| DRAFT     |   | REVIEW         |
|           |   |                |
| POST /api/|   | POST /api/     |
| product   |   | product        |
| {status:  |   | {status:       |
|  "DRAFT"} |   |  "ACTIVE"}     |
+-----------+   | then STM:      |
       |        | submitForReview|
       |        +----------------+
       |               |
       v               v
+===========+   +================+
| DRAFT     |   | UNDER_REVIEW   |
| STATE     |   | STATE          |
+===========+   +================+
       |               |
       |               v
       |        +-------------------+
       |        | ADMIN MODERATION  |
       |        | admin-products.   |
       |        | html              |
       |        |                   |
       |        | - Auto-checks:    |
       |        |   prohibited items|
       |        |   image quality   |
       |        |   pricing sanity  |
       |        |                   |
       |        | - Manual review:  |
       |        |   description     |
       |        |   category fit    |
       |        |   compliance      |
       |        +-------------------+
       |            |         |
       |            v         v
       |     +---------+ +----------+
       |     |PUBLISHED| | REJECTED |
       |     |(ACTIVE) | |          |
       |     +---------+ +----------+
       |          |            |
       |          |            v
       |          |     +------------------+
       |          |     | "Product rejected|
       |          |     | Reason: Missing  |
       |          |     | specifications"  |
       |          |     |                  |
       |          |     | Seller can edit  |
       |          |     | and resubmit     |
       |          |     +------------------+
       |          |            |
       |          |            v
       |     +----+      Edit & Resubmit
       |     |           (back to DRAFT
       |     |            or UNDER_REVIEW)
       |     |
       v     v
+===========================+
| PUBLISHED / ACTIVE STATE  |
| Product is live on store  |
|                           |
| Visible to customers      |
| Can receive orders        |
| Appears in search         |
+===========================+
       |
       +------+------+------+------+
       |      |      |      |      |
       v      v      v      v      v

  +------+ +------+ +------+ +------+ +--------+
  |Edit/ | |Deact-| |Discon| |Archive| |Request |
  |Update| |ivate | |tinue | |       | |Update  |
  +------+ +------+ +------+ +------+ +--------+
     |        |        |        |          |
     v        v        v        v          v
  PENDING  DISABLED  DISCON-  ARCHIVED  PENDING_
  _UPDATE           TINUED              UPDATE
     |        |        |        |          |
     v        |        |        |          v
  Admin       |        |        |     Admin reviews
  reviews     |        v        |     update request
  update      |    [TERMINAL]   |          |
     |        |                 |     +----+-----+
     +--+     |                 |     |          |
        |     +------+----------+     v          v
        v            |           Approve     Reject
   PUBLISHED         v           Update      Update
   (updated)    +----------+        |          |
                | DISABLED |        v          v
                | Product  |   PUBLISHED   PUBLISHED
                | hidden   |   (updated)   (unchanged)
                | from     |
                | store    |
                +----------+
                     |
                     +------+------+
                     |      |      |
                     v      v      v
                  Enable  Archive  Recall
                     |      |      |
                     v      v      v
                PUBLISHED ARCHIVED RECALLED
```

---

## Product State Machine (Complete)

```
                        +--------+
                        | DRAFT  |
                        +--------+
                         |      |
              submitForReview   deleteProduct
                         |      |
                         v      v
                   +-----------+  [DELETED]
                   |UNDER_     |
                   |REVIEW     |
                   +-----------+
                    |         |
             approveProduct   rejectProduct
                    |         |
                    v         v
              +-----------+ +-----------+
              | PUBLISHED | | REJECTED  |
              +-----------+ +-----------+
               |   |   |         |
     +---------+   |   +---+    edit & resubmit
     |             |       |    (back to DRAFT)
     v             v       v
+----------+ +---------+ +----------+
|DISABLED  | |ARCHIVED | |DISCON-   |
|          | |         | |TINUED    |
+----------+ +---------+ |[TERMINAL]|
 |    |  |    |    |  |   +----------+
 |    |  |    |    |  |
 v    v  v    v    v  v
Enab Arc Rec UnArc Rec Disc
 |    |  |    |    |  |
 v    v  v    v    v  v
PUB  ARC REC PUB  REC DISC


Seller-visible actions per state:
---------------------------------
DRAFT:       submitForReview, deleteProduct
UNDER_REVIEW: (read-only, pending admin)
PUBLISHED:   requestUpdate, discontinueProduct
PENDING_UPDATE: (read-only, pending admin)
DISABLED:    (read-only, admin action needed)
ARCHIVED:    (read-only)
RECALLED:    (read-only)
DISCONTINUED: (read-only, terminal)
```

---

## Page References

| Step | Prototype Page | URL Path |
|------|---------------|----------|
| Products List | `seller/seller-products.html` | `/seller/products` |
| Add Product | `seller/seller-add-product.html` | `/seller/products/new` |
| Edit Product | `seller/seller-add-product.html` | `/seller/products/{id}/edit` |
| Product Stats | `seller/seller-products.html` | `/seller/products` |
| Inventory | `seller/seller-inventory.html` | `/seller/inventory` |

---

## API Calls at Each Step

| Step | API Endpoint | Method | Trigger |
|------|-------------|--------|---------|
| **Products Page** | | | |
| Load product stats | `GET /api/seller/products/stats` | GET | Page load |
| Load products list | `POST /api/query/seller-products` | POST | Page load |
| **Create Product** | | | |
| Load categories | `GET /api/catalog/categories` | GET | Page load |
| Upload images | `POST /api/product/media` | POST | File select |
| Delete image | `DELETE /api/product/media/{mediaId}` | DELETE | Remove click |
| Save as draft | `POST /api/product` (status: DRAFT) | POST | Save Draft |
| Submit for review | `POST /api/product` (status: ACTIVE) | POST | Publish |
| **Edit Product** | | | |
| Load product | `GET /api/product/{id}` | GET | Page load |
| Update product | `PATCH /api/product/{id}/update` | PATCH | Save click |
| Request update | `PATCH /api/product/{id}/requestUpdate` | PATCH | Request Update |
| **State Transitions** | | | |
| Submit for review | `PATCH /api/product/{id}/submitForReview` | PATCH | Submit click |
| Deactivate product | `PATCH /api/product/{id}/deactivate` | PATCH | Deactivate click |
| Discontinue product | `PATCH /api/product/{id}/discontinueProduct` | PATCH | Discontinue click |
| Delete product | `PATCH /api/product/{id}/delete` | PATCH | Delete click |
| **Bulk Actions** | | | |
| Bulk activate | `PATCH /api/product/bulk/activate` | PATCH | Bulk action |
| Bulk deactivate | `PATCH /api/product/bulk/deactivate` | PATCH | Bulk action |
| Bulk delete | `PATCH /api/product/bulk/delete` | PATCH | Bulk action |
| **Import/Export** | | | |
| Export products | `GET /api/seller/products/export?format=csv` | GET | Export click |
| Import products | `POST /api/seller/products/import` | POST | File upload |

---

## Decision Points

| Decision | Condition | Path A | Path B |
|----------|-----------|--------|--------|
| Save or Publish? | Product completeness | Draft (incomplete) | Submit for review |
| Admin approval? | Content meets guidelines | PUBLISHED | REJECTED with feedback |
| Update needed? | Product already published | Request Update (STM) | Direct edit (DRAFT) |
| In stock? | stock > 0 | Active listing | "Out of Stock" badge |
| Low stock alert? | stock <= lowStockThreshold | Show warning badge | Normal display |
| Discontinue or Deactivate? | Permanent vs temporary | Discontinue (terminal) | Deactivate (reversible) |

---

## Error Paths

| Error | Trigger | User Experience | Recovery |
|-------|---------|----------------|----------|
| Missing required fields | Save product | Inline validation errors | Fill missing fields |
| Duplicate SKU | Create product | "SKU already exists" | Use unique SKU |
| Image too large | Upload media | "Max file size 5MB" | Compress image |
| Invalid image format | Upload media | "Only JPG, PNG, WebP allowed" | Convert format |
| Product rejected | Admin review | "Rejected: [reason]" notification | Edit and resubmit |
| Import errors | Bulk CSV import | "Row 12: Invalid category" detail report | Fix CSV and re-import |
| Cannot delete | Has active orders | "Cannot delete: active orders exist" | Deactivate instead |

---

## Time Estimates

| Step | User Action | Estimated Time |
|------|------------|---------------|
| Fill product form (complete) | All fields + images | 15-30 minutes |
| Quick draft save | Basic info only | 2-5 minutes |
| Upload images (5 images) | Select + upload each | 2-5 minutes |
| Add variants | Configure options | 3-5 minutes |
| Write description | Detailed copy | 5-10 minutes |
| SEO fields | Title, desc, slug | 2-3 minutes |
| Submit for review | Click submit | 5 seconds |
| Edit existing product | Modify fields | 5-15 minutes |
| Bulk import (25 products) | Prepare CSV + upload | 30-60 minutes |
| **Admin review** | Moderation | 1-24 hours |
