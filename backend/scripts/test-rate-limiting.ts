import { ConfigService } from '@nestjs/config';
import { RateLimiterService } from '../src/security/rate-limiter/rate-limiter.service';
import { AppRateLimitGuard } from '../src/security/rate-limiter/app-rate-limit.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, HttpStatus } from '@nestjs/common';
import { loadRateLimiterConfig } from '../src/security/rate-limiter/rate-limiter.config';

function createMockConfig(env: Record<string, string>): ConfigService {
  return {
    get: (key: string, def?: any) => (key in env ? env[key] : def),
  } as unknown as ConfigService;
}

let passedAssertions = 0;

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    throw new Error(`Assertion failed: ${msg}`);
  }
  passedAssertions++;
  console.log(`  ✓ Assertion ${passedAssertions}: ${msg}`);
}

async function runRateLimitingTestSuite() {
  console.log('================================================================');
  console.log('🛡️ NETVISION SECURITY: CONFIGURABLE RATE LIMITING TEST SUITE');
  console.log('================================================================\n');

  // ---------------------------------------------------------------------------
  // 1. CONFIGURATION & DEFAULTS
  // ---------------------------------------------------------------------------
  console.log('[SECTION 1] Configuration Parsing & Environment Overrides');
  {
    const defaultConfig = loadRateLimiterConfig(createMockConfig({}));
    assert(defaultConfig.publicLimit === 100, 'Default public limit is 100');
    assert(defaultConfig.publicTtlMs === 60000, 'Default public TTL is 60000 ms');
    assert(defaultConfig.userLimit === 300, 'Default user limit is 300');
    assert(defaultConfig.authLimit === 10, 'Default auth limit is 10');
    assert(defaultConfig.authPerAccountLimit === 5, 'Default auth per-account limit is 5');
    assert(defaultConfig.strictAuthLimit === 5, 'Default strict auth limit is 5');
    assert(defaultConfig.authBackoffBaseMs === 1000, 'Default backoff base is 1000 ms');
    assert(defaultConfig.authBackoffFactor === 2.0, 'Default backoff factor is 2.0');

    // Test custom overrides
    const customConfig = loadRateLimiterConfig(
      createMockConfig({
        RATE_LIMIT_PUBLIC_LIMIT: '50',
        RATE_LIMIT_PUBLIC_TTL: '30000',
        RATE_LIMIT_USER_LIMIT: '500',
        RATE_LIMIT_AUTH_LIMIT: '5',
        RATE_LIMIT_AUTH_PER_ACCOUNT_LIMIT: '3',
        RATE_LIMIT_AUTH_BACKOFF_BASE_MS: '2000',
        RATE_LIMIT_AUTH_BACKOFF_MAX_MS: '60000',
        RATE_LIMIT_AUTH_BACKOFF_FACTOR: '3.0',
      })
    );
    assert(customConfig.publicLimit === 50, 'Custom public limit override is honored');
    assert(customConfig.publicTtlMs === 30000, 'Custom public TTL override is honored');
    assert(customConfig.userLimit === 500, 'Custom user limit override is honored');
    assert(customConfig.authLimit === 5, 'Custom auth limit override is honored');
    assert(customConfig.authPerAccountLimit === 3, 'Custom auth per-account limit override is honored');
    assert(customConfig.authBackoffBaseMs === 2000, 'Custom backoff base override is honored');
    assert(customConfig.authBackoffFactor === 3.0, 'Custom backoff factor override is honored');
  }

  // ---------------------------------------------------------------------------
  // 2. PUBLIC ENDPOINT LIMITS
  // ---------------------------------------------------------------------------
  console.log('\n[SECTION 2] Public Route Rate Limiting (IP Isolation)');
  {
    const mockConfig = createMockConfig({});
    const service = new RateLimiterService(mockConfig);
    service.overrideConfig({ publicLimit: 5, publicTtlMs: 2000 });

    const ipA = '198.51.100.1';
    const ipB = '198.51.100.2';

    // IP A consumes 5 allowed requests
    for (let i = 1; i <= 5; i++) {
      const res = service.checkPublicLimit(ipA);
      assert(res.allowed === true, `IP A public request ${i}/5 allowed (remaining: ${res.remaining})`);
    }

    // IP A 6th request is blocked
    const blockedRes = service.checkPublicLimit(ipA);
    assert(blockedRes.allowed === false, 'IP A 6th public request is blocked (HTTP 429 condition)');
    assert(blockedRes.remaining === 0, 'IP A remaining is 0 when blocked');
    assert(blockedRes.retryAfterSeconds > 0, 'IP A retryAfterSeconds > 0');

    // IP B is completely unaffected (per-IP isolation)
    const ipBRes = service.checkPublicLimit(ipB);
    assert(ipBRes.allowed === true, 'IP B public request allowed despite IP A exhaustion');
    assert(ipBRes.remaining === 4, 'IP B has its own independent remaining quota');
  }

  // ---------------------------------------------------------------------------
  // 3. AUTHENTICATED USER LIMITS
  // ---------------------------------------------------------------------------
  console.log('\n[SECTION 3] Authenticated User Actions (Looser Quota & User ID Tracking)');
  {
    const mockConfig = createMockConfig({});
    const service = new RateLimiterService(mockConfig);
    service.overrideConfig({ userLimit: 8, userTtlMs: 2000 });

    const userId = 'usr_alex_rivers_101';
    const sharedIp = '203.0.113.50';

    for (let i = 1; i <= 8; i++) {
      const res = service.checkUserLimit(userId, sharedIp);
      assert(res.allowed === true, `User action ${i}/8 allowed for authenticated student`);
    }

    // 9th action is blocked
    const blockedRes = service.checkUserLimit(userId, sharedIp);
    assert(blockedRes.allowed === false, 'User 9th action is rate-limited');

    // Another user on the same IP is isolated
    const otherUserRes = service.checkUserLimit('usr_other_student', sharedIp);
    assert(otherUserRes.allowed === true, 'Distinct authenticated user on same IP has independent quota');
  }

  // ---------------------------------------------------------------------------
  // 4. AUTH ENDPOINT LIMITS (PER-IP & PER-ACCOUNT)
  // ---------------------------------------------------------------------------
  console.log('\n[SECTION 4] Authentication Protection: Per-IP and Per-Account Limits');
  {
    const mockConfig = createMockConfig({});
    const service = new RateLimiterService(mockConfig);
    service.overrideConfig({
      authLimit: 4,
      authPerAccountLimit: 3,
      authTtlMs: 5000,
      authBackoffBaseMs: 1000,
    });

    const ipX = '192.0.2.10';
    const emailTarget = 'victim@netvision.edu';

    // Account limit is 3. Make 3 requests for target email from IP X
    for (let i = 1; i <= 3; i++) {
      const res = service.checkAuthLimit(ipX, emailTarget);
      assert(res.allowed === true, `Auth request ${i}/3 for ${emailTarget} allowed`);
    }

    // 4th request for this email is blocked due to per-account limit
    const accountBlocked = service.checkAuthLimit(ipX, emailTarget);
    assert(accountBlocked.allowed === false, '4th auth request for account is blocked');
    assert(accountBlocked.reason === 'ACCOUNT_LIMIT_EXCEEDED', 'Reason accurately identifies ACCOUNT_LIMIT_EXCEEDED');

    // Different email from same IP X can still make requests until IP limit (4)
    const diffEmailRes = service.checkAuthLimit(ipX, 'other@netvision.edu');
    assert(diffEmailRes.allowed === false, 'IP X total limit (4) is reached');
    assert(diffEmailRes.reason === 'IP_LIMIT_EXCEEDED', 'Reason accurately identifies IP_LIMIT_EXCEEDED');
  }

  // ---------------------------------------------------------------------------
  // 5. PROGRESSIVE EXPONENTIAL BACKOFF & RECOVERY
  // ---------------------------------------------------------------------------
  console.log('\n[SECTION 5] Progressive Exponential Backoff & Legitimate Recovery');
  {
    const mockConfig = createMockConfig({});
    const service = new RateLimiterService(mockConfig);
    service.overrideConfig({
      authLimit: 10,
      authPerAccountLimit: 10,
      authBackoffBaseMs: 200, // 200ms base for fast test
      authBackoffFactor: 2.0,
      authBackoffMaxMs: 5000,
    });

    const ipAttacker = '198.51.100.99';
    const targetEmail = 'alex@netvision.edu';

    // 1st failed attempt -> cooldown = 200ms * 2^0 = 200ms
    const fail1 = service.recordFailedAuth(ipAttacker, targetEmail);
    assert(fail1.consecutiveFailures === 1, '1st failure recorded');
    assert(fail1.cooldownMs === 200, '1st failure cooldown is 200ms');

    // Immediate check during cooldown is blocked
    const check1 = service.checkAuthLimit(ipAttacker, targetEmail);
    assert(check1.allowed === false, 'Immediate auth check is blocked by active backoff');
    assert(check1.reason === 'BACKOFF_COOLDOWN_ACTIVE', 'Reason is BACKOFF_COOLDOWN_ACTIVE');

    // Wait 250ms for cooldown to expire
    await new Promise((resolve) => setTimeout(resolve, 250));

    // After cooldown expires, request is allowed through
    const checkRecovered = service.checkAuthLimit(ipAttacker, targetEmail);
    assert(checkRecovered.allowed === true, 'Request allowed after progressive cooldown expires');

    // 2nd failed attempt -> cooldown = 200ms * 2^1 = 400ms
    const fail2 = service.recordFailedAuth(ipAttacker, targetEmail);
    assert(fail2.consecutiveFailures === 2, '2nd failure recorded');
    assert(fail2.cooldownMs === 400, '2nd failure cooldown scales exponentially to 400ms');

    // 3rd failed attempt -> cooldown = 200ms * 2^2 = 800ms
    const fail3 = service.recordFailedAuth(ipAttacker, targetEmail);
    assert(fail3.consecutiveFailures === 3, '3rd failure recorded');
    assert(fail3.cooldownMs === 800, '3rd failure cooldown scales to 800ms');

    // Legitimate login clears the backoff record
    service.recordSuccessfulAuth(ipAttacker, targetEmail);
    const backoffState = service.checkBackoff(ipAttacker, targetEmail);
    assert(backoffState.inCooldown === false, 'Successful login immediately clears backoff cooldown');

    // New failure starts back at base cooldown (200ms)
    const failAfterReset = service.recordFailedAuth(ipAttacker, targetEmail);
    assert(failAfterReset.consecutiveFailures === 1, 'Failure after reset starts fresh at 1 failure');
    assert(failAfterReset.cooldownMs === 200, 'Cooldown restarts at base 200ms');
  }

  // ---------------------------------------------------------------------------
  // 6. DENIAL OF SERVICE MITIGATION (IP ISOLATION OF ATTACKS)
  // ---------------------------------------------------------------------------
  console.log('\n[SECTION 6] Non-Destructive Account Protection (No Permanent Lockout / No DoS)');
  {
    const mockConfig = createMockConfig({});
    const service = new RateLimiterService(mockConfig);
    service.overrideConfig({
      authLimit: 10,
      authPerAccountLimit: 10,
      authBackoffBaseMs: 500,
      authBackoffFactor: 2.0,
    });

    const attackerIp = '103.21.244.5';
    const legitimateIp = '192.0.2.88';
    const sharedAccount = 'victim_user@netvision.edu';

    // Attacker sends 5 consecutive bad passwords from attacker IP
    for (let i = 1; i <= 5; i++) {
      service.recordFailedAuth(attackerIp, sharedAccount);
    }

    // Attacker IP is now in heavy backoff cooldown
    const attackerCheck = service.checkBackoff(attackerIp, sharedAccount);
    assert(attackerCheck.inCooldown === true, 'Attacker IP is throttled in progressive backoff');

    // Legitimate user on legitimate IP is NOT blocked by attacker IP's backoff
    const legitCheck = service.checkBackoff(legitimateIp, sharedAccount);
    assert(legitCheck.inCooldown === false, 'Legitimate user on independent IP is NOT locked out by attacker IP');
  }

  // ---------------------------------------------------------------------------
  // 7. PROXY IP & CLIENT RESOLUTION
  // ---------------------------------------------------------------------------
  console.log('\n[SECTION 7] Trusted Reverse Proxy & Client IP Resolution');
  {
    const mockConfig = createMockConfig({});
    const service = new RateLimiterService(mockConfig);
    const reflector = new Reflector();
    const guard = new AppRateLimitGuard(reflector, service);

    // Test 1: Direct IP
    const reqDirect = {
      ip: '203.0.113.195',
      headers: {},
    } as any;
    assert(guard.extractClientIp(reqDirect) === '203.0.113.195', 'Direct req.ip extracted accurately');

    // Test 2: X-Forwarded-For header with multiple proxy hops
    const reqProxied = {
      headers: {
        'x-forwarded-for': '198.51.100.42, 10.0.0.1, 172.16.0.1',
      },
    } as any;
    assert(guard.extractClientIp(reqProxied) === '198.51.100.42', 'Client IP accurately extracted as first hop from X-Forwarded-For');

    // Test 3: Express req.ips array (when trust proxy is set)
    const reqTrustedProxy = {
      ips: ['192.0.2.77', '10.10.10.1'],
      headers: {},
    } as any;
    assert(guard.extractClientIp(reqTrustedProxy) === '192.0.2.77', 'req.ips[0] accurately extracted when trust proxy is active');

    // Test 4: IPv6 mapped IPv4 normalization
    const reqIpv6Mapped = {
      ip: '::ffff:198.51.100.99',
      headers: {},
    } as any;
    assert(guard.extractClientIp(reqIpv6Mapped) === '198.51.100.99', 'IPv6-mapped IPv4 string normalized to standard IPv4');
  }

  // ---------------------------------------------------------------------------
  // 8. GUARD INTEGRATION & HTTP STATUS / HEADERS
  // ---------------------------------------------------------------------------
  console.log('\n[SECTION 8] Guard HTTP Header Emission & 429 Status Enforcement');
  {
    const mockConfig = createMockConfig({});
    const service = new RateLimiterService(mockConfig);
    service.overrideConfig({ publicLimit: 2, publicTtlMs: 2000 });
    const reflector = new Reflector();
    const guard = new AppRateLimitGuard(reflector, service);

    const headers: Record<string, string> = {};
    const mockRes = {
      headersSent: false,
      setHeader: (k: string, v: string) => {
        headers[k] = v;
      },
    };

    const createMockContext = (url = '/api/v1/courses', ip = '198.51.100.7') =>
      ({
        getHandler: () => ({}),
        getClass: () => ({}),
        switchToHttp: () => ({
          getRequest: () => ({
            url,
            originalUrl: url,
            ip,
            headers: {},
          }),
          getResponse: () => mockRes,
        }),
      } as unknown as ExecutionContext);

    // Request 1: Allowed, headers set
    const allowed1 = guard.canActivate(createMockContext());
    assert(allowed1 === true, 'Guard allows 1st request');
    assert(headers['X-RateLimit-Limit'] === '2', 'X-RateLimit-Limit header set to 2');
    assert(headers['X-RateLimit-Remaining'] === '1', 'X-RateLimit-Remaining header set to 1');

    // Request 2: Allowed
    const allowed2 = guard.canActivate(createMockContext());
    assert(allowed2 === true, 'Guard allows 2nd request');
    assert(headers['X-RateLimit-Remaining'] === '0', 'X-RateLimit-Remaining header set to 0');

    // Request 3: Throws 429 Too Many Requests with Retry-After header
    let threw429 = false;
    try {
      guard.canActivate(createMockContext());
    } catch (err: any) {
      threw429 = true;
      assert(err.getStatus() === HttpStatus.TOO_MANY_REQUESTS, 'Guard throws HttpException with status 429');
      assert(headers['Retry-After'] !== undefined, 'Retry-After header is set on 429 response');
      assert(typeof err.getResponse().retryAfter === 'number', 'Error payload includes retryAfter seconds');
    }
    assert(threw429 === true, '3rd request properly triggered 429 exception');
  }

  console.log(`\n🎉 RATE LIMITING VERIFICATION SUCCESSFUL: All ${passedAssertions} assertions passed!`);
  process.exit(0);
}

runRateLimitingTestSuite().catch((e) => {
  console.error('❌ Test suite failed with error:', e);
  process.exit(1);
});
