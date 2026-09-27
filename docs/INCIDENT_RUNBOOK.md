# NetVision — Incident Response Runbooks & Disaster Recovery Operations

**Document Version**: 1.1.0 (Production Release)  
**Classification**: Authoritative Engineering Standard & Operational Runbooks  
**SLA Targets (ACTUAL Operational Bounds)**: **RPO < 15 Minutes** | **RTO < 30 Minutes** | **High Availability: 99.95%**  

> [!IMPORTANT]
> **RPO / RTO Evidence Tiers**:
> - **SIMULATED (Micro-Benchmark)**: In-memory cryptographic pipeline duration (< 20ms). Shows computational throughput ceiling only.
> - **REHEARSED (Staging Disaster Drill)**: End-to-end rehearsal drill (file I/O, encryption, decompression, relational restore, verification: 1.5–2.5 seconds).
> - **ACTUAL (Production Operational SLA)**: **RTO < 30 Minutes** | **RPO < 15 Minutes**. Accounts for cloud host provisioning, snapshot restoration, DNS propagation, and on-call response time. Never present simulated recovery speed as an actual production SLA.

---

## 1. Overview & Triage Philosophy

Failures in production systems are inevitable; unresolved and unrepeatable recoveries are unacceptable. The NetVision Incident Response System is designed around three foundational principles:

1. **Make Failures Detectable**: Differentiate application process failures, database connectivity outages, and external network blips in under 30 seconds.
2. **Make Recovery Repeatable**: Prescribe deterministic, copy-pasteable recovery runbooks with unambiguous rollback and validation commands.
3. **Protect User Trust & Data Integrity**: Maintain zero data loss for learner credentials, prevent secret/PII leakage in logs, and enforce strict RPO/RTO bounds.

---

## 2. Severity Classification & Escalation Matrix

| Severity | Definition | Target Response (MTTD) | Target Recovery (ACTUAL RTO) | Target Data Loss (ACTUAL RPO) | Escalation Path |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **P1 - Critical** | Full site outage, primary database offline, or widespread credential compromise | < 2 minutes | < 30 minutes | < 15 minutes | On-call engineer &rarr; Lead Architect &rarr; Incident Commander |
| **P2 - High** | Degradation of core flows (e.g. auth failures, quiz grading down, migration failure) | < 5 minutes | < 60 minutes | < 15 minutes | On-call engineer &rarr; Service Owner |
| **P3 - Medium** | Non-critical feature failure (e.g. sandbox preview lag, email delivery delay) | < 15 minutes | < 4 hours | N/A | Triage during business hours |
| **P4 - Low** | Cosmetic bug, minor telemetry anomaly, or non-blocking UI issue | Next triage | Next sprint | N/A | Logged in tracking backlog |

---

## 3. Incident Runbook 1: Database Outage

### 3.1 Detection & Symptoms
- **Alert**: `DATABASE_UNHEALTHY` or `HIGH_5XX_ERROR_RATE`.
- **Readiness Probe**: `GET /ready` returns `503 Service Unavailable` with `checks.database: "disconnected"` and `Retry-After: 5`.
- **Liveness Probe**: `GET /health` returns `200 OK` (Node.js process is alive, confirming the failure is isolated to the data layer).
- **Client Error**: Learners receive sanitized `503 Service Unavailable` error pages without exposed credentials or connection strings.

### 3.2 Immediate Triage Steps
1. **Differentiate DB Outage vs Application Crash**:
   ```bash
   # Test process liveness (does not query database)
   curl -i https://api.netvision.edu/health
   # Expected: HTTP 200 OK

   # Test database readiness
   curl -i https://api.netvision.edu/ready
   # Expected: HTTP 503 Service Unavailable with Retry-After header
   ```
2. **Inspect Database Error Classification**:
   Check server logs for sanitized error code:
   - `P1001`: Can't reach database server (network or host offline).
   - `P1002`: Database server was reached but timed out.
   - `P1003`: Database does not exist.
   - `PROVIDER_QUOTA`: Neon/cloud compute quota exceeded.

### 3.3 Recovery Procedure
1. **If Compute Quota Exceeded**:
   - Access Neon / cloud console and adjust compute quota or upgrade capacity.
   - Do NOT enter manual retry loops; the application fails fast (<50ms) to avoid thread starvation.
2. **If PostgreSQL Instance Crashed or Terminated**:
   - Restart the PostgreSQL service or switch to a standby replica:
     ```bash
     # Local Docker recovery:
     docker compose restart postgres
     # Verify container health
     docker compose ps postgres
     ```
