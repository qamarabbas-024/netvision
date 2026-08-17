# NetVision Repository Technical Debt & Cleanup Audit

**Audit Date:** August 2026  
**Audited Architecture:** Curriculum Content Architecture V2 & Full Monorepo  
**Audit Scope:** Dead Code, Duplication, Curriculum Debt, V2 Migration, Dependencies, Test Infrastructure, Database / Prisma, Development Cruft, and Documentation.

---

## Executive Summary

NetVision has established the core foundations of Curriculum Content Architecture V2 (16 Progressive Target Courses, 8-stage interactive lesson UX, and unified database structures). However, the repository carries significant technical debt from rapid iterative development phases:

1. **Architecture Dual-State:** 9 of 30 benchmark lessons are fully upgraded to `contentV2`, while 21 lessons remain in the legacy `stepMetadata` schema. A 60-line backend adapter and a 100-line frontend adapter bridge the two formats, while 7 legacy Prisma relational models (`LessonObjective`, `LessonConcept`, `LessonExample`, `LessonCommand`, `LessonMistake`, `LessonRecap`, `SimulationState`) remain defined and queried despite containing 0 rows.
2. **Monorepo Package Decoupling:** Three workspace packages (`@netvision/shared`, `@netvision/simulation-engine`, `@netvision/ui`) exist in `packages/`, but `frontend` imports zero code from them. Compiled `.js` and `.d.ts` files are committed directly inside package `src/` trees.
3. **Orphaned Routes & Hardcoded Blocks:** An obsolete hardcoded route (`frontend/app/courses/tcp-ip-protocol-suite/lessons/tcp-three-way-handshake/page.tsx`) uses a deprecated block-based `LessonEngineContainer` and 6 legacy block components.
4. **Scattered Test Scripts:** 44 ad-hoc `.ts` test scripts reside in `backend/scripts/` and `backend/` root, bypassing standard Jest test runners and polluting the database with ephemeral records.
5. **Silent Fallback Anti-Pattern:** `frontend/lib/api.ts` contains 440 lines of static fallback data (`FALLBACK_TOPICS`) and catch blocks that silently swallow API errors and render fake legacy data in production.

---

## Technical Debt Findings

