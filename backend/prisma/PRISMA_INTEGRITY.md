# NetVision — Database Schema, Migration & Prisma Integrity Guide (Drop 06)

## 1. Overview & Mission

In high-stakes educational and certification architectures, the relational database layer must be:
1. **Fully Reproducible**: An empty PostgreSQL instance must be able to boot, apply all migrations deterministically, and initialize with zero errors.
2. **Resistant to Accidental Schema Destruction**: Dangerous commands such as `prisma db push`, `prisma db push --accept-data-loss`, `prisma migrate reset`, and `prisma db reset` must be prevented from executing against production environments.
3. **Protected Against Constraint Erasure**: Custom PostgreSQL database constraints (CHECK constraints and partial unique indexes) that Prisma cannot model in `schema.prisma` must be guaranteed to survive development workflows, CI pipelines, and migrations.

---

## 2. Migration Architecture vs. `schema.prisma`

The NetVision schema evolution is tracked authoritatively in `backend/prisma/migrations`:

| Migration | Purpose | Status in `schema.prisma` |
| :--- | :--- | :--- |
| `20260814000000_baseline` | 29 Tables, 8 Enums, Foreign Keys, and 5 XOR Ownership CHECK constraints | 29 models represented; 5 CHECK constraints **cannot** be modeled in PSL |
| `20260909000000_add_certificate_user_cert_unique` | Compound unique index `("userId", "certificationCode")` on `certificates` | Modeled as `@@unique([userId, certificationCode])` |
| `20260910102552_add_active_exam_attempt_unique_idx` | Partial unique index on `("userId", "certificationCode") WHERE status = 'IN_PROGRESS'` | **Cannot** be modeled in PSL (Prisma lacks predicate index filters) |

### Why Prisma Cannot Model These Constraints Natively:
1. **Partial Unique Indexes**:
   - PostgreSQL allows `CREATE UNIQUE INDEX ... WHERE status = 'IN_PROGRESS'`.
   - Prisma's `@@unique` directive does not support a `where` clause.
   - Purpose: Enables a candidate to have multiple historical attempts (`PASSED`, `FAILED`, `EXPIRED`), but strictly at most **ONE** concurrent `IN_PROGRESS` attempt.
2. **Table-Level CHECK Constraints**:
   - PostgreSQL allows `CHECK ((userId IS NOT NULL AND anonymousId IS NULL) OR (userId IS NULL AND anonymousId IS NOT NULL))`.
   - Prisma schema does not provide a `@@check` directive.
   - Purpose: Prevents orphaned records and data leakage across authenticated and anonymous session claims.

---

## 3. Connection Pooling: `DATABASE_URL` vs. `DIRECT_URL`

Cloud PostgreSQL deployments (such as Neon, AWS RDS Proxy, or Supabase PgBouncer) operate in **Transaction Pooling Mode**.

### The Challenge
- Transaction poolers reuse connections across transactions.
- Prisma Migrations (`prisma migrate deploy` / `dev`) execute session-level advisory locks (`pg_advisory_lock`) and DDL transactions that fail when routed through a transaction pooler.
- Runtime application queries (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) require connection pooling to prevent connection starvation under high traffic.

### The Solution: Dual-URL Architecture
In `backend/prisma/schema.prisma`:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

1. **`DATABASE_URL` (Runtime App Connection)**:
   - Points to the connection pooler (e.g. `ep-*-pooler.neon.tech:5432` or port `6543`).
   - Clamped with `pool_timeout=10` and `connect_timeout=10` by `sanitizeDatabaseUrl()`.
2. **`DIRECT_URL` (Migration Connection)**:
   - Points directly to the PostgreSQL instance (e.g. `ep-*.neon.tech:5432`).
   - Bypasses PgBouncer transaction pooling to acquire session-level advisory locks and execute deterministic migrations.

---

## 4. Guardrails Against Destructive Database Commands

### Strict Policy
- `prisma db push`: **PROHIBITED IN PRODUCTION**. Drops unmodeled partial indexes and constraints.
- `prisma migrate reset` / `prisma db reset`: **PROHIBITED IN PRODUCTION**. Destroys all database tables and historical learner records.
- Standard Production Migration Command:
  ```bash
  pnpm --filter netvision-backend prisma:migrate:prod
  # Equivalent to: npx prisma migrate deploy
  ```

### Automated Guardrails:
NetVision includes `backend/scripts/guard-db-command.ts`.
Any script or operator attempting to execute destructive commands against a production database URL or in `NODE_ENV=production` is intercepted and aborted with a fatal error.

---

## 5. Safe Seed Archival Semantics (`seed.ts`)

In previous iterations, `seed.ts` executed `prisma.quizQuestion.deleteMany()` on any question not present in `EXPANDED_ASSESSMENT_QUESTION_BANK`.

### High-Stakes Risk
If student quiz attempts or certification attempts reference a historical question, deleting that question orphans the student's attempt record (`answersJson`) and destroys academic audit history.

### Safe Archival Rules in `seed.ts`:
1. In `NODE_ENV === 'production'`, questions are **NEVER deleted**.
2. If any student quiz attempts exist in the database (`prisma.quizAttempt.count() > 0`), questions are **NEVER deleted**.
3. Questions are retained intact as historical records to preserve student score breakdowns, attempt reviews, and audit trails.
