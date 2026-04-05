# Seller Notifications — API Contract

## Page: seller-notifications.html

**Note:** All table/list endpoints use Chenile's `SearchRequest/SearchResponse` pattern via POST. Individual actions use standard REST. Bulk actions use POST with ID arrays.

---

## Section 1: Notification Stats

**Description:** Unread count, total count, breakdown by type
**API:** `GET /api/seller/notifications/stats`
**Fetch/XHR name:** `stats`

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "unreadCount": 12,
    "totalCount": 156,
    "byType": {
      "ORDER": 5,
      "INVENTORY": 3,
      "PAYMENT": 2,
      "REVIEW": 1,
      "SYSTEM": 1
    }
  }
}
```

**Note:** Custom aggregation endpoint, NOT a Chenile query. Also used by the header notification bell badge.

---

## Section 2: Notifications List (Chenile Query)

**Description:** Paginated notifications list with type filter, read/unread filter, search
**API:** `POST /api/query/seller-notifications`
**Fetch/XHR name:** `seller-notifications`

**Request (SearchRequest):**
```json
{
  "queryName": "SellerNotification.allNotifications",
  "pageNum": 1,
  "numRowsInPage": 20,
  "sortCriteria": [
    { "name": "createdTime", "ascendingOrder": false }
  ],
  "filters": {
    "type": "ALL",
    "readStatus": "ALL",
    "q": ""
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
          "id": "notif-001",
          "type": "ORDER",
          "title": "New Order Received",
          "message": "Order #HB-78240 placed by Ankit Kumar for Rs.4,299",
          "isRead": false,
          "priority": "HIGH",
          "actionUrl": "/seller/seller-order-detail.html?id=HB-78240",
          "actionLabel": "View Order",
          "metadata": {
            "orderId": "HB-78240",
            "customerName": "Ankit Kumar",
            "amount": 4299
          },
          "createdTime": "2026-03-28T14:34:00Z"
        },
        "allowedActions": [
          { "allowedAction": "markRead", "mainPath": "/notifications/notif-001/read" },
          { "allowedAction": "delete", "mainPath": "/notifications/notif-001" }
        ]
      },
      {
        "row": {
          "id": "notif-002",
          "type": "INVENTORY",
          "title": "Low Stock Alert",
          "message": "Wireless Bluetooth Speaker has only 3 units left",
          "isRead": false,
          "priority": "MEDIUM",
          "actionUrl": "/seller/seller-inventory.html?sku=WBS-BLK-001",
          "actionLabel": "Update Stock",
          "metadata": {
            "productId": "prod-001",
            "productName": "Wireless Bluetooth Speaker",
            "currentStock": 3
          },
          "createdTime": "2026-03-28T12:15:00Z"
        },
        "allowedActions": [
          { "allowedAction": "markRead", "mainPath": "/notifications/notif-002/read" },
          { "allowedAction": "delete", "mainPath": "/notifications/notif-002" }
        ]
      },
      {
        "row": {
          "id": "notif-003",
          "type": "PAYMENT",
          "title": "Settlement Processed",
          "message": "Rs.34,500 has been credited to your bank account",
          "isRead": true,
          "priority": "LOW",
          "actionUrl": "/seller/seller-settlements.html",
          "actionLabel": "View Settlement",
          "metadata": {
            "settlementId": "stl-045",
            "amount": 34500
          },
          "createdTime": "2026-03-27T09:00:00Z"
        },
        "allowedActions": [
          { "allowedAction": "markUnread", "mainPath": "/notifications/notif-003/unread" },
          { "allowedAction": "delete", "mainPath": "/notifications/notif-003" }
        ]
      }
    ],
    "currentPage": 1,
    "maxPages": 8,
    "maxRows": 156,
    "numRowsInPage": 20,
    "numRowsReturned": 20,
    "startRow": 1,
    "endRow": 20,
    "columnMetadata": {
      "type": { "name": "Type", "columnType": "Text", "filterable": true, "sortable": true, "display": true },
      "title": { "name": "Title", "columnType": "Text", "filterable": true, "sortable": false, "display": true },
      "isRead": { "name": "Read", "columnType": "Boolean", "filterable": true, "sortable": true, "display": true },
      "priority": { "name": "Priority", "columnType": "Text", "filterable": true, "sortable": true, "display": true },
      "createdTime": { "name": "Time", "columnType": "Date", "filterable": true, "sortable": true, "display": true }
    },
    "hiddenColumns": ["id", "metadata", "actionUrl", "actionLabel"],
    "availableCannedReports": [
      { "name": "allNotifications", "description": "All notifications" },
      { "name": "unreadOnly", "description": "Unread notifications" },
      { "name": "orderNotifications", "description": "Order-related notifications" }
    ]
  }
}
```

**Note:** Uses Chenile SearchRequest format. The `queryName` maps to MyBatis mapper ID `SellerNotification.allNotifications`. Backend applies `CustomerFilterInterceptor` to filter by logged-in seller's ID.

---

## Section 3: Mark Notification as Read

**Description:** Mark a single notification as read
**API:** `PATCH /api/seller/notifications/{notificationId}/read`
**Fetch/XHR name:** `mark-read`

**Request:** No body needed

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "notif-001",
    "isRead": true,
    "updatedTime": "2026-03-28T14:40:00Z"
  }
}
```

