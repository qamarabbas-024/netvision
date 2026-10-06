import { Injectable, Logger, OnModuleDestroy, Optional, Inject, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import type { MonitoringService } from '../monitoring/monitoring.service';
import { RedisService } from '../redis/redis.service';
import { PrismaService } from '../database/prisma.service';
import {
  REDIS_KEYS,
  DISTRIBUTED_TTL,
  DistributedRevokedToken,
  DistributedRefreshSession,
  SecurityStateTier,
  DROP_25_STATE_CLASSIFICATION,
} from '../redis/distributed-state.interface';
import {
  IAuthoritativeSecurityStore,
  RevokedTokenRecord,
  RefreshSession,
} from './stores/authoritative-security.store';

export { RevokedTokenRecord, RefreshSession };

export interface RotationResult {
  userId: string;
  familyId: string;
  isConcurrentRetry?: boolean;
}

@Injectable()
export class TokenRevocationService implements OnModuleDestroy {
  private readonly logger = new Logger(TokenRevocationService.name);
  private monitoringService?: MonitoringService;

  // Storage configuration (Secondary file fallback when Redis is absent)
  private readonly storageDir: string;
  private readonly revokedTokensFile: string;
  private readonly userCutoffsFile: string;
  private readonly refreshSessionsFile: string;
  private readonly familyTokensFile: string;

  // File modification trackers for multi-instance cache invalidation
  private revokedTokensMtime = 0;
  private userCutoffsMtime = 0;
  private refreshSessionsMtime = 0;
  private familyTokensMtime = 0;

  // In-memory synced L1 caches
  private revokedTokens = new Map<string, RevokedTokenRecord>();
  private userRevocationCutoffs = new Map<string, number>();
  private refreshSessions = new Map<string, RefreshSession>();
  private familyTokens = new Map<string, Set<string>>();

  // Grace period for concurrent refresh requests (e.g. multi-tab browser refresh)
  private readonly concurrentGracePeriodMs = DISTRIBUTED_TTL.CONCURRENT_REFRESH_GRACE_SEC * 1000;

  // Authoritative persistent security store (PostgreSQL / Shared Cluster Driver)
  private authoritativeStore?: IAuthoritativeSecurityStore;

  // Fail-Closed policy on total cluster partition
  private failClosedOnPartition = false;

  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(
    @Optional() @Inject('TOKEN_STORAGE_DIR') customStorageDir?: string,
    @Optional() private readonly redisService?: RedisService,
    @Optional() private readonly prisma?: PrismaService,
    @Optional() @Inject('AUTHORITATIVE_SECURITY_STORE') authoritativeStore?: IAuthoritativeSecurityStore
  ) {
    const baseDir =
      customStorageDir ||
      process.env.TOKEN_REVOCATION_STORAGE_DIR ||
      path.join(process.cwd(), '.storage', 'revocations');

    this.storageDir = baseDir;
    this.revokedTokensFile = path.join(this.storageDir, 'revoked_tokens.json');
    this.userCutoffsFile = path.join(this.storageDir, 'user_cutoffs.json');
    this.refreshSessionsFile = path.join(this.storageDir, 'refresh_sessions.json');
    this.familyTokensFile = path.join(this.storageDir, 'family_tokens.json');

    this.authoritativeStore = authoritativeStore;

    this.ensureStorageDir();
    this.loadAllFromDisk();
    this.startPeriodicCleanup();
  }

  public setMonitoringService(ms: MonitoringService): void {
    this.monitoringService = ms;
  }

  public setAuthoritativeStore(store: IAuthoritativeSecurityStore): void {
    this.authoritativeStore = store;
  }

  public getAuthoritativeStore(): IAuthoritativeSecurityStore | undefined {
    return this.authoritativeStore;
  }

  public setFailClosed(failClosed: boolean): void {
    this.failClosedOnPartition = failClosed;
  }

  public isFailClosed(): boolean {
    return this.failClosedOnPartition;
  }

  public getStorageDir(): string {
    return this.storageDir;
  }

  public hashToken(rawToken: string): string {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
  }

  private ensureStorageDir(): void {
    try {
      if (!fs.existsSync(this.storageDir)) {
        fs.mkdirSync(this.storageDir, { recursive: true });
      }
    } catch (err: any) {
      this.logger.warn(`Storage directory ${this.storageDir} note: ${err?.message || err}`);
    }
  }

  /**
   * Atomic file writing with rename to prevent partial/corrupted reads across instances.
   */
  private atomicWriteJson(filePath: string, data: any): void {
    try {
      this.ensureStorageDir();
      const tmpPath = `${filePath}.${crypto.randomBytes(6).toString('hex')}.tmp`;
      fs.writeFileSync(tmpPath, JSON.stringify(data), 'utf8');
      try {
        fs.renameSync(tmpPath, filePath);
      } catch {
        fs.copyFileSync(tmpPath, filePath);
        try {
          fs.unlinkSync(tmpPath);
        } catch {
          // ignore cleanup error
        }
      }
    } catch (err: any) {
      this.logger.warn(`Failed to write atomic file ${filePath}: ${err?.message || err}`);
    }
  }

  private readJsonSafe<T>(filePath: string): T | null {
    try {
      if (!fs.existsSync(filePath)) return null;
      const raw = fs.readFileSync(filePath, 'utf8');
      if (!raw || raw.trim() === '') return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  private getFileMtime(filePath: string): number {
    try {
      if (!fs.existsSync(filePath)) return 0;
      return fs.statSync(filePath).mtimeMs;
    } catch {
      return 0;
    }
  }

  /**
   * Synchronizes local in-memory state with shared disk storage if modified by another instance.
   */
  public syncFromDisk(force = false): void {
    // 1. Revoked Tokens
    const currentRevMtime = this.getFileMtime(this.revokedTokensFile);
    if ((force || currentRevMtime !== this.revokedTokensMtime) && currentRevMtime > 0) {
      const records = this.readJsonSafe<Record<string, RevokedTokenRecord>>(this.revokedTokensFile);
      if (records) {
        for (const [k, v] of Object.entries(records)) {
          this.revokedTokens.set(k, v);
        }
        this.revokedTokensMtime = currentRevMtime;
      }
    }

    // 2. User Cutoffs
    const currentCutMtime = this.getFileMtime(this.userCutoffsFile);
    if ((force || currentCutMtime !== this.userCutoffsMtime) && currentCutMtime > 0) {
      const cutoffs = this.readJsonSafe<Record<string, number>>(this.userCutoffsFile);
      if (cutoffs) {
        for (const [userId, ts] of Object.entries(cutoffs)) {
          const existing = this.userRevocationCutoffs.get(userId) || 0;
          this.userRevocationCutoffs.set(userId, Math.max(existing, ts));
        }
        this.userCutoffsMtime = currentCutMtime;
      }
    }

    // 3. Refresh Sessions
    const currentSessMtime = this.getFileMtime(this.refreshSessionsFile);
    if ((force || currentSessMtime !== this.refreshSessionsMtime) && currentSessMtime > 0) {
      const sessions = this.readJsonSafe<Record<string, RefreshSession>>(this.refreshSessionsFile);
      if (sessions) {
        for (const [k, v] of Object.entries(sessions)) {
          this.refreshSessions.set(k, v);
        }
        this.refreshSessionsMtime = currentSessMtime;
      }
    }

    // 4. Family Tokens
    const currentFamMtime = this.getFileMtime(this.familyTokensFile);
    if ((force || currentFamMtime !== this.familyTokensMtime) && currentFamMtime > 0) {
      const families = this.readJsonSafe<Record<string, string[]>>(this.familyTokensFile);
      if (families) {
        for (const [famId, hashes] of Object.entries(families)) {
          if (!this.familyTokens.has(famId)) {
            this.familyTokens.set(famId, new Set(hashes));
          } else {
            for (const h of hashes) this.familyTokens.get(famId)!.add(h);
          }
        }
        this.familyTokensMtime = currentFamMtime;
      }
    }
  }

  private loadAllFromDisk(): void {
    this.syncFromDisk();
  }

  private persistRevokedTokens(): void {
    const obj = Object.fromEntries(this.revokedTokens.entries());
    this.atomicWriteJson(this.revokedTokensFile, obj);
    this.revokedTokensMtime = this.getFileMtime(this.revokedTokensFile);
  }

  private persistUserCutoffs(): void {
    const obj = Object.fromEntries(this.userRevocationCutoffs.entries());
    this.atomicWriteJson(this.userCutoffsFile, obj);
    this.userCutoffsMtime = this.getFileMtime(this.userCutoffsFile);
  }

  private persistRefreshSessions(): void {
    const obj = Object.fromEntries(this.refreshSessions.entries());
    this.atomicWriteJson(this.refreshSessionsFile, obj);
    this.refreshSessionsMtime = this.getFileMtime(this.refreshSessionsFile);
  }

  private persistFamilyTokens(): void {
    const obj: Record<string, string[]> = {};
    for (const [famId, set] of this.familyTokens.entries()) {
      obj[famId] = Array.from(set);
    }
    this.atomicWriteJson(this.familyTokensFile, obj);
    this.familyTokensMtime = this.getFileMtime(this.familyTokensFile);
  }

  /**
   * Revokes a specific access token (e.g. upon logout).
   * Persisted to Authoritative Store + Redis (if available) + L1 memory cache.
   */
  public revokeToken(rawToken: string, expirySeconds: number = DISTRIBUTED_TTL.DEFAULT_ACCESS_TOKEN_REVOCATION_SEC): void {
    if (!rawToken || typeof rawToken !== 'string') return;
    this.syncFromDisk();
    const tokenHash = this.hashToken(rawToken);
    const now = Date.now();
    const record: RevokedTokenRecord = {
      tokenHash,
      revokedAt: now,
      expiresAt: now + expirySeconds * 1000,
      sourceInstanceId: this.redisService?.instanceId,
    };

    this.revokedTokens.set(tokenHash, record);
    this.persistRevokedTokens();

    // 1. Authoritative Store Persistence (Durable Cluster-Wide Source of Truth)
    if (this.authoritativeStore) {
      this.authoritativeStore.saveRevokedToken(record).catch((err) => {
        this.logger.warn(`Failed to persist token revocation to authoritative store: ${err?.message || err}`);
      });
    }

    // 2. Distributed Redis Persistence (L2 Fast Path)
    if (this.redisService?.isAvailable()) {
      const distRecord: DistributedRevokedToken = {
        tokenHash,
        revokedAt: Math.floor(now / 1000),
        expiresAt: Math.floor((now + expirySeconds * 1000) / 1000),
        sourceInstanceId: this.redisService.instanceId,
      };
      this.redisService.set(
        REDIS_KEYS.REVOKED_TOKEN(tokenHash),
        distRecord,
        expirySeconds
      ).catch((err) => {
        this.logger.warn(`Failed to replicate token revocation to Redis: ${err?.message || err}`);
      });
    }
  }

  /**
   * Asynchronously revokes a token, awaiting authoritative persistence.
   */
  public async revokeTokenAsync(rawToken: string, expirySeconds: number = DISTRIBUTED_TTL.DEFAULT_ACCESS_TOKEN_REVOCATION_SEC): Promise<void> {
    if (!rawToken || typeof rawToken !== 'string') return;
    this.syncFromDisk();
    const tokenHash = this.hashToken(rawToken);
    const now = Date.now();
    const record: RevokedTokenRecord = {
      tokenHash,
      revokedAt: now,
      expiresAt: now + expirySeconds * 1000,
      sourceInstanceId: this.redisService?.instanceId,
    };

    this.revokedTokens.set(tokenHash, record);
    this.persistRevokedTokens();

    // 1. Authoritative Store Persistence
    if (this.authoritativeStore) {
      try {
        await this.authoritativeStore.saveRevokedToken(record);
      } catch (err: any) {
        this.logger.warn(`Failed to persist token revocation to authoritative store: ${err?.message || err}`);
      }
    }

    // 2. Distributed Redis Persistence
    if (this.redisService?.isAvailable()) {
      const distRecord: DistributedRevokedToken = {
        tokenHash,
        revokedAt: Math.floor(now / 1000),
        expiresAt: Math.floor((now + expirySeconds * 1000) / 1000),
        sourceInstanceId: this.redisService.instanceId,
      };
      await this.redisService.set(
        REDIS_KEYS.REVOKED_TOKEN(tokenHash),
        distRecord,
        expirySeconds
      ).catch(() => {});
    }
  }

  /**
   * Revokes all active sessions for a specific user ID issued before now.
   * Multi-instance distributed update via Authoritative Store + Redis + PostgreSQL user.updatedAt.
   */
  public revokeUserSessions(userId: string): void {
    if (!userId) return;
    this.syncFromDisk();
    const nowSec = Math.floor(Date.now() / 1000);
    this.userRevocationCutoffs.set(userId, nowSec);
    this.persistUserCutoffs();
    this.revokeUserRefreshTokens(userId);

    // 1. Authoritative Store Persistence
    if (this.authoritativeStore) {
      this.authoritativeStore.saveUserCutoff(userId, nowSec).catch((err) => {
        this.logger.warn(`Failed to replicate user cutoff to authoritative store: ${err?.message || err}`);
      });
      this.authoritativeStore.revokeUserRefreshSessions(userId).catch(() => {});
    }

    // 2. Distributed Redis Persistence & Cache Invalidation
    if (this.redisService?.isAvailable()) {
      this.redisService.set(
        REDIS_KEYS.USER_REVOCATION_CUTOFF(userId),
        nowSec,
        DISTRIBUTED_TTL.USER_REVOCATION_CUTOFF_SEC
      ).catch((err) => {
        this.logger.warn(`Failed to replicate user cutoff to Redis: ${err?.message || err}`);
      });
      // Invalidate cached user identity immediately
      this.redisService.del(REDIS_KEYS.USER_IDENTITY_CACHE(userId)).catch(() => {});
    }

    // 3. PostgreSQL Multi-Instance Synchronization:
    // Updating user.updatedAt ensures ANY instance rejects tokens issued prior to this moment
    if (this.prisma) {
      this.prisma.user.updateMany({
        where: { id: userId },
        data: { updatedAt: new Date() },
      }).catch((err) => {
        this.logger.warn(`Failed to update user.updatedAt for user ${userId}: ${err?.message || err}`);
      });
    }
  }

  /**
   * Evaluates if a given token or user session has been revoked synchronously.
   * Checks L1 memory cache and disk fallback.
   */
  public isRevoked(rawToken?: string, payload?: { sub?: string; iat?: number }): boolean {
    this.syncFromDisk();

    // 1. Check specific token hash in blacklist
    if (rawToken && typeof rawToken === 'string') {
      const tokenHash = this.hashToken(rawToken);
      if (this.revokedTokens.has(tokenHash)) {
        return true;
      }
    }

    // 2. Check user-level revocation cutoff timestamp
    if (payload?.sub && payload.iat !== undefined) {
      const cutoff = this.userRevocationCutoffs.get(payload.sub);
      if (cutoff && payload.iat < cutoff) {
        return true;
      }
    }

    return false;
  }

  /**
   * Evaluates if a given token or user session has been revoked asynchronously.
   * Checks L1 memory cache -> Distributed Redis -> Shared Authoritative Store (PostgreSQL).
   *
   * FAILURE SEMANTICS:
   * - If Redis is unavailable, queries Authoritative Store.
   * - Never silently falls back to local-only state.
   * - If both Redis and Authoritative Store are unreachable and failClosed is set, fails closed.
   */
  public async isRevokedAsync(rawToken?: string, payload?: { sub?: string; iat?: number }): Promise<boolean> {
    // 1. Fast path: L1 memory cache
    if (this.isRevoked(rawToken, payload)) {
      return true;
    }

    // 2. Distributed path 1: Query Redis cluster (if available)
    let redisSuccess = false;

    // 2. Distributed path 1: Query Redis cluster (if available)
    if (this.redisService?.isAvailable()) {
      try {
        if (rawToken && typeof rawToken === 'string') {
          const tokenHash = this.hashToken(rawToken);
          const redisRevoked = await this.redisService.get<DistributedRevokedToken>(REDIS_KEYS.REVOKED_TOKEN(tokenHash));
          if (this.redisService.isAvailable()) {
            redisSuccess = true;
          }
          if (redisRevoked) {
            // Populate local L1 cache
            this.revokedTokens.set(tokenHash, {
              tokenHash,
              revokedAt: redisRevoked.revokedAt * 1000,
              expiresAt: redisRevoked.expiresAt * 1000,
            });
            return true;
          }
        }

        if (payload?.sub && payload.iat !== undefined) {
          const redisCutoff = await this.redisService.get<number>(REDIS_KEYS.USER_REVOCATION_CUTOFF(payload.sub));
          if (this.redisService.isAvailable()) {
            redisSuccess = true;
          }
          if (redisCutoff) {
            this.userRevocationCutoffs.set(payload.sub, redisCutoff);
            if (payload.iat < redisCutoff) {
              return true;
            }
          }
        }
      } catch (err: any) {
        this.logger.warn(`Redis query failed in isRevokedAsync: ${err?.message || err}`);
        redisSuccess = false;
      }
    }

    let authSuccess = false;

    // 3. Distributed path 2: Query Authoritative Store (PostgreSQL / Shared Store)
    // Mandatory when Redis is absent, or to resolve cold cache misses
    if (!redisSuccess && this.authoritativeStore) {
      try {
        if (rawToken && typeof rawToken === 'string') {
          const tokenHash = this.hashToken(rawToken);
          const authRevoked = await this.authoritativeStore.getRevokedToken(tokenHash);
          authSuccess = true;
          if (authRevoked) {
            this.revokedTokens.set(tokenHash, authRevoked);
            // Reconcile to Redis if Redis was available but had a cache miss
            if (this.redisService?.isAvailable()) {
              const ttlSec = Math.max(1, Math.floor((authRevoked.expiresAt - Date.now()) / 1000));
              this.redisService.set(REDIS_KEYS.REVOKED_TOKEN(tokenHash), {
                tokenHash,
                revokedAt: Math.floor(authRevoked.revokedAt / 1000),
                expiresAt: Math.floor(authRevoked.expiresAt / 1000),
              }, ttlSec).catch(() => {});
            }
            return true;
          }
        }

        if (payload?.sub && payload.iat !== undefined) {
          const authCutoff = await this.authoritativeStore.getUserCutoff(payload.sub);
          authSuccess = true;
          if (authCutoff) {
            this.userRevocationCutoffs.set(payload.sub, authCutoff);
            if (payload.iat < authCutoff) {
              return true;
            }
          }
        }
      } catch (err: any) {
        this.logger.warn(`Authoritative store query failed in isRevokedAsync: ${err?.message || err}`);
        authSuccess = false;
      }
    }

    // 4. PostgreSQL Direct Check for User.updatedAt (authoritative multi-instance user cutoff when Redis is absent)
    if (!redisSuccess && this.prisma && payload?.sub && payload.iat !== undefined) {
      try {
        const dbUser = await this.prisma.user.findUnique({
          where: { id: payload.sub },
          select: { updatedAt: true },
        });
        if (dbUser?.updatedAt) {
          authSuccess = true;
          const userUpdatedSec = Math.floor(new Date(dbUser.updatedAt).getTime() / 1000);
          if (payload.iat < userUpdatedSec) {
            return true;
          }
        }
      } catch {
        // DB unreachable handled below
      }
    }

    // 5. Total Partition Failure Semantics: If neither Redis nor Authoritative Store was reachable
    if (!redisSuccess && !authSuccess) {
      if (this.failClosedOnPartition) {
        this.logger.error('CRITICAL: Total security store partition detected. Failing closed on token verification.');
        return true; // Treat as revoked in fail-closed mode
      }
    }

    return false;
  }

  /**
   * Registers a new refresh token family for a candidate.
   * Replicated across Authoritative Store + Redis + L1 memory cache.
   */
  public registerRefreshToken(
    userId: string,
    rawToken: string,
    familyId: string,
    ttlMs = DISTRIBUTED_TTL.REFRESH_TOKEN_REVOCATION_SEC * 1000
  ): RefreshSession {
    this.syncFromDisk();
    const tokenHash = this.hashToken(rawToken);
    const now = Date.now();
    const session: RefreshSession = {
      tokenHash,
      userId,
      familyId,
      expiresAt: now + ttlMs,
      isRevoked: false,
      createdAt: now,
      sourceInstanceId: this.redisService?.instanceId,
    };

    this.refreshSessions.set(tokenHash, session);
    if (!this.familyTokens.has(familyId)) {
      this.familyTokens.set(familyId, new Set());
    }
    this.familyTokens.get(familyId)!.add(tokenHash);

    this.persistRefreshSessions();
    this.persistFamilyTokens();

    // 1. Authoritative Store Persistence
    if (this.authoritativeStore) {
      this.authoritativeStore.saveRefreshSession(session).catch((err) => {
        this.logger.warn(`Failed to persist refresh session to authoritative store: ${err?.message || err}`);
      });
    }

    // 2. Distributed Redis Persistence
    if (this.redisService?.isAvailable()) {
      const ttlSec = Math.floor(ttlMs / 1000);
      const distSession: DistributedRefreshSession = {
        tokenHash,
        userId,
        familyId,
        expiresAt: Math.floor((now + ttlMs) / 1000),
        isRevoked: false,
        createdAt: Math.floor(now / 1000),
        sourceInstanceId: this.redisService.instanceId,
      };

      this.redisService.set(REDIS_KEYS.REFRESH_SESSION(tokenHash), distSession, ttlSec).catch((err) => {
        this.logger.warn(`Failed to set refresh session in Redis: ${err?.message || err}`);
      });
      this.redisService.sadd(REDIS_KEYS.REFRESH_FAMILY(familyId), tokenHash, ttlSec).catch((err) => {
        this.logger.warn(`Failed to add token to family in Redis: ${err?.message || err}`);
      });
    }

    return session;
  }

  /**
   * Synchronously rotates a refresh token.
   */
  public rotateRefreshToken(
    rawOldToken: string,
    rawNewToken: string,
    ttlMs = DISTRIBUTED_TTL.REFRESH_TOKEN_REVOCATION_SEC * 1000
  ): RotationResult | null {
    if (!rawOldToken || typeof rawOldToken !== 'string') return null;
    this.syncFromDisk();

    const oldHash = this.hashToken(rawOldToken);
    const session = this.refreshSessions.get(oldHash);

    if (!session) {
      return null;
    }

    const now = Date.now();

    if (now > session.expiresAt) {
      this.refreshSessions.delete(oldHash);
      this.persistRefreshSessions();
      if (this.redisService?.isAvailable()) {
        this.redisService.del(REDIS_KEYS.REFRESH_SESSION(oldHash)).catch(() => {});
      }
      return null;
    }

    // REUSE DETECTION & CONCURRENT REFRESH TOLERANCE
    if (session.isRevoked) {
      // If rotated recently within the grace period (e.g. concurrent browser tabs), return safe rotation
      if (session.rotatedAt && now - session.rotatedAt <= this.concurrentGracePeriodMs) {
        this.logger.log(
          `Concurrent refresh retry handled safely for user ${session.userId}, family ${session.familyId} (within ${this.concurrentGracePeriodMs}ms grace window).`
        );
        return {
          userId: session.userId,
          familyId: session.familyId,
          isConcurrentRetry: true,
        };
      }

      // Beyond grace window: Stolen token replay attack!
      this.logger.warn(
        `🚨 REFRESH TOKEN REUSE ATTACK DETECTED for user ${session.userId}, family ${session.familyId}! Invalidating entire family and active sessions across all instances.`
      );
      this.monitoringService?.recordSecurityEvent('TOKEN_REUSE_DETECTED', {
        userId: session.userId,
        details: { familyId: session.familyId },
      });
      this.revokeFamily(session.familyId);
      this.revokeUserSessions(session.userId);
      return null;
    }

    // Mark old token as revoked (used) with rotation timestamp
    session.isRevoked = true;
    session.rotatedAt = now;
    const newHash = this.hashToken(rawNewToken);
    session.replacedByHash = newHash;

    this.refreshSessions.set(oldHash, session);

    // Register new token in same family
    const newSession: RefreshSession = {
      tokenHash: newHash,
      userId: session.userId,
      familyId: session.familyId,
      expiresAt: now + ttlMs,
      isRevoked: false,
      createdAt: now,
      sourceInstanceId: this.redisService?.instanceId,
    };
    this.refreshSessions.set(newHash, newSession);

    if (!this.familyTokens.has(session.familyId)) {
      this.familyTokens.set(session.familyId, new Set());
    }
    this.familyTokens.get(session.familyId)!.add(newHash);

    this.persistRefreshSessions();
    this.persistFamilyTokens();

    // Authoritative Store Persistence
    if (this.authoritativeStore) {
      this.authoritativeStore.updateRefreshSession(session).catch(() => {});
      this.authoritativeStore.saveRefreshSession(newSession).catch(() => {});
    }

    // Distributed Redis Persistence
    if (this.redisService?.isAvailable()) {
      const ttlSec = Math.floor(ttlMs / 1000);
      const distOldSession: DistributedRefreshSession = {
        tokenHash: oldHash,
        userId: session.userId,
        familyId: session.familyId,
        expiresAt: Math.floor(session.expiresAt / 1000),
        isRevoked: true,
        createdAt: Math.floor(session.createdAt / 1000),
        rotatedAt: Math.floor(now / 1000),
        replacedByHash: newHash,
        sourceInstanceId: this.redisService.instanceId,
      };
      const distNewSession: DistributedRefreshSession = {
        tokenHash: newHash,
        userId: session.userId,
        familyId: session.familyId,
        expiresAt: Math.floor((now + ttlMs) / 1000),
        isRevoked: false,
        createdAt: Math.floor(now / 1000),
        sourceInstanceId: this.redisService.instanceId,
      };

      this.redisService.set(REDIS_KEYS.REFRESH_SESSION(oldHash), distOldSession, ttlSec).catch(() => {});
      this.redisService.set(REDIS_KEYS.REFRESH_SESSION(newHash), distNewSession, ttlSec).catch(() => {});
      this.redisService.sadd(REDIS_KEYS.REFRESH_FAMILY(session.familyId), newHash, ttlSec).catch(() => {});
    }

    return { userId: session.userId, familyId: session.familyId };
  }

  /**
   * Asynchronously rotates a refresh token with cross-instance Redis lookup,
   * Authoritative Store fallback (PostgreSQL), multi-tab grace window,
   * and cluster-wide replay reuse invalidation.
   */
  public async rotateRefreshTokenAsync(
    rawOldToken: string,
    rawNewToken: string,
    ttlMs = DISTRIBUTED_TTL.REFRESH_TOKEN_REVOCATION_SEC * 1000
  ): Promise<RotationResult | null> {
    if (!rawOldToken || typeof rawOldToken !== 'string') return null;
    this.syncFromDisk();

    const oldHash = this.hashToken(rawOldToken);
    let session = this.refreshSessions.get(oldHash);

    // 1. Authoritative distributed Redis lookup across instances
    if (this.redisService?.isAvailable()) {
      try {
        const redisSession = await this.redisService.get<DistributedRefreshSession>(
          REDIS_KEYS.REFRESH_SESSION(oldHash)
        );
        if (redisSession) {
          session = {
            tokenHash: redisSession.tokenHash,
            userId: redisSession.userId,
            familyId: redisSession.familyId,
            expiresAt: redisSession.expiresAt * 1000,
            isRevoked: redisSession.isRevoked,
            createdAt: redisSession.createdAt * 1000,
            rotatedAt: redisSession.rotatedAt ? redisSession.rotatedAt * 1000 : undefined,
            replacedByHash: redisSession.replacedByHash,
            sourceInstanceId: redisSession.sourceInstanceId,
          };
          this.refreshSessions.set(oldHash, session);
          if (!this.familyTokens.has(session.familyId)) {
            this.familyTokens.set(session.familyId, new Set());
          }
          this.familyTokens.get(session.familyId)!.add(oldHash);
        } else if (session) {
          // If Redis is online but does not have the session, another instance revoked/deleted it
          this.refreshSessions.delete(oldHash);
          session = undefined;
        }
      } catch (err: any) {
        this.logger.warn(`Redis lookup failed in rotateRefreshTokenAsync: ${err?.message || err}`);
      }
    }

    // 2. Authoritative Store Lookup (Critical fallback when Redis is absent, or to sync revocation state)
    if (this.authoritativeStore) {
      try {
        const authSession = await this.authoritativeStore.getRefreshSession(oldHash);
        if (authSession) {
          session = { ...authSession };
          this.refreshSessions.set(oldHash, session);
          if (!this.familyTokens.has(session.familyId)) {
            this.familyTokens.set(session.familyId, new Set());
          }
          this.familyTokens.get(session.familyId)!.add(oldHash);
        } else if (session && !this.redisService?.isAvailable()) {
          // Evicted from authoritative store while Redis is offline
          this.refreshSessions.delete(oldHash);
          session = undefined;
        }
      } catch (err: any) {
        this.logger.warn(`Authoritative store lookup failed in rotateRefreshTokenAsync: ${err?.message || err}`);
      }
    }

    // 3. If session still not found:
    if (!session) {
      const redisOnline = this.redisService?.isAvailable() ?? false;
      const authOnline = this.authoritativeStore ? await this.authoritativeStore.isAvailable().catch(() => false) : false;
      if (!redisOnline && !authOnline) {
        this.logger.error('CRITICAL: Total security store outage during refresh token rotation. Failing closed.');
        return null;
      }
      return null;
    }

    const now = Date.now();

    if (now > session.expiresAt) {
      this.refreshSessions.delete(oldHash);
      this.persistRefreshSessions();
      if (this.redisService?.isAvailable()) {
        await this.redisService.del(REDIS_KEYS.REFRESH_SESSION(oldHash)).catch(() => {});
      }
      return null;
    }

    // 4. REUSE DETECTION & CONCURRENT REFRESH TOLERANCE
    if (session.isRevoked) {
      // If rotated recently within the grace period (e.g. concurrent browser tabs), return safe rotation
      if (session.rotatedAt && now - session.rotatedAt <= this.concurrentGracePeriodMs) {
        this.logger.log(
          `Concurrent refresh retry handled safely for user ${session.userId}, family ${session.familyId} (within ${this.concurrentGracePeriodMs}ms grace window).`
        );
        return {
          userId: session.userId,
          familyId: session.familyId,
          isConcurrentRetry: true,
        };
      }

      // Beyond grace window: Stolen token replay attack!
      this.logger.warn(
        `🚨 REFRESH TOKEN REUSE ATTACK DETECTED for user ${session.userId}, family ${session.familyId}! Invalidating entire family across all stores.`
      );
      this.monitoringService?.recordSecurityEvent('TOKEN_REUSE_DETECTED', {
        userId: session.userId,
        details: { familyId: session.familyId },
      });

      // Invalidate in Authoritative Store
      if (this.authoritativeStore) {
        await this.authoritativeStore.revokeFamily(session.familyId).catch(() => {});
        await this.authoritativeStore.revokeUserRefreshSessions(session.userId).catch(() => {});
      }

      // Invalidate in Redis
      await this.revokeFamilyAsync(session.familyId);

      // Invalidate user sessions
      this.revokeUserSessions(session.userId);
      return null;
    }

    // 5. Mark old token as revoked (used) with rotation timestamp
    session.isRevoked = true;
    session.rotatedAt = now;
    const newHash = this.hashToken(rawNewToken);
    session.replacedByHash = newHash;

    this.refreshSessions.set(oldHash, session);

    // 6. Register new token in same family
    const newSession: RefreshSession = {
      tokenHash: newHash,
      userId: session.userId,
      familyId: session.familyId,
      expiresAt: now + ttlMs,
      isRevoked: false,
      createdAt: now,
      sourceInstanceId: this.redisService?.instanceId,
    };
    this.refreshSessions.set(newHash, newSession);

    if (!this.familyTokens.has(session.familyId)) {
      this.familyTokens.set(session.familyId, new Set());
    }
    this.familyTokens.get(session.familyId)!.add(newHash);

    this.persistRefreshSessions();
    this.persistFamilyTokens();

    // 7. Authoritative Store Persistence
    if (this.authoritativeStore) {
      try {
        await this.authoritativeStore.updateRefreshSession(session);
        await this.authoritativeStore.saveRefreshSession(newSession);
      } catch (err: any) {
        this.logger.warn(`Failed to update authoritative store during token rotation: ${err?.message || err}`);
      }
    }

    // 8. Distributed Redis Persistence
    if (this.redisService?.isAvailable()) {
      const ttlSec = Math.floor(ttlMs / 1000);
      const distOldSession: DistributedRefreshSession = {
        tokenHash: oldHash,
        userId: session.userId,
        familyId: session.familyId,
        expiresAt: Math.floor(session.expiresAt / 1000),
        isRevoked: true,
        createdAt: Math.floor(session.createdAt / 1000),
        rotatedAt: Math.floor(now / 1000),
        replacedByHash: newHash,
        sourceInstanceId: this.redisService.instanceId,
      };
      const distNewSession: DistributedRefreshSession = {
        tokenHash: newHash,
        userId: session.userId,
        familyId: session.familyId,
        expiresAt: Math.floor((now + ttlMs) / 1000),
        isRevoked: false,
        createdAt: Math.floor(now / 1000),
        sourceInstanceId: this.redisService.instanceId,
      };

      await Promise.all([
        this.redisService.set(REDIS_KEYS.REFRESH_SESSION(oldHash), distOldSession, ttlSec),
        this.redisService.set(REDIS_KEYS.REFRESH_SESSION(newHash), distNewSession, ttlSec),
        this.redisService.sadd(REDIS_KEYS.REFRESH_FAMILY(session.familyId), newHash, ttlSec),
      ]).catch((err) => {
        this.logger.warn(`Failed to replicate rotated refresh session to Redis: ${err?.message || err}`);
      });
    }

    return { userId: session.userId, familyId: session.familyId };
  }

  public async revokeFamilyAsync(familyId: string): Promise<void> {
    this.revokeFamily(familyId);
    if (this.authoritativeStore) {
      await this.authoritativeStore.revokeFamily(familyId).catch(() => {});
    }
    if (this.redisService?.isAvailable()) {
      try {
        const tokenHashes = await this.redisService.smembers(REDIS_KEYS.REFRESH_FAMILY(familyId));
        if (tokenHashes && tokenHashes.length > 0) {
          const keysToDelete = tokenHashes.map((h) => REDIS_KEYS.REFRESH_SESSION(h));
          await this.redisService.del(keysToDelete);
        }
        await this.redisService.del(REDIS_KEYS.REFRESH_FAMILY(familyId));
      } catch (err: any) {
        this.logger.warn(`Failed to invalidate family ${familyId} in Redis: ${err?.message || err}`);
      }
    }
  }

  public revokeFamily(familyId: string): void {
    this.syncFromDisk();
    const hashes = this.familyTokens.get(familyId);
    if (hashes) {
      for (const hash of hashes) {
        const sess = this.refreshSessions.get(hash);
        if (sess) {
          sess.isRevoked = true;
        }
      }
      this.persistRefreshSessions();
      this.persistFamilyTokens();
    }

    if (this.authoritativeStore) {
      this.authoritativeStore.revokeFamily(familyId).catch(() => {});
    }

    // Distributed Redis Invalidation
    if (this.redisService?.isAvailable()) {
      this.redisService.smembers(REDIS_KEYS.REFRESH_FAMILY(familyId)).then((tokenHashes) => {
        if (tokenHashes && tokenHashes.length > 0) {
          const keysToDelete = tokenHashes.map((h) => REDIS_KEYS.REFRESH_SESSION(h));
          this.redisService?.del(keysToDelete).catch(() => {});
        }
        this.redisService?.del(REDIS_KEYS.REFRESH_FAMILY(familyId)).catch(() => {});
      }).catch(() => {});
    }
  }

  public revokeUserRefreshTokens(userId: string): void {
    this.syncFromDisk();
    let modified = false;
    const revokedFamilyIds = new Set<string>();

    for (const [hash, session] of this.refreshSessions.entries()) {
      if (session.userId === userId) {
        session.isRevoked = true;
        revokedFamilyIds.add(session.familyId);
        modified = true;
      }
    }
    if (modified) {
      this.persistRefreshSessions();
    }

    if (this.authoritativeStore) {
      this.authoritativeStore.revokeUserRefreshSessions(userId).catch(() => {});
    }

    for (const famId of revokedFamilyIds) {
      this.revokeFamily(famId);
    }
  }

  /**
   * Reconciles authoritative persistent state into Redis when Redis reconnects.
   * Ensures zero state discrepancy after Redis recovery.
   */
  public async reconcileWithRedis(): Promise<{ reconciledRevocations: number; reconciledSessions: number }> {
    if (!this.redisService?.isAvailable() || !this.authoritativeStore) {
      return { reconciledRevocations: 0, reconciledSessions: 0 };
    }

    const now = Date.now();
    let reconciledRevocations = 0;
    const reconciledSessions = 0;

    try {
      const activeRevocations = await this.authoritativeStore.getAllActiveRevocations();
      for (const rec of activeRevocations) {
        if (rec.expiresAt > now) {
          const ttlSec = Math.max(1, Math.floor((rec.expiresAt - now) / 1000));
          const distRecord: DistributedRevokedToken = {
            tokenHash: rec.tokenHash,
            revokedAt: Math.floor(rec.revokedAt / 1000),
            expiresAt: Math.floor(rec.expiresAt / 1000),
            reason: rec.reason,
            sourceInstanceId: rec.sourceInstanceId,
          };
          await this.redisService.set(REDIS_KEYS.REVOKED_TOKEN(rec.tokenHash), distRecord, ttlSec);
          reconciledRevocations++;
        }
      }

      this.logger.log(`Safe State Reconciliation: Reconciled ${reconciledRevocations} revocations to Redis.`);
    } catch (err: any) {
      this.logger.warn(`Failed during Redis state reconciliation: ${err?.message || err}`);
    }

    return { reconciledRevocations, reconciledSessions };
  }

  private startPeriodicCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.syncFromDisk();
      const now = Date.now();
      let revChanged = false;
      let sessChanged = false;

      for (const [hash, record] of this.revokedTokens.entries()) {
        if (now > record.expiresAt) {
          this.revokedTokens.delete(hash);
          revChanged = true;
        }
      }
      for (const [hash, session] of this.refreshSessions.entries()) {
        if (now > session.expiresAt) {
          this.refreshSessions.delete(hash);
          sessChanged = true;
        }
      }

      if (revChanged) this.persistRevokedTokens();
      if (sessChanged) this.persistRefreshSessions();
    }, 60000);

    if (this.cleanupInterval && typeof this.cleanupInterval.unref === 'function') {
      this.cleanupInterval.unref();
    }
  }

  onModuleDestroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}
