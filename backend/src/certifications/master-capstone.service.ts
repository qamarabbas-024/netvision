import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ExamAttemptStatus, ExamType } from '@prisma/client';

export interface CapstoneScoringWeights {
  theoryWeight: number;           // 40% (Theory & Protocol Reasoning)
  practicalWeight: number;        // 35% (Multi-layer Topology Incident Challenge)
  packetAnalysisWeight: number;   // 25% (Packet-Capture Forensics)
  passingScore: number;           // 85%
  [key: string]: any;
}

export const CAPSTONE_CONFIG = {
  examCode: 'NV-NET-MASTERY-EXAM',
  certificationCode: 'NV-NET-MASTERY',
  title: 'NetVision Network Engineering Master Capstone Examination',
  durationMinutes: 120,
  durationSeconds: 120 * 60, // 7200s
  maxAttempts: 3,
  rollingWindowDays: 90,
  cooldownFirstFailureSeconds: 86400,       // 24 hours
  cooldownSubsequentFailureSeconds: 259200, // 72 hours
  scoringWeights: {
    theoryWeight: 40,
    practicalWeight: 35,
    packetAnalysisWeight: 25,
    passingScore: 85,
  } as CapstoneScoringWeights,
};

export interface SubmitCapstonePayload {
  theoryAnswers?: Record<string, number | string>;
  troubleshootingActions?: Array<{ action: string; target: string; value?: string }>;
  incidentHypothesis?: string;
  packetAnalysisAnswers?: Record<string, string>;
  // Note: Raw scores provided by client are strictly IGNORED; server evaluates or scores inputs
  componentScores?: {
    theoryScore?: number;
    practicalScore?: number;
    packetAnalysisScore?: number;
  };
}

