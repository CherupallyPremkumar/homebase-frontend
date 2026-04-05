# Admin Notifications — API Contract

## Page: admin-notifications.html

**Note:** Notifications use Chenile `SearchRequest/SearchResponse` for the list. Stats use GET. Bulk actions (mark read, delete) use PATCH/DELETE. Notification types: `sellers | orders | products | system`.

---

## Section 1: Notification Stats (3 cards)

**API:** `GET /api/admin/notifications/stats`
**Fetch/XHR name:** `notification-stats`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "total": 142,
    "unread": 23,
    "today": 12
  }
}
```

---

## Section 2: Notification List

**API:** `POST /api/query/admin-notifications`
**Fetch/XHR name:** `admin-notifications`

**Request (SearchRequest):**
```json
{
  "queryName": "AdminNotification.list",
  "pageNum": 1,
  "numRowsInPage": 20,
  "sortCriteria": [{ "name": "timestamp", "ascendingOrder": false }],
  "filters": {
    "type": "all",
    "readStatus": "all",
    "search": ""
  }
}
```

**Filter values:**
- `type`: `all | orders | sellers | products | system`
- `readStatus`: `all | unread`

**Response (SearchResponse):**
```json
{
  "list": [
    {
      "row": {
        "id": "NOTIF-001",
        "type": "sellers",
        "title": "New Seller Registration",
        "message": "Sharma Electronics has applied for onboarding",
        "timestamp": "2026-03-28T10:22:00Z",
        "relativeTime": "8 minutes ago",
        "isRead": false,
        "icon": { "type": "store", "bgColor": "green-100", "iconColor": "green-600" },
        "navigateTo": "/admin/onboarding"
      }
    },
    {
      "row": {
        "id": "NOTIF-002",
        "type": "orders",
        "title": "Bulk Order Placed",
        "message": "Order #HB-78234 worth Rs.1,24,500 from Priya Enterprises",
        "timestamp": "2026-03-28T10:05:00Z",
        "relativeTime": "25 minutes ago",
        "isRead": false,
        "icon": { "type": "shopping-bag", "bgColor": "blue-100", "iconColor": "blue-600" },
        "navigateTo": "/admin/orders/HB-78234"
      }
    }
  ],
  "totalCount": 142,
  "numRowsInPage": 20
}
```

---

## Command: Mark as Read

**API:** `PATCH /api/admin/notifications/{notificationId}/read`
**Fetch/XHR name:** `mark-read`

**Request:** `{}`

**Response:**
```json
{ "success": true, "code": 200, "payload": { "id": "NOTIF-001", "isRead": true } }
```

---

## Command: Mark All as Read (Bulk)

**API:** `PATCH /api/admin/notifications/markAllRead`
**Fetch/XHR name:** `mark-all-read`

**Request:** `{}`

**Response:**
```json
{ "success": true, "code": 200, "payload": { "updatedCount": 23 } }
```

---

## Command: Delete Notification

**API:** `DELETE /api/admin/notifications/{notificationId}`
**Fetch/XHR name:** `delete-notification`

**Response:**
```json
{ "success": true, "code": 200 }
```

---

## Command: Delete Selected (Bulk)

**API:** `DELETE /api/admin/notifications/bulk`
**Fetch/XHR name:** `delete-notifications-bulk`

**Request:**
```json
{ "ids": ["NOTIF-001", "NOTIF-002", "NOTIF-003"] }
```

**Response:**
```json
{ "success": true, "code": 200, "payload": { "deletedCount": 3 } }
```

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name |
|---|---------|-------------|--------|----------------|
| 1 | Stats | `/api/admin/notifications/stats` | GET | `notification-stats` |
| 2 | List | `POST /api/query/admin-notifications` | POST (Chenile) | `admin-notifications` |
| 3 | Mark Read | `PATCH /api/admin/notifications/{id}/read` | PATCH | `mark-read` |
| 4 | Mark All Read | `PATCH /api/admin/notifications/markAllRead` | PATCH | `mark-all-read` |
| 5 | Delete | `DELETE /api/admin/notifications/{id}` | DELETE | `delete-notification` |
| 6 | Bulk Delete | `DELETE /api/admin/notifications/bulk` | DELETE | `delete-notifications-bulk` |

**Total API calls on page load: 2 (stats + list in parallel)**
