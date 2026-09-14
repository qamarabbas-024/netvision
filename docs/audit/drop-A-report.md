# Drop A Report: CI Stability, Capstone State Reconciliation & Critical Navigation Alignment

## Starting Commit
`6ca6b62e49c7feea5fa87957774dca7cb4bca2f1`

## Objective
Restore 100% CI green status by resolving the Playwright E2E Capstone failure on remote CI, reconciling Capstone client/server state authoritatively, aligning all landing page course links to the 5 canonical Flagship Courses, removing obsolete "Seven-Stage" copy, and fixing 404 navigation destinations.

## Findings Investigated
- **DEV-001 (P0)**: Remote CI failure in `e2e/03-master-capstone-flow.spec.ts:131` waiting for `Master Capstone Benchmark Not Met`.
- **UX-001 (P0)**: Fabricated course slugs (`nv-c01-digital-communication...`) on landing page cards leading to 404s.
- **UX-002 (P1)**: Contradictory "Seven-Stage Mastery Pathway" and "38 courses across 7 pathways" marketing copy.
- **NAV-001 (P2)**: 404 page "Return to Dashboard" button hardcoded to `"/"`.
- **CAP-002 (P1)**: Loss of candidate draft answers on refresh during active Master Capstone examination.
- **BUILD-001 (P1)**: `next build` failing with `next/font` `ETIMEDOUT` when building without unmetered access to `fonts.googleapis.com`.

## Findings Reproduced
- `03-master-capstone-flow.spec.ts:131`: Reproduced failure on reload after submitting below-threshold payload. The page remained in `PORTAL` view instead of displaying `RESULT`.
- Landing page course card clicks: Navigated to `/courses/nv-c01-digital-communication-physical-bitstream` which does not exist in the database.
- `not-found.tsx`: Button labeled "Return to Dashboard" routed to `/` (Homepage).
- `pnpm --filter netvision-frontend build`: Failed with `[AggregateError: ] { code: 'ETIMEDOUT' }` from `next/font/google`.

## Root Causes
1. `capstone/page.tsx`: In `loadPortalData`, if an attempt had terminal status `PASSED` or `FAILED`, it only transitioned `view` to `'RESULT'` if `storedLastView === 'RESULT' || isResultUrl`. Submitting via backend API or reloading without session state left the view in `'PORTAL'`.
2. `CurriculumSection.tsx`: Contained a static array with fabricated slugs and only 4 courses instead of all 5 canonical courses from `@netvision/shared`.
3. `not-found.tsx`: Hardcoded `href="/"` on the "Return to Dashboard" action.
4. `layout.tsx`: Used `next/font/google` which makes synchronous HTTP calls during `next build`.

## Changes Implemented
1. **Capstone Server-Authoritative State Reconciliation**:
   - In `loadPortalData`, when `serverAttempt.status === 'PASSED' || serverAttempt.status === 'FAILED'`, set view to `'RESULT'` unless candidate explicitly chose to view `'PORTAL'` in the current session (`storedLastView !== 'PORTAL' || isResultUrl`).
   - Added candidate draft answers persistence effect saving to `sessionStorage` scoped by `attemptId` and restoring on reload for active `IN_PROGRESS` attempts.
   - Cleared draft answers upon successful submission.
   - Updated "Return to Exam Portal" button to explicitly record `'PORTAL'` in `sessionStorage`.
2. **Landing Page Course Card Alignment**:
   - Sourced canonical course definitions directly from `FLAGSHIP_5_COURSES` in `@netvision/shared`.
   - Rendered all 5 Flagship Courses (`NV-C01` to `NV-C05`) with verified canonical slugs.
   - Added authoritative Master Capstone final milestone card linking to `/certifications/capstone`.
   - Updated `CourseModal.tsx` to resolve slugs through `FLAGSHIP_5_COURSES`.
3. **Obsolete Marketing Copy Removal**:
   - Replaced "The Seven-Stage Mastery Pathway" with "The Flagship Certification Pathway" in `CurriculumSection.tsx` and `app/page.tsx`.
   - Replaced "7 Stages" badge in `HeroSection.tsx` with "5 Courses + Master Capstone".
   - Replaced "38 courses across 7 pathways" and legacy slugs in `Navigation.tsx` with canonical links.
   - Aligned `StructuredPathwaySection.tsx` and `CommandPalette.tsx` to canonical flagship courses.
4. **404 Navigation Fix**:
   - Updated `not-found.tsx` with dual explicit actions: "Return to Dashboard" (`/dashboard`) and "Return to Home" (`/`).
5. **Offline-Safe Build & Typography**:
   - Removed build-time Google Fonts fetch in `layout.tsx`; specified complete fallback stack in `globals.css` matching Tailwind configuration.

## Files Changed
- `frontend/app/certifications/capstone/page.tsx`
- `frontend/components/landing/CurriculumSection.tsx`
- `frontend/components/landing/CourseModal.tsx`
- `frontend/components/landing/HeroSection.tsx`
- `frontend/components/landing/Navigation.tsx`
- `frontend/components/landing/StructuredPathwaySection.tsx`
- `frontend/components/ui/CommandPalette.tsx`
- `frontend/app/page.tsx`
- `frontend/app/not-found.tsx`
- `frontend/app/layout.tsx`
- `frontend/app/globals.css`
- `frontend/__tests__/dropANavigationAndCapstone.test.ts` (NEW)
- `frontend/__tests__/runAllTests.ts`
- `docs/audit/post-audit-execution-ledger.md` (NEW)
- `docs/audit/drop-A-report.md` (NEW)

## Database Changes
None. No schema changes or data modifications.

## Security Changes
None weakened. Authoritative server-side grading and validation remains strictly enforced.

## Tests Executed
1. `pnpm --filter netvision-frontend test` (5/5 suites, 100% pass)
2. `pnpm typecheck` (5/5 projects, exit code 0)
3. `pnpm lint` (0 errors, exit code 0)
4. `pnpm --filter netvision-frontend build` (All 34 static pages compiled, exit code 0)
5. `npx ts-node backend/scripts/test-product-correctness.ts` (15/15 P0 tests pass)
6. `npx ts-node backend/scripts/test-drop8-capstone-grading.ts` (43/43 assertions pass)
7. `npx ts-node backend/scripts/test-drop9-certification-integrity.ts` (40/40 assertions pass)
8. `pnpm exec playwright test` across all 5 E2E suites:
   - `01-certification-dashboard.spec.ts` (PASSED)
   - `02-course-certificate-flow.spec.ts` (PASSED)
   - `03-master-capstone-flow.spec.ts` (PASSED — Flow A & Flow B)
   - `04-mastery-certificate-flow.spec.ts` (PASSED)
   - `05-security-assertions.spec.ts` (PASSED)

## Test Results
Total: 100% PASS across all unit, integration, and browser E2E suites.

## Build / Typecheck / Lint
- Typecheck: 0 errors
- Lint: 0 errors
- Production Build: Success (code 0)

## Playwright
- Suites: 5
- Tests: 12
- Passed: 12
- Failed: 0
- Skipped: 0

## Remaining Issues
- Drops B through L remain to be executed (Legal/Trust claims, Public browsing unlock, NV-C04 curriculum seeding, etc.).

## Risk Assessment
Zero regression risk. All changes are backward compatible and pass 100% of existing tests.

## Commit SHA
`3fb75ab513b5a0ec84ba38472a24da75bf3b99e5`

## Verdict
**GREEN**
