# NetVision — Public Beta: Email OTP Verification Disabled

**Scope**: Temporary Public Beta Authentication Flow & Feature Flag Configuration
**Status**: Implemented & Verified
**Documentation Version**: 1.0.0

---

## 1. Context & Motivation

For the current NetVision public beta launch, email OTP verification is intentionally postponed to ensure frictionless onboarding for all computer science and IT learners worldwide. 

### Core Product Objectives:
- **Zero-Friction Registration**: Learners can register and immediately access labs, curriculum, and interactive sandboxes without waiting for email delivery or entering OTP codes.
- **Immediate Login**: Users can log in directly with credentials without being blocked by email verification state.
- **Architectural Preservation**: The complete email delivery architecture (`EmailService`, `ResendProvider`, `SmtpProvider`, email templates, `EmailVerification` model, and API endpoints) remains 100% intact for immediate re-enablement in subsequent releases.

---

## 2. Centralized Feature Flag Configuration

Email verification is controlled by a single centralized configuration flag:

```env
# Feature Flag: Email Verification / OTP Requirement
# Set to 'false' during public beta (accounts are immediately usable without OTP).
# Set to 'true' to require 6-digit email OTP verification on registration and unverified login.
EMAIL_VERIFICATION_ENABLED=false
```

### Resolution Logic (`backend/src/auth/auth.service.ts`):
```typescript
private isEmailVerificationEnabled(): boolean {
  return this.configService.get<string>('EMAIL_VERIFICATION_ENABLED', 'false') === 'true';
}
```
- **Default Value**: `false` (Public Beta mode active by default).
- **Environment Parity**: Local development, staging, and production environments can toggle between beta mode and full OTP verification by setting `EMAIL_VERIFICATION_ENABLED=true` without code modifications.

---

## 3. Authentication Behavior in Public Beta Mode

### A. Registration Flow (`POST /api/v1/auth/register`)
- **Database Insertion**: User record is created with `isVerified: true` immediately.
- **No OTP Generation**: No record is created in the `EmailVerification` table.
- **No Email Dispatch**: Neither Resend nor SMTP is invoked.
- **JWT Issuance**: Access tokens are generated and returned in the registration payload.
- **Response Contract**:
  ```json
  {
    "message": "Registration successful! Welcome to NetVision.",
    "email": "learner@netvision.app",
    "requiresOtp": false,
    "user": {
      "id": "usr_cly...",
      "email": "learner@netvision.app",
      "username": "netlearner",
      "role": "STUDENT",
      "isVerified": true
    },
    "accessToken": "eyJhbGciOi..."
  }
  ```

### B. Login Flow (`POST /api/v1/auth/login`)
- **Direct Authentication**: Validates Argon2 password hash.
- **No Verification Gate**: Does not require `isVerified === true` before issuing tokens.
- **Legacy User Auto-Healing**: If a user registered prior to beta mode with `isVerified: false`, their account is automatically marked `isVerified: true` upon successful password login.
- **No Unverified Login OTP**: No OTP codes or unverified notifications are dispatched.

### C. Password Reset Flow (`POST /api/v1/auth/forgot-password`)
- **Transparent Diagnostics**: If email delivery transport is unconfigured or inactive, the endpoint explicitly returns HTTP 400 (`BadRequestException: Password reset via email is currently unavailable during public beta. Please contact support.`) rather than silently pretending an email was dispatched.
- **Zero Security Degradation**: Password hashing (Argon2id), reset token expiration (15 minutes), and token hashing (SHA-256) remain fully enforced.

### D. Frontend UX (`frontend/app/register/page.tsx`)
- Upon successful registration, the client inspects `data.requiresOtp`:
  - If `false` (beta mode): Automatically logs the user into `useAuthStore` and redirects to `/dashboard`.
  - If `true` (when verification is enabled): Redirects to `/register/verify-otp?email=...`.

---

## 4. What Remains Implemented (Zero Code Deletion)

The email subsystem and verification endpoints are preserved in their entirety:

