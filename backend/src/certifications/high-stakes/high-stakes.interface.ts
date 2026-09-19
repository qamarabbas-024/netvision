/**
 * ==============================================================================
 * NETVISION HIGH-STAKES CERTIFICATION ARCHITECTURE INTERFACES
 * ==============================================================================
 * Defines data structures and operational contracts for:
 * 1. Private High-Stakes Item Vault
 * 2. Versioned Exam Blueprints & Domain Weightings
 * 3. Item Exposure Throttling & LOFT Sampling
 * 4. Psychometric Quality Telemetry (IRT, p-value, point-biserial)
 * 5. Automated Compromise Quarantine & Retirement
 * ==============================================================================
 */

import { CognitiveLevel, CourseLevel, QuestionType } from '@prisma/client';

export type ItemLifecycleStatus = 'DRAFT' | 'CALIBRATING' | 'ACTIVE' | 'FLAGGED_FOR_REVIEW' | 'QUARANTINED' | 'RETIRED';

export interface BlueprintDomainTarget {
  domainId: string;
  name: string;
  weightPct: number; // e.g. 20 for 20%
  targetItemCount: number; // e.g. 10 items
  requiredCognitiveLevels?: CognitiveLevel[];
}

export interface VersionedExamBlueprint {
  blueprintId: string;
  certificationCode: string;
  version: string;
  totalItems: number;
  passingScorePct: number;
  timeLimitMinutes: number;
  domains: BlueprintDomainTarget[];
  cognitiveQuotas: {
    recallMaxPct: number;
    understandingTargetPct: number;
    applicationTargetPct: number;
    troubleshootingTargetPct: number;
  };
  exposureCapPct: number; // Max exposure rate (e.g. 15%)
  createdAt: string;
  sha256Digest: string;
}

export interface PsychometricMetrics {
  totalAppearances: number;
  totalCorrect: number;
  pValue: number; // Item difficulty (0.00 to 1.00; proportion correct)
  pointBiserial: number; // Item discrimination (-1.00 to +1.00)
  medianResponseTimeSec: number;
  distractorSelectionRates: Record<number, number>; // Option index to selection proportion
  lastCalibratedAt: string;
}

export interface PrivateVaultItem {
  id: string;
  domainId: string;
  blueprintId: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  cognitiveLevel: CognitiveLevel;
  questionType: QuestionType;
  difficulty: CourseLevel;
  points: number;
  status: ItemLifecycleStatus;
  psychometrics: PsychometricMetrics;
  exposureHistory: {
    last30DaysExposures: number;
    rollingExposureRate: number; // e.g. 0.08 (8%)
    lastPresentedAt?: string;
  };
}

export interface CandidateExamItem {
  itemId: string;
  questionText: string;
  options: string[];
  cognitiveLevel: CognitiveLevel;
  questionType: QuestionType;
  difficulty: CourseLevel;
  points: number;
  domainId: string;
  // Note: correctOptionIndex and explanation are STRICTLY EXCLUDED
}

export interface ExamSessionSnapshot {
  attemptId: string;
  userId: string;
  certificationCode: string;
  blueprintId: string;
  startedAt: string;
  expiresAt: string;
  items: CandidateExamItem[];
  scoringKeys: Array<{ itemId: string; correctOptionIndex: number; points: number }>;
  hmacSignature: string;
}
