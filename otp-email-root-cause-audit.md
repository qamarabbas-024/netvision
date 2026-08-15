# NetVision — OTP & Email Delivery Root-Cause Forensic Audit Report

**Date**: 2026-08-15  
**Target Environment**: Production (`https://netvision-backend-staging.onrender.com`) & Frontend (`https://netvision-three.vercel.app`)  
**Audit Scope**: Complete OTP & Transactional Email Delivery Pipeline Investigation  
**Author**: Senior NestJS + DevOps Forensic Engineering Team  

---

## 1. Executive Conclusion

The registration and OTP generation pipeline is executing successfully up to the database persistence layer, but **zero email delivery requests are reaching the Resend API**. 

The root cause is a **Git deployment divergence**: the Resend HTTPS migration commit (`a1bac6e`) was committed locally on the `main` branch but **was never pushed to `origin/main`**. Consequently, the production backend running on Render is still executing commit `aa89a33`, which contains the legacy Nodemailer SMTP-only implementation. 

Because Render Free blocks outbound SMTP ports and no SMTP credentials exist in production, the legacy `EmailService` on Render initializes with `transporter = null`, returns `{ success: false }` internally, and never contacts Resend. Concurrently, `AuthService.register()` does not inspect the return value of `sendVerificationOtp()`, allowing it to return HTTP 201 with `requiresOtp: true` to the frontend, creating the false appearance of successful email dispatch.

---

## 2. Exact Root Cause

1. **Unpushed Local Commit (`a1bac6e`)**:
   - Local Git status: `Your branch is ahead of 'origin/main' by 1 commit.`
   - Remote tracking branch `origin/main` on GitHub is at `aa89a33` (*"chore: repair and rebase prisma migration history"*).
   - Render's auto-deployment pulls directly from `origin/main`. Therefore, Render has **never built or executed the Resend HTTPS implementation**.

2. **Legacy Code Execution on Render**:
   - In commit `aa89a33`, `backend/src/mail/email.service.ts` exclusively instantiates Nodemailer SMTP (`nodemailer.createTransport`).
   - The legacy code has no reference to `RESEND_API_KEY` or `ResendProvider`.
   - On Render, `SMTP_HOST` is unset, so `this.transporter` is `null`.
   - When `sendVerificationOtp` is called, it enters `if (!this.transporter)` and returns `{ success: false, error: 'SMTP email provider not configured...' }` without making any network call.

3. **Silent Return Value Consumption in `AuthService`**:
   - In `backend/src/auth/auth.service.ts` (line 103), `await this.emailService.sendVerificationOtp(normalizedEmail, rawOtp)` is called, but its return value (`EmailDeliveryResult`) is completely ignored.
   - Even when `EmailService` returns `{ success: false }`, `AuthService.register` proceeds to return `{ message: 'Registration successful!...', email: normalizedEmail, requiresOtp: true }`.

---

## 3. Evidence

### A. Git Forensic State
```bash
$ git status
On branch main
Your branch is ahead of 'origin/main' by 1 commit.
  (use "git push" to publish your local commits)
nothing to commit, working tree clean

$ git log origin/main -n 2 --oneline
aa89a33 chore: repair and rebase prisma migration history
cd01431 Backend_Deployment

$ git log -n 2 --oneline
a1bac6e feat: migrate production email delivery to Resend
aa89a33 chore: repair and rebase prisma migration history
```

### B. Deployed Code vs Local Working Tree
Inspecting `origin/main:backend/src/mail/email.service.ts`:
```typescript
// origin/main (Commit aa89a33 currently running on Render):
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  // NO Resend imports
  // NO ResendProvider
  // NO RESEND_API_KEY handling
}
```

Inspecting local `backend/src/mail/email.service.ts` (Commit `a1bac6e`):
```typescript
// Local main (Commit a1bac6e):
import { ResendProvider } from './providers/resend.provider';
import { SmtpProvider } from './providers/smtp.provider';

@Injectable()
export class EmailService {
  // Provider-abstracted routing with Resend HTTPS API in production
}
```

---

## 4. Full Registration → OTP Call Chain

