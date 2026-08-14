-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');

-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('FOUNDATIONAL', 'BEGINNER', 'INTERMEDIATE', 'SECURITY', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('THEORY', 'ANIMATION', 'INTERACTIVE_SIMULATION', 'SANDBOX_LAB', 'QUIZ');

-- CreateEnum
CREATE TYPE "LabType" AS ENUM ('GUIDED', 'ASSISTED', 'CHALLENGE', 'TROUBLESHOOTING_INCIDENT');

-- CreateEnum
CREATE TYPE "OperatingSystem" AS ENUM ('WINDOWS', 'LINUX', 'MACOS', 'ALL');

-- CreateEnum
CREATE TYPE "SandboxStatus" AS ENUM ('CREATED', 'STARTING', 'RUNNING', 'STOPPED', 'EXPIRED', 'FAILED');

-- CreateEnum
CREATE TYPE "CognitiveLevel" AS ENUM ('RECALL', 'UNDERSTANDING', 'APPLICATION', 'TROUBLESHOOTING', 'EXPERT_REASONING');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'MULTIPLE_ANSWER', 'TRUE_FALSE', 'SCENARIO', 'TROUBLESHOOTING', 'COMMAND_INTERPRETATION', 'PACKET_ANALYSIS', 'CONFIGURATION_ANALYSIS');

-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('THEORY', 'PRACTICAL');

