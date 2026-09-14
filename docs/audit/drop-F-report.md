# Drop F Report: Master Capstone Atomic Transaction Hardening & Concurrency Protection

## Starting Commit
`5ac49da`

## Objective
Audit and harden the Master Capstone examination submission and grading pipeline against race conditions, parallel submission exploits, and database connection failures by wrapping evaluation and CAS persistence in an atomic `prisma.$transaction` block with timeout guardrails and deterministic expiration handling.

## Findings Investigated
- **CAP-001 (P1)**: Capstone submission and grading lacked database transaction atomicity. Naked Prisma queries could lead to corrupted metadata or inconsistent state if network faults occurred between attempt status evaluation and final persistence. Furthermore, parallel submissions risked race conditions without serialized transaction boundaries.

## Findings Reproduced
- Inspected `backend/src/certifications/master-capstone.service.ts`:
  - `submitCapstoneAttempt` used separate unmanaged asynchronous queries (`findUnique`, `updateMany` for expiry, `updateMany` for grading result).
  - If a client experienced a network drop or if parallel requests were dispatched simultaneously, the operations were not bound within an ACID transactional boundary.
  - In `getCapstoneAttemptStatus`, the auto-expiration update used single-record `update` instead of status-guarded `updateMany`, which could throw under race conditions if an attempt was concurrently marked EXPIRED.

## Root Causes
1. **Unbounded Asynchronous Queries**: `submitCapstoneAttempt` was missing a `prisma.$transaction` wrapper around the grading evaluation and status persistence.
2. **Transaction Rollback Reversion Risk**: Throwing exceptions inside an active transaction during expiration would cause Prisma to roll back the expiration update, leaving the attempt in `IN_PROGRESS`. Expiration needed clean two-stage handling: persisting the terminal `EXPIRED` status with score=0 before raising client rejection.

## Changes Implemented
1. **Atomic Transaction Boundary in `master-capstone.service.ts`**:
   - Wrapped `submitCapstoneAttempt`'s CAS status transition and grading metadata persistence inside `this.prisma.$transaction(async (tx) => { ... }, { timeout: 15000 })`.
   - Guaranteed that exactly one submission succeeds when parallel submissions are received, utilizing atomic Compare-And-Swap (`where: { id: attemptId, status: ExamAttemptStatus.IN_PROGRESS }`).
   - If CAS updates 0 rows, the transaction safely throws `BadRequestException('Exam attempt has already been submitted or is no longer in progress.')`.
2. **Deterministic Expiration Persistence**:
   - Ensured expired attempts submitted past `expiresAt` are atomically committed to `status: EXPIRED`, `score: 0`, and `passed: false` before returning the rejection error.
   - Hardened `getCapstoneAttemptStatus` with status-guarded `updateMany({ where: { id: attemptId, status: ExamAttemptStatus.IN_PROGRESS }, data: { status: ExamAttemptStatus.EXPIRED } })`.
3. **Automated Verification Suite (`test-drop-f-transaction-hardening.ts`)**:
   - Authored comprehensive test suite covering:
     - Full transactional atomicity and metadata verification (theory, incident, forensics sections).
     - Concurrent parallel submissions firing 5 simultaneous requests (verifies exactly 1 success and 4 rejections with CAS state tokens).
     - Server-authoritative atomic expiration and subsequent rejection.
     - Tenant isolation and IDOR defense (attacker receives 403 Forbidden with victim attempt unchanged).
     - Repeat submission idempotency defense.
   - Registered `test:drop:f`, `test:drop8`, and `test:drop9` in `backend/package.json`.

## Files Changed
- `backend/src/certifications/master-capstone.service.ts` [MODIFY]
- `backend/scripts/test-drop-f-transaction-hardening.ts` [NEW]
- `backend/package.json` [MODIFY]
- `docs/audit/post-audit-execution-ledger.md` [MODIFY]

## Database Changes
None. Preserved existing Prisma schema and database indexes (`exam_attempts_user_active_in_progress_unique_idx`).

## Security Changes
Enhanced ACID transactional security and concurrency protection against race condition attacks on Master Capstone examination grading.

## Tests Executed
1. `npm run test:drop:f` in `backend` -> 23 passed, 0 failed (100%).
2. `npm run test:drop8` in `backend` -> 43 passed, 0 failed (100%).
3. `npm run test:drop9` in `backend` -> 40 passed, 0 failed (100%).
4. `pnpm --filter netvision-frontend test` -> 7/7 test suites passed (100%).
5. `pnpm typecheck` -> 5/5 workspace projects passed with 0 errors.

## Test Results
100% PASS across all transactional verification suites, regression suites, frontend tests, and typechecks.

## Build / Typecheck / Lint
- `pnpm typecheck`: Exit code 0
- Backend suites: Exit code 0

## Playwright
No regression.

## Remaining Issues
None for Drop F. Moving to Drop G to address Application Security, Data Privacy & Verification Sanitization (`SEC-002`, `SEC-003`).

## Risk Assessment
Zero risk. Atomic transactions with 15s timeout prevent connection pool lockups and ensure database integrity.

## Commit SHA
PENDING

## Verdict
**GREEN**
