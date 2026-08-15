# NetVision — Public Release & Technical Architecture Audit

**Document**: `docs/netvision-release-audit.md`  
**Audit Date**: August 2026  
**Auditor**: Senior Technical Writing & Release Engineering  
**Platform Release**: Public Beta (v1.0.0-beta)  

---

## 1. Current Release State

NetVision is currently deployed in **Public Beta**. The web platform is live and publicly accessible for computer science and IT learners. 

The deployment combines a Next.js 14 frontend on Vercel, a NestJS 10 backend on Render (Staging), and a serverless PostgreSQL database on Neon.

---

## 2. Public URLs

| Component | Target URL | Environment / Purpose |
|---|---|---|
| **Public Web Client** | `https://netvision-three.vercel.app/` | **LIVE PUBLIC BETA** (Next.js 14 Frontend) |
| **Backend API Gateway** | `https://netvision-backend-staging.onrender.com` | **STAGING BACKEND** (NestJS REST API) |
| **Interactive API Documentation** | `https://netvision-backend-staging.onrender.com/api/docs` | Swagger OpenAPI Specification |
| **Backend Health Check** | `https://netvision-backend-staging.onrender.com/api/v1/health` | Service & DB Health Monitor |

> **Note on Staging Backend**: The backend is hosted on Render Staging infrastructure. While it is fully integrated with the live Vercel frontend, it is designated as a staging environment for the public beta.

---

## 3. System Architecture

```
                                  [ LEARNER ]
                                       │
                                       ▼
                   ┌───────────────────────────────────────┐
                   │        Vercel Edge Network            │
                   │  https://netvision-three.vercel.app/  │
                   │   Next.js 14 App Router (RSC + SPA)   │
                   └───────────────────┬───────────────────┘
                                       │
                         HTTPS REST / OAuth Callbacks
                                       │
                                       ▼
                   ┌───────────────────────────────────────┐
                   │         Render Web Service            │
                   │ netvision-backend-staging.onrender.com│
                   │     NestJS 10 REST API Gateway        │
                   └───────┬───────────────────────┬───────┘
                           │                       │
                           ▼                       ▼
            ┌────────────────────────────┐  ┌─────────────┐
            │      Neon PostgreSQL       │  │ Resend API  │
            │ (Serverless SQL Database)  │  │   (HTTPS)   │
            │  Managed via Prisma 5 ORM  │  │  [Inactive  │
            └────────────────────────────┘  │  for Beta]  │
                                            └─────────────┘
```

---

## 4. Feature Implementation Matrix

| Product Feature | Status | Repository Evidence / Implementation Details |
|---|:---:|---|
| **User Registration** | **IMPLEMENTED** | `AuthService.register`: Creates account, sets `isVerified: true`, returns JWT immediately during public beta. |
| **User Login** | **IMPLEMENTED** | `AuthService.login`: Validates Argon2id password hash, issues JWT access token. |
| **Guest Learning Mode** | **IMPLEMENTED** | `OptionalJwtAuthGuard`: Resolves `X-Anonymous-ID` header to `AnonymousLearner` record without requiring registration. |
| **Guest Progress Tracking** | **IMPLEMENTED** | `UserProgress`, `QuizAttempt`, and `LabAttempt` records bind to `anonymousId` for instant guest learning. |
| **Claiming Guest Progress** | **IMPLEMENTED** | `POST /api/v1/auth/claim-anonymous-progress`: Atomic database migration of guest progress to authenticated `userId`. |
| **Courses & Modules** | **IMPLEMENTED** | `Course` (16 progressive target courses NET-101 to NET-404) and `Module` (38 modules) relational models. |
| **Lessons & Multi-Modal Content**| **IMPLEMENTED** | `Lesson` model with structured introductory concepts, analogies, technical explanations, and cheatsheets. |
| **Interactive CLI Labs** | **IMPLEMENTED** | `LessonLab` model with 38 guided interactive practice scenarios. |
| **Quizzes & Assessments** | **IMPLEMENTED** | `Quiz` and `QuizQuestion` models with 38 quizzes and 50 questions across Bloom's cognitive taxonomy. |
| **Simulated Sandbox Engine** | **IMPLEMENTED** | `SimulatedSandboxProvider`: Evaluates virtual network topologies with deterministic command execution (`ping`, `traceroute`, `arp`, `ifconfig`, `netstat`, `route`). |
| **Docker Sandbox Provider** | **DISABLED** | `DockerSandboxProvider`: Intentionally disabled for public security; rejects container creation with clear `BadRequestException`. |
| **Gamification & Achievements** | **IMPLEMENTED** | `Achievement` (10 seeded badges) and `UserAchievement` tracking automatic progression milestones. |
| **Learner Dashboard** | **IMPLEMENTED** | Frontend `/dashboard` page displaying enrolled courses, overall completion percentage, mastery scores, and badges. |
| **Certificate Generation** | **IMPLEMENTED** | `Certificate` model with UUID, verifiable credential ID, and public verification page at `/certificates/[id]`. |
| **Certification Definition** | **IMPLEMENTED** | `CertificationDefinition` model seeded with `NETVISION-CERT-FOUNDATIONS` criteria. |
| **Theory & Practical Exams** | **PARTIAL** | `ExamAttempt` model and endpoints exist; full multi-course exam question bank is planned for Phase 2. |
| **OAuth (Google / GitHub)** | **IMPLEMENTED** | `GoogleAuthGuard`, `GithubAuthGuard`, and Passport strategies in `backend/src/auth/strategies`. |
| **Email Delivery Architecture** | **IMPLEMENTED** | `EmailService`, `ResendProvider` (official `resend` SDK), `SmtpProvider`, and branded HTML templates. |
| **Email Verification / OTP** | **DISABLED** | Temporarily deactivated for public beta via `EMAIL_VERIFICATION_ENABLED=false` to provide zero-friction onboarding. |
| **Password Reset** | **PARTIAL** | Core SHA-256 token hashing and Argon2 update are implemented; email delivery endpoint returns explicit 400 when unconfigured during beta. |
| **API Documentation** | **IMPLEMENTED** | Swagger OpenAPI docs at `/api/docs`. |
| **Health Checks** | **IMPLEMENTED** | `GET /api/v1/health` returning live database health status. |
| **Admin Dashboard** | **PARTIAL** | Admin controller and `/admin` UI page with user metrics. |
| **Teacher Dashboard** | **PLANNED** | `Role.TEACHER` exists in database enum; classroom management views are planned for future milestone. |

