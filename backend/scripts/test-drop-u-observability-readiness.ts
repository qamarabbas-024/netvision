import * as assert from 'assert';
import { MonitoringService } from '../src/monitoring/monitoring.service';
import { redactSensitiveData, createStructuredLog } from '../src/monitoring/utils/redaction.util';

console.log('====================================================================');
console.log('📊 NETVISION DROP U — OBSERVABILITY & OPERATIONAL READINESS GATE');
console.log('====================================================================\n');

let passedTests = 0;
let failedTests = 0;

function pass(testName: string) {
  passedTests++;
  console.log(`  ✅ PASS: ${testName}`);
}

function fail(testName: string, err: any) {
  failedTests++;
  console.error(`  ❌ FAIL: ${testName}`, err);
}

async function runTests() {
  // Mock Prisma Service for unit testing MonitoringService
  const mockPrisma: any = {
    $queryRaw: async () => [{ 1: 1 }],
  };

  const monitoring = new MonitoringService(mockPrisma);

  console.log('--- Test 1: Privacy Redaction & Zero-Leakage of Sensitive Telemetry ---');
  try {
    // 1. Passwords, Tokens, Secrets
    const samplePayload = {
      email: 'student@example.edu',
      password: 'superSecretPassword123!',
      accessToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.doNotLeak',
      refreshToken: 'a1b2c3d4e5f67890123456789abcdef0',
      otp: '123456',
      correctAnswer: 2,
      answerKey: 'B',
      rubric: { gradingWeights: [40, 35, 25], targetState: { 'R1': 'configured' } },
      regularField: 'Public Safe Topic Data',
    };

    const redacted = redactSensitiveData(samplePayload);

    assert.strictEqual(redacted.password, '[REDACTED]', 'Password must be [REDACTED]');
    assert.strictEqual(redacted.accessToken, '[REDACTED]', 'accessToken must be [REDACTED]');
    assert.strictEqual(redacted.refreshToken, '[REDACTED]', 'refreshToken must be [REDACTED]');
    assert.strictEqual(redacted.otp, '[REDACTED]', 'OTP must be [REDACTED]');
    assert.strictEqual(redacted.correctAnswer, '[REDACTED]', 'correctAnswer must be [REDACTED]');
    assert.strictEqual(redacted.answerKey, '[REDACTED]', 'answerKey must be [REDACTED]');
    assert.strictEqual(redacted.rubric, '[REDACTED]', 'rubric must be [REDACTED]');
    assert.strictEqual(redacted.email, '[REDACTED]', 'email key must be [REDACTED]');
    assert.strictEqual(redacted.regularField, 'Public Safe Topic Data', 'Non-sensitive field must remain intact');

    // 2. String-level redaction
    const bearerString = 'Request with Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0In0.signature and student@netvision.org';
    const redactedString = redactSensitiveData(bearerString);
    assert.ok(!redactedString.includes('eyJhbGciOiJIUzI1NiJ9'), 'JWT string must not leak');
    assert.ok(!redactedString.includes('student@netvision.org'), 'Email string must not leak');

    pass('Sensitive tokens, passwords, answer keys, rubrics, and learner emails are strictly redacted');
  } catch (err: any) {
    fail('Privacy Redaction test failed', err);
  }

  console.log('\n--- Test 2: Structured Log Creation & Context Integrity ---');
  try {
    const structuredLog = createStructuredLog('WARN', 'SECURITY', 'Suspicious login from IP', {
      requestId: 'nv-req-test-1234',
      event: 'LOGIN_FAILED',
      durationMs: 42,
      metadata: {
        attemptUser: 'candidate@netvision.io',
        password: 'guessAttempt',
      },
    });

    assert.strictEqual(structuredLog.level, 'WARN');
    assert.strictEqual(structuredLog.context, 'SECURITY');
    assert.strictEqual(structuredLog.requestId, 'nv-req-test-1234');
    assert.strictEqual(structuredLog.event, 'LOGIN_FAILED');
    assert.strictEqual(structuredLog.durationMs, 42);
    assert.strictEqual(structuredLog.metadata?.password, '[REDACTED]');
    assert.ok(structuredLog.timestamp, 'Timestamp must be present');

    pass('Structured log formatting with context and request correlation verified');
  } catch (err: any) {
    fail('Structured log test failed', err);
  }

  console.log('\n--- Test 3: Request Latency & Error Rate Telemetry ---');
  try {
    // Record series of requests
    monitoring.recordRequest(200, 15);
    monitoring.recordRequest(200, 25);
    monitoring.recordRequest(200, 30);
    monitoring.recordRequest(404, 10);
    monitoring.recordRequest(500, 120);

    const metrics = monitoring.getMetricsSummary();

    assert.strictEqual(metrics.totalRequests, 5, 'Total requests must equal 5');
    assert.strictEqual(metrics.status2xxCount, 3, '2xx count must equal 3');
    assert.strictEqual(metrics.status4xxCount, 1, '4xx count must equal 1');
    assert.strictEqual(metrics.status5xxCount, 1, '5xx count must equal 1');
    assert.strictEqual(metrics.errorRatePercent, 40, 'Error rate (2/5) must be 40%');
    assert.strictEqual(metrics.status5xxPercent, 20, '5xx rate (1/5) must be 20%');
    assert.strictEqual(metrics.latency.minMs, 10, 'Min latency must be 10ms');
    assert.strictEqual(metrics.latency.maxMs, 120, 'Max latency must be 120ms');
    assert.ok(metrics.latency.avgMs > 0, 'Avg latency must be computed');
    assert.ok(metrics.latency.p95Ms >= metrics.latency.minMs, 'P95 latency must be valid');

    pass('Request volume, 2xx/4xx/5xx counters, error rate %, and latency percentiles verified');
  } catch (err: any) {
    fail('Request metrics test failed', err);
  }

  console.log('\n--- Test 4: Auth & Security Event Auditing & Metrics ---');
  try {
    monitoring.recordAuthEvent('LOGIN_SUCCESS', { ip: '127.0.0.1', userIdentifier: 'user-1' });
    monitoring.recordAuthEvent('LOGIN_FAILED', { ip: '127.0.0.1', userIdentifier: 'user-2' });
    monitoring.recordAuthEvent('REFRESH_SUCCESS', { ip: '127.0.0.1', userIdentifier: 'user-1' });
    monitoring.recordAuthEvent('REFRESH_FAILED', { ip: '127.0.0.1', userIdentifier: 'user-2' });

    let metrics = monitoring.getMetricsSummary();
    assert.strictEqual(metrics.auth.successes, 1, 'Auth successes must equal 1');
    assert.strictEqual(metrics.auth.failures, 1, 'Auth failures must equal 1');
    assert.strictEqual(metrics.auth.refreshSuccesses, 1, 'Refresh successes must equal 1');
    assert.strictEqual(metrics.auth.refreshFailures, 1, 'Refresh failures must equal 1');
    assert.strictEqual(metrics.auth.tokenReuseCount, 0, 'Token reuse count initially 0');

    // Record Security Token Reuse Incident
    monitoring.recordSecurityEvent('TOKEN_REUSE_DETECTED', { userId: 'user-replay', details: { family: 'fam-1' } });
    metrics = monitoring.getMetricsSummary();
    assert.strictEqual(metrics.auth.tokenReuseCount, 1, 'Token reuse count must equal 1');

    pass('Auth success/failure, refresh rotation, and token replay security counters verified');
  } catch (err: any) {
    fail('Auth & security event test failed', err);
  }

  console.log('\n--- Test 5: Learning, Quiz, Lab & Certification Telemetry ---');
  try {
    monitoring.recordQuizEvent('QUIZ_COMPLETED', { quizId: 'q-101', score: 90 });
    monitoring.recordLabEvent('COMMAND_EXECUTED', { scenarioId: 'scen-dns', commandSnippet: 'dig netvision.edu' });
    monitoring.recordLabEvent('COMMAND_FAILED', { scenarioId: 'scen-dns', commandSnippet: 'invalid_cmd' });
    monitoring.recordLabEvent('LAB_COMPLETED', { scenarioId: 'scen-dns', userId: 'user-1' });

    monitoring.recordCertificationEvent('EXAM_ATTEMPTED', { courseId: 'NV-NET-C01' });
    monitoring.recordCertificationEvent('EXAM_PASSED', { courseId: 'NV-NET-C01', score: 88 });
    monitoring.recordCertificationEvent('CAPSTONE_SUBMITTED', { courseId: 'NV-NET-MASTERY' });
    monitoring.recordCertificationEvent('CAPSTONE_PASSED', { courseId: 'NV-NET-MASTERY', score: 92 });

    const metrics = monitoring.getMetricsSummary();
    assert.strictEqual(metrics.learning.quizCompletions, 1, 'Quiz completions must equal 1');
    assert.strictEqual(metrics.learning.labCommandExecutions, 1, 'Lab command executions must equal 1');
    assert.strictEqual(metrics.learning.labCommandFailures, 1, 'Lab command failures must equal 1');
    assert.strictEqual(metrics.learning.labCompletions, 1, 'Lab completions must equal 1');
    assert.strictEqual(metrics.learning.certificationAttempts, 1, 'Cert attempts must equal 1');
    assert.strictEqual(metrics.learning.certificationPasses, 1, 'Cert passes must equal 1');
    assert.strictEqual(metrics.learning.capstoneSubmissions, 1, 'Capstone submissions must equal 1');
    assert.strictEqual(metrics.learning.capstonePasses, 1, 'Capstone passes must equal 1');

    pass('Quiz, lab execution, troubleshooting resolution, and certification telemetry counters verified');
  } catch (err: any) {
    fail('Learning telemetry test failed', err);
  }

  console.log('\n--- Test 6: Database Health Probe & Latency Tracking ---');
  try {
    const dbHealthyResult = await monitoring.checkDatabaseHealth();
    assert.strictEqual(dbHealthyResult.healthy, true, 'Database must report healthy on SELECT 1');
    assert.ok(typeof dbHealthyResult.latencyMs === 'number', 'Database latency must be numeric');

    // Test failing DB probe
    const failingPrisma: any = {
      $queryRaw: async () => {
        throw new Error('Connection refused to PostgreSQL host');
      },
    };
    const failingMonitoring = new MonitoringService(failingPrisma);
    const dbFailingResult = await failingMonitoring.checkDatabaseHealth();
    assert.strictEqual(dbFailingResult.healthy, false, 'Database must report unhealthy on query error');

    pass('Database connectivity probe and latency measurement verified (pass & fail scenarios)');
  } catch (err: any) {
    fail('Database health probe test failed', err);
  }

  console.log('\n--- Test 7: Operational Alert Conditions Evaluator ---');
  try {
    const alerts = monitoring.evaluateAlerts();
    assert.strictEqual(alerts.length, 6, 'Must evaluate exactly 6 standard operational alert monitors');

    const alertIds = alerts.map((a) => a.id);
    assert.ok(alertIds.includes('elevated_5xx'), 'Must contain elevated_5xx monitor');
    assert.ok(alertIds.includes('database_connection_failures'), 'Must contain database_connection_failures monitor');
    assert.ok(alertIds.includes('authentication_abuse'), 'Must contain authentication_abuse monitor');
    assert.ok(alertIds.includes('repeated_certification_failures'), 'Must contain repeated_certification_failures monitor');
    assert.ok(alertIds.includes('simulation_engine_failures'), 'Must contain simulation_engine_failures monitor');
    assert.ok(alertIds.includes('unusual_command_errors'), 'Must contain unusual_command_errors monitor');

    // Verify token reuse triggers CRITICAL on authentication_abuse alert
    const authAlert = alerts.find((a) => a.id === 'authentication_abuse');
    assert.strictEqual(authAlert?.status, 'CRITICAL', 'Token reuse must trigger CRITICAL authentication_abuse alert');

    pass('All 6 alert condition monitors evaluated with threshold, value, and severity status');
  } catch (err: any) {
    fail('Alert conditions evaluator test failed', err);
  }

  console.log('\n====================================================================');
  console.log(`📊 DROP U VERIFICATION RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('====================================================================');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
