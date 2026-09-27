# NetVision — Database Governance & Schema Drift Prevention Guide (Drop 26)

---

## 1. Executive Summary & Purpose

The NetVision database architecture enforces critical business logic and academic integrity at the PostgreSQL engine level. Certain essential PostgreSQL constraints cannot be expressed directly in Prisma Schema Language (PSL):

1. **Partial Unique Index** (`exam_attempts_user_active_in_progress_unique_idx`): Guarantees that a candidate can have at most **ONE** concurrent `IN_PROGRESS` exam attempt, while permitting unlimited historical completed (`PASSED`, `FAILED`, `EXPIRED`) attempts.
2. **XOR Ownership CHECK Constraints** (`*_owner_xor` on 5 tables): Enforces strict mutual exclusivity—every progress, quiz attempt, lab attempt, saved lesson, and sandbox session record is owned by EITHER an authenticated `User` (`userId`) OR an `AnonymousLearner` (`anonymousId`), NEVER both and NEVER neither.
3. **Compound Unique Index** (`certificates_userId_certificationCode_key`): Guarantees that a candidate can receive only one verified certificate per certification code.

### The Core Vulnerability
If an engineer runs `prisma db push` or `prisma db push --accept-data-loss` against a database, Prisma synchronizes the database solely from `schema.prisma`. Because Prisma PSL cannot model predicate indexes or CHECK constraints, **Prisma will silently drop the partial unique index and bypass the CHECK constraints**, destroying critical concurrency and data isolation guarantees.

Drop 26 establishes structural database governance, automated command guards, CI drift detectors, and explicit operational tier matrices to prevent constraint destruction.

---

## 2. Codified Database Tiers & Permitted Operations Matrix

The NetVision database environment is divided into four strictly segregated operational tiers:

| Database Tier | Target Environment | Target Database URL Host Patterns | Permitted Operations | Strictly Forbidden Operations |
|---|---|---|---|---|
| **DEVELOPMENT** | Local developer workstation | `localhost`, `127.0.0.1`, `docker-compose`, local container | `prisma migrate dev`<br>`prisma generate`<br>`prisma db seed`<br>`prisma migrate status` | `prisma db push` against shared/remote databases |
| **TEST** | CI ephemeral service container | GitHub Actions `postgres:16-alpine`, Docker test network | `prisma migrate deploy`<br>`prisma generate`<br>`prisma db seed`<br>`automated test execution` | `prisma db push`<br>`prisma migrate reset` during release |
| **STAGING** | Pre-release verification cluster | `staging*.render.com`, `ep-*-staging.neon.tech` | `prisma migrate deploy`<br>`prisma migrate status`<br>`prisma generate` | `prisma db push`<br>`prisma migrate reset`<br>`prisma db seed` with truncation |
| **PRODUCTION** | Live customer-facing cluster | `ep-*.neon.tech`, `*.amazonaws.com`, `*.rds.`, `*.render.com` | `prisma migrate deploy` **ONLY**<br>`prisma migrate status`<br>`prisma generate` | `prisma db push`<br>`prisma db push --accept-data-loss`<br>`prisma migrate reset`<br>`prisma db reset`<br>Manual DDL drops |

---

## 3. Canonical SQL Definitions (`unmodeled-constraints.sql`)

