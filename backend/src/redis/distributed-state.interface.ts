/**
 * NETVISION — DISTRIBUTED STATE & MULTI-INSTANCE RELIABILITY
 * KEY ARCHITECTURE, EXACT TTLS, SERIALIZATION & CLASSIFICATION
 *
 * State Classifications:
 * - A: Safe Ephemeral Cache (In-memory, bounded TTL, query-stampede protection, safe to lose)
 * - B: User State (Interactive simulator, topology configurations, command history, lab sessions)
 * - C: Security State (Token revocation, refresh session families, replay detection, user cutoff timestamps)
 * - D: Certification State (Exam attempts, scores, certificates - Authoritatively stored in PostgreSQL)
 * - E: Operational Telemetry (Metrics, latencies, counters, audit logs)
 */

export enum StateClassification {
  SAFE_EPHEMERAL_CACHE = 'A_SAFE_EPHEMERAL_CACHE',
  USER_STATE = 'B_USER_STATE',
  SECURITY_STATE = 'C_SECURITY_STATE',
  CERTIFICATION_STATE = 'D_CERTIFICATION_STATE',
  OPERATIONAL_TELEMETRY = 'E_OPERATIONAL_TELEMETRY',
}

/**
 * Exact Redis Key Namespaces & TTL Policies:
 * All keys MUST be strictly namespaced with 'netvision:<domain>:<entity>'.
 * Unbounded or untracked keys are strictly forbidden.
 */
export const REDIS_KEYS = {
  // Security State (Classification C)
  REVOKED_TOKEN: (tokenHash: string) => `netvision:sec:revoked:${tokenHash}`,
  USER_REVOCATION_CUTOFF: (userId: string) => `netvision:sec:cutoff:${userId}`,
  REFRESH_SESSION: (tokenHash: string) => `netvision:sec:refresh:${tokenHash}`,
  REFRESH_FAMILY: (familyId: string) => `netvision:sec:family:${familyId}`,

  // User Interactive Lab State (Classification B)
  LAB_SESSION: (sessionId: string) => `netvision:lab:session:${sessionId}`,
  LAB_USER_INDEX: (ownerId: string, labId: string) => `netvision:lab:user:${ownerId}:${labId}`,

  // User Interactive Troubleshooting State (Classification B)
  TROUBLESHOOT_SESSION: (sessionId: string) => `netvision:troubleshoot:session:${sessionId}`,
  TROUBLESHOOT_USER_INDEX: (ownerId: string, scenarioSlug: string) => `netvision:troubleshoot:user:${ownerId}:${scenarioSlug}`,

  // Distributed Locks (Concurrency Control)
  LAB_LOCK: (sessionId: string) => `netvision:lock:lab:${sessionId}`,
  REFRESH_LOCK: (familyId: string) => `netvision:lock:refresh:${familyId}`,

  // Safe Ephemeral Cache (Classification A)
  USER_IDENTITY_CACHE: (userId: string) => `netvision:cache:user:${userId}`,
  QUESTION_POOL_CACHE: (poolKey: string) => `netvision:cache:questions:${poolKey}`,
} as const;

/**
 * Strict Expiration & Retention TTL Policies (in seconds)
 */
export const DISTRIBUTED_TTL = {
  // Security State TTLs
  DEFAULT_ACCESS_TOKEN_REVOCATION_SEC: 86400,        // 24 hours (covers max access token lifetime)
  REFRESH_TOKEN_REVOCATION_SEC: 7 * 86400,           // 7 days (covers refresh token window)
  USER_REVOCATION_CUTOFF_SEC: 30 * 86400,            // 30 days (covers long-lived device cutoffs)
  REFRESH_FAMILY_TTL_SEC: 7 * 86400,                 // 7 days
  CONCURRENT_REFRESH_GRACE_SEC: 10,                  // 10 seconds grace for rapid multi-tab refresh

  // User State TTLs
  ACTIVE_LAB_SESSION_SEC: 2 * 3600,                  // 2 hours (sliding TTL on each interaction)
  ACTIVE_TROUBLESHOOTING_SESSION_SEC: 2 * 3600,      // 2 hours (sliding TTL)
  ACTIVE_TROUBLESHOOT_SESSION_SEC: 2 * 3600,         // 2 hours alias
  DISTRIBUTED_LOCK_SEC: 10,                          // 10 seconds auto-release lock

  // Ephemeral Cache TTLs (Classification A: safe to evict/recompute, stampede protection)
  USER_QUERY_CACHE_MS: 30 * 1000,                    // 30 seconds (stampede defense in milliseconds)
  USER_IDENTITY_CACHE_SEC: 30,                       // 30 seconds in seconds for Redis EX
  QUESTION_POOL_CACHE_SEC: 600,                      // 10 minutes for approved questions blueprint pool
} as const;

/**
 * Serialized Revoked Token Record
 */
export interface DistributedRevokedToken {
  tokenHash: string;
  revokedAt: number;     // Unix epoch seconds
  expiresAt: number;     // Unix epoch seconds
  reason?: string;
  sourceInstanceId?: string;
}

/**
 * Serialized Refresh Session Record (Family Rotation)
 */
export interface DistributedRefreshSession {
  tokenHash: string;
  userId: string;
  familyId: string;
  expiresAt: number;     // Unix epoch seconds
  isRevoked: boolean;
  createdAt: number;
  rotatedAt?: number;
  replacedByHash?: string;
  sourceInstanceId?: string;
}

/**
 * Serialized Active Lab Session State
 */
export interface DistributedLabSession {
  sessionId: string;
  labId: string;
  lessonSlug: string;
  userId?: string;
  anonymousId?: string;
  stateVersion: number;
  simulatedState: Record<string, any>;
  commandHistory: Array<{
    command: string;
    output: string;
    timestamp: string;
    version: number;
  }>;
  recentPacketEvents?: any[];
  unlockedHintLevel: number;
  lastCommand?: string;
  lastCommandOutput?: string;
  lastCommandCategory?: string;
  lastActionSummary?: string;
  causalConsequence?: any;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  sourceInstanceId?: string;
}

/**
 * Serialized Troubleshooting Session State
 */
export interface DistributedTroubleshootSession {
  sessionId: string;
  scenarioId: string;
  scenarioSlug: string;
  userId?: string;
  anonymousId?: string;
  stateVersion: number;
  currentState: Record<string, any>;
  unlockedEvidenceIds: string[];
  commandLog: Array<{
    command: string;
    output: string;
    timestamp: string;
  }>;
  appliedFixAction?: string;
  remediationOutput?: string;
  selectedRootCauseId?: string;
  selectedRemediationId?: string;
  hintsUsedCount: number;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  sourceInstanceId?: string;
}
