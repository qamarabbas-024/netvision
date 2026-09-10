import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ExamAttemptStatus, ExamType } from '@prisma/client';
import {
  CapstoneScoringWeights,
  CandidateCapstoneSubmission,
  CapstoneGradingEngine,
  getPublicAssessment,
  LATEST_CAPSTONE_VERSION,
} from './capstone-assessment';

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

@Injectable()
export class MasterCapstoneService {
  private readonly logger = new Logger(MasterCapstoneService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns public-safe Capstone examination blueprint, versioning, and rules.
   * NEVER exposes answer keys or internal scoring rubrics.
   */
  getSpecification() {
    const publicAssessment = getPublicAssessment(LATEST_CAPSTONE_VERSION);

    return {
      examCode: CAPSTONE_CONFIG.examCode,
      certificationCode: CAPSTONE_CONFIG.certificationCode,
      title: CAPSTONE_CONFIG.title,
      version: LATEST_CAPSTONE_VERSION,
      durationMinutes: CAPSTONE_CONFIG.durationMinutes,
      durationSeconds: CAPSTONE_CONFIG.durationSeconds,
      passingScore: CAPSTONE_CONFIG.scoringWeights.passingScore,
      scoringWeights: CAPSTONE_CONFIG.scoringWeights,
      domains: [
        {
          domain: 'THEORY',
          title: publicAssessment.theorySection.title,
          weightPercent: CAPSTONE_CONFIG.scoringWeights.theoryWeight,
          questionCount: publicAssessment.theorySection.questions.length,
        },
        {
          domain: 'INCIDENT',
          title: publicAssessment.incidentSection.title,
          weightPercent: CAPSTONE_CONFIG.scoringWeights.practicalWeight,
          taskCount: publicAssessment.incidentSection.scenario.tasks.length,
        },
        {
          domain: 'FORENSICS',
          title: publicAssessment.forensicsSection.title,
          weightPercent: CAPSTONE_CONFIG.scoringWeights.packetAnalysisWeight,
          questionCount: publicAssessment.forensicsSection.scenario.questions.length,
        },
      ],
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
   * 5. Authoritative version snapshotting per attempt
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
      const configSnap = (activeAttempt.configSnapshotJson as any) || {};
      const version = configSnap.assessmentVersion || LATEST_CAPSTONE_VERSION;

      return {
        attemptId: activeAttempt.id,
        examCode: CAPSTONE_CONFIG.examCode,
        certificationCode: CAPSTONE_CONFIG.certificationCode,
        assessmentVersion: version,
        status: activeAttempt.status,
        startedAt: activeAttempt.startedAt,
        expiresAt: activeAttempt.expiresAt,
        durationMinutes: CAPSTONE_CONFIG.durationMinutes,
        durationSeconds: CAPSTONE_CONFIG.durationSeconds,
        remainingSeconds,
        attemptNumber: activeAttempt.attemptNumber,
        scoringWeights: CAPSTONE_CONFIG.scoringWeights,
        assessment: getPublicAssessment(version),
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
    try {
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
            const configSnap = (concurrentActive.configSnapshotJson as any) || {};
            const version = configSnap.assessmentVersion || LATEST_CAPSTONE_VERSION;

            return {
              attemptId: concurrentActive.id,
              examCode: CAPSTONE_CONFIG.examCode,
              certificationCode: CAPSTONE_CONFIG.certificationCode,
              assessmentVersion: version,
              status: concurrentActive.status,
              startedAt: concurrentActive.startedAt,
              expiresAt: concurrentActive.expiresAt,
              durationMinutes: CAPSTONE_CONFIG.durationMinutes,
              durationSeconds: CAPSTONE_CONFIG.durationSeconds,
              remainingSeconds,
              attemptNumber: concurrentActive.attemptNumber,
              scoringWeights: CAPSTONE_CONFIG.scoringWeights,
              assessment: getPublicAssessment(version),
            };
          }

          // Initialize new 120-minute timed attempt with snapshot of authoritative version
          const startedAt = new Date();
          const expiresAt = new Date(startedAt.getTime() + CAPSTONE_CONFIG.durationSeconds * 1000);
          const attemptNumber = recentAttempts.length + 1;
          const assessmentVersion = LATEST_CAPSTONE_VERSION;

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
                assessmentVersion,
                durationSeconds: CAPSTONE_CONFIG.durationSeconds,
                scoringWeights: CAPSTONE_CONFIG.scoringWeights,
                scenarioCode: 'INCIDENT-8492-DATACENTER-MELTDOWN',
              } as any,
              resultMetadataJson: {
                answersJson: {},
                actionsJson: [],
              } as any,
            },
          });

          this.logger.log(
            `[Master Capstone] Started timed attempt [${attempt.id}] for user ${userId} (Attempt #${attemptNumber}, v${assessmentVersion}, 120 mins, Expires: ${expiresAt.toISOString()})`
          );

