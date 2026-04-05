# Customer Account Flow

Account registration, login, profile setup, and management.

---

## Flow Overview

```
+------------+     +-------------+     +--------------+     +-------------+
| Register   |---->| Verify      |---->| Setup        |---->| Add         |
|            |     | Email       |     | Profile      |     | Address     |
| login.html |     | (email link)|     | my-account.  |     | my-account. |
|            |     |             |     | html         |     | html        |
+------------+     +-------------+     +--------------+     +-------------+
                                                                   |
                                                                   v
                                                            +-------------+
                                                            | Add Payment |
                                                            | Method      |
                                                            | my-account. |
                                                            | html        |
                                                            +-------------+
```

---

## Registration Flow

```
    [START]
       |
       v
+-------------------+
| LOGIN PAGE        |
| login.html        |
|                   |
| [Sign In] [Create |
|  Account]         |
+-------------------+
       |
       | Click "Create Account" tab
       v
+-------------------+
| REGISTRATION FORM |
|                   |
| Full Name: [____] |
| Email:     [____] |
| Phone:     [____] |
| Password:  [____] |
|                   |
| [x] Agree to T&C |
|                   |
| [Create Account]  |
+-------------------+
       |
       +-------+--------+
       |                |
       v                v
  +---------+    +-----------+
  | Success |    | Error     |
  | Account |    |           |
  | created |    | - Email   |
  +---------+    |   exists  |
       |         | - Weak    |
       |         |   password|
       |         | - Invalid |
       |         |   phone   |
       |         +-----------+
       |              |
       |              v
       |         Fix & Retry
       |
       v
+-------------------+
| VERIFY EMAIL      |
|                   |
| "Verification     |
|  email sent to    |
|  r****l@email.com"|
|                   |
| [Resend Email]    |
+-------------------+
       |
       | User clicks link in email
       v
+-------------------+
| EMAIL VERIFIED    |
|                   |
| "Your email has   |
|  been verified!"  |
+-------------------+
       |
       v
+-------------------+
| SETUP PROFILE     |
| my-account.html   |
|                   |
| Avatar:   [Upload]|
| DOB:      [____]  |
| Gender:   [____]  |
+-------------------+
       |
       v
+-------------------+
| ADD ADDRESS       |
| my-account.html   |
|                   |
| Full Name: [____] |
| Phone:     [____] |
| Line 1:    [____] |
| Line 2:    [____] |
| City:      [____] |
| State:     [____] |
| Pincode:   [____] |
| Type: Home/Office |
+-------------------+
       |
       v
+-------------------+
| ADD PAYMENT       |
| METHOD (Optional) |
| my-account.html   |
|                   |
| ( ) Credit Card   |
| ( ) UPI ID        |
+-------------------+
       |
       v
+-------------------+
| ACCOUNT READY     |
| Redirect to       |
| storefront.html   |
+-------------------+
       |
       v
     [END]
```

---

## Login Flow (All Methods)

```
    [START]
       |
       v
+-------------------+
| LOGIN PAGE        |
| login.html        |
+-------------------+
       |
       +------+-------+-------+
       |      |       |       |
       v      v       v       v
+------+ +------+ +------+ +------+
|Email | |Google| |Phone | |Forgot|
|+Pass | |OAuth | |OTP   | |Pass  |
+------+ +------+ +------+ +------+
   |        |        |        |
   v        v        v        |
+------+ +------+ +------+   |
|POST  | |GET   | |POST  |   |
|/auth/| |/auth/| |/auth/|   |
|login | |google| |otp/  |   |
+------+ +------+ |send  |   |
   |        |     +------+   |
   |        |        |       |
   |        |        v       |
   |        |   +--------+   |
   |        |   |Enter   |   |
   |        |   |6-digit |   |
   |        |   |OTP     |   |
   |        |   +--------+   |
   |        |        |       |
   |        |        v       |
   |        |   +--------+   |
   |        |   |POST    |   |
   |        |   |/auth/  |   |
   |        |   |otp/    |   |
   |        |   |verify  |   |
   |        |   +--------+   |
   |        |        |       |
   +--------+--------+       |
            |                 |
            v                 |
      +-----------+           |
      | JWT Token |           |
      | Received  |           |
      | accessToken +         |
      | refreshToken|         |
      +-----------+           |
            |                 |
            v                 |
      +-----------+           |
      | Redirect  |           |
      | to origin |           |
      | or home   |           |
      +-----------+           |
            |                 |
            v                 v
          [END]         (see below)
```

