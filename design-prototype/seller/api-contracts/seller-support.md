# Seller Support — API Contract

## Page: seller-support.html

**Note:** Ticket list uses Chenile's `SearchRequest/SearchResponse` pattern via POST. Ticket creation uses POST command. Retrieve uses GET with `StateEntityServiceResponse`. Stats use REST GET.

---

## Section 1: Stats Cards (4 cards)

**Description:** Ticket counts — open, in progress, resolved, average resolution time
**API:** `GET /api/seller/support/stats`
**Fetch/XHR name:** `stats`

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "open": 2,
    "inProgress": 2,
    "resolved": 1,
    "totalTickets": 50,
    "averageResolutionTime": { "value": 4.2, "unit": "hours" }
  }
}
```

---

## Section 2: Ticket List (search, filter, paginate — Chenile Query)

**Description:** Support ticket list with priority badges, status, and search
**API:** `POST /api/query/seller-support`
**Fetch/XHR name:** `seller-support`

**Request (SearchRequest):**
```json
{
  "queryName": "SellerSupport.allTickets",
  "pageNum": 1,
  "numRowsInPage": 10,
  "sortCriteria": [
    { "name": "updatedTime", "ascendingOrder": false }
  ],
  "filters": {
    "q": "",
    "status": "ALL",
    "priority": "ALL",
    "category": "ALL"
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
          "id": "TKT-1042",
          "title": "Order #ORD-8834 not delivered but marked as completed",
          "category": "Order Issue",
          "priority": "HIGH",
          "stateId": "OPEN",
          "replyCount": 4,
          "attachmentCount": 2,
          "assignedTo": "Support Team A",
          "updatedTime": "2026-03-28T08:00:00Z",
          "updatedTimeRelative": "2 hours ago",
          "createdTime": "2026-03-27T10:00:00Z"
        },
        "allowedActions": [
          { "allowedAction": "reply", "acls": "SELLER" },
          { "allowedAction": "close", "acls": "SELLER" }
        ]
      }
    ],
    "currentPage": 1,
    "maxPages": 5,
    "maxRows": 50,
    "numRowsInPage": 10,
    "numRowsReturned": 10,
    "startRow": 1,
    "endRow": 10,
    "columnMetadata": {
      "title": { "name": "Title", "columnType": "Text", "filterable": true, "sortable": true, "display": true },
      "priority": { "name": "Priority", "columnType": "Text", "filterable": true, "sortable": true, "display": true },
      "stateId": { "name": "Status", "columnType": "Text", "filterable": true, "sortable": true, "display": true },
      "updatedTime": { "name": "Last Updated", "columnType": "Date", "filterable": true, "sortable": true, "display": true }
    },
    "hiddenColumns": ["id"],
    "availableCannedReports": [
      { "name": "allTickets", "description": "All tickets" },
      { "name": "openTickets", "description": "Open tickets" }
    ]
  }
}
```

---

## Section 3: View Ticket Detail (Slide-over — Command Retrieve)

**Description:** Full ticket detail with conversation thread
**API:** `GET /api/support/{id}`
**Fetch/XHR name:** `support/{id}`

**Response (GenericResponse<StateEntityServiceResponse<SupportTicket>>):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "mutatedEntity": {
      "id": "TKT-1042",
      "title": "Order #ORD-8834 not delivered but marked as completed",
      "description": "The order was marked as delivered but the customer says they never received it.",
      "category": "Order Issue",
      "priority": "HIGH",
      "stateId": "OPEN",
      "assignedTo": "Support Team A",
      "attachments": [
        { "id": "att-001", "fileName": "screenshot.png", "fileUrl": "/uploads/tickets/screenshot.png", "fileSize": 245760 }
      ],
      "replies": [
        { "id": "reply-001", "sender": "SELLER", "senderName": "Rajesh Store", "text": "I need help with this order.", "timestamp": "2026-03-27T10:00:00Z" },
        { "id": "reply-002", "sender": "SUPPORT", "senderName": "Support Team A", "text": "We are looking into this.", "timestamp": "2026-03-27T11:30:00Z" }
      ],
      "createdTime": "2026-03-27T10:00:00Z",
      "updatedTime": "2026-03-28T08:00:00Z"
    },
    "allowedActionsAndMetadata": [
      { "allowedAction": "reply", "acls": "SELLER" },
      { "allowedAction": "close", "acls": "SELLER" }
    ]
  }
}
```

---

## Section 4: Create Ticket (Command Create)

**Description:** Submit a new support ticket
**API:** `POST /api/support`
**Fetch/XHR name:** `support`

**Request Body:**
```json
{
  "title": "Settlement payment delayed for March cycle",
  "description": "My March settlement was expected on March 28 but has not been processed yet.",
  "category": "PAYMENT",
  "priority": "HIGH",
  "attachmentIds": ["att-010"]
}
```

**Response (GenericResponse<StateEntityServiceResponse<SupportTicket>>):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "mutatedEntity": {
      "id": "TKT-1043",
      "title": "Settlement payment delayed for March cycle",
      "stateId": "OPEN"
    },
    "allowedActionsAndMetadata": [
      { "allowedAction": "reply", "acls": "SELLER" },
      { "allowedAction": "close", "acls": "SELLER" }
    ]
  }
}
```

---

## Section 5: Reply to Ticket

**Description:** Add a reply to an existing ticket
**API:** `POST /api/support/{id}/reply`
**Fetch/XHR name:** `support/{id}/reply`

**Request Body:**
```json
{
  "text": "Here is the additional information you requested.",
  "attachmentIds": ["att-011"]
}
```

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "reply-005",
    "sender": "SELLER",
    "senderName": "Rajesh Store",
    "text": "Here is the additional information you requested.",
    "timestamp": "2026-03-28T12:00:00Z"
  }
}
```

