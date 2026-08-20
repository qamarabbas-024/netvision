# NetVision — Resend HTTPS Email API Migration & NestJS DI Report

**Target Environment**: Production (Render Free Tier) & Development
**Migration Scope**: Production Outbound Email Delivery via Resend HTTPS REST API & NestJS Dependency Injection Architecture
**Documentation Version**: 2.0.0

---

## 1. Executive Summary & DI Root Cause

### Root Cause of NestJS Startup Crash:
When `EmailService` was refactored to accept `providerOverride?: EmailProvider` in its constructor without an explicit injection token, TypeScript's `emitDecoratorMetadata` emitted parameter metadata as `[ConfigService, Object]` because the `EmailProvider` interface is erased at runtime. NestJS attempted to resolve a provider for the generic `Object` class token at index 1 and crashed during application startup:
```text
Nest can't resolve dependencies of the EmailService (ConfigService, ?).
Please make sure that the argument Object at index [1] is available in the MailModule context.
```

### Dependency Injection Resolution:
1. Created an explicit injection token: `export const EMAIL_PROVIDER = Symbol('EMAIL_PROVIDER');`.
2. Created a dedicated provider factory (`emailProviderFactory`) registered in `MailModule` that resolves `EMAIL_PROVIDER` based on `ConfigService` (`NODE_ENV`, `EMAIL_PROVIDER`, `SMTP_*`).
3. Created `DevConsoleProvider` implementing `EmailProvider` to cleanly handle development console fallback.
4. Injected `@Inject(EMAIL_PROVIDER) private readonly provider: EmailProvider` in `EmailService`.

---

## 2. Architecture & Dependency Injection Wiring

```
                        ┌─────────────────────────────────────────┐
                        │              ConfigService              │
                        │ (reads NODE_ENV, RESEND_*, SMTP_*, etc) │
                        └────────────────────┬────────────────────┘
                                             │
                                             ▼
                        ┌─────────────────────────────────────────┐
                        │          emailProviderFactory           │
                        │        (provides: EMAIL_PROVIDER)       │
                        └────────────────────┬────────────────────┘
                                             │
               ┌─────────────────────────────┼─────────────────────────────┐
               │                             │                             │
    [NODE_ENV === 'production']   [EMAIL_PROVIDER === 'resend']   [SMTP configured]
               │                             │                             │
               ▼                             ▼                             ▼
        ResendProvider                ResendProvider                 SmtpProvider
   (HTTPS API: `resend` SDK)     (HTTPS API: `resend` SDK)           (Nodemailer)
               │                             │                             │
               └─────────────────────────────┼─────────────────────────────┘
                                             │ [otherwise: DevConsoleProvider]
                                             ▼
                                ┌─────────────────────────┐
                                │ @Inject(EMAIL_PROVIDER) │
                                │      EmailService       │
                                └─────────────────────────┘
```

### Components:
- **`EMAIL_PROVIDER` Token (`src/mail/interfaces/email-provider.interface.ts`)**: `Symbol('EMAIL_PROVIDER')` used for type-safe NestJS DI resolution.
- **`emailProviderFactory` (`src/mail/mail.module.ts`)**: Factory provider that instantiates the appropriate concrete `EmailProvider` based on environment variables.
- **`ResendProvider` (`src/mail/providers/resend.provider.ts`)**: Dispatches email over HTTPS using the official `resend` Node.js SDK. Catches and sanitizes API/network errors without uncaught throws.
- **`SmtpProvider` (`src/mail/providers/smtp.provider.ts`)**: Encapsulates standard SMTP delivery using `nodemailer`.
- **`DevConsoleProvider` (`src/mail/providers/dev-console.provider.ts`)**: Implements `EmailProvider` for safe development console logging when no transport is configured.
- **`EmailService` (`src/mail/email.service.ts`)**: Provider-agnostic service receiving `@Inject(EMAIL_PROVIDER)` and orchestrating transactional email templates (6-digit OTP with 10-minute expiry, password reset with 15-minute expiry, diagnostic tests).

---

## 3. Provider Selection Behavior

The `emailProviderFactory` evaluates environment configuration in order of precedence:

1. **Production Mode (`NODE_ENV === 'production'`)**:
   - Strictly instantiates `ResendProvider`.
   - Never initializes or attempts Nodemailer/SMTP connections.
   - Requires `RESEND_API_KEY`. Defaults sender to `"NetVision <onboarding@resend.dev>"` unless overridden by `RESEND_FROM_EMAIL`.

2. **Development / Test Mode (`NODE_ENV !== 'production'`)**:
   - **Explicit Resend Override**: If `EMAIL_PROVIDER=resend`, instantiates `ResendProvider` for intentional manual local testing.
   - **SMTP Mode**: If `EMAIL_PROVIDER=smtp` OR (`SMTP_HOST && SMTP_USER && SMTP_PASS` are provided), instantiates `SmtpProvider`.
   - **Default Safe Fallback**: If neither is configured, instantiates `DevConsoleProvider`.
   - **Safety Guarantee**: Does **NOT** automatically send real emails via Resend merely because `RESEND_API_KEY` is present in local `.env`.

---

## 4. Files Changed

