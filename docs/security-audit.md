# NetVision — Comprehensive Application Security Audit

**Document**: `docs/security-audit.md`  
**Classification**: Internal Security Assessment & Authorization Audit  
**Date**: August 2026  
**Auditor**: Senior Application Security Engineering  
**Scope**: Full Source Code, API Architecture, Authorization Matrices, and Sandbox Boundaries  

---

## 1. Executive Summary

NetVision underwent a comprehensive, 30-dimension security audit covering source code, cryptographic implementations, authentication mechanisms, authorization/IDOR boundaries, guest identity isolation, simulated sandbox execution, input validation, and deployment configurations.

The overall security posture of NetVision is **ROBUST** with strong defensive fundamentals:
- **Zero Raw Shell Invocations**: The simulated sandbox parses commands in pure TypeScript memory; no child processes, OS shells, or Docker daemon pipes are spawned.
- **Strict Authorization & IDOR Controls**: All user-owned entities (sandbox sessions, exam attempts, user progress, certificates, quiz attempts) enforce ownership checks.
- **Enterprise-Grade Cryptography**: Passwords use memory-hard **Argon2id** (`$argon2id$`), tokens are signed with HMAC-SHA256 (JWT), and reset tokens use SHA-256 digests.
- **Safe Public Beta Authentication**: Email OTP requirement is gracefully bypassed via `EMAIL_VERIFICATION_ENABLED=false` without faking email dispatches.
- **Defensive Production Headers**: Helmet provides strict CSP, HSTS, X-Content-Type-Options (`nosniff`), and frame isolation (`SAMEORIGIN`). CORS is restricted to `https://netvision-three.vercel.app`.

---

## 2. 30-Dimension Security Assessment

### 1. Source Code Security
- **Hardcoded Secrets**: Verified zero hardcoded credentials, JWT keys, database passwords, or live API keys in application source.
- **Dangerous Functions**: No use of `eval()`, `Function()`, `child_process.exec()`, `child_process.spawn()`, or `vm.runInContext()`.

### 2. Authentication Architecture
- **Registration**: Implemented with Argon2id hashing and immediate JWT token issuance in public beta.
- **Login**: Verifies credentials via Argon2; does not reveal whether email or password was invalid (`Invalid credentials`).
- **Account Enumeration**: Public endpoints return standardized responses preventing user enumeration.

### 3. Authorization & IDOR (Insecure Direct Object References)
- **Sandbox Sessions (`/api/v1/sandbox/sessions/:id`)**: Verified that User B cannot query or execute commands in User A's session (throws `403 Forbidden`).
- **Exam Attempts (`/api/v1/certifications/attempts/:id`)**: Verified that User B cannot inspect or submit User A's exam attempt (throws `403 Forbidden`).
- **Progress & Bookmarks**: User progress and saved lessons are bound directly to the authenticated JWT subject or validated anonymous learner ID.

### 4. Session & JWT Security
- **Signature Algorithm**: HMAC-SHA256 with strong runtime secret length validation ($\ge 32$ characters).
- **Startup Protection**: `validateProductionConfig()` halts server initialization if default or sample secrets (`change_in_production`, `secret`, etc.) are detected in production.
- **Expiration**: Strict expiration enforcement (default: 7 days).

### 5. API Security & Endpoint Boundaries
- **Public Routes**: `/api/v1/health`, `/api/v1/courses`, `/api/v1/search`, `/api/v1/commands`, `/api/v1/auth/login`, `/api/v1/auth/register`.
- **Authenticated Routes**: `/api/v1/auth/me`, `/api/v1/progress/claim`, `/api/v1/certificates/claim`.
- **Owner-Gated Routes**: `/api/v1/sandbox/sessions/:id/execute`, `/api/v1/certifications/attempts/:id/submit`.
- **Admin-Gated Routes**: `/api/v1/admin/*` guarded by `JwtAuthGuard` + `RolesGuard` (`@Roles(Role.ADMIN)`).

