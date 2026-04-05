# Admin Category Management — API Contract

## Page: admin-categories.html

**Note:** Categories use a hierarchical tree structure (root -> sub -> leaf). The tree is fetched as a single GET call. CRUD operations use standard REST. Category states: `ACTIVE | INACTIVE`.

---

## Section 1: Category Stats Cards (3 cards)

**API:** `GET /api/admin/categories/stats`
**Fetch/XHR name:** `category-stats`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "totalCategories": 48,
    "breakdown": { "root": 3, "sub": 12, "leaf": 33 },
    "activeCategories": 42,
    "activePercentage": 87.5,
    "inactiveCategories": 6
  }
}
```

---

## Section 2: Category Tree

**API:** `GET /api/admin/categories/tree?status={all|active|inactive}&search={term}`
**Fetch/XHR name:** `category-tree`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": [
    {
      "id": "CAT-001",
      "name": "Electronics",
      "icon": "phone",
      "status": "Active",
      "productCount": 1245,
      "children": [
        {
          "id": "CAT-001-01",
          "name": "Mobile Phones",
          "status": "Active",
          "productCount": 456,
          "children": [
            { "id": "CAT-001-01-01", "name": "Smartphones", "status": "Active", "productCount": 320, "children": [] },
            { "id": "CAT-001-01-02", "name": "Feature Phones", "status": "Active", "productCount": 136, "children": [] }
          ]
        },
        {
          "id": "CAT-001-02",
          "name": "Audio",
          "status": "Active",
          "productCount": 189,
          "children": [
            { "id": "CAT-001-02-01", "name": "Headphones", "status": "Active", "productCount": 98, "children": [] },
            { "id": "CAT-001-02-02", "name": "Speakers", "status": "Active", "productCount": 91, "children": [] }
          ]
        },
        { "id": "CAT-001-03", "name": "Laptops", "status": "Active", "productCount": 234, "children": [] }
      ]
    },
    {
      "id": "CAT-002",
      "name": "Home & Furniture",
      "icon": "home",
      "status": "Active",
      "productCount": 2340,
      "children": []
    }
  ]
}
```

---

## Command: Create Category

**API:** `POST /api/admin/categories`
**Fetch/XHR name:** `create-category`

**Request:**
```json
{
  "name": "Smart Watches",
  "parentId": "CAT-001",
  "icon": "watch",
  "description": "Wearable smart devices",
  "status": "Active",
  "attributes": [
    { "name": "Display Size", "type": "text", "required": true },
    { "name": "Battery Life", "type": "text", "required": false }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "code": 201,
  "payload": { "id": "CAT-001-04", "name": "Smart Watches", "status": "Active" }
}
```

---

## Command: Update Category

**API:** `PUT /api/admin/categories/{categoryId}`
**Fetch/XHR name:** `update-category`

**Request:**
```json
{
  "name": "Smartphones & Tablets",
  "icon": "phone",
  "description": "Updated description",
  "status": "Active",
  "attributes": [
    { "name": "Screen Size", "type": "text", "required": true },
    { "name": "RAM", "type": "select", "options": ["4GB", "6GB", "8GB", "12GB"], "required": true }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": { "id": "CAT-001-01", "name": "Smartphones & Tablets", "status": "Active" }
}
```

---

## Command: Delete Category

**API:** `DELETE /api/admin/categories/{categoryId}`
**Fetch/XHR name:** `delete-category`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": { "message": "Category deleted. 0 products reassigned to parent." }
}
```

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name |
|---|---------|-------------|--------|----------------|
| 1 | Stats Cards | `/api/admin/categories/stats` | GET | `category-stats` |
| 2 | Category Tree | `/api/admin/categories/tree` | GET | `category-tree` |
| 3 | Create | `POST /api/admin/categories` | POST | `create-category` |
| 4 | Update | `PUT /api/admin/categories/{id}` | PUT | `update-category` |
| 5 | Delete | `DELETE /api/admin/categories/{id}` | DELETE | `delete-category` |

**Total API calls on page load: 2 (stats + tree in parallel)**
