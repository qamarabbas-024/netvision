# NetVision Monitoring & Observability Blueprint v1

## 1. Overview & Architectural Goals

The NetVision Monitoring & Observability framework provides production-grade operational telemetry, distributed request tracing, anti-leak redaction, and health probing while ensuring **zero leakage** of sensitive credentials, JWTs, OTPs, or connection strings.

```
Incoming Request
    │
    ▼
[ RequestCorrelationMiddleware ] ─── Attaches / Sanitizes X-Request-ID
    │
    ▼
[ RateLimiterGuard ] ────────────── Records rate-limiting audit events
    │
    ▼
[ Route Handler / Service ] ─────── Business logic execution (Auth/Sandbox/Troubleshooting)
    │                                └─ Emits [AUTH_AUDIT] / [SANDBOX_AUDIT]
    ▼
[ LoggingInterceptor ] ──────────── Records duration, status, structured access logs
    │
    ▼
[ AllExceptionsFilter ] ─────────── Sanitizes error response, propagates X-Request-ID
```

---

## 2. Health & Readiness Probes

NetVision cleanly distinguishes between process liveness and subsystem readiness:

### 2.1 Liveness Probe (`GET /api/v1/health` & `GET /api/v1/health/live`)
- **Purpose**: Verifies that the Node.js / NestJS process is running, responding, and accepting HTTP connections.
- **Used By**: Kubernetes Liveness Probes, Docker healthchecks, Render/Railway keep-alive probes.
- **HTTP Status**: `200 OK` (when running).
- **Payload Schema**:
  ```json
  {
    "status": "ok",
    "service": "NetVision API",
    "database": "healthy",
    "uptimeSeconds": 3600,
    "timestamp": "2026-08-17T12:00:00.000Z",
    "version": "1.0.0"
  }
  ```

### 2.2 Readiness Probe (`GET /api/v1/ready` & `GET /api/v1/health/ready`)
- **Purpose**: Verifies that required backend infrastructure dependencies (PostgreSQL database) are healthy and able to serve queries.
- **HTTP Status**:
  - `200 OK`: Database connected and responsive.
  - `503 Service Unavailable`: Database disconnected or query failed.
- **Payload Schema (Healthy)**:
  ```json
  {
    "status": "ready",
    "service": "NetVision API",
    "timestamp": "2026-08-17T12:00:00.000Z",
    "checks": {
      "database": "connected",
      "databaseLatencyMs": 3,
      "mailProvider": "resend",
      "mailConfigured": true
    }
  }
  ```
- **Payload Schema (Degraded / Unhealthy)**:
  ```json
  {
    "status": "unhealthy",
    "service": "NetVision API",
    "timestamp": "2026-08-17T12:00:00.000Z",
    "checks": {
      "database": "disconnected",
      "databaseLatencyMs": 1500,
      "mailProvider": "resend",
      "mailConfigured": true
    },
    "error": "Database connection check failed"
  }
  ```

### 2.3 Metrics Summary (`GET /api/v1/monitoring/metrics`)
- Returns rolling counts for requests, 2xx, 4xx, 5xx status codes, and average latency.

---

## 3. Request Correlation (`X-Request-ID`)

Every incoming HTTP request is assigned a unique, correlation identifier:

1. **Client-Provided IDs**: If a client passes an `X-Request-ID` or `X-Correlation-ID` header, it is validated and sanitized against `^[A-Za-z0-9\-_]{4,64}$`.
2. **Auto-Generated IDs**: If absent or invalid, a secure ID is generated: `nv-req-<base36_timestamp>-<hex_bytes>`.
3. **Response Echo**: The `X-Request-ID` header is attached to all outbound responses and error payloads.
4. **Log Tracing**: Every access log and exception log prefixes messages with `[<requestId>]`.

---

## 4. Redaction & Data Protection Policy

NetVision implements strict zero-leakage redaction rules across all logging, interceptors, and exception filters:

| Category | Sensitive Fields Masked / Redacted |
|---|---|
| **Authentication & Tokens** | `password`, `token`, `accessToken`, `refreshToken`, `jwt`, `secret`, `apiKey` |
| **Verification & OTPs** | `otp`, `code`, `verificationCode`, `rawOtp` |
| **HTTP Headers** | `Authorization: Bearer [REDACTED]`, `Cookie: [REDACTED]` |
| **Database & Services** | `postgresql://***`, `redis://***`, `mongodb://***`, `re_***` (Resend API Keys) |
| **Exceptions & Errors** | Internal stack traces and database credentials are masked in production client responses. |

---

## 5. Security & Lifecycle Audit Events

Structured audit events are recorded for observability and security forensics:

### 5.1 Auth Audit Events (`[AUTH_AUDIT]`)
- `LOGIN_SUCCESS`: Successful authentication with sanitized username/email.
- `LOGIN_FAILED`: Failed credentials or user-not-found (prevents account enumeration).
- `REGISTER_SUCCESS`: Account creation.
- `OAUTH_SUCCESS`: Google/GitHub OAuth login completion.
- `PASSWORD_RESET_REQUEST`: Password reset dispatched.
- `RATE_LIMIT_EXCEEDED`: Repeated failed auth attempts or rate limit violations.

### 5.2 Sandbox Lifecycle Events (`[SANDBOX_AUDIT]`)
- `SESSION_CREATED`: Virtual topology initialized.
- `COMMAND_EXECUTED`: Sanitized CLI command execution and exit code.
- `FORBIDDEN_COMMAND`: Dangerous command blocked by sandbox security filter.
- `SESSION_TERMINATED`: Clean teardown of sandbox environment.

---

## 6. Frontend Observability

The frontend includes a lightweight, production-safe telemetry sink (`frontend/lib/telemetry.ts`):
- Automatically catches uncaught errors (`window.onerror`, `unhandledrejection`).
- Traces API failures with correlation IDs from `fetchApi`.
- Redacts authorization headers and query tokens before capturing.
- Ready for plug-and-play Sentry / OpenTelemetry integration via `telemetry.addSink(sentrySink)`.

---

## 7. Operational Troubleshooting Runbook

1. **Service Unreachable / 503 Returned**:
   - Check `GET /api/v1/ready`. If `database: "disconnected"`, inspect PostgreSQL container health or connection string.
2. **Investigating a User Error Report**:
   - Ask user for `X-Request-ID` from response headers or error toast.
   - Search server logs for `[nv-req-...]` to inspect exact execution path, latency, and sanitized error stack.
3. **High 429 Rate Limiting**:
   - Filter logs for `[AUTH_AUDIT] RATE_LIMIT_EXCEEDED` to identify abusive IP addresses.
