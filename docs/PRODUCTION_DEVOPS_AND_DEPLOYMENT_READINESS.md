# NetVision — Production DevOps, Containerization & Deployment Readiness Architecture

> **Document Version**: 1.0.0  
> **Status**: Production Approved & Audited  
> **Release Target**: Production Deployment Artifact  
> **Last Verified**: September 2026  

---

## 1. Executive Summary & Production Readiness Gate

This specification defines the production deployment standards, containerization architecture, CI/CD pipeline invariants, database migration governance, and multi-environment configuration matrix for the NetVision learning platform.

### Audited Core Invariants
1. **Container Isolation & Non-Root Execution**: Both `backend` and `frontend` Docker images execute under non-privileged `node` user accounts with multi-stage build separation.
2. **Deterministic Migration Ordering**: Database schema migrations (`prisma migrate deploy`) strictly precede application boot. Schema modifications using unsafe `prisma db push` are strictly forbidden in production.
3. **CI Pipeline Ordering**: Automated CI enforces `install → typecheck → lint → test → build` with `--frozen-lockfile` and enterprise secret scanning.
4. **Environment Segregation**: Development, Staging, and Production environments maintain distinct configuration profiles with fail-fast validation on startup.

---

## 2. Containerization Architecture & Multi-Stage Dockerfiles

### 2.1 Backend Container (`Dockerfile.backend`)

The backend container compiles TypeScript source, Prisma client models, and workspace dependencies in an isolated build stage before copying only production runtime artifacts to a hardened Alpine Linux runner stage.

- **Base Image**: `node:20-alpine`
- **Package Manager**: `pnpm@11.20.0` (frozen lockfile validation)
- **Security Boundary**: Runs as non-root `USER node` (UID 1000)
- **Native Dependencies**: `apk add --no-cache openssl` for Prisma query engine ABI compatibility on Alpine musl libc.
- **Port**: Exposed on TCP `4000`
- **Healthcheck Probe**:
  ```dockerfile
  HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1
  ```
- **Entrypoint**: `CMD ["node", "dist/backend/src/main.js"]`

### 2.2 Frontend Container (`Dockerfile.frontend`)

The frontend container compiles Next.js 15 pages and components with tree-shaking, static generation, and optimized chunks.

- **Base Image**: `node:20-alpine`
- **Optimization**: `NEXT_TELEMETRY_DISABLED=1`
- **Security Boundary**: Runs as non-root `USER node` (UID 1000)
- **Port**: Exposed on TCP `3000`
- **Healthcheck Probe**:
  ```dockerfile
  HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1
  ```
- **Entrypoint**: `CMD ["node_modules/.bin/next", "start", "-p", "3000"]`

---

## 3. Docker Compose Orchestration & Service Dependency Ordering

The container orchestration topology in `docker-compose.yml` guarantees that stateful dependencies and schema migrations are fully healthy before application traffic is accepted.

```mermaid
graph TD
    PG["postgres:16-alpine<br/>(healthcheck: pg_isready)"]
    RD["redis:7-alpine<br/>(healthcheck: redis-cli ping)"]
    
    PG -->|service_healthy| MIG["netvision-migration<br/>(npx prisma migrate deploy)"]
    
    PG -->|service_healthy| BE["netvision-backend<br/>(healthcheck: /health)"]
    RD -->|service_healthy| BE
    MIG -->|service_completed_successfully| BE
    
    BE -->|service_healthy| FE["netvision-frontend<br/>(healthcheck: /api/health)"]
```