| Category | Finding | Location | Severity | Evidence | Recommendation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Dead Code** | Hardcoded legacy TCP lesson route bypassing dynamic routing | `frontend/app/courses/tcp-ip-protocol-suite/lessons/tcp-three-way-handshake/page.tsx` | **P1** | Hardcodes static `LessonSchema` with `blocks: [...]` and renders `LessonEngineContainer`. | Delete this route. Dynamic route `app/courses/[slug]/lessons/[lessonSlug]/page.tsx` handles all lessons via API. |
| **Dead Code** | Obsolete `LessonEngineContainer` and 6 block components | `frontend/components/learning/LessonEngineContainer.tsx`, `frontend/components/learning/blocks/IntroductionBlockComponent.tsx`, `ObjectivesBlockComponent.tsx`, `QuizBlockComponent.tsx`, `SimulationBlockComponent.tsx`, `SummaryBlockComponent.tsx`, `TheoryBlockComponent.tsx` | **P2** | Only referenced by the dead hardcoded TCP page. `LessonViewer.tsx` and `LessonContentRenderer.tsx` are the active V2 viewers. | Delete `LessonEngineContainer.tsx` and the 6 legacy block components once the hardcoded route is removed. |
| **Dead Code** | Unused `CodeBlock` and `AiTutorWidget` components | `frontend/components/learning/blocks/CodeBlock.tsx`, `frontend/components/ai/AiTutorWidget.tsx` | **P2** | `grep` scan shows 0 imports across the entire frontend application. | Remove unused components or integrate if planned for future releases. |
| **Dead Code** | Unused `BENCHMARK_LESSONS_METADATA` export | `backend/src/topics/curriculum-migration.ts#L270-L326` | **P2** | Exported array of 3 benchmark lessons with `stepMetadataJson` has 0 imports in the repository. `seed.ts` uses `BENCHMARK_LESSONS_FULL`. | Remove `BENCHMARK_LESSONS_METADATA` from `curriculum-migration.ts`. |
| **Dead Code** | 18 Unused client API exports in `api.ts` | `frontend/lib/api.ts` | **P2** | Functions like `toggleSaveLessonApi`, `getSavedLessonsApi`, `getLabDetailsApi`, `createSandboxSessionApi`, `claimCertificateApi` are exported but never imported. | Clean up dead API export wrappers and align with active UI service calls. |
| **Dead Code** | Committed build artifacts in package source trees | `packages/shared/src/*.d.ts`, `packages/shared/src/*.js`, `packages/simulation-engine/src/**/*.d.ts`, `packages/simulation-engine/src/**/*.js`, `packages/ui/src/*.d.ts`, `packages/ui/src/*.js` | **P2** | Compiled `.js` and `.d.ts` files are checked directly into Git inside `src/`. | Add build artifacts to `.gitignore` and delete them from `src/`. |
| **Dead Code** | Root-level backend test scripts | `backend/test-oauth-full-suite.ts`, `backend/test-otp-full-suite.ts`, `backend/test-otp.ts` | **P3** | Standalone test files placed in `backend/` root instead of `backend/scripts/` or `test/`. | Delete or consolidate into Jest test suites in `backend/test/`. |
| **Duplication** | Duplicate lesson content definition for TCP Handshake | `frontend/.../tcp-three-way-handshake/page.tsx` vs `backend/src/topics/lessons-net203-204.ts` | **P1** | TCP Handshake is authored both as hardcoded React component state and in backend database seed. | Remove frontend hardcoded copy; canonical source is `backend/src/topics/lessons-net203-204.ts`. |
| **Duplication** | Duplicate curriculum catalogs (Legacy 22 vs Target 16) | `frontend/lib/api.ts#L49-L488` (`FALLBACK_TOPICS`), `backend/prisma/seed.ts` (`legacyTopics`), `backend/src/topics/curriculum-migration.ts` (`TARGET_16_COURSES`) | **P1** | 440 lines of static `FALLBACK_TOPICS` in `frontend/lib/api.ts` mirror legacy database seed structures. | Delete `FALLBACK_TOPICS` from frontend. Canonical curriculum is `TARGET_16_COURSES` and database records. |
| **Duplication** | Duplicated utility functions across workspace packages | `packages/ui/src/utils.ts` (`cn`, `clsx`, `twMerge`) vs `frontend/lib/utils.ts` (`cn`, `clsx`, `twMerge`) | **P2** | Identical `cn` class merger functions implemented in two locations. | Consolidate utility into `frontend/lib/utils.ts` (or `@netvision/ui` if consumed). |
| **Duplication** | Duplicate OTP and OAuth security test scripts | `backend/test-otp.ts`, `backend/test-otp-full-suite.ts`, `backend/scripts/test-email-suite.ts`, `backend/scripts/test-oauth-otp-security.ts`, `backend/test-oauth-full-suite.ts` | **P2** | 5 distinct scripts test identical auth endpoints with overlapping assertions. | Consolidate into unified Jest integration tests. |
| **Curriculum Debt** | 21 Benchmark lessons still using legacy `stepMetadata` | `backend/src/topics/lessons-net100.ts` (5), `lessons-net200.ts` (6), `lessons-net203-204.ts` (7), `lessons-net300-400.ts` (3) | **P1** | 21 of 30 benchmark lessons use flat dictionary `stepMetadata` (`step1_objective`, `step4_definition`, `step10_workedExample`) instead of structured `contentV2`. | Migrate remaining 21 lessons to structured `contentV2` format. |
| **Curriculum Debt** | 35 Shell lessons seeded with placeholder content | `backend/prisma/seed.ts#L208-L378` (`level0Lessons`, `legacyTopics`) | **P2** | Seeds 35 lessons with generic descriptions and empty labs (`initialTopologyJson: {}`) for legacy backward compatibility. | Replace placeholder shells with authoritative 16-course module lessons. |
| **Curriculum Debt** | Dual Normalization Adapter overhead | `backend/src/topics/topics.service.ts#L198-L250`, `frontend/components/learning/LessonContentRenderer.tsx#L104-L210` | **P1** | 60 lines in backend and 100 lines in frontend map legacy `stepX_*` keys to V2 properties on every render/query. | Eliminate adapters once all 21 lessons are migrated to `contentV2`. |
| **V2 Migration** | Legacy relational tables queried on every lesson fetch | `backend/src/topics/topics.service.ts#L148-L154` querying `LessonObjective`, `LessonConcept`, `LessonExample`, `LessonCommand`, `LessonLab`, `LessonMistake`, `LessonRecap` | **P1** | `getLessonBySlug` executes 7 relational `include` queries per request, returning empty arrays because content is stored in `contentJson`. | Remove 6 dead relational includes from `getLessonBySlug` query. |
| **V2 Migration** | Legacy course codes (`LEGACY-0` to `LEGACY-21`) in Course table | `backend/prisma/seed.ts#L185,L312` | **P2** | Database contains 22 legacy course records with `LEGACY-*` codes alongside canonical `NET-101` to `NET-404`. | Deprecate legacy course records and redirect legacy slugs to target courses. |
| **Dependencies** | Frontend package.json lists 3 workspace packages with 0 imports | `frontend/package.json#L13-L15` (`@netvision/shared`, `@netvision/simulation-engine`, `@netvision/ui`) | **P1** | Frontend contains 0 imports from `@netvision/*`. All components and types are implemented locally in `frontend/`. | Either consume the packages or remove them from dependencies and build pipelines. |
| **Dependencies** | Unused third-party dependencies in frontend | `frontend/package.json` (`@tanstack/react-query`, `@xyflow/react`) | **P2** | `@tanstack/react-query` and `@xyflow/react` are declared in `dependencies` but never imported anywhere in frontend code. | Remove unused packages from `frontend/package.json` to decrease bundle and install footprint. |
| **Dependencies** | Dev dependencies placed in backend runtime `dependencies` | `backend/package.json` (`@types/nodemailer`, `@types/passport-github2`, `@types/passport-google-oauth20`, `@types/bcrypt`, `@types/jsonwebtoken`, `@types/passport-jwt`) | **P3** | Type packages declared under `dependencies` rather than `devDependencies`. | Move all `@types/*` packages to `devDependencies`. |
| **Test Infrastructure** | 44 Unmanaged standalone `.ts` test scripts | `backend/scripts/test-*.ts` (41 scripts), `backend/test-*.ts` (3 scripts) | **P1** | Scripts run with manual node/ts-node commands using `assert()`, lacking a test runner, parallel execution, or CI automation. | Migrate core regression checks to Jest test suites (`backend/test/*.spec.ts`). |
| **Test Infrastructure** | Test scripts pollute database without cleanup | `backend/scripts/test-phase10-*.ts`, `test-phase11*.ts`, `test-phase12*.ts` | **P2** | Scripts insert unique timestamped users (`phase10-user-${Date.now()}@netvision.edu`) and records that persist forever. | Wrap tests in transactions or add teardown cleanup routines. |
| **Database / Prisma** | 7 Dead Prisma models with 0 database writes | `backend/prisma/schema.prisma` (`LessonObjective`, `LessonConcept`, `LessonExample`, `LessonCommand`, `LessonMistake`, `LessonRecap`, `SimulationState`) | **P1** | Zero delegate writes (`prisma.lessonObjective.create`, etc.) anywhere in backend. All lesson data is in `Lesson.contentJson`. | Create migration to drop these 7 unused legacy tables from schema. |
| **Database / Prisma** | Unreferenced fields on active models | `backend/prisma/schema.prisma` (`LessonLab.validationRulesJson`, `ExamAttempt.auditMetadataJson`, `SimulationState.topologyJson`) | **P2** | Fields exist in schema but are never read or written in application logic. | Clean up unreferenced schema fields in future schema revision. |
| **Development Cruft** | Silent Fallback Leaking into Production | `frontend/lib/api.ts#L43-L45, L48-L488, L532-L552` | **P0** | When backend API is down or returns errors, `api.ts` catches the exception and returns stale mock data (`FALLBACK_TOPICS`, static progress), masking server errors from developers and users. | Remove mock fallbacks in `api.ts`. Surface real error states via UI error boundaries. |
| **Development Cruft** | 600+ Unfiltered console logs across codebase | Backend services (`TopicsService`, `AuthService`, `EmailService`), frontend components | **P2** | Pervasive `console.log` statements pollute stdout and browser devtools with raw payload traces. | Replace with structured Logger (`@nestjs/common` `Logger` in backend, structured telemetry in frontend). |
| **Development Cruft** | Hardcoded demo credentials in seed and tests | `backend/prisma/seed.ts#L24-L40`, `backend/scripts/test-*.ts` | **P2** | `admin@netvision.edu` (`AdminPass123!#$`) and `alex@netvision.edu` (`StudentPass123!#$`) hardcoded in seed and test files. | Strictly guard demo user seeding behind `NODE_ENV !== 'production'` and environment variables. |
| **Documentation** | 5 Historical audit/patch logs in workspace root | `migration-history-repair-audit.md`, `otp-email-root-cause-audit.md`, `phase-beta-email-disabled.md`, `phase-deployment-migration-repair.md`, `phase-email-resend-api-migration.md` | **P3** | Ephemeral task reports placed in repository root directory. | Move historical audit logs to `docs/archive/` to clean up root workspace. |
| **Documentation** | Stale architecture claims in `ARCHITECTURE.md` and `KNOWLEDGE_MODEL.md` | `docs/ARCHITECTURE.md`, `docs/KNOWLEDGE_MODEL.md` | **P2** | Docs claim `@netvision/shared` and `@netvision/simulation-engine` are imported by frontend, and describe 7 relational tables as active data model. | Update documentation to accurately reflect V2 `contentJson` architecture and actual frontend structure. |