1. **`EmailService` & Providers**:
   - `backend/src/mail/email.service.ts`
   - `backend/src/mail/providers/resend.provider.ts` (Resend HTTPS API)
   - `backend/src/mail/providers/smtp.provider.ts` (SMTP / Nodemailer)
   - `backend/src/mail/providers/dev-console.provider.ts` (Console fallback)
2. **NestJS DI Wiring**:
   - `EMAIL_PROVIDER` injection token and `emailProviderFactory` in `backend/src/mail/mail.module.ts`.
3. **Database Models**:
   - `EmailVerification` and `PasswordResetToken` Prisma models and migrations.
4. **Verification API Endpoints**:
   - `POST /api/v1/auth/verify-otp`: Fully functional for OTP verification.
   - `POST /api/v1/auth/resend-otp`: Gracefully informs callers that verification is disabled in beta mode (`"Email verification is currently disabled for public beta. You can log in directly."`).
5. **Branded Email Templates**:
   - 6-digit OTP verification template (10-minute expiry, NetVision cyan branding).
   - Password reset email template (15-minute expiry).

---

## 5. How to Re-Enable Email Verification Post-Beta

To re-enable mandatory email verification across environments:

1. **Production (Render Dashboard / Hosting Provider)**:
   - Set environment variable: `EMAIL_VERIFICATION_ENABLED=true`
   - Ensure `RESEND_API_KEY` is configured.
2. **Development / Local Environment (`backend/.env`)**:
   - Set `EMAIL_VERIFICATION_ENABLED=true`
   - Set `EMAIL_PROVIDER=resend` (or configure SMTP credentials).
3. **System Behavior When Re-Enabled**:
   - New registrations create users with `isVerified: false`.
   - 6-digit OTP codes are dispatched over Resend HTTPS API.
   - Frontend automatically detects `requiresOtp: true` and routes learners to the OTP verification screen.
   - Unverified login attempts are gated and trigger a fresh OTP code.

---

## 6. Verification & Test Results

### A. Dedicated Beta Auth Test Suite
Command: `pnpm --filter netvision-backend test:beta:auth`

```text
================================================================
🧪 NETVISION PUBLIC BETA — EMAIL OTP DISABLED TEST SUITE
================================================================

[TEST 1] Registration in Public Beta Mode (Immediate Verification & JWT Issuance)
  ✓ Passed: Registration completes immediately without OTP and returns JWT credentials

[TEST 2] Immediate Login of Newly Registered Beta User
  ✓ Passed: Beta user can log in immediately with password

[TEST 3] Existing Unverified User Logs In Without Being Blocked
  ✓ Passed: Existing unverified users are unblocked and authenticated cleanly

[TEST 4] Resend OTP Endpoint Informs User of Beta Mode
  ✓ Passed: Resend OTP informs callers that verification is disabled for public beta

[TEST 5] Password Reset Explicitly Reports Unavailable When Email Provider is Inactive
  ✓ Passed: Password reset explicitly reports unavailability rather than silently faking delivery

[TEST 6] Future Re-Enablement (EMAIL_VERIFICATION_ENABLED=true) Enforces Full OTP Flow
  ✓ Passed: Re-enabling feature flag seamlessly restores the complete OTP verification pipeline

================================================================
🎉 ALL 6 BETA AUTH & EMAIL CONFIGURATION TESTS PASSED!
================================================================
```

### B. Full Test Matrix Summary
- **Backend Typecheck** (`pnpm --filter netvision-backend typecheck`): `Exit code 0`
- **Backend Build** (`pnpm --filter netvision-backend build`): `Exit code 0`
- **Frontend Typecheck** (`pnpm --filter netvision-frontend typecheck`): `Exit code 0`
- **Frontend Build** (`pnpm --filter netvision-frontend build`): `Exit code 0` (30/30 pages compiled)
- **Resend Email Test Suite** (`pnpm --filter netvision-backend test:email:suite`): 14/14 tests passed
- **Phase 2 Identity Suite** (`scripts/test-phase2-identity.ts`): 5/5 assertions passed
- **Deployment Readiness Suite** (`scripts/test-deployment-readiness.ts`): 12/12 assertions passed
- **Git Check** (`git diff --check`): `Exit code 0` (No syntax or formatting errors)