| File | Status | Description |
|---|---|---|
| `backend/package.json` | Modified | Added `resend` (v6.19.0) and `test:email:suite` npm script |
| `backend/.env.example` | Modified | Added `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and documented `EMAIL_PROVIDER` |
| `backend/src/mail/interfaces/email-provider.interface.ts` | Modified | Defined `EmailProvider`, `EmailDeliveryResult`, `SendEmailOptions`, `EmailProviderStatus`, and `EMAIL_PROVIDER` token |
| `backend/src/mail/providers/dev-console.provider.ts` | **Created** | Concrete fallback provider implementing `EmailProvider` for unconfigured development |
| `backend/src/mail/providers/resend.provider.ts` | **Created** | Resend HTTPS REST API provider implementation using official SDK |
| `backend/src/mail/providers/smtp.provider.ts` | **Created** | Nodemailer SMTP provider implementation for local / self-hosted environments |
| `backend/src/mail/mail.module.ts` | Modified | Implemented `emailProviderFactory` registering `EMAIL_PROVIDER` with NestJS DI |
| `backend/src/mail/email.service.ts` | Modified | Updated to inject `@Inject(EMAIL_PROVIDER) private readonly provider: EmailProvider` |
| `backend/src/auth/auth.service.ts` | Modified | Aligned dev store checks with `emailService.isConfigured()` |
| `backend/scripts/test-email.ts` | Modified | Updated CLI verification tool with full provider diagnostic messaging |
| `backend/scripts/test-email-suite.ts` | **Created** | Comprehensive 14-test suite covering Nest DI resolution, factory matrix, and mocked SDK |
| `pnpm-lock.yaml` | Modified | Updated lockfile with `resend` dependency graph |

---

## 5. Verification Results

### A. Automated Email & Nest DI Test Suite
Command: `pnpm --filter netvision-backend test:email:suite`

```text
================================================================
🧪 NETVISION RESEND HTTPS EMAIL API MIGRATION & NEST DI TEST SUITE
================================================================

[TEST 1] NestJS Dependency Injection Resolution & Factory Verification
  ✓ Passed: NestJS DI container resolves EmailService and EMAIL_PROVIDER token without Object/unknown errors

[TEST 2] EmailProviderFactory Decision Matrix (Production, SMTP, Dev Fallback, Explicit)
  ✓ Passed: EmailProviderFactory accurately selects the correct provider across all environment configurations

[TEST 3] ResendProvider Initialization with API Key & Custom Sender
  ✓ Passed: ResendProvider initializes correctly with key and sender

[TEST 4] Missing RESEND_API_KEY Handling & Safe Failure
  ✓ Passed: Missing API key fails safely with clear diagnostics

[TEST 5] Missing RESEND_FROM_EMAIL Safe Fallback & Custom Override
  ✓ Passed: Sender configuration safely falls back to default and supports custom domains

[TEST 6] Successful Resend Email Dispatch (Mocked SDK)
  ✓ Passed: Email dispatched successfully via Resend with correct payload

[TEST 7] Resend API Error & Exception Handling
  ✓ Passed: Resend API errors and network exceptions handled safely

[TEST 8] Production Mode Exclusively Uses Resend & Blocks SMTP
  ✓ Passed: Production strictly enforces Resend HTTPS API and ignores SMTP

[TEST 9] Development Mode Uses SMTP When Configured
  ✓ Passed: Development mode utilizes SMTP transport when configured

[TEST 10] Development Mode Falls Back Safely to DevConsoleProvider When SMTP is Absent
  ✓ Passed: Development mode safely falls back to console provider without sending real emails

[TEST 11] Safe Provider Status Reporting via getProviderStatus()
  ✓ Passed: getProviderStatus() returns accurate, safe diagnostic metadata across all modes

[TEST 12] Security & Sanitization: No Secrets in Logs, Errors, or Diagnostics
  ✓ Passed: Zero secrets, OTP codes, reset tokens, or credentials leak in diagnostics

[TEST 13] Email Template Content & Contract Integrity (OTP & Password Reset)
  ✓ Passed: Email templates and response contracts completely preserved

[TEST 14] Full Nest Application Bootstrap & MailModule DI Context
  ✓ Passed: Nest Application bootstraps cleanly without dependency injection errors

================================================================
🎉 ALL 14 EMAIL MIGRATION, NEST DI & BOOTSTRAP TESTS PASSED!
================================================================
```

### B. TypeScript Compilation
Command: `pnpm --filter netvision-backend typecheck`
- **Result**: `Exit code 0` (0 errors)

### C. NestJS Production Build
Command: `pnpm --filter netvision-backend build`
- **Result**: `Exit code 0` (Clean compilation to `backend/dist/`)

### D. Identity & Security Regression Suites
- `scripts/test-phase2-identity.ts`: 5/5 assertions passed
- `scripts/test-deployment-readiness.ts`: 12/12 assertions passed

### E. Git Syntax & Formatting Check
Command: `git diff --check`
- **Result**: `Exit code 0` (No whitespace or syntax errors)

---

## 6. Manual Render Configuration Steps

To configure production email delivery in Render:

1. Open the [Render Dashboard](https://dashboard.render.com).
2. Select the **NetVision Backend** web service.
3. Click on the **Environment** tab.
4. Add the following environment variables:
   - `RESEND_API_KEY`: `re_xxxxxxxxxxxxxxxxxxxxxxxx` (Your production Resend API Key)
   - `RESEND_FROM_EMAIL`: `"NetVision" <onboarding@resend.dev>` (or your verified domain sender e.g. `"NetVision" <no-reply@netvision.app>`)
5. Save changes (Render will redeploy).
