# Seller Store Settings — API Contract

## Page: seller-store-settings.html

**Note:** All store settings endpoints use standard REST GET/PUT with `GenericResponse` wrapper. These are simple CRUD settings, not Chenile query or STM entities.

---

## Section 1: Store Appearance (Banner, Logo, Theme Color)

**Description:** Visual customization — banner image, logo, accent color, and layout theme
**API (Read):** `GET /api/seller/store-settings/appearance`
**Fetch/XHR name:** `appearance`

**Response:**
```json
{
  "bannerUrl": "/images/store/banner.jpg",
  "logoUrl": "/images/store/logo.png",
  "accentColor": "#F97316",
  "theme": "classic",
  "availableThemes": [
    { "id": "classic", "name": "Classic", "description": "Traditional grid layout with sidebar categories" },
    { "id": "modern", "name": "Modern", "description": "Full-width hero with featured collections" },
    { "id": "minimal", "name": "Minimal", "description": "Clean, whitespace-focused with large product images" }
  ]
}
```

**API (Update):** `PUT /api/seller/store-settings/appearance`
**Fetch/XHR name:** `appearance`

**Request Body:**
```json
{
  "accentColor": "#F97316",
  "theme": "classic"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appearance settings updated successfully"
}
```

**API (Upload Banner):** `POST /api/seller/store-settings/banner`
**Fetch/XHR name:** `banner`

**Request:** `multipart/form-data` with `file` field
- Recommended: 1200x300px, max 5MB, JPG/PNG

**Response:**
```json
{
  "bannerUrl": "/images/store/banner-new.jpg",
  "message": "Banner uploaded successfully"
}
```

**API (Upload Logo):** `POST /api/seller/store-settings/logo`
**Fetch/XHR name:** `logo`

**Request:** `multipart/form-data` with `file` field
- Recommended: 400x400px, max 2MB, JPG/PNG

**Response:**
```json
{
  "logoUrl": "/images/store/logo-new.png",
  "message": "Logo uploaded successfully"
}
```

---

## Section 2: Store Information

**Description:** Store name, tagline, description, contact email, phone, address
**API (Read):** `GET /api/seller/store-settings/info`
**Fetch/XHR name:** `info`

**Response:**
```json
{
  "storeName": "Rajesh Store",
  "tagline": "Quality products at the best prices",
  "description": "Welcome to Rajesh Store! We are a premium seller offering a curated selection of high-quality electronics, fashion, and lifestyle products. With over 5 years of experience, we pride ourselves on exceptional customer service and fast shipping across India.",
  "contactEmail": "rajesh@rajeshstore.com",
  "contactPhone": "+91 98765 43210",
  "address": "Shop No. 42, Ground Floor, Lajpat Nagar Market, New Delhi - 110024, India"
}
```

**API (Update):** `PUT /api/seller/store-settings/info`
**Fetch/XHR name:** `info`

**Request Body:** Same structure as read response.

**Response:**
```json
{
  "success": true,
  "message": "Store information updated successfully"
}
```

---

## Section 3: Business Hours

**Description:** Store operating schedule with day-by-day hours and vacation mode
**API (Read):** `GET /api/seller/store-settings/hours`
**Fetch/XHR name:** `hours`

**Response:**
```json
{
  "vacationMode": false,
  "vacationMessage": "",
  "schedule": [
    { "day": "Monday", "isOpen": true, "openTime": "09:00", "closeTime": "21:00" },
    { "day": "Tuesday", "isOpen": true, "openTime": "09:00", "closeTime": "21:00" },
    { "day": "Wednesday", "isOpen": true, "openTime": "09:00", "closeTime": "21:00" },
    { "day": "Thursday", "isOpen": true, "openTime": "09:00", "closeTime": "21:00" },
    { "day": "Friday", "isOpen": true, "openTime": "09:00", "closeTime": "21:00" },
    { "day": "Saturday", "isOpen": true, "openTime": "10:00", "closeTime": "20:00" },
    { "day": "Sunday", "isOpen": false, "openTime": null, "closeTime": null }
  ]
}
```