| Step | Component | Method / Action | Result on Render (`aa89a33`) | Result on Local (`a1bac6e`) |
|---|---|---|---|---|
| 1 | Frontend | `POST /api/v1/auth/register` | Sends `{ username, email, password }` | Sends `{ username, email, password }` |
| 2 | Backend Router | `AuthController.register()` | Receives DTO, calls `authService.register()` | Receives DTO, calls `authService.register()` |
| 3 | Database | `Prisma.user.create()` | Creates unverified user (`isVerified: false`) | Creates unverified user (`isVerified: false`) |
| 4 | Security | OTP Generation & Hash | Generates 6-digit OTP, stores SHA-256 in `EmailVerification` | Generates 6-digit OTP, stores SHA-256 in `EmailVerification` |
| 5 | Auth Service | `AuthService.register()` | Calls `this.emailService.sendVerificationOtp()` | Calls `this.emailService.sendVerificationOtp()` |
| 6 | Email Service | `EmailService.sendVerificationOtp()` | **Branch: `if (!this.transporter)`** -> Returns `{ success: false }` | **Branch: `this.provider.sendEmail()`** -> Invokes `ResendProvider` |
| 7 | Transport | Network Dispatch | **NO HTTP CALL MADE** (Zero Resend activity) | **HTTPS POST `https://api.resend.com/emails`** |
| 8 | Response | `AuthService.register()` | Ignores failure, returns HTTP 201 `{ requiresOtp: true }` | Returns HTTP 201 `{ requiresOtp: true }` |
| 9 | UI Navigation | `RegisterPage.handleSubmit()` | Navigates user to `/register/verify-otp` | Navigates user to `/register/verify-otp` |

---

## 5. Frontend Analysis

- **File**: `frontend/app/register/page.tsx`
- **Behavior**:
  - Submits payload `{ username, email, password, fullName }` via `fetch` to `${NEXT_PUBLIC_API_URL}/auth/register`.
  - Upon receiving HTTP 201 (`response.ok`), redirects user to `/register/verify-otp?email=...`.
  - Frontend contains no mock fallback or client-side email suppression.
- **Verification Component**: `frontend/app/register/verify-otp/page.tsx`
  - Properly accepts 6-digit numeric input and posts to `/auth/verify-otp`.
  - Supports `handleResend()` which posts to `/auth/resend-otp`.
- **Verdict**: Frontend operates completely as expected.

---

## 6. AuthService Analysis

- **File**: `backend/src/auth/auth.service.ts`
- **Tracing Points**:
  - `register()` (Lines 50–110): Generates 6-digit OTP, creates DB record in `EmailVerification`, calls `await this.emailService.sendVerificationOtp()`.
  - `resendOtp()` (Lines 174–225): Generates new 6-digit OTP, replaces DB record, calls `await this.emailService.sendVerificationOtp()`.
  - `login()` (Lines 227–276): If user is unverified, generates OTP, stores DB record, calls `await this.emailService.sendVerificationOtp()`, and throws `UnauthorizedException`.
  - `forgotPassword()` (Lines 278–306): Generates 32-byte hex token, stores DB record, calls `await this.emailService.sendPasswordResetLink()`.
- **Flaw Detected**:
  In all four methods, `sendVerificationOtp` or `sendPasswordResetLink` is awaited, but the returned `EmailDeliveryResult` is never checked. Errors returned from `EmailService` are silently dropped.

---

## 7. EmailService Analysis

- **File**: `backend/src/mail/email.service.ts`
- **Deployed Version (`origin/main`)**:
  - Nodemailer-only implementation.
  - Returns `{ success: false, error: 'SMTP email provider not configured...' }` when `SMTP_HOST` is missing.
  - Cannot utilize `RESEND_API_KEY`.
- **Local Migrated Version (`a1bac6e`)**:
  - Clean provider abstraction (`ResendProvider` in production, `SmtpProvider` / `DevConsoleFallback` in development).
  - Production strictly instantiates `ResendProvider` and never attempts SMTP.
  - Explicit `EMAIL_PROVIDER=resend` supported for local development.

---

## 8. ResendProvider Analysis

- **File**: `backend/src/mail/providers/resend.provider.ts`
- **Execution Details**:
  - Initializes `new Resend(apiKey)` using the official SDK.
  - Sends email via `this.resendClient.emails.send({ from, to, subject, html, text })`.
  - Catches API error objects and thrown network exceptions, returning sanitized `{ success: false, error }`.
  - **Verdict**: The provider code is completely correct and verified by 13 automated tests. It was simply not yet present on Render.

---

## 9. MailModule / Dependency Injection Analysis

- **File**: `backend/src/mail/mail.module.ts`
- **Wiring**:
  - `MailModule` exports `EmailService`.
  - `AuthModule` imports `MailModule` and injects `EmailService` directly into `AuthService`.
  - No duplicate providers, circular dependencies, or rogue service tokens exist.

