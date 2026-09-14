# Drop G Report: Sensitive Data Sanitization & Public Verification Rate Limiting

## Starting Commit
`16c7339`

## Objective
Remediate security and privacy findings SEC-002 and SEC-003 by purging all sensitive internal data (database UUIDs, user IDs, emails, password hashes, and verification codes) from unauthenticated public certificate verification DTOs, enforcing strict AUTH-tier rate limiting (10 requests/minute) across verification endpoints to eliminate credential harvesting, and sanitizing public verification copy.

## Findings Investigated
- **SEC-002 (P1)**: Unauthenticated public certificate verification endpoints leaked internal database UUIDs (`cert.id`, `user.id`), and secret verification codes in public responses.
- **SEC-003 (P2)**: Public verification endpoints lacked specialized rate limiting, leaving them susceptible to automated credential enumeration and brute-force harvesting attacks.

## Findings Reproduced
1. Inspected `backend/src/topics/topics.service.ts` (`getCertificateById`):
   - Returned `id: cert.id` (internal database UUID) and `verificationCode: cert.verificationCode || cert.code`.
   - Any unauthenticated caller querying `/certificates/:id` received internal identifiers and secret verification codes.
2. Inspected `backend/src/certifications/certifications.controller.ts` & `topics.controller.ts`:
   - `@Get('certificates/verify/:credentialId')` and `@Get('certificates/:id')` did not have explicit `@AuthRateLimit()` decorators applied.
   - While `AppRateLimitGuard` handled `/auth/login` and `/auth/register`, public verification paths were not mapped to the restricted `AUTH` tier (10 req/min).
3. Inspected `frontend/app/certificates/verify/[credentialId]/page.tsx`:
   - UI contained remaining references to "cryptographic signature" during verification loading and badge displays.

## Root Causes
1. **Public DTO Over-Exposure**: `TopicsService.getCertificateById` mapped internal entity fields directly to the response object rather than utilizing a strictly sanitized public projection.
2. **Missing Rate Limit Route Association**: Verification routes were not decorated or classified under the `AUTH` rate-limiting tier in `AppRateLimitGuard`.
3. **Legacy Copy Residue**: Frontend verification page retained earlier promotional terminology regarding cryptographic signatures rather than official authoritative registry verification.

## Changes Implemented
1. **Sanitization of Public Verification DTOs (SEC-002)**:
   - Updated `backend/src/topics/topics.service.ts`: Purged `id` and `verificationCode` from `getCertificateById`. Only returns public attributes: `credentialId`, `status`, `issuedAt`, `recipientName`, `courseTitle`, `certificationCode`, `grade`, `score`, `skills`, and `isVerified`.
   - Confirmed `backend/src/certifications/certifications.service.ts` (`verifyCertificate`): Strictly excludes `id`, `userId`, `verificationCode`, `email`, and `passwordHash`.
2. **Strict Verification Rate Limiting (SEC-003)**:
   - Added `@AuthRateLimit()` decorator to `verifyCertificate` in `backend/src/certifications/certifications.controller.ts`.
   - Added `@AuthRateLimit()` decorator to `getCertificateById` in `backend/src/topics/topics.controller.ts`.
   - Hardened `backend/src/security/rate-limiter/app-rate-limit.guard.ts`: Updated `resolveTier()` to classify both `/certificates/verify` and `/certificates/` as `AUTH` tier (10 requests/minute per client IP) with automatic `Retry-After` headers and 429 response codes upon limit breach.
3. **Frontend Verification UI Copy Alignment**:
   - Updated `frontend/app/certificates/verify/[credentialId]/page.tsx`: Replaced "cryptographic signature" with "Official NetVision registry record and integrity verification succeeded".
4. **Automated Verification Suite (`test-drop-g-security-sanitization.ts`)**:
   - Authored comprehensive test suite in `backend/scripts/test-drop-g-security-sanitization.ts`:
     - Validated zero leakage of internal UUID, userId, verificationCode, email, or passwordHash across both `CertificationsService.verifyCertificate` and `TopicsService.getCertificateById`.
     - Validated `AppRateLimitGuard` route resolution to `AUTH` tier for verification endpoints.
     - Validated `RateLimiterService` quota exhaustion: allows 10 requests, blocks the 11th with `allowed: false` and active `retryAfterSeconds`.
     - Validated frontend source code contains 0 instances of misleading cryptographic or blockchain claims.
   - Added `test:drop:g` script to `backend/package.json`.

## Files Changed
- `backend/src/topics/topics.service.ts` [MODIFY]
- `backend/src/topics/topics.controller.ts` [MODIFY]
- `backend/src/certifications/certifications.controller.ts` [MODIFY]
- `backend/src/security/rate-limiter/app-rate-limit.guard.ts` [MODIFY]
- `frontend/app/certificates/verify/[credentialId]/page.tsx` [MODIFY]
- `backend/scripts/test-drop-g-security-sanitization.ts` [NEW]
- `backend/package.json` [MODIFY]
- `docs/audit/drop-G-report.md` [NEW]
- `docs/audit/post-audit-execution-ledger.md` [MODIFY]

## Database Changes
None. No schema migrations required.

## Security Changes
- Total remediation of credential metadata leakage (SEC-002).
- Defense against automated enumeration attacks via rate limiting (SEC-003).

## Tests Executed
1. `pnpm --filter netvision-backend test:drop:g` -> 28 passed, 0 failed (100%).
2. `pnpm --filter netvision-backend typecheck` -> 0 errors.
3. `pnpm --filter netvision-frontend test` -> 7/7 suites passed (100%).

## Test Results
100% PASS across all security sanitization checks, rate-limiting evaluations, frontend regression suites, and TypeScript compilation.

## Invariant Verification
- Public verification endpoints confirm certificate validity without exposing student PII or database infrastructure internals.
- Rate limiting enforces 10 req/min quota on certificate lookups.
- Canonical credentials and grading criteria remain strictly preserved.
