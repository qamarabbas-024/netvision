# NETVISION — Migration History Repair Audit

> **Status:** READ-ONLY AUDIT COMPLETE  
> **Target System:** PostgreSQL (Neon DB) / Prisma ORM  
> **Authoritative Schema:** [`backend/prisma/schema.prisma`](file:///c:/My%20works/2026%20Work/Netvision/backend/prisma/schema.prisma)  
> **Committed Migrations:** [`backend/prisma/migrations/`](file:///c:/My%20works/2026%20Work/Netvision/backend/prisma/migrations)

---

## 1. Root Cause

The committed Prisma migration history is currently **non-reproducible from an empty database**.

When deploying to a fresh PostgreSQL instance (such as Neon), running `npx prisma migrate deploy` fails on the second migration:

* **Failed Migration:** [`20260809213600_guest_first_architecture`](file:///c:/My%20works/2026%20Work/Netvision/backend/prisma/migrations/20260809213600_guest_first_architecture/migration.sql)
* **Observed Error:** `ERROR: relation "quiz_attempts" does not exist`

### Underlying Mechanics of Failure
1. **Initial Migration Incompleteness:** The initial migration [`20260807202932_initial_schema`](file:///c:/My%20works/2026%20Work/Netvision/backend/prisma/migrations/20260807202932_initial_schema/migration.sql) only created **11 of the 29 models** present in `schema.prisma`.
2. **Development Schema Drift (`db push`):** During subsequent development, feature models (`quiz_attempts`, `lab_attempts`, `saved_lessons`, `sandbox_sessions`, `lesson_labs`, `certification_definitions`, etc.) were added to `schema.prisma` and applied directly to local/dev databases using `prisma db push`. This bypassed Prisma's migration generator, leaving no SQL migration files recorded for 17 tables and 35+ columns.
3. **Flawed Migration Baseline:** On 2026-08-09, when `20260809213600_guest_first_architecture` was generated, the developer's local PostgreSQL database already contained all 29 tables created via `db push`. Prisma generated `ALTER TABLE` statements against tables (`quiz_attempts`, `lab_attempts`, `saved_lessons`, `sandbox_sessions`) that only existed in local environments, not in the committed migration history.
4. **Execution Breakage:** Any empty database executing migrations sequentially applies `20260807202932_initial_schema` (11 tables) and then immediately attempts to execute `20260809213600_guest_first_architecture`. The SQL engine crashes at line 14 because `quiz_attempts` was never created.

---

## 2. Migration Timeline

```
+---------------------------------------------------------------------------------------------------+
| 2026-08-07 20:29:32 UTC                                                                           |
| Migration 1: 20260807202932_initial_schema                                                        |
| Creates 3 Enums (Role, CourseLevel [partial], LessonType) & 11 Tables                             |
| (users, courses, modules, lessons, quizzes, quiz_questions, user_progress, certificates,          |
|  achievements, user_achievements, simulation_states)                                              |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| 2026-08-07 to 2026-08-09 (Uncommitted Schema Drift)                                               |
| Developers added 17 new models, 8 new enums, 35+ columns to schema.prisma                         |
| Applied directly to dev databases via `prisma db push` (NO MIGRATION FILES GENERATED)             |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| 2026-08-09 21:36:00 UTC                                                                           |
| Migration 2: 20260809213600_guest_first_architecture                                              |
| Creates anonymous_learners table.                                                                 |
| Attempts `ALTER TABLE` & FK creation on quiz_attempts, lab_attempts, saved_lessons,             |
| sandbox_sessions, user_progress.                                                                  |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| Fresh Database Deployment (Neon / Production)                                                     |
| Execution Order: Migration 1 -> Migration 2                                                       |
| FAILS AT MIGRATION 2 (Line 14): ERROR: relation "quiz_attempts" does not exist                     |
+---------------------------------------------------------------------------------------------------+
```

---

## 3. Current Schema Inventory

A comparison between [`schema.prisma`](file:///c:/My%20works/2026%20Work/Netvision/backend/prisma/schema.prisma) and committed migrations:

| Schema Category | `schema.prisma` (Authoritative) | Committed Migrations (1 & 2) | Audit Gap |
| :--- | :--- | :--- | :--- |
| **Enums** | 11 enums | 3 enums (1 partial) | **8 missing**, **1 incomplete** |
| **Models / Tables** | 29 models | 12 tables created | **17 missing tables** |
| **Columns** | ~175 columns across 29 tables | ~85 columns created | **35+ missing columns** on existing tables |
| **Primary Keys** | All tables use `id` PK | `user_achievements` has composite PK | **1 PK structural mismatch** |
| **Nullabilities** | `users.passwordHash` (Nullable)<br>`certificates.courseId` (Nullable) | `passwordHash` (NOT NULL)<br>`courseId` (NOT NULL) | **2 nullability mismatches** |

### Enum Inventory Details
1. `Role` — Fully matched (`STUDENT`, `TEACHER`, `ADMIN`)
2. `CourseLevel` — **Incomplete** in Migration 1 (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`). Missing in migrations: `FOUNDATIONAL`, `SECURITY`, `EXPERT`.
3. `LessonType` — Fully matched (`THEORY`, `ANIMATION`, `INTERACTIVE_SIMULATION`, `SANDBOX_LAB`, `QUIZ`)
4. `LabType` — **MISSING** (`GUIDED`, `ASSISTED`, `CHALLENGE`, `TROUBLESHOOTING_INCIDENT`)
5. `OperatingSystem` — **MISSING** (`WINDOWS`, `LINUX`, `MACOS`, `ALL`)
6. `SandboxStatus` — **MISSING** (`CREATED`, `STARTING`, `RUNNING`, `STOPPED`, `EXPIRED`, `FAILED`)
7. `CognitiveLevel` — **MISSING** (`RECALL`, `UNDERSTANDING`, `APPLICATION`, `TROUBLESHOOTING`, `EXPERT_REASONING`)
8. `QuestionType` — **MISSING** (`MULTIPLE_CHOICE`, `MULTIPLE_ANSWER`, `TRUE_FALSE`, `SCENARIO`, `TROUBLESHOOTING`, `COMMAND_INTERPRETATION`, `PACKET_ANALYSIS`, `CONFIGURATION_ANALYSIS`)
9. `ExamType` — **MISSING** (`THEORY`, `PRACTICAL`)
10. `ExamAttemptStatus` — **MISSING** (`READY`, `IN_PROGRESS`, `SUBMITTED`, `PASSED`, `FAILED`, `EXPIRED`, `CANCELLED`)
11. `AchievementCategory` — **MISSING** (`LEARNING`, `ASSESSMENT`, `PRACTICAL`, `SKILL`, `COMPLETION`, `MILESTONE`)

---

## 4. Missing Tables

The following **17 tables** exist in [`schema.prisma`](file:///c:/My%20works/2026%20Work/Netvision/backend/prisma/schema.prisma) but are **completely missing** from all committed migration files:

1. `lesson_objectives` (mapped from `model LessonObjective`)
2. `lesson_concepts` (mapped from `model LessonConcept`)
3. `lesson_examples` (mapped from `model LessonExample`)
4. `lesson_commands` (mapped from `model LessonCommand`)
5. `lesson_labs` (mapped from `model LessonLab`)
6. `lesson_mistakes` (mapped from `model LessonMistake`)
7. `lesson_recaps` (mapped from `model LessonRecap`)
8. `command_references` (mapped from `model CommandReference`)
9. `lab_attempts` (mapped from `model LabAttempt`) — *Target of failed ALTER in Migration 2*
10. `sandbox_sessions` (mapped from `model SandboxSession`) — *Target of failed ALTER in Migration 2*
11. `quiz_attempts` (mapped from `model QuizAttempt`) — *Target of failed ALTER in Migration 2*
12. `certification_definitions` (mapped from `model CertificationDefinition`)
13. `exam_attempts` (mapped from `model ExamAttempt`)
14. `email_verifications` (mapped from `model EmailVerification`)
15. `password_reset_tokens` (mapped from `model PasswordResetToken`)
16. `saved_lessons` (mapped from `model SavedLesson`) — *Target of failed ALTER in Migration 2*
17. `oauth_accounts` (mapped from `model OAuthAccount`)

---

## 5. Missing Columns

### A. Introduced in Migration 2 without preceding table/column
* `quiz_attempts.anonymousId` (Target table `quiz_attempts` missing)
* `lab_attempts.anonymousId` (Target table `lab_attempts` missing)
* `saved_lessons.anonymousId` (Target table `saved_lessons` missing)
* `sandbox_sessions.anonymousId` (Target table `sandbox_sessions` missing)

### B. Missing from existing tables (present in `schema.prisma`, omitted from Migration 1)

1. **`users`**
   * Missing column: `isVerified` (`BOOLEAN DEFAULT false`)
   * Nullability mismatch: `passwordHash` was created as `TEXT NOT NULL` in Migration 1, but is `String?` (Nullable) in `schema.prisma` (to support OAuth users).

2. **`courses`**
   * Missing columns:
     * `code` (`TEXT UNIQUE`)
     * `order` (`INTEGER DEFAULT 0`)
     * `category` (`TEXT DEFAULT 'Fundamentals'`)
     * `prerequisitesJson` (`JSONB`)

3. **`lessons`**
   * Missing columns:
     * `introduction` (`TEXT`)
     * `simpleExplanation` (`TEXT`)
     * `analogy` (`TEXT`)
     * `technicalExplanation` (`TEXT`)
     * `cheatsheetJson` (`JSONB`)
     * `visualizationType` (`TEXT`)
     * `masteryScoreRequired` (`INTEGER DEFAULT 80`)

4. **`quiz_questions`**
   * Missing columns:
     * `explanationsJson` (`JSONB`)
     * `cognitiveLevel` (`CognitiveLevel DEFAULT 'UNDERSTANDING'`)
     * `questionType` (`QuestionType DEFAULT 'MULTIPLE_CHOICE'`)
     * `concept` (`TEXT`)
     * `difficulty` (`CourseLevel DEFAULT 'BEGINNER'`)
     * `points` (`INTEGER DEFAULT 10`)

5. **`user_progress`**
   * Missing columns:
     * `started` (`BOOLEAN DEFAULT true`)
     * `viewed` (`BOOLEAN DEFAULT true`)
     * `practicalCompleted` (`BOOLEAN DEFAULT false`)
     * `quizAttemptsCount` (`INTEGER DEFAULT 0`)
     * `bestScore` (`INTEGER`)
     * `masteryScore` (`INTEGER`)
     * `weakConceptsJson` (`JSONB`)

6. **`certificates`**
   * Missing columns:
     * `credentialId` (`TEXT UNIQUE`)
     * `certificationCode` (`TEXT`)
     * `certificationTitle` (`TEXT`)
     * `recipientName` (`TEXT`)
     * `status` (`TEXT DEFAULT 'ACTIVE'`)
     * `verificationCode` (`TEXT UNIQUE`)
     * `metadataJson` (`JSONB`)
   * Nullability mismatch: `courseId` was created as `TEXT NOT NULL` in Migration 1, but is `String?` (Nullable) in `schema.prisma`.

7. **`achievements`**
   * Missing columns:
     * `category` (`AchievementCategory DEFAULT 'LEARNING'`)
     * `points` (`INTEGER DEFAULT 50`)
     * `isActive` (`BOOLEAN DEFAULT true`)
     * `criteriaJson` (`JSONB`)
     * `createdAt` (`TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP`)

8. **`user_achievements`**
   * Structural mismatch: Primary Key in Migration 1 is `PRIMARY KEY ("userId", "achievementId")`. In `schema.prisma`, `id` (`TEXT`) is Primary Key, and `userId` is Nullable (`String?`) to support anonymous learner achievements.
   * Missing columns: `id` (`TEXT NOT NULL`), `anonymousId` (`TEXT`).

---

## 6. Missing Indexes

The following indexes defined in `schema.prisma` or referenced in Migration 2 cannot be created because their target tables or columns do not exist in the migration sequence:

1. **Failed in Migration 2 (Missing Target Tables):**
   * `CREATE INDEX "quiz_attempts_anonymousId_idx" ON "quiz_attempts"("anonymousId")`
   * `CREATE INDEX "lab_attempts_anonymousId_idx" ON "lab_attempts"("anonymousId")`
   * `CREATE INDEX "saved_lessons_anonymousId_idx" ON "saved_lessons"("anonymousId")`
   * `CREATE INDEX "saved_lessons_anonymousId_lessonId_idx" ON "saved_lessons"("anonymousId", "lessonId")`
   * `CREATE INDEX "sandbox_sessions_anonymousId_idx" ON "sandbox_sessions"("anonymousId")`
   * `CREATE UNIQUE INDEX "saved_lessons_user_lesson_unique" ON "saved_lessons"("userId", "lessonId") WHERE "userId" IS NOT NULL`
   * `CREATE UNIQUE INDEX "saved_lessons_anon_lesson_unique" ON "saved_lessons"("anonymousId", "lessonId") WHERE "anonymousId" IS NOT NULL`

2. **Missing from Unmigrated Tables:**
   * `lesson_objectives_lessonId_idx`
   * `lesson_concepts_lessonId_idx`
   * `lesson_examples_lessonId_idx`
   * `lesson_commands_lessonId_idx`
   * `lesson_labs_lessonId_idx`
   * `lesson_labs_slug_key` (UNIQUE)
   * `lesson_mistakes_lessonId_idx`
   * `lesson_recaps_lessonId_idx`
   * `command_references_command_key` (UNIQUE)
   * `lab_attempts_userId_idx`
   * `lab_attempts_labId_idx`
   * `sandbox_sessions_userId_idx`
   * `sandbox_sessions_labId_idx`
   * `sandbox_sessions_status_idx`
   * `quiz_attempts_userId_idx`
   * `quiz_attempts_quizId_idx`
   * `certification_definitions_code_key` (UNIQUE)
   * `exam_attempts_userId_idx`
   * `exam_attempts_certificationCode_idx`
   * `exam_attempts_status_idx`
   * `user_achievements_anonymousId_idx`
   * `email_verifications_email_idx`
   * `password_reset_tokens_email_idx`
   * `saved_lessons_userId_lessonId_idx`
   * `saved_lessons_anonymousId_lessonId_idx`
   * `saved_lessons_userId_idx`
   * `oauth_accounts_provider_providerAccountId_key` (UNIQUE)
   * `oauth_accounts_userId_idx`

3. **Missing from Existing Tables (New Columns):**
   * `courses_code_key` (UNIQUE)
   * `certificates_credentialId_key` (UNIQUE)
   * `certificates_verificationCode_key` (UNIQUE)
   * `certificates_certificationCode_idx`

---

## 7. Missing Constraints

### Foreign Key Constraints Missing:
* `lesson_objectives` -> `lessons(id)` ON DELETE CASCADE
* `lesson_concepts` -> `lessons(id)` ON DELETE CASCADE
* `lesson_examples` -> `lessons(id)` ON DELETE CASCADE
* `lesson_commands` -> `lessons(id)` ON DELETE CASCADE
* `lesson_labs` -> `lessons(id)` ON DELETE CASCADE
* `lesson_mistakes` -> `lessons(id)` ON DELETE CASCADE
* `lesson_recaps` -> `lessons(id)` ON DELETE CASCADE
* `lab_attempts` -> `users(id)` ON DELETE CASCADE
* `lab_attempts` -> `lesson_labs(id)` ON DELETE CASCADE
* `sandbox_sessions` -> `users(id)` ON DELETE CASCADE
* `sandbox_sessions` -> `lesson_labs(id)` ON DELETE SET NULL
* `quiz_attempts` -> `users(id)` ON DELETE CASCADE
* `quiz_attempts` -> `quizzes(id)` ON DELETE CASCADE
* `exam_attempts` -> `users(id)` ON DELETE CASCADE
* `exam_attempts` -> `certification_definitions(code)` ON DELETE CASCADE
* `user_achievements` -> `anonymous_learners(id)` ON DELETE CASCADE
* `saved_lessons` -> `users(id)` ON DELETE CASCADE
* `saved_lessons` -> `lessons(id)` ON DELETE CASCADE
* `oauth_accounts` -> `users(id)` ON DELETE CASCADE

### Check Constraints Missing (Failed in Migration 2):
* `ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_owner_xor" CHECK (...)`
* `ALTER TABLE "lab_attempts" ADD CONSTRAINT "lab_attempts_owner_xor" CHECK (...)`
* `ALTER TABLE "saved_lessons" ADD CONSTRAINT "saved_lessons_owner_xor" CHECK (...)`
* `ALTER TABLE "sandbox_sessions" ADD CONSTRAINT "sandbox_sessions_owner_xor" CHECK (...)`

---

## 8. Migration Ordering Problems

```
Migration Sequence Problem:

1. 20260807202932_initial_schema
   └── Creates: users, courses, modules, lessons, quizzes, quiz_questions, user_progress, 
                certificates, achievements, user_achievements, simulation_states

2. [GAP: Missing Migration for 17 Tables & Schema Expansion]
   └── NEVER COMMITTED TO GIT

3. 20260809213600_guest_first_architecture
   ├── Creates: anonymous_learners
   ├── Alters: user_progress (Succeeds)
   ├── Alters: quiz_attempts (FAILS — Table does not exist)
   ├── Alters: lab_attempts (Never reached)
   ├── Alters: saved_lessons (Never reached)
   └── Alters: sandbox_sessions (Never reached)
```

`20260809213600_guest_first_architecture` assumes that the 4 core domain tables (`quiz_attempts`, `lab_attempts`, `saved_lessons`, `sandbox_sessions`) exist with a `userId NOT NULL` schema baseline, and proceeds to alter them to support nullable `userId` and `anonymousId`. Because these tables were never created in any migration preceding `20260809213600`, the chronological execution chain is broken.

---

## 9. Data Safety Impact

1. **Fresh / Neon PostgreSQL Databases:**
   * Risk: **Zero data loss risk**. No production data exists yet on fresh databases.
   * Execution behavior: `prisma migrate deploy` fails completely on step 2, leaving the database partially initialized (at step 1).

2. **Existing Local / Development Databases:**
   * Context: Local databases that were modified using `prisma db push` already contain all 29 tables.
   * Risk: If an intermediate migration is introduced without careful `IF NOT EXISTS` or standard Prisma DDL alignment, applying it against a `db push` database could conflict with pre-existing table structures.
   * Requirement: The repair strategy must establish a reproducible migration history for fresh instances while preserving compatibility.

---

## 10. Recommended Repair Strategy

### Options Evaluated:

* **Option A: Add a new intermediate migration BEFORE `20260809213600_guest_first_architecture` (RECOMMENDED)**
  * *Implementation:* Insert a new migration directory timestamped between Migration 1 and Migration 2, e.g.:
    `backend/prisma/migrations/20260808120000_schema_completion/migration.sql`
  * *Why this is the safest and cleanest approach:*
    1. **Preserves Committed History:** Does NOT alter already committed migration SQL files (`20260807202932` and `20260809213600` remain completely untouched).
    2. **Prisma Chronological Execution:** Prisma CLI executes migration directories sorted alphabetically/chronologically by timestamp folder name:
       1. `20260807202932_initial_schema` (Creates initial 11 tables)
       2. `20260808120000_schema_completion` (**NEW** — Creates missing 17 tables, missing enums, missing columns, fixes PKs & nullabilities)
       3. `20260809213600_guest_first_architecture` (Alters tables for guest support — now succeeds smoothly!)
    3. **100% Reproducible:** A clean database running `prisma migrate deploy` will execute all three migrations in sequence without error, arriving at the exact schema required by `schema.prisma`.

* **Option B: Add a new migration AFTER `20260809213600_guest_first_architecture` (REJECTED)**
  * *Why this fails:* A fresh database running `prisma migrate deploy` executes sequentially. It WILL CRASH at `20260809213600` line 14 before ever reaching any migration placed after it. Option B CANNOT fix a broken migration chain for fresh databases.

* **Option C: Baseline / Squash migrations into a single initial migration (REJECTED)**
  * *Why this is inferior:* Requires deleting or squashing existing migration history, breaking version control lineage and requiring `prisma migrate resolve` workarounds on environments that recorded prior migrations.

---

## 11. Exact Migration(s) Required

### Proposed Migration Specification

* **Migration Directory:** [`backend/prisma/migrations/20260808120000_schema_completion/`](file:///c:/My%20works/2026%20Work/Netvision/backend/prisma/migrations/)
* **Migration Name:** `20260808120000_schema_completion`
* **Dependencies:** Must execute AFTER `20260807202932_initial_schema` and BEFORE `20260809213600_guest_first_architecture`.

#### Summary of DDL Statements in `20260808120000_schema_completion`:

1. **Enum Additions & Modifications:**
   ```sql
   -- AlterEnum CourseLevel
   ALTER TYPE "CourseLevel" ADD VALUE 'FOUNDATIONAL';
   ALTER TYPE "CourseLevel" ADD VALUE 'SECURITY';
   ALTER TYPE "CourseLevel" ADD VALUE 'EXPERT';

   -- CreateEnum LabType
   CREATE TYPE "LabType" AS ENUM ('GUIDED', 'ASSISTED', 'CHALLENGE', 'TROUBLESHOOTING_INCIDENT');

   -- CreateEnum OperatingSystem
   CREATE TYPE "OperatingSystem" AS ENUM ('WINDOWS', 'LINUX', 'MACOS', 'ALL');

   -- CreateEnum SandboxStatus
   CREATE TYPE "SandboxStatus" AS ENUM ('CREATED', 'STARTING', 'RUNNING', 'STOPPED', 'EXPIRED', 'FAILED');

   -- CreateEnum CognitiveLevel
   CREATE TYPE "CognitiveLevel" AS ENUM ('RECALL', 'UNDERSTANDING', 'APPLICATION', 'TROUBLESHOOTING', 'EXPERT_REASONING');

   -- CreateEnum QuestionType
   CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'MULTIPLE_ANSWER', 'TRUE_FALSE', 'SCENARIO', 'TROUBLESHOOTING', 'COMMAND_INTERPRETATION', 'PACKET_ANALYSIS', 'CONFIGURATION_ANALYSIS');

   -- CreateEnum ExamType
   CREATE TYPE "ExamType" AS ENUM ('THEORY', 'PRACTICAL');

   -- CreateEnum ExamAttemptStatus
   CREATE TYPE "ExamAttemptStatus" AS ENUM ('READY', 'IN_PROGRESS', 'SUBMITTED', 'PASSED', 'FAILED', 'EXPIRED', 'CANCELLED');

   -- CreateEnum AchievementCategory
   CREATE TYPE "AchievementCategory" AS ENUM ('LEARNING', 'ASSESSMENT', 'PRACTICAL', 'SKILL', 'COMPLETION', 'MILESTONE');
   ```

2. **Column & Nullability Updates to Existing 11 Tables:**
   * `users`: `ADD COLUMN "isVerified" BOOLEAN NOT NULL DEFAULT false`, `ALTER COLUMN "passwordHash" DROP NOT NULL`.
   * `courses`: `ADD COLUMN "code" TEXT`, `ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0`, `ADD COLUMN "category" TEXT NOT NULL DEFAULT 'Fundamentals'`, `ADD COLUMN "prerequisitesJson" JSONB`, `CREATE UNIQUE INDEX "courses_code_key" ON "courses"("code")`.
   * `lessons`: `ADD COLUMN "introduction" TEXT`, `ADD COLUMN "simpleExplanation" TEXT`, `ADD COLUMN "analogy" TEXT`, `ADD COLUMN "technicalExplanation" TEXT`, `ADD COLUMN "cheatsheetJson" JSONB`, `ADD COLUMN "visualizationType" TEXT`, `ADD COLUMN "masteryScoreRequired" INTEGER NOT NULL DEFAULT 80`.
   * `quiz_questions`: `ADD COLUMN "explanationsJson" JSONB`, `ADD COLUMN "cognitiveLevel" "CognitiveLevel" NOT NULL DEFAULT 'UNDERSTANDING'`, `ADD COLUMN "questionType" "QuestionType" NOT NULL DEFAULT 'MULTIPLE_CHOICE'`, `ADD COLUMN "concept" TEXT`, `ADD COLUMN "difficulty" "CourseLevel" NOT NULL DEFAULT 'BEGINNER'`, `ADD COLUMN "points" INTEGER NOT NULL DEFAULT 10`.
   * `user_progress`: `ADD COLUMN "started" BOOLEAN NOT NULL DEFAULT true`, `ADD COLUMN "viewed" BOOLEAN NOT NULL DEFAULT true`, `ADD COLUMN "practicalCompleted" BOOLEAN NOT NULL DEFAULT false`, `ADD COLUMN "quizAttemptsCount" INTEGER NOT NULL DEFAULT 0`, `ADD COLUMN "bestScore" INTEGER`, `ADD COLUMN "masteryScore" INTEGER`, `ADD COLUMN "weakConceptsJson" JSONB`.
   * `certificates`: `ALTER COLUMN "courseId" DROP NOT NULL`, `ADD COLUMN "credentialId" TEXT`, `ADD COLUMN "certificationCode" TEXT`, `ADD COLUMN "certificationTitle" TEXT`, `ADD COLUMN "recipientName" TEXT`, `ADD COLUMN "status" TEXT NOT NULL DEFAULT 'ACTIVE'`, `ADD COLUMN "verificationCode" TEXT`, `ADD COLUMN "metadataJson" JSONB`, UNIQUE indexes on `credentialId` and `verificationCode`, INDEX on `certificationCode`.
   * `achievements`: `ADD COLUMN "category" "AchievementCategory" NOT NULL DEFAULT 'LEARNING'`, `ADD COLUMN "points" INTEGER NOT NULL DEFAULT 50`, `ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true`, `ADD COLUMN "criteriaJson" JSONB`, `ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`.
   * `user_achievements`: DROP primary key constraint `("userId", "achievementId")`, `ADD COLUMN "id" TEXT NOT NULL`, ADD PRIMARY KEY (`id`), `ALTER COLUMN "userId" DROP NOT NULL`, `ADD COLUMN "anonymousId" TEXT`, INDEX on `anonymousId`.

3. **Creation of 17 Missing Tables:**
   * `lesson_objectives`
   * `lesson_concepts`
   * `lesson_examples`
   * `lesson_commands`
   * `lesson_labs`
   * `lesson_mistakes`
   * `lesson_recaps`
   * `command_references`
   * `lab_attempts` (created initially with `userId TEXT NOT NULL` to match pre-guest baseline, ready for `20260809213600` to alter)
   * `sandbox_sessions` (created initially with `userId TEXT NOT NULL`)
   * `quiz_attempts` (created initially with `userId TEXT NOT NULL`)
   * `certification_definitions`
   * `exam_attempts`
   * `email_verifications`
   * `password_reset_tokens`
   * `saved_lessons` (created initially with `userId TEXT NOT NULL`)
   * `oauth_accounts`

4. **Foreign Key & Index Construction:**
   * Complete foreign keys connecting `lesson_labs`, `quiz_attempts`, `lab_attempts`, `sandbox_sessions`, `saved_lessons`, `exam_attempts`, `oauth_accounts` to their parent tables.

5. **Expected Resulting Schema:**
   After applying:
   1. `20260807202932_initial_schema`
   2. `20260808120000_schema_completion`
   3. `20260809213600_guest_first_architecture`

   The database schema will **100% reflect [`backend/prisma/schema.prisma`](file:///c:/My%20works/2026%20Work/Netvision/backend/prisma/schema.prisma)** with 29 tables, 11 enums, complete indexes, XOR guest ownership constraints, and full reproducible migration integrity.

---

> **Audit Status:** Complete.  
> **Action Taken:** Read-only analysis. No database modifications, no migration runs, and no code edits have been performed.
