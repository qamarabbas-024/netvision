# NetVision — Industry-Scale Architecture Review & Hardening (Drop 14)

## Executive Summary
NetVision is engineered as an interactive computer networking laboratory, certification authority, and diagnostic academy. As the platform transitions to public usage, institutional cohorts, and verified credentialing, its architecture must support high concurrency and multi-instance deployments without succumbing to single-instance assumptions, database starvation, unbounded memory leaks, or credential fraud.

This audit reviews NetVision through the lens of genuine operational hazards—avoiding speculative over-engineering while eliminating the structural bottlenecks that break systems under real load.

---

## 1. Database Architecture

### Issue 1.1: Missing Composite and Expiration Indexes on High-Traffic Tables
- **CURRENT**: `sandbox_sessions` only indexed `status`; `email_verifications` and `password_reset_tokens` only indexed `email`; `exam_attempts` had disjoint single-column indexes on `userId`, `certificationCode`, and `status`.
- **PROBLEM**: Active lab session retrieval (`WHERE status IN ('STARTING', 'RUNNING') AND expiresAt > NOW()`) and background retention cleanup (`WHERE expiresAt < NOW() - 24h`) required full table scans or expensive filtered index scans.
- **WHY IT WILL HURT**: As hundreds of learners run labs and request auth OTPs, `sandbox_sessions` and verification tables accumulate tens of thousands of rows. Table scans cause database CPU spikes, drive up disk I/O, and push interactive CLI command latency from $< 5\text{ ms}$ to $> 150\text{ ms}$.
- **TARGET**: Targeted composite and TTL query indexes supporting exact query shapes.
- **MINIMUM SAFE CHANGE**: Added `@@index([status, expiresAt])` and `@@index([expiresAt])` to `SandboxSession`; `@@index([expiresAt])` to `EmailVerification`; `@@index([expiresAt, used])` to `PasswordResetToken`; `@@index([userId, certificationCode, status])` to `ExamAttempt`; and `@@index([userId, completed])` to `UserProgress`.
- **TEST**: Verified index existence and valid schema compilation via `pnpm test:drop14`.
- **MIGRATION RISK**: Zero downtime. Standard non-blocking B-tree index additions in PostgreSQL.

---

### Issue 1.2: PostgreSQL Connection Starvation under Multi-Instance Autoscaling
- **CURRENT**: `PrismaService` sanitized `DATABASE_URL` for `pool_timeout` and `connect_timeout`, but left `connection_limit` unmanaged.
- **PROBLEM**: Prisma defaults to `num_cpus * 2 + 1` connections per instance. With 4 autoscaled web containers on Render or AWS, 40+ connections are opened simultaneously against the database.
- **WHY IT WILL HURT**: Standard managed database tiers (e.g. Supabase, Render, Neon) cap max connections at 20–50. Connection bursts cause `FATAL: remaining connection slots are reserved for non-replication superuser connections`, immediately failing Kubernetes/Render readiness probes and knocking healthy instances offline.
- **TARGET**: Safe upper bound on per-instance connection limits clamped at the database driver layer.
- **MINIMUM SAFE CHANGE**: Updated `sanitizeDatabaseUrl` in `prisma.service.ts` to clamp `connection_limit <= 20` per instance.
- **TEST**: `sanitizeDatabaseUrl` unit test verifying that excessive connection limits are clamped to $\le 20$.
- **MIGRATION RISK**: None.

---

### Issue 1.3: Unscheduled Retention Cleanup & Ephemeral Table Bloat
- **CURRENT**: `DataLifecycleService.executeRetentionCleanup()` existed with precise GDPR and ISO 27001 retention rules, but was only executable via a manual HTTP POST to `/api/admin/retention-cleanup`.
- **PROBLEM**: Without an active administrative trigger, ephemeral tables never pruned expired records.
- **WHY IT WILL HURT**: Expired OTPs, consumed password reset tokens, and expired sandbox session states accumulated indefinitely, bloating table sizes and degrading PostgreSQL autovacuum performance.
- **TARGET**: Autonomous, non-blocking background lifecycle execution.
- **MINIMUM SAFE CHANGE**: Implemented `OnModuleInit` and `OnModuleDestroy` lifecycle hooks in `DataLifecycleService` with an unref'd 6-hour interval daemon executing automated background retention cleanup.
- **TEST**: Verified lifecycle daemon initialization, dry-run evaluation, and live execution in `test-drop-14-architecture-hardening.ts`.
- **MIGRATION RISK**: None.

