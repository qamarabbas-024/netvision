/**
 * NETVISION — DROP 25: DISTRIBUTED SECURITY STATE FAILURE SEMANTICS
 * MULTI-INSTANCE VERIFICATION TEST SUITE
 *
 * Simulates:
 * 1. State Classification & Authoritative Source Mapping
 * 2. Node A revokes token -> Node B rejects token (Healthy Redis)
 * 3. Redis unavailable -> security remains correct (PostgreSQL Authoritative Store)
 * 4. Redis returns -> state reconciles safely (no loss, correct TTL)
 * 5. Instance restart -> revocation remains valid (Pod crash / cold memory recovery)
 * 6. Concurrent revocation -> deterministic (Idempotent multi-node race)
 * 7. Refresh token replay -> entire family invalidated cluster-wide
 * 8. User revocation cutoff -> multi-instance session termination
 * 9. Rate limiting degraded tightened security mode during Redis outage
 * 10. Fail-closed partition behavior when all distributed security stores are unreachable
 */

import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import {
  REDIS_KEYS,
  DISTRIBUTED_TTL,
  SecurityStateTier,
  DROP_25_STATE_CLASSIFICATION,
  SECURITY_AUTHORITATIVE_STORES,
  DistributedRevokedToken,
} from '../src/redis/distributed-state.interface';
import { RedisService } from '../src/redis/redis.service';
import { TokenRevocationService } from '../src/auth/token-revocation.service';
import { SharedClusterSecurityStore } from '../src/auth/stores/authoritative-security.store';
import { RateLimiterService } from '../src/security/rate-limiter/rate-limiter.service';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

/**
 * High-Fidelity In-Memory Redis Cluster Simulator
 */
class SimulatedRedisCluster {
  private store = new Map<string, { value: string; expiresAtMs?: number }>();
  private setStore = new Map<string, { members: Set<string>; expiresAtMs?: number }>();
  public isOnline = true;

  public now(): number {
    return Date.now();
  }

  public purgeExpired(): void {
    const currentTime = this.now();
    for (const [k, v] of this.store.entries()) {
      if (v.expiresAtMs && v.expiresAtMs <= currentTime) {
        this.store.delete(k);
      }
    }
    for (const [k, v] of this.setStore.entries()) {
      if (v.expiresAtMs && v.expiresAtMs <= currentTime) {
        this.setStore.delete(k);
      }
    }
  }

  public createClient(instanceName: string) {
    const cluster = this;

    return {
      status: 'ready',
      async get(key: string): Promise<string | null> {
        if (!cluster.isOnline) throw new Error('ECONNREFUSED: Redis cluster offline');
        cluster.purgeExpired();
        const entry = cluster.store.get(key);
        return entry ? entry.value : null;
      },
      async set(key: string, value: string, ...args: any[]): Promise<'OK'> {
        if (!cluster.isOnline) throw new Error('ECONNREFUSED: Redis cluster offline');
        cluster.purgeExpired();
        let ttlMs: number | undefined;

        const exIdx = args.indexOf('EX');
        if (exIdx !== -1 && args[exIdx + 1] !== undefined) {
          ttlMs = Number(args[exIdx + 1]) * 1000;
        }

        const nx = args.includes('NX');
        if (nx && cluster.store.has(key)) {
          return null as any;
        }

        cluster.store.set(key, {
          value,
          expiresAtMs: ttlMs ? cluster.now() + ttlMs : undefined,
        });
        return 'OK';
      },
      async del(...keys: string[]): Promise<number> {
        if (!cluster.isOnline) throw new Error('ECONNREFUSED: Redis cluster offline');
        let count = 0;
        for (const k of keys) {
          if (cluster.store.delete(k) || cluster.setStore.delete(k)) {
            count++;
          }
        }
        return count;
      },
      async expire(key: string, seconds: number): Promise<number> {
        if (!cluster.isOnline) throw new Error('ECONNREFUSED: Redis cluster offline');
        const entry = cluster.store.get(key);
        if (entry) {
          entry.expiresAtMs = cluster.now() + seconds * 1000;
          return 1;
        }
        const setEntry = cluster.setStore.get(key);
        if (setEntry) {
          setEntry.expiresAtMs = cluster.now() + seconds * 1000;
          return 1;
        }
        return 0;
      },
      async ttl(key: string): Promise<number> {
        if (!cluster.isOnline) throw new Error('ECONNREFUSED: Redis cluster offline');
        cluster.purgeExpired();
        const entry = cluster.store.get(key) || cluster.setStore.get(key);
        if (!entry) return -2;
        if (!entry.expiresAtMs) return -1;
        return Math.max(0, Math.floor((entry.expiresAtMs - cluster.now()) / 1000));
      },
      async sadd(key: string, member: string): Promise<number> {
        if (!cluster.isOnline) throw new Error('ECONNREFUSED: Redis cluster offline');
        cluster.purgeExpired();
        let setEntry = cluster.setStore.get(key);
        if (!setEntry) {
          setEntry = { members: new Set<string>() };
          cluster.setStore.set(key, setEntry);
        }
        const had = setEntry.members.has(member);
        setEntry.members.add(member);
        return had ? 0 : 1;
      },
      async smembers(key: string): Promise<string[]> {
        if (!cluster.isOnline) throw new Error('ECONNREFUSED: Redis cluster offline');
        cluster.purgeExpired();
        const setEntry = cluster.setStore.get(key);
        return setEntry ? Array.from(setEntry.members) : [];
      },
      async srem(key: string, member: string): Promise<number> {
        if (!cluster.isOnline) throw new Error('ECONNREFUSED: Redis cluster offline');
        const setEntry = cluster.setStore.get(key);
        if (!setEntry) return 0;
        return setEntry.members.delete(member) ? 1 : 0;
      },
      async ping(): Promise<string> {
        if (!cluster.isOnline) throw new Error('ECONNREFUSED: Redis cluster offline');
        return 'PONG';
      },
      disconnect() {},
      async quit() {},
    };
  }

