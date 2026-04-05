# HomeBase -- Comprehensive Form Validation Rules

All form validation rules for every interactive form across the Customer, Seller, Admin, and Warehouse apps. Each field specifies its type, constraints, error messages, and whether validation runs in real-time (on blur/change) or on submit. Zod schemas are provided for every form.

---

## Table of Contents

1. [Customer App Forms](#1-customer-app-forms)
   - [1.1 Login Form](#11-login-form)
   - [1.2 Register Form](#12-register-form)
   - [1.3 Checkout Address Form](#13-checkout-address-form)
   - [1.4 Coupon Code Input](#14-coupon-code-input)
   - [1.5 Search Input](#15-search-input)
   - [1.6 Product Review Form](#16-product-review-form)
   - [1.7 Return Request Form](#17-return-request-form)
2. [Seller App Forms](#2-seller-app-forms)
   - [2.1 Add/Edit Product Form](#21-addedit-product-form)
   - [2.2 Ship Order Form](#22-ship-order-form)
   - [2.3 Reply to Review Form](#23-reply-to-review-form)
   - [2.4 Support Ticket Form](#24-support-ticket-form)
   - [2.5 Store Settings Form](#25-store-settings-form)
   - [2.6 Bank Details Form](#26-bank-details-form)
   - [2.7 Seller Profile Form](#27-seller-profile-form)
3. [Admin App Forms](#3-admin-app-forms)
   - [3.1 Create/Edit Promotion Form](#31-createedit-promotion-form)
   - [3.2 CMS Banner Form](#32-cms-banner-form)
   - [3.3 CMS Page Form](#33-cms-page-form)
4. [Warehouse App Forms](#4-warehouse-app-forms)
   - [4.1 Receive Shipment Form](#41-receive-shipment-form)
   - [4.2 Stock Adjustment Form](#42-stock-adjustment-form)
   - [4.3 Packing Form](#43-packing-form)
5. [Shared Validation Utilities](#5-shared-validation-utilities)
6. [Validation Strategy Summary](#6-validation-strategy-summary)

---

## 1. Customer App Forms

### 1.1 Login Form

**Page:** `login.html` (Sign In tab)
**API:** `POST /api/auth/login`

| Field | Type | Required | Validation Rule | Error Message | Example Valid Value | Validation Timing |
|-------|------|----------|-----------------|---------------|---------------------|-------------------|
| email | email | Yes | Must be a valid email format (RFC 5322). Max 254 characters. | `""` -> "Email is required" / `"abc"` -> "Please enter a valid email address" | `rahul@example.com` | Real-time (on blur) |
| password | password | Yes | Minimum 8 characters. No max enforced on login (only on register). | `""` -> "Password is required" / `"short"` -> "Password must be at least 8 characters" | `SecureP@ss123` | Real-time (on blur) |
| rememberMe | checkbox | No | Boolean, no validation needed. | N/A | `true` | N/A |

**Zod Schema:**

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email is too long'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

---

### 1.2 Register Form

**Page:** `login.html` (Create Account tab)
**API:** `POST /api/auth/register`

| Field | Type | Required | Validation Rule | Error Message | Example Valid Value | Validation Timing |
|-------|------|----------|-----------------|---------------|---------------------|-------------------|
| fullName | text | Yes | Min 2, max 100 characters. Letters, spaces, and common name punctuation only (hyphens, apostrophes, periods). | `""` -> "Full name is required" / `"A"` -> "Name must be at least 2 characters" / `"A very long name..."` -> "Name must not exceed 100 characters" | `Rahul Sharma` | Real-time (on blur) |
| email | email | Yes | Valid email format (RFC 5322). Max 254 characters. Server-side uniqueness check. | `""` -> "Email is required" / `"abc"` -> "Please enter a valid email address" / (409) -> "An account with this email already exists" | `rahul@example.com` | Real-time (on blur) + server check (debounced 500ms) |
| phone | tel | Yes | Must start with `+91` followed by exactly 10 digits. First digit after country code must be 6-9. | `""` -> "Phone number is required" / `"+91 12345"` -> "Please enter a valid 10-digit Indian mobile number" / `"+91 1234567890"` -> "Mobile number must start with 6, 7, 8, or 9" | `+91 98765 43210` | Real-time (on blur) |
| password | password | Yes | Min 8 characters. Must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character (`@$!%*?&#+`). Max 128. | `""` -> "Password is required" / `"short"` -> "Password must be at least 8 characters" / `"alllowercase1!"` -> "Password must contain at least one uppercase letter" / `"ALLUPPERCASE1!"` -> "Password must contain at least one lowercase letter" / `"NoNumber!Aa"` -> "Password must contain at least one number" / `"NoSpecial1Aa"` -> "Password must contain at least one special character" | `SecureP@ss123` | Real-time (on change, with strength indicator) |
| confirmPassword | password | Yes | Must exactly match `password` field. | `""` -> "Please confirm your password" / `"different"` -> "Passwords do not match" | `SecureP@ss123` | Real-time (on blur, re-validates when password changes) |
| agreeToTerms | checkbox | Yes | Must be checked (true). | "You must agree to the Terms of Service and Privacy Policy" | `true` | On submit |

**Zod Schema:**

```typescript
import { z } from 'zod';

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Full name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters')
      .regex(
        /^[a-zA-Z\s'\-\.]+$/,
        'Name can only contain letters, spaces, hyphens, apostrophes, and periods'
      ),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address')
      .max(254, 'Email is too long'),
    phone: z
      .string()
      .min(1, 'Phone number is required')
      .regex(
        /^\+91\s?[6-9]\d{9}$/,
        'Please enter a valid 10-digit Indian mobile number starting with 6-9'
      ),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must not exceed 128 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[@$!%*?&#+]/,
        'Password must contain at least one special character (@$!%*?&#+)'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    agreeToTerms: z.literal(true, {
      errorMap: () => ({
        message: 'You must agree to the Terms of Service and Privacy Policy',
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
```

---

### 1.3 Checkout Address Form

**Page:** `checkout.html` (Add/Edit Address)
**API:** `POST /api/account/addresses` or `PUT /api/account/addresses/{id}`

| Field | Type | Required | Validation Rule | Error Message | Example Valid Value | Validation Timing |
|-------|------|----------|-----------------|---------------|---------------------|-------------------|
| fullName | text | Yes | Min 2, max 100 characters. | `""` -> "Full name is required" / `"A"` -> "Name must be at least 2 characters" | `Rahul Sharma` | Real-time (on blur) |
| phone | tel | Yes | Exactly 10 digits (Indian mobile). First digit must be 6-9. | `""` -> "Phone number is required" / `"12345"` -> "Please enter a valid 10-digit mobile number" | `9876543210` | Real-time (on blur) |
| addressLine1 | text | Yes | Min 10, max 200 characters. | `""` -> "Address is required" / `"Short"` -> "Address must be at least 10 characters" | `Flat 402, Sunshine Towers` | Real-time (on blur) |
| addressLine2 | text | No | Max 200 characters. | `"Very long..."` -> "Address line 2 must not exceed 200 characters" | `MG Road, Koramangala` | Real-time (on blur) |
| city | text | Yes | Min 2, max 50 characters. Letters, spaces, hyphens only. | `""` -> "City is required" / `"A"` -> "Please enter a valid city name" | `Bengaluru` | Real-time (on blur) |
| state | select | Yes | Must be one of 28 Indian states or 8 Union Territories. | `""` -> "Please select a state" | `Karnataka` | Real-time (on change) |
| postalCode | text | Yes | Exactly 6 digits. Must be a valid Indian PIN code (first digit 1-9). | `""` -> "PIN code is required" / `"1234"` -> "PIN code must be exactly 6 digits" / `"012345"` -> "Please enter a valid Indian PIN code" | `560034` | Real-time (on blur) + server validation for serviceability |
| type | select | No | One of: `Home`, `Office`, `Other`. Defaults to `Home`. | N/A | `Home` | N/A |

**Zod Schema:**

```typescript
import { z } from 'zod';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
] as const;

export const checkoutAddressSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^[6-9]\d{9}$/,
      'Please enter a valid 10-digit mobile number starting with 6-9'
    ),
  addressLine1: z
    .string()
    .min(1, 'Address is required')
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must not exceed 200 characters'),
  addressLine2: z
    .string()
    .max(200, 'Address line 2 must not exceed 200 characters')
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .min(1, 'City is required')
    .min(2, 'Please enter a valid city name')
    .max(50, 'City name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s\-]+$/, 'City can only contain letters, spaces, and hyphens'),
  state: z.enum(INDIAN_STATES, {
    errorMap: () => ({ message: 'Please select a state' }),
  }),
  postalCode: z
    .string()
    .min(1, 'PIN code is required')
    .regex(/^[1-9]\d{5}$/, 'Please enter a valid 6-digit Indian PIN code'),
  type: z.enum(['Home', 'Office', 'Other']).optional().default('Home'),
});

export type CheckoutAddressFormData = z.infer<typeof checkoutAddressSchema>;
```

---

### 1.4 Coupon Code Input

**Page:** `checkout.html` (Coupon/Promo Code section)
**API:** `POST /api/checkout/apply-coupon`

| Field | Type | Required | Validation Rule | Error Message | Example Valid Value | Validation Timing |
|-------|------|----------|-----------------|---------------|---------------------|-------------------|
| couponCode | text | Yes (when applying) | Alphanumeric characters only (A-Z, a-z, 0-9). Min 4, max 20 characters. Automatically uppercased. | `""` -> "Please enter a coupon code" / `"AB"` -> "Coupon code must be at least 4 characters" / `"code with spaces"` -> "Coupon code can only contain letters and numbers" / (404) -> "Invalid coupon code" / (410) -> "This coupon has expired" | `WELCOME200` | On submit (Apply button) + server validation |

**Zod Schema:**

```typescript
import { z } from 'zod';

export const couponCodeSchema = z.object({
  couponCode: z
    .string()
    .min(1, 'Please enter a coupon code')
    .min(4, 'Coupon code must be at least 4 characters')
    .max(20, 'Coupon code must not exceed 20 characters')
    .regex(
      /^[a-zA-Z0-9]+$/,
      'Coupon code can only contain letters and numbers'
    )
    .transform((val) => val.toUpperCase()),
});

export type CouponCodeFormData = z.infer<typeof couponCodeSchema>;
```

---

### 1.5 Search Input

**Page:** All pages (global header search bar)
**API:** `GET /api/search/suggestions?q={query}` (autocomplete) / `GET /api/search?q={query}` (full results)

| Field | Type | Required | Validation Rule | Error Message | Example Valid Value | Validation Timing |
|-------|------|----------|-----------------|---------------|---------------------|-------------------|
| query | text | Yes (for search execution) | Min 2 characters before triggering autocomplete suggestions. Max 200 characters. No special character restrictions (users may search product codes). Leading/trailing whitespace trimmed. | `"a"` -> (no API call, no error shown -- silently wait for more input) / `""` on submit -> "Please enter at least 2 characters to search" | `Sony headphones` | Real-time (on change, debounced 300ms, min 2 chars) |

**Zod Schema:**

```typescript
import { z } from 'zod';

export const searchSchema = z.object({
  query: z
    .string()
    .min(1, 'Please enter a search term')
    .min(2, 'Please enter at least 2 characters to search')
    .max(200, 'Search query is too long')
    .transform((val) => val.trim()),
});

export type SearchFormData = z.infer<typeof searchSchema>;
```

---

### 1.6 Product Review Form

**Page:** `product-detail.html` (Write a Review section)
**API:** `POST /api/products/{productId}/reviews`

| Field | Type | Required | Validation Rule | Error Message | Example Valid Value | Validation Timing |
|-------|------|----------|-----------------|---------------|---------------------|-------------------|
| rating | number (star select) | Yes | Integer between 1 and 5 inclusive. | "Please select a rating" | `5` | Real-time (on click) |
| title | text | No | Max 100 characters if provided. | `"Very long title..."` -> "Review title must not exceed 100 characters" | `Amazing sound quality!` | Real-time (on blur) |
| text | textarea | Yes | Min 10, max 500 characters. | `""` -> "Please write your review" / `"Good"` -> "Review must be at least 10 characters" / (exceeds 500) -> "Review must not exceed 500 characters" | `The noise cancellation on these headphones is incredible. Battery life easily lasts through a full work day.` | Real-time (on blur, with character counter) |
| images | file | No | Max 5 images. Each max 5 MB. Accepted formats: JPG, PNG, WebP. | `(> 5 files)` -> "You can upload a maximum of 5 images" / `(> 5MB)` -> "Each image must be under 5 MB" / `(.gif)` -> "Only JPG, PNG, and WebP images are allowed" | `review-photo.jpg (2.3 MB)` | Real-time (on file select) |

**Zod Schema:**

```typescript
import { z } from 'zod';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const reviewSchema = z.object({
  rating: z
    .number()
    .int('Rating must be a whole number')
    .min(1, 'Please select a rating')
    .max(5, 'Rating must be between 1 and 5'),
  title: z
    .string()
    .max(100, 'Review title must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  text: z
    .string()
    .min(1, 'Please write your review')
    .min(10, 'Review must be at least 10 characters')
    .max(500, 'Review must not exceed 500 characters'),
  images: z
    .array(
      z.object({
        file: z
          .instanceof(File)
          .refine(
            (file) => file.size <= MAX_IMAGE_SIZE,
            'Each image must be under 5 MB'
          )
          .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
            'Only JPG, PNG, and WebP images are allowed'
          ),
      })
    )
    .max(5, 'You can upload a maximum of 5 images')
    .optional()
    .default([]),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
```

---

### 1.7 Return Request Form

**Page:** `order-detail.html` (Return/Replace modal) or `returns.html`
**API:** `POST /api/returns`

| Field | Type | Required | Validation Rule | Error Message | Example Valid Value | Validation Timing |
|-------|------|----------|-----------------|---------------|---------------------|-------------------|
| orderId | hidden | Yes | Valid order ID format. Prefilled, not user-editable. | N/A (system error if missing) | `ORD-2024-7845` | N/A |
| orderItemId | hidden | Yes | Valid order item ID. Prefilled from selected product. | N/A (system error if missing) | `oi-101` | N/A |
| reason | select | Yes | Must select one of the predefined reasons: `Defective`, `Wrong Item`, `Wrong Size`, `Damaged in Transit`, `Not as Described`, `Changed Mind`, `Other`. | "Please select a reason for return" | `Defective` | Real-time (on change) |
| description | textarea | Yes | Min 20, max 1000 characters. Must meaningfully describe the issue. | `""` -> "Please describe the issue" / `"Broken"` -> "Description must be at least 20 characters" / (exceeds 1000) -> "Description must not exceed 1000 characters" | `Left ear speaker not working properly. The sound cuts out intermittently.` | Real-time (on blur, with character counter) |
| images | file | No | Max 5 images. Each max 5 MB. Accepted: JPG, PNG, WebP. Recommended for damage claims. | Same as review image errors | `damage-photo.jpg` | Real-time (on file select) |
| preferredResolution | select | No | One of: `Refund`, `Replacement`, `Exchange`. Defaults to `Refund`. | N/A | `Refund` | N/A |

**Zod Schema:**

```typescript
import { z } from 'zod';

const RETURN_REASONS = [
  'Defective',
  'Wrong Item',
  'Wrong Size',
  'Damaged in Transit',
  'Not as Described',
  'Changed Mind',
  'Other',
] as const;

const RESOLUTIONS = ['Refund', 'Replacement', 'Exchange'] as const;

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const returnRequestSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  orderItemId: z.string().min(1, 'Order item is required'),
  reason: z.enum(RETURN_REASONS, {
    errorMap: () => ({ message: 'Please select a reason for return' }),
  }),
  description: z
    .string()
    .min(1, 'Please describe the issue')
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must not exceed 1000 characters'),
  images: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size <= MAX_IMAGE_SIZE, 'Each image must be under 5 MB')
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
          'Only JPG, PNG, and WebP images are allowed'
        )
    )
    .max(5, 'You can upload a maximum of 5 images')
    .optional()
    .default([]),
  preferredResolution: z.enum(RESOLUTIONS).optional().default('Refund'),
});

export type ReturnRequestFormData = z.infer<typeof returnRequestSchema>;
```

---

## 2. Seller App Forms

### 2.1 Add/Edit Product Form

**Page:** `seller-add-product.html`
**API:** `POST /api/product` (create) / `PATCH /api/product/{id}` (update via STM event)

| Field | Type | Required | Validation Rule | Error Message | Example Valid Value | Validation Timing |
|-------|------|----------|-----------------|---------------|---------------------|-------------------|
| name | text | Yes | Min 3, max 200 characters. | `""` -> "Product name is required" / `"AB"` -> "Product name must be at least 3 characters" / (exceeds 200) -> "Product name must not exceed 200 characters" | `Sony WH-1000XM5 Wireless Noise Cancelling Headphones` | Real-time (on blur) |
| brand | text | Yes | Min 1, max 100 characters. | `""` -> "Brand is required" | `Sony` | Real-time (on blur) |
| categoryId | select | Yes | Must select a valid category from the dropdown. | "Please select a category" | `cat-electronics` | Real-time (on change) |
| subCategoryId | select | Yes | Must select a valid sub-category after category is chosen. | "Please select a sub-category" | `sub-headphones` | Real-time (on change) |
| shortDescription | textarea | No | Max 200 characters. | (exceeds 200) -> "Short description must not exceed 200 characters" | `Premium wireless headphones with industry-leading noise cancellation` | Real-time (on blur, with character counter) |
| longDescription | textarea (rich text) | No | Max 5000 characters (HTML stripped for counting). | (exceeds 5000) -> "Long description must not exceed 5000 characters" | `<p>Experience the next level of silence...</p>` | Real-time (on blur, with character counter) |
| price (MRP / compareAtPrice) | number | Yes | Must be greater than 0. Max 10,000,000 (1 crore). Max 2 decimal places. | `""` -> "MRP is required" / `"0"` -> "MRP must be greater than 0" / `"-100"` -> "MRP must be greater than 0" | `6999` | Real-time (on blur) |
| sellingPrice (price) | number | Yes | Must be greater than 0. Must be less than or equal to MRP. Max 2 decimal places. | `""` -> "Selling price is required" / `"0"` -> "Selling price must be greater than 0" / `"7500"` (when MRP is 6999) -> "Selling price cannot exceed MRP" | `4999` | Real-time (on blur, re-validates when MRP changes) |
| costPrice | number | No | Must be greater than 0 if provided. Max 2 decimal places. | `"-50"` -> "Cost price must be greater than 0" | `3200` | Real-time (on blur) |
| taxRate | number | No | Must be 0-100. Common Indian GST values: 0, 5, 12, 18, 28. | `"150"` -> "Tax rate must be between 0% and 100%" | `18` | Real-time (on blur) |
| sku | text | Yes | Alphanumeric characters plus hyphens only. Min 3, max 20 characters. Must be unique (server-side check). | `""` -> "SKU is required" / `"AB"` -> "SKU must be at least 3 characters" / `"has spaces"` -> "SKU can only contain letters, numbers, and hyphens" / (409) -> "This SKU already exists" | `HB-EL-0012` | Real-time (on blur) + server uniqueness check (debounced 500ms) |
| stock | number | Yes | Integer, must be >= 0. Max 999,999. | `""` -> "Stock quantity is required" / `"-1"` -> "Stock cannot be negative" / `"5.5"` -> "Stock must be a whole number" | `148` | Real-time (on blur) |
| lowStockThreshold | number | No | Integer, must be >= 0 if provided. Must be less than stock. | `"-1"` -> "Threshold cannot be negative" | `10` | Real-time (on blur) |
| weight | number | No | Must be greater than 0 if provided. Max 3 decimal places. | `"0"` -> "Weight must be greater than 0" / `"-1"` -> "Weight must be greater than 0" | `0.254` | Real-time (on blur) |
| weightUnit | select | No | One of: `kg`, `g`. Defaults to `kg`. | N/A | `kg` | N/A |
| dimensions.length | number | No | Must be greater than 0 if any dimension is provided. | `"0"` -> "Length must be greater than 0" | `20` | Real-time (on blur) |
| dimensions.width | number | No | Must be greater than 0 if any dimension is provided. | `"0"` -> "Width must be greater than 0" | `18` | Real-time (on blur) |
| dimensions.height | number | No | Must be greater than 0 if any dimension is provided. | `"0"` -> "Height must be greater than 0" | `8` | Real-time (on blur) |
| dimensionUnit | select | No | One of: `cm`, `in`. Defaults to `cm`. | N/A | `cm` | N/A |
| tags | text (tag input) | No | Each tag: max 30 chars, alphanumeric plus hyphens. Max 20 tags total. | `"very long tag name..."` -> "Each tag must be 30 characters or less" / (> 20 tags) -> "Maximum 20 tags allowed" | `["wireless", "noise-cancelling"]` | Real-time (on tag add) |
| media (images) | file | Yes | Min 1 image, max 10 images. Each max 5 MB. Accepted: JPG, PNG, WebP. First image is primary. | `(0 files)` -> "At least one product image is required" / `(> 10 files)` -> "Maximum 10 images allowed" / `(> 5 MB)` -> "Each image must be under 5 MB" / `(.gif)` -> "Only JPG, PNG, and WebP images are allowed" | `headphone-1.jpg (1.8 MB)` | Real-time (on file select) |
| seoTitle | text | No | Max 70 characters. | (exceeds 70) -> "SEO title must not exceed 70 characters" | `Sony WH-1000XM5 Wireless Headphones \| HomeBase` | Real-time (on blur, with character counter) |
| seoDescription | textarea | No | Max 160 characters. | (exceeds 160) -> "SEO description must not exceed 160 characters" | `Buy Sony WH-1000XM5 at best price...` | Real-time (on blur, with character counter) |
| seoSlug | text | No | Lowercase letters, numbers, and hyphens only. Max 100. Auto-generated from product name. | `"Has Spaces"` -> "Slug can only contain lowercase letters, numbers, and hyphens" | `sony-wh-1000xm5-wireless-headphones` | Real-time (on blur) |

**Zod Schema:**

```typescript
import { z } from 'zod';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const productSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Product name is required')
      .min(3, 'Product name must be at least 3 characters')
      .max(200, 'Product name must not exceed 200 characters'),
    brand: z
      .string()
      .min(1, 'Brand is required')
      .max(100, 'Brand must not exceed 100 characters'),
    categoryId: z.string().min(1, 'Please select a category'),
    subCategoryId: z.string().min(1, 'Please select a sub-category'),
    shortDescription: z
      .string()
      .max(200, 'Short description must not exceed 200 characters')
      .optional()
      .or(z.literal('')),
    longDescription: z
      .string()
      .max(5000, 'Long description must not exceed 5000 characters')
      .optional()
      .or(z.literal('')),
    compareAtPrice: z
      .number({ required_error: 'MRP is required', invalid_type_error: 'MRP must be a number' })
      .positive('MRP must be greater than 0')
      .max(10_000_000, 'MRP cannot exceed 1,00,00,000')
      .multipleOf(0.01, 'MRP can have at most 2 decimal places'),
    price: z
      .number({
        required_error: 'Selling price is required',
        invalid_type_error: 'Selling price must be a number',
      })
      .positive('Selling price must be greater than 0')
      .multipleOf(0.01, 'Price can have at most 2 decimal places'),
    costPrice: z
      .number()
      .positive('Cost price must be greater than 0')
      .multipleOf(0.01)
      .optional()
      .nullable(),
    taxRate: z
      .number()
      .min(0, 'Tax rate must be between 0% and 100%')
      .max(100, 'Tax rate must be between 0% and 100%')
      .optional()
      .nullable(),
    sku: z
      .string()
      .min(1, 'SKU is required')
      .min(3, 'SKU must be at least 3 characters')
      .max(20, 'SKU must not exceed 20 characters')
      .regex(
        /^[a-zA-Z0-9\-]+$/,
        'SKU can only contain letters, numbers, and hyphens'
      ),
    stock: z
      .number({
        required_error: 'Stock quantity is required',
        invalid_type_error: 'Stock must be a number',
      })
      .int('Stock must be a whole number')
      .min(0, 'Stock cannot be negative')
      .max(999_999, 'Stock cannot exceed 999,999'),
    lowStockThreshold: z
      .number()
      .int('Threshold must be a whole number')
      .min(0, 'Threshold cannot be negative')
      .optional()
      .nullable(),
    weight: z
      .number()
      .positive('Weight must be greater than 0')
      .optional()
      .nullable(),
    weightUnit: z.enum(['kg', 'g']).optional().default('kg'),
    dimensions: z
      .object({
        length: z.number().positive('Length must be greater than 0').optional().nullable(),
        width: z.number().positive('Width must be greater than 0').optional().nullable(),
        height: z.number().positive('Height must be greater than 0').optional().nullable(),
      })
      .optional(),
    dimensionUnit: z.enum(['cm', 'in']).optional().default('cm'),
    tags: z
      .array(
        z
          .string()
          .max(30, 'Each tag must be 30 characters or less')
          .regex(/^[a-zA-Z0-9\-]+$/, 'Tags can only contain letters, numbers, and hyphens')
      )
      .max(20, 'Maximum 20 tags allowed')
      .optional()
      .default([]),
    media: z
      .array(
        z.object({
          file: z
            .instanceof(File)
            .refine((f) => f.size <= MAX_IMAGE_SIZE, 'Each image must be under 5 MB')
            .refine(
              (f) => ACCEPTED_IMAGE_TYPES.includes(f.type),
              'Only JPG, PNG, and WebP images are allowed'
            ),
          isPrimary: z.boolean().optional().default(false),
          sortOrder: z.number().optional(),
        })
      )
      .min(1, 'At least one product image is required')
      .max(10, 'Maximum 10 images allowed'),
    seoTitle: z
      .string()
      .max(70, 'SEO title must not exceed 70 characters')
      .optional()
      .or(z.literal('')),
    seoDescription: z
      .string()
      .max(160, 'SEO description must not exceed 160 characters')
      .optional()
      .or(z.literal('')),
    seoSlug: z
      .string()
      .max(100, 'Slug must not exceed 100 characters')
      .regex(
        /^[a-z0-9\-]*$/,
        'Slug can only contain lowercase letters, numbers, and hyphens'
      )
      .optional()
      .or(z.literal('')),
  })
  .refine((data) => data.price <= data.compareAtPrice, {
    message: 'Selling price cannot exceed MRP',
    path: ['price'],
  });

export type ProductFormData = z.infer<typeof productSchema>;
```

---

### 2.2 Ship Order Form

**Page:** `seller-orders.html` (Ship Order modal/drawer)
**API:** `PATCH /api/sellerorder/{orderId}/ship` (STM event)

| Field | Type | Required | Validation Rule | Error Message | Example Valid Value | Validation Timing |
|-------|------|----------|-----------------|---------------|---------------------|-------------------|
| trackingNumber | text | Yes | Alphanumeric characters only. Min 8, max 30 characters. | `""` -> "Tracking number is required" / `"ABC"` -> "Tracking number must be at least 8 characters" / `"has spaces!"` -> "Tracking number can only contain letters and numbers" | `DL284719305IN` | Real-time (on blur) |
| carrier | select | Yes | Must select one of the predefined carriers: `Delhivery`, `BlueDart`, `DTDC`, `Ecom Express`, `Shadowfax`, `India Post`, `Professional Couriers`, `Other`. | "Please select a shipping carrier" | `Delhivery` | Real-time (on change) |
| carrierOther | text | Conditional | Required if carrier is `Other`. Min 2, max 100 characters. | `""` (when Other is selected) -> "Please specify the carrier name" | `Local Courier Co` | Real-time (on blur) |
| estimatedDeliveryDate | date | No | Must be a future date (today or later). Must be within 30 days. | `"2025-01-01"` -> "Estimated delivery date must be in the future" / `"2027-01-01"` -> "Estimated delivery date must be within 30 days" | `2026-04-02` | Real-time (on change) |
| notes | textarea | No | Max 500 characters. | (exceeds 500) -> "Notes must not exceed 500 characters" | `Fragile items, handle with care` | Real-time (on blur) |

**Zod Schema:**

```typescript
import { z } from 'zod';

const CARRIERS = [
  'Delhivery',
  'BlueDart',
  'DTDC',
  'Ecom Express',
  'Shadowfax',
  'India Post',
  'Professional Couriers',
  'Other',
] as const;

export const shipOrderSchema = z
  .object({
    trackingNumber: z
      .string()
      .min(1, 'Tracking number is required')
      .min(8, 'Tracking number must be at least 8 characters')
      .max(30, 'Tracking number must not exceed 30 characters')
      .regex(
        /^[a-zA-Z0-9]+$/,
        'Tracking number can only contain letters and numbers'
      ),
    carrier: z.enum(CARRIERS, {
      errorMap: () => ({ message: 'Please select a shipping carrier' }),
    }),
    carrierOther: z
      .string()
      .max(100, 'Carrier name must not exceed 100 characters')
      .optional()
      .or(z.literal('')),
    estimatedDeliveryDate: z
      .string()
      .optional()
      .or(z.literal(''))
      .refine(
        (val) => {
          if (!val) return true;
          const date = new Date(val);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date >= today;
        },
        'Estimated delivery date must be in the future'
      )
      .refine(
        (val) => {
          if (!val) return true;
          const date = new Date(val);
          const maxDate = new Date();
          maxDate.setDate(maxDate.getDate() + 30);
          return date <= maxDate;
        },
        'Estimated delivery date must be within 30 days'
      ),
    notes: z
      .string()
      .max(500, 'Notes must not exceed 500 characters')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.carrier === 'Other') {
        return data.carrierOther && data.carrierOther.trim().length >= 2;
      }
      return true;
    },
    {
      message: 'Please specify the carrier name (at least 2 characters)',
      path: ['carrierOther'],
    }
  );

export type ShipOrderFormData = z.infer<typeof shipOrderSchema>;
```

---

### 2.3 Reply to Review Form

**Page:** `seller-reviews.html` (Reply modal/inline)
**API:** `POST /api/seller/reviews/{reviewId}/reply`

| Field | Type | Required | Validation Rule | Error Message | Example Valid Value | Validation Timing |
|-------|------|----------|-----------------|---------------|---------------------|-------------------|
| text | textarea | Yes | Min 10, max 1000 characters. Must be professional (no profanity -- server-side content moderation). | `""` -> "Reply is required" / `"Thanks"` -> "Reply must be at least 10 characters" / (exceeds 1000) -> "Reply must not exceed 1000 characters" | `Thank you for your feedback! We're sorry about the issue with the speaker. Please contact our support team and we'll arrange a replacement immediately.` | Real-time (on blur, with character counter) |

**Zod Schema:**

```typescript
import { z } from 'zod';

export const reviewReplySchema = z.object({
  text: z
    .string()
    .min(1, 'Reply is required')
    .min(10, 'Reply must be at least 10 characters')
    .max(1000, 'Reply must not exceed 1000 characters'),
});

export type ReviewReplyFormData = z.infer<typeof reviewReplySchema>;
```

---

### 2.4 Support Ticket Form

**Page:** `seller-support.html` (Create Ticket modal)
**API:** `POST /api/seller/support/tickets`

| Field | Type | Required | Validation Rule | Error Message | Example Valid Value | Validation Timing |
|-------|------|----------|-----------------|---------------|---------------------|-------------------|
| subject | text | Yes | Min 5, max 200 characters. | `""` -> "Subject is required" / `"Help"` -> "Subject must be at least 5 characters" / (exceeds 200) -> "Subject must not exceed 200 characters" | `Order #ORD-8834 not delivered but marked as completed` | Real-time (on blur) |
| category | select | Yes | Must select one of: `Order Issue`, `Payment Issue`, `Product Listing`, `Account Issue`, `Shipping`, `Returns`, `Technical Issue`, `Other`. | "Please select a category" | `Order Issue` | Real-time (on change) |
| priority | select | No | One of: `LOW`, `MEDIUM`, `HIGH`, `URGENT`. Defaults to `MEDIUM`. | N/A | `HIGH` | N/A |
| description | textarea | Yes | Min 20, max 5000 characters. | `""` -> "Description is required" / `"Short desc"` -> "Description must be at least 20 characters" / (exceeds 5000) -> "Description must not exceed 5000 characters" | `The order was marked as delivered on March 25, but the customer reports they haven't received it. Tracking shows it's still at the local hub.` | Real-time (on blur, with character counter) |
| orderId | text | No | Valid order ID format if provided. Pattern: `HB-XXXXX` or `ORD-XXXX-XXXX`. | `"invalid"` -> "Please enter a valid order ID (e.g., HB-78234)" | `HB-78234` | Real-time (on blur) |
| attachments | file | No | Max 5 files. Each max 10 MB. Accepted: JPG, PNG, WebP, PDF, DOC, DOCX. | `(> 5 files)` -> "Maximum 5 attachments allowed" / `(> 10 MB)` -> "Each file must be under 10 MB" / `(.exe)` -> "This file type is not allowed" | `screenshot.png (1.2 MB)` | Real-time (on file select) |

**Zod Schema:**

```typescript
import { z } from 'zod';

const TICKET_CATEGORIES = [
  'Order Issue',
  'Payment Issue',
  'Product Listing',
  'Account Issue',
  'Shipping',
  'Returns',
  'Technical Issue',
  'Other',
] as const;

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const supportTicketSchema = z.object({
  subject: z
    .string()
    .min(1, 'Subject is required')
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must not exceed 200 characters'),
  category: z.enum(TICKET_CATEGORIES, {
    errorMap: () => ({ message: 'Please select a category' }),
  }),
  priority: z.enum(PRIORITIES).optional().default('MEDIUM'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(20, 'Description must be at least 20 characters')
    .max(5000, 'Description must not exceed 5000 characters'),
  orderId: z
    .string()
    .regex(
      /^(HB-\d{4,6}|ORD-\d{4}-\d{4})$/,
      'Please enter a valid order ID (e.g., HB-78234)'
    )
    .optional()
    .or(z.literal('')),
  attachments: z
    .array(
      z
        .instanceof(File)
        .refine((f) => f.size <= MAX_FILE_SIZE, 'Each file must be under 10 MB')
        .refine(
          (f) => ACCEPTED_FILE_TYPES.includes(f.type),
          'This file type is not allowed. Use JPG, PNG, WebP, PDF, or DOC.'
        )
    )
    .max(5, 'Maximum 5 attachments allowed')
    .optional()
    .default([]),
});

export type SupportTicketFormData = z.infer<typeof supportTicketSchema>;
```

---

### 2.5 Store Settings Form

**Page:** `seller-store-settings.html`
**API:** `PUT /api/seller/store-settings/info` (store info) / `PUT /api/seller/store-settings/social` (social) / `POST /api/seller/store-settings/banner` (banner upload) / `POST /api/seller/store-settings/logo` (logo upload)

| Field | Type | Required | Validation Rule | Error Message | Example Valid Value | Validation Timing |
|-------|------|----------|-----------------|---------------|---------------------|-------------------|
| storeName | text | Yes | Min 3, max 100 characters. | `""` -> "Store name is required" / `"AB"` -> "Store name must be at least 3 characters" | `Rajesh Store` | Real-time (on blur) |
| tagline | text | No | Max 150 characters. | (exceeds 150) -> "Tagline must not exceed 150 characters" | `Quality products at the best prices` | Real-time (on blur) |
| description | textarea | No | Max 500 characters. | (exceeds 500) -> "Description must not exceed 500 characters" | `Welcome to Rajesh Store! We offer premium electronics...` | Real-time (on blur, with character counter) |
| contactEmail | email | Yes | Valid email format. Max 254 characters. | `""` -> "Contact email is required" / `"abc"` -> "Please enter a valid email address" | `rajesh@rajeshstore.com` | Real-time (on blur) |
| contactPhone | tel | Yes | Valid Indian phone number. 10 digits starting with 6-9, with or without +91 prefix. | `""` -> "Phone number is required" / `"12345"` -> "Please enter a valid phone number" | `+91 98765 43210` | Real-time (on blur) |
| address | textarea | No | Max 300 characters. | (exceeds 300) -> "Address must not exceed 300 characters" | `Shop No. 42, Lajpat Nagar Market, New Delhi - 110024` | Real-time (on blur) |
| socialLinks.website | url | No | Valid URL format (http:// or https://). Max 500 characters. | `"not-a-url"` -> "Please enter a valid URL (e.g., https://example.com)" | `https://rajeshstore.com` | Real-time (on blur) |
| socialLinks.facebook | url | No | Valid URL. Must contain `facebook.com` or `fb.com`. | `"https://google.com"` -> "Please enter a valid Facebook URL" | `https://facebook.com/rajeshstore` | Real-time (on blur) |
| socialLinks.instagram | url | No | Valid URL. Must contain `instagram.com`. | `"https://google.com"` -> "Please enter a valid Instagram URL" | `https://instagram.com/rajeshstore` | Real-time (on blur) |
| socialLinks.twitter | url | No | Valid URL. Must contain `twitter.com` or `x.com`. | `"https://google.com"` -> "Please enter a valid Twitter/X URL" | `https://x.com/rajeshstore` | Real-time (on blur) |
| bannerImage | file | No | Max 5 MB. Accepted: JPG, PNG. Recommended: 1200x300px. | `(> 5 MB)` -> "Banner image must be under 5 MB" / `(.gif)` -> "Only JPG and PNG images are allowed" | `banner.jpg (800 KB)` | Real-time (on file select) |
| logoImage | file | No | Max 2 MB. Accepted: JPG, PNG. Recommended: 400x400px. | `(> 2 MB)` -> "Logo must be under 2 MB" / `(.gif)` -> "Only JPG and PNG images are allowed" | `logo.png (200 KB)` | Real-time (on file select) |
| accentColor | color | No | Valid hex color code. | `"notacolor"` -> "Please enter a valid hex color code" | `#F97316` | Real-time (on change) |
| theme | select | No | One of: `classic`, `modern`, `minimal`. | N/A | `classic` | N/A |

**Zod Schema:**

```typescript
import { z } from 'zod';

const urlSchema = z
  .string()
  .url('Please enter a valid URL (e.g., https://example.com)')
  .max(500, 'URL is too long')
  .optional()
  .or(z.literal(''));

export const storeSettingsSchema = z.object({
  storeName: z
    .string()
    .min(1, 'Store name is required')
    .min(3, 'Store name must be at least 3 characters')
    .max(100, 'Store name must not exceed 100 characters'),
  tagline: z
    .string()
    .max(150, 'Tagline must not exceed 150 characters')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
  contactEmail: z
    .string()
    .min(1, 'Contact email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email is too long'),
  contactPhone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^(\+91\s?)?[6-9]\d{9}$/,
      'Please enter a valid Indian phone number'
    ),
  address: z
    .string()
    .max(300, 'Address must not exceed 300 characters')
    .optional()
    .or(z.literal('')),
  socialLinks: z
    .object({
      website: urlSchema,
      facebook: urlSchema.refine(
        (val) => !val || /facebook\.com|fb\.com/i.test(val),
        'Please enter a valid Facebook URL'
      ),
      instagram: urlSchema.refine(
        (val) => !val || /instagram\.com/i.test(val),
        'Please enter a valid Instagram URL'
      ),
      twitter: urlSchema.refine(
        (val) => !val || /twitter\.com|x\.com/i.test(val),
        'Please enter a valid Twitter/X URL'
      ),
    })
    .optional(),
  accentColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Please enter a valid hex color code')
    .optional()
    .or(z.literal('')),
  theme: z.enum(['classic', 'modern', 'minimal']).optional().default('classic'),
});

export type StoreSettingsFormData = z.infer<typeof storeSettingsSchema>;
```

---

### 2.6 Bank Details Form

**Page:** `seller-payments.html` (Add/Edit Bank Account modal)
**API:** `POST /api/seller/payments/bank-accounts` (add) / `PUT /api/seller/payments/bank-accounts/{id}` (edit)

| Field | Type | Required | Validation Rule | Error Message | Example Valid Value | Validation Timing |
|-------|------|----------|-----------------|---------------|---------------------|-------------------|
| accountHolderName | text | Yes | Min 2, max 100 characters. Letters, spaces, and periods only. | `""` -> "Account holder name is required" / `"A"` -> "Name must be at least 2 characters" | `Rajesh Kumar` | Real-time (on blur) |
| bankName | text | Yes | Min 2, max 100 characters. | `""` -> "Bank name is required" | `State Bank of India` | Real-time (on blur) |
| accountNumber | text | Yes | Digits only. Min 8, max 18 characters. Must be entered twice for confirmation. | `""` -> "Account number is required" / `"1234"` -> "Account number must be 8-18 digits" / `"12345abc"` -> "Account number must contain only digits" | `12345678901234` | Real-time (on blur) |
| confirmAccountNumber | text | Yes | Must exactly match `accountNumber`. | `""` -> "Please confirm your account number" / `"different"` -> "Account numbers do not match" | `12345678901234` | Real-time (on blur) |
| ifscCode | text | Yes | Exactly 11 characters. Format: 4 uppercase letters + `0` + 6 alphanumeric characters (e.g., `SBIN0001234`). | `""` -> "IFSC code is required" / `"SBIN"` -> "IFSC code must be exactly 11 characters" / `"12345678901"` -> "IFSC code must start with 4 letters followed by 0 and 6 characters" | `SBIN0001234` | Real-time (on blur) + server validation via RBI IFSC API |
| branchName | text | No | Max 200 characters. Auto-populated from IFSC lookup. | N/A | `Lajpat Nagar Branch` | Auto-filled |
| accountType | select | Yes | One of: `SAVINGS`, `CURRENT`. | "Please select account type" | `CURRENT` | Real-time (on change) |

**Zod Schema:**

```typescript
import { z } from 'zod';

export const bankDetailsSchema = z
  .object({
    accountHolderName: z
      .string()
      .min(1, 'Account holder name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters')
      .regex(
        /^[a-zA-Z\s\.]+$/,
        'Name can only contain letters, spaces, and periods'
      ),
    bankName: z
      .string()
      .min(1, 'Bank name is required')
      .min(2, 'Bank name must be at least 2 characters')
      .max(100, 'Bank name must not exceed 100 characters'),
    accountNumber: z
      .string()
      .min(1, 'Account number is required')
      .regex(/^\d+$/, 'Account number must contain only digits')
      .min(8, 'Account number must be at least 8 digits')
      .max(18, 'Account number must not exceed 18 digits'),
    confirmAccountNumber: z
      .string()
      .min(1, 'Please confirm your account number'),
    ifscCode: z
      .string()
      .min(1, 'IFSC code is required')
      .length(11, 'IFSC code must be exactly 11 characters')
      .regex(
        /^[A-Z]{4}0[A-Z0-9]{6}$/,
        'IFSC code must start with 4 letters followed by 0 and 6 alphanumeric characters (e.g., SBIN0001234)'
      )
      .transform((val) => val.toUpperCase()),
    branchName: z
      .string()
      .max(200, 'Branch name is too long')
      .optional()
      .or(z.literal('')),
    accountType: z.enum(['SAVINGS', 'CURRENT'], {
      errorMap: () => ({ message: 'Please select account type' }),
    }),
  })
  .refine((data) => data.accountNumber === data.confirmAccountNumber, {
    message: 'Account numbers do not match',
    path: ['confirmAccountNumber'],
  });

export type BankDetailsFormData = z.infer<typeof bankDetailsSchema>;
```

---

### 2.7 Seller Profile Form

**Page:** `seller-profile.html`
**API:** `PUT /api/seller/profile/personal` (personal) / `PUT /api/seller/profile/business` (business)

#### Personal Information Section

| Field | Type | Required | Validation Rule | Error Message | Example Valid Value | Validation Timing |
|-------|------|----------|-----------------|---------------|---------------------|-------------------|
| fullName | text | Yes | Min 2, max 100 characters. Letters, spaces, and common name punctuation. | `""` -> "Full name is required" / `"A"` -> "Name must be at least 2 characters" | `Rajesh Kumar` | Real-time (on blur) |
| email | email | Yes | Valid email format. Max 254 characters. | `""` -> "Email is required" / `"abc"` -> "Please enter a valid email address" | `rajesh@rajeshstore.com` | Real-time (on blur) |
| phone | tel | Yes | Valid Indian mobile number. +91 prefix with 10 digits (first digit 6-9). | `""` -> "Phone number is required" / `"12345"` -> "Please enter a valid phone number" | `+91 98765 43210` | Real-time (on blur) |
| alternatePhone | tel | No | Same format as phone if provided. Must differ from primary phone. | `"12345"` -> "Please enter a valid phone number" / (same as phone) -> "Alternate phone must be different from primary phone" | `+91 98765 43211` | Real-time (on blur) |
| dateOfBirth | date | No | Must be a past date. Must be at least 18 years ago. Must not be more than 120 years ago. | `"2026-05-01"` -> "Date of birth must be in the past" / (< 18 years) -> "You must be at least 18 years old" | `1985-06-15` | Real-time (on change) |
| avatar | file | No | Max 2 MB. Accepted: JPG, PNG, WebP. | `(> 2 MB)` -> "Avatar image must be under 2 MB" / `(.gif)` -> "Only JPG, PNG, and WebP images are allowed" | `profile-photo.jpg (500 KB)` | Real-time (on file select) |

#### Business Information Section

| Field | Type | Required | Validation Rule | Error Message | Example Valid Value | Validation Timing |
|-------|------|----------|-----------------|---------------|---------------------|-------------------|
| storeName | text | Yes | Min 3, max 100 characters. | `""` -> "Store name is required" | `Rajesh Store` | Real-time (on blur) |
| businessType | select | Yes | One of: `Sole Proprietorship`, `Partnership`, `Private Limited`, `LLP`, `OPC`, `Trust/NGO`. | "Please select business type" | `Sole Proprietorship` | Real-time (on change) |
| gstin | text | Yes | Exactly 15 characters. Format: 2 digits (state code) + 10-char PAN + 1 alphanumeric + `Z` + 1 check char. | `""` -> "GSTIN is required" / `"12345"` -> "GSTIN must be exactly 15 characters" / `"INVALID1234"` -> "Please enter a valid GSTIN" | `22AAAAA0000A1Z5` | Real-time (on blur) + server verification |
| panNumber | text | Yes | Exactly 10 characters. Format: 5 uppercase letters + 4 digits + 1 uppercase letter. | `""` -> "PAN number is required" / `"ABC"` -> "PAN must be exactly 10 characters" / `"1234567890"` -> "Please enter a valid PAN number (e.g., ABCDE1234F)" | `ABCDE1234F` | Real-time (on blur) + server verification |
| businessAddress | textarea | Yes | Min 10, max 300 characters. | `""` -> "Business address is required" / `"Short"` -> "Address must be at least 10 characters" | `Shop No. 42, Ground Floor, Lajpat Nagar Market, New Delhi - 110024, India` | Real-time (on blur) |

**Zod Schema:**

```typescript
import { z } from 'zod';

const BUSINESS_TYPES = [
  'Sole Proprietorship',
  'Partnership',
  'Private Limited',
  'LLP',
  'OPC',
  'Trust/NGO',
] as const;

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ACCEPTED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const sellerProfilePersonalSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Full name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters')
      .regex(/^[a-zA-Z\s'\-\.]+$/, 'Name can only contain letters, spaces, hyphens, apostrophes, and periods'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address')
      .max(254, 'Email is too long'),
    phone: z
      .string()
      .min(1, 'Phone number is required')
      .regex(/^(\+91\s?)?[6-9]\d{9}$/, 'Please enter a valid Indian phone number'),
    alternatePhone: z
      .string()
      .regex(/^(\+91\s?)?[6-9]\d{9}$/, 'Please enter a valid phone number')
      .optional()
      .or(z.literal('')),
    dateOfBirth: z
      .string()
      .optional()
      .or(z.literal(''))
      .refine(
        (val) => {
          if (!val) return true;
          return new Date(val) < new Date();
        },
        'Date of birth must be in the past'
      )
      .refine(
        (val) => {
          if (!val) return true;
          const age =
            (new Date().getTime() - new Date(val).getTime()) /
            (365.25 * 24 * 60 * 60 * 1000);
          return age >= 18;
        },
        'You must be at least 18 years old'
      ),
    avatar: z
      .instanceof(File)
      .refine((f) => f.size <= MAX_AVATAR_SIZE, 'Avatar image must be under 2 MB')
      .refine(
        (f) => ACCEPTED_AVATAR_TYPES.includes(f.type),
        'Only JPG, PNG, and WebP images are allowed'
      )
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      if (!data.alternatePhone || !data.phone) return true;
      const normalize = (p: string) => p.replace(/[\s\+]/g, '').replace(/^91/, '');
      return normalize(data.phone) !== normalize(data.alternatePhone);
    },
    {
      message: 'Alternate phone must be different from primary phone',
      path: ['alternatePhone'],
    }
  );

export const sellerProfileBusinessSchema = z.object({
  storeName: z
    .string()
    .min(1, 'Store name is required')
    .min(3, 'Store name must be at least 3 characters')
    .max(100, 'Store name must not exceed 100 characters'),
  businessType: z.enum(BUSINESS_TYPES, {
    errorMap: () => ({ message: 'Please select business type' }),
  }),
  gstin: z
    .string()
    .min(1, 'GSTIN is required')
    .length(15, 'GSTIN must be exactly 15 characters')
    .regex(
      /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/,
      'Please enter a valid GSTIN (e.g., 22AAAAA0000A1Z5)'
    ),
  panNumber: z
    .string()
    .min(1, 'PAN number is required')
    .length(10, 'PAN must be exactly 10 characters')
    .regex(
      /^[A-Z]{5}\d{4}[A-Z]{1}$/,
      'Please enter a valid PAN number (e.g., ABCDE1234F)'
    )
    .transform((val) => val.toUpperCase()),
  businessAddress: z
    .string()
    .min(1, 'Business address is required')
    .min(10, 'Address must be at least 10 characters')
    .max(300, 'Address must not exceed 300 characters'),
});

export type SellerProfilePersonalFormData = z.infer<typeof sellerProfilePersonalSchema>;
export type SellerProfileBusinessFormData = z.infer<typeof sellerProfileBusinessSchema>;
```

---

## 3. Admin App Forms

### 3.1 Create/Edit Promotion Form

**Page:** `admin-promotions.html` (Create Campaign modal)
**API:** `POST /api/admin/promotions` (create) / `PATCH /api/admin/promotions/{id}` (update)

| Field | Type | Required | Validation Rule | Error Message | Example Valid Value | Validation Timing |
|-------|------|----------|-----------------|---------------|---------------------|-------------------|
| name | text | Yes | Min 3, max 200 characters. | `""` -> "Campaign name is required" / `"AB"` -> "Name must be at least 3 characters" | `Summer Mega Sale` | Real-time (on blur) |
| description | textarea | No | Max 500 characters. | (exceeds 500) -> "Description must not exceed 500 characters" | `All categories` | Real-time (on blur) |
| type | select | Yes | One of: `FLASH_SALE`, `COUPON`, `BUNDLE`, `CATEGORY_DISCOUNT`, `FREE_SHIPPING`. | "Please select a promotion type" | `FLASH_SALE` | Real-time (on change) |
| discountType | select | Yes | One of: `PERCENTAGE`, `FIXED`. | "Please select a discount type" | `PERCENTAGE` | Real-time (on change) |
| discountValue | number | Yes | When `PERCENTAGE`: must be 1-100. When `FIXED`: must be > 0, max 1,000,000. | `""` -> "Discount value is required" / `"0"` -> "Discount must be greater than 0" / `"150"` (percentage) -> "Percentage discount cannot exceed 100%" | `40` | Real-time (on blur, re-validates when discountType changes) |
| couponCode | text | Conditional | Required if type is `COUPON`. Alphanumeric, 4-20 characters. Uppercased. Unique (server check). | `""` (when COUPON) -> "Coupon code is required" / `"AB"` -> "Coupon code must be at least 4 characters" / (409) -> "This coupon code already exists" | `WELCOME200` | Real-time (on blur) + server uniqueness check |
| startDate | datetime | Yes | Must be today or a future date. | `""` -> "Start date is required" / `"2025-01-01"` -> "Start date must be today or in the future" | `2026-03-01T00:00:00Z` | Real-time (on change) |
| endDate | datetime | Yes | Must be after startDate. Must be within 1 year of startDate. | `""` -> "End date is required" / (before start) -> "End date must be after start date" / (> 1 year gap) -> "Promotion duration cannot exceed 1 year" | `2026-03-31T23:59:59Z` | Real-time (on change, re-validates when startDate changes) |
| usageLimit | number | No | Integer, must be > 0 if provided. Null means unlimited. | `"0"` -> "Usage limit must be at least 1" / `"-5"` -> "Usage limit must be at least 1" / `"3.5"` -> "Usage limit must be a whole number" | `2000` | Real-time (on blur) |
| minOrderAmount | number | No | Must be >= 0 if provided. Max 2 decimal places. | `"-100"` -> "Minimum order amount cannot be negative" | `500` | Real-time (on blur) |
| maxDiscountAmount | number | No | Must be > 0 if provided. Only applicable for percentage discounts. | `"0"` -> "Maximum discount amount must be greater than 0" | `1000` | Real-time (on blur) |
| applicableCategories | multi-select | No | Valid category IDs from the system. | N/A (free selection from available categories) | `["cat-electronics", "cat-fashion"]` | N/A |

**Zod Schema:**

```typescript
import { z } from 'zod';

const PROMO_TYPES = ['FLASH_SALE', 'COUPON', 'BUNDLE', 'CATEGORY_DISCOUNT', 'FREE_SHIPPING'] as const;
const DISCOUNT_TYPES = ['PERCENTAGE', 'FIXED'] as const;

export const promotionSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Campaign name is required')
      .min(3, 'Name must be at least 3 characters')
      .max(200, 'Name must not exceed 200 characters'),
    description: z
      .string()
      .max(500, 'Description must not exceed 500 characters')
      .optional()
      .or(z.literal('')),
    type: z.enum(PROMO_TYPES, {
      errorMap: () => ({ message: 'Please select a promotion type' }),
    }),
    discountType: z.enum(DISCOUNT_TYPES, {
      errorMap: () => ({ message: 'Please select a discount type' }),
    }),
    discountValue: z
      .number({
        required_error: 'Discount value is required',
        invalid_type_error: 'Discount value must be a number',
      })
      .positive('Discount must be greater than 0'),
    couponCode: z
      .string()
      .regex(/^[a-zA-Z0-9]*$/, 'Coupon code can only contain letters and numbers')
      .min(4, 'Coupon code must be at least 4 characters')
      .max(20, 'Coupon code must not exceed 20 characters')
      .transform((val) => val.toUpperCase())
      .optional()
      .or(z.literal('')),
    startDate: z
      .string()
      .min(1, 'Start date is required')
      .refine(
        (val) => {
          const date = new Date(val);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date >= today;
        },
        'Start date must be today or in the future'
      ),
    endDate: z.string().min(1, 'End date is required'),
    usageLimit: z
      .number()
      .int('Usage limit must be a whole number')
      .positive('Usage limit must be at least 1')
      .optional()
      .nullable(),
    minOrderAmount: z
      .number()
      .min(0, 'Minimum order amount cannot be negative')
      .multipleOf(0.01)
      .optional()
      .nullable(),
    maxDiscountAmount: z
      .number()
      .positive('Maximum discount amount must be greater than 0')
      .optional()
      .nullable(),
    applicableCategories: z.array(z.string()).optional().default([]),
  })
  .refine(
    (data) => {
      if (data.discountType === 'PERCENTAGE') {
        return data.discountValue <= 100;
      }
      return data.discountValue <= 1_000_000;
    },
    {
      message: 'Percentage discount cannot exceed 100%',
      path: ['discountValue'],
    }
  )
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    }
  )
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      const oneYear = 365 * 24 * 60 * 60 * 1000;
      return end.getTime() - start.getTime() <= oneYear;
    },
    {
      message: 'Promotion duration cannot exceed 1 year',
      path: ['endDate'],
    }
  )
  .refine(
    (data) => {
      if (data.type === 'COUPON') {
        return data.couponCode && data.couponCode.length >= 4;
      }
      return true;
    },
    {
      message: 'Coupon code is required for coupon-type promotions',
      path: ['couponCode'],
    }
  );

export type PromotionFormData = z.infer<typeof promotionSchema>;
```

---

### 3.2 CMS Banner Form

**Page:** `admin-cms.html` (Create/Edit Banner modal)
**API:** `POST /api/admin/cms/banners` (create) / `PUT /api/admin/cms/banners/{id}` (edit)

| Field | Type | Required | Validation Rule | Error Message | Example Valid Value | Validation Timing |
|-------|------|----------|-----------------|---------------|---------------------|-------------------|
| title | text | Yes | Min 3, max 200 characters. | `""` -> "Banner title is required" / `"AB"` -> "Title must be at least 3 characters" | `Summer Sale 2026 - Up to 60% Off` | Real-time (on blur) |
| position | select | Yes | One of: `Home Hero`, `Category Banner`, `Sidebar`, `Footer`, `Checkout`. | "Please select a banner position" | `Home Hero` | Real-time (on change) |
| image | file | Yes | Max 5 MB. Accepted: JPG, PNG, WebP. Recommended: 1920x600px. | `(no file)` -> "Banner image is required" / `(> 5 MB)` -> "Image must be under 5 MB" / `(.gif)` -> "Only JPG, PNG, and WebP images are allowed" | `summer-sale.jpg (2.1 MB)` | Real-time (on file select) |
| linkUrl | url | No | Valid relative or absolute URL. Max 500 characters. Relative URLs must start with `/`. Absolute URLs must start with `http://` or `https://`. | `"not a url"` -> "Please enter a valid URL (e.g., /sale/summer or https://...)" | `/sale/summer-2026` | Real-time (on blur) |
| startDate | datetime | Yes | Must be today or a future date. | `""` -> "Start date is required" / `"2025-01-01"` -> "Start date must be today or in the future" | `2026-03-01T00:00:00Z` | Real-time (on change) |
| endDate | datetime | Yes | Must be after startDate. | `""` -> "End date is required" / (before start) -> "End date must be after start date" | `2026-04-30T23:59:59Z` | Real-time (on change) |
| sortOrder | number | No | Integer, 0-100. Lower numbers appear first. | `"-1"` -> "Sort order must be 0 or greater" / `"3.5"` -> "Sort order must be a whole number" | `1` | Real-time (on blur) |
| isActive | checkbox | No | Boolean. Defaults to true. | N/A | `true` | N/A |

**Zod Schema:**

```typescript
import { z } from 'zod';

const BANNER_POSITIONS = ['Home Hero', 'Category Banner', 'Sidebar', 'Footer', 'Checkout'] as const;

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const cmsBannerSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Banner title is required')
      .min(3, 'Title must be at least 3 characters')
      .max(200, 'Title must not exceed 200 characters'),
    position: z.enum(BANNER_POSITIONS, {
      errorMap: () => ({ message: 'Please select a banner position' }),
    }),
    image: z
      .instanceof(File)
      .refine((f) => f.size <= MAX_IMAGE_SIZE, 'Image must be under 5 MB')
      .refine(
        (f) => ACCEPTED_IMAGE_TYPES.includes(f.type),
        'Only JPG, PNG, and WebP images are allowed'
      ),
    linkUrl: z
      .string()
      .max(500, 'URL is too long')
      .refine(
        (val) => {
          if (!val) return true;
          return /^\//.test(val) || /^https?:\/\//.test(val);
        },
        'Please enter a valid URL (e.g., /sale/summer or https://...)'
      )
      .optional()
      .or(z.literal('')),
    startDate: z
      .string()
      .min(1, 'Start date is required')
      .refine(
        (val) => {
          const date = new Date(val);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date >= today;
        },
        'Start date must be today or in the future'
      ),
    endDate: z.string().min(1, 'End date is required'),
    sortOrder: z
      .number()
      .int('Sort order must be a whole number')
      .min(0, 'Sort order must be 0 or greater')
      .max(100, 'Sort order must not exceed 100')
      .optional()
      .default(0),
    isActive: z.boolean().optional().default(true),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    }
  );

export type CmsBannerFormData = z.infer<typeof cmsBannerSchema>;
```

---

### 3.3 CMS Page Form

**Page:** `admin-cms.html` (Create/Edit Page)
**API:** `POST /api/admin/cms/pages` (create) / `PUT /api/admin/cms/pages/{id}` (edit)

| Field | Type | Required | Validation Rule | Error Message | Example Valid Value | Validation Timing |
|-------|------|----------|-----------------|---------------|---------------------|-------------------|
| title | text | Yes | Min 3, max 200 characters. | `""` -> "Page title is required" / `"AB"` -> "Title must be at least 3 characters" | `About Us` | Real-time (on blur) |
| slug | text | Yes | Lowercase letters, numbers, and hyphens only. Min 2, max 100. No leading/trailing hyphens. No consecutive hyphens. Must be unique (server check). Auto-generated from title. | `""` -> "URL slug is required" / `"A"` -> "Slug must be at least 2 characters" / `"Has Spaces"` -> "Slug can only contain lowercase letters, numbers, and hyphens" / `"-leading"` -> "Slug cannot start or end with a hyphen" / (409) -> "This slug is already in use" | `about-us` | Real-time (on blur) + server uniqueness check |
| content | textarea (rich text) | Yes | Min 10 characters (HTML stripped for counting). Max 50,000. | `""` -> "Page content is required" / `"Short"` -> "Content must be at least 10 characters" | `<h2>About HomeBase</h2><p>HomeBase is India's leading marketplace...</p>` | On submit (content too complex for blur validation) |
| metaTitle | text | No | Max 70 characters. Auto-generated from title if empty. | (exceeds 70) -> "Meta title must not exceed 70 characters" | `About Us - HomeBase Marketplace` | Real-time (on blur, with character counter) |
| metaDescription | textarea | No | Max 160 characters. | (exceeds 160) -> "Meta description must not exceed 160 characters" | `Learn about HomeBase, India's leading online marketplace...` | Real-time (on blur, with character counter) |
| isPublished | checkbox | No | Boolean. Defaults to false (draft). | N/A | `true` | N/A |

**Zod Schema:**

```typescript
import { z } from 'zod';

export const cmsPageSchema = z.object({
  title: z
    .string()
    .min(1, 'Page title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),
  slug: z
    .string()
    .min(1, 'URL slug is required')
    .min(2, 'Slug must be at least 2 characters')
    .max(100, 'Slug must not exceed 100 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug can only contain lowercase letters, numbers, and hyphens (no leading/trailing/consecutive hyphens)'
    ),
  content: z
    .string()
    .min(1, 'Page content is required')
    .refine(
      (val) => {
        const stripped = val.replace(/<[^>]*>/g, '').trim();
        return stripped.length >= 10;
      },
      'Content must be at least 10 characters'
    )
    .refine(
      (val) => {
        const stripped = val.replace(/<[^>]*>/g, '').trim();
        return stripped.length <= 50_000;
      },
      'Content must not exceed 50,000 characters'
    ),
  metaTitle: z
    .string()
    .max(70, 'Meta title must not exceed 70 characters')
    .optional()
    .or(z.literal('')),
  metaDescription: z
    .string()
    .max(160, 'Meta description must not exceed 160 characters')
    .optional()
    .or(z.literal('')),
  isPublished: z.boolean().optional().default(false),
});

export type CmsPageFormData = z.infer<typeof cmsPageSchema>;
```

---

## 4. Warehouse App Forms

### 4.1 Receive Shipment Form

**Page:** `warehouse-inbound.html` (Receiving modal/drawer per shipment)
**API:** `PATCH /api/warehouseinbound/{shipmentId}/receive` (STM event)

| Field | Type | Required | Validation Rule | Error Message | Example Valid Value | Validation Timing |
|-------|------|----------|-----------------|---------------|---------------------|-------------------|
| items[].sku | hidden | Yes | Prefilled from shipment data. Not user-editable. | N/A | `HB-EL-4521` | N/A |
| items[].receivedQty | number | Yes | Integer, >= 0. Must be <= expectedQty for the SKU. | `""` -> "Received quantity is required" / `"-1"` -> "Quantity cannot be negative" / `"55"` (expected 50) -> "Received quantity cannot exceed expected quantity (50)" / `"3.5"` -> "Quantity must be a whole number" | `48` | Real-time (on blur) |
| items[].condition | select | Yes | One of: `GOOD`, `DAMAGED`, `PARTIAL_DAMAGE`, `REJECTED`. | "Please select item condition" | `GOOD` | Real-time (on change) |
| items[].damagedQty | number | Conditional | Required if condition is `DAMAGED` or `PARTIAL_DAMAGE`. Integer, >= 0, <= receivedQty. | `""` (when damaged) -> "Please specify the number of damaged units" / `"55"` (when received 48) -> "Damaged quantity cannot exceed received quantity" | `2` | Real-time (on blur) |
| items[].damageNotes | textarea | Conditional | Required if damagedQty > 0. Min 5, max 500 characters. | `""` (when damaged) -> "Please describe the damage" / `"Bad"` -> "Damage notes must be at least 5 characters" | `Packaging dented on 2 units` | Real-time (on blur) |
| items[].binLocation | text | No | Warehouse bin format: letter + digit + `-R` + digit + `-S` + digit (e.g., `A3-R2-S5`). | `"invalid"` -> "Please enter a valid bin location (e.g., A3-R2-S5)" | `A3-R2-S5` | Real-time (on blur) |
| notes | textarea | No | Max 1000 characters. | (exceeds 1000) -> "Notes must not exceed 1000 characters" | `2 units damaged in transit, quarantined for seller review` | Real-time (on blur) |

**Zod Schema:**

```typescript
import { z } from 'zod';

const CONDITIONS = ['GOOD', 'DAMAGED', 'PARTIAL_DAMAGE', 'REJECTED'] as const;

const receivingItemSchema = z
  .object({
    sku: z.string().min(1, 'SKU is required'),
    expectedQty: z.number().int().min(0), // read-only, for cross-validation
    receivedQty: z
      .number({
        required_error: 'Received quantity is required',
        invalid_type_error: 'Quantity must be a number',
      })
      .int('Quantity must be a whole number')
      .min(0, 'Quantity cannot be negative'),
    condition: z.enum(CONDITIONS, {
      errorMap: () => ({ message: 'Please select item condition' }),
    }),
    damagedQty: z
      .number()
      .int('Damaged quantity must be a whole number')
      .min(0, 'Damaged quantity cannot be negative')
      .optional()
      .nullable()
      .default(0),
    damageNotes: z
      .string()
      .max(500, 'Damage notes must not exceed 500 characters')
      .optional()
      .or(z.literal('')),
    binLocation: z
      .string()
      .regex(
        /^[A-Z]\d+-R\d+-S\d+$/,
        'Please enter a valid bin location (e.g., A3-R2-S5)'
      )
      .optional()
      .or(z.literal('')),
  })
  .refine((data) => data.receivedQty <= data.expectedQty, {
    message: 'Received quantity cannot exceed expected quantity',
    path: ['receivedQty'],
  })
  .refine(
    (data) => {
      if (data.condition === 'DAMAGED' || data.condition === 'PARTIAL_DAMAGE') {
        return data.damagedQty !== null && data.damagedQty !== undefined && data.damagedQty > 0;
      }
      return true;
    },
    {
      message: 'Please specify the number of damaged units',
      path: ['damagedQty'],
    }
  )
  .refine(
    (data) => {
      if (data.damagedQty && data.damagedQty > 0) {
        return data.damagedQty <= data.receivedQty;
      }
      return true;
    },
    {
      message: 'Damaged quantity cannot exceed received quantity',
      path: ['damagedQty'],
    }
  )
  .refine(
    (data) => {
      if (data.damagedQty && data.damagedQty > 0) {
        return data.damageNotes && data.damageNotes.trim().length >= 5;
      }
      return true;
    },
    {
      message: 'Please describe the damage (at least 5 characters)',
      path: ['damageNotes'],
    }
  );

export const receiveShipmentSchema = z.object({
  items: z.array(receivingItemSchema).min(1, 'At least one item must be received'),
  receivedBy: z.string().min(1, 'Staff ID is required'),
  notes: z
    .string()
    .max(1000, 'Notes must not exceed 1000 characters')
    .optional()
    .or(z.literal('')),
});

export type ReceiveShipmentFormData = z.infer<typeof receiveShipmentSchema>;
```

---

### 4.2 Stock Adjustment Form

**Page:** `warehouse-inventory.html` (Adjust Stock modal)
**API:** `PATCH /api/warehouseinventory/{sku}/adjust` (STM event)

| Field | Type | Required | Validation Rule | Error Message | Example Valid Value | Validation Timing |
|-------|------|----------|-----------------|---------------|---------------------|-------------------|
| adjustmentType | select | Yes | One of: `MANUAL_ADJUST`, `CYCLE_COUNT`, `DAMAGE_WRITEOFF`, `RETURN_RESTOCK`, `TRANSFER`. | "Please select an adjustment type" | `MANUAL_ADJUST` | Real-time (on change) |
| newQty | number | Yes | Integer. Can be any non-negative value (system computes delta from current qty). Must be >= 0. Max 999,999. | `""` -> "New quantity is required" / `"-5"` -> "Quantity cannot be negative" / `"5.5"` -> "Quantity must be a whole number" | `118` | Real-time (on blur) |
| reason | text | Yes | Min 5, max 200 characters. Explains why the adjustment is being made. | `""` -> "Reason is required" / `"Fix"` -> "Reason must be at least 5 characters" / (exceeds 200) -> "Reason must not exceed 200 characters" | `Cycle count correction` | Real-time (on blur) |
| binLocation | text | No | Valid warehouse bin format if provided. | `"invalid"` -> "Please enter a valid bin location (e.g., A3-R2-S5)" | `A3-R2-S5` | Real-time (on blur) |

**Zod Schema:**

```typescript
import { z } from 'zod';

const ADJUSTMENT_TYPES = [
  'MANUAL_ADJUST',
  'CYCLE_COUNT',
  'DAMAGE_WRITEOFF',
  'RETURN_RESTOCK',
  'TRANSFER',
] as const;

export const stockAdjustmentSchema = z.object({
  adjustmentType: z.enum(ADJUSTMENT_TYPES, {
    errorMap: () => ({ message: 'Please select an adjustment type' }),
  }),
  newQty: z
    .number({
      required_error: 'New quantity is required',
      invalid_type_error: 'Quantity must be a number',
    })
    .int('Quantity must be a whole number')
    .min(0, 'Quantity cannot be negative')
    .max(999_999, 'Quantity cannot exceed 999,999'),
  reason: z
    .string()
    .min(1, 'Reason is required')
    .min(5, 'Reason must be at least 5 characters')
    .max(200, 'Reason must not exceed 200 characters'),
  binLocation: z
    .string()
    .regex(
      /^[A-Z]\d+-R\d+-S\d+$/,
      'Please enter a valid bin location (e.g., A3-R2-S5)'
    )
    .optional()
    .or(z.literal('')),
});

export type StockAdjustmentFormData = z.infer<typeof stockAdjustmentSchema>;
```

---

### 4.3 Packing Form

**Page:** `warehouse-orders.html` (Mark as Packed modal)
**API:** `PATCH /api/warehouseorder/{orderId}/markPacked` (STM event)

| Field | Type | Required | Validation Rule | Error Message | Example Valid Value | Validation Timing |
|-------|------|----------|-----------------|---------------|---------------------|-------------------|
| packagingType | select | Yes | One of: `ENVELOPE`, `BOX_SMALL`, `BOX_MEDIUM`, `BOX_LARGE`, `CUSTOM`. | "Please select packaging type" | `BOX_MEDIUM` | Real-time (on change) |
| weight | number | Yes | Must be > 0. Max 50 (kg). Max 3 decimal places. | `""` -> "Weight is required" / `"0"` -> "Weight must be greater than 0" / `"-1"` -> "Weight must be greater than 0" / `"51"` -> "Weight cannot exceed 50 kg" | `0.85` | Real-time (on blur) |
| dimensions.length | number | Yes | Must be > 0. Max 200 (cm). Max 1 decimal place. | `""` -> "Length is required" / `"0"` -> "Length must be greater than 0" | `30` | Real-time (on blur) |
| dimensions.width | number | Yes | Must be > 0. Max 200 (cm). Max 1 decimal place. | `""` -> "Width is required" / `"0"` -> "Width must be greater than 0" | `20` | Real-time (on blur) |
| dimensions.height | number | Yes | Must be > 0. Max 200 (cm). Max 1 decimal place. | `""` -> "Height is required" / `"0"` -> "Height must be greater than 0" | `12` | Real-time (on blur) |
| dimensions.unit | select | No | One of: `cm`, `in`. Defaults to `cm`. | N/A | `cm` | N/A |
| items[].sku | hidden | Yes | Prefilled. Must match order's pick list. | N/A | `WBH-2204` | N/A |
| items[].qty | number | Yes | Must match picked quantity for each item. | `"2"` (when picked 1) -> "Packed quantity must match picked quantity" | `1` | On submit |
| includeInvoice | checkbox | No | Boolean. Defaults to true. | N/A | `true` | N/A |
| fragile | checkbox | No | Boolean. Defaults to false. | N/A | `false` | N/A |
| giftWrap | checkbox | No | Boolean. Defaults to false. | N/A | `false` | N/A |
| notes | textarea | No | Max 500 characters. | (exceeds 500) -> "Notes must not exceed 500 characters" | `Handle with care - electronics` | Real-time (on blur) |

**Zod Schema:**

```typescript
import { z } from 'zod';

const PACKAGING_TYPES = ['ENVELOPE', 'BOX_SMALL', 'BOX_MEDIUM', 'BOX_LARGE', 'CUSTOM'] as const;

const packingItemSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  qty: z
    .number({ required_error: 'Quantity is required' })
    .int('Quantity must be a whole number')
    .positive('Quantity must be greater than 0'),
  expectedQty: z.number().int(), // read-only, for cross-validation
});

export const packingSchema = z
  .object({
    packagingType: z.enum(PACKAGING_TYPES, {
      errorMap: () => ({ message: 'Please select packaging type' }),
    }),
    weight: z
      .number({
        required_error: 'Weight is required',
        invalid_type_error: 'Weight must be a number',
      })
      .positive('Weight must be greater than 0')
      .max(50, 'Weight cannot exceed 50 kg'),
    dimensions: z.object({
      length: z
        .number({ required_error: 'Length is required' })
        .positive('Length must be greater than 0')
        .max(200, 'Length cannot exceed 200 cm'),
      width: z
        .number({ required_error: 'Width is required' })
        .positive('Width must be greater than 0')
        .max(200, 'Width cannot exceed 200 cm'),
      height: z
        .number({ required_error: 'Height is required' })
        .positive('Height must be greater than 0')
        .max(200, 'Height cannot exceed 200 cm'),
      unit: z.enum(['cm', 'in']).optional().default('cm'),
    }),
    items: z.array(packingItemSchema).min(1, 'At least one item must be packed'),
    includeInvoice: z.boolean().optional().default(true),
    fragile: z.boolean().optional().default(false),
    giftWrap: z.boolean().optional().default(false),
    notes: z
      .string()
      .max(500, 'Notes must not exceed 500 characters')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      return data.items.every((item) => item.qty === item.expectedQty);
    },
    {
      message: 'Packed quantities must match picked quantities for all items',
      path: ['items'],
    }
  );

export type PackingFormData = z.infer<typeof packingSchema>;
```

---

## 5. Shared Validation Utilities

### Common Regex Patterns

```typescript
/** Reusable validation patterns used across multiple forms */
export const PATTERNS = {
  /** Indian mobile: optional +91 prefix, first digit 6-9, total 10 digits */
  indianPhone: /^(\+91\s?)?[6-9]\d{9}$/,

  /** Phone number (10 digits only, no prefix) */
  phone10Digit: /^[6-9]\d{9}$/,

  /** Email (RFC 5322 simplified) */
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  /** Indian PIN code: 6 digits, first digit 1-9 */
  indianPin: /^[1-9]\d{5}$/,

  /** IFSC code: 4 letters + 0 + 6 alphanumeric */
  ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,

  /** PAN: 5 letters + 4 digits + 1 letter */
  pan: /^[A-Z]{5}\d{4}[A-Z]{1}$/,

  /** GSTIN: 2 digits + 10 char PAN + 1 alphanumeric + Z + 1 check */
  gstin: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/,

  /** SKU: letters, numbers, hyphens */
  sku: /^[a-zA-Z0-9\-]+$/,

  /** URL slug: lowercase letters, numbers, single hyphens */
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,

  /** Alphanumeric only */
  alphanumeric: /^[a-zA-Z0-9]+$/,

  /** Hex color */
  hexColor: /^#[0-9a-fA-F]{6}$/,

  /** Warehouse bin location */
  binLocation: /^[A-Z]\d+-R\d+-S\d+$/,

  /** Name: letters, spaces, common punctuation */
  personName: /^[a-zA-Z\s'\-\.]+$/,
};
```

### File Validation Helpers

```typescript
export const FILE_LIMITS = {
  productImage: { maxSize: 5 * 1024 * 1024, types: ['image/jpeg', 'image/png', 'image/webp'] },
  avatar: { maxSize: 2 * 1024 * 1024, types: ['image/jpeg', 'image/png', 'image/webp'] },
  banner: { maxSize: 5 * 1024 * 1024, types: ['image/jpeg', 'image/png'] },
  logo: { maxSize: 2 * 1024 * 1024, types: ['image/jpeg', 'image/png'] },
  document: {
    maxSize: 10 * 1024 * 1024,
    types: [
      'image/jpeg', 'image/png', 'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
};

export function validateFile(
  file: File,
  limits: { maxSize: number; types: string[] }
): string | null {
  if (file.size > limits.maxSize) {
    const sizeMB = (limits.maxSize / (1024 * 1024)).toFixed(0);
    return `File must be under ${sizeMB} MB`;
  }
  if (!limits.types.includes(file.type)) {
    const exts = limits.types.map((t) => t.split('/')[1].toUpperCase()).join(', ');
    return `Only ${exts} files are allowed`;
  }
  return null;
}
```

### Password Strength Calculator

```typescript
export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export function getPasswordStrength(password: string): {
  strength: PasswordStrength;
  score: number; // 0-4
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push('At least 8 characters');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('One uppercase letter');

  if (/[0-9]/.test(password)) score++;
  else feedback.push('One number');

  if (/[@$!%*?&#+]/.test(password)) score++;
  else feedback.push('One special character');

  const strength: PasswordStrength =
    score <= 1 ? 'weak' : score === 2 ? 'fair' : score === 3 ? 'good' : 'strong';

  return { strength, score, feedback };
}
```

---

## 6. Validation Strategy Summary

### When to Validate

| Strategy | When to Use | Forms |
|----------|-------------|-------|
| **Real-time (on blur)** | Most text/email/phone fields. Show errors after the user leaves the field. | All forms |
| **Real-time (on change)** | Select/dropdown fields and checkboxes. Validate immediately on selection. | All selects, star ratings |
| **Real-time (on change, debounced)** | Search inputs, autocomplete. Delay API calls by 300-500ms. | Search (1.5), SKU uniqueness (2.1), email uniqueness (1.2) |
| **Real-time (on file select)** | File uploads. Validate size and type immediately when file is chosen. | All file uploads |
| **On submit** | Final validation pass. Catches any fields not yet blurred. Also used for cross-field validations. | All forms |
| **Server-side (post-submit)** | Uniqueness checks, coupon validity, IFSC verification, PIN serviceability. | Login (1.1), Register (1.2), Coupon (1.4), SKU (2.1), Bank (2.6) |

### Error Display Patterns

1. **Inline errors** -- Red text below the field, field border turns red. Appears on blur or on change per the timing above.
2. **Toast errors** -- For server-side errors (network failures, 500s) that are not field-specific.
3. **Banner errors** -- For form-level errors at the top of the form (e.g., "Please fix 3 errors below").
4. **Character counters** -- Shown for textareas with max length. Format: `42 / 500`. Turns red when approaching or exceeding the limit.

### Accessibility Requirements

- Every field with an error must have `aria-invalid="true"` and `aria-describedby` pointing to the error message element.
- Error messages must use `role="alert"` or be inside a `<div aria-live="polite">` so screen readers announce them.
- Required fields must have `aria-required="true"`.
- Password strength indicator must be associated via `aria-describedby`.

### Server vs Client Validation

All client-side validations documented here must also be enforced server-side. The client validations provide instant feedback; the server is the source of truth. Server responses use this error format:

```json
{
  "success": false,
  "code": 422,
  "errors": [
    {
      "field": "email",
      "code": "EMAIL_EXISTS",
      "message": "An account with this email already exists"
    },
    {
      "field": "sku",
      "code": "SKU_DUPLICATE",
      "message": "This SKU already exists"
    }
  ]
}
```

The frontend should map server `field` names to form field names and display the corresponding error inline.