---

## Curriculum Technical Debt Analysis

### V2 Migration Status (30 Benchmark Lessons)

```
[=============================] 30 Total Benchmark Lessons
[=========                    ] 9 Lessons on V2 Architecture (30%)
[====================         ] 21 Lessons on Legacy stepMetadata (70%)
```

#### Active V2 Lessons (9 Lessons)
1. `net-101-bits-bytes-binary-hex` (NET-101) — Binary / Hex positional systems
2. `network-devices-overview` (NET-101) — Decimal to binary subtraction method
3. `level-0-what-is-a-computer-network` (NET-102) — Binary to decimal summation
4. `level-0-client-and-server-architecture` (NET-102) — Binary to hex nibble split
5. `level-0-lan-wan-internet-boundaries` (NET-102) — Bandwidth throughput calculation
6. `network-topologies-overview` (NET-102) — Interactive 8-bit converter
7. `net-203-arp-resolution-flow` (NET-203) — ARP cache & broadcast resolution
8. `net-302-ospf-single-area` (NET-302) — Single-Area OSPF LSDB & Dijkstra SPF
9. `net-304-bgp-peering-path-selection` (NET-304) — BGP Peering & AS-Path selection

#### Active Legacy `stepMetadata` Lessons (21 Lessons)
- **NET-100 Series (5 Lessons):** `wireless-networking-overview`, `what-is-computer-networking`, `level-0-network-protocols-standards`, `osi-model-7-layers`, `tcp-ip-4-layers`.
- **NET-200 Series (6 Lessons):** `net-201-ethernet-frame-switching`, `ethernet-mac-addresses-overview`, `level-0-mac-addresses-physical-identity`, `net-202-ipv4-addressing-cidr`, `ip-addressing-ipv4-overview`, `subnetting-cidr-overview`.
- **NET-203/204 Series (7 Lessons):** `ipv6-foundations-overview`, `level-0-dns-internet-phonebook`, `level-0-dhcp-automatic-ip-allocation`, `dhcp-dns-overview`, `net-204-tcp-three-way-handshake`, `level-0-network-ports-socket-boundaries`, `tcp-udp-transport-overview`.
- **NET-300/400 Series (3 Lessons):** `net-301-spanning-tree-protocol`, `net-303-vlan-trunking-8021q`, `net-404-wireshark-packet-capture`.

