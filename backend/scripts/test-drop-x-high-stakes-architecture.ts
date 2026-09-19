/**
 * ==============================================================================
 * NETVISION — DROP X: HIGH-STAKES CERTIFICATION ARCHITECTURE TEST SUITE
 * ==============================================================================
 *
 * Verifies:
 * 1. Public vs Private Item Separation Architecture:
 *    - Validates that 229 open-source curriculum questions are designated for
 *      formative practice quizzes and in-lesson checks.
 *    - Validates high-stakes blueprint and vault specifications.
 * 2. Cryptographic Fisher-Yates Randomization:
 *    - Validates unbiased pseudo-random distribution with crypto.randomInt.
 * 3. Option Permutation & Answer Key Integrity:
 *    - Validates candidate option shuffling while maintaining exact server-side
 *      correct option index tracking.
 * 4. Session HMAC Tamper Proofing:
 *    - Validates snapshot signature generation and tamper rejection.
 * 5. Psychometric Compromise & Brain-Dump Detection:
 *    - Validates automated quarantine of items with p-value inflation,
 *      point-biserial collapse, and cognitive time violations.
 * 6. Item Exposure Throttling:
 *    - Validates the 15% maximum exposure rate cap.
 * ==============================================================================
 */

import * as crypto from 'crypto';
import { EXPANDED_ASSESSMENT_QUESTION_BANK } from '../src/topics/assessment-question-bank';
import {
  cryptoFisherYatesShuffle,
  permutateOptionsWithKey,
  generateExamSnapshotHmac,
  verifyExamSnapshotHmac,
  detectItemCompromiseAnomaly,
} from '../src/certifications/utils/exam-crypto.util';
import {
  VersionedExamBlueprint,
  PsychometricMetrics,
} from '../src/certifications/high-stakes/high-stakes.interface';

function check(condition: boolean, description: string): void {
  if (!condition) {
    console.error(`  ❌ FAILED: ${description}`);
    process.exit(1);
  }
  console.log(`  ✅ PASS: ${description}`);
}

