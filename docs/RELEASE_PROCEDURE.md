# NetVision Production Release Procedure & Environment Consistency Standard

## Overview
This document defines the authoritative, mandatory 7-stage release lifecycle for NetVision. Every change deployed to production (Render, Vercel, Docker, or Kubernetes) must strictly adhere to this standardized procedure.

---

## Runtime Baseline Specification

To guarantee zero behavioral discrepancy across local workstations, CI runners, Docker containers, and cloud hosts:

| Component | Target Baseline | Verification Command | Enforcement Mechanism |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v22.x` (Active LTS) | `node -v` | `.nvmrc`, `.node-version`, `package.json#engines` |
| **Package Manager** | `pnpm v11.20.0` | `pnpm -v` | `package.json#packageManager`, `package.json#engines` |
| **Backend Base** | `node:22-alpine` | `docker inspect netvision-backend` | `Dockerfile.backend` |
| **Frontend Base** | `node:22-alpine` | `docker inspect netvision-frontend` | `Dockerfile.frontend` |
| **CI Runner** | `ubuntu-latest` (Node 22) | GitHub Actions Runner Log | `.github/workflows/ci.yml` |

---

## The 7-Stage Release Lifecycle

```
[1. INSPECT] ──> [2. TEST] ──> [3. COMMIT] ──> [4. PUSH] ──> [5. DEPLOY] ──> [6. VERIFY] ──> [7. ACCEPT]
```

### 1. INSPECT (Repository Hygiene & Secret Scrubbing)
Before staging or committing any files:
1. **Verify Node & Package Manager**:
   ```bash
   node -v   # Must report v22.x
   pnpm -v   # Must report 11.20.0
   ```
2. **Execute Secret & Credential Audit**:
   ```bash
   node backend/scripts/scan-repository-secrets.js
   ```
   *Requirement: Must exit with code 0 (Zero secrets detected).*
3. **Verify Repository Hygiene**:
   ```bash
   git status
   ```
   Confirm no forbidden or accidental artifacts are tracked:
   - No `.project-ai/` internal files
   - No `.storage/` or `.impeccable/` directories
   - No Playwright test results (`playwright-report/`, `test-results/`)
   - No IDE folders (`.vscode/`, `.idea/`, `.antigravity/`, `.gemini/`)
   - No live credentials or un-templated `.env` files
   - No compiled Python bytecode (`__pycache__/`, `*.pyc`)

---

### 2. TEST (Automated Validation Across All Layers)
Run the full test and verification pipeline:
1. **TypeScript Typecheck (All 5 Packages)**:
   ```bash
   pnpm typecheck
   ```
2. **ESLint Code Quality**:
   ```bash
   pnpm lint
   ```
3. **Frontend Regression & Unit Test Suites (14/14 Suites)**:
   ```bash
   pnpm --filter netvision-frontend test
   ```
4. **Backend Security, Schema & Performance Suites**:
   ```bash
   pnpm --filter netvision-backend test:drop03    # Auth & Session Security Hardening
   pnpm --filter netvision-backend test:drop05    # Distributed State, Redis & Caching
   pnpm --filter netvision-backend test:drop06    # Schema, Migrations & Database Resilience
   pnpm --filter netvision-backend test:drop10    # Performance, Query Efficiency & Scalability
   pnpm --filter netvision-backend test:drop11    # DevOps, Repo Hygiene & Consistency
   ```

---

### 3. COMMIT (Atomic, Intentional & Documented Changes)
1. **Inspect Staged Diff**:
   ```bash
   git diff --staged
   ```
   Verify that only intended files are staged.
2. **Commit with Conventional Specification**:
   ```bash
   git commit -m "fix(scope): clear description of changes"
   ```
   *Rule: Never bundle unrelated refactors with security or schema changes.*

---

### 4. PUSH (Standard Forward Delivery — Zero Force-Pushes)
1. **Review Local Revision Ahead of Remote**:
   ```bash
   git log origin/main..main --oneline
   ```
2. **Push to Authoritative Repository**:
   ```bash
   git push origin main
   ```
   > [!CRITICAL]
   > **NEVER FORCE-PUSH** (`git push -f` or `--force-with-lease` is strictly prohibited on `main`).
   > History linearity preserves forensic traceability and audit compliance.

---

### 5. DEPLOY (Deterministic Migration & Container Delivery)
1. **Backend Database Migrations (Render)**:
   - Migrations MUST execute before new application instances receive traffic.
   - Run via direct session connection (`DIRECT_URL`):
     ```bash
     npx prisma migrate deploy
     ```
   - *Never execute `prisma db push` or `prisma migrate reset` in production.*
2. **Backend Web Service (Render Docker)**:
   - Builds from `Dockerfile.backend` with multi-stage caching.
   - Initializes environment variables: `DATABASE_URL`, `DIRECT_URL`, `REDIS_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `API_URL`, `FRONTEND_URL`.
   - Probes `/ready` before routing live requests.
3. **Frontend Web Client (Vercel)**:
   - Compiles static routes and Server Components with Next.js 15.
   - Binds `NEXT_PUBLIC_API_URL` to production backend API.
   - Binds `NEXT_PUBLIC_SITE_URL` to authoritative `https://netvision.edu`.

---

### 6. VERIFY (Live Smoke Testing & Health Probes)
Immediately following deployment, run verification probes against production domains:
1. **Backend Liveness Probe**:
   ```bash
   curl -f -s -o /dev/null -w "%{http_code}\n" https://api.netvision.edu/health
   # Expected: 200
   ```
2. **Backend Readiness Probe (Verifies PostgreSQL & Subsystems)**:
   ```bash
   curl -f -s -o /dev/null -w "%{http_code}\n" https://api.netvision.edu/ready
   # Expected: 200
   ```
3. **Frontend Health Probe**:
   ```bash
   curl -f -s -o /dev/null -w "%{http_code}\n" https://netvision.edu/api/health
   # Expected: 200
   ```
4. **Critical Path Smoke Test**:
   - Course catalog navigation (`/courses`)
   - Interactive CLI command execution (`ping`, `traceroute`, `show ip interface brief`)
   - Public credential verification portal (`/certificates/:credentialId`)

---

### 7. ACCEPT (Sign-Off & Telemetry Monitoring)
1. **Monitor Telemetry**:
   - Inspect `/monitoring/metrics` and error log streams.
   - Confirm zero 500 internal server errors and healthy database query latencies (<50ms).
2. **Formal Release Acceptance**:
   - Sign off release version in git tags:
     ```bash
     git tag -a v1.0.0-release -m "NetVision Production Release"
     git push origin v1.0.0-release
     ```
