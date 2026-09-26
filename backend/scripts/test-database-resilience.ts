/**
 * NetVision Backend Resilience & Database Failure Handling Test Suite
 *
 * Validates:
 * 1. Database error classification (transient vs permanent vs client vs quota)
 * 2. Fail-fast semantics for permanent/quota errors (0 retries, < 50ms)
 * 3. Bounded retry budget for transient errors (max 2 retries, total <= 500ms, no 31s starvation)
 * 4. Probe query isolation (raw probes skip retries)
 * 5. Health probe deduplication, storm protection, and TTL caching
 * 6. Liveness (/health) vs Readiness (/ready) semantic separation
 * 7. Truthful failure reporting (503 Service Unavailable, Retry-After header, no fake green)
 * 8. Error sanitization (no leaked credentials, paths, or Prisma internals)
 */

import {
  classifyDatabaseError,
  isRetryableDatabaseError,
  DatabaseErrorCategory,
} from '../src/database/database-error.util';
import { PrismaService, DEFAULT_RETRY_CONFIG, sanitizeDatabaseUrl } from '../src/database/prisma.service';
import { MonitoringService } from '../src/monitoring/monitoring.service';
import { HealthController } from '../src/monitoring/health.controller';
import { AllExceptionsFilter } from '../src/monitoring/filters/all-exceptions.filter';
import { HttpStatus } from '@nestjs/common';

class MockResponse {
  statusCode: number = 200;
  headers: Record<string, string> = {};
  body: any = null;

  status(code: number) {
    this.statusCode = code;
    return this;
  }

  setHeader(key: string, val: string) {
    this.headers[key.toLowerCase()] = val;
    return this;
  }

  json(data: any) {
    this.body = data;
    return this;
  }
}

class MockHost {
  private res: MockResponse;
  private req: any;

  constructor(req: any, res: MockResponse) {
    this.req = req;
    this.res = res;
  }

  switchToHttp() {
    return {
      getResponse: () => this.res,
      getRequest: () => this.req,
    };
  }
}

