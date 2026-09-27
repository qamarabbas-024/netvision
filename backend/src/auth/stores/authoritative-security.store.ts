import { Logger } from '@nestjs/common';
import type { PrismaService } from '../../database/prisma.service';

export interface RevokedTokenRecord {
  tokenHash: string;
  revokedAt: number;     // epoch ms
  expiresAt: number;     // epoch ms
  reason?: string;
  sourceInstanceId?: string;
}

export interface RefreshSession {
  tokenHash: string;
  userId: string;
  familyId: string;
  expiresAt: number;     // epoch ms
  isRevoked: boolean;
  createdAt: number;     // epoch ms
  rotatedAt?: number;    // epoch ms
  replacedByHash?: string;
  sourceInstanceId?: string;
}

export interface IAuthoritativeSecurityStore {
  // Revoked Tokens / Blacklist
  saveRevokedToken(record: RevokedTokenRecord): Promise<void>;
  getRevokedToken(tokenHash: string): Promise<RevokedTokenRecord | null>;
  getAllActiveRevocations(): Promise<RevokedTokenRecord[]>;

  // Refresh Token Sessions & Families
  saveRefreshSession(session: RefreshSession): Promise<void>;
  getRefreshSession(tokenHash: string): Promise<RefreshSession | null>;
  updateRefreshSession(session: RefreshSession): Promise<void>;
  getFamilySessions(familyId: string): Promise<RefreshSession[]>;
  revokeFamily(familyId: string): Promise<void>;
  revokeUserRefreshSessions(userId: string): Promise<void>;

  // User Cutoff
  saveUserCutoff(userId: string, cutoffSec: number): Promise<void>;
  getUserCutoff(userId: string): Promise<number | null>;

  // Health / Status
  isAvailable(): Promise<boolean>;
}

/**
 * Shared Cluster Authoritative Store
 * Simulates a shared multi-instance database layer across pods/nodes
 * during automated testing, disaster recovery, or when PostgreSQL is attached.
 */
export class SharedClusterSecurityStore implements IAuthoritativeSecurityStore {
  private readonly logger = new Logger(SharedClusterSecurityStore.name);
  public isOnline = true;

  // Shared state maps across simulated nodes
  private revokedTokens = new Map<string, RevokedTokenRecord>();
  private refreshSessions = new Map<string, RefreshSession>();
  private familyTokens = new Map<string, Set<string>>();
  private userCutoffs = new Map<string, number>();

  public async isAvailable(): Promise<boolean> {
    return this.isOnline;
  }

  public purgeExpired(): void {
    const now = Date.now();
    for (const [k, v] of this.revokedTokens.entries()) {
      if (now >= v.expiresAt) {
        this.revokedTokens.delete(k);
      }
    }
    for (const [k, v] of this.refreshSessions.entries()) {
      if (now >= v.expiresAt) {
        this.refreshSessions.delete(k);
      }
    }
  }

  public async saveRevokedToken(record: RevokedTokenRecord): Promise<void> {
    if (!this.isOnline) throw new Error('AUTHORITATIVE_STORE_UNAVAILABLE: Store offline');
    this.purgeExpired();
    this.revokedTokens.set(record.tokenHash, { ...record });
  }

  public async getRevokedToken(tokenHash: string): Promise<RevokedTokenRecord | null> {
    if (!this.isOnline) throw new Error('AUTHORITATIVE_STORE_UNAVAILABLE: Store offline');
    this.purgeExpired();
    const found = this.revokedTokens.get(tokenHash);
    return found ? { ...found } : null;
  }

  public async getAllActiveRevocations(): Promise<RevokedTokenRecord[]> {
    if (!this.isOnline) throw new Error('AUTHORITATIVE_STORE_UNAVAILABLE: Store offline');
    this.purgeExpired();
    return Array.from(this.revokedTokens.values()).map(r => ({ ...r }));
  }

  public async saveRefreshSession(session: RefreshSession): Promise<void> {
    if (!this.isOnline) throw new Error('AUTHORITATIVE_STORE_UNAVAILABLE: Store offline');
    this.purgeExpired();
    this.refreshSessions.set(session.tokenHash, { ...session });
    if (!this.familyTokens.has(session.familyId)) {
      this.familyTokens.set(session.familyId, new Set());
    }
    this.familyTokens.get(session.familyId)!.add(session.tokenHash);
  }

  public async getRefreshSession(tokenHash: string): Promise<RefreshSession | null> {
    if (!this.isOnline) throw new Error('AUTHORITATIVE_STORE_UNAVAILABLE: Store offline');
    this.purgeExpired();
    const found = this.refreshSessions.get(tokenHash);
    return found ? { ...found } : null;
  }

  public async updateRefreshSession(session: RefreshSession): Promise<void> {
    if (!this.isOnline) throw new Error('AUTHORITATIVE_STORE_UNAVAILABLE: Store offline');
    this.purgeExpired();
    this.refreshSessions.set(session.tokenHash, { ...session });
  }

  public async getFamilySessions(familyId: string): Promise<RefreshSession[]> {
    if (!this.isOnline) throw new Error('AUTHORITATIVE_STORE_UNAVAILABLE: Store offline');
    this.purgeExpired();
    const hashes = this.familyTokens.get(familyId);
    if (!hashes) return [];
    const result: RefreshSession[] = [];
    for (const h of hashes) {
      const sess = this.refreshSessions.get(h);
      if (sess) result.push({ ...sess });
    }
    return result;
  }

  public async revokeFamily(familyId: string): Promise<void> {
    if (!this.isOnline) throw new Error('AUTHORITATIVE_STORE_UNAVAILABLE: Store offline');
    const hashes = this.familyTokens.get(familyId);
    if (hashes) {
      for (const h of hashes) {
        const sess = this.refreshSessions.get(h);
        if (sess) {
          sess.isRevoked = true;
          this.refreshSessions.set(h, sess);
        }
      }
    }
  }

  public async revokeUserRefreshSessions(userId: string): Promise<void> {
    if (!this.isOnline) throw new Error('AUTHORITATIVE_STORE_UNAVAILABLE: Store offline');
    for (const sess of this.refreshSessions.values()) {
      if (sess.userId === userId) {
        sess.isRevoked = true;
      }
    }
  }

  public async saveUserCutoff(userId: string, cutoffSec: number): Promise<void> {
    if (!this.isOnline) throw new Error('AUTHORITATIVE_STORE_UNAVAILABLE: Store offline');
    const current = this.userCutoffs.get(userId) || 0;
    this.userCutoffs.set(userId, Math.max(current, cutoffSec));
  }

  public async getUserCutoff(userId: string): Promise<number | null> {
    if (!this.isOnline) throw new Error('AUTHORITATIVE_STORE_UNAVAILABLE: Store offline');
    return this.userCutoffs.get(userId) ?? null;
  }

  public clear(): void {
    this.revokedTokens.clear();
    this.refreshSessions.clear();
    this.familyTokens.clear();
    this.userCutoffs.clear();
  }
}
