# Seller Messages — API Contract

## Page: seller-messages.html

**Note:** Conversation list uses Chenile's `SearchRequest/SearchResponse` pattern via POST. Individual conversation messages and messaging actions use standard REST. Real-time polling via SWR.

---

## Section 1: Conversation List (Left panel — Chenile Query)

**Description:** List of customer conversations with last message preview, unread count, and search
**API:** `POST /api/query/seller-conversations`
**Fetch/XHR name:** `seller-conversations`

**Request (SearchRequest):**
```json
{
  "queryName": "SellerSupport.conversations",
  "pageNum": 1,
  "numRowsInPage": 20,
  "sortCriteria": [
    { "name": "lastMessageTime", "ascendingOrder": false }
  ],
  "filters": {
    "q": "",
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
          "id": "conv-001",
          "customerId": "cust-042",
          "customerName": "Ankit Kumar",
          "customerInitials": "AK",
          "customerAvatar": null,
          "lastMessage": "Thanks for the quick response! I will check the tracking.",
          "lastMessageTime": "2026-03-28T10:15:00Z",
          "unreadCount": 2,
          "isStarred": false,
          "isOnline": true,
          "relatedOrderId": "HB-78234",
          "relatedProductName": "Wireless Bluetooth Speaker"
        },
        "allowedActions": [
          { "allowedAction": "reply", "acls": "SELLER" },
          { "allowedAction": "markRead", "acls": "SELLER" }
        ]
      }
    ],
    "currentPage": 1,
    "maxPages": 1,
    "maxRows": 15,
    "numRowsInPage": 20,
    "numRowsReturned": 15,
    "startRow": 1,
    "endRow": 15
  }
}
```

---

## Section 2: Messages in Conversation (Right panel)

**Description:** Message thread for a selected conversation
**API:** `GET /api/support/conversation/{id}`
**Fetch/XHR name:** `support/conversation/{id}`

**Query Params:**
- `pageNum` — page number for older messages (default 1)
- `pageSize` — messages per page (default 50)

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "conversationId": "conv-001",
    "customer": {
      "id": "cust-042",
      "name": "Ankit Kumar",
      "initials": "AK",
      "isOnline": true,
      "lastSeen": "2026-03-28T10:15:00Z"
    },
    "relatedOrder": {
      "id": "HB-78234",
      "status": "DELIVERED"
    },
    "messages": [
      {
        "id": "msg-001",
        "sender": "CUSTOMER",
        "text": "Hi, I placed an order yesterday. When will it be shipped?",
        "timestamp": "2026-03-27T14:30:00Z",
        "isRead": true
      },
      {
        "id": "msg-002",
        "sender": "SELLER",
        "text": "Hello Ankit! Your order #HB-78234 has been shipped. You can track it using tracking number DL123456789IN.",
        "timestamp": "2026-03-27T15:00:00Z",
        "isRead": true
      },
      {
        "id": "msg-003",
        "sender": "CUSTOMER",
        "text": "Thanks for the quick response! I will check the tracking.",
        "timestamp": "2026-03-28T10:15:00Z",
        "isRead": false
      }
    ],
    "totalMessages": 6,
    "hasMore": false
  }
}
```

---

## Section 3: Send Message

**Description:** Send a new message in a conversation
**API:** `POST /api/support/conversation/{id}/message`
**Fetch/XHR name:** `support/conversation/{id}/message`

**Request Body:**
```json
{
  "text": "You're welcome! Let me know if you need anything else.",
  "attachments": []
}
```

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "msg-004",
    "sender": "SELLER",
    "text": "You're welcome! Let me know if you need anything else.",
    "timestamp": "2026-03-28T11:00:00Z",
    "isRead": false
  }
}
```

---

## Section 4: Send Attachment

**Description:** Upload and send a file attachment in a conversation
**API:** `POST /api/support/conversation/{id}/attachments`
**Fetch/XHR name:** `support/conversation/{id}/attachments`

**Request:** `multipart/form-data` with `file` field

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "id": "msg-005",
    "sender": "SELLER",
    "text": "",
    "attachment": {
      "id": "att-001",
      "fileName": "invoice.pdf",
      "fileUrl": "/uploads/messages/invoice.pdf",
      "fileSize": 245760,
      "mimeType": "application/pdf"
    },
    "timestamp": "2026-03-28T11:05:00Z"
  }
}
```

---

## Section 5: Mark Conversation as Read (STM Event)

**Description:** Mark all messages in a conversation as read
**API:** `PATCH /api/support/{id}/markRead`
**Fetch/XHR name:** `support/{id}/markRead`

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "conversationId": "conv-001",
    "markedAsRead": 2
  }
}
```

---

## Section 6: Star/Unstar Conversation (STM Event)

**Description:** Toggle star status on a conversation
**API:** `PATCH /api/support/{id}/toggleStar`
**Fetch/XHR name:** `support/{id}/toggleStar`

**Request Body:**
```json
{
  "isStarred": true
}
```

**Response (GenericResponse):**
```json
{
  "success": true,
  "code": 200,
  "payload": {
    "conversationId": "conv-001",
    "isStarred": true
  }
}
```

---

## Summary

| # | Section | API Endpoint | Method | Fetch/XHR Name | Type | Cache |
|---|---------|-------------|--------|----------------|------|-------|
| 1 | Conversation List | `/api/query/seller-conversations` | POST | `seller-conversations` | Chenile Query | 15s |
| 2 | Messages Thread | `/api/support/conversation/{id}` | GET | `support/conversation/{id}` | REST | 10s |
| 3 | Send Message | `/api/support/conversation/{id}/message` | POST | `support/conversation/{id}/message` | REST | — |
| 4 | Send Attachment | `/api/support/conversation/{id}/attachments` | POST | `support/conversation/{id}/attachments` | REST | — |
| 5 | Mark as Read | `/api/support/{id}/markRead` | PATCH | `support/{id}/markRead` | STM Event | — |
| 6 | Star Conversation | `/api/support/{id}/toggleStar` | PATCH | `support/{id}/toggleStar` | STM Event | — |

**Total API calls on page load: 2 (conversation list + first conversation messages)**

---

## Frontend Integration Pattern

```typescript
// Client component for real-time messaging
'use client';

export default function SellerMessages() {
  const api = getApiClient();

  // Poll conversation list
  const { data: conversations } = useSWR('seller-conversations', () =>
    api.post('/query/seller-conversations', {
      queryName: 'SellerSupport.conversations',
      pageNum: 1,
      numRowsInPage: 20,
      sortCriteria: [{ name: 'lastMessageTime', ascendingOrder: false }],
      filters: {},
    }),
    { refreshInterval: 15000 }
  );

  const [selectedConv, setSelectedConv] = useState(null);

  const { data: messages } = useSWR(
    selectedConv ? `support/conversation/${selectedConv}` : null,
    () => api.get(`/support/conversation/${selectedConv}`),
    { refreshInterval: 10000 }
  );

  return (
    <div className="flex h-full">
      <ConversationList conversations={conversations} onSelect={setSelectedConv} />
      <ChatPanel messages={messages} onSend={handleSendMessage} />
    </div>
  );
}
```

---

## Backend Endpoints

| Endpoint | Exists? | Backend Module |
|----------|---------|---------------|
| `POST /query/seller-conversations` | New | support-query module (MyBatis) |
| `GET /support/conversation/{id}` | New | support service |
| `POST /support/conversation/{id}/message` | New | support service |
| `PATCH /support/{id}/{eventID}` | New | support service (STM) |
