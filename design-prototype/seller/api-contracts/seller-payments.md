# Seller Payments — API Contract

## Page: seller-payments.html

**Note:** Most payment settings use standard REST GET/PUT with `GenericResponse` wrapper. Payment history table uses Chenile's `SearchRequest/SearchResponse` pattern via POST.

---

## Section 1: Payout Schedule

**Description:** Configure payout frequency and minimum threshold
**API (Read):** `GET /api/seller/payments/payout-schedule`
**Fetch/XHR name:** `payout-schedule`

**Response:**
```json
{
  "frequency": "WEEKLY",
  "dayOfWeek": "FRIDAY",
  "minimumPayout": 1000,
  "holdPeriod": 7,
  "availableFrequencies": ["DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY"],
  "nextPayoutDate": "2026-04-04",
  "nextPayoutEstimate": 45680
}
```

**API (Update):** `PUT /api/seller/payments/payout-schedule`
**Fetch/XHR name:** `payout-schedule`

**Request Body:**
```json
{
  "frequency": "WEEKLY",
  "dayOfWeek": "FRIDAY",
  "minimumPayout": 1000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payout schedule updated successfully"
}
```

---

## Section 2: Bank Accounts (CRUD)

**Description:** Manage linked bank accounts for payouts — list, add, edit, delete, set primary
**API (List):** `GET /api/seller/payments/bank-accounts`
**Fetch/XHR name:** `bank-accounts`

**Response:**
```json
{
  "accounts": [
    {
      "id": "ba-001",
      "bankName": "State Bank of India",
      "accountHolderName": "Rajesh Kumar",
      "accountNumberMasked": "XXXX XXXX 4523",
      "ifscCode": "SBIN0001234",
      "branchName": "Lajpat Nagar Branch",
      "accountType": "CURRENT",
      "isPrimary": true,
      "isVerified": true,
      "addedAt": "2024-08-15T10:00:00Z"
    },
    {
      "id": "ba-002",
      "bankName": "HDFC Bank",
      "accountHolderName": "Rajesh Kumar",
      "accountNumberMasked": "XXXX XXXX 8901",
      "ifscCode": "HDFC0001234",
      "branchName": "Connaught Place Branch",
      "accountType": "SAVINGS",
      "isPrimary": false,
      "isVerified": true,
      "addedAt": "2025-02-10T14:00:00Z"
    }
  ]
}
```

**API (Add):** `POST /api/seller/payments/bank-accounts`
**Fetch/XHR name:** `bank-accounts`

**Request Body:**
```json
{
  "bankName": "ICICI Bank",
  "accountHolderName": "Rajesh Kumar",
  "accountNumber": "1234567890",
  "ifscCode": "ICIC0001234",
  "branchName": "Main Branch",
  "accountType": "SAVINGS"
}
```

**Response:**
```json
{
  "id": "ba-003",
  "bankName": "ICICI Bank",
  "isVerified": false,
  "message": "Bank account added. Verification penny drop will be initiated within 24 hours."
}
```

**API (Delete):** `DELETE /api/seller/payments/bank-accounts/{id}`
**Fetch/XHR name:** `{id}`

**Response:**
```json
{
  "success": true,
  "message": "Bank account removed successfully"
}
```

**API (Set Primary):** `PUT /api/seller/payments/bank-accounts/{id}/primary`
**Fetch/XHR name:** `primary`

**Response:**
```json
{
  "id": "ba-002",
  "isPrimary": true,
  "message": "Primary account updated successfully"
}
```

---

## Section 3: UPI Settings

**Description:** Manage UPI payment IDs
**API (Read):** `GET /api/seller/payments/upi`
**Fetch/XHR name:** `upi`

**Response:**
```json
{
  "upiIds": [
    {
      "id": "upi-001",
      "upiId": "rajeshstore@sbi",
      "isVerified": true,
      "isPrimary": true
    }
  ]
}
```

**API (Add):** `POST /api/seller/payments/upi`
**Fetch/XHR name:** `upi`

**Request Body:**
```json
{
  "upiId": "rajesh@hdfc"
}
```

**Response:**
```json
{
  "id": "upi-002",
  "upiId": "rajesh@hdfc",
  "isVerified": false,
  "message": "UPI ID added. Verification payment will be initiated."
}
```

**API (Delete):** `DELETE /api/seller/payments/upi/{id}`
**Fetch/XHR name:** `{id}`

**Response:**
```json
{
  "success": true,
  "message": "UPI ID removed successfully"
}
```

---

## Section 4: Tax Information

**Description:** GST, PAN, and TDS information for tax compliance
**API (Read):** `GET /api/seller/payments/tax-info`
**Fetch/XHR name:** `tax-info`

**Response:**
```json
{
  "gstin": "22AAAAA0000A1Z5",
  "gstStatus": "VERIFIED",
  "panNumber": "ABCDE1234F",
  "panStatus": "VERIFIED",
  "tdsRate": 1,
  "tdsApplicable": true,
  "taxCertificate": {
    "fileUrl": "/uploads/tax/tds-certificate.pdf",
    "uploadedAt": "2026-01-15T10:00:00Z",
    "status": "VERIFIED"
  }
}
```