---

## Forgot Password Flow

```
    [START]
       |
       v
+-------------------+
| FORGOT PASSWORD   |
| login.html        |
| (Forgot Password  |
|  link)            |
+-------------------+
       |
       v
+-------------------+
| ENTER EMAIL       |
|                   |
| Email: [________] |
|                   |
| [Send Reset Link] |
+-------------------+
       |
       v
+-------------------+
| POST /api/auth/   |
| forgot-password   |
+-------------------+
       |
       +------+--------+
       |               |
       v               v
+----------+    +-----------+
| Email    |    | Email not |
| sent to  |    | found     |
| r****l@  |    | "No       |
| example  |    | account   |
| .com     |    | with this |
+----------+    | email"    |
       |        +-----------+
       |
       | User clicks link in email
       v
+-------------------+
| RESET PASSWORD    |
|                   |
| New Password:     |
| [________________]|
| Confirm Password: |
| [________________]|
|                   |
| [Reset Password]  |
+-------------------+
       |
       v
+-------------------+
| POST /api/auth/   |
| reset-password    |
| {token, newPass}  |
+-------------------+
       |
       +------+--------+
       |               |
       v               v
+-----------+   +-----------+
| "Password |   | "Reset    |
| updated   |   | link      |
| success-  |   | expired.  |
| fully"    |   | Request   |
+-----------+   | new one"  |
       |        +-----------+
       v
+-------------------+
| REDIRECT TO LOGIN |
| login.html        |
| Pre-fill email    |
+-------------------+
       |
       v
     [END]
```

---

## Account Settings Management

```
+============================+
| MY ACCOUNT                 |
| my-account.html            |
+============================+
       |
       +------+------+------+------+------+
       |      |      |      |      |      |
       v      v      v      v      v      v
  +------+ +------+ +------+ +------+ +------+
  |Profile| |Addrs | |Paymnt| |Settng| |Passwd|
  |Edit   | |Manage| |Manage| |Notif | |Change|
  +------+ +------+ +------+ +------+ +------+
     |        |        |        |        |
     v        v        v        v        v

  PUT       POST/     POST/    PUT      PUT
  /account/ PUT/DEL   DEL      /account //account
  profile   /account/ /account /settings /password
            addresses payment-
                     methods

  Each section is an editable card on the
  my-account.html page with Save buttons.
```

### Profile Edit
```
+-------------------+
| PROFILE SECTION   |
|                   |
| Avatar: [PK] [Ed] |
| Name:   Premkumar |
| Email:  (verified)|
| Phone:  +91 9876  |
| DOB:    1990-05-15|
| Gender: Male      |
|                   |
| [Edit] -> [Save]  |
+-------------------+
```

### Address Management
```
+-------------------+
| ADDRESSES SECTION |
|                   |
| +- Home (Default) |
| |  Flat 402,      |
| |  Sunshine Towers|
| |  [Edit] [Delete]|
| |  [Set Default]  |
| +                 |
| +- Office         |
| |  3rd Floor,     |
| |  WeWork Galaxy  |
| |  [Edit] [Delete]|
| +                 |
|                   |
| [+ Add New Addr]  |
+-------------------+
```

### Payment Methods
```
+-------------------+
| PAYMENT SECTION   |
|                   |
| Visa ****4242     |
| Exp: 12/2027      |
| (Default)         |
| [Delete]          |
|                   |
| UPI: premkumar@   |
| gpay              |
| [Delete]          |
|                   |
| [+ Add Card]      |
| [+ Add UPI]       |
+-------------------+
```

---

## Page References

| Step | Prototype Page | URL Path |
|------|---------------|----------|
| Login/Register | `customer/login.html` | `/login` |
| My Account | `customer/my-account.html` | `/account` |
| Password Reset | `customer/login.html` | `/reset-password?token={token}` |

---

## API Calls at Each Step

