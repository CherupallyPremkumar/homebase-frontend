# Seller Profile — API Contract

## Page: seller-profile.html

**Note:** All profile endpoints use standard REST GET/PUT with `GenericResponse` wrapper. These are simple CRUD operations, not Chenile query or STM entities.

---

## Section 1: Profile Banner & Completion

**Description:** Profile header with avatar, name, seller badge, and completion percentage
**API:** `GET /api/seller/profile`
**Fetch/XHR name:** `profile`

**Response:**
```json
{
  "personal": {
    "fullName": "Rajesh Kumar",
    "email": "rajesh@rajeshstore.com",
    "phone": "+91 98765 43210",
    "alternatePhone": "+91 98765 43211",
    "avatar": "/images/avatars/rajesh.jpg",
    "initials": "RS",
    "dateOfBirth": "1985-06-15"
  },
  "business": {
    "storeName": "Rajesh Store",
    "businessType": "Sole Proprietorship",
    "gstin": "22AAAAA0000A1Z5",
    "panNumber": "ABCDE1234F",
    "businessAddress": "Shop No. 42, Ground Floor, Lajpat Nagar Market, New Delhi - 110024, India",
    "registrationDate": "2024-08-15",
    "sellerTier": "Premium Seller",
    "sellerScore": 4.6,
    "totalProducts": 89,
    "totalOrders": 1234
  },
  "bank": {
    "accountHolderName": "Rajesh Kumar",
    "bankName": "State Bank of India",
    "accountNumberMasked": "XXXX XXXX 4523",
    "ifscCode": "SBIN0001234",
    "branchName": "Lajpat Nagar Branch",
    "accountType": "CURRENT",
    "isVerified": true
  },
  "storeInfo": {
    "description": "Welcome to Rajesh Store! We offer a curated selection of high-quality electronics, fashion, and lifestyle products.",
    "returnPolicy": "We accept returns within 7 days of delivery for all products in original packaging and unused condition. Refunds are processed within 5-7 business days.",
    "categories": ["Electronics", "Fashion", "Home & Living"]
  },
  "completionPercent": 85,
  "missingFields": ["alternatePhone", "dateOfBirth"]
}
```

---

## Section 2: Update Personal Info

**Description:** Update personal details — name, email, phone, DOB
**API:** `PUT /api/seller/profile/personal`
**Fetch/XHR name:** `personal`

**Request Body:**
```json
{
  "fullName": "Rajesh Kumar",
  "email": "rajesh@rajeshstore.com",
  "phone": "+91 98765 43210",
  "alternatePhone": "+91 98765 43211",
  "dateOfBirth": "1985-06-15"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Personal information updated successfully"
}
```

---

## Section 3: Update Business Info

**Description:** Update registered business details
**API:** `PUT /api/seller/profile/business`
**Fetch/XHR name:** `business`

**Request Body:**
```json
{
  "storeName": "Rajesh Store",
  "businessType": "Sole Proprietorship",
  "gstin": "22AAAAA0000A1Z5",
  "panNumber": "ABCDE1234F",
  "businessAddress": "Shop No. 42, Ground Floor, Lajpat Nagar Market, New Delhi - 110024, India"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Business information updated successfully"
}
```

---

## Section 4: Update Bank Details

**Description:** Update bank account for payouts (requires additional verification)
**API:** `PUT /api/seller/profile/bank`
**Fetch/XHR name:** `bank`

**Request Body:**
```json
{
  "accountHolderName": "Rajesh Kumar",
  "bankName": "State Bank of India",
  "accountNumber": "12345678904523",
  "ifscCode": "SBIN0001234",
  "branchName": "Lajpat Nagar Branch",
  "accountType": "CURRENT"
}
```

**Response:**
```json
{
  "success": true,
  "verificationRequired": true,
  "message": "Bank details submitted. Verification will be completed within 24-48 hours."
}
```

---

## Section 5: Update Store Description & Policies

**Description:** Update store description and return policy
**API:** `PUT /api/seller/profile/store-info`
**Fetch/XHR name:** `store-info`

**Request Body:**
```json
{
  "description": "Welcome to Rajesh Store! We offer a curated selection of high-quality products.",
  "returnPolicy": "We accept returns within 7 days of delivery..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Store information updated successfully"
}
```

---

## Section 6: Upload Avatar

**Description:** Upload or update profile/store avatar
**API:** `POST /api/seller/profile/avatar`
**Fetch/XHR name:** `avatar`

**Request:** `multipart/form-data` with `file` field

**Response:**
```json
{
  "avatarUrl": "/images/avatars/rajesh-new.jpg",
  "message": "Avatar updated successfully"
}
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Full Profile | `/api/seller/profile` | GET | 60s |
| 2 | Update Personal | `/api/seller/profile/personal` | PUT | — |
| 3 | Update Business | `/api/seller/profile/business` | PUT | — |
| 4 | Update Bank | `/api/seller/profile/bank` | PUT | — |
| 5 | Update Store Info | `/api/seller/profile/store-info` | PUT | — |
| 6 | Upload Avatar | `/api/seller/profile/avatar` | POST | — |

**Total API calls on page load: 1**

---

## Frontend Integration Pattern

```typescript
// In Next.js page (server component)
export default async function SellerProfile() {
  const profile = await sellerApi.profile();

  return (
    <>
      <ProfileBanner data={profile} />
      <CompletionBar percent={profile.completionPercent} />
      <PersonalInfoSection data={profile.personal} />
      <BusinessInfoSection data={profile.business} />
      <StoreInfoSection data={profile.storeInfo} />
      <BankDetailsSection data={profile.bank} />
    </>
  );
}
```

---

## Existing Backend Endpoints

These endpoints already exist in `packages/api-client/src/`:
- `profile.ts` -> `profileApi.get()` — may provide partial data

**New endpoints needed:**
1. `GET /api/seller/profile` — full profile data
2. `PUT /api/seller/profile/personal` — update personal info
3. `PUT /api/seller/profile/business` — update business info
4. `PUT /api/seller/profile/bank` — update bank details
5. `PUT /api/seller/profile/store-info` — update store description/policies
6. `POST /api/seller/profile/avatar` — upload avatar