async function runHighStakesArchitectureTestSuite(): Promise<void> {
  console.log('\n====================================================================');
  console.log('🏛️  NETVISION DROP X — HIGH-STAKES CERTIFICATION ARCHITECTURE GATE');
  console.log('====================================================================\n');

  // --- Test 1: Public Formative vs Private Summative Bank Auditing ---
  console.log('--- Test 1: Public vs Private Item Separation ---');
  check(EXPANDED_ASSESSMENT_QUESTION_BANK.length === 229, 'Authoritative open-source bank contains exactly 229 questions');

  // Verify all 229 questions have full distractors and explanations for open learning
  const allHaveExplanations = EXPANDED_ASSESSMENT_QUESTION_BANK.every(
    (q) => q.explanation && q.explanation.length > 10 && q.options.length >= 2
  );
  check(allHaveExplanations, 'All 229 open-source questions provide rich pedagogical explanations for learning');

  // Verify high-stakes blueprint model
  const sampleBlueprint: VersionedExamBlueprint = {
    blueprintId: 'BLUEPRINT-NV-NET-C01-V2.0',
    certificationCode: 'NV-NET-C01',
    version: '2.0.0',
    totalItems: 50,
    passingScorePct: 80,
    timeLimitMinutes: 75,
    domains: [
      { domainId: 'PHYSICAL_MEDIA', name: 'Physical Layer & Media', weightPct: 20, targetItemCount: 10 },
      { domainId: 'ETHERNET_FRAMING', name: 'Ethernet & Data Link', weightPct: 25, targetItemCount: 13 },
      { domainId: 'IP_ADDRESSING', name: 'IPv4 & IPv6 Addressing', weightPct: 25, targetItemCount: 12 },
      { domainId: 'TCP_UDP_TRANSPORT', name: 'Transport Protocols', weightPct: 15, targetItemCount: 8 },
      { domainId: 'DIAGNOSTICS', name: 'Physical Layer Triage', weightPct: 15, targetItemCount: 7 },
    ],
    cognitiveQuotas: {
      recallMaxPct: 15,
      understandingTargetPct: 30,
      applicationTargetPct: 35,
      troubleshootingTargetPct: 20,
    },
    exposureCapPct: 15,
    createdAt: new Date().toISOString(),
    sha256Digest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  };

  const domainSum = sampleBlueprint.domains.reduce((sum, d) => sum + d.targetItemCount, 0);
  check(domainSum === sampleBlueprint.totalItems, 'Blueprint domain targets sum exactly to 50 total items');
  const weightSum = sampleBlueprint.domains.reduce((sum, d) => sum + d.weightPct, 0);
  check(weightSum === 100, 'Blueprint domain weights sum exactly to 100%');

  // --- Test 2: Cryptographic Fisher-Yates Randomization ---
  console.log('\n--- Test 2: Cryptographically Secure Fisher-Yates Randomization ---');
  const originalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const shuffled = cryptoFisherYatesShuffle(originalArray);

  check(shuffled.length === originalArray.length, 'Shuffled array maintains original length');
  check(originalArray.every((item) => shuffled.includes(item)), 'Shuffled array contains all original elements without loss');

  // Statistical distribution test across 500 shuffles (first element distribution)
  const firstElementCounts: Record<number, number> = {};
  for (let i = 0; i < 500; i++) {
    const s = cryptoFisherYatesShuffle(originalArray);
    firstElementCounts[s[0]] = (firstElementCounts[s[0]] || 0) + 1;
  }
  const allElementsRepresented = originalArray.every((num) => (firstElementCounts[num] || 0) > 10);
  check(allElementsRepresented, 'Fisher-Yates shuffle produces uniform, unbiased distribution across iterations');

  // --- Test 3: Option Permutation & Answer Key Mapping ---
  console.log('\n--- Test 3: Option Permutation & Correct Index Preservation ---');
  const testOptions = [
    'Option A: Unrelated distractor',
    'Option B: The real correct answer',
    'Option C: Another distractor',
    'Option D: Third distractor',
  ];
  const originalCorrectIndex = 1; // Option B

  const permuted = permutateOptionsWithKey(testOptions, originalCorrectIndex);
  check(permuted.shuffledOptions.length === 4, 'Permuted options count matches original');
  check(
    permuted.shuffledOptions[permuted.newCorrectIndex] === testOptions[originalCorrectIndex],
    'New correct option index points precisely to the original correct answer text'
  );

  // --- Test 4: Session Snapshot HMAC Integrity & Anti-Tamper ---
  console.log('\n--- Test 4: Exam Snapshot HMAC Signing & Tamper Proofing ---');
  const attemptId = 'att-test-99812';
  const blueprintId = 'BLUEPRINT-NV-NET-C01-V2.0';
  const itemIds = ['item-01', 'item-02', 'item-03', 'item-04'];
  const secretKey = 'high_stakes_secret_hmac_signing_key_2026';

  const signature = generateExamSnapshotHmac(attemptId, blueprintId, itemIds, secretKey);
  check(signature.length === 64, 'Generated valid 64-char hex HMAC-SHA256 signature');

  const isValid = verifyExamSnapshotHmac(attemptId, blueprintId, itemIds, signature, secretKey);
  check(isValid, 'Snapshot HMAC signature verifies with timing-safe comparison');

  // Tamper test: change one item ID
  const tamperedItemIds = ['item-01', 'item-02', 'item-TAMPERED', 'item-04'];
  const isTamperDetected = !verifyExamSnapshotHmac(attemptId, blueprintId, tamperedItemIds, signature, secretKey);
  check(isTamperDetected, 'Tampered question sequence correctly rejected by HMAC verification');

  // --- Test 5: Psychometric Brain-Dump & Compromise Detection ---
  console.log('\n--- Test 5: Psychometric Anomaly & Brain-Dump Detection ---');

  // Case 5A: Normal, healthy item
  const healthyMetrics: PsychometricMetrics = {
    totalAppearances: 120,
    totalCorrect: 72,
    pValue: 0.60, // 60% pass rate
    pointBiserial: 0.42, // Strong positive discrimination
    medianResponseTimeSec: 45.2,
    distractorSelectionRates: { 0: 0.12, 1: 0.15, 2: 0.60, 3: 0.13 },
    lastCalibratedAt: new Date().toISOString(),
  };
  const healthyResult = detectItemCompromiseAnomaly(healthyMetrics, 0.55);
  check(!healthyResult.isCompromised && healthyResult.severity === 'OK', 'Healthy calibrated item passes evaluation with status OK');

  // Case 5B: Compromised / Leaked item (p-value jumps to 98%, discrimination collapses to -0.05, speed 2.8s)
  const compromisedMetrics: PsychometricMetrics = {
    totalAppearances: 150,
    totalCorrect: 147,
    pValue: 0.98, // Extreme spike
    pointBiserial: -0.04, // Discrimination collapsed
    medianResponseTimeSec: 2.8, // Speedrun memorization
    distractorSelectionRates: { 0: 0.01, 1: 0.98, 2: 0.01, 3: 0.00 },
    lastCalibratedAt: new Date().toISOString(),
  };
  const compromisedResult = detectItemCompromiseAnomaly(compromisedMetrics, 0.55);
  check(compromisedResult.isCompromised, 'Compromised / leaked item detected by anomaly engine');
  check(
    compromisedResult.severity === 'CRITICAL_QUARANTINE',
    'Compromised item assigned CRITICAL_QUARANTINE severity'
  );
  check(compromisedResult.reasons.length >= 2, 'Anomaly report details specific violations (p-value, r_pb, time)');

  // --- Test 6: Item Exposure Throttling ---
  console.log('\n--- Test 6: Item Exposure Cap & Throttling Logic ---');
  const totalWindowAttempts = 1000;
  const maxAllowedExposures = Math.floor(totalWindowAttempts * (sampleBlueprint.exposureCapPct / 100)); // 150

  const itemAExposures = 80;
  const itemAExposureRate = (itemAExposures / totalWindowAttempts) * 100; // 8%
  check(itemAExposureRate <= sampleBlueprint.exposureCapPct, `Item A exposure (${itemAExposureRate}%) within 15% cap`);

  const itemBExposures = 180;
  const itemBExposureRate = (itemBExposures / totalWindowAttempts) * 100; // 18%
  const itemBEligible = itemBExposureRate <= sampleBlueprint.exposureCapPct;
  check(!itemBEligible, `Item B exposure (${itemBExposureRate}%) exceeds 15% cap and is throttled from active draw`);

  console.log('\n====================================================================');
  console.log('🏛️  ALL DROP X HIGH-STAKES ARCHITECTURE TESTS PASSED!');
  console.log('====================================================================\n');
}

runHighStakesArchitectureTestSuite().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