All database constraints and partial indexes that cannot be modeled in `schema.prisma` are maintained in canonical SQL form in [`backend/prisma/unmodeled-constraints.sql`](file:///c:/My%20works/2026%20Work/Netvision/backend/prisma/unmodeled-constraints.sql):

### 3.1 Partial Unique Index (Active Exam Concurrency Control)
```sql
CREATE UNIQUE INDEX IF NOT EXISTS "exam_attempts_user_active_in_progress_unique_idx"
ON "exam_attempts" ("userId", "certificationCode")
WHERE "status" = 'IN_PROGRESS';
```
- **Engine Logic**: Enforced at the PostgreSQL b-tree index level with predicate filtering.
- **Invariant**: Multiple historical attempts for `(userId, certificationCode)` are allowed when status is `PASSED`, `FAILED`, `CANCELLED`, or `EXPIRED`. Exactly one `IN_PROGRESS` attempt is permitted.
- **Violation Code**: Throws PostgreSQL `23505` (`unique_violation`) mapped to Prisma `P2002`.

### 3.2 XOR Ownership CHECK Constraints (Data Isolation)
```sql
DO $$
BEGIN
  -- user_progress
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_progress_owner_xor') THEN
    ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_owner_xor"
    CHECK (("userId" IS NOT NULL AND "anonymousId" IS NULL) OR ("userId" IS NULL AND "anonymousId" IS NOT NULL));
  END IF;

  -- quiz_attempts
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_attempts_owner_xor') THEN
    ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_owner_xor"
    CHECK (("userId" IS NOT NULL AND "anonymousId" IS NULL) OR ("userId" IS NULL AND "anonymousId" IS NOT NULL));
  END IF;

  -- lab_attempts
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lab_attempts_owner_xor') THEN
    ALTER TABLE "lab_attempts" ADD CONSTRAINT "lab_attempts_owner_xor"
    CHECK (("userId" IS NOT NULL AND "anonymousId" IS NULL) OR ("userId" IS NULL AND "anonymousId" IS NOT NULL));
  END IF;

  -- saved_lessons
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'saved_lessons_owner_xor') THEN
    ALTER TABLE "saved_lessons" ADD CONSTRAINT "saved_lessons_owner_xor"
    CHECK (("userId" IS NOT NULL AND "anonymousId" IS NULL) OR ("userId" IS NULL AND "anonymousId" IS NOT NULL));
  END IF;

  -- sandbox_sessions
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sandbox_sessions_owner_xor') THEN
    ALTER TABLE "sandbox_sessions" ADD CONSTRAINT "sandbox_sessions_owner_xor"
    CHECK (("userId" IS NOT NULL AND "anonymousId" IS NULL) OR ("userId" IS NULL AND "anonymousId" IS NOT NULL));
  END IF;
END $$;
```
- **Engine Logic**: Evaluated on every `INSERT` and `UPDATE` transaction.
- **Violation Code**: Throws PostgreSQL `23514` (`check_violation`).

---

## 4. Production Migration Workflow

In production and staging environments, database schema changes must be applied strictly forward-only:

```bash
# Safe, guarded production migration deployment
pnpm --filter netvision-backend prisma:migrate:prod
# Internally executes:
# ts-node scripts/guard-db-command.ts "migrate deploy" && prisma migrate deploy
```

### Why `prisma migrate deploy` is Mandatory:
1. **Applies committed SQL migration files**: Reads `backend/prisma/migrations/*` sequentially.
2. **Preserves custom DDL**: Executes the exact SQL committed by engineering, preserving partial indexes and CHECK constraints.
3. **Transactional**: Executes inside PostgreSQL transactions (`DIRECT_URL` direct session connection).
4. **Idempotent**: Tracks applied migrations in `_prisma_migrations` table.

---

## 5. Automated Governance Guard (`guard-db-command.ts`)

The safety guard [`backend/scripts/guard-db-command.ts`](file:///c:/My%20works/2026%20Work/Netvision/backend/scripts/guard-db-command.ts) intercepts commands before execution:

1. **Target Detection**: Inspects `DATABASE_URL` and `NODE_ENV`. If the target matches production host patterns (`.neon.tech`, `amazonaws.com`, `render.com`, etc.), it marks the target as `isProtected: true`.
2. **Command Evaluation**: If the command contains `db push`, `db reset`, `migrate reset`, or `--accept-data-loss`, execution is **instantly aborted with exit code 1**:
   ```
   ⛔ DESTRUCTIVE DATABASE COMMAND BLOCKED BY DATABASE GOVERNANCE!
   Command "prisma db push" cannot be executed against protected PRODUCTION database.
   Target Environment: production
   Target Database URL: postgresql://neondb_owner:****@ep-sparkling-rice.neon.tech/neondb

   REASON: Running "prisma db push" on PRODUCTION erases critical PostgreSQL constraints
   (partial unique indexes and XOR ownership checks) or causes irrecoverable data loss.

   To deploy migrations safely in PRODUCTION, use:
     pnpm --filter netvision-backend prisma:migrate:prod (npx prisma migrate deploy)
   ```

---

## 6. Continuous Integration & Release Drift Scanning

In `.github/workflows/ci.yml`, two automated barriers enforce database governance on every pull request and commit to `main`:

```yaml
- name: Database Governance & Workflow Drift Guard
  run: |
    cd backend
    npx ts-node scripts/guard-db-command.ts --scan-workflows

- name: Run Backend Certification & Deployment Readiness Suite
  run: |
    cd backend
    ...
    npx ts-node scripts/test-drop-26-database-governance.ts
```

### What the Scanner Validates:
1. Scans all files under `.github/workflows/`, `render.yaml`, `Dockerfile`, and monorepo `package.json` files.
2. Verifies that no workflow introduces `prisma db push`, `db push`, `prisma migrate reset`, or `--accept-data-loss`.
3. Ensures that production release steps strictly use `prisma migrate deploy`.

---

## 7. Migration Playbook for Engineers

When adding or altering database models:

1. **Modify Schema**: Update `backend/prisma/schema.prisma`.
2. **Create Migration Locally**:
   ```bash
   pnpm --filter netvision-backend prisma:migrate --name add_new_feature
   ```
3. **Review Migration SQL**: Open `backend/prisma/migrations/<timestamp>_add_new_feature/migration.sql`.
   - Ensure it does NOT drop `exam_attempts_user_active_in_progress_unique_idx`.
   - Ensure it does NOT drop any `*_owner_xor` constraints.
   - If adding a table with `userId` and `anonymousId`, append the corresponding XOR CHECK constraint.
4. **Run Verification Suite**:
   ```bash
   pnpm --filter netvision-backend test:drop26
   ```
5. **Commit Migration**: Commit both `schema.prisma` and the `migrations/` directory to Git.
6. **Deploy via CI**: Merging to `main` automatically deploys via `prisma migrate deploy`.