---

## Top Priorities

### TOP 10 THINGS TO REMOVE

1. **`frontend/app/courses/tcp-ip-protocol-suite/lessons/tcp-three-way-handshake/page.tsx`**: Obsolete hardcoded lesson page bypassing dynamic routing.
2. **`frontend/components/learning/LessonEngineContainer.tsx` & 6 block components** (`IntroductionBlockComponent`, `ObjectivesBlockComponent`, `QuizBlockComponent`, `SimulationBlockComponent`, `SummaryBlockComponent`, `TheoryBlockComponent`): Dead legacy block container.
3. **`FALLBACK_TOPICS` in `frontend/lib/api.ts` (Lines 49–488)**: 440 lines of dead static mock curriculum data that masks API failures.
4. **Committed `.d.ts` and `.js` files in `packages/*/src/`**: Build artifacts mistakenly committed into source folders.
5. **7 Unused Prisma Relational Models** (`LessonObjective`, `LessonConcept`, `LessonExample`, `LessonCommand`, `LessonMistake`, `LessonRecap`, `SimulationState`): Empty tables that add overhead to every lesson query.
6. **`BENCHMARK_LESSONS_METADATA` in `backend/src/topics/curriculum-migration.ts`**: Unused exported array.
7. **Unused Dependencies in `frontend/package.json`** (`@tanstack/react-query`, `@xyflow/react`): Unused third-party packages.
8. **Unused Workspace Dependencies in `frontend/package.json`** (`@netvision/shared`, `@netvision/simulation-engine`, `@netvision/ui`): 0 imports across frontend.
9. **Unused Frontend Components** (`frontend/components/learning/blocks/CodeBlock.tsx`, `frontend/components/ai/AiTutorWidget.tsx`).
10. **Root Markdown Task Logs** (`migration-history-repair-audit.md`, `otp-email-root-cause-audit.md`, `phase-*.md`): Clutter in root workspace.