**API (Update):** `PUT /api/seller/store-settings/hours`
**Fetch/XHR name:** `hours`

**Request Body:** Same structure as read response.

**Response:**
```json
{
  "success": true,
  "message": "Business hours updated successfully"
}
```

---

## Section 4: Store Policies

**Description:** Shipping, return/refund, and privacy policies
**API (Read):** `GET /api/seller/store-settings/policies`
**Fetch/XHR name:** `policies`

**Response:**
```json
{
  "shippingPolicy": "We ship all orders within 1-2 business days. Free shipping on orders above Rs. 999...",
  "returnPolicy": "We accept returns within 7 days of delivery for all products in original packaging...",
  "privacyPolicy": "Your data is safe with us. We do not share personal information with third parties..."
}
```

**API (Update):** `PUT /api/seller/store-settings/policies`
**Fetch/XHR name:** `policies`

**Request Body:** Same structure as read response.

**Response:**
```json
{
  "success": true,
  "message": "Store policies updated successfully"
}
```

---

## Section 5: Social Media Links

**Description:** Connect social media profiles to the storefront
**API (Read):** `GET /api/seller/store-settings/social`
**Fetch/XHR name:** `social`

**Response:**
```json
{
  "instagram": "https://instagram.com/rajeshstore",
  "facebook": "https://facebook.com/rajeshstore",
  "twitter": "",
  "youtube": ""
}
```

**API (Update):** `PUT /api/seller/store-settings/social`
**Fetch/XHR name:** `social`

**Request Body:** Same structure as read response.

**Response:**
```json
{
  "success": true,
  "message": "Social media links updated successfully"
}
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1a | Appearance (Read) | `/api/seller/store-settings/appearance` | GET | 60s |
| 1b | Appearance (Update) | `/api/seller/store-settings/appearance` | PUT | — |
| 1c | Upload Banner | `/api/seller/store-settings/banner` | POST | — |
| 1d | Upload Logo | `/api/seller/store-settings/logo` | POST | — |
| 2a | Store Info (Read) | `/api/seller/store-settings/info` | GET | 60s |
| 2b | Store Info (Update) | `/api/seller/store-settings/info` | PUT | — |
| 3a | Business Hours (Read) | `/api/seller/store-settings/hours` | GET | 60s |
| 3b | Business Hours (Update) | `/api/seller/store-settings/hours` | PUT | — |
| 4a | Policies (Read) | `/api/seller/store-settings/policies` | GET | 60s |
| 4b | Policies (Update) | `/api/seller/store-settings/policies` | PUT | — |
| 5a | Social Media (Read) | `/api/seller/store-settings/social` | GET | 60s |
| 5b | Social Media (Update) | `/api/seller/store-settings/social` | PUT | — |

**Total API calls on page load: 5 (parallel — appearance, info, hours, policies, social)**

---

## Frontend Integration Pattern

```typescript
// In Next.js page (server component)
export default async function SellerStoreSettings() {
  const [appearance, info, hours, policies, social] = await Promise.allSettled([
    sellerApi.storeAppearance(),
    sellerApi.storeInfo(),
    sellerApi.storeHours(),
    sellerApi.storePolicies(),
    sellerApi.storeSocial(),
  ]);

  return (
    <>
      <AppearanceSection data={appearance} />
      <StoreInfoSection data={info} />
      <BusinessHoursSection data={hours} />
      <PoliciesSection data={policies} />
      <SocialMediaSection data={social} />
    </>
  );
}
```

---

## Existing Backend Endpoints

These endpoints already exist in `packages/api-client/src/`:
- None specific to store settings

**New endpoints needed:**
1. `GET/PUT /api/seller/store-settings/appearance` — appearance config
2. `POST /api/seller/store-settings/banner` — banner upload
3. `POST /api/seller/store-settings/logo` — logo upload
4. `GET/PUT /api/seller/store-settings/info` — store info
5. `GET/PUT /api/seller/store-settings/hours` — business hours
6. `GET/PUT /api/seller/store-settings/policies` — store policies
7. `GET/PUT /api/seller/store-settings/social` — social media links