---

## Section 4: Mark Notification as Unread

**Description:** Mark a single notification as unread
**API:** `PATCH /api/seller/notifications/{notificationId}/unread`
**Fetch/XHR name:** `mark-unread`

**Request:** No body needed

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "notif-003",
    "isRead": false,
    "updatedTime": "2026-03-28T15:00:00Z"
  }
}
```

---

## Section 5: Delete Notification

**Description:** Delete a single notification
**API:** `DELETE /api/seller/notifications/{notificationId}`
**Fetch/XHR name:** `delete-notification`

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "notif-001",
    "deleted": true
  }
}
```

---

## Section 6: Bulk Mark as Read

**Description:** Mark multiple selected notifications as read
**API:** `POST /api/seller/notifications/bulk-read`
**Fetch/XHR name:** `bulk-read`

**Request:**
```json
{
  "notificationIds": ["notif-001", "notif-002", "notif-005"]
}
```

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "updatedCount": 3,
    "notificationIds": ["notif-001", "notif-002", "notif-005"]
  }
}
```

---

## Section 7: Mark All as Read

**Description:** Mark all unread notifications as read
**API:** `POST /api/seller/notifications/mark-all-read`
**Fetch/XHR name:** `mark-all-read`

**Request:** No body needed

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "updatedCount": 12
  }
}
```

---

## Section 8: Bulk Delete

**Description:** Delete multiple selected notifications
**API:** `POST /api/seller/notifications/bulk-delete`
**Fetch/XHR name:** `bulk-delete`