-- CreateEnum
CREATE TYPE "ExamAttemptStatus" AS ENUM ('READY', 'IN_PROGRESS', 'SUBMITTED', 'PASSED', 'FAILED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AchievementCategory" AS ENUM ('LEARNING', 'ASSESSMENT', 'PRACTICAL', 'SKILL', 'COMPLETION', 'MILESTONE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT,
    "fullName" TEXT,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "avatarUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "code" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Fundamentals',
    "description" TEXT NOT NULL,
    "level" "CourseLevel" NOT NULL DEFAULT 'BEGINNER',
    "icon" TEXT NOT NULL,
    "estimatedHours" INTEGER NOT NULL DEFAULT 5,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "prerequisitesJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modules" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "LessonType" NOT NULL DEFAULT 'THEORY',
    "durationMinutes" INTEGER NOT NULL DEFAULT 15,
    "order" INTEGER NOT NULL,
    "contentJson" JSONB,
    "introduction" TEXT,
    "simpleExplanation" TEXT,
    "analogy" TEXT,
    "technicalExplanation" TEXT,
    "cheatsheetJson" JSONB,
    "visualizationType" TEXT,
    "masteryScoreRequired" INTEGER NOT NULL DEFAULT 80,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_objectives" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "lesson_objectives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_concepts" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "explanation" TEXT,
    "technicalDetails" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "lesson_concepts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_examples" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "scenario" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "lesson_examples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_commands" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "command" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "exampleOutput" TEXT,
    "category" TEXT DEFAULT 'General',
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "lesson_commands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_labs" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "slug" TEXT,
    "type" "LabType" NOT NULL DEFAULT 'GUIDED',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "difficulty" "CourseLevel" NOT NULL DEFAULT 'BEGINNER',
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 15,
    "objectivesJson" JSONB,
    "prerequisitesJson" JSONB,
    "environmentJson" JSONB,
    "instructions" TEXT NOT NULL,
    "commandsJson" JSONB,
    "expectedObservationsJson" JSONB,
    "hintsJson" JSONB,
    "validationRulesJson" JSONB,
    "solutionJson" JSONB,
    "commonMistakesJson" JSONB,
    "completionCriteria" TEXT,
    "initialTopologyJson" JSONB,
    "targetStateJson" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "lesson_labs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_mistakes" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "mistake" TEXT NOT NULL,
    "whyWrong" TEXT NOT NULL,
    "correctApproach" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "lesson_mistakes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_recaps" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "point" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "lesson_recaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "command_references" (
    "id" TEXT NOT NULL,
    "command" TEXT NOT NULL,
    "operatingSystem" "OperatingSystem" NOT NULL DEFAULT 'ALL',
    "category" TEXT NOT NULL DEFAULT 'Network information',
    "purpose" TEXT NOT NULL,
    "syntax" TEXT NOT NULL,
    "example" TEXT NOT NULL,
    "expectedOutput" TEXT,
    "explanation" TEXT NOT NULL,
    "warnings" TEXT,
    "relatedLessonSlugs" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "command_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anonymous_learners" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anonymous_learners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lab_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "anonymousId" TEXT,
    "labId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "commandHistoryJson" JSONB,
    "validationResultJson" JSONB,
    "hintsUsedCount" INTEGER NOT NULL DEFAULT 0,
    "attemptsCount" INTEGER NOT NULL DEFAULT 1,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "userSolutionJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lab_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sandbox_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "anonymousId" TEXT,
    "labId" TEXT,
    "status" "SandboxStatus" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "providerType" TEXT NOT NULL DEFAULT 'SIMULATED',
    "resourceLimitsJson" JSONB,
    "networkStateJson" JSONB,
    "historyJson" JSONB,

    CONSTRAINT "sandbox_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "passingScore" INTEGER NOT NULL DEFAULT 80,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_questions" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "optionsJson" JSONB NOT NULL,
    "correctOption" INTEGER NOT NULL,
    "explanation" TEXT,
    "explanationsJson" JSONB,
    "cognitiveLevel" "CognitiveLevel" NOT NULL DEFAULT 'UNDERSTANDING',
    "questionType" "QuestionType" NOT NULL DEFAULT 'MULTIPLE_CHOICE',
    "concept" TEXT,
    "difficulty" "CourseLevel" NOT NULL DEFAULT 'BEGINNER',
    "points" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "anonymousId" TEXT,
    "quizId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "answersJson" JSONB NOT NULL,
    "weakConceptsJson" JSONB,
    "attemptNumber" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "anonymousId" TEXT,
    "lessonId" TEXT NOT NULL,
    "started" BOOLEAN NOT NULL DEFAULT true,
    "viewed" BOOLEAN NOT NULL DEFAULT true,
    "practicalCompleted" BOOLEAN NOT NULL DEFAULT false,
    "quizAttemptsCount" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER,
    "bestScore" INTEGER,
    "masteryScore" INTEGER,
    "weakConceptsJson" JSONB,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "user_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT,
    "code" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "credentialId" TEXT,
    "certificationCode" TEXT,
    "certificationTitle" TEXT,
    "recipientName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "verificationCode" TEXT,
    "metadataJson" JSONB,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certification_definitions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "level" "CourseLevel" NOT NULL DEFAULT 'BEGINNER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "requirementsJson" JSONB,
    "policyJson" JSONB,
    "theoryConfigJson" JSONB,
    "practicalConfigJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certification_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "certificationCode" TEXT NOT NULL,
    "type" "ExamType" NOT NULL,
    "status" "ExamAttemptStatus" NOT NULL DEFAULT 'READY',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "attemptNumber" INTEGER NOT NULL DEFAULT 1,
    "score" DOUBLE PRECISION,
    "passed" BOOLEAN,
    "configSnapshotJson" JSONB,
    "resultMetadataJson" JSONB,
    "auditMetadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "badgeIcon" TEXT NOT NULL,
    "category" "AchievementCategory" NOT NULL DEFAULT 'LEARNING',
    "points" INTEGER NOT NULL DEFAULT 50,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "criteriaJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_achievements" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "anonymousId" TEXT,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulation_states" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "topologyJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "simulation_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_verifications" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_lessons" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "anonymousId" TEXT,
    "lessonId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "providerEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oauth_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "courses_code_key" ON "courses"("code");

-- CreateIndex
CREATE INDEX "modules_courseId_idx" ON "modules"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_slug_key" ON "lessons"("slug");

-- CreateIndex
CREATE INDEX "lessons_moduleId_idx" ON "lessons"("moduleId");

-- CreateIndex
CREATE INDEX "lesson_objectives_lessonId_idx" ON "lesson_objectives"("lessonId");

-- CreateIndex
CREATE INDEX "lesson_concepts_lessonId_idx" ON "lesson_concepts"("lessonId");

-- CreateIndex
CREATE INDEX "lesson_examples_lessonId_idx" ON "lesson_examples"("lessonId");

-- CreateIndex
CREATE INDEX "lesson_commands_lessonId_idx" ON "lesson_commands"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_labs_slug_key" ON "lesson_labs"("slug");

-- CreateIndex
CREATE INDEX "lesson_labs_lessonId_idx" ON "lesson_labs"("lessonId");

-- CreateIndex
CREATE INDEX "lesson_mistakes_lessonId_idx" ON "lesson_mistakes"("lessonId");

-- CreateIndex
CREATE INDEX "lesson_recaps_lessonId_idx" ON "lesson_recaps"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "command_references_command_key" ON "command_references"("command");

-- CreateIndex
CREATE INDEX "lab_attempts_userId_idx" ON "lab_attempts"("userId");

-- CreateIndex
CREATE INDEX "lab_attempts_anonymousId_idx" ON "lab_attempts"("anonymousId");

-- CreateIndex
CREATE INDEX "lab_attempts_labId_idx" ON "lab_attempts"("labId");

-- CreateIndex
CREATE INDEX "sandbox_sessions_userId_idx" ON "sandbox_sessions"("userId");

-- CreateIndex
CREATE INDEX "sandbox_sessions_anonymousId_idx" ON "sandbox_sessions"("anonymousId");

-- CreateIndex
CREATE INDEX "sandbox_sessions_labId_idx" ON "sandbox_sessions"("labId");

-- CreateIndex
CREATE INDEX "sandbox_sessions_status_idx" ON "sandbox_sessions"("status");

-- CreateIndex
CREATE INDEX "quizzes_lessonId_idx" ON "quizzes"("lessonId");

-- CreateIndex
CREATE INDEX "quiz_questions_quizId_idx" ON "quiz_questions"("quizId");

-- CreateIndex
CREATE INDEX "quiz_attempts_userId_idx" ON "quiz_attempts"("userId");

-- CreateIndex
CREATE INDEX "quiz_attempts_anonymousId_idx" ON "quiz_attempts"("anonymousId");

-- CreateIndex
CREATE INDEX "quiz_attempts_quizId_idx" ON "quiz_attempts"("quizId");

-- CreateIndex
CREATE INDEX "user_progress_userId_lessonId_idx" ON "user_progress"("userId", "lessonId");

-- CreateIndex
CREATE INDEX "user_progress_anonymousId_lessonId_idx" ON "user_progress"("anonymousId", "lessonId");

-- CreateIndex
CREATE INDEX "user_progress_userId_idx" ON "user_progress"("userId");

-- CreateIndex
CREATE INDEX "user_progress_anonymousId_idx" ON "user_progress"("anonymousId");

-- CreateIndex
CREATE INDEX "user_progress_lessonId_idx" ON "user_progress"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_code_key" ON "certificates"("code");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_credentialId_key" ON "certificates"("credentialId");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_verificationCode_key" ON "certificates"("verificationCode");

-- CreateIndex
CREATE INDEX "certificates_userId_idx" ON "certificates"("userId");

-- CreateIndex
CREATE INDEX "certificates_courseId_idx" ON "certificates"("courseId");

-- CreateIndex
CREATE INDEX "certificates_certificationCode_idx" ON "certificates"("certificationCode");

-- CreateIndex
CREATE UNIQUE INDEX "certification_definitions_code_key" ON "certification_definitions"("code");

-- CreateIndex
CREATE INDEX "exam_attempts_userId_idx" ON "exam_attempts"("userId");

-- CreateIndex
CREATE INDEX "exam_attempts_certificationCode_idx" ON "exam_attempts"("certificationCode");

-- CreateIndex
CREATE INDEX "exam_attempts_status_idx" ON "exam_attempts"("status");

-- CreateIndex
CREATE UNIQUE INDEX "achievements_slug_key" ON "achievements"("slug");

-- CreateIndex
CREATE INDEX "user_achievements_userId_idx" ON "user_achievements"("userId");

-- CreateIndex
CREATE INDEX "user_achievements_anonymousId_idx" ON "user_achievements"("anonymousId");

-- CreateIndex
CREATE INDEX "user_achievements_achievementId_idx" ON "user_achievements"("achievementId");

-- CreateIndex
CREATE INDEX "simulation_states_userId_idx" ON "simulation_states"("userId");

-- CreateIndex
CREATE INDEX "email_verifications_email_idx" ON "email_verifications"("email");

-- CreateIndex
CREATE INDEX "password_reset_tokens_email_idx" ON "password_reset_tokens"("email");

-- CreateIndex
CREATE INDEX "saved_lessons_userId_lessonId_idx" ON "saved_lessons"("userId", "lessonId");

-- CreateIndex
CREATE INDEX "saved_lessons_anonymousId_lessonId_idx" ON "saved_lessons"("anonymousId", "lessonId");

-- CreateIndex
CREATE INDEX "saved_lessons_userId_idx" ON "saved_lessons"("userId");

-- CreateIndex
CREATE INDEX "saved_lessons_anonymousId_idx" ON "saved_lessons"("anonymousId");

-- CreateIndex
CREATE INDEX "oauth_accounts_userId_idx" ON "oauth_accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_accounts_provider_providerAccountId_key" ON "oauth_accounts"("provider", "providerAccountId");

-- Add Conditional Unique Constraints
CREATE UNIQUE INDEX "user_progress_user_lesson_unique" ON "user_progress"("userId", "lessonId") WHERE "userId" IS NOT NULL;
CREATE UNIQUE INDEX "user_progress_anon_lesson_unique" ON "user_progress"("anonymousId", "lessonId") WHERE "anonymousId" IS NOT NULL;

CREATE UNIQUE INDEX "saved_lessons_user_lesson_unique" ON "saved_lessons"("userId", "lessonId") WHERE "userId" IS NOT NULL;
CREATE UNIQUE INDEX "saved_lessons_anon_lesson_unique" ON "saved_lessons"("anonymousId", "lessonId") WHERE "anonymousId" IS NOT NULL;

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_objectives" ADD CONSTRAINT "lesson_objectives_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_concepts" ADD CONSTRAINT "lesson_concepts_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_examples" ADD CONSTRAINT "lesson_examples_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_commands" ADD CONSTRAINT "lesson_commands_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_labs" ADD CONSTRAINT "lesson_labs_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_mistakes" ADD CONSTRAINT "lesson_mistakes_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_recaps" ADD CONSTRAINT "lesson_recaps_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_attempts" ADD CONSTRAINT "lab_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_attempts" ADD CONSTRAINT "lab_attempts_anonymousId_fkey" FOREIGN KEY ("anonymousId") REFERENCES "anonymous_learners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_attempts" ADD CONSTRAINT "lab_attempts_labId_fkey" FOREIGN KEY ("labId") REFERENCES "lesson_labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sandbox_sessions" ADD CONSTRAINT "sandbox_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sandbox_sessions" ADD CONSTRAINT "sandbox_sessions_anonymousId_fkey" FOREIGN KEY ("anonymousId") REFERENCES "anonymous_learners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sandbox_sessions" ADD CONSTRAINT "sandbox_sessions_labId_fkey" FOREIGN KEY ("labId") REFERENCES "lesson_labs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_anonymousId_fkey" FOREIGN KEY ("anonymousId") REFERENCES "anonymous_learners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_anonymousId_fkey" FOREIGN KEY ("anonymousId") REFERENCES "anonymous_learners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_certificationCode_fkey" FOREIGN KEY ("certificationCode") REFERENCES "certification_definitions"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_anonymousId_fkey" FOREIGN KEY ("anonymousId") REFERENCES "anonymous_learners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "achievements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulation_states" ADD CONSTRAINT "simulation_states_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_lessons" ADD CONSTRAINT "saved_lessons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_lessons" ADD CONSTRAINT "saved_lessons_anonymousId_fkey" FOREIGN KEY ("anonymousId") REFERENCES "anonymous_learners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_lessons" ADD CONSTRAINT "saved_lessons_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_accounts" ADD CONSTRAINT "oauth_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add XOR Ownership Constraints
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_owner_xor" CHECK (("userId" IS NOT NULL AND "anonymousId" IS NULL) OR ("userId" IS NULL AND "anonymousId" IS NOT NULL));
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_owner_xor" CHECK (("userId" IS NOT NULL AND "anonymousId" IS NULL) OR ("userId" IS NULL AND "anonymousId" IS NOT NULL));
ALTER TABLE "lab_attempts" ADD CONSTRAINT "lab_attempts_owner_xor" CHECK (("userId" IS NOT NULL AND "anonymousId" IS NULL) OR ("userId" IS NULL AND "anonymousId" IS NOT NULL));
ALTER TABLE "saved_lessons" ADD CONSTRAINT "saved_lessons_owner_xor" CHECK (("userId" IS NOT NULL AND "anonymousId" IS NULL) OR ("userId" IS NULL AND "anonymousId" IS NOT NULL));
ALTER TABLE "sandbox_sessions" ADD CONSTRAINT "sandbox_sessions_owner_xor" CHECK (("userId" IS NOT NULL AND "anonymousId" IS NULL) OR ("userId" IS NULL AND "anonymousId" IS NOT NULL));
