# NetVision — Resend HTTPS Email API Migration Report

**Target Environment**: Production (Render Free Tier) & Development  
**Migration Scope**: Production Outbound Email Delivery via Resend HTTPS REST API SDK  
**Documentation Version**: 1.0.0

---

## 1. Architecture

NetVision uses an abstracted, pluggable email architecture allowing clean provider delegation based on execution mode.

```
                      ┌─────────────────────────────────┐
                      │          AuthService            │
                      │ (register, resendOtp, forgotPw) │
                      └────────────────┬────────────────┘
                                       │
                                       ▼
                      ┌─────────────────────────────────┐
                      │          EmailService           │
                      │ (templates, contracts, routing) │
                      └────────────────┬────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                │                                             │
     [NODE_ENV === 'production']                 [NODE_ENV !== 'production']
                │                                             │
                ▼                                             ├─► EMAIL_PROVIDER=resend ──► ResendProvider
         ResendProvider                                       │                            (HTTPS API)
  (HTTPS REST API: `resend` SDK)                              ├─► SMTP configured?     ──► SmtpProvider
                                                              │                            (Nodemailer)
                                                              └─► Default / Unconf     ──► DevConsoleFallback
```

### Components:
- **`EmailProvider` Interface (`src/mail/interfaces/email-provider.interface.ts`)**: Exposes `name`, `isConfigured()`, `getMissingVariables()`, `sendEmail(options)`.
- **`ResendProvider` (`src/mail/providers/resend.provider.ts`)**: Dispatches email over HTTPS using the official `resend` Node.js SDK (`import { Resend } from 'resend'`). Handles network errors and API errors safely without throwing uncaught exceptions.
- **`SmtpProvider` (`src/mail/providers/smtp.provider.ts`)**: Encapsulates standard SMTP delivery using `nodemailer`.
- **`EmailService` (`src/mail/email.service.ts`)**: Provides business-layer transactional templates (6-digit OTP with 10-minute expiry, password reset with 15-minute expiry, diagnostic test) and routes to the appropriate provider.

---

## 2. Provider Selection Logic

Provider resolution is isolated in `EmailService.initProvider()`:

1. **Production Mode (`NODE_ENV === 'production'`)**:
   - Strictly delegates to `ResendProvider`.
   - Never initializes or attempts Nodemailer/SMTP connections.
   - Requires `RESEND_API_KEY`. Reads `RESEND_FROM_EMAIL` (defaulting to `"NetVision <onboarding@resend.dev>"`).

2. **Development / Test Mode (`NODE_ENV !== 'production'`)**:
   - If `EMAIL_PROVIDER=resend` is explicitly configured:
     - Delegates to `ResendProvider` for intentional manual local testing.
   - If `EMAIL_PROVIDER=smtp` OR (no `EMAIL_PROVIDER` specified AND `SMTP_HOST && SMTP_USER && SMTP_PASS` are provided):
     - Delegates to `SmtpProvider`.
   - Default / Otherwise:
     - Falls back to `DevConsoleFallback` (`this.provider = null`).
     - **Safety Guarantee**: Does **NOT** automatically send real emails via Resend merely because `RESEND_API_KEY` is present in local `.env`.

---

## 3. Production Behavior

- Render Free aggressively blocks outbound TCP traffic on ports 25, 465, and 587.
- NetVision production exclusively dispatches all outbound transactional emails (registration OTP, resend OTP, unverified login OTP, password reset) via HTTPS POST to `https://api.resend.com/emails`.
- If `RESEND_API_KEY` is missing in production, calls safely return `{ success: false, error: 'Email provider not configured. RESEND_API_KEY is required in production.' }` without crashing or attempting SMTP.
- Secret sanitization: API keys, raw OTP codes, password reset tokens, and Authorization headers are never logged.

---

## 4. Development Behavior