3. **If Database Corrupted or Unrecoverable (PITR Restore)**:
   - Identify latest verified daily backup and replay WAL logs up to the failure timestamp $T_{fail}$:
     ```bash
     # Decrypt backup
     openssl enc -d -aes-256-gcm -in backup_latest.sql.gz.enc -out backup_latest.sql.gz -pass file:/etc/netvision/backup_key.bin
     # Verify SHA-256 integrity
     sha256sum -c backup_latest.sql.gz.sha256
     # Restore into new database instance
     gunzip -c backup_latest.sql.gz | psql "$NEW_DATABASE_URL"
     ```
   - Update `DATABASE_URL` and `DIRECT_URL` in hosting provider (Render / Kubernetes secrets).
   - Run verification test:
     ```bash
     curl -i https://api.netvision.edu/ready
     # Verify HTTP 200 OK
     ```

---

## 4. Incident Runbook 2: Deployment Failure

### 4.1 Detection & Symptoms
- **Alert**: Container deployment failed, crash loop backoff, or failed readiness probes.
- **Probe Status**: Upstream reverse proxy reports `502 Bad Gateway` on the new deployment revision.

### 4.2 Immediate Rollback Procedure
1. **Render Web Service Rollback**:
   - Navigate to **Render Dashboard &rarr; netvision-backend &rarr; Events**.
   - Click **Rollback** on the preceding successful deploy.
2. **Vercel Frontend Rollback**:
   - Navigate to **Vercel Dashboard &rarr; Deployments**.
   - Locate previous production deployment &rarr; Click **Instant Rollback**.
3. **Manual Container Rollback (Docker)**:
   ```bash
   docker tag netvision-backend:previous netvision-backend:latest
   docker compose up -d --no-deps backend
   ```

### 4.3 Post-Rollback Diagnostics
1. Inspect deployment logs for:
   - Missing required environment variables (`DATABASE_URL`, `JWT_SECRET`).
   - Native module architecture mismatches (e.g. `argon2` compiled against incorrect Node/glibc version).
   - Prisma schema drift or missing compiled migrations.

---

## 5. Incident Runbook 3: Credential & Secret Exposure

### 5.1 Detection & Symptoms
- Secret detected in public GitHub repository, commit diff, client bundle, or third-party log.
- Suspicious auth spikes from unauthorized IP addresses.

### 5.2 Emergency Remediation Protocol
1. **Assess Compromised Scope**:
   - `JWT_SECRET`: Attacker can forge user tokens.
   - `DATABASE_URL`: Attacker has direct database access.
   - `RESEND_API_KEY`: Attacker can send emails from NetVision domain.
2. **Execute Zero-Downtime Secret Rotation**:
   - **For JWT_SECRET**:
     1. Deploy backend with dual-key verification support:
        - `JWT_SECRET_NEW`: Used for all newly signed tokens.
        - `JWT_SECRET_LEGACY`: Accepted for existing user sessions during transition.
     2. Invalidate all existing sessions via the global token revocation cutoff:
        ```bash
        # Trigger global revocation via admin API
        curl -X POST https://api.netvision.edu/api/v1/auth/revoke-all \
          -H "Authorization: Bearer <SECURE_ADMIN_TOKEN>"
        ```
     3. This immediately writes the current UTC timestamp to `auth:revocation:global_cutoff` in Redis.
     4. Any JWT issued prior to this timestamp is instantly rejected at the authentication guard.
3. **For DATABASE_URL**:
   - Rotate database password in PostgreSQL host / Neon console immediately.
   - Update `DATABASE_URL` and `DIRECT_URL` in Render environment settings.
   - Trigger zero-downtime service restart.

---

## 6. Incident Runbook 4: Database Migration Failure

### 6.1 Detection & Symptoms
- Deployment halts during `npx prisma migrate deploy` step with non-zero exit code.
- Logs display `P2021` (Table does not exist) or `P2022` (Column does not exist).

### 6.2 Remediation Procedure
1. **Transactional Rollback Verification**:
   - All NetVision Prisma migrations run inside transactional DDL blocks (`BEGIN ... COMMIT`).
   - If a statement fails, PostgreSQL rolls back changes automatically.
2. **Inspect Migration Status**:
   ```bash
   cd backend
   npx prisma migrate status
   ```
3. **Mark Failed Migration as Rolled Back**:
   ```bash
   npx prisma migrate resolve --rolled-back "<migration_name>"
   ```
4. **Fix Schema & Reapply**:
   - Correct the SQL statement in `backend/prisma/migrations/<migration_name>/migration.sql`.
   - Reapply on staging database to confirm compatibility before production deploy.

---

## 7. Incident Runbook 5: Authentication Incident & Token Reuse

### 7.1 Detection & Symptoms
- **Alert**: `TOKEN_REUSE_DETECTED` or `ELEVATED_AUTH_FAILURES`.
- Log entry: `[SECURITY_AUDIT] TOKEN_REUSE_DETECTED | User: usr-... | IP: ...`.
- Cause: An attacker attempted to present an already-rotated refresh token.