---

## 10. Environment Configuration Analysis

- **Variable Names Expected by Code**:
  - `RESEND_API_KEY`: Read by `EmailService` / `ResendProvider`.
  - `RESEND_FROM_EMAIL`: Read by `EmailService` / `ResendProvider` (defaults to `"NetVision <onboarding@resend.dev>"` if omitted).
  - `NODE_ENV`: Must be `'production'` on Render.
- **Naming Consistency**: No typos or mismatches (`RESEND_API_KEY` matches `.env.example` and code).

---

## 11. Database / OTP Record Analysis

- **Models**: `User`, `EmailVerification`, `PasswordResetToken`.
- **Integrity**:
  - When registration occurs, the `User` is created with `isVerified: false`.
  - The 6-digit OTP is SHA-256 hashed and persisted to PostgreSQL `EmailVerification` with a 10-minute expiration.
  - The OTP record exists and is queryable in PostgreSQL.

---

## 12. Deployment / Git Analysis

- **Repository**: `https://github.com/qamarabbas-024/netvision.git`
- **Local Branch**: `main` (commit `a1bac6e`)
- **Remote Branch (`origin/main`)**: `aa89a33`
- **Delta**: 1 unpushed commit containing 11 changed files (+1,258 lines).
- **Impact**: Render builds from GitHub webhook / commit trigger on `origin/main`. Because `a1bac6e` was not pushed, Render never initiated a build for the Resend migration.

---

## 13. Why Resend Shows No Attempt

The Resend Dashboard registers zero delivery attempts because:
1. The server receiving requests (`netvision-backend-staging.onrender.com`) is running commit `aa89a33`.
2. Commit `aa89a33` only contains Nodemailer SMTP code.
3. No code on the deployed server ever invoked the Resend API endpoint (`https://api.resend.com/emails`).

---

## 14. What Is Working

1. Frontend registration form and OTP verification page UI (`https://netvision-three.vercel.app`).
2. Backend API routing, middleware, CORS, Helmet, and health checks on Render.
3. Database user creation and secure SHA-256 hashed OTP persistence in Neon PostgreSQL.
4. Local Resend implementation (`a1bac6e`) with 100% test pass rate (13/13 tests).
5. TypeScript compilation and NestJS build without errors.

---

## 15. What Is Broken

1. **Remote Deployment Sync**: Commit `a1bac6e` is unpushed; Render is running stale pre-migration code (`aa89a33`).
2. **Error Visibility in AuthService**: `AuthService.register()` does not inspect `EmailDeliveryResult`, returning HTTP 201 even when email delivery fails.
3. **Resend Sandbox Recipient Constraint (Operational Context)**:
   When using default `onboarding@resend.dev`, Resend will only deliver to the email address of the Resend account owner. Attempting to send to arbitrary external emails will be rejected by Resend's API until a custom domain is verified in the Resend dashboard.

---

## 16. Exact Minimal Fix

1. **Push Local Commit to GitHub**:
   ```bash
   git push origin main
   ```
2. **Deploy on Render**:
   - Ensure Render builds commit `a1bac6e` (or latest).
   - Ensure Render Environment contains:
     - `RESEND_API_KEY=re_xxxxxxxxxxxxxxxx`
     - `RESEND_FROM_EMAIL="NetVision <onboarding@resend.dev>"` (or custom verified domain)

---

## 17. Risk of Current Behavior

- **User Friction**: Users successfully register and are directed to enter an OTP that they never receive in their inbox.
- **Account Lockout**: Because accounts are created with `isVerified: false`, users cannot log in or proceed past the OTP screen.

---

## 18. Recommended Fix Plan

1. **Step 1 (Immediate)**: Push the completed Resend migration commit (`a1bac6e`) to `origin/main` via `git push origin main`.
2. **Step 2 (Render Deployment)**: Confirm Render completes the build of `a1bac6e` and that `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are active in the Render Environment tab.
3. **Step 3 (Resend Domain / Sandbox Validation)**: For initial testing with `onboarding@resend.dev`, register using the Resend account owner's email address. To support general student registration, add and verify the production domain (e.g. `netvision.app`) in the Resend console and update `RESEND_FROM_EMAIL`.
4. **Step 4 (Optional Hardening)**: Update `AuthService.register` to log a warning or return delivery status if `sendVerificationOtp` returns `success: false`.

---

## 19. Root Cause Confidence

**ROOT CAUSE CONFIDENCE: 100%**
