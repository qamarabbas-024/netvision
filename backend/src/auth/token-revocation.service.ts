import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

interface RevokedTokenRecord {
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
}

@Injectable()
export class TokenRevocationService {
  private readonly logger = new Logger(TokenRevocationService.name);

  // Set of revoked access token hashes: hash -> RevokedTokenRecord
  private readonly revokedTokens = new Map<string, RevokedTokenRecord>();

  // User session invalidation cutoff: userId -> timestamp (iat < cutoff is rejected)
  private readonly userRevocationCutoffs = new Map<string, number>();

  // Active refresh tokens: tokenHash -> RefreshSession
  private readonly refreshSessions = new Map<string, RefreshSession>();

  // Families: familyId -> Set of tokenHashes
  private readonly familyTokens = new Map<string, Set<string>>();

  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startPeriodicCleanup();
  }

  public hashToken(rawToken: string): string {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
  }

  /**
   * Revokes a specific access token (e.g. upon logout).
   */
  public revokeToken(rawToken: string, expirySeconds = 7 * 86400): void {
    if (!rawToken || typeof rawToken !== 'string') return;
    const tokenHash = this.hashToken(rawToken);
    const now = Date.now();
    this.revokedTokens.set(tokenHash, {
      tokenHash,
      revokedAt: now,
      expiresAt: now + expirySeconds * 1000,
    });
  }

  /**
   * Revokes all active sessions for a specific user ID issued before now.
   */
  public revokeUserSessions(userId: string): void {
    if (!userId) return;
    this.userRevocationCutoffs.set(userId, Math.floor(Date.now() / 1000));
    this.revokeUserRefreshTokens(userId);
  }

  /**
   * Evaluates if a given token or user session has been revoked.
   */
  public isRevoked(rawToken?: string, payload?: { sub?: string; iat?: number }): boolean {
    // 1. Check specific token hash in blacklist
    if (rawToken && typeof rawToken === 'string') {
      const tokenHash = this.hashToken(rawToken);
      if (this.revokedTokens.has(tokenHash)) {
        return true;
      }
    }

    // 2. Check user-level revocation timestamp
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
   */
  public registerRefreshToken(
    userId: string,
    rawToken: string,
    familyId: string,
    ttlMs = 7 * 24 * 60 * 60 * 1000
  ): RefreshSession {
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

    return session;
  }

  /**
   * Rotates a refresh token.
   * If an already revoked token is used, triggers reuse detection and revokes the entire family!
   */
  public rotateRefreshToken(
    rawOldToken: string,
    rawNewToken: string,
    ttlMs = 7 * 24 * 60 * 60 * 1000
  ): { userId: string; familyId: string } | null {
    if (!rawOldToken || typeof rawOldToken !== 'string') return null;
    const oldHash = this.hashToken(rawOldToken);
    const session = this.refreshSessions.get(oldHash);

    if (!session) {
      return null;
    }

    if (Date.now() > session.expiresAt) {
      this.refreshSessions.delete(oldHash);
      return null;
    }

    // REUSE DETECTION: If token was already revoked/used, trigger session kill!
    if (session.isRevoked) {
      this.logger.warn(
        `🚨 REFRESH TOKEN REUSE DETECTED for user ${session.userId}, family ${session.familyId}! Invalidating session family.`
      );
      this.revokeFamily(session.familyId);
      this.revokeUserSessions(session.userId);
      return null;
    }

    // Mark current token as used/revoked
    session.isRevoked = true;

    // Register new token in same family
    this.registerRefreshToken(session.userId, rawNewToken, session.familyId, ttlMs);

    return { userId: session.userId, familyId: session.familyId };
  }

  public revokeFamily(familyId: string): void {
    const hashes = this.familyTokens.get(familyId);
    if (hashes) {
      for (const hash of hashes) {
        this.refreshSessions.delete(hash);
      }
      this.familyTokens.delete(familyId);
    }
  }

  public revokeUserRefreshTokens(userId: string): void {
    for (const [hash, session] of this.refreshSessions.entries()) {
      if (session.userId === userId) {
        this.refreshSessions.delete(hash);
      }
    }
  }

  private startPeriodicCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [hash, record] of this.revokedTokens.entries()) {
        if (now > record.expiresAt) {
          this.revokedTokens.delete(hash);
        }
      }
      for (const [hash, session] of this.refreshSessions.entries()) {
        if (now > session.expiresAt) {
          this.refreshSessions.delete(hash);
        }
      }
    }, 60000);
    if (this.cleanupInterval && typeof this.cleanupInterval.unref === 'function') {
      this.cleanupInterval.unref();
    }
  }
}