### 7.2 Containment & Countermeasures
1. **Automatic Family Revocation**:
   - NetVision implements Refresh Token Family Rotation.
   - When token reuse is detected, `TokenRevocationService` automatically invalidates the entire token family for that user.
   - The compromised user is immediately logged out of all active devices.
2. **Brute-Force & OTP Flooding Defense**:
   - `RateLimiterGuard` enforces strict tiers:
     - Auth endpoints (`/auth/login`, `/auth/register`): 10 requests per minute per IP.
     - OTP validation (`/auth/verify-otp`): Maximum 3 consecutive failed attempts before 15-minute lockout.
3. **Administrative Manual Lockout**:
   ```bash
   # Revoke all sessions for a specific user
   curl -X POST https://api.netvision.edu/api/v1/admin/users/<USER_ID>/revoke-sessions \
     -H "Authorization: Bearer <ADMIN_TOKEN>"
   ```

---

## 8. Monitoring System Load Safety

To guarantee that the monitoring system never causes or exacerbates a database outage:

1. **Short-Lived Probe Cache (TTL: 2,000ms)**:
   - Database health check queries are cached in-memory for 2 seconds.
   - Repeated probes from load balancers, Kubernetes liveness checks, and external uptime bots are served from memory (0 database queries).
2. **In-Flight Promise Coalescing**:
   - If 10 concurrent requests arrive while a database probe is executing, all 10 requests await the single in-flight promise.
   - Exactly **1 query** (`SELECT 1`) is issued to the database.
3. **Strict Query Timeout (2,000ms)**:
   - Health probes are race-bounded by a 2-second timer.
   - If the database hangs or connection pool is exhausted, the probe fails fast with an explicit timeout error rather than consuming connection pool slots indefinitely.

---

## 9. Authoritative External Monitoring & Probe Infrastructure

To ensure operational monitoring capability is actually proven rather than existing only as passive documentation:

1. **Automated External Synthetic Probe Runner**:
   - Location: `backend/scripts/external-synthetic-probe.ts`
   - Queries production endpoints (`/api/v1/health`, `/api/v1/ready`, `/api/v1/monitoring/alerts`).
   - Evaluates explicit alert conditions:
     - `PROCESS_LIVENESS_FAILED`: Node process down or returning non-200.
     - `DATABASE_OUTAGE_DETECTED`: 503 Service Unavailable or `checks.database === 'disconnected'`.
     - `PROBE_LATENCY_EXCEEDED`: External round-trip probe latency exceeds 2,500ms.
     - `SUBSYSTEM_OPERATIONAL_ALERT`: Subsystem status not `NOMINAL` or active alert count > 0.
2. **Authoritative Alert Dispatch**:
   - Outbound Webhook: Dispatches structured JSON alerts to `ALERT_WEBHOOK_URL` (Discord / Slack / PagerDuty / generic webhook).
   - Host Incident Log Sink: Persists full incident details to `.storage/incidents/incident-<id>.json` to ensure 100% auditability even if outbound webhooks fail.
3. **Scheduled Automated Probes via CI/CD**:
   - Workflow: `.github/workflows/synthetic-monitoring.yml` runs every 30 minutes on GitHub Actions and supports manual on-demand triggers.
4. **Third-Party SaaS Integration Evaluation Status**:
   - Evaluated: UptimeRobot, Better Stack.
   - Configuration Status: Ready for webhook target binding via `ALERT_WEBHOOK_URL`. Not hardcoded or dependent on external paid vendors.

---

## 10. Health Monitoring Load Safety & Database Impact Measurements

To ensure health monitoring never causes or exacerbates a database outage:

| Metric | Measurement / Ceiling | Architectural Mechanism |
| :--- | :---: | :--- |
| **Max Database Queries / Minute** | **30 queries / min** | Strict 2,000ms in-memory probe cache (`DB_PROBE_CACHE_TTL_MS`) |
| **Normal Probe Load (60s interval)** | **1 query / min** | Single lightweight `SELECT 1` per probe window (< 0.01% DB compute) |
| **Peak Concurrent DB Connections** | **1 connection** | In-flight Promise Coalescing (`inFlightDbCheck`) folds concurrent probes |
| **Cache Hit Rate Under Load** | **> 95%** | Repeated queries served in < 0.1ms from memory without database contact |
| **Query Timeout Ceiling** | **2,000ms** | Timed race promise guarantees health probes fail fast rather than locking pool slots |
| **Process Liveness Separation** | **0 DB queries** | `/health` checks process only; database is checked exclusively on `/ready` |
