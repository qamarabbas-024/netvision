/**
 * NETVISION — DROP 05: DISTRIBUTED STATE & MULTI-INSTANCE RELIABILITY
 * AUTOMATED MULTI-INSTANCE SIMULATION TEST SUITE
 *
 * Simulates:
 * 1. State Classification & Key Architecture Audit
 * 2. Multi-Instance Lab Session Consistency (Instance A creates -> Instance B reads)
 * 3. Cross-Instance Lab Execution & Concurrency Versioning
 * 4. Session Ownership Enforcement Across Distributed Instances
 * 5. Pod Restart Simulation (Session survives container destruction & rehydrates)
 * 6. Multi-Instance Token Revocation (Instance A revokes -> Instance B rejects)
 * 7. Multi-Instance User Session Cutoff (Instance A revokes all -> Instance B rejects prior tokens)
 * 8. Multi-Instance Refresh Token Rotation & Replay Reuse Detection
 * 9. Multi-Instance Troubleshooting Incident Session State Sharing
 * 10. Resilient Fallback Mode when Redis is Offline / Disconnected
 * 11. Strict "No Dumping Ground" Verification (Namespaces, TTLs, Serialization)
 */

import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { REDIS_KEYS, DISTRIBUTED_TTL, StateClassification } from '../src/redis/distributed-state.interface';
import { RedisService } from '../src/redis/redis.service';
import { TokenRevocationService } from '../src/auth/token-revocation.service';
import { TopicsService } from '../src/topics/topics.service';
import { TroubleshootingService } from '../src/troubleshooting/troubleshooting.service';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

/**
 * High-Fidelity In-Memory Redis Cluster Simulator
 * Simulates shared distributed memory across isolated process instances,
 * including TTL expiration, string keys, sets, and atomic Lua script execution.
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

        // Handle 'EX', ttlSeconds, 'NX'
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
      async eval(script: string, numKeys: number, ...args: any[]): Promise<any> {
        if (!cluster.isOnline) throw new Error('ECONNREFUSED: Redis cluster offline');
        const key = args[0];
        const token = args[1];
        const entry = cluster.store.get(key);
        if (entry && entry.value === token) {
          cluster.store.delete(key);
          return 1;
        }
        return 0;
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
 * Mock Prisma Client for Testing Database Checkpointing
 */