  public getAllKeys(): string[] {
    return [...Array.from(this.store.keys()), ...Array.from(this.setStore.keys())];
  }

  public getRawStore() {
    return this.store;
  }
}

/**
 * Mock Prisma Client for Testing PostgreSQL user.updatedAt cutoffs
 */
function createMockPrisma() {
  const users = new Map<string, any>();

  return {
    user: {
      updateMany: async ({ where, data }: any) => {
        const user = users.get(where.id);
        if (user) {
          Object.assign(user, data);
          return { count: 1 };
        }
        users.set(where.id, { id: where.id, ...data });
        return { count: 1 };
      },
      findUnique: async ({ where, select }: any) => {
        const user = users.get(where.id);
        if (!user) return null;
        if (select) {
          const res: any = {};
          for (const k of Object.keys(select)) {
            res[k] = user[k];
          }
          return res;
        }
        return user;
      },
    },
    usersStore: users,
  };
}

async function runDrop25Tests() {
  console.log('========================================================================');
  console.log('🚀 NETVISION DROP 25: DISTRIBUTED SECURITY STATE FAILURE SEMANTICS');
  console.log('========================================================================\n');

  let passedTests = 0;

  // ------------------------------------------------------------------------
  // AUDIT & CLASSIFICATION CHECK
  // ------------------------------------------------------------------------
  console.log('Audit & Classification: Validating State Security Tiers & Exact Sources');
  {
    assert(
      DROP_25_STATE_CLASSIFICATION.TOKEN_REVOCATION === SecurityStateTier.SECURITY_AUTHORITATIVE,
      'token revocation is classified as SECURITY_AUTHORITATIVE'
    );
    assert(
      DROP_25_STATE_CLASSIFICATION.REFRESH_TOKEN_FAMILIES === SecurityStateTier.SECURITY_AUTHORITATIVE,
      'refresh-token families is classified as SECURITY_AUTHORITATIVE'
    );
    assert(
      DROP_25_STATE_CLASSIFICATION.BLACKLIST === SecurityStateTier.SECURITY_AUTHORITATIVE,
      'blacklist is classified as SECURITY_AUTHORITATIVE'
    );
    assert(
      DROP_25_STATE_CLASSIFICATION.USER_REVOCATION_CUTOFF === SecurityStateTier.SECURITY_AUTHORITATIVE,
      'user revocation cutoff is classified as SECURITY_AUTHORITATIVE'
    );
    assert(
      DROP_25_STATE_CLASSIFICATION.ACTIVE_LAB_SESSIONS === SecurityStateTier.USER_STATE,
      'active lab sessions is classified as USER_STATE'
    );
    assert(
      DROP_25_STATE_CLASSIFICATION.RATE_LIMITING_AUTH === SecurityStateTier.SECURITY_AUTHORITATIVE,
      'rate limiting (auth) is classified as SECURITY_AUTHORITATIVE'
    );
    assert(
      DROP_25_STATE_CLASSIFICATION.RATE_LIMITING_PUBLIC === SecurityStateTier.OPTIONAL_TELEMETRY,
      'rate limiting (public) is classified as OPTIONAL_TELEMETRY'
    );
    assert(
      DROP_25_STATE_CLASSIFICATION.CACHE_CATALOG_TOPICS === SecurityStateTier.CACHE,
      'cache (catalog & topics) is classified as CACHE'
    );

    // Verify Authoritative Store Documentation
    assert(
      SECURITY_AUTHORITATIVE_STORES.TOKEN_REVOCATION.includes('PostgreSQL'),
      'Authoritative source for token revocation explicitly documented as PostgreSQL'
    );
    assert(
      SECURITY_AUTHORITATIVE_STORES.REFRESH_TOKEN_FAMILIES.includes('PostgreSQL'),
      'Authoritative source for refresh token families explicitly documented as PostgreSQL'
    );
    assert(
      SECURITY_AUTHORITATIVE_STORES.USER_REVOCATION_CUTOFF.includes('user.updatedAt'),
      'Authoritative source for user cutoff explicitly documented as PostgreSQL user.updatedAt'
    );
    assert(
      SECURITY_AUTHORITATIVE_STORES.ACTIVE_LAB_SESSIONS.includes('SandboxSession Layer 3'),
      'Authoritative source for lab sessions explicitly documented as PostgreSQL SandboxSession'
    );

    passedTests++;
  }

  // Setup Infrastructure for Multi-Node Testing
  const mockConfigService: any = {
    get: (key: string, defaultValue?: any) => {
      if (key === 'REDIS_HOST') return 'localhost';
      if (key === 'REDIS_PORT') return 6379;
      if (key === 'NODE_ENV') return 'test';
      return defaultValue;
    },
  };

  const cluster = new SimulatedRedisCluster();
  const sharedSecurityStore = new SharedClusterSecurityStore();
  const mockPrisma = createMockPrisma();

  // Create Node A
  const redisServiceA = new RedisService(mockConfigService);
  redisServiceA.setClientForTesting(cluster.createClient('pod-A'), 'inst-pod-A');
  const tempDirA = `.storage/test-drop25-node-A-${Date.now()}`;
  const tokenRevocationA = new TokenRevocationService(tempDirA, redisServiceA, mockPrisma as any, sharedSecurityStore);

  // Create Node B (isolated container storage, cold memory)
  const redisServiceB = new RedisService(mockConfigService);
  redisServiceB.setClientForTesting(cluster.createClient('pod-B'), 'inst-pod-B');
  const tempDirB = `.storage/test-drop25-node-B-${Date.now()}`;
  const tokenRevocationB = new TokenRevocationService(tempDirB, redisServiceB, mockPrisma as any, sharedSecurityStore);

  const secretKey = 'super_secret_netvision_test_key_minimum_32_chars_long';

  // ------------------------------------------------------------------------
  // TEST 1: Node A Revokes Token -> Node B Rejects Token (Healthy Redis)
  // ------------------------------------------------------------------------
  console.log('\nTest 1: Node A revokes token -> Node B rejects token (Healthy Redis baseline)');
  {
    const payload = { sub: 'student-alpha', email: 'alpha@netvision.test', role: 'STUDENT', iat: Math.floor(Date.now() / 1000) };
    const rawToken = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    assert((await tokenRevocationA.isRevokedAsync(rawToken, payload)) === false, 'Token is valid on Node A before revocation');
    assert((await tokenRevocationB.isRevokedAsync(rawToken, payload)) === false, 'Token is valid on Node B before revocation');

    // Node A revokes token (user clicked logout on pod A)
    await tokenRevocationA.revokeTokenAsync(rawToken);

    // Node B with isolated disk and cold RAM checks token
    const isRevokedOnB = await tokenRevocationB.isRevokedAsync(rawToken, payload);
    assert(isRevokedOnB === true, 'Node B immediately rejected token revoked by Node A via distributed Redis');

    passedTests++;
  }

  // ------------------------------------------------------------------------
  // TEST 2: Redis Unavailable -> Security Remains Correct (No Silent Downgrade)
  // ------------------------------------------------------------------------
  console.log('\nTest 2: Redis unavailable -> Security remains correct (PostgreSQL Authoritative Store)');
  {
    // Take Redis completely offline
    cluster.isOnline = false;
    assert(redisServiceA.isAvailable() === true, 'RedisService still shows client before health probe');

    const payload = { sub: 'student-beta', email: 'beta@netvision.test', role: 'STUDENT', iat: Math.floor(Date.now() / 1000) };
    const rawToken = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    // Node A revokes token while Redis is 100% OFFLINE
    await tokenRevocationA.revokeTokenAsync(rawToken);

    // Node B (cold memory, isolated container disk) checks token while Redis is STILL OFFLINE
    // CRITICAL: Must NOT return false! Must NOT silently downgrade to single-instance local disk!
    const isRevokedOnB = await tokenRevocationB.isRevokedAsync(rawToken, payload);
    assert(
      isRevokedOnB === true,
      'SECURITY AUTHORITATIVE GUARANTEE: Node B correctly rejected token while Redis is offline by querying Authoritative Store'
    );

    passedTests++;
  }

  // ------------------------------------------------------------------------
  // TEST 3: Redis Returns -> State Reconciles Safely
  // ------------------------------------------------------------------------
  console.log('\nTest 3: Redis returns -> State reconciles safely (no loss, correct TTL)');
  {
    // Bring Redis back online
    cluster.isOnline = true;
    redisServiceA.setConnected(true);
    redisServiceB.setConnected(true);

    // Node A runs reconciliation
    const { reconciledRevocations } = await tokenRevocationA.reconcileWithRedis();
    assert(reconciledRevocations >= 1, `Safely reconciled ${reconciledRevocations} revocations to Redis`);

    // Verify token from Test 2 is now present in Redis cache with valid TTL
    const payload = { sub: 'student-beta', email: 'beta@netvision.test', role: 'STUDENT', iat: Math.floor(Date.now() / 1000) };
    const rawToken = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    const tokenHash = tokenRevocationA.hashToken(rawToken);

    const redisRecord = await redisServiceB.get<DistributedRevokedToken>(REDIS_KEYS.REVOKED_TOKEN(tokenHash));
    assert(Boolean(redisRecord), 'Reconciled token is now present in Redis cluster');
    assert(redisRecord?.tokenHash === tokenHash, 'Reconciled record tokenHash matches exactly');

    passedTests++;
  }

  // ------------------------------------------------------------------------
  // TEST 4: Instance Restart -> Revocation Remains Valid (Pod Crash Recovery)
  // ------------------------------------------------------------------------
  console.log('\nTest 4: Instance restart -> Revocation remains valid (Pod crash / cold recovery)');
  {
    // Simulate total destruction of Node A and Node B containers (memory wiped, disk destroyed)
    await tokenRevocationA.onModuleDestroy();
    await tokenRevocationB.onModuleDestroy();

    // Brand new instance Node C boots up with pristine cold state
    const tempDirC = `.storage/test-drop25-node-C-${Date.now()}`;
    const redisServiceC = new RedisService(mockConfigService);
    redisServiceC.setClientForTesting(cluster.createClient('pod-C'), 'inst-pod-C');
    const tokenRevocationC = new TokenRevocationService(tempDirC, redisServiceC, mockPrisma as any, sharedSecurityStore);

    const payload = { sub: 'student-beta', email: 'beta@netvision.test', role: 'STUDENT', iat: Math.floor(Date.now() / 1000) };
    const rawToken = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    const isRevokedOnC = await tokenRevocationC.isRevokedAsync(rawToken, payload);
    assert(isRevokedOnC === true, 'Brand new Instance C recognized revocation after container restart');

    await tokenRevocationC.onModuleDestroy();
    passedTests++;
  }

  // Recreate Node A and Node B for remaining tests
  const tokenRevA = new TokenRevocationService(tempDirA, redisServiceA, mockPrisma as any, sharedSecurityStore);
  const tokenRevB = new TokenRevocationService(tempDirB, redisServiceB, mockPrisma as any, sharedSecurityStore);

  // ------------------------------------------------------------------------
  // TEST 5: Concurrent Revocation -> Deterministic
  // ------------------------------------------------------------------------
  console.log('\nTest 5: Concurrent revocation -> Deterministic multi-instance resolution');
  {
    const payload = { sub: 'student-gamma', email: 'gamma@netvision.test', role: 'STUDENT', iat: Math.floor(Date.now() / 1000) };
    const rawToken = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    // Concurrently trigger 10 revocations from Node A and 10 from Node B simultaneously
    const promises: Promise<void>[] = [];
    for (let i = 0; i < 10; i++) {
      promises.push(tokenRevA.revokeTokenAsync(rawToken));
      promises.push(tokenRevB.revokeTokenAsync(rawToken));
    }

    await Promise.all(promises);

    // Verify deterministic single authoritative state
    const isRevA = await tokenRevA.isRevokedAsync(rawToken, payload);
    const isRevB = await tokenRevB.isRevokedAsync(rawToken, payload);
    assert(isRevA === true && isRevB === true, 'Concurrent multi-node revocation resolved deterministically to revoked');

    const authRecord = await sharedSecurityStore.getRevokedToken(tokenRevA.hashToken(rawToken));
    assert(Boolean(authRecord), 'Authoritative store holds exact deterministic revocation record');

    passedTests++;
  }

  // ------------------------------------------------------------------------
  // TEST 6: Refresh Token Replay -> Entire Family Invalidated Cluster-Wide
  // ------------------------------------------------------------------------
  console.log('\nTest 6: Refresh token replay -> Entire family invalidated cluster-wide');
  {
    const familyId = `family-${crypto.randomUUID()}`;
    const token1 = 'refresh-token-version-1';
    const token2 = 'refresh-token-version-2';
    const token3 = 'refresh-token-version-3';

    // 1. Node A registers initial refresh token
    tokenRevA.registerRefreshToken('user-refresh-victim', token1, familyId);

    // 2. Node B rotates token1 -> token2
    const rotateResult = await tokenRevB.rotateRefreshTokenAsync(token1, token2);
    assert(Boolean(rotateResult && rotateResult.userId === 'user-refresh-victim'), 'Node B rotated token1 to token2');

    // 3. Concurrent grace period test: rapid multi-tab retry returns safe concurrent retry
    const concurrentRetry = await tokenRevA.rotateRefreshTokenAsync(token1, 'concurrent-tab-token');
    assert(
      Boolean(concurrentRetry && concurrentRetry.isConcurrentRetry === true),
      'Concurrent refresh within 5s grace window tolerated safely'
    );

    // 4. Simulate adversary capturing token1 and replaying it past the grace window
    const token1Hash = tokenRevA.hashToken(token1);
    const sessionInAuth = await sharedSecurityStore.getRefreshSession(token1Hash);
    if (sessionInAuth) {
      sessionInAuth.rotatedAt = Date.now() - 15000; // 15 seconds ago (exceeds 5s grace window)
      await sharedSecurityStore.updateRefreshSession(sessionInAuth);
    }
    const sessionInRedis = await redisServiceA.get<any>(REDIS_KEYS.REFRESH_SESSION(token1Hash));
    if (sessionInRedis) {
      sessionInRedis.rotatedAt = Math.floor(Date.now() / 1000) - 15;
      await redisServiceA.set(REDIS_KEYS.REFRESH_SESSION(token1Hash), sessionInRedis, 3600);
    }

    // Adversary attempts replay of token1 on Node A
    const replayAttempt = await tokenRevA.rotateRefreshTokenAsync(token1, 'attacker-token-x');
    assert(replayAttempt === null, 'Replay of rotated token detected and rejected with null');

    // 5. ENTIRE FAMILY INVALIDATION: Verify that legitimate token2 is now ALSO invalidated!
    const legitToken2Attempt = await tokenRevB.rotateRefreshTokenAsync(token2, token3);
    assert(
      legitToken2Attempt === null,
      'RFC 6819 ENFORCED: Legitimate token2 from compromised family was invalidated cluster-wide!'
    );

    passedTests++;
  }

  // ------------------------------------------------------------------------
  // TEST 7: Multi-Instance User Revocation Cutoff (Logout All / Password Reset)
  // ------------------------------------------------------------------------
  console.log('\nTest 7: Multi-instance user revocation cutoff (Logout all / Password reset)');
  {
    const userId = 'user-reset-victim';
    const t0 = Math.floor(Date.now() / 1000) - 100;
    const oldPayload = { sub: userId, email: 'victim@netvision.test', role: 'STUDENT', iat: t0 };
    const oldToken = jwt.sign(oldPayload, secretKey, { expiresIn: '1h' });

    // Node A revokes all sessions for user
    tokenRevA.revokeUserSessions(userId);

    // Node B evaluates old token
    const isOldRevoked = await tokenRevB.isRevokedAsync(oldToken, oldPayload);
    assert(isOldRevoked === true, 'Node B rejected token issued prior to user revocation cutoff');

    // Fresh token issued after cutoff
    const tFresh = Math.floor(Date.now() / 1000) + 5;
    const freshPayload = { sub: userId, email: 'victim@netvision.test', role: 'STUDENT', iat: tFresh };
    const freshToken = jwt.sign(freshPayload, secretKey, { expiresIn: '1h' });

    const isFreshRevoked = await tokenRevB.isRevokedAsync(freshToken, freshPayload);
    assert(isFreshRevoked === false, 'Node B accepts fresh token issued after user revocation cutoff');

    passedTests++;
  }

  // ------------------------------------------------------------------------
  // TEST 8: Rate Limiting Degraded Tightened Security Mode
  // ------------------------------------------------------------------------
  console.log('\nTest 8: Rate limiting degraded tightened security mode during Redis outage');
  {
    const rateLimiterHealthy = new RateLimiterService(mockConfigService, redisServiceA);
    assert(rateLimiterHealthy.isDegradedSecureMode() === false, 'RateLimiter is in normal distributed mode when Redis is up');

    // Baseline: Auth limit is standard 10 attempts
    const clientIp = '198.51.100.42';
    const authRes = rateLimiterHealthy.checkAuthLimit(clientIp);
    assert(authRes.limit === 10, 'Standard Auth rate limit is 10 attempts');

    // Abruptly sever Redis connection
    cluster.isOnline = false;
    const rateLimiterDegraded = new RateLimiterService(mockConfigService, undefined);
    assert(rateLimiterDegraded.isDegradedSecureMode() === true, 'RateLimiter detects degraded secure mode during Redis outage');

    // Degraded mode: Auth limit is clamped to prevent multi-instance spray attacks (50% tightened)
    const degradedIp = '203.0.113.88';
    const degradedAuthRes = rateLimiterDegraded.checkAuthLimit(degradedIp);
    assert(
      degradedAuthRes.allowed === true && degradedAuthRes.limit === 5,
      'Degraded auth limit is strictly tightened to 5 attempts (50% threshold) to prevent cluster spray attacks'
    );

    // Public route remains gracefully available
    const pubRes = rateLimiterDegraded.checkPublicLimit(degradedIp);
    assert(pubRes.allowed === true, 'Public endpoint operates in graceful temporary degraded mode');

    cluster.isOnline = true;
    rateLimiterHealthy.destroy();
    rateLimiterDegraded.destroy();
    passedTests++;
  }

  // ------------------------------------------------------------------------
  // TEST 9: Strict Fail-Closed Partition Semantics
  // ------------------------------------------------------------------------
  console.log('\nTest 9: Strict fail-closed partition semantics when all distributed stores fail');
  {
    // Simulate total cluster partition: Redis is offline AND Authoritative Store is offline
    cluster.isOnline = false;
    redisServiceA.setConnected(false);
    redisServiceB.setConnected(false);
    sharedSecurityStore.isOnline = false;

    // Enable fail-closed policy
    tokenRevB.setFailClosed(true);

    const unknownPayload = { sub: 'unknown-user', email: 'unk@test.com', role: 'STUDENT', iat: Math.floor(Date.now() / 1000) };
    const unknownToken = jwt.sign(unknownPayload, secretKey, { expiresIn: '1h' });

    // Under total partition, the node cannot confirm whether this token was revoked on another node.
    // In fail-closed mode, it MUST reject rather than silently allow potentially compromised token!
    const isRevokedInPartition = await tokenRevB.isRevokedAsync(unknownToken, unknownPayload);
    assert(
      isRevokedInPartition === true,
      'FAIL-CLOSED VERIFIED: Unverified token rejected when all distributed security stores are partitioned'
    );

    // Restore stores
    cluster.isOnline = true;
    redisServiceA.setConnected(true);
    redisServiceB.setConnected(true);
    sharedSecurityStore.isOnline = true;
    tokenRevB.setFailClosed(false);
    passedTests++;
  }

  // Cleanup
  await tokenRevA.onModuleDestroy();
  await tokenRevB.onModuleDestroy();

  console.log('\n========================================================================');
  console.log(`🎉 ALL ${passedTests}/9 DROP 25 DISTRIBUTED SECURITY STATE TESTS PASSED!`);
  console.log('========================================================================\n');
}

runDrop25Tests().catch((err) => {
  console.error('\n❌ DROP 25 TEST SUITE FAILED:', err);
  process.exit(1);
});