### 6. Input Validation & Type Safety
- **Validation Pipe**: NestJS `ValidationPipe` configured with `whitelist: true`, `forbidNonWhitelisted: true`, and `transform: true`.
- **Payload Sanitization**: Reject unexpected fields and malformed payloads automatically before reaching service logic.

### 7. Database Security & ORM Parameterization
- **Prisma Parameterization**: All database interactions use Prisma ORM query builder with parameterized SQL statements; immune to classical SQL injection.
- **Migration Governance**: Production database operations strictly require `prisma migrate deploy`.

### 8. Secrets & Configuration Management
- **Environment Isolation**: Production secrets are injected solely through environment variables.
- **Repository Safety**: `.env` and `.env.local` files are strictly included in `.gitignore`.

### 9. CORS Policy
- **Origin Restriction**: Configured with `CORS_ORIGIN` pointing exclusively to `https://netvision-three.vercel.app`.
- **Credentials**: `credentials: true` supported for cross-origin authenticated REST requests.

### 10. Security Headers (HTTP Hardening)
- **Helmet Middleware**:
  - `Strict-Transport-Security: max-age=15552000; includeSubDomains`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `Content-Security-Policy`: Default-src `'self'` with restricted script/style sources.

### 11. Rate Limiting & Abuse Prevention
- **Global Throttling**: `@nestjs/throttler` configured with 100 requests per 60-second window.
- **Route-Specific Limits**:
  - Authentication endpoints: 20 req/min.
  - Password reset endpoints: 5 req/min.
- **Proxy Alignment**: `expressApp.set('trust proxy', 'loopback')` ensures accurate client IP extraction from `X-Forwarded-For`.

### 12. Password Security & Storage
- **Hashing Algorithm**: Argon2id (`argon2` npm package) with memory-hard work factors.
- **Salting**: Cryptographically secure per-user salt generated automatically by Argon2.

### 13. Email & OTP Security in Public Beta
- **Beta Bypass**: Email OTP verification is deactivated via `EMAIL_VERIFICATION_ENABLED=false`.
- **Zero Phishing / Fake Deliveries**: Response explicitly indicates `requiresOtp: false` without claiming email dispatch.
- **API Secret Sanitization**: Resend API keys and raw tokens never leak in application logs or API responses.

### 14. Password Reset Mechanics
- **Token Entropy**: 32-byte cryptographically random token (`crypto.randomBytes(32).toString('hex')`).
- **Storage**: Only SHA-256 hash of the token (`tokenHash`) is persisted in PostgreSQL.
- **Expiration**: Strict 15-minute validity window with single-use invalidation (`used: true`).
- **Beta Handling**: Unconfigured email transports explicitly return HTTP 400 rather than silently faking delivery.

### 15. OAuth 2.0 Security
- **Providers**: Google OAuth 2.0 and GitHub OAuth 2.0 via Passport strategies.
- **Token Routing**: Callbacks redirect to frontend `/auth/callback?token=...` with JWT authorization.

### 16. Guest Identity Isolation
- **UUID Enforcement**: `X-Anonymous-ID` header must adhere to standard UUID format (`^[0-9a-f]{8}-...`).
- **Isolation**: Anonymous learners cannot access or execute commands in sessions owned by another anonymous UUID.
- **Atomic Migration**: Claiming progress merges guest records atomically into the authenticated user's account.

### 17. Certificate Verification Security
- **Credential IDs**: Unique cryptographic UUIDs and verification codes.
- **Public Verification**: `/certificates/:id` reveals only intended public credential metadata without exposing private account details.

### 18. Assessment & Exam Integrity
- **Server-Side Scoring**: All quiz scores, attempt counters, and practical objective checks are evaluated server-side.
- **Anti-Cheating Snapshots**: Question configurations and randomized order are snapshotted server-side upon exam initiation.