- By default, development does not send live emails unless explicitly configured.
- When unconfigured, OTPs and reset URLs are routed to local console logs for seamless development and testing.
- If SMTP credentials are provided (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`), local emails are delivered through the configured SMTP server (e.g. Mailtrap).
- If manual local verification with Resend is required, developers set `EMAIL_PROVIDER=resend` in `backend/.env`.

---

## 5. Environment Variables

### Template (`backend/.env.example`):
```env
# ==============================================================================
# EMAIL DELIVERY CONFIGURATION
# ==============================================================================
# Resend HTTPS Email API (Required in Production on Render Free)
RESEND_API_KEY=
RESEND_FROM_EMAIL="NetVision <onboarding@resend.dev>"

# Provider selection override (Optional for local testing: 'resend' or 'smtp')
# Default behavior in development: uses SMTP if configured, otherwise DevConsoleFallback.
# Set EMAIL_PROVIDER=resend to explicitly test Resend locally.
EMAIL_PROVIDER=

# SMTP Server Configuration (Optional for local development / self-hosted environments)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="NetVision Platform" <no-reply@netvision.edu>
SMTP_REJECT_UNAUTHORIZED=true
```

---

## 6. Files Changed

| File | Status | Description |
|---|---|---|
| `backend/package.json` | Modified | Added `resend` (v6.19.0) and `test:email:suite` npm script |
| `backend/.env.example` | Modified | Added `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and documented `EMAIL_PROVIDER` |
| `backend/src/mail/interfaces/email-provider.interface.ts` | Created | Defined `EmailProvider`, `EmailDeliveryResult`, `SendEmailOptions`, and `EmailProviderStatus` |
| `backend/src/mail/providers/resend.provider.ts` | Created | Resend HTTPS REST API provider implementation using official SDK |
| `backend/src/mail/providers/smtp.provider.ts` | Created | Nodemailer SMTP provider implementation for local / self-hosted environments |
| `backend/src/mail/email.service.ts` | Modified | Provider selection routing, safe `getProviderStatus()`, and transactional templates |
| `backend/src/auth/auth.service.ts` | Modified | Integrated `sendVerificationOtp` with provider check and dev store alignment |
| `backend/scripts/test-email.ts` | Modified | CLI verification utility updated with full provider diagnostic messaging |
| `backend/scripts/test-email-suite.ts` | Created | 13-test automated suite covering all 12 test requirements with mocked SDK |
| `pnpm-lock.yaml` | Modified | Updated lockfile with `resend` dependency graph |

---

## 7. Tests

Automated test suite (`backend/scripts/test-email-suite.ts`):
Command: `pnpm --filter netvision-backend test:email:suite`

All 13 test cases passed with zero network requests (Resend SDK mocked):
1. **ResendProvider initialization**: Initializes with API key and custom sender.
2. **Missing RESEND_API_KEY**: Safely reports missing variable and fails gracefully.
3. **Missing RESEND_FROM_EMAIL**: Safely defaults to `"NetVision <onboarding@resend.dev>"` and supports custom sender overrides.
4. **Successful Resend send (Mocked SDK)**: Validates full payload mapping (to, from, subject, html, text) and messageId return.
5. **Resend API error handling**: Validates API error objects and network exceptions without uncaught throws.
6. **Production mode blocks SMTP**: Ensures production strictly uses Resend HTTPS API and never attempts SMTP.
7. **Development mode uses SMTP when configured**: Validates Nodemailer transport activation in dev.
8. **Development mode fallback**: Safely routes to `DevConsoleFallback` when SMTP is unconfigured.
9. **Development does NOT automatically use Resend**: Verifies presence of `RESEND_API_KEY` in dev does NOT send emails without `EMAIL_PROVIDER=resend`.
10. **EMAIL_PROVIDER=resend explicit opt-in**: Verifies explicit override selects Resend for local testing.
11. **Safe provider status reporting (`getProviderStatus`)**: Verifies safe output across all modes without secret leakage.
12. **No secrets in logs/errors**: Verifies API keys, passwords, OTPs, and reset tokens never appear in diagnostics or error messages.
13. **Template Content & Contract Integrity**: Verifies OTP (6 digits, 10 min expiry) and reset token (15 min expiry) HTML/text contracts and NetVision branding.

---

## 8. Typecheck

Command: `pnpm --filter netvision-backend typecheck`
- **Output**: `$ tsc --noEmit`
- **Result**: `Exit code 0` (0 errors)

---

## 9. Build

Command: `pnpm --filter netvision-backend build`
- **Output**: `$ nest build`
- **Result**: `Exit code 0` (Clean compilation to `backend/dist/`)

---

## 10. Regression Results

All existing authentication, identity, and deployment readiness test suites passed:
- `scripts/test-phase2-identity.ts`: 5/5 assertions passed (Optional JWT, Anonymous ID resolution, user precedence).
- `scripts/test-deployment-readiness.ts`: 12/12 assertions passed (Production config validation, database health, migration scripts, sandbox isolation).
- `scripts/test-email-suite.ts`: 13/13 assertions passed.

---

## 11. git diff --check

Command: `git diff --check`
- **Result**: `Exit code 0` (No whitespace errors, merge markers, or formatting issues)

---

## 12. Manual Render Configuration Steps

To configure production email delivery in Render:

1. Open the [Render Dashboard](https://dashboard.render.com).
2. Select the **NetVision Backend** web service.
3. Click on the **Environment** tab.
4. Add the following environment variables:
   - `RESEND_API_KEY`: `re_xxxxxxxxxxxxxxxxxxxxxxxx` (Your production Resend API Key)
   - `RESEND_FROM_EMAIL`: `"NetVision" <onboarding@resend.dev>` (or your verified domain sender e.g. `"NetVision" <no-reply@netvision.app>`)
5. Save changes (Render will trigger a redeploy).
6. **Manual Smoke Test Flow**:
   - Trigger a user registration or password reset on the production deployment.
   - Verify the HTTPS API call reaches Resend in the [Resend Logs](https://resend.com/emails).
   - Check the destination email inbox for the branded NetVision verification email.