**Request:**
```json
{
  "notificationIds": ["notif-003", "notif-004"]
}
```

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "deletedCount": 2,
    "notificationIds": ["notif-003", "notif-004"]
  }
}
```

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name | Type | Cache |
|---|---------|-------------|--------|----------------|------|-------|
| 1 | Stats | `/api/seller/notifications/stats` | GET | `stats` | REST | 10s |
| 2 | Notifications List | `/api/query/seller-notifications` | POST | `seller-notifications` | Chenile Query | 10s |
| 3 | Mark Read | `/api/seller/notifications/{id}/read` | PATCH | `mark-read` | REST | — |
| 4 | Mark Unread | `/api/seller/notifications/{id}/unread` | PATCH | `mark-unread` | REST | — |
| 5 | Delete | `/api/seller/notifications/{id}` | DELETE | `delete-notification` | REST | — |
| 6 | Bulk Read | `/api/seller/notifications/bulk-read` | POST | `bulk-read` | REST | — |
| 7 | Mark All Read | `/api/seller/notifications/mark-all-read` | POST | `mark-all-read` | REST | — |
| 8 | Bulk Delete | `/api/seller/notifications/bulk-delete` | POST | `bulk-delete` | REST | — |

**Total API calls on page load: 2 (stats + list, parallel)**

---

## Notification Types

| Type | Icon | Color | Examples |
|------|------|-------|----------|
| `ORDER` | shopping bag | orange | New order, order cancelled, return request |
| `INVENTORY` | box | yellow | Low stock alert, out of stock |
| `PAYMENT` | banknotes | green | Settlement processed, payment received |
| `REVIEW` | star | blue | New review, review reply needed |
| `SYSTEM` | bell | gray | Policy update, maintenance notice, feature announcement |

---

## Request Flow

```
Browser -> Next.js /api/proxy/[...path] -> injects JWT -> Backend

For Chenile queries:
  POST /api/proxy/query/seller-notifications
    -> Next.js adds Authorization header
    -> Backend query controller receives SearchRequest
    -> CustomerFilterInterceptor adds seller ID filter
    -> MyBatis executes SellerNotification.allNotifications query
    -> Returns GenericResponse<SearchResponse>

For actions:
  PATCH /api/proxy/seller/notifications/notif-001/read
    -> Next.js adds Authorization header
    -> Backend marks notification as read
    -> Returns GenericResponse
```

---

## Frontend Integration

```typescript
// Server component — page load
import { getApiClient } from '@homebase/api-client';

export default async function SellerNotifications() {
  const api = getApiClient();

  const [stats, notifications] = await Promise.allSettled([
    api.get('/seller/notifications/stats'),
    api.post('/query/seller-notifications', {
      queryName: 'SellerNotification.allNotifications',
      pageNum: 1,
      numRowsInPage: 20,
      sortCriteria: [{ name: 'createdTime', ascendingOrder: false }],
      filters: { type: 'ALL', readStatus: 'ALL' },
    }),
  ]);

  return (
    <>
      <NotificationStats data={unwrap(stats)} />
      <NotificationsList data={unwrap(notifications)} />
    </>
  );
}

// Client component — actions
async function markAsRead(notifId: string) {
  return api.patch(`/seller/notifications/${notifId}/read`);
}

async function deleteNotification(notifId: string) {
  return api.delete(`/seller/notifications/${notifId}`);
}

async function bulkMarkRead(ids: string[]) {
  return api.post('/seller/notifications/bulk-read', { notificationIds: ids });
}

async function markAllRead() {
  return api.post('/seller/notifications/mark-all-read');
}

async function bulkDelete(ids: string[]) {
  return api.post('/seller/notifications/bulk-delete', { notificationIds: ids });
}
```

---

## Backend Endpoints

| Endpoint | Exists? | Backend Module |
|----------|---------|---------------|
| `GET /seller/notifications/stats` | New | notification service (aggregation) |
| `POST /query/seller-notifications` | New | notification-query module (MyBatis) |
| `PATCH /seller/notifications/{id}/read` | New | notification service |
| `PATCH /seller/notifications/{id}/unread` | New | notification service |
| `DELETE /seller/notifications/{id}` | New | notification service |
| `POST /seller/notifications/bulk-read` | New | notification service |
| `POST /seller/notifications/mark-all-read` | New | notification service |
| `POST /seller/notifications/bulk-delete` | New | notification service |

**MyBatis mappers needed:**
- `SellerNotification.allNotifications` — in `notification-query/mapper/seller-notification.xml`
- `SellerNotification.allNotifications-count` — count query
- `SellerNotification.unreadOnly` — canned report
- `SellerNotification.orderNotifications` — canned report

**JSON definitions needed:**
- `seller-notification.json` — query metadata for SellerNotification queries