| Step | API Endpoint | Method | Trigger |
|------|-------------|--------|---------|
| **Registration** | | | |
| Create account | `POST /api/auth/register` | POST | Form submit |
| Google OAuth | `GET /api/auth/google` | GET | Button click |
| **Login** | | | |
| Email login | `POST /api/auth/login` | POST | Form submit |
| Send OTP | `POST /api/auth/otp/send` | POST | Request OTP |
| Verify OTP | `POST /api/auth/otp/verify` | POST | OTP submit |
| **Password Reset** | | | |
| Request reset | `POST /api/auth/forgot-password` | POST | Form submit |
| Reset password | `POST /api/auth/reset-password` | POST | Form submit |
| **Account Page** | | | |
| Load profile | `GET /api/account/profile` | GET | Page load |
| Load stats | `GET /api/account/stats` | GET | Page load |
| Load addresses | `GET /api/account/addresses` | GET | Page load |
| Load payment methods | `GET /api/account/payment-methods` | GET | Page load |
| Load settings | `GET /api/account/settings` | GET | Page load |
| **Profile Actions** | | | |
| Update profile | `PUT /api/account/profile` | PUT | Save click |
| Upload avatar | `POST /api/account/avatar` | POST | File select |
| Change password | `PUT /api/account/password` | PUT | Form submit |
| **Address Actions** | | | |
| Add address | `POST /api/account/addresses` | POST | Form submit |
| Update address | `PUT /api/account/addresses/{id}` | PUT | Save click |
| Delete address | `DELETE /api/account/addresses/{id}` | DELETE | Delete click |
| Set default | `PUT /api/account/addresses/{id}/default` | PUT | Button click |
| **Payment Actions** | | | |
| Add payment method | `POST /api/account/payment-methods` | POST | Form submit |
| Delete payment method | `DELETE /api/account/payment-methods/{id}` | DELETE | Delete click |
| **Settings** | | | |
| Update settings | `PUT /api/account/settings` | PUT | Toggle/Save |
| **Session** | | | |
| Refresh token | `POST /api/auth/refresh` | POST | Auto (expiry) |
| Logout | `POST /api/auth/logout` | POST | Logout click |

---

## Decision Points

| Decision | Condition | Path A | Path B |
|----------|-----------|--------|--------|
| New or existing user? | Has account | Login | Register |
| Login method? | User preference | Email/Pass, Google, OTP | N/A |
| Email verified? | `emailVerified === true` | Full access | Show verification prompt |
| Has saved address? | `addresses.length > 0` | Show list | Prompt to add |
| Default address exists? | `address.isDefault === true` | Pre-select at checkout | User must select |
| Password meets policy? | Regex validation | Allow submit | Show requirements |
| OTP expired? | `expiresInSeconds` countdown | Valid entry | "OTP expired, resend" |

---

## Error Paths

| Error | Trigger | User Experience | Recovery |
|-------|---------|----------------|----------|
| Email already exists | Register | "Account already exists" | Switch to login |
| Invalid credentials | Login | "Invalid email or password" | Re-enter or reset password |
| Invalid OTP | OTP verify | "Invalid or expired OTP" | Resend OTP |
| OTP rate limit | Multiple OTP requests | "Too many attempts. Try after 5 min" | Wait and retry |
| Weak password | Register/Reset | "Password must have 8+ chars, upper, number, special" | Fix password |
| Reset token expired | Reset password | "Link expired. Request new reset" | Request new link |
| Phone already registered | Register | "Phone number already linked to account" | Use that account |
| Avatar too large | Upload | "File too large. Max 2MB" | Compress and retry |
| Invalid pincode | Add address | "Invalid pincode" inline | Correct pincode |

---

## Time Estimates

| Step | User Action | Estimated Time |
|------|------------|---------------|
| **Registration** | | |
| Fill registration form | Name, email, phone, password | 30-60 seconds |
| Google OAuth | Click and authorize | 10-20 seconds |
| Verify email | Check email, click link | 1-5 minutes |
| **Login** | | |
| Email + password login | Enter credentials | 10-20 seconds |
| OTP login | Enter phone, wait, enter OTP | 30-60 seconds |
| Google login | One click | 5-10 seconds |
| **Password Reset** | | |
| Request reset | Enter email | 10 seconds |
| Check email | Find and click link | 1-5 minutes |
| Set new password | Enter and confirm | 15-30 seconds |
| **Profile Setup** | | |
| Edit profile | Update fields | 30-60 seconds |
| Upload avatar | Select and crop | 15-30 seconds |
| Add address | Fill address form | 30-60 seconds |
| Add payment method | Enter card details | 30-60 seconds |
| **Total (new account setup)** | | **3-8 minutes** |