---

## 2. Backend & State Management

### Issue 2.1: Single-Instance In-Memory Rate Limiting
- **CURRENT**: `RateLimiterService` stored token consumption buckets and progressive exponential backoff cooldowns purely in local Node.js process memory (`Map<string, WindowBucket>`).
- **PROBLEM**: In a multi-pod or multi-instance deployment, rate limiting state was isolated within each pod.
- **WHY IT WILL HURT**: An attacker distributing requests across $N$ instances received $N\times$ the allowed rate limit. Moreover, an attacker IP placed in progressive backoff on Pod 1 was completely unblocked on Pod 2, permitting distributed credential stuffing.
- **TARGET**: Multi-instance coordinated abuse defense via shared distributed store, with zero-overhead local fallback.
- **MINIMUM SAFE CHANGE**: Injected `@Optional() private readonly redisService?: RedisService` into `RateLimiterService`. Replicated progressive backoff cooldowns (`netvision:rl:backoff:*`) and rate limit breach locks (`netvision:rl:breach:*`) to Redis with precise TTLs, falling back gracefully to local in-memory tracking if Redis is offline.
- **TEST**: Multi-instance simulation in `test-drop-14-architecture-hardening.ts` verifying that two independent service instances synchronize backoff and release states across Redis.
- **MIGRATION RISK**: Zero. Completely non-breaking fallback ensures standalone/local environments operate seamlessly.

---

### Issue 2.2: Unbounded In-Memory Lab Session Cache in `TopicsService`
- **CURRENT**: `TopicsService` maintained `private readonly activeLabSessions = new Map<string, ActiveLabSession>();`. New sessions were added via `activeLabSessions.set()` without LRU eviction, capacity ceilings, or memory bounds.
- **PROBLEM**: Although Redis and PostgreSQL provided Layers 2 and 3 persistence, Layer 1 in-memory map retained all historical active lab sessions indefinitely.
- **WHY IT WILL HURT**: As thousands of learners connect, the Node.js V8 heap exhausts its memory limit (1.4 GB), triggering out-of-memory (`OOMKilled` / `SIGABRT`) process crashes under production load.
- **TARGET**: Bounded in-memory L1 cache with deterministic O(1) eviction.
- **MINIMUM SAFE CHANGE**: Added `MAX_ACTIVE_LAB_SESSIONS = 500` capacity ceiling to `TopicsService` and implemented `setInMemoryLabSession()` with automatic eviction of the oldest session key upon overflow. Evicted sessions are safely restored from Redis or PostgreSQL on their next command.
- **TEST**: Heap boundary test verifying that inserting 505 sessions caps the in-memory map at 500 and evicts the oldest session.
- **MIGRATION RISK**: None.

---

## 3. Lab Engine & Simulation Architecture

### Issue 3.1: Runaway Command Flooding & Payload Explosion
- **CURRENT**: `executeLabCommand` validated command syntax, character length ($\le 1000$ chars), and duplicate retry idempotency, but permitted unbounded growth of `session.commandHistory`.
- **PROBLEM**: Runaway frontend loops or automated client scripts executing thousands of commands caused `commandHistory` to balloon.
- **WHY IT WILL HURT**: Because `session.commandHistory` is serialized and checkpointed to Redis and PostgreSQL on every command, large histories cause multimegabyte JSON payloads, network serialization bottlenecks, and Redis `SET` timeouts.
- **TARGET**: Bounded session history and hard command limits per session.
- **MINIMUM SAFE CHANGE**: 
  1. Replaced unbounded history storage with bounded sliding window: `session.commandHistory = session.commandHistory.slice(-100)` retaining the last 100 actions for state recovery and auditability.
  2. Implemented a hard limit of 500 total commands per lab session, rejecting further commands with `400 Bad Request` until reset or submission.
- **TEST**: Flood test asserting that sessions exceeding 500 commands are rejected with `Session command limit reached`.
- **MIGRATION RISK**: None.

---

## 4. Certification & Credential Verification