---

### TOP 10 THINGS TO REFACTOR

1. **`TopicsService.getLessonBySlug` (backend)**: Remove 7 legacy relational `include` clauses to save database query overhead.
2. **`frontend/lib/api.ts` Error Handling**: Replace silent mock fallbacks with clean error throws for UI Error Boundaries.
3. **Backend `package.json` Type Dependencies**: Move `@types/nodemailer`, `@types/passport-*`, `@types/bcrypt`, `@types/jsonwebtoken` to `devDependencies`.
4. **Backend Test Scripts**: Refactor 44 ad-hoc `.ts` scripts into standardized Jest test suites (`backend/test/*.spec.ts`).
5. **Logger Integration in Backend**: Replace `console.log` with NestJS `Logger` across `TopicsService`, `AuthService`, and `EmailService`.
6. **Seed Script (`backend/prisma/seed.ts`)**: Decouple legacy course/lesson shells from core 16 target course seed.
7. **`LessonContentRenderer.tsx` Normalization Layer**: Simplify property extraction once legacy `stepMetadata` is fully retired.
8. **Prisma Schema Cleanliness**: Remove unreferenced fields (`LessonLab.validationRulesJson`, `ExamAttempt.auditMetadataJson`).
9. **Monorepo Package Architecture**: Either fully integrate `packages/shared` and `packages/ui` into `frontend` or convert them to internal modules.
10. **Documentation Synchronization**: Update `ARCHITECTURE.md` and `KNOWLEDGE_MODEL.md` to reflect V2 `contentJson` reality.

