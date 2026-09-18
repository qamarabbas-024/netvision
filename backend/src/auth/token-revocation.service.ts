import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

export interface RevokedTokenRecord {
  tokenHash: string;
  revokedAt: number;
  expiresAt: number;
}

export interface RefreshSession {
  tokenHash: string;
  userId: string;
  familyId: string;
  expiresAt: number;
  isRevoked: boolean;
  createdAt: number;
  rotatedAt?: number;
  replacedByHash?: string;
}

export interface RotationResult {
  userId: string;
  familyId: string;
  isConcurrentRetry?: boolean;
}

@Injectable()
export class TokenRevocationService implements OnModuleDestroy {
  private readonly logger = new Logger(TokenRevocationService.name);

  // Storage configuration
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

  // In-memory synced caches
  private revokedTokens = new Map<string, RevokedTokenRecord>();
  private userRevocationCutoffs = new Map<string, number>();
  private refreshSessions = new Map<string, RefreshSession>();
  private familyTokens = new Map<string, Set<string>>();

  // Grace period for concurrent refresh requests (e.g. multi-tab browser refresh)
  private readonly concurrentGracePeriodMs = 5000;

  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(customStorageDir?: string) {
    const baseDir =
      customStorageDir ||
      process.env.TOKEN_REVOCATION_STORAGE_DIR ||
      path.join(process.cwd(), '.storage', 'revocations');

    this.storageDir = baseDir;
    this.revokedTokensFile = path.join(this.storageDir, 'revoked_tokens.json');
    this.userCutoffsFile = path.join(this.storageDir, 'user_cutoffs.json');
    this.refreshSessionsFile = path.join(this.storageDir, 'refresh_sessions.json');
    this.familyTokensFile = path.join(this.storageDir, 'family_tokens.json');

    this.ensureStorageDir();
    this.loadAllFromDisk();
    this.startPeriodicCleanup();
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
      this.logger.error(`Failed to initialize storage directory ${this.storageDir}: ${err?.message || err}`);
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
      fs.renameSync(tmpPath, filePath);
    } catch (err: any) {
      this.logger.error(`Failed to write atomic file ${filePath}: ${err?.message || err}`);
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
  public syncFromDisk(): void {
    // 1. Revoked Tokens
    const currentRevMtime = this.getFileMtime(this.revokedTokensFile);
    if (currentRevMtime > this.revokedTokensMtime) {
      const records = this.readJsonSafe<Record<string, RevokedTokenRecord>>(this.revokedTokensFile);
      if (records) {
        this.revokedTokens = new Map(Object.entries(records));
        this.revokedTokensMtime = currentRevMtime;
      }
    }

    // 2. User Cutoffs
    const currentCutMtime = this.getFileMtime(this.userCutoffsFile);
    if (currentCutMtime > this.userCutoffsMtime) {
      const cutoffs = this.readJsonSafe<Record<string, number>>(this.userCutoffsFile);
      if (cutoffs) {
        this.userRevocationCutoffs = new Map(Object.entries(cutoffs));
        this.userCutoffsMtime = currentCutMtime;
      }
    }

    // 3. Refresh Sessions
    const currentSessMtime = this.getFileMtime(this.refreshSessionsFile);
    if (currentSessMtime > this.refreshSessionsMtime) {
      const sessions = this.readJsonSafe<Record<string, RefreshSession>>(this.refreshSessionsFile);
      if (sessions) {
        this.refreshSessions = new Map(Object.entries(sessions));
        this.refreshSessionsMtime = currentSessMtime;
      }
    }

    // 4. Family Tokens
    const currentFamMtime = this.getFileMtime(this.familyTokensFile);
    if (currentFamMtime > this.familyTokensMtime) {
      const families = this.readJsonSafe<Record<string, string[]>>(this.familyTokensFile);
      if (families) {
        const famMap = new Map<string, Set<string>>();
        for (const [famId, hashes] of Object.entries(families)) {
          famMap.set(famId, new Set(hashes));
        }
        this.familyTokens = famMap;
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
   * Atomically persisted across instances.
   */
  public revokeToken(rawToken: string, expirySeconds = 7 * 86400): void {
    if (!rawToken || typeof rawToken !== 'string') return;
    this.syncFromDisk();
    const tokenHash = this.hashToken(rawToken);
    const now = Date.now();
    this.revokedTokens.set(tokenHash, {
      tokenHash,
      revokedAt: now,
      expiresAt: now + expirySeconds * 1000,
    });
    this.persistRevokedTokens();
  }

  /**
   * Revokes all active sessions for a specific user ID issued before now.
   * Atomically persisted across instances.
   */
  public revokeUserSessions(userId: string): void {
    if (!userId) return;
    this.syncFromDisk();
    this.userRevocationCutoffs.set(userId, Math.floor(Date.now() / 1000));
    this.persistUserCutoffs();
    this.revokeUserRefreshTokens(userId);
  }

  /**
   * Evaluates if a given token or user session has been revoked.
   * Pulls latest shared state before decision.
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
   * Registers a new refresh token family for a candidate.
   * Atomically persisted across instances.
   */
  public registerRefreshToken(
    userId: string,
    rawToken: string,
    familyId: string,
    ttlMs = 7 * 24 * 60 * 60 * 1000
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
    };

    this.refreshSessions.set(tokenHash, session);
    if (!this.familyTokens.has(familyId)) {
      this.familyTokens.set(familyId, new Set());
    }
    this.familyTokens.get(familyId)!.add(tokenHash);

    this.persistRefreshSessions();
    this.persistFamilyTokens();

    return session;
  }

  /**
   * Rotates a refresh token with atomic persistence, multi-instance synchronization,
   * concurrent refresh tolerance, and strict replay reuse invalidation.
   */
  public rotateRefreshToken(
    rawOldToken: string,
    rawNewToken: string,
    ttlMs = 7 * 24 * 60 * 60 * 1000
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
    };
    this.refreshSessions.set(newHash, newSession);

    if (!this.familyTokens.has(session.familyId)) {
      this.familyTokens.set(session.familyId, new Set());
    }
    this.familyTokens.get(session.familyId)!.add(newHash);

    this.persistRefreshSessions();
    this.persistFamilyTokens();

    return { userId: session.userId, familyId: session.familyId };
  }

  public revokeFamily(familyId: string): void {
    this.syncFromDisk();
    const hashes = this.familyTokens.get(familyId);
    if (hashes) {
      for (const hash of hashes) {
        this.refreshSessions.delete(hash);
      }
      this.familyTokens.delete(familyId);
      this.persistRefreshSessions();
      this.persistFamilyTokens();
    }
  }

  public revokeUserRefreshTokens(userId: string): void {
    this.syncFromDisk();
    let modified = false;
    for (const [hash, session] of this.refreshSessions.entries()) {
      if (session.userId === userId) {
        this.refreshSessions.delete(hash);
        modified = true;
      }
    }
    if (modified) {
      this.persistRefreshSessions();
    }
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