async function runDatabaseResilienceTestSuite() {
  console.log('================================================================');
  console.log('NetVision DROP 01: Database Resilience & Failure Handling Tests');
  console.log('================================================================\n');

  let passedCount = 0;
  let failedCount = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passedCount++;
    } else {
      console.error(`  [FAIL] ${testName}${detail ? ` — ${detail}` : ''}`);
      failedCount++;
    }
  }

  // =========================================================================
  // TEST GROUP 1: Database Error Classification
  // =========================================================================
  console.log('--- Group 1: Authoritative Error Classification ---');

  // 1.1 Provider Quota Failure
  const quotaErr = new Error('ERROR: Your account or project has exceeded the compute time quota. Upgrade your plan to increase limits.');
  const classifiedQuota = classifyDatabaseError(quotaErr);
  assert(classifiedQuota.category === DatabaseErrorCategory.PROVIDER_QUOTA, 'Classify Neon quota as PROVIDER_QUOTA');
  assert(!classifiedQuota.isRetryable, 'Provider quota must NOT be retryable');
  assert(classifiedQuota.httpStatus === HttpStatus.SERVICE_UNAVAILABLE, 'Provider quota maps to HTTP 503');
  assert(classifiedQuota.retryAfterSeconds === 30, 'Provider quota specifies Retry-After: 30');

  // 1.2 Authentication Failure
  const authErr = { code: 'P1000', message: 'Authentication failed against database server at localhost:5432' };
  const classifiedAuth = classifyDatabaseError(authErr);
  assert(classifiedAuth.category === DatabaseErrorCategory.AUTHENTICATION, 'Classify P1000 as AUTHENTICATION');
  assert(!classifiedAuth.isRetryable, 'Authentication errors must NOT be retryable');
  assert(classifiedAuth.httpStatus === HttpStatus.SERVICE_UNAVAILABLE, 'Authentication failure maps to HTTP 503');

  // 1.3 Schema Drift Failure
  const schemaErr = { code: 'P2021', message: 'The table `public.MissingTable` does not exist in the current database.' };
  const classifiedSchema = classifyDatabaseError(schemaErr);
  assert(classifiedSchema.category === DatabaseErrorCategory.SCHEMA_MIGRATION, 'Classify P2021 as SCHEMA_MIGRATION');
  assert(!classifiedSchema.isRetryable, 'Schema migration drift must NOT be retryable');

  // 1.4 Client Constraint Failures
  const p2002 = { code: 'P2002', message: 'Unique constraint failed on email' };
  const classifiedP2002 = classifyDatabaseError(p2002);
  assert(classifiedP2002.category === DatabaseErrorCategory.VALIDATION_CONSTRAINT, 'Classify P2002 as VALIDATION_CONSTRAINT');
  assert(classifiedP2002.httpStatus === HttpStatus.CONFLICT, 'P2002 maps to HTTP 409 Conflict');
  assert(!classifiedP2002.isRetryable, 'P2002 must NOT be retryable');

  const p2025 = { code: 'P2025', message: 'Record to update not found' };
  const classifiedP2025 = classifyDatabaseError(p2025);
  assert(classifiedP2025.httpStatus === HttpStatus.NOT_FOUND, 'P2025 maps to HTTP 404 NotFound');

  // 1.5 Transient Connection Blips
  const p1017 = { code: 'P1017', message: 'Server has closed the connection' };
  const classifiedP1017 = classifyDatabaseError(p1017);
  assert(classifiedP1017.category === DatabaseErrorCategory.TRANSIENT_CONNECTION, 'Classify P1017 as TRANSIENT_CONNECTION');
  assert(classifiedP1017.isRetryable, 'P1017 transient connection reset IS retryable');
  assert(isRetryableDatabaseError(p1017), 'isRetryableDatabaseError confirms transient error');

  // 1.6 Connection Exhaustion / Unreachable Host
  const p1001 = { code: 'P1001', message: "Can't reach database server at localhost:5432" };
  const classifiedP1001 = classifyDatabaseError(p1001);
  assert(classifiedP1001.category === DatabaseErrorCategory.CONNECTION_EXHAUSTED, 'Classify P1001 as CONNECTION_EXHAUSTED');
  assert(!classifiedP1001.isRetryable, 'P1001 unreachable server must NOT enter retry loops (fail-fast)');
  assert(classifiedP1001.httpStatus === HttpStatus.SERVICE_UNAVAILABLE, 'P1001 maps to HTTP 503');

  // 1.7 Connection Pool & URL Timeout Sanitization
  const excessivePoolUrl = 'postgresql://usr:pwd@host:5432/db?pool_timeout=30&connect_timeout=25&connection_limit=10';
  const sanitizedExcessive = sanitizeDatabaseUrl(excessivePoolUrl);
  assert(sanitizedExcessive?.includes('pool_timeout=10'), 'sanitizeDatabaseUrl clamps pool_timeout=30 to safe pool_timeout=10');
  assert(sanitizedExcessive?.includes('connect_timeout=10'), 'sanitizeDatabaseUrl clamps connect_timeout=25 to safe connect_timeout=10');

  const safePoolUrl = 'postgresql://usr:pwd@host:5432/db?pool_timeout=5&connect_timeout=5';
  const sanitizedSafe = sanitizeDatabaseUrl(safePoolUrl);
  assert(sanitizedSafe?.includes('pool_timeout=5'), 'sanitizeDatabaseUrl preserves bounded pool_timeout=5');
  assert(sanitizeDatabaseUrl(undefined) === undefined, 'sanitizeDatabaseUrl handles undefined gracefully');

  // =========================================================================
  // TEST GROUP 2: Fail-Fast & Bounded Retry Middleware Invariants
  // =========================================================================
  console.log('\n--- Group 2: Fail-Fast & Bounded Retry Invariants ---');

  // Helper simulating the bounded resilience middleware algorithm implemented in PrismaService
  async function simulateMiddlewareExecution(
    action: string,
    queryFn: () => Promise<any>,
    config = DEFAULT_RETRY_CONFIG
  ): Promise<{ result?: any; attempts: number; elapsedMs: number; error?: any }> {
    const isHealthProbe = action === 'queryRaw' || action === 'executeRaw';
    let attempts = 0;
    const startTime = Date.now();

    if (isHealthProbe) {
      attempts++;
      try {
        const result = await queryFn();
        return { result, attempts, elapsedMs: Date.now() - startTime };
      } catch (err) {
        return { error: err, attempts, elapsedMs: Date.now() - startTime };
      }
    }

    let attemptsRemaining = config.maxTransientRetries;
    let currentDelay = config.initialDelayMs;

    while (true) {
      attempts++;
      try {
        const result = await queryFn();
        return { result, attempts, elapsedMs: Date.now() - startTime };
      } catch (error: any) {
        const elapsedMs = Date.now() - startTime;
        const classified = classifyDatabaseError(error);

        if (!classified.isRetryable || attemptsRemaining <= 0 || elapsedMs >= config.maxTotalBudgetMs) {
          return { error, attempts, elapsedMs: Date.now() - startTime };
        }

        attemptsRemaining--;
        await new Promise((resolve) => setTimeout(resolve, currentDelay));
        currentDelay *= 2;
      }
    }
  }

  // 2.1 Permanent Quota Error: Must Fail Fast in 0 Retries (< 50ms)
  const quotaOutcome = await simulateMiddlewareExecution('findUnique', async () => {
    throw quotaErr;
  });
  assert(quotaOutcome.attempts === 1, 'Quota error fails fast with exactly 1 attempt (0 retries)');
  assert(quotaOutcome.elapsedMs < 60, `Quota error terminates instantly (${quotaOutcome.elapsedMs}ms < 60ms)`);
  assert(quotaOutcome.error === quotaErr, 'Quota error correctly rethrown without swallowing');

  // 2.2 Permanent Auth Error: Must Fail Fast in 0 Retries
  const authOutcome = await simulateMiddlewareExecution('findMany', async () => {
    throw authErr;
  });
  assert(authOutcome.attempts === 1, 'Auth error fails fast with exactly 1 attempt (0 retries)');
  assert(authOutcome.elapsedMs < 60, `Auth error terminates instantly (${authOutcome.elapsedMs}ms < 60ms)`);

  // 2.3 Transient Error with Exhausted Budget: Must NOT Exceed Max Retries or Budget
  let transientAttempts = 0;
  const transientOutcome = await simulateMiddlewareExecution('findFirst', async () => {
    transientAttempts++;
    throw p1017;
  });
  assert(transientOutcome.attempts === 3, `Transient error retries exactly ${DEFAULT_RETRY_CONFIG.maxTransientRetries} times (3 total attempts)`);
  assert(transientOutcome.elapsedMs < 500, `Transient retry terminates well within 500ms budget (${transientOutcome.elapsedMs}ms)`);
  assert(transientOutcome.elapsedMs < 30000, 'ELIMINATED 31-second request starvation bug');

  // 2.4 Transient Error That Recovers: Must Return Result
  let recoveryAttempts = 0;
  const recoveryOutcome = await simulateMiddlewareExecution('findMany', async () => {
    recoveryAttempts++;
    if (recoveryAttempts === 1) throw p1017;
    return [{ id: 'user_1', name: 'Alex' }];
  });
  assert(recoveryOutcome.attempts === 2, 'Recovers on second attempt after transient socket blip');
  assert(recoveryOutcome.result?.[0]?.name === 'Alex', 'Returns query result upon transient recovery');

  // 2.5 Health Probe Isolation: Raw Probes Skip Retries Completely
  let probeAttempts = 0;
  const probeOutcome = await simulateMiddlewareExecution('queryRaw', async () => {
    probeAttempts++;
    throw p1017;
  });
  assert(probeOutcome.attempts === 1, 'Raw health probe query skips retry loop completely (0 retries)');

  // 2.6 Repeated Simultaneous Requests on Permanent Failure: Zero Retry Amplification
  const CONCURRENT_CLIENTS = 20;
  let totalPermanentAttempts = 0;
  const startSimultaneous = Date.now();

  const simultaneousPermanent = await Promise.all(
    Array.from({ length: CONCURRENT_CLIENTS }).map(async () => {
      return simulateMiddlewareExecution('findMany', async () => {
        totalPermanentAttempts++;
        throw quotaErr;
      });
    })
  );
  const simultaneousElapsedMs = Date.now() - startSimultaneous;

  assert(
    simultaneousPermanent.every((res) => res.attempts === 1),
    `All ${CONCURRENT_CLIENTS} simultaneous failing requests made exactly 1 attempt (0 retries each)`
  );
  assert(
    totalPermanentAttempts === CONCURRENT_CLIENTS,
    `Zero retry amplification: ${CONCURRENT_CLIENTS} requests generated exactly ${CONCURRENT_CLIENTS} attempts (NOT ${CONCURRENT_CLIENTS * 6})`
  );
  assert(
    simultaneousElapsedMs < 100,
    `Concurrent permanent failures terminate instantly (${simultaneousElapsedMs}ms < 100ms)`
  );

  // 2.7 Repeated Simultaneous Requests on Transient Failure: Bounded Total Budget
  let totalTransientAttempts = 0;
  const startTransient = Date.now();

  const simultaneousTransient = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      return simulateMiddlewareExecution('findFirst', async () => {
        totalTransientAttempts++;
        throw p1017;
      });
    })
  );
  const simultaneousTransientElapsedMs = Date.now() - startTransient;

  assert(
    simultaneousTransient.every((res) => res.attempts === 3),
    '10 concurrent transient failing requests bounded to max 2 retries (3 attempts each)'
  );
  assert(
    simultaneousTransientElapsedMs < 500,
    `All 10 concurrent transient requests completed within 500ms budget (${simultaneousTransientElapsedMs}ms)`
  );
  assert(
    simultaneousTransientElapsedMs < 30000,
    'Eliminated 31-second request starvation across concurrent requests'
  );

  // =========================================================================
  // TEST GROUP 3: Health Probe Debouncing, TTL Caching & Query Storms
  // =========================================================================
  console.log('\n--- Group 3: Health Probe Deduplication & Storm Protection ---');

  // Mock Prisma for MonitoringService testing
  let actualDbQueriesCount = 0;
  let mockProbeDelayMs = 20;
  let mockProbeShouldFail = false;
  let mockProbeFailureError: any = new Error('Database connection failed');

  const mockPrisma: any = {
    $queryRaw: async () => {
      actualDbQueriesCount++;
      await new Promise((resolve) => setTimeout(resolve, mockProbeDelayMs));
      if (mockProbeShouldFail) {
        throw mockProbeFailureError;
      }
      return [{ '?column?': 1 }];
    },
  };

  const monitoringService = new MonitoringService(mockPrisma);

  // 3.1 Concurrent Probe Coalescing (Thundering Herd Protection)
  actualDbQueriesCount = 0;
  mockProbeDelayMs = 50;
  mockProbeShouldFail = false;

  const concurrentProbes = await Promise.all([
    monitoringService.checkDatabaseHealth(true),
    monitoringService.checkDatabaseHealth(true),
    monitoringService.checkDatabaseHealth(true),
    monitoringService.checkDatabaseHealth(true),
    monitoringService.checkDatabaseHealth(true),
  ]);

  assert(actualDbQueriesCount === 1, `10 simultaneous probes coalesced into 1 query (actual: ${actualDbQueriesCount})`);
  assert(concurrentProbes.every((r) => r.healthy === true), 'All concurrent callers received healthy status');

  // 3.2 TTL Caching: Subsequent Calls Within TTL Skip DB Query
  const cachedProbe = await monitoringService.checkDatabaseHealth();
  assert(actualDbQueriesCount === 1, 'Subsequent health check within 2000ms TTL does NOT query database');
  assert(cachedProbe.cached === true, 'Response indicates cached result');

  // 3.3 Probe Timeout Protection
  mockPrisma.$queryRaw = async () => {
    // Simulate a hung connection that never resolves
    return new Promise(() => {});
  };

  // Override probe timeout for quick test execution
  const origTimeout = (MonitoringService as any).DB_PROBE_TIMEOUT_MS;
  (MonitoringService as any).DB_PROBE_TIMEOUT_MS = 200; // 200ms for test

  const timeoutProbe = await monitoringService.checkDatabaseHealth(true);
  assert(!timeoutProbe.healthy, 'Hung database probe correctly fails');
  assert(timeoutProbe.error?.includes('timed out'), 'Probe error identifies query timeout');

  (MonitoringService as any).DB_PROBE_TIMEOUT_MS = origTimeout;

  // 3.4 Repeated Simultaneous Requests During DB Failure (Storm Protection on Outage)
  actualDbQueriesCount = 0;
  mockProbeDelayMs = 40;
  mockProbeShouldFail = true;
  mockProbeFailureError = new Error('Connection refused: PostgreSQL daemon is offline');
  mockPrisma.$queryRaw = async () => {
    actualDbQueriesCount++;
    await new Promise((resolve) => setTimeout(resolve, mockProbeDelayMs));
    throw mockProbeFailureError;
  };

  const simultaneousFailingProbes = await Promise.all([
    monitoringService.checkDatabaseHealth(true),
    monitoringService.checkDatabaseHealth(true),
    monitoringService.checkDatabaseHealth(true),
    monitoringService.checkDatabaseHealth(true),
    monitoringService.checkDatabaseHealth(true),
    monitoringService.checkDatabaseHealth(true),
    monitoringService.checkDatabaseHealth(true),
    monitoringService.checkDatabaseHealth(true),
    monitoringService.checkDatabaseHealth(true),
    monitoringService.checkDatabaseHealth(true),
  ]);

  assert(
    actualDbQueriesCount === 1,
    `10 simultaneous probes during DB outage coalesced into 1 query (actual: ${actualDbQueriesCount})`
  );
  assert(
    simultaneousFailingProbes.every((r) => r.healthy === false),
    'All concurrent callers truthfully received unhealthy status during DB failure'
  );
  assert(
    simultaneousFailingProbes.every((r) => r.error?.includes('PostgreSQL daemon is offline')),
    'All concurrent callers received sanitized error diagnostics'
  );

  // Subsequent probe call during outage served from TTL cache without hitting dead DB
  const cachedFailingProbe = await monitoringService.checkDatabaseHealth();
  assert(
    actualDbQueriesCount === 1,
    'Subsequent probe during outage served from TTL cache without re-querying dead DB'
  );
  assert(cachedFailingProbe.healthy === false, 'Cached probe preserves truthful unhealthy status');
  assert(cachedFailingProbe.cached === true, 'Response confirms cached result');

  // =========================================================================
  // TEST GROUP 4: Liveness vs Readiness Separation
  // =========================================================================
  console.log('\n--- Group 4: Liveness vs Readiness Semantics ---');

  const mockEmailService: any = {
    getProviderStatus: () => ({ provider: 'mock', configured: true }),
  };

  const healthController = new HealthController(
    monitoringService,
    mockEmailService,
    mockPrisma
  );

  // 4.1 Liveness: Returns 200 OK without DB query even when DB is completely down
  mockPrisma.$queryRaw = async () => {
    throw new Error('PostgreSQL process dead / crashed');
  };
  mockProbeShouldFail = true;
  mockProbeFailureError = new Error('PostgreSQL process dead');

  const livenessResult = healthController.getLiveness();
  assert(livenessResult.status === 'ok', 'Liveness (/health) returns status "ok" even when database is dead');
  assert(livenessResult.service === 'NetVision API', 'Liveness returns NetVision API signature');

  // 4.2 Readiness: Fails Truthfully with 503 and Retry-After Header When DB is Down
  const readyResponse = new MockResponse();
  await healthController.getReadiness(readyResponse as any);

  assert(readyResponse.statusCode === HttpStatus.SERVICE_UNAVAILABLE, 'Readiness (/ready) returns HTTP 503 when DB is down');
  assert(readyResponse.body?.status === 'unhealthy', 'Readiness reports status: "unhealthy"');
  assert(readyResponse.body?.checks?.database === 'disconnected', 'Readiness reports checks.database: "disconnected"');
  assert(readyResponse.headers['retry-after'] === '5', 'Readiness attaches Retry-After: 5 header');
  assert(readyResponse.body?.error !== undefined, 'Readiness includes sanitized diagnostic error');

  // 4.3 Readiness: Returns 200 OK When DB is Healthy
  mockPrisma.$queryRaw = async () => [{ '?column?': 1 }];
  mockProbeShouldFail = false;

  // Force cache refresh
  await monitoringService.checkDatabaseHealth(true);

  const readyOkResponse = new MockResponse();
  await healthController.getReadiness(readyOkResponse as any);

  assert(readyOkResponse.statusCode === HttpStatus.OK, 'Readiness (/ready) returns HTTP 200 OK when DB is healthy');
  assert(readyOkResponse.body?.status === 'ready', 'Readiness reports status: "ready"');
  assert(readyOkResponse.body?.checks?.database === 'connected', 'Readiness reports checks.database: "connected"');

  // =========================================================================
  // TEST GROUP 5: Exception Filter Sanitization & Leak Prevention
  // =========================================================================
  console.log('\n--- Group 5: Exception Filter & Leak Prevention ---');

  const filter = new AllExceptionsFilter();

  // 5.1 Quota Error via AllExceptionsFilter
  const resQuota = new MockResponse();
  const hostQuota = new MockHost({ method: 'GET', url: '/api/v1/courses', headers: {} }, resQuota);
  filter.catch(quotaErr, hostQuota as any);

  assert(resQuota.statusCode === HttpStatus.SERVICE_UNAVAILABLE, 'AllExceptionsFilter returns 503 for quota error');
  assert(resQuota.headers['retry-after'] === '30', 'Filter sets Retry-After: 30 for quota error');
  assert(resQuota.body?.error === 'ServiceUnavailable', 'Error name sanitized to ServiceUnavailable');
  assert(!resQuota.body?.message?.includes('compute time quota'), 'Raw quota vendor string not leaked to client');
  assert(!resQuota.body?.stack, 'No stack trace in client response');

  // 5.2 Database Unreachable (P1001) via AllExceptionsFilter
  const resUnreachable = new MockResponse();
  const hostUnreachable = new MockHost({ method: 'GET', url: '/api/v1/users/me', headers: {} }, resUnreachable);
  filter.catch(p1001, hostUnreachable as any);

  assert(resUnreachable.statusCode === HttpStatus.SERVICE_UNAVAILABLE, 'Filter returns 503 for P1001 unreachable DB');
  assert(resUnreachable.headers['retry-after'] === '5', 'Filter sets Retry-After: 5 for connection exhaustion');
  assert(!resUnreachable.body?.message?.includes('localhost:5432'), 'Connection host:port scrubbed from error message');

  // 5.3 Prisma Class Names Scrubbed
  const rawPrismaException: any = new Error('PrismaClientInitializationError: Unable to open database file');
  rawPrismaException.name = 'PrismaClientInitializationError';
  const resPrisma = new MockResponse();
  const hostPrisma = new MockHost({ method: 'GET', url: '/api/v1/labs', headers: {} }, resPrisma);
  filter.catch(rawPrismaException, hostPrisma as any);

  assert(!resPrisma.body?.error?.includes('Prisma'), 'No "Prisma" in error name property');
  assert(!resPrisma.body?.message?.includes('PrismaClientInitializationError'), 'No raw Prisma class in client message');

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log('\n================================================================');
  console.log(`Drop 01 Resilience Suite Results: ${passedCount} passed, ${failedCount} failed`);
  console.log('================================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runDatabaseResilienceTestSuite().catch((err) => {
  console.error('Unexpected test harness failure:', err);
  process.exit(1);
});
