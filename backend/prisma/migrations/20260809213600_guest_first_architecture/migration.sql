-- CreateTable AnonymousLearners
CREATE TABLE "anonymous_learners" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anonymous_learners_pkey" PRIMARY KEY ("id")
);

-- AlterTable user_progress
ALTER TABLE "user_progress" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "user_progress" ADD COLUMN "anonymousId" TEXT;

-- AlterTable quiz_attempts
ALTER TABLE "quiz_attempts" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "quiz_attempts" ADD COLUMN "anonymousId" TEXT;

-- AlterTable lab_attempts
ALTER TABLE "lab_attempts" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "lab_attempts" ADD COLUMN "anonymousId" TEXT;

-- AlterTable saved_lessons
ALTER TABLE "saved_lessons" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "saved_lessons" ADD COLUMN "anonymousId" TEXT;

-- AlterTable sandbox_sessions
ALTER TABLE "sandbox_sessions" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "sandbox_sessions" ADD COLUMN "anonymousId" TEXT;

-- Add Foreign Keys
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_anonymousId_fkey" FOREIGN KEY ("anonymousId") REFERENCES "anonymous_learners"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_anonymousId_fkey" FOREIGN KEY ("anonymousId") REFERENCES "anonymous_learners"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "lab_attempts" ADD CONSTRAINT "lab_attempts_anonymousId_fkey" FOREIGN KEY ("anonymousId") REFERENCES "anonymous_learners"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "saved_lessons" ADD CONSTRAINT "saved_lessons_anonymousId_fkey" FOREIGN KEY ("anonymousId") REFERENCES "anonymous_learners"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sandbox_sessions" ADD CONSTRAINT "sandbox_sessions_anonymousId_fkey" FOREIGN KEY ("anonymousId") REFERENCES "anonymous_learners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add Indexes
CREATE INDEX "user_progress_anonymousId_idx" ON "user_progress"("anonymousId");
CREATE INDEX "user_progress_anonymousId_lessonId_idx" ON "user_progress"("anonymousId", "lessonId");

CREATE INDEX "quiz_attempts_anonymousId_idx" ON "quiz_attempts"("anonymousId");
CREATE INDEX "lab_attempts_anonymousId_idx" ON "lab_attempts"("anonymousId");

CREATE INDEX "saved_lessons_anonymousId_idx" ON "saved_lessons"("anonymousId");
CREATE INDEX "saved_lessons_anonymousId_lessonId_idx" ON "saved_lessons"("anonymousId", "lessonId");

CREATE INDEX "sandbox_sessions_anonymousId_idx" ON "sandbox_sessions"("anonymousId");

-- Add Conditional Unique Constraints
CREATE UNIQUE INDEX "user_progress_user_lesson_unique" ON "user_progress"("userId", "lessonId") WHERE "userId" IS NOT NULL;
CREATE UNIQUE INDEX "user_progress_anon_lesson_unique" ON "user_progress"("anonymousId", "lessonId") WHERE "anonymousId" IS NOT NULL;

CREATE UNIQUE INDEX "saved_lessons_user_lesson_unique" ON "saved_lessons"("userId", "lessonId") WHERE "userId" IS NOT NULL;
CREATE UNIQUE INDEX "saved_lessons_anon_lesson_unique" ON "saved_lessons"("anonymousId", "lessonId") WHERE "anonymousId" IS NOT NULL;

-- Add XOR Ownership Constraints
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_owner_xor" CHECK (("userId" IS NOT NULL AND "anonymousId" IS NULL) OR ("userId" IS NULL AND "anonymousId" IS NOT NULL));
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_owner_xor" CHECK (("userId" IS NOT NULL AND "anonymousId" IS NULL) OR ("userId" IS NULL AND "anonymousId" IS NOT NULL));
ALTER TABLE "lab_attempts" ADD CONSTRAINT "lab_attempts_owner_xor" CHECK (("userId" IS NOT NULL AND "anonymousId" IS NULL) OR ("userId" IS NULL AND "anonymousId" IS NOT NULL));
ALTER TABLE "saved_lessons" ADD CONSTRAINT "saved_lessons_owner_xor" CHECK (("userId" IS NOT NULL AND "anonymousId" IS NULL) OR ("userId" IS NULL AND "anonymousId" IS NOT NULL));
ALTER TABLE "sandbox_sessions" ADD CONSTRAINT "sandbox_sessions_owner_xor" CHECK (("userId" IS NOT NULL AND "anonymousId" IS NULL) OR ("userId" IS NULL AND "anonymousId" IS NOT NULL));