**API (Update):** `PUT /api/seller/payments/tax-info`
**Fetch/XHR name:** `tax-info`

**Request Body:**
```json
{
  "gstin": "22AAAAA0000A1Z5",
  "panNumber": "ABCDE1234F"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tax information updated. Verification in progress."
}
```

**API (Upload Tax Certificate):** `POST /api/seller/payments/tax-info/certificate`
**Fetch/XHR name:** `certificate`

**Request:** `multipart/form-data` with `file` field

**Response:**
```json
{
  "fileUrl": "/uploads/tax/tds-certificate-new.pdf",
  "status": "PENDING",
  "message": "Certificate uploaded. Verification will take 2-3 business days."
}
```

---

## Section 5: Payment History (Chenile Query)

**Description:** Recent payout transactions list
**API:** `POST /api/query/seller-payments`
**Fetch/XHR name:** `seller-payments`

**Request (SearchRequest):**
```json
{
  "queryName": "SellerPayment.history",
  "pageNum": 1,
  "numRowsInPage": 10,
  "sortCriteria": [
    { "name": "createdTime", "ascendingOrder": false }
  ],
  "filters": {
    "status": "ALL",
    "dateFrom": "",
    "dateTo": ""
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
          "id": "pay-001",
          "type": "PAYOUT",
          "description": "Weekly payout - 22 Mar to 28 Mar",
          "amount": 114540,
          "currency": "INR",
          "stateId": "COMPLETED",
          "bankAccount": "SBI XXXX4523",
          "referenceNumber": "UTR2026032800001",
          "createdTime": "2026-03-28T06:00:00Z",
          "completedTime": "2026-03-28T08:00:00Z"
        },
        "allowedActions": []
      }
    ],
    "currentPage": 1,
    "maxPages": 3,
    "maxRows": 24,
    "numRowsInPage": 10,
    "numRowsReturned": 10,
    "startRow": 1,
    "endRow": 10
  }
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1a | Payout Schedule (Read) | `/api/seller/payments/payout-schedule` | GET | 60s |
| 1b | Payout Schedule (Update) | `/api/seller/payments/payout-schedule` | PUT | — |
| 2a | Bank Accounts (List) | `/api/seller/payments/bank-accounts` | GET | 60s |
| 2b | Bank Account (Add) | `/api/seller/payments/bank-accounts` | POST | — |
| 2c | Bank Account (Delete) | `/api/seller/payments/bank-accounts/{id}` | DELETE | — |
| 2d | Bank Account (Set Primary) | `/api/seller/payments/bank-accounts/{id}/primary` | PUT | — |
| 3a | UPI (Read) | `/api/seller/payments/upi` | GET | 60s |
| 3b | UPI (Add) | `/api/seller/payments/upi` | POST | — |
| 3c | UPI (Delete) | `/api/seller/payments/upi/{id}` | DELETE | — |
| 4a | Tax Info (Read) | `/api/seller/payments/tax-info` | GET | 60s |
| 4b | Tax Info (Update) | `/api/seller/payments/tax-info` | PUT | — |
| 4c | Tax Certificate (Upload) | `/api/seller/payments/tax-info/certificate` | POST | — |
| 5 | Payment History | `/api/query/seller-payments` | POST (Chenile Query) | 30s |

**Total API calls on page load: 5 (parallel — payout schedule, bank accounts, UPI, tax info, payment history)**

---

## Frontend Integration Pattern

```typescript
// In Next.js page (server component)
export default async function SellerPayments() {
  const [payoutSchedule, bankAccounts, upi, taxInfo, history] = await Promise.allSettled([
    sellerApi.payoutSchedule(),
    sellerApi.bankAccounts(),
    sellerApi.upiSettings(),
    sellerApi.taxInfo(),
    sellerApi.paymentHistory({ pageSize: 10 }),
  ]);

  return (
    <>
      <PayoutScheduleSection data={payoutSchedule} />
      <UPISection data={upi} />
      <BankAccountsSection data={bankAccounts} />
      <TaxInfoSection data={taxInfo} />
      <PaymentHistorySection data={history} />
    </>
  );
}
```

---

## Existing Backend Endpoints

These endpoints already exist in `packages/api-client/src/`:
- None specific to seller payments

**New endpoints needed:**
1. `GET/PUT /api/seller/payments/payout-schedule` — payout config
2. `GET/POST/DELETE /api/seller/payments/bank-accounts` — bank account CRUD
3. `PUT /api/seller/payments/bank-accounts/{id}/primary` — set primary
4. `GET/POST/DELETE /api/seller/payments/upi` — UPI management
5. `GET/PUT /api/seller/payments/tax-info` — tax compliance
6. `POST /api/seller/payments/tax-info/certificate` — certificate upload
7. `GET /api/seller/payments/history` — payment history