---

### TOP 10 THINGS TO KEEP

1. **Curriculum Content Architecture V2 Schema (`lesson-content.interface.ts`)**: Comprehensive, high-fidelity 9-step schema (`components`, `howItWorks`, `workedExample`, `cliTooling`, `troubleshooting`, `commonMistakes`, `securityPerspective`, `practiceExercise`, `recap`).
2. **Dynamic Lesson Routing (`app/courses/[slug]/lessons/[lessonSlug]/page.tsx`)**: Unified dynamic Next.js lesson router.
3. **8-Stage Interactive Lesson UX (`LessonViewer.tsx`)**: High-engagement stage workflow (`learn` → `understand` → `see` → `interact` → `practice` → `breakfix` → `quiz` → `mastery`).
4. **Visual Registry & Interactive Simulators (`VisualRegistry.tsx`)**: Custom SVG/Canvas networking visualizers.
5. **16 Target Course Catalog (`TARGET_16_COURSES` in `curriculum-migration.ts`)**: Progressive educational sequence from NET-101 to NET-404.
6. **Assessment 2.0 Question Bank (170 Questions in `assessment-question-bank.ts`)**: High-quality question bank mapped to Bloom's cognitive taxonomy.
7. **Authentication & Identity System (`AuthService`, `JwtStrategy`, `OAuthAccount`)**: Dual authentication supporting both registered and anonymous guest learners with progress claiming.
8. **Achievement & Mastery Engine (`AchievementsService`, `UserProgress`)**: Authoritative XP calculations and badge unlocks.
9. **Certification Foundation Engine (`CertificationsService`, `ExamAttempt`)**: Theory and practical certification exams with integrity checks.
10. **Tailwind Design System & UI Components (`frontend/components/ui/`)**: Cyberpunk-inspired terminal design system with glassmorphism and cyan/emerald accents.

---

### TOP 10 THINGS TO MIGRATE

1. **NET-200 Series Benchmark Lessons (6 Lessons)**: Convert `lessons-net200.ts` from `stepMetadata` to `contentV2`.
2. **NET-203/204 Series Benchmark Lessons (7 Lessons)**: Convert remaining lessons in `lessons-net203-204.ts` to `contentV2`.
3. **NET-100 Series Remaining Benchmark Lessons (5 Lessons)**: Convert remaining lessons in `lessons-net100.ts` to `contentV2`.
4. **NET-300/400 Series Remaining Benchmark Lessons (3 Lessons)**: Convert remaining lessons in `lessons-net300-400.ts` to `contentV2`.
5. **35 Legacy Shell Lessons in Seed**: Replace placeholder strings with structured introductory content.
6. **Legacy Slug Redirects**: Map old URL paths (`/courses/networking-fundamentals`) to target course routes (`/courses/net-101-networking-foundations`).
7. **Ad-hoc Scripts to Jest Suites**: Migrate core validation checks from `backend/scripts/test-phase*.ts` to `backend/test/*.spec.ts`.
8. **Frontend API Client to Telemetry Layer**: Route API errors through `telemetry.captureApiError()` without rendering fallback fake data.
9. **Workspace Package Types**: Consolidate shared interfaces into `@netvision/shared` and consume them across backend and frontend.
10. **Root Audit Documents**: Move historical markdown files from workspace root to `docs/archive/`.

---

## "ONE CLEANUP PLAN"

The following sequence outlines the smallest safe set of cleanup steps that reduces technical debt with zero production disruption.

```
Step 1: Dead Route & Legacy Block Cleanup (Frontend)
   │
Step 2: Remove Silent Fallback Mock Data (Frontend)
   │
Step 3: Clean Committed Build Artifacts & Unused Dependencies (Workspace)
   │
Step 4: Prune 7 Dead Relational Includes in Lesson Queries (Backend)
   │
Step 5: Migrate Remaining 21 Lessons to contentV2 (Backend Topics)
   │
Step 6: Eliminate Legacy Normalization Adapters (Frontend & Backend)
   │
Step 7: Database Migration to Drop 7 Empty Tables (Prisma)
   │
Step 8: Organize Test Scripts into Jest Suites (Backend)
   │
Step 9: Archive Root Markdown Files & Update Docs (Repository)
```

