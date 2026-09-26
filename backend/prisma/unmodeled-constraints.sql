-- ==============================================================================
-- NETVISION — UNMODELED DATABASE CONSTRAINTS & PARTIAL INDEXES SPECIFICATION
-- ==============================================================================
-- Purpose:
-- Prisma Schema Language (PSL) does NOT support:
-- 1. Table-level CHECK constraints (e.g. @@check)
-- 2. Partial Unique Indexes with predicate WHERE clauses (e.g. WHERE status = 'IN_PROGRESS')
--
-- This file serves as the canonical PostgreSQL reference for all schema integrity
-- rules enforced at the database engine level that cannot be modeled in schema.prisma.
--
-- WARNING:
-- Running 'prisma db push' or 'prisma db push --accept-data-loss' WILL drop these
-- partial indexes and may bypass or invalidate these integrity rules.
-- In production, ALWAYS deploy database changes strictly via:
--   pnpm --filter netvision-backend prisma:migrate:prod (npx prisma migrate deploy)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PARTIAL UNIQUE INDEXES (HIGH-STAKES EXAM CONCURRENCY CONTROL)
-- ------------------------------------------------------------------------------
-- Guarantees that at most ONE IN_PROGRESS exam attempt can exist simultaneously
-- for a given candidate and certification code.
-- Crucially, it allows unlimited historical completed, failed, or expired attempts
-- without violating uniqueness.
-- Migration Source: 20260910102552_add_active_exam_attempt_unique_idx

CREATE UNIQUE INDEX IF NOT EXISTS "exam_attempts_user_active_in_progress_unique_idx"
ON "exam_attempts" ("userId", "certificationCode")
WHERE "status" = 'IN_PROGRESS';

-- ------------------------------------------------------------------------------
-- 2. XOR OWNERSHIP CHECK CONSTRAINTS (MUTUAL EXCLUSIVITY OF OWNER IDENTITY)
-- ------------------------------------------------------------------------------
-- Ensures that every learner progress, session, attempt, or bookmark record is
-- owned by EITHER an authenticated User (userId) OR an Anonymous Learner (anonymousId),
-- but NEVER both and NEVER neither. This prevents data leakage and orphan state corruption.
-- Migration Source: 20260814000000_baseline

DO $$
BEGIN
  -- user_progress XOR check
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_progress_owner_xor'
  ) THEN
    ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_owner_xor"
    CHECK (("userId" IS NOT NULL AND "anonymousId" IS NULL) OR ("userId" IS NULL AND "anonymousId" IS NOT NULL));
  END IF;

  -- quiz_attempts XOR check
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'quiz_attempts_owner_xor'
  ) THEN
    ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_owner_xor"
    CHECK (("userId" IS NOT NULL AND "anonymousId" IS NULL) OR ("userId" IS NULL AND "anonymousId" IS NOT NULL));
  END IF;

  -- lab_attempts XOR check
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'lab_attempts_owner_xor'
  ) THEN
    ALTER TABLE "lab_attempts" ADD CONSTRAINT "lab_attempts_owner_xor"
    CHECK (("userId" IS NOT NULL AND "anonymousId" IS NULL) OR ("userId" IS NULL AND "anonymousId" IS NOT NULL));
  END IF;

  -- saved_lessons XOR check
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'saved_lessons_owner_xor'
  ) THEN
    ALTER TABLE "saved_lessons" ADD CONSTRAINT "saved_lessons_owner_xor"
    CHECK (("userId" IS NOT NULL AND "anonymousId" IS NULL) OR ("userId" IS NULL AND "anonymousId" IS NOT NULL));
  END IF;

  -- sandbox_sessions XOR check
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sandbox_sessions_owner_xor'
  ) THEN
    ALTER TABLE "sandbox_sessions" ADD CONSTRAINT "sandbox_sessions_owner_xor"
    CHECK (("userId" IS NOT NULL AND "anonymousId" IS NULL) OR ("userId" IS NULL AND "anonymousId" IS NOT NULL));
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 3. CERTIFICATE USER-CERTIFICATION COMPOUND UNIQUE INDEX
-- ------------------------------------------------------------------------------
-- Migration Source: 20260909000000_add_certificate_user_cert_unique

CREATE UNIQUE INDEX IF NOT EXISTS "certificates_userId_certificationCode_key"
ON "certificates" ("userId", "certificationCode");
