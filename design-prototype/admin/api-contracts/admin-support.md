# Admin Support Center — API Contract

## Page: admin-support.html

**Note:** Support tickets use Chenile `SearchRequest/SearchResponse` for the list. Stats use GET. Ticket state transitions use PATCH with STM event IDs. Ticket states: `OPEN -> IN_PROGRESS -> ESCALATED | RESOLVED -> CLOSED`. Ticket types: `Customer | Seller`. Priorities: `Low | Medium | High`.

---

## Section 1: Support Stats (4 cards)

**API:** `GET /api/admin/support/stats`
**Fetch/XHR name:** `support-stats`

**Response:**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "open": 12,
    "escalated": 4,
    "avgResponseHours": 2.1,
    "slaBreaches": 2
  }
}
```

---

## Section 2: Ticket List Table

**API:** `POST /api/query/admin-tickets`
**Fetch/XHR name:** `admin-tickets`

**Request (SearchRequest):**
```json
{
  "queryName": "AdminTicket.list",
  "pageNum": 1,
  "numRowsInPage": 20,
  "sortCriteria": [{ "name": "createdDate", "ascendingOrder": false }],
  "filters": {
    "status": "all",
    "search": ""
  }
}
```

**Filter `status` values:** `all | open | escalated | resolved | closed`

**Response (SearchResponse):**
```json
{
  "list": [
    {
      "row": {
        "id": "TK-1201",
        "customerOrSeller": "Ananya Singh",
        "type": "Customer",
        "subject": "Order not delivered after 10 days",
        "priority": "High",
        "status": "Escalated",
        "assignedTo": "Rahul K.",
        "createdDate": "2026-03-27"
      },
      "allowedActions": ["reply", "resolve", "reassign"]
    }
  ],
  "totalCount": 32,
  "numRowsInPage": 20
}
```

---

## Section 3: Ticket Detail (Modal)

**API:** `GET /api/admin/support/tickets/{ticketId}`
**Fetch/XHR name:** `ticket-detail`

**Response (StateEntityServiceResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "TK-1201",
    "customerOrSeller": { "name": "Ananya Singh", "type": "Customer", "email": "ananya@email.com" },
    "subject": "Order not delivered after 10 days",
    "priority": "High",
    "status": "Escalated",
    "assignedTo": { "id": "AGENT-001", "name": "Rahul K." },
    "createdDate": "2026-03-27",
    "thread": [
      { "author": "Ananya Singh", "role": "customer", "message": "My order #HB-78102 shows delivered but I never received it.", "timestamp": "2026-03-27T10:00:00Z" },
      { "author": "Rahul K.", "role": "agent", "message": "I've initiated an investigation with the carrier.", "timestamp": "2026-03-27T12:30:00Z" }
    ],
    "relatedEntities": { "orderId": "HB-78102" },
    "allowedActions": ["reply", "resolve", "reassign", "escalate", "close"]
  }
}
```

---

## Command: Create Ticket

**API:** `POST /api/admin/support/tickets`
**Fetch/XHR name:** `create-ticket`

**Request:**
```json
{
  "customerOrSellerId": "USR-05678",
  "type": "Customer",
  "subject": "Payment issue - double charged",
  "priority": "High",
  "message": "Customer reports being charged twice for order #HB-78400",
  "assignTo": "AGENT-001"
}
```

---

## Command: Reply to Ticket

**API:** `POST /api/admin/support/tickets/{ticketId}/reply`
**Fetch/XHR name:** `reply-ticket`

**Request:**
```json
{ "message": "We have verified the duplicate charge and initiated a refund.", "attachments": [] }
```

---

## Command: Assign/Reassign Ticket

**API:** `PATCH /api/admin/support/tickets/{ticketId}/assign`
**Fetch/XHR name:** `assign-ticket`

**Request:**
```json
{ "agentId": "AGENT-002" }
```

---

## Command: Resolve Ticket (STM Action)

**API:** `PATCH /api/admin/support/tickets/{ticketId}/resolve`
**Fetch/XHR name:** `resolve-ticket`

**Request:**
```json
{ "resolution": "Carrier confirmed delivery to wrong address. Full refund issued." }
```

---

## Command: Close Ticket (STM Action)

**API:** `PATCH /api/admin/support/tickets/{ticketId}/close`
**Fetch/XHR name:** `close-ticket`

---

## Allowed Actions Mapping (STM)

| Current State | Allowed Actions | Buttons |
|---------------|----------------|---------|
| `OPEN` | `reply`, `assign`, `escalate`, `resolve` | Reply, Assign, Escalate |
| `IN_PROGRESS` | `reply`, `reassign`, `escalate`, `resolve` | Reply, Reassign |
| `ESCALATED` | `reply`, `reassign`, `resolve` | Reply, Resolve |
| `RESOLVED` | `close`, `reopen` | Close |
| `CLOSED` | `reopen` | Reopen |

---

## Section 4: Knowledge Base

**API:** `GET /api/admin/support/knowledge-base?search={query}`
**Fetch/XHR name:** `knowledge-base`

**Response:**
```json
{
  "success": true,
  "payload": [
    { "id": "KB-001", "title": "How to process a manual refund", "category": "Refunds", "views": 245 },
    { "id": "KB-002", "title": "Seller onboarding troubleshooting", "category": "Sellers", "views": 189 }
  ]
}
```

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name |
|---|---------|-------------|--------|----------------|
| 1 | Stats | `/api/admin/support/stats` | GET | `support-stats` |
| 2 | Ticket List | `POST /api/query/admin-tickets` | POST (Chenile) | `admin-tickets` |
| 3 | Ticket Detail | `/api/admin/support/tickets/{id}` | GET | `ticket-detail` |
| 4 | Create Ticket | `POST /api/admin/support/tickets` | POST | `create-ticket` |
| 5 | Reply | `POST /api/admin/support/tickets/{id}/reply` | POST | `reply-ticket` |
| 6 | Assign | `PATCH /api/admin/support/tickets/{id}/assign` | PATCH | `assign-ticket` |
| 7 | Resolve | `PATCH /api/admin/support/tickets/{id}/resolve` | PATCH (STM) | `resolve-ticket` |
| 8 | Close | `PATCH /api/admin/support/tickets/{id}/close` | PATCH (STM) | `close-ticket` |
| 9 | Knowledge Base | `/api/admin/support/knowledge-base` | GET | `knowledge-base` |

**Total API calls on page load: 2 (stats + tickets in parallel)**