### Service Dependency Manifest

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: netvision-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-netvision}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD environment variable is required}
      POSTGRES_DB: ${POSTGRES_DB:-netvision_db}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-netvision} -d ${POSTGRES_DB:-netvision_db}"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: netvision-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

  migration:
    build:
      context: .
      dockerfile: Dockerfile.backend
    container_name: netvision-migration
    command: ["npx", "prisma", "migrate", "deploy"]
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${POSTGRES_USER:-netvision}:${POSTGRES_PASSWORD:?POSTGRES_PASSWORD environment variable is required}@postgres:5432/${POSTGRES_DB:-netvision_db}?schema=public
    depends_on:
      postgres:
        condition: service_healthy
    restart: "no"

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    container_name: netvision-backend
    restart: unless-stopped
    ports:
      - "4000:4000"
    environment:
      NODE_ENV: production
      PORT: 4000
      API_PREFIX: /api/v1
      DATABASE_URL: postgresql://${POSTGRES_USER:-netvision}:${POSTGRES_PASSWORD:?POSTGRES_PASSWORD environment variable is required}@postgres:5432/${POSTGRES_DB:-netvision_db}?schema=public
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET environment variable is required}
      CORS_ORIGIN: ${CORS_ORIGIN:-http://localhost:3000}
      API_URL: ${API_URL:-http://localhost:4000}
      FRONTEND_URL: ${FRONTEND_URL:-http://localhost:3000}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      migration:
        condition: service_completed_successfully
    healthcheck:
      test: ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 15s

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: netvision-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:-http://localhost:4000/api/v1}
      NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL:-http://localhost:3000}
    depends_on:
      backend:
        condition: service_healthy
    healthcheck:
      test: ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 20s

volumes:
  postgres_data:
  redis_data:
```

---

## 4. CI/CD Verification Pipeline (`.github/workflows/ci.yml`)

The NetVision Continuous Integration workflow guarantees that no code is integrated into `main` without passing the mandatory verification stages in sequential order:

```mermaid
graph LR
    INST["1. Install<br/>pnpm --frozen-lockfile"] --> TC["2. Typecheck<br/>pnpm typecheck"]
    TC --> LINT["3. Lint<br/>pnpm lint"]
    LINT --> TEST["4. Test Suite<br/>Secrets, Frontend, Backend"]
    TEST --> BUILD["5. Build<br/>pnpm build"]
    BUILD --> E2E["6. E2E Suite<br/>Playwright Chromium"]
```

### Pipeline Execution Order

| Stage | Command | Purpose & Invariants |
| :--- | :--- | :--- |
| **1. Install** | `pnpm install --frozen-lockfile` | Enforces exact lockfile checksums without drift. |
| **2. Database Init** | `npx prisma generate && npx prisma migrate deploy` | Generates typed Prisma client and applies idempotent SQL migrations against CI container. |
| **3. Typecheck** | `pnpm typecheck` | Validates TypeScript types across all 5 workspace projects with `--noEmit`. |
| **4. Lint** | `pnpm lint` | Enforces ESLint rules and code quality across backend, frontend, and shared packages. |
| **5. Secret Scan** | `node backend/scripts/scan-repository-secrets.js` | Scans git-tracked files, environment templates, and recent commits for exposed credentials. |
| **6. Frontend Tests** | `pnpm --filter netvision-frontend test` | Executes all 11 frontend test suites (SEO, accessibility, responsiveness, navigation, capstone). |
| **7. Backend Tests** | `npx ts-node scripts/test-deployment-readiness.ts` + certification suites | Executes deployment readiness, Drop W legal, Drop X high-stakes architecture, curriculum, and integrity tests. |
| **8. Build** | `pnpm build` | Compiles NestJS backend, Next.js frontend (38 static routes), and packages to production artifacts. |
| **9. E2E Tests** | `pnpm test:e2e` | Runs Playwright browser integration suite with failure artifact uploads. |

---

## 5. Database Migration Governance & Lifecycle

### 5.1 Authoritative Migration History

All production database schema changes are managed via numbered, immutable SQL migration files in `backend/prisma/migrations/`:

| Timestamp & Name | Description | Idempotency & Safety |
| :--- | :--- | :--- |
| `20260814000000_baseline` | Complete initial schema: users, profiles, courses, modules, lessons, labs, quizzes, exams, attempts, certificates, refresh tokens. | Initial creation; fails gracefully if tables exist. |
| `20260909000000_add_certificate_user_cert_unique` | Adds composite unique index `certificates(userId, certificationCode)` to prevent duplicate certificates. | `CREATE UNIQUE INDEX` prevents dual issuance. |
| `20260910102552_add_active_exam_attempt_unique_idx` | Partial unique index `exam_attempts(userId, certificationCode) WHERE status = 'IN_PROGRESS'`. | `CREATE UNIQUE INDEX IF NOT EXISTS` guarantees single active attempt. |

### 5.2 Safe Deployment Command

Production deployments MUST ONLY execute:
```bash
npx prisma migrate deploy
```

> [!CAUTION]
> **Strict Prohibition on `prisma db push` in Production**  
> Under no circumstances should `prisma db push` or `prisma db push --accept-data-loss` be run against staging or production databases. `db push` bypasses the migration lock table (`_prisma_migrations`), can drop columns silently, and breaks auditability.

### 5.3 Rollback Strategy & Runbook

Because Prisma does not generate automatic down migrations, rollbacks are handled via explicit SQL down-scripts:

#### Rollback Script for `20260910102552_add_active_exam_attempt_unique_idx`
```sql
-- DOWN MIGRATION: Drop active exam attempt partial unique index
DROP INDEX IF EXISTS "exam_attempts_user_active_in_progress_unique_idx";
```

#### Rollback Script for `20260909000000_add_certificate_user_cert_unique`
```sql
-- DOWN MIGRATION: Drop certificate unique index
DROP INDEX IF EXISTS "certificates_userId_certificationCode_key";
```

#### Database Rollback Procedure:
1. Put application into maintenance mode (`503 Service Unavailable`).
2. Connect to database via bastion or authorized CLI session.
3. Execute the corresponding SQL down-migration script.
4. Mark the rolled-back migration as rolled back in Prisma's ledger:
   ```bash
   npx prisma migrate resolve --rolled-back "20260910102552_add_active_exam_attempt_unique_idx"
   ```
5. Deploy the previous stable release artifact.
6. Verify database health: `GET /api/v1/health/ready`.
7. Disable maintenance mode.

### 5.4 Seed Safety & Idempotency

In `backend/prisma/seed.ts`:
- **Production Guard**: Default demo accounts (`admin@netvision.edu`, `alex@netvision.edu`) are automatically skipped when `NODE_ENV=production` unless explicitly opted-in via `SEED_DEMO_USERS=true`.
- **Idempotent Upserts**: All 5 flagship courses, modules, lessons, and assessment questions use `prisma.<model>.upsert()` matching on unique identifiers (`code`, `slug`, `email`).
- **Data Preservation**: Seeding never executes `deleteMany()`, `DROP TABLE`, or destructive truncations.

---

## 6. Multi-Environment Configuration Matrix

| Configuration Variable | Development | Staging | Production | Description / Rule |
| :--- | :--- | :--- | :--- | :--- |
| `NODE_ENV` | `development` | `production` | `production` | Enables production optimizations & security guards. |
| `PORT` | `4000` | `4000` | `4000` | Internal container HTTP port. |
| `API_PREFIX` | `/api/v1` | `/api/v1` | `/api/v1` | Global API route prefix. |
| `DATABASE_URL` | `postgresql://netvision:netvision_dev@localhost:5432/netvision_dev` | Managed PostgreSQL (Neon/RDS Staging) with SSL | Managed High-Availability PostgreSQL Cluster (SSL `sslmode=require`) | Pooled PostgreSQL connection string. |
| `JWT_SECRET` | Min 32 chars (dev secret) | Cryptographically generated (64 hex chars) | Cryptographically generated (64 hex chars from KMS/Vault) | Validated on boot; rejected if default/short in prod. |
| `JWT_EXPIRATION` | `15m` | `15m` | `15m` | Access token lifetime. |
| `CORS_ORIGIN` | `http://localhost:3000` | `https://staging.netvision.edu` | `https://netvision.edu` | Strict origin whitelist (no wildcards in prod). |
| `API_URL` | `http://localhost:4000` | `https://api-staging.netvision.edu` | `https://api.netvision.edu` | Canonical backend URL for callback resolution. |
| `FRONTEND_URL` | `http://localhost:3000` | `https://staging.netvision.edu` | `https://netvision.edu` | Canonical client URL for redirection. |
| `TRUSTED_PROXY` | `loopback` | `loopback` or `1` | Reverse proxy CIDR / `loopback` | Cloudflare / AWS ALB / Nginx IP forwarding. |
| `SEED_DEMO_USERS` | `true` | `false` | `false` | Strict guard: never seed test users in production. |
| `EMAIL_VERIFICATION_ENABLED`| `false` | `true` | `true` | Requires 6-digit email OTP in prod. |
| `EMAIL_PROVIDER` | `console` | `resend` (staging key) | `resend` (production key) | Email dispatch provider. |

---

## 7. Startup, Shutdown & Graceful Failure Architecture

### 7.1 Startup Validation & Fail-Fast Gates

In `backend/src/main.ts`:
- `validateProductionConfig()` executes before NestFactory instantiates:
  - Verifies presence of `JWT_SECRET`, `DATABASE_URL`, `CORS_ORIGIN`, `API_URL`, `FRONTEND_URL`.
  - Rejects weak, short, or placeholder secrets (`super_secret_netvision_jwt_key`, `change_me`, `< 16 chars`).
  - Halts process immediately with descriptive exit code if misconfigured.

### 7.2 Graceful Shutdown & Connection Draining

- `app.enableShutdownHooks()`:
  - Intercepts OS signals (`SIGTERM`, `SIGINT`).
  - Stops accepting new HTTP connections.
  - Waits for active in-flight requests to complete.
  - Triggers NestJS `OnModuleDestroy` hooks across all services.
- `PrismaService.onModuleDestroy()`:
  - Invokes `await this.$disconnect()` to gracefully drain and close PostgreSQL connection pool.

### 7.3 Transient Database Failure Resilience

In `backend/src/database/prisma.service.ts`:
- Prisma query middleware intercepts transient network disruptions (`P1001`, `P1017`, `ETIMEDOUT`, `ECONNRESET`, server closed connection).
- Executes up to 6 retry attempts with exponential backoff (`1000ms`, `2000ms`, `4000ms`...) before surfacing failure.
- Startup connection failure is logged as a warning, enabling containers to boot while database instances warm up.

### 7.4 Health Check Endpoints Summary

- **Backend Liveness**: `GET /health` or `GET /api/v1/health` &rarr; Returns `{ status: "ok", database: "healthy" }`.
- **Backend Readiness**: `GET /ready` or `GET /api/v1/ready` &rarr; Returns `200 OK` when DB latency is healthy; returns `503 Service Unavailable` if database disconnected.
- **Backend Telemetry**: `GET /api/v1/monitoring/health` &rarr; Aggregated database, mail provider, and alert conditions.
- **Frontend Health**: `GET /api/health` &rarr; Returns lightweight 200 JSON `{ status: "ok", service: "NetVision Frontend" }`.