### Commit Sequence

#### Commit 1: `chore(frontend): remove dead hardcoded lesson route and obsolete block components`
- Delete `frontend/app/courses/tcp-ip-protocol-suite/lessons/tcp-three-way-handshake/page.tsx`.
- Delete `frontend/components/learning/LessonEngineContainer.tsx`.
- Delete 6 dead block components: `IntroductionBlockComponent`, `ObjectivesBlockComponent`, `QuizBlockComponent`, `SimulationBlockComponent`, `SummaryBlockComponent`, `TheoryBlockComponent`.
- Delete unused `frontend/components/learning/blocks/CodeBlock.tsx` and `frontend/components/ai/AiTutorWidget.tsx`.

#### Commit 2: `refactor(frontend): remove silent mock fallback data layer in api.ts`
- Remove `FALLBACK_TOPICS` (440 lines) from `frontend/lib/api.ts`.
- Remove dead API exports from `frontend/lib/api.ts`.
- Remove fake fallback returns in `getUserProgressApi`, `getLessonDetailApi`, `searchApi`.
- Remove unused dependencies (`@tanstack/react-query`, `@xyflow/react`, `@netvision/*`) from `frontend/package.json`.

#### Commit 3: `chore(repo): clean build artifacts and fix dependency categorizations`
- Delete compiled `.d.ts` and `.js` files from `packages/shared/src/`, `packages/simulation-engine/src/`, `packages/ui/src/`.
- Ensure `.gitignore` includes `packages/*/src/**/*.js` and `packages/*/src/**/*.d.ts`.
- Move `@types/*` in `backend/package.json` to `devDependencies`.

#### Commit 4: `perf(backend): prune unreferenced relational includes from lesson queries`
- In `backend/src/topics/topics.service.ts` (`getLessonBySlug`), remove `include` clauses for `objectives`, `concepts`, `examples`, `commands`, `mistakes`, `recaps`.
- Remove `BENCHMARK_LESSONS_METADATA` from `backend/src/topics/curriculum-migration.ts`.

#### Commit 5: `feat(curriculum): migrate remaining 21 benchmark lessons to contentV2 schema`
- Upgrade 5 lessons in `lessons-net100.ts`.
- Upgrade 6 lessons in `lessons-net200.ts`.
- Upgrade 7 lessons in `lessons-net203-204.ts`.
- Upgrade 3 lessons in `lessons-net300-400.ts`.

#### Commit 6: `refactor(learning): remove legacy normalization adapters`
- Simplify `LessonContentRenderer.tsx` to directly consume `contentV2` properties without legacy `step1_*` fallback checks.
- Simplify `TopicsService` lesson normalization logic.

#### Commit 7: `db(prisma): drop 7 obsolete relational tables`
- Generate and apply Prisma migration dropping `LessonObjective`, `LessonConcept`, `LessonExample`, `LessonCommand`, `LessonMistake`, `LessonRecap`, `SimulationState`.

#### Commit 8: `test(backend): consolidate standalone test scripts into Jest test suite`
- Move core test cases from `backend/scripts/test-phase*.ts` into standard Jest test suites (`backend/test/*.spec.ts`).
- Remove one-off duplicate test scripts in `backend/` root and `backend/scripts/`.

#### Commit 9: `docs(repo): archive historical audit logs and synchronize architecture specs`
- Move root audit logs (`migration-history-repair-audit.md`, `otp-email-root-cause-audit.md`, `phase-*.md`) into `docs/archive/`.
- Update `README.md`, `docs/ARCHITECTURE.md`, and `docs/KNOWLEDGE_MODEL.md` to reflect V2 specifications.