---

## Section 6: Upload Ticket Attachment

**Description:** Upload a file for ticket attachment
**API:** `POST /api/support/attachments`
**Fetch/XHR name:** `attachments`

**Request:** `multipart/form-data` with `file` field

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "att-011",
    "fileName": "evidence.pdf",
    "fileUrl": "/uploads/tickets/evidence.pdf",
    "fileSize": 512000,
    "mimeType": "application/pdf"
  }
}
```

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name | Type | Cache |
|---|---------|-------------|--------|----------------|------|-------|
| 1 | Stats Cards | `/api/seller/support/stats` | GET | `stats` | REST | 30s |
| 2 | Ticket List | `/api/query/seller-support` | POST | `seller-support` | Chenile Query | 30s |
| 3 | Ticket Detail | `/api/support/{id}` | GET | `support/{id}` | Command Retrieve | 15s |
| 4 | Create Ticket | `/api/support` | POST | `support` | Command Create | — |
| 5 | Reply to Ticket | `/api/support/{id}/reply` | POST | `support/{id}/reply` | REST | — |
| 6 | Upload Attachment | `/api/support/attachments` | POST | `attachments` | REST | — |

**Total API calls on page load: 2 (parallel)**

---

## Frontend Integration Pattern

```typescript
// Server component
import { getApiClient } from '@homebase/api-client';

export default async function SellerSupport({ searchParams }) {
  const api = getApiClient();

  const [stats, tickets] = await Promise.allSettled([
    api.get('/seller/support/stats'),
    api.post('/query/seller-support', {
      queryName: 'SellerSupport.allTickets',
      pageNum: Number(searchParams.page) || 1,
      numRowsInPage: 10,
      sortCriteria: [{ name: 'updatedTime', ascendingOrder: false }],
      filters: {
        q: searchParams.q,
        status: searchParams.status || 'ALL',
        priority: searchParams.priority || 'ALL',
        category: searchParams.category || 'ALL',
      },
    }),
  ]);

  return (
    <>
      <StatsCards data={unwrap(stats)} />
      <TicketList data={unwrap(tickets)} />
      <CreateTicketModal />
      <TicketDetailSlideOver /> {/* Client component, loads on click */}
    </>
  );
}
```

---

## Backend Endpoints

| Endpoint | Exists? | Backend Module |
|----------|---------|---------------|
| `GET /seller/support/stats` | New | seller service (aggregation) |
| `POST /query/seller-support` | New | support-query module (MyBatis) |
| `GET /support/{id}` | New | support service (Command Retrieve) |
| `POST /support` | New | support service (Command Create) |
| `POST /support/{id}/reply` | New | support service |
| `POST /support/attachments` | New | support service |

---

## Allowed Actions -> UI Mapping

The backend returns `allowedActions` per row based on the entity's current state (STM).
The frontend reads these and renders only the allowed buttons.

**STM Source:** `support-states.xml` (support-flow)
**Seller ACL filter:** Sellers interact as `CUSTOMER` role in support tickets. They can escalate and reply to tickets, and reopen resolved ones.

### State -> Allowed Actions -> UI Buttons

| State | allowedActions (seller-visible) | UI Button | Icon | Color | Event ID |
|-------|-------------------------------|-----------|------|-------|----------|
| OPEN | escalate | Escalate | ArrowUpCircle | red | escalate |
| ASSIGNED | reply | Reply | MessageSquare | blue | reply |
| ASSIGNED | escalate | Escalate | ArrowUpCircle | red | escalate |
| IN_PROGRESS | reply | Reply | MessageSquare | blue | reply |
| IN_PROGRESS | escalate | Escalate | ArrowUpCircle | red | escalate |
| WAITING_ON_CUSTOMER | resumeWork | Reply | MessageSquare | blue | resumeWork |
| WAITING_ON_CUSTOMER | escalate | Escalate | ArrowUpCircle | red | escalate |
| ESCALATED | reply | Reply | MessageSquare | blue | reply |
| RESOLVED | reopen | Reopen Ticket | RotateCcw | amber | reopen |
| CLOSED | -- | (read-only, terminal) | -- | -- | -- |
| REOPENED | escalate | Escalate | ArrowUpCircle | red | escalate |

### Frontend Pattern

```typescript
const SELLER_SUPPORT_ACTION_CONFIG: Record<string, ActionButtonConfig> = {
  escalate: { label: 'Escalate', icon: 'ArrowUpCircle', color: 'red' },
  reply: { label: 'Reply', icon: 'MessageSquare', color: 'blue' },
  resumeWork: { label: 'Reply', icon: 'MessageSquare', color: 'blue' },
  reopen: { label: 'Reopen Ticket', icon: 'RotateCcw', color: 'amber' },
};

// Render only allowed actions
{allowedActions.map(a => {
  const config = SELLER_SUPPORT_ACTION_CONFIG[a.allowedAction];
  return config ? <ActionButton {...config} onClick={() => triggerEvent(id, a.allowedAction)} /> : null;
})}
```
