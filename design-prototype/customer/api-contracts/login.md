# Login / Register — API Contract

## Page: login.html

**Note:** All auth endpoints use standard REST with direct responses (no `GenericResponse` wrapper). Auth is handled by Keycloak, not the Chenile framework.

---

## Section 1: Sign In (Email + Password)

**Data needed:** Authenticate user with credentials
**API:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "rahul@example.com",
  "password": "********",
  "rememberMe": true
}
```

**Response (success):**
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIs...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJl...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": "user-001",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "avatar": "RS",
    "phone": "+91 98765 43210"
  }
}
```

**Response (error):**
```json
{
  "error": "INVALID_CREDENTIALS",
  "message": "Invalid email or password"
}
```

---

## Section 2: Create Account (Register)

**Data needed:** Register new user
**API:** `POST /api/auth/register`

**Request:**
```json
{
  "fullName": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "+91 98765 43210",
  "password": "SecureP@ss123",
  "agreeToTerms": true
}
```

**Response (success):**
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIs...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJl...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": "user-002",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "emailVerified": false
  },
  "verificationEmailSent": true
}
```

**Response (error — email already exists):**
```json
{
  "error": "EMAIL_EXISTS",
  "message": "An account with this email already exists"
}
```

---

## Section 3: Google OAuth Sign-In

**Data needed:** Initiate Google OAuth flow
**API:** `GET /api/auth/google`

**Flow:**
1. Frontend redirects to `/api/auth/google`
2. Backend redirects to Google OAuth consent screen
3. Google redirects back to `/api/auth/google/callback?code=...`
4. Backend exchanges code for tokens and returns session

**Callback Response:**
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIs...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJl...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": "user-003",
    "name": "Rahul Sharma",
    "email": "rahul@gmail.com",
    "avatar": "https://lh3.googleusercontent.com/...",
    "isNewUser": false
  }
}
```

---

## Section 4: OTP Login (Phone Number)

**Step 1 — Send OTP:**
**API:** `POST /api/auth/otp/send`

**Request:**
```json
{
  "phone": "+91 98765 43210"
}
```

**Response:**
```json
{
  "otpSent": true,
  "expiresInSeconds": 300,
  "maskedPhone": "****** 3210"
}
```

**Step 2 — Verify OTP:**
**API:** `POST /api/auth/otp/verify`

**Request:**
```json
{
  "phone": "+91 98765 43210",
  "otp": "874523"
}
```

**Response (success):**
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIs...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJl...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": "user-001",
    "name": "Rahul Sharma",
    "phone": "+91 98765 43210"
  }
}
```

**Response (error):**
```json
{
  "error": "INVALID_OTP",
  "message": "Invalid or expired OTP"
}
```

---

## Section 5: Forgot Password

**Step 1 — Request Reset:**
**API:** `POST /api/auth/forgot-password`

**Request:**
```json
{ "email": "rahul@example.com" }
```

**Response:**
```json
{
  "emailSent": true,
  "maskedEmail": "r****l@example.com",
  "expiresInMinutes": 30
}
```

**Step 2 — Reset Password:**
**API:** `POST /api/auth/reset-password`

**Request:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecureP@ss456"
}
```

**Response:**
```json
{ "success": true, "message": "Password updated successfully" }
```

---

## Summary

| # | Section | API Endpoint | Method | Cache |
|---|---------|-------------|--------|-------|
| 1 | Email Login | `/api/auth/login` | POST | No |
| 2 | Register | `/api/auth/register` | POST | No |
| 3 | Google OAuth | `/api/auth/google` | GET | No |
| 4a | Send OTP | `/api/auth/otp/send` | POST | No |
| 4b | Verify OTP | `/api/auth/otp/verify` | POST | No |
| 5a | Forgot Password | `/api/auth/forgot-password` | POST | No |
| 5b | Reset Password | `/api/auth/reset-password` | POST | No |

**Total API calls on page load: 0 (all user-triggered)**

---

## Frontend Integration Pattern

```typescript
// In Next.js page (client component)
'use client';
export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    const result = await authApi.login({ email, password, rememberMe });
    setAuthTokens(result.accessToken, result.refreshToken);
    router.push(searchParams.redirect || '/');
  };

  const handleRegister = async (data: RegisterData) => {
    const result = await authApi.register(data);
    setAuthTokens(result.accessToken, result.refreshToken);
    router.push('/');
  };

  const handleGoogleAuth = () => {
    window.location.href = '/api/auth/google';
  };

  const handleOtpLogin = async (phone: string) => {
    await authApi.sendOtp({ phone });
    setShowOtpInput(true);
  };

  return (
    <AuthCard>
      <TabSelector active={tab} onChange={setTab} />
      {tab === 'login' ? (
        <LoginForm onSubmit={handleLogin} onGoogleAuth={handleGoogleAuth} onOtpLogin={handleOtpLogin} />
      ) : (
        <RegisterForm onSubmit={handleRegister} onGoogleAuth={handleGoogleAuth} />
      )}
    </AuthCard>
  );
}
```

---

## Token Refresh

**API:** `POST /api/auth/refresh`

**Request:**
```json
{ "refreshToken": "dGhpcyBpcyBhIHJlZnJl..." }
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIs...(new)",
  "expiresIn": 3600
}
```

## Logout

**API:** `POST /api/auth/logout`

**Request:**
```json
{ "refreshToken": "dGhpcyBpcyBhIHJlZnJl..." }
```

**Response:** `204 No Content`