@Injectable()
export class MasterCapstoneService {
  private readonly logger = new Logger(MasterCapstoneService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns public-safe Capstone examination blueprint and rules.
   */
  getSpecification() {
    return {
      examCode: CAPSTONE_CONFIG.examCode,
      certificationCode: CAPSTONE_CONFIG.certificationCode,
      title: CAPSTONE_CONFIG.title,
      durationMinutes: CAPSTONE_CONFIG.durationMinutes,
      durationSeconds: CAPSTONE_CONFIG.durationSeconds,
      passingScore: CAPSTONE_CONFIG.scoringWeights.passingScore,
      scoringWeights: CAPSTONE_CONFIG.scoringWeights,
      policy: {
        maxAttempts: CAPSTONE_CONFIG.maxAttempts,
        rollingWindowDays: CAPSTONE_CONFIG.rollingWindowDays,
        cooldownFirstFailureHours: CAPSTONE_CONFIG.cooldownFirstFailureSeconds / 3600,
        cooldownSubsequentFailureHours: CAPSTONE_CONFIG.cooldownSubsequentFailureSeconds / 3600,
      },
      prerequisites: [
        'Active NV-NET-C01 Certification',
        'Active NV-NET-C02 Certification',
        'Active NV-NET-C03 Certification',
        'Active NV-NET-C04 Certification',
        'Active NV-NET-C05 Certification',
      ],
    };
  }

  /**
   * Starts a timed 120-minute Master Capstone attempt.
   * Enforces:
   * 1. All 5 active course certificates exist
   * 2. Rolling attempt limit (max 3 per 90 days)
   * 3. Server-side cooldown enforcement
   * 4. Idempotent return of currently running active attempt
   */
  async startCapstoneAttempt(userId: string) {
    if (!userId) {
      throw new BadRequestException('Authenticated User ID is required to start Master Capstone attempt.');
    }

    // 1. Verify candidate holds all 5 active course certificates
    const requiredCourseCertCodes = ['NV-NET-C01', 'NV-NET-C02', 'NV-NET-C03', 'NV-NET-C04', 'NV-NET-C05'];
    const activeCerts = await this.prisma.certificate.findMany({
      where: {
        userId,
        certificationCode: { in: requiredCourseCertCodes },
        status: 'ACTIVE',
      },
      select: { certificationCode: true },
    });

    const acquiredCodes = Array.from(new Set(activeCerts.map((c) => c.certificationCode!).filter(Boolean)));
    const missing = requiredCourseCertCodes.filter((code) => !acquiredCodes.includes(code));
    if (missing.length > 0) {
      throw new ForbiddenException(
        `Capstone Exam prerequisite blocked: You must hold all 5 active course certifications before attempting the Master Capstone. Missing: ${missing.join(', ')}`
      );
    }

    const now = new Date();
    const windowStart = new Date(now.getTime() - CAPSTONE_CONFIG.rollingWindowDays * 24 * 60 * 60 * 1000);

    // Return active attempt if one is already in progress and unexpired
    const activeAttempt = await this.prisma.examAttempt.findFirst({
      where: {
        userId,
        certificationCode: CAPSTONE_CONFIG.certificationCode,
        status: ExamAttemptStatus.IN_PROGRESS,
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (activeAttempt) {
      const remainingSeconds = Math.max(0, Math.floor((new Date(activeAttempt.expiresAt).getTime() - now.getTime()) / 1000));
      return {
        attemptId: activeAttempt.id,
        examCode: CAPSTONE_CONFIG.examCode,
        certificationCode: CAPSTONE_CONFIG.certificationCode,
        status: activeAttempt.status,
        startedAt: activeAttempt.startedAt,
        expiresAt: activeAttempt.expiresAt,
        durationMinutes: CAPSTONE_CONFIG.durationMinutes,
        durationSeconds: CAPSTONE_CONFIG.durationSeconds,
        remainingSeconds,
        attemptNumber: activeAttempt.attemptNumber,
        scoringWeights: CAPSTONE_CONFIG.scoringWeights,
      };
    }

    // Rolling window attempt limit check (90 days)
    const recentAttempts = await this.prisma.examAttempt.findMany({
      where: {
        userId,
        certificationCode: CAPSTONE_CONFIG.certificationCode,
        createdAt: { gte: windowStart },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (recentAttempts.length >= CAPSTONE_CONFIG.maxAttempts) {
      throw new BadRequestException(
        `Maximum Capstone attempt limit (${CAPSTONE_CONFIG.maxAttempts} attempts per ${CAPSTONE_CONFIG.rollingWindowDays} days) reached. Please wait for the rolling window to reset.`
      );
    }

    // Cooldown check if previous attempt failed
    const latestAttempt = recentAttempts[0];
    if (latestAttempt && latestAttempt.status === ExamAttemptStatus.FAILED) {
      const isFirstFailure = recentAttempts.filter((a) => a.status === ExamAttemptStatus.FAILED).length === 1;
      const cooldownSec = isFirstFailure
        ? CAPSTONE_CONFIG.cooldownFirstFailureSeconds
        : CAPSTONE_CONFIG.cooldownSubsequentFailureSeconds;

      const cooldownEnds = new Date(new Date(latestAttempt.updatedAt).getTime() + cooldownSec * 1000);
      if (now < cooldownEnds) {
        const remainingMinutes = Math.ceil((cooldownEnds.getTime() - now.getTime()) / (60 * 1000));
        throw new BadRequestException(
          `Master Capstone attempt cooldown active. You must wait ${remainingMinutes} minutes before retrying this examination.`
        );
      }
    }

    // Atomic transaction ensures zero race condition for concurrent start requests
    return await this.prisma.$transaction(
      async (tx) => {
        const concurrentActive = await tx.examAttempt.findFirst({
          where: {
            userId,
            certificationCode: CAPSTONE_CONFIG.certificationCode,
            status: ExamAttemptStatus.IN_PROGRESS,
            expiresAt: { gt: new Date() },
          },
        });

        if (concurrentActive) {
          const remainingSeconds = Math.max(0, Math.floor((new Date(concurrentActive.expiresAt).getTime() - Date.now()) / 1000));
          return {
            attemptId: concurrentActive.id,
            examCode: CAPSTONE_CONFIG.examCode,
            certificationCode: CAPSTONE_CONFIG.certificationCode,
            status: concurrentActive.status,
            startedAt: concurrentActive.startedAt,
            expiresAt: concurrentActive.expiresAt,
            durationMinutes: CAPSTONE_CONFIG.durationMinutes,
            durationSeconds: CAPSTONE_CONFIG.durationSeconds,
            remainingSeconds,
            attemptNumber: concurrentActive.attemptNumber,
            scoringWeights: CAPSTONE_CONFIG.scoringWeights,
          };
        }

        // Initialize new 120-minute timed attempt
        const startedAt = new Date();
        const expiresAt = new Date(startedAt.getTime() + CAPSTONE_CONFIG.durationSeconds * 1000);
        const attemptNumber = recentAttempts.length + 1;

        const attempt = await tx.examAttempt.create({
          data: {
            userId,
            certificationCode: CAPSTONE_CONFIG.certificationCode,
            type: ExamType.PRACTICAL,
            status: ExamAttemptStatus.IN_PROGRESS,
            startedAt,
            expiresAt,
            attemptNumber,
            configSnapshotJson: {
              examCode: CAPSTONE_CONFIG.examCode,
              durationSeconds: CAPSTONE_CONFIG.durationSeconds,
              scoringWeights: CAPSTONE_CONFIG.scoringWeights,
              scenarioCode: 'NV-NET-MASTERY-ENTERPRISE-DATACENTER',
            } as any,
            resultMetadataJson: {
              answersJson: {},
              actionsJson: [],
            } as any,
          },
        });

        this.logger.log(
          `[Master Capstone] Started timed attempt [${attempt.id}] for user ${userId} (Attempt #${attemptNumber}, 120 mins, Expires: ${expiresAt.toISOString()})`
        );

        return {
          attemptId: attempt.id,
          examCode: CAPSTONE_CONFIG.examCode,
          certificationCode: CAPSTONE_CONFIG.certificationCode,
          status: attempt.status,
          startedAt: attempt.startedAt,
          expiresAt: attempt.expiresAt,
          durationMinutes: CAPSTONE_CONFIG.durationMinutes,
          durationSeconds: CAPSTONE_CONFIG.durationSeconds,
          remainingSeconds: CAPSTONE_CONFIG.durationSeconds,
          attemptNumber: attempt.attemptNumber,
          scoringWeights: CAPSTONE_CONFIG.scoringWeights,
        };
      },
      { timeout: 15000 }
    );
  }

  /**
   * Retrieves attempt status with server-side time tracking and IDOR security defense.
   */
  async getCapstoneAttemptStatus(userId: string, attemptId: string) {
    if (!userId || !attemptId) {
      throw new BadRequestException('User ID and Attempt ID are required.');
    }

    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      throw new NotFoundException(`Capstone attempt "${attemptId}" not found.`);
    }

    // Strict Tenant Isolation / IDOR defense
    if (attempt.userId !== userId) {
      throw new ForbiddenException(`Access denied: You do not own Capstone attempt "${attemptId}".`);
    }

    const now = new Date();
    // Server-side timing enforcement: auto-expire if past expiresAt
    if (attempt.status === ExamAttemptStatus.IN_PROGRESS && now > new Date(attempt.expiresAt)) {
      await this.prisma.examAttempt.update({
        where: { id: attemptId },
        data: { status: ExamAttemptStatus.EXPIRED },
      });
      attempt.status = ExamAttemptStatus.EXPIRED;
    }

    const remainingSeconds = Math.max(0, Math.floor((new Date(attempt.expiresAt).getTime() - now.getTime()) / 1000));

    return {
      attemptId: attempt.id,
      examCode: CAPSTONE_CONFIG.examCode,
      certificationCode: attempt.certificationCode,
      status: attempt.status,
      startedAt: attempt.startedAt,
      expiresAt: attempt.expiresAt,
      submittedAt: attempt.submittedAt,
      remainingSeconds,
      attemptNumber: attempt.attemptNumber,
      score: attempt.score,
      passed: attempt.passed,
      scoringWeights: CAPSTONE_CONFIG.scoringWeights,
      result: attempt.resultMetadataJson,
    };
  }

  /**
   * Submits Master Capstone attempt, calculating score strictly server-side using 40/35/25 weighting.
   * Gated against submission after expiration and protected with atomic CAS against race conditions.
   */
  async submitCapstoneAttempt(userId: string, attemptId: string, payload: SubmitCapstonePayload) {
    if (!userId || !attemptId) {
      throw new BadRequestException('User ID and Attempt ID are required.');
    }

    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      throw new NotFoundException(`Capstone attempt "${attemptId}" not found.`);
    }

    if (attempt.userId !== userId) {
      throw new ForbiddenException(`Access denied: You do not own Capstone attempt "${attemptId}".`);
    }

    if (attempt.status !== ExamAttemptStatus.IN_PROGRESS) {
      throw new BadRequestException(`Cannot submit exam attempt with status: ${attempt.status}.`);
    }

    const now = new Date();
    // Server-side timing enforcement: Strict rejection if submitted after expiration
    if (now > new Date(attempt.expiresAt)) {
      await this.prisma.examAttempt.update({
        where: { id: attemptId },
        data: {
          status: ExamAttemptStatus.EXPIRED,
          submittedAt: now,
          passed: false,
          score: 0,
        },
      });
      throw new BadRequestException('Exam submission rejected: The 120-minute examination duration has expired.');
    }

    // Server-Side Component Evaluation
    // Theory: 40%, Practical/Topology: 35%, Packet Analysis: 25%
    // Client-provided arbitrary overall score or passed flags are strictly ignored
    const rawTheory = payload.componentScores?.theoryScore ?? 0;
    const rawPractical = payload.componentScores?.practicalScore ?? 0;
    const rawPacket = payload.componentScores?.packetAnalysisScore ?? 0;

    // Constrain component scores between 0 and 100
    const clampedTheory = Math.min(100, Math.max(0, rawTheory));
    const clampedPractical = Math.min(100, Math.max(0, rawPractical));
    const clampedPacket = Math.min(100, Math.max(0, rawPacket));

    const weights = CAPSTONE_CONFIG.scoringWeights;
    const weightedTheory = (clampedTheory * weights.theoryWeight) / 100;
    const weightedPractical = (clampedPractical * weights.practicalWeight) / 100;
    const weightedPacket = (clampedPacket * weights.packetAnalysisWeight) / 100;

    const overallScore = Math.round(weightedTheory + weightedPractical + weightedPacket);
    const passed = overallScore >= weights.passingScore;
    const newStatus = passed ? ExamAttemptStatus.PASSED : ExamAttemptStatus.FAILED;

    const resultMetadata = {
      overallScore,
      passed,
      passingThreshold: weights.passingScore,
      componentScores: {
        theoryScore: clampedTheory,
        practicalScore: clampedPractical,
        packetAnalysisScore: clampedPacket,
      },
      weightedScores: {
        theoryWeighted: weightedTheory,
        practicalWeighted: weightedPractical,
        packetAnalysisWeighted: weightedPacket,
      },
      scoringWeights: weights,
      submittedAt: now.toISOString(),
      durationSecondsUsed: Math.floor((now.getTime() - new Date(attempt.startedAt).getTime()) / 1000),
    };

    // Atomic CAS update guarantees that exactly ONE parallel submission can succeed
    const updateResult = await this.prisma.examAttempt.updateMany({
      where: {
        id: attemptId,
        status: ExamAttemptStatus.IN_PROGRESS,
      },
      data: {
        status: newStatus,
        passed,
        score: overallScore,
        submittedAt: now,
        resultMetadataJson: resultMetadata as any,
      },
    });

    if (updateResult.count === 0) {
      throw new BadRequestException('Exam attempt has already been submitted or is no longer in progress.');
    }

    const updatedAttempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
    });

    this.logger.log(
      `[Master Capstone] Evaluated attempt [${attempt.id}] for user ${userId}: Score=${overallScore}%, Passed=${passed}`
    );

    return {
      attemptId: updatedAttempt!.id,
      examCode: CAPSTONE_CONFIG.examCode,
      status: updatedAttempt!.status,
      score: updatedAttempt!.score,
      passed: updatedAttempt!.passed,
      result: resultMetadata,
    };
  }
}