function createMockPrisma() {
  const sandboxSessions = new Map<string, any>();
  const users = new Map<string, any>();

  return {
    sandboxSession: {
      create: async ({ data }: any) => {
        sandboxSessions.set(data.id, {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return sandboxSessions.get(data.id);
      },
      findFirst: async ({ where }: any) => {
        for (const sess of sandboxSessions.values()) {
          const userMatches = where.OR?.some((cond: any) => cond.userId && sess.userId === cond.userId);
          const anonMatches = where.OR?.some((cond: any) => cond.anonymousId && sess.anonymousId === cond.anonymousId);
          if ((userMatches || anonMatches) && sess.status === 'RUNNING') {
            return sess;
          }
        }
        return null;
      },
      updateMany: async ({ where, data }: any) => {
        const sess = sandboxSessions.get(where.id);
        if (sess) {
          Object.assign(sess, data, { updatedAt: new Date() });
          return { count: 1 };
        }
        return { count: 0 };
      },
    },
    user: {
      updateMany: async ({ where, data }: any) => {
        const user = users.get(where.id);
        if (user) {
          Object.assign(user, data);
          return { count: 1 };
        }
        return { count: 0 };
      },
    },
    lessonLab: {
      findUnique: async ({ where }: any) => ({
        id: where.id,
        lesson: { slug: 'lesson-vlan-basics' },
      }),
      findFirst: async () => ({ id: 'lab-mock', slug: 'incident-dhcp-starvation' }),
    },
    labAttempt: {
      create: async () => ({ id: 'attempt-mock' }),
      count: async () => 0,
    },
    anonymousLearner: {
      upsert: async () => ({ id: 'mock-anon' }),
    },
    userProgress: {
      findMany: async () => [],
    },
    _rawSessions: sandboxSessions,
  };
}

async function runDrop05Tests() {
  console.log('========================================================================');
  console.log('🌐 NETVISION — DROP 05: DISTRIBUTED STATE & MULTI-INSTANCE RELIABILITY');
  console.log('========================================================================\n');

  let passedTests = 0;
  const cluster = new SimulatedRedisCluster();
  const mockPrisma = createMockPrisma();

  const mockConfigService = {
    get: (key: string, def?: any) => {
      if (key === 'REDIS_ENABLED') return 'true';
      if (key === 'REDIS_URL') return 'redis://127.0.0.1:6379';
      return def;
    },
  } as any;

  // Build two distinct Redis service instances representing two container pods
  const redisServiceA = new RedisService(mockConfigService);
  redisServiceA.setClientForTesting(cluster.createClient('pod-A'), 'inst-pod-A');

  const redisServiceB = new RedisService(mockConfigService);
  redisServiceB.setClientForTesting(cluster.createClient('pod-B'), 'inst-pod-B');

  const mockAchievementsService = {
    awardAchievement: async () => {},
  } as any;

  // ------------------------------------------------------------------------
  // TEST 1: State Inventory & Classification Audit
  // ------------------------------------------------------------------------
  console.log('Test 1: State Inventory & Classification Audit');
  {
    assert(StateClassification.SAFE_EPHEMERAL_CACHE === 'A_SAFE_EPHEMERAL_CACHE', 'Class A: Safe Ephemeral Cache defined');
    assert(StateClassification.USER_STATE === 'B_USER_STATE', 'Class B: User State defined');
    assert(StateClassification.SECURITY_STATE === 'C_SECURITY_STATE', 'Class C: Security State defined');
    assert(StateClassification.CERTIFICATION_STATE === 'D_CERTIFICATION_STATE', 'Class D: Certification State defined');
    assert(StateClassification.OPERATIONAL_TELEMETRY === 'E_OPERATIONAL_TELEMETRY', 'Class E: Operational Telemetry defined');

    assert(DISTRIBUTED_TTL.ACTIVE_LAB_SESSION_SEC === 7200, 'Active lab session TTL is bounded to 2 hours (7200s)');
    assert(DISTRIBUTED_TTL.ACTIVE_TROUBLESHOOT_SESSION_SEC === 7200, 'Active troubleshooting session TTL is bounded to 2 hours (7200s)');
    assert(DISTRIBUTED_TTL.DEFAULT_ACCESS_TOKEN_REVOCATION_SEC === 86400, 'Access token revocation TTL is bounded to 24 hours (86400s)');
    assert(DISTRIBUTED_TTL.REFRESH_TOKEN_REVOCATION_SEC === 7 * 86400, 'Refresh token revocation TTL is bounded to 7 days');

    passedTests++;
  }

  // ------------------------------------------------------------------------
  // TEST 2: Multi-Instance Lab Session (Instance A creates -> Instance B reads)
  // ------------------------------------------------------------------------
  console.log('\nTest 2: Multi-Instance Lab Session Creation & Cross-Instance Reading');
  let createdSessionId = '';
  {
    const topicsServiceA = new TopicsService(mockPrisma as any, mockAchievementsService, undefined, redisServiceA);
    const topicsServiceB = new TopicsService(mockPrisma as any, mockAchievementsService, undefined, redisServiceB);

    // Instance A creates a simulation session for learner
    const sessionA = await topicsServiceA.getOrCreateLabSession({ userId: 'learner-alpha' }, 'lab-vlan-101');
    assert(Boolean(sessionA.sessionId), 'Instance A successfully initialized lab session');
    assert(sessionA.stateVersion === 1, 'Instance A initial state version is 1');
    createdSessionId = sessionA.sessionId;

    // Instance B (with cold, empty in-memory cache) retrieves the same session
    const sessionB = await topicsServiceB.getOrCreateLabSession({ userId: 'learner-alpha' }, 'lab-vlan-101');
    assert(sessionB.sessionId === createdSessionId, 'Instance B retrieved the exact session ID created by Instance A');
    assert(sessionB.stateVersion === 1, 'Instance B sees state version 1');
    assert(sessionB.lessonSlug === sessionA.lessonSlug, 'Instance B sees identical lesson topology configuration');

    passedTests++;
  }

  // ------------------------------------------------------------------------
  // TEST 3: Cross-Instance Lab Execution & Concurrency Versioning
  // ------------------------------------------------------------------------
  console.log('\nTest 3: Cross-Instance Command Mutation & State Versioning');
  {
    const topicsServiceA = new TopicsService(mockPrisma as any, mockAchievementsService, undefined, redisServiceA);
    const topicsServiceB = new TopicsService(mockPrisma as any, mockAchievementsService, undefined, redisServiceB);

    // Instance A executes a command
    const cmdResultA = await topicsServiceA.executeLabCommand(
      { userId: 'learner-alpha' },
      {
        labId: 'lab-vlan-101',
        sessionId: createdSessionId,
        command: 'interface GigabitEthernet0/1',
        clientStateVersion: 1,
      }
    );
    assert(cmdResultA.stateVersion === 2, 'Instance A advanced state version to 2');

    // Instance B executes the next command on the same session
    const cmdResultB = await topicsServiceB.executeLabCommand(
      { userId: 'learner-alpha' },
      {
        labId: 'lab-vlan-101',
        sessionId: createdSessionId,
        command: 'switchport mode access',
        clientStateVersion: 2,
      }
    );
    assert(cmdResultB.stateVersion === 3, 'Instance B read version 2 from Redis and advanced to version 3');

    // Concurrency defense: Client submits stale state version 1 to Instance A
    let staleRejected = false;
    try {
      await topicsServiceA.executeLabCommand(
        { userId: 'learner-alpha' },
        {
          labId: 'lab-vlan-101',
          sessionId: createdSessionId,
          command: 'switchport access vlan 10',
          clientStateVersion: 1, // Stale! Authoritative server is at version 3
        }
      );
    } catch (err: any) {
      if (err instanceof ConflictException) {
        staleRejected = true;
      }
    }
    assert(staleRejected, 'Instance A rejected stale client state version with ConflictException (409)');

    // Idempotent retry: Retrying the last executed command at version 2 does not duplicate mutation
    const retryResult = await topicsServiceA.executeLabCommand(
      { userId: 'learner-alpha' },
      {
        labId: 'lab-vlan-101',
        sessionId: createdSessionId,
        command: 'switchport mode access',
        clientStateVersion: 2,
      }
    );
    assert(retryResult.isDuplicateRetry === true, 'Duplicate command retry safely handled idempotently without re-execution');

    passedTests++;
  }

  // ------------------------------------------------------------------------
  // TEST 4: Session Ownership Security Across Distributed Instances
  // ------------------------------------------------------------------------
  console.log('\nTest 4: Session Ownership Enforcement Across Distributed Instances');
  {
    const topicsServiceB = new TopicsService(mockPrisma as any, mockAchievementsService, undefined, redisServiceB);

    let ownershipEnforced = false;
    try {
      // Malicious user 'attacker-mallory' attempts to inspect 'learner-alpha's session on Instance B
      await topicsServiceB.getOrCreateLabSession({ userId: 'attacker-mallory' }, 'lab-vlan-101', createdSessionId);
    } catch (err: any) {
      if (err instanceof ForbiddenException) {
        ownershipEnforced = true;
      }
    }
    assert(ownershipEnforced, 'Instance B prevented unauthorized user from accessing another learner session with 403 Forbidden');

    passedTests++;
  }

  // ------------------------------------------------------------------------
  // TEST 5: Pod Restart Simulation (Session Survives Process Destruction)
  // ------------------------------------------------------------------------
  console.log('\nTest 5: Pod Restart Simulation (Session Survives Container Destruction)');
  {
    // Simulate container crash: Instance A and Instance B are completely destroyed.
    // Memory is wiped clean.
    // A brand new Instance C spins up connected to PostgreSQL + Redis.
    const redisServiceC = new RedisService(mockConfigService);
    redisServiceC.setClientForTesting(cluster.createClient('pod-C'), 'inst-pod-C');

    const topicsServiceC = new TopicsService(mockPrisma as any, mockAchievementsService, undefined, redisServiceC);

    const recoveredSession = await topicsServiceC.getOrCreateLabSession({ userId: 'learner-alpha' }, 'lab-vlan-101', createdSessionId);
    assert(recoveredSession.sessionId === createdSessionId, 'Instance C recovered session after simulated pod destruction');
    assert(recoveredSession.stateVersion === 3, 'Instance C preserved accurate stateVersion across restart');
    assert(recoveredSession.commandHistory.length > 0, 'Instance C preserved command history across restart');

    passedTests++;
  }

  // ------------------------------------------------------------------------
  // TEST 6: Multi-Instance Token Revocation (Instance A revokes -> Instance B rejects)
  // ------------------------------------------------------------------------
  console.log('\nTest 6: Multi-Instance Token Revocation (Instance A revokes -> Instance B rejects)');
  {
    const tempDirA = `.storage/test-drop05-revocations-A-${Date.now()}`;
    const tempDirB = `.storage/test-drop05-revocations-B-${Date.now()}`;

    const tokenRevocationA = new TokenRevocationService(tempDirA, redisServiceA, mockPrisma as any);
    const tokenRevocationB = new TokenRevocationService(tempDirB, redisServiceB, mockPrisma as any);

    const testPayload = { sub: 'learner-omega', email: 'omega@netvision.test', role: 'STUDENT', iat: Math.floor(Date.now() / 1000) };
    const secretKey = 'super_secret_test_key_minimum_32_chars_long';
    const testToken = jwt.sign(testPayload, secretKey, { expiresIn: '1h' });

    // Initial state: Token is valid on both Instance A and Instance B
    assert((await tokenRevocationA.isRevokedAsync(testToken, testPayload)) === false, 'Token valid initially on Instance A');
    assert((await tokenRevocationB.isRevokedAsync(testToken, testPayload)) === false, 'Token valid initially on Instance B');

    // Instance A revokes token (user logged out on pod A)
    tokenRevocationA.revokeToken(testToken);

    // Instance B (with zero local knowledge) checks token asynchronously via distributed Redis
    const isRevokedOnB = await tokenRevocationB.isRevokedAsync(testToken, testPayload);
    assert(isRevokedOnB === true, 'Instance B immediately rejected token revoked by Instance A');

    await tokenRevocationA.onModuleDestroy();
    await tokenRevocationB.onModuleDestroy();
    passedTests++;
  }

  // ------------------------------------------------------------------------
  // TEST 7: Multi-Instance User Session Cutoff (Logout All / Password Reset)
  // ------------------------------------------------------------------------
  console.log('\nTest 7: Multi-Instance User Session Cutoff (Logout All / Password Reset)');
  {
    const tempDirA = `.storage/test-drop05-cutoff-A-${Date.now()}`;
    const tempDirB = `.storage/test-drop05-cutoff-B-${Date.now()}`;

    const tokenRevocationA = new TokenRevocationService(tempDirA, redisServiceA, mockPrisma as any);
    const tokenRevocationB = new TokenRevocationService(tempDirB, redisServiceB, mockPrisma as any);

    const secretKey = 'super_secret_test_key_minimum_32_chars_long';
    const t0 = Math.floor(Date.now() / 1000) - 60; // 60 seconds ago
    const oldPayload = { sub: 'user-reset-target', email: 'reset@netvision.test', role: 'STUDENT', iat: t0 };
    const oldToken = jwt.sign(oldPayload, secretKey, { expiresIn: '1h' });

    // Instance A revokes all sessions for user (e.g. password reset action)
    tokenRevocationA.revokeUserSessions('user-reset-target');

    // Instance B evaluates old token
    const isOldRevokedOnB = await tokenRevocationB.isRevokedAsync(oldToken, oldPayload);
    assert(isOldRevokedOnB === true, 'Instance B rejected token issued prior to user revocation cutoff timestamp');

    // New token issued AFTER cutoff should be valid
    const tFresh = Math.floor(Date.now() / 1000) + 10;
    const freshPayload = { sub: 'user-reset-target', email: 'reset@netvision.test', role: 'STUDENT', iat: tFresh };
    const freshToken = jwt.sign(freshPayload, secretKey, { expiresIn: '1h' });
    const isFreshRevokedOnB = await tokenRevocationB.isRevokedAsync(freshToken, freshPayload);
    assert(isFreshRevokedOnB === false, 'Instance B accepts fresh token issued after user revocation cutoff');

    await tokenRevocationA.onModuleDestroy();
    await tokenRevocationB.onModuleDestroy();
    passedTests++;
  }

  // ------------------------------------------------------------------------
  // TEST 8: Multi-Instance Refresh Token Rotation & Replay Reuse Detection
  // ------------------------------------------------------------------------
  console.log('\nTest 8: Multi-Instance Refresh Token Rotation & Replay Reuse Detection');
  {
    const tempDirA = `.storage/test-drop05-refresh-A-${Date.now()}`;
    const tempDirB = `.storage/test-drop05-refresh-B-${Date.now()}`;

    const tokenRevocationA = new TokenRevocationService(tempDirA, redisServiceA, mockPrisma as any);
    const tokenRevocationB = new TokenRevocationService(tempDirB, redisServiceB, mockPrisma as any);

    const familyId = `fam-${crypto.randomUUID()}`;
    const token1 = 'refresh-token-version-1';
    const token2 = 'refresh-token-version-2';

    // Instance A registers token 1
    tokenRevocationA.registerRefreshToken('user-refresh-1', token1, familyId);

    // Instance A rotates token 1 -> token 2
    const rotateResA = tokenRevocationA.rotateRefreshToken(token1, token2);
    assert(Boolean(rotateResA && rotateResA.userId === 'user-refresh-1'), 'Instance A successfully rotated token 1 to token 2');

    const token1Hash = tokenRevocationA.hashToken(token1);
    const token2Hash = tokenRevocationA.hashToken(token2);

    // Verify token 1 has replacedByHash in distributed store
    const session1InRedis = await redisServiceB.get<any>(REDIS_KEYS.REFRESH_SESSION(token1Hash));
    assert(session1InRedis?.replacedByHash === token2Hash, 'Instance B sees token 1 was replaced by token 2 in Redis');

    // Simulate adversary replaying old token1 past grace window
    const rawSession = (tokenRevocationA as any).refreshSessions.get(token1Hash);
    if (rawSession) {
      rawSession.rotatedAt = Date.now() - 20000; // 20s ago (> 10s grace)
    }

    const replayRes = tokenRevocationA.rotateRefreshToken(token1, 'adversary-token-3');
    assert(replayRes === null, 'Replay of rotated refresh token detected and rejected with null');

    await tokenRevocationA.onModuleDestroy();
    await tokenRevocationB.onModuleDestroy();
    passedTests++;
  }

  // ------------------------------------------------------------------------
  // TEST 9: Multi-Instance Troubleshooting Incident State Sharing
  // ------------------------------------------------------------------------
  console.log('\nTest 9: Multi-Instance Troubleshooting Session Consistency');
  {
    const tbServiceA = new TroubleshootingService(mockPrisma as any, mockAchievementsService, undefined, redisServiceA);
    const tbServiceB = new TroubleshootingService(mockPrisma as any, mockAchievementsService, undefined, redisServiceB);

    // Instance A starts an incident session
    const startedSess = await tbServiceA.startSession({ userId: 'student-tb' }, 'dns-resolution-failure');
    assert(Boolean(startedSess.sessionId), 'Instance A started troubleshooting incident session');
    assert(startedSess.currentStage === 'INCIDENT', 'Initial stage is INCIDENT');

    // Instance B (cold memory) executes diagnostic command on that session
    const execResB = await tbServiceB.executeCommand(
      { userId: 'student-tb' },
      {
        scenarioId: 'dns-resolution-failure',
        sessionId: startedSess.sessionId,
        command: 'ipconfig /all',
      }
    );
    assert(execResB.session.currentStage === 'INVESTIGATION', 'Instance B advanced stage to INVESTIGATION');
    assert(execResB.session.executedCommands.length === 1, 'Instance B recorded executed diagnostic command');

    // Instance A retrieves session status and confirms Instance B mutations are visible
    const statusA = await tbServiceA.getSessionStatus({ userId: 'student-tb' }, startedSess.sessionId);
    assert(statusA.currentStage === 'INVESTIGATION', 'Instance A sees stage updated by Instance B');
    assert(statusA.executedCommands.length === 1, 'Instance A sees diagnostic history executed on Instance B');

    passedTests++;
  }

  // ------------------------------------------------------------------------
  // TEST 10: Resilient Fallback Mode when Redis is Offline / Disconnected
  // ------------------------------------------------------------------------
  console.log('\nTest 10: Resilient Fallback Mode when Redis is Offline / Disconnected');
  {
    // Abruptly take Redis offline
    cluster.isOnline = false;
    assert(redisServiceA.isAvailable() === true, 'Client still marked before connection health failure');

    // Service operations must NOT crash with 500 when Redis throws or fails
    const topicsServiceOffline = new TopicsService(mockPrisma as any, mockAchievementsService, undefined, redisServiceA);
    let didNotCrash = false;
    try {
      // Creating or retrieving session should fall back gracefully
      const offlineSession = await topicsServiceOffline.getOrCreateLabSession({ userId: 'offline-learner' }, 'lab-vlan-101');
      assert(Boolean(offlineSession.sessionId), 'Lab session created safely in offline fallback mode without Redis');
      didNotCrash = true;
    } catch (err: any) {
      console.error('Crash in offline mode:', err);
    }
    assert(didNotCrash, 'Safe degradation verified: System functions reliably even during complete Redis outage');

    // Restore cluster
    cluster.isOnline = true;
    passedTests++;
  }

  // ------------------------------------------------------------------------
  // TEST 11: Strict "No Dumping Ground" Verification (Namespaces & TTL Bounded)
  // ------------------------------------------------------------------------
  console.log('\nTest 11: Strict "No Dumping Ground" Key Namespaces & TTL Verification');
  {
    const allKeys = cluster.getAllKeys();
    assert(allKeys.length > 0, `Audit found ${allKeys.length} keys in Redis cluster`);

    const rawStore = cluster.getRawStore();
    for (const key of allKeys) {
      // 1. Must strictly start with 'netvision:'
      assert(key.startsWith('netvision:'), `Key "${key}" conforms to strict root namespace "netvision:"`);

      // 2. Must belong to an authorized domain
      const parts = key.split(':');
      const domain = parts[1];
      const validDomains = ['sec', 'lab', 'troubleshoot', 'lock', 'cache'];
      assert(validDomains.includes(domain), `Key "${key}" has valid domain "${domain}" (one of ${validDomains.join(', ')})`);

      // 3. Must have a finite, positive expiration TTL (no unbounded keys allowed)
      const entry = rawStore.get(key);
      if (entry) {
        assert(entry.expiresAtMs !== undefined, `Key "${key}" has an explicit expiration timestamp`);
        const ttlSec = Math.floor((entry.expiresAtMs! - cluster.now()) / 1000);
        assert(ttlSec > 0, `Key "${key}" has a positive remaining TTL (${ttlSec}s)`);
        assert(ttlSec <= 30 * 86400, `Key "${key}" TTL does not exceed 30 days max policy (${ttlSec}s)`);
      }
    }

    passedTests++;
  }

  console.log('\n========================================================================');
  console.log(`🎉 ALL ${passedTests}/11 DROP 05 DISTRIBUTED STATE TESTS PASSED!`);
  console.log('========================================================================\n');
}

runDrop05Tests().catch((err) => {
  console.error('\n❌ DROP 05 TEST SUITE FAILED:', err);
  process.exit(1);
});