### 19. Simulated Sandbox Isolation
- **Engine**: Pure TypeScript simulation engine (`SimulatedSandboxProvider`).
- **Blacklisted Commands**: Proactively intercepts and blocks destructive patterns (`sudo`, `rm -rf`, `chmod`, `dd`, `mkfs`, redirection).
- **Zero OS Interaction**: Commands never invoke the underlying Linux host or Node.js runtime environment.

### 20. File Handling & Static Content
- **Read-Only Codebase**: The backend does not expose arbitrary file upload or download endpoints.
- **Path Traversal Immunity**: No user input is concatenated into local file path lookups.

### 21. Server-Side Request Forgery (SSRF)
- **No User-Controlled Outbound Requests**: All outbound HTTP requests (Resend API) target static, hardcoded endpoints (`https://api.resend.com/emails`).

### 22. Cross-Site Scripting (XSS)
- **Frontend Framework**: Next.js (React 18) with automatic context-aware JSX string escaping.
- **No `dangerouslySetInnerHTML`**: Dynamic lesson content is structured via validated JSON schemas and React UI components.

### 23. Mass Assignment Protection
- **DTO Whitelisting**: Class-validator DTOs strictly define acceptable request properties; non-whitelisted fields are stripped automatically.

### 24. CSRF Protection
- **Stateless Bearer Tokens**: Authentication relies on `Authorization: Bearer <JWT>` headers rather than ambient cookies for stateful mutations.

### 25. OpenAPI / Swagger Exposure
- **Production Gating**: Swagger documentation at `/api/docs` is automatically disabled when `NODE_ENV === 'production'`.

### 26. Error Handling & Information Leakage
- **Global Exception Filters**: Standardized NestJS exception responses return `{ statusCode, message, error }` without stack traces or database schema internals.

### 27. Logging & Telemetry Security
- **Sanitized Loggers**: Sensitive credentials (passwords, JWT secrets, OTPs, raw tokens) are excluded from `Nest.Logger` statements.

### 28. Dependency Vulnerabilities
- **Audit Findings**: `pnpm audit` reports 51 advisories across transitive dependencies (primarily legacy dev dependencies). Core runtime dependencies (`@nestjs/core`, `prisma`, `argon2`, `next`) are securely configured.

### 29. Deployment Infrastructure Security
- **Platform Separation**: Next.js frontend on Vercel Edge; NestJS API on Render; Neon PostgreSQL database over SSL (`sslmode=require`).
- **Graceful Shutdown**: Server implements `app.enableShutdownHooks()` for safe connection termination.

### 30. Frontend Security & Session State
- **Storage Handling**: JWT tokens stored in browser `localStorage` / `sessionStorage` with automatic logout on invalid token response.
- **Client Sanitization**: UI components sanitize route parameters before invoking backend endpoints.

---

## 3. Vulnerability Findings Matrix

| Finding ID | Title | Severity | Affected Component | Exploit Preconditions | Recommended Remediation |
|:---:|---|:---:|---|---|---|
| **SEC-01** | Transitive Next.js & Dev Dependency Advisories | **LOW** | `frontend/package.json` | Requires specific cache-poisoning or proxy scenarios | Update Next.js to $\ge 15.5.16$ in subsequent maintenance cycle. |
| **SEC-02** | Swagger OpenAPI Exposure in Staging | **INFO** | `backend/src/main.ts` | Accessible on staging deployment (`/api/docs`) | Confirmed disabled automatically when `NODE_ENV=production`. |
| **SEC-03** | LocalStorage JWT Token Storage | **LOW** | `frontend/stores/authStore.ts` | Requires pre-existing XSS vulnerability on frontend | Consider migrating access tokens to HttpOnly SameSite cookies in Phase 3. |

---

## 4. Security Readiness Rating

**Rating**: **READY**  
NetVision satisfies all core security and authorization criteria required for public beta launch.