---

## 5. Deployment State

- **Frontend Deployment**: Hosted on Vercel (`https://netvision-three.vercel.app/`). Automatically deployed from `main` branch.
- **Backend Deployment**: Hosted on Render Free Web Service (`https://netvision-backend-staging.onrender.com`). Configured with reverse proxy trust (`TRUSTED_PROXY=loopback`) and graceful shutdown.
- **Database Deployment**: Hosted on Neon PostgreSQL (Serverless). Managed strictly through Prisma migrations (`prisma migrate deploy`).
- **Monitoring**: Health endpoint `GET /api/v1/health` configured for UptimeRobot monitoring.

---

## 6. Authentication & Email State in Public Beta

### Public Beta Flow:
1. **Zero-Friction Registration**: Learners submit registration form $\rightarrow$ Account is initialized as `isVerified: true` $\rightarrow$ JWT tokens are returned $\rightarrow$ User is automatically routed to `/dashboard`.
2. **Feature Flag**: `EMAIL_VERIFICATION_ENABLED=false` (Centralized in `AuthService` and `backend/.env.example`).
3. **No Fake Delivery**: The backend never claims an OTP was sent when email verification is disabled.
4. **Future Re-Enablement**: The complete Resend HTTPS API architecture remains in the repository. Setting `EMAIL_VERIFICATION_ENABLED=true` immediately re-enables mandatory 6-digit email OTPs.

---

## 7. Sandbox Execution State

- **Active Provider**: `SimulatedSandboxProvider` (`providerType: "SIMULATED"`).
- **Supported Commands**: `ping`, `traceroute`, `ifconfig`, `ip`, `arp`, `netstat`, `nslookup`, `dig`, `route`, `iptables`, `tcpdump`, `cat`, `help`.
- **Docker Isolation Policy**: Docker container execution (`DockerSandboxProvider`) is disabled in public beta to prevent multi-tenant security vulnerabilities on shared host infrastructure.

---

## 8. Certification & Verification State

- **Active Certification**: `NETVISION-CERT-FOUNDATIONS` (NetVision Certified Networking Foundations).
- **Requirements**: Completion of all Level 1 & Level 2 courses (NET-101 to NET-204) with an average quiz score $\ge 80\%$.
- **Verification Portal**: Any earned certificate can be publicly validated by navigating to `https://netvision-three.vercel.app/certificates/<credential-id>`.

---

## 9. Testing & Quality Assurance State

All test suites have been verified with 100% pass rates:
1. **Public Beta Auth Suite** (`scripts/test-beta-auth.ts`): 6/6 tests passed.
2. **Resend Email & Nest DI Suite** (`scripts/test-email-suite.ts`): 14/14 tests passed.
3. **Phase 2 Identity & Guest Mode Suite** (`scripts/test-phase2-identity.ts`): 5/5 tests passed.
4. **Deployment Readiness Suite** (`scripts/test-deployment-readiness.ts`): 12/12 tests passed.
5. **Typechecks & Builds**:
   - Backend `tsc --noEmit`: 0 errors.
   - Backend `nest build`: Clean compilation to `backend/dist/`.
   - Frontend `tsc --noEmit`: 0 errors.
   - Frontend `next build`: All 30/30 static and dynamic routes compiled.

---

## 10. Major Gaps & Recommended Next Priorities

| Priority | Area | Action Required |
|:---:|---|---|
| **1** | **Curriculum Content** | Populate full lesson bodies for placeholder courses NET-302 (STP) and NET-304 (OSPF). |
| **2** | **Assessment Bank** | Expand quiz question bank from 50 to 150+ questions to enhance assessment variability. |
| **3** | **Command Table** | Populate relational `command_references` table for unified CLI documentation search. |
| **4** | **Production Email** | Add verified domain and `RESEND_API_KEY` in Render environment to enable self-service password resets. |
| **5** | **Teacher Portal** | Implement class management, assignment dispatch, and student cohort analytics for `Role.TEACHER`. |
