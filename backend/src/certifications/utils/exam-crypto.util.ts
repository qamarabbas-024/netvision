/**
 * ==============================================================================
 * NETVISION HIGH-STAKES EXAM CRYPTOGRAPHIC & PSYCHOMETRIC UTILITIES
 * ==============================================================================
 * Provides:
 * 1. Cryptographically secure Fisher-Yates shuffle (replaces biased Math.random).
 * 2. Per-candidate option permutation with accurate answer-key mapping.
 * 3. Session HMAC signing & verification for immutable exam snapshots.
 * 4. Psychometric compromise detection algorithms (p-value spikes & r_pb drops).
 * ==============================================================================
 */

import * as crypto from 'crypto';
import { PsychometricMetrics } from '../high-stakes/high-stakes.interface';

/**
 * Performs a cryptographically unbiased Fisher-Yates shuffle on an array.
 * Uses crypto.randomInt to eliminate modulo bias.
 */
export function cryptoFisherYatesShuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Permutes options for a question while maintaining exact tracking of the new correct option index.
 */
export function permutateOptionsWithKey(
  options: string[],
  originalCorrectIndex: number
): {
  shuffledOptions: string[];
  newCorrectIndex: number;
} {
  if (originalCorrectIndex < 0 || originalCorrectIndex >= options.length) {
    throw new Error(`Invalid correct option index: ${originalCorrectIndex}`);
  }

  // Create indexed tuples
  const indexed = options.map((opt, idx) => ({ opt, originalIndex: idx }));
  const shuffled = cryptoFisherYatesShuffle(indexed);

  const newCorrectIndex = shuffled.findIndex((item) => item.originalIndex === originalCorrectIndex);
  const shuffledOptions = shuffled.map((item) => item.opt);

  return {
    shuffledOptions,
    newCorrectIndex,
  };
}

/**
 * Signs an exam attempt snapshot with an HMAC key to guarantee tamper evidence.
 */
export function generateExamSnapshotHmac(
  attemptId: string,
  blueprintId: string,
  itemIds: string[],
  secretKey: string
): string {
  const payload = `${attemptId}::${blueprintId}::${itemIds.join(',')}`;
  return crypto.createHmac('sha256', secretKey).update(payload).digest('hex');
}

/**
 * Verifies an exam attempt snapshot's HMAC signature.
 */
export function verifyExamSnapshotHmac(
  attemptId: string,
  blueprintId: string,
  itemIds: string[],
  signature: string,
  secretKey: string
): boolean {
  const expected = generateExamSnapshotHmac(attemptId, blueprintId, itemIds, secretKey);
  const expectedBuf = Buffer.from(expected, 'hex');
  const actualBuf = Buffer.from(signature, 'hex');

  if (expectedBuf.length !== actualBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

export interface CompromiseAnomalyResult {
  isCompromised: boolean;
  severity: 'OK' | 'SUSPICIOUS' | 'CRITICAL_QUARANTINE';
  reasons: string[];
}

/**
 * Evaluates psychometric metrics against known brain-dump / compromise signatures:
 * 1. Difficulty spike: Item p-value jumps to > 0.95 (everyone gets it right).
 * 2. Discrimination collapse: Point-biserial drops below 0.10 or negative (low-scorers get it right).
 * 3. Timing anomaly: Median response time is abnormally low for problem complexity (< 4s).
 */
export function detectItemCompromiseAnomaly(
  metrics: PsychometricMetrics,
  baselineDifficulty: number = 0.50
): CompromiseAnomalyResult {
  const reasons: string[] = [];
  let isCompromised = false;
  let severity: CompromiseAnomalyResult['severity'] = 'OK';

  if (metrics.totalAppearances < 30) {
    // Insufficient statistical sample size for high-confidence determination
    return { isCompromised: false, severity: 'OK', reasons: ['Insufficient sample size (< 30)'] };
  }

  // 1. Check for extreme p-value inflation (> 0.92)
  if (metrics.pValue >= 0.92 && baselineDifficulty <= 0.60) {
    reasons.push(
      `Extreme p-value inflation: current p = ${metrics.pValue.toFixed(2)} vs baseline ${baselineDifficulty.toFixed(2)}`
    );
    isCompromised = true;
    severity = 'SUSPICIOUS';
  }

  // 2. Check for point-biserial discrimination collapse (< 0.10)
  if (metrics.pointBiserial < 0.10) {
    reasons.push(
      `Point-biserial discrimination collapsed to ${metrics.pointBiserial.toFixed(2)} (indicates brain-dump memorization)`
    );
    isCompromised = true;
    severity = metrics.pointBiserial <= 0 ? 'CRITICAL_QUARANTINE' : 'SUSPICIOUS';
  }

  // 3. Response time anomaly (< 4 seconds)
  if (metrics.medianResponseTimeSec < 4.0) {
    reasons.push(`Median response time (${metrics.medianResponseTimeSec}s) is below cognitive reading threshold`);
    isCompromised = true;
    severity = 'CRITICAL_QUARANTINE';
  }

  return {
    isCompromised,
    severity,
    reasons,
  };
}
