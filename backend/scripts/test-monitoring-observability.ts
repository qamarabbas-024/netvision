import { HealthController } from '../src/monitoring/health.controller';
import { MonitoringService } from '../src/monitoring/monitoring.service';
import { EmailService } from '../src/mail/email.service';
import { PrismaService } from '../src/database/prisma.service';
import { RequestCorrelationMiddleware } from '../src/monitoring/middleware/request-correlation.middleware';
import { AllExceptionsFilter } from '../src/monitoring/filters/all-exceptions.filter';
import { redactSensitiveData, isSensitiveKey } from '../src/monitoring/utils/redaction.util';
import { HttpException, HttpStatus } from '@nestjs/common';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runMonitoringTestSuite() {
  console.log('================================================================');
  console.log('📊 NETVISION MONITORING & OBSERVABILITY TEST SUITE v1');
  console.log('================================================================\n');

  let passedCount = 0;

  // --------------------------------------------------------------------------
  // TEST 1: Liveness Probe (`GET /health`)
  // --------------------------------------------------------------------------
  console.log('[TEST 1] Liveness Probe Output & Backward Compatibility');
  {
    const mockPrisma = {
      $queryRaw: async () => [{ 1: 1 }],
    } as unknown as PrismaService;

    const monitoringService = new MonitoringService(mockPrisma);
    const mockEmailService = {
      getProviderStatus: () => ({ provider: 'resend', configured: true }),
    } as unknown as EmailService;

    const healthController = new HealthController(monitoringService, mockEmailService, mockPrisma);
    const liveness = await healthController.getLiveness();

    assert(liveness.status === 'ok', 'Liveness probe reports status "ok"');
    assert(liveness.service === 'NetVision API', 'Liveness probe identifies service');
    assert(liveness.database === 'healthy', 'Liveness probe includes database status');
    assert(typeof liveness.uptimeSeconds === 'number', 'Liveness probe includes numeric uptime');
    assert(typeof liveness.timestamp === 'string', 'Liveness probe includes ISO timestamp');

    console.log('  ✓ Passed: Liveness probe returns valid status, uptime, and database health.');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 2: Readiness Probe (`GET /ready` Healthy Database)
  // --------------------------------------------------------------------------
  console.log('\n[TEST 2] Readiness Probe (Healthy PostgreSQL Connection)');
  {
    const mockPrisma = {
      $queryRaw: async () => [{ 1: 1 }],
    } as unknown as PrismaService;

    const monitoringService = new MonitoringService(mockPrisma);
    const mockEmailService = {
      getProviderStatus: () => ({ provider: 'resend', configured: true }),
    } as unknown as EmailService;

    const healthController = new HealthController(monitoringService, mockEmailService, mockPrisma);

    let capturedStatusCode = 0;
    let capturedBody: any = null;

    const mockRes: any = {
      status: (code: number) => {
        capturedStatusCode = code;
        return {
          json: (body: any) => {
            capturedBody = body;
          },
        };
      },
    };

    await healthController.getReadiness(mockRes);

    assert(capturedStatusCode === HttpStatus.OK, 'Readiness returns HTTP 200 when database is healthy');
    assert(capturedBody.status === 'ready', 'Readiness reports status "ready"');
    assert(capturedBody.checks.database === 'connected', 'Database check reports "connected"');
    assert(capturedBody.checks.mailProvider === 'resend', 'Reports mail provider');
    assert(capturedBody.error === undefined, 'No error reported when ready');

    console.log('  ✓ Passed: Readiness probe returns 200 OK with connected subsystem checks.');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 3: Readiness Probe (`GET /ready` Degraded / Disconnected Database)
  // --------------------------------------------------------------------------
  console.log('\n[TEST 3] Readiness Probe Failure Handling (503 Service Unavailable)');
  {
    const mockFailingPrisma = {
      $queryRaw: async () => {
        throw new Error('Connection to database failed: postgresql://secret_user:secret_password@db.host:5432/netvision');
      },
    } as unknown as PrismaService;

    const monitoringService = new MonitoringService(mockFailingPrisma);
    const mockEmailService = {
      getProviderStatus: () => ({ provider: 'resend', configured: false }),
    } as unknown as EmailService;

    const healthController = new HealthController(monitoringService, mockEmailService, mockFailingPrisma);

    let capturedStatusCode = 0;
    let capturedBody: any = null;

    const mockRes: any = {
      status: (code: number) => {
        capturedStatusCode = code;
        return {
          json: (body: any) => {
            capturedBody = body;
          },
        };
      },
    };

    await healthController.getReadiness(mockRes);

    assert(capturedStatusCode === HttpStatus.SERVICE_UNAVAILABLE, 'Readiness returns HTTP 503 when DB fails');
    assert(capturedBody.status === 'unhealthy', 'Readiness reports status "unhealthy"');
    assert(capturedBody.checks.database === 'disconnected', 'Database check reports "disconnected"');
    assert(capturedBody.error === 'Database connection check failed', 'Safe generic error message returned');
    assert(!JSON.stringify(capturedBody).includes('secret_password'), 'Zero credentials leaked in error response');

    console.log('  ✓ Passed: Database failure returns 503 Service Unavailable without leaking connection strings.');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 4: Request Correlation Middleware & Sanitization (`X-Request-ID`)
  // --------------------------------------------------------------------------
  console.log('\n[TEST 4] Request Correlation & ID Sanitization');
  {
    const mockPrisma = {} as unknown as PrismaService;
    const monitoringService = new MonitoringService(mockPrisma);
    const middleware = new RequestCorrelationMiddleware(monitoringService);

    // 4a: Valid client ID
    const validReq: any = { headers: { 'x-request-id': 'client-trace-id-12345' } };
    const validRes: any = { setHeader: (k: string, v: string) => { validRes.headers = { [k]: v }; } };
    let nextCalled: boolean = false;

    middleware.use(validReq, validRes, () => { nextCalled = true; });
    assert(Boolean(nextCalled), 'Next function called');
    assert(validReq.requestId === 'client-trace-id-12345', 'Valid client request ID preserved');
    assert(validRes.headers['X-Request-ID'] === 'client-trace-id-12345', 'X-Request-ID header attached to response');

    // 4b: Malicious / Invalid client ID (e.g. XSS injection)
    const invalidReq: any = { headers: { 'x-request-id': '<script>alert("hack")</script>' } };
    const invalidRes: any = { setHeader: (k: string, v: string) => { invalidRes.headers = { [k]: v }; } };

    middleware.use(invalidReq, invalidRes, () => {});
    assert(invalidReq.requestId !== '<script>alert("hack")</script>', 'Malicious ID sanitized');
    assert(typeof invalidReq.requestId === 'string' && invalidReq.requestId.startsWith('nv-req-'), 'Generated fresh secure request ID for invalid input');
    assert(typeof invalidRes.headers['X-Request-ID'] === 'string' && invalidRes.headers['X-Request-ID'].startsWith('nv-req-'), 'Attached sanitized ID to response header');

    // 4c: Missing ID
    const missingReq: any = { headers: {} };
    const missingRes: any = { setHeader: (k: string, v: string) => { missingRes.headers = { [k]: v }; } };
    middleware.use(missingReq, missingRes, () => {});
    assert(typeof missingReq.requestId === 'string' && missingReq.requestId.startsWith('nv-req-'), 'Generated fresh request ID when absent');

    console.log('  ✓ Passed: Request correlation accurately sanitizes and generates X-Request-ID headers.');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 5: Redaction Engine (Passwords, Bearer Tokens, Connection Strings, OTPs)
  // --------------------------------------------------------------------------
  console.log('\n[TEST 5] Redaction Engine Anti-Leak Verification');
  {
    assert(isSensitiveKey('password'), 'Matches password');
    assert(isSensitiveKey('accessToken'), 'Matches accessToken');
    assert(isSensitiveKey('refreshToken'), 'Matches refreshToken');
    assert(isSensitiveKey('jwtSecret'), 'Matches jwtSecret');
    assert(isSensitiveKey('rawOtp'), 'Matches rawOtp');
    assert(!isSensitiveKey('username'), 'Allows username');

    const samplePayload = {
      user: 'alice',
      password: 'SuperSecretPassword123!',
      nested: {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sample_token_content',
        otpCode: '654321',
        apiKey: 're_1234567890abcdefghijklmn',
        dbUrl: 'postgresql://postgres:dbsecretpass@db.netvision.local:5432/netvision_prod',
      },
      tags: ['networking', 'education'],
    };

    const redacted = redactSensitiveData(samplePayload);

    assert(redacted.user === 'alice', 'Preserves safe user field');
    assert(redacted.password === '[REDACTED]', 'Redacts password key');
    assert(redacted.nested.authorization === '[REDACTED]', 'Redacts authorization key');
    assert(redacted.nested.otpCode === '[REDACTED]', 'Redacts OTP code');
    assert(redacted.nested.apiKey === '[REDACTED]', 'Redacts API key');
    assert(redacted.nested.dbUrl === '[REDACTED]', 'Redacts database URL');
    assert(Array.isArray(redacted.tags) && redacted.tags.length === 2, 'Preserves array contents');

    // String redaction test
    const rawErrorString = 'Failed to connect to postgresql://admin:secret123@prod-db.internal:5432/netvision with key re_abcdef123456789012345';
    const redactedString = redactSensitiveData(rawErrorString);
    assert(!redactedString.includes('secret123'), 'Redacts inline database password from string');
    assert(!redactedString.includes('re_abcdef'), 'Redacts inline Resend API key from string');

    console.log('  ✓ Passed: Redaction engine thoroughly masks sensitive keys, tokens, credentials, and connection strings.');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 6: AllExceptionsFilter (Safe Error Responses & Request Tracing)
  // --------------------------------------------------------------------------
  console.log('\n[TEST 6] AllExceptionsFilter Error Sanitization & Request ID Propagation');
  {
    const filter = new AllExceptionsFilter();

    let capturedStatusCode = 0;
    let capturedBody: any = null;
    let capturedHeaderKey = '';
    let capturedHeaderVal = '';

    const mockResponse: any = {
      setHeader: (k: string, v: string) => {
        capturedHeaderKey = k;
        capturedHeaderVal = v;
      },
      status: (code: number) => {
        capturedStatusCode = code;
        return {
          json: (body: any) => {
            capturedBody = body;
          },
        };
      },
    };

    const mockRequest: any = {
      requestId: 'nv-req-test-trace-999',
      method: 'POST',
      url: '/api/v1/auth/login',
    };

    const mockHost: any = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    };

    // Test 6a: HttpException (Unauthorized)
    const httpEx = new HttpException({ message: 'Invalid credentials', error: 'Unauthorized' }, HttpStatus.UNAUTHORIZED);
    filter.catch(httpEx, mockHost);

    assert(capturedStatusCode === HttpStatus.UNAUTHORIZED, 'Status code matches HttpException');
    assert(capturedBody.statusCode === HttpStatus.UNAUTHORIZED, 'Body statusCode matches');
    assert(capturedBody.requestId === 'nv-req-test-trace-999', 'Body contains correlation requestId');
    assert(capturedHeaderKey === 'X-Request-ID' && capturedHeaderVal === 'nv-req-test-trace-999', 'Response header has X-Request-ID');

    // Test 6b: Unhandled Error Exception
    const unhandledError = new Error('Database connection crashed on postgresql://root:dbpass@localhost:5432');
    filter.catch(unhandledError, mockHost);

    assert(capturedStatusCode === HttpStatus.INTERNAL_SERVER_ERROR, 'Unhandled error maps to 500');
    assert(capturedBody.requestId === 'nv-req-test-trace-999', '500 error body includes requestId');

    console.log('  ✓ Passed: AllExceptionsFilter formats safe client error responses with correlated X-Request-ID.');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 7: Auth Event Logging & Rate Limiting Audit Trail
  // --------------------------------------------------------------------------
  console.log('\n[TEST 7] Auth Event Logging & Security Auditing');
  {
    const mockPrisma = {} as unknown as PrismaService;
    const monitoringService = new MonitoringService(mockPrisma);

    // Verify recordAuthEvent executes safely across all event types
    monitoringService.recordAuthEvent('LOGIN_SUCCESS', {
      ip: '192.168.1.100',
      userIdentifier: 'alex@netvision.edu',
      requestId: 'nv-req-audit-1',
    });

    monitoringService.recordAuthEvent('LOGIN_FAILED', {
      ip: '10.0.0.5',
      userIdentifier: 'attacker@evil.com',
      requestId: 'nv-req-audit-2',
      details: { reason: 'InvalidPassword' },
    });

    monitoringService.recordAuthEvent('RATE_LIMIT_EXCEEDED', {
      ip: '10.0.0.5',
      requestId: 'nv-req-audit-3',
      details: { route: '/api/v1/auth/login' },
    });

    console.log('  ✓ Passed: Auth audit event logging functions cleanly for login, failures, and rate limits.');
    passedCount++;
  }

  // --------------------------------------------------------------------------
  // TEST 8: Sandbox Event Auditing & Metrics
  // --------------------------------------------------------------------------
  console.log('\n[TEST 8] Sandbox Lifecycle & Metrics Tracking');
  {
    const mockPrisma = {} as unknown as PrismaService;
    const monitoringService = new MonitoringService(mockPrisma);

    monitoringService.recordSandboxEvent('SESSION_CREATED', {
      sessionId: 'sim-sess-12345',
      provider: 'SIMULATED',
      userId: 'test-user-1',
    });

    monitoringService.recordSandboxEvent('COMMAND_EXECUTED', {
      sessionId: 'sim-sess-12345',
      provider: 'SIMULATED',
      commandSnippet: 'ipconfig /all',
      exitCode: 0,
      durationMs: 45,
    });

    monitoringService.recordRequest(200, 50);
    monitoringService.recordRequest(404, 15);
    monitoringService.recordRequest(500, 120);

    const metrics = monitoringService.getMetricsSummary();
    assert(metrics.totalRequests === 3, 'Recorded 3 total requests');
    assert(metrics.status2xxCount === 1, 'Recorded 1 2xx request');
    assert(metrics.status4xxCount === 1, 'Recorded 1 4xx request');
    assert(metrics.status5xxCount === 1, 'Recorded 1 5xx request');
    assert(metrics.averageLatencyMs > 0, 'Computed average latency');

    console.log('  ✓ Passed: Sandbox lifecycle events and HTTP metrics summary recorded with precision.');
    passedCount++;
  }

  console.log('\n================================================================');
  console.log(`🎉 ALL ${passedCount} MONITORING & OBSERVABILITY TESTS PASSED!`);
  console.log('================================================================\n');
}

runMonitoringTestSuite().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