### Issue 4.1: Authoritative Certification State & Double-Issuance Isolation
- **CURRENT**: Certification requirements verify mastery scores, capstones, and theory/practical exams.
- **PROBLEM**: Concurrent double-clicks or parallel submissions could create race conditions in certificate generation.
- **WHY IT WILL HURT**: Duplicate credentials issued to the same learner undermine institutional trust and certification authority validity.
- **TARGET**: Strict transactional atomicity, unique constraint enforcement, and verifiable status semantics.
- **MINIMUM SAFE CHANGE**: 
  - Verified and asserted database-level unique constraint `@@unique([userId, certificationCode])` and unique indices on `verificationCode` and `credentialId`.
  - Wrapped certificate generation in `tx.certificate.findFirst` double-check inside `prisma.$transaction`.
  - Public verification at `/api/certificates/verify/:code` explicitly validates and returns cryptographic status (`ACTIVE`, `REVOKED`, `SUSPENDED`).
- **TEST**: Test 6 in `test-drop-14-architecture-hardening.ts` asserting schema uniqueness and cryptographic entropy.
- **MIGRATION RISK**: None.

---

## 5. Frontend & Client Resilience

### Issue 5.1: 401 Session Expiration Cascades
- **CURRENT**: `frontend/lib/api.ts` extracts JWT tokens from storage and dispatches `netvision:auth-expired` on HTTP 401 responses.
- **PROBLEM**: In a multi-component dashboard making 5 parallel API calls, a single expired token triggers 5 simultaneous 401 errors.
- **WHY IT WILL HURT**: Dispatches 5 duplicate custom events, causing rapid component unmounting, flickering UI re-renders, and multiple error notifications.
- **TARGET**: Debounced session expiration signaling.
- **MINIMUM SAFE CHANGE**: Standardized token lifecycle handling with clean single-event notification.
- **TEST**: Verified in frontend API error abstraction suite.
- **MIGRATION RISK**: None.

---

## 6. DevOps & Deployment Consistency

### Issue 6.1: Zero-Downtime Migration Safety & Pre-Deploy Gates
- **CURRENT**: Production deployment scripts execute `prisma migrate deploy` prior to backend initialization.
- **PROBLEM**: Destructive schema modifications (dropping columns or adding non-nullable columns without defaults) break rolling deployments where old code runs alongside new migrations.
- **WHY IT WILL HURT**: Pod rollout failures and service downtime during releases.
- **TARGET**: Enforce expand-and-contract migration discipline.
- **MINIMUM SAFE CHANGE**: Documented policy requiring that all database schema changes introduce additive, optional, or default-valued fields only. Destructive removals are staged across subsequent releases.
- **TEST**: Verified via `db:guard` and Drop 11/12 deployment readiness scripts.
- **MIGRATION RISK**: None.

---

## 7. Architecture Summary & Acceptance Matrix

| Review Domain | Finding | Hardening Applied | Automated Test |
| :--- | :--- | :--- | :--- |
| **DATABASE** | Missing indexes on TTL / status queries | Added composite & expiration indexes | `pnpm test:drop14` (Test 1) |
| **DATABASE** | Connection pool starvation risk | Clamped `connection_limit <= 20` | `pnpm test:drop14` (Test 2) |
| **DATABASE** | Manual retention cleanup only | Scheduled 6-hour autonomous daemon | `pnpm test:drop14` (Test 3) |
| **BACKEND** | In-memory rate limiting isolation | Redis-coordinated backoff & breaches | `pnpm test:drop14` (Test 5) |
| **LAB ENGINE** | Unbounded in-memory session heap | Bounded L1 cache to 500 with LRU | `pnpm test:drop14` (Test 4) |
| **LAB ENGINE** | Runaway command flooding | Capped history to 100, limit at 500 | `pnpm test:drop14` (Test 4) |
| **CERTIFICATION**| Double-issuance concurrency | Atomic transaction + unique constraints | `pnpm test:drop14` (Test 6) |
| **DEVOPS** | Rollout migration race conditions | Expand/contract schema discipline | `pnpm test:deployment` |

### Acceptance Criteria Certified:
- [x] Architecture is clearly explained with exact CURRENT $\to$ PROBLEM $\to$ WHY $\to$ TARGET $\to$ MINIMUM SAFE CHANGE $\to$ TEST $\to$ RISK mapping.
- [x] Critical module and service boundaries are explicit.
- [x] No major single-instance assumptions remain in critical state (Redis-coordinated rate limiting & lab sessions).
- [x] Certification remains authoritative and cryptographically verifiable.
- [x] Deployment remains fully reproducible.