          return {
            attemptId: attempt.id,
            examCode: CAPSTONE_CONFIG.examCode,
            certificationCode: CAPSTONE_CONFIG.certificationCode,
            assessmentVersion,
            status: attempt.status,
            startedAt: attempt.startedAt,
            expiresAt: attempt.expiresAt,
            durationMinutes: CAPSTONE_CONFIG.durationMinutes,
            durationSeconds: CAPSTONE_CONFIG.durationSeconds,
            remainingSeconds: CAPSTONE_CONFIG.durationSeconds,
            attemptNumber: attempt.attemptNumber,
            scoringWeights: CAPSTONE_CONFIG.scoringWeights,
            assessment: getPublicAssessment(assessmentVersion),
          };
        },
        { timeout: 15000 }
      );
    } catch (err: any) {
      // Database-level uniqueness conflict resolution:
      // If a concurrent request created the active attempt, catch P2002 and safely converge on the active attempt.
      if (err.code === 'P2002') {
        this.logger.warn(
          `[Master Capstone] Concurrent attempt creation conflict intercepted for user ${userId}. Converging on existing active attempt.`
        );
        const activeExisting = await this.prisma.examAttempt.findFirst({
          where: {
            userId,
            certificationCode: CAPSTONE_CONFIG.certificationCode,
            status: ExamAttemptStatus.IN_PROGRESS,
            expiresAt: { gt: new Date() },
          },
        });
        if (activeExisting) {
          const remainingSeconds = Math.max(0, Math.floor((new Date(activeExisting.expiresAt).getTime() - Date.now()) / 1000));
          const configSnap = (activeExisting.configSnapshotJson as any) || {};
          const version = configSnap.assessmentVersion || LATEST_CAPSTONE_VERSION;

          return {
            attemptId: activeExisting.id,
            examCode: CAPSTONE_CONFIG.examCode,
            certificationCode: CAPSTONE_CONFIG.certificationCode,
            assessmentVersion: version,
            status: activeExisting.status,
            startedAt: activeExisting.startedAt,
            expiresAt: activeExisting.expiresAt,
            durationMinutes: CAPSTONE_CONFIG.durationMinutes,
            durationSeconds: CAPSTONE_CONFIG.durationSeconds,
            remainingSeconds,
            attemptNumber: activeExisting.attemptNumber,
            scoringWeights: CAPSTONE_CONFIG.scoringWeights,
            assessment: getPublicAssessment(version),
          };
        }
      }
      throw err;
    }
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
    const configSnap = (attempt.configSnapshotJson as any) || {};
    const version = configSnap.assessmentVersion || LATEST_CAPSTONE_VERSION;

    const response: any = {
      attemptId: attempt.id,
      examCode: CAPSTONE_CONFIG.examCode,
      certificationCode: attempt.certificationCode,
      assessmentVersion: version,
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

    // Return public questions while in progress so browser can render or restore session
    if (attempt.status === ExamAttemptStatus.IN_PROGRESS) {
      response.assessment = getPublicAssessment(version);
    }

    return response;
  }

  /**
   * Submits Master Capstone attempt for authoritative server-side grading.
   *
   * CRITICAL SECURITY IMPLEMENTATION:
   * 1. The server loads the attempt's snapshotted assessment version.
   * 2. The server compares candidate responses against the authoritative rubric/keys.
   * 3. Any client-supplied componentScores, finalScore, passed, or weights are STRICTLY IGNORED.
   * 4. Overall score and passed status are computed mathematically and persisted immutably.
   * 5. Gated against expired submissions and protected with atomic CAS against race conditions.
   */
  async submitCapstoneAttempt(userId: string, attemptId: string, payload: CandidateCapstoneSubmission) {
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
      await this.prisma.examAttempt.updateMany({
        where: { id: attemptId, status: ExamAttemptStatus.IN_PROGRESS },
        data: {
          status: ExamAttemptStatus.EXPIRED,
          submittedAt: now,
          passed: false,
          score: 0,
        },
      });
      throw new BadRequestException('Exam submission rejected: The 120-minute examination duration has expired.');
    }

    // Load snapshotted assessment version for this attempt (reproducible historical grading)
    const configSnap = (attempt.configSnapshotJson as any) || {};
    const assessmentVersion = configSnap.assessmentVersion || LATEST_CAPSTONE_VERSION;

    // Execute Server-Authoritative Grading Engine
    // Client-provided scores, passed flags, and weights are completely ignored
    const gradingSummary = CapstoneGradingEngine.gradeAttempt(assessmentVersion, payload);
    const overallScore = gradingSummary.overallScore;
    const passed = gradingSummary.passed;
    const newStatus = passed ? ExamAttemptStatus.PASSED : ExamAttemptStatus.FAILED;

    const resultMetadata = {
      overallScore,
      passed,
      passingThreshold: gradingSummary.passingThreshold,
      assessmentVersion,
      componentScores: gradingSummary.componentScores,
      weightedScores: gradingSummary.weightedScores,
      scoringWeights: gradingSummary.scoringWeights,
      sections: gradingSummary.sections,
      candidateResponsesSnapshot: gradingSummary.candidateResponsesSnapshot,
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

    this.logger.log(
      `[Master Capstone] Server-graded attempt [${attempt.id}] (v${assessmentVersion}) for user ${userId}: Score=${overallScore}%, Passed=${passed}`
    );

    return {
      attemptId: attempt.id,
      examCode: CAPSTONE_CONFIG.examCode,
      status: newStatus,
      score: overallScore,
      passed,
      submittedAt: now,
      result: resultMetadata,
    };
  }
}
