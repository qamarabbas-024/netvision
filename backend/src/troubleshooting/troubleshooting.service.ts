import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../database/prisma.service';
import { AchievementsService } from '../achievements/achievements.service';
import { TROUBLESHOOTING_SCENARIOS } from './troubleshooting-scenarios.catalog';
import {
  TroubleshootingScenario,
  TroubleshootingSessionState,
  ExecuteScenarioCommandDto,
  SubmitDiagnosisDto,
  ApplyRemediationDto,
  RunVerificationDto,
} from '@netvision/shared';

export interface LearnerIdentityContext {
  userId?: string;
  anonymousId?: string;
}

@Injectable()
export class TroubleshootingService {
  private readonly logger = new Logger(TroubleshootingService.name);
  // In-memory active interactive troubleshooting sessions
  private readonly activeSessions = new Map<string, TroubleshootingSessionState & { userId?: string; anonymousId?: string }>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly achievementsService: AchievementsService,
  ) {}

  getAllScenarios() {
    return TROUBLESHOOTING_SCENARIOS.map((s) => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      incidentDescription: s.incidentDescription,
      category: s.category,
      difficulty: s.difficulty,
      estimatedMinutes: s.estimatedMinutes,
      networkingConcepts: s.networkingConcepts,
      initialSymptoms: s.initialSymptoms,
      nodeCount: s.topology.nodes.length,
      evidenceCount: s.evidenceItems.length,
    }));
  }

  getScenarioBySlugOrId(idOrSlug: string, isInternal: boolean = false): TroubleshootingScenario {
    const scenario = TROUBLESHOOTING_SCENARIOS.find(
      (s) => s.id === idOrSlug || s.slug === idOrSlug
    );
    if (!scenario) {
      throw new NotFoundException(`Troubleshooting scenario "${idOrSlug}" not found.`);
    }

    if (isInternal) {
      return scenario;
    }

    // Public Safe View: Sanitize hidden answers so learner cannot cheat via network inspection
    return {
      ...scenario,
      hiddenRootCauseId: '', // Hide solution
      correctRemediationId: '', // Hide solution
      rootCauseOptions: scenario.rootCauseOptions.map((rc) => ({
        id: rc.id,
        description: rc.description,
        isCorrect: false, // Masked
        explanation: '', // Masked until completed
      })),
      remediationOptions: scenario.remediationOptions.map((rem) => ({
        id: rem.id,
        title: rem.title,
        commandSyntax: rem.commandSyntax,
        actionDescription: rem.actionDescription,
        isCorrect: false, // Masked
        explanation: '', // Masked until completed
      })),
      evidenceItems: scenario.evidenceItems.map((ev) => ({
        ...ev,
        isUnlocked: false,
        data: '', // Hidden until discovered
      })),
    };
  }

  getScenarioPostMortem(idOrSlug: string) {
    const scenario = this.getScenarioBySlugOrId(idOrSlug, true);
    return {
      scenarioId: scenario.id,
      scenarioSlug: scenario.slug,
      title: scenario.title,
      postMortem: scenario.postMortem,
      rootCause: scenario.rootCauseOptions.find((r) => r.isCorrect),
      remediation: scenario.remediationOptions.find((r) => r.isCorrect),
    };
  }

  async startSession(identity: LearnerIdentityContext, scenarioIdOrSlug: string): Promise<TroubleshootingSessionState> {
    const { userId, anonymousId } = identity;
    if (!userId && !anonymousId) {
      throw new BadRequestException('Learner identity (userId or anonymousId) is required.');
    }

    const scenario = this.getScenarioBySlugOrId(scenarioIdOrSlug, true);
    const sessionId = `tb-sess-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    const sessionState: TroubleshootingSessionState & { userId?: string; anonymousId?: string } = {
      sessionId,
      scenarioId: scenario.id,
      scenarioSlug: scenario.slug,
      currentStage: 'INCIDENT',
      discoveredEvidenceIds: [],
      executedCommands: [],
      diagnosisSubmitted: false,
      remediationApplied: false,
      verificationCompleted: false,
      attemptsCount: 0,
      hintsUsedCount: 0,
      scoreBreakdown: {
        evidenceScore: 0,
        diagnosisScore: 0,
        remediationScore: 0,
        verificationScore: 0,
        penaltyDeductions: 0,
        totalScore: 0,
      },
      passed: false,
      startedAt: new Date().toISOString(),
      userId: userId || undefined,
      anonymousId: anonymousId || undefined,
    };

    this.activeSessions.set(sessionId, sessionState);
    this.logger.log(`Started troubleshooting session ${sessionId} for scenario ${scenario.slug}`);

    return this.sanitizeSessionResponse(sessionState);
  }

  async getSessionStatus(identity: LearnerIdentityContext, sessionId: string): Promise<TroubleshootingSessionState> {
    const session = this.findAndValidateSessionOwnership(identity, sessionId);
    return this.sanitizeSessionResponse(session);
  }

  async executeCommand(
    identity: LearnerIdentityContext,
    dto: ExecuteScenarioCommandDto
  ): Promise<{
    session: TroubleshootingSessionState;
    commandOutput: string;
    newEvidenceUnlocked?: { id: string; title: string; category: string; description: string; data: string };
  }> {
    const session = this.findAndValidateSessionOwnership(identity, dto.sessionId);
    const scenario = this.getScenarioBySlugOrId(session.scenarioId, true);
    const cleanCmd = (dto.command || '').trim();

    if (!cleanCmd) {
      throw new BadRequestException('Command string cannot be empty.');
    }

    // Match command against scenario allowed diagnostic commands
    const lowerCmd = cleanCmd.toLowerCase();
    const matchedCmd = scenario.allowedCommands.find(
      (c) => c.command.toLowerCase() === lowerCmd || lowerCmd.startsWith(c.command.toLowerCase())
    );

    let output = '';
    let newlyUnlockedEvidence: any = null;

    if (matchedCmd) {
      output = session.remediationApplied ? matchedCmd.fixedOutput : matchedCmd.brokenOutput;

      if (matchedCmd.unlocksEvidenceId && !session.discoveredEvidenceIds.includes(matchedCmd.unlocksEvidenceId)) {
        session.discoveredEvidenceIds.push(matchedCmd.unlocksEvidenceId);
        const evItem = scenario.evidenceItems.find((e) => e.id === matchedCmd.unlocksEvidenceId);
        if (evItem) {
          newlyUnlockedEvidence = {
            id: evItem.id,
            title: evItem.title,
            category: evItem.category,
            description: evItem.description,
            data: evItem.data,
          };
        }
      }
    } else {
      // Fallback safe simulation response
      output = `Simulated Terminal: Executed '${cleanCmd}'. No anomalous interface flags detected. Use scenario diagnostic tools like ping, traceroute, ipconfig, arp, or show commands.`;
    }

    session.executedCommands.push({
      command: cleanCmd,
      output,
      timestamp: new Date().toISOString(),
    });

    if (session.currentStage === 'INCIDENT') {
      session.currentStage = 'INVESTIGATION';
    }

    return {
      session: this.sanitizeSessionResponse(session),
      commandOutput: output,
      newEvidenceUnlocked: newlyUnlockedEvidence || undefined,
    };
  }

  async submitDiagnosis(
    identity: LearnerIdentityContext,
    dto: SubmitDiagnosisDto
  ): Promise<{
    session: TroubleshootingSessionState;
    isCorrect: boolean;
    feedback: string;
  }> {
    const session = this.findAndValidateSessionOwnership(identity, dto.sessionId);
    const scenario = this.getScenarioBySlugOrId(session.scenarioId, true);

    const selectedOption = scenario.rootCauseOptions.find((r) => r.id === dto.diagnosisId);
    if (!selectedOption) {
      throw new BadRequestException(`Diagnosis option "${dto.diagnosisId}" is invalid.`);
    }

    session.attemptsCount++;
    session.selectedDiagnosisId = dto.diagnosisId;

    if (selectedOption.isCorrect) {
      session.diagnosisSubmitted = true;
      session.diagnosisCorrect = true;
      session.currentStage = 'REMEDIATION';
      return {
        session: this.sanitizeSessionResponse(session),
        isCorrect: true,
        feedback: `Root Cause Correct! ${selectedOption.explanation}`,
      };
    } else {
      session.diagnosisCorrect = false;
      session.scoreBreakdown.penaltyDeductions += 10; // 10 point penalty for guessing wrong root cause
      return {
        session: this.sanitizeSessionResponse(session),
        isCorrect: false,
        feedback: `Incorrect Hypothesis. Review collected evidence and telemetry before formulating a new diagnosis.`,
      };
    }
  }

  async applyRemediation(
    identity: LearnerIdentityContext,
    dto: ApplyRemediationDto
  ): Promise<{
    session: TroubleshootingSessionState;
    isCorrect: boolean;
    feedback: string;
  }> {
    const session = this.findAndValidateSessionOwnership(identity, dto.sessionId);
    const scenario = this.getScenarioBySlugOrId(session.scenarioId, true);

    if (!session.diagnosisCorrect) {
      throw new BadRequestException('You must accurately diagnose the root cause before applying remediation.');
    }

    const selectedRem = scenario.remediationOptions.find((r) => r.id === dto.remediationId);
    if (!selectedRem) {
      throw new BadRequestException(`Remediation action "${dto.remediationId}" is invalid.`);
    }

    session.selectedRemediationId = dto.remediationId;

    if (selectedRem.isCorrect) {
      session.remediationApplied = true;
      session.remediationCorrect = true;
      session.currentStage = 'VERIFICATION';
      return {
        session: this.sanitizeSessionResponse(session),
        isCorrect: true,
        feedback: `Remediation Applied! Configuration change applied to virtual network topology. Proceed to Verification step.`,
      };
    } else {
      session.remediationApplied = false;
      session.remediationCorrect = false;
      session.scoreBreakdown.penaltyDeductions += 10;
      return {
        session: this.sanitizeSessionResponse(session),
        isCorrect: false,
        feedback: `Ineffective Remediation. This configuration change did not resolve the core fault.`,
      };
    }
  }

  async runVerification(
    identity: LearnerIdentityContext,
    dto: RunVerificationDto
  ): Promise<{
    session: TroubleshootingSessionState;
    passed: boolean;
    score: number;
    testResults: Array<{ testId: string; testName: string; passed: boolean; output: string }>;
    postMortemSummary: string;
  }> {
    const session = this.findAndValidateSessionOwnership(identity, dto.sessionId);
    const scenario = this.getScenarioBySlugOrId(session.scenarioId, true);

    if (!session.remediationApplied || !session.remediationCorrect) {
      throw new BadRequestException('Remediation must be successfully applied before running verification.');
    }

    // Execute verification test suite
    const testResults = scenario.verificationTests.map((test) => {
      const isPass = session.remediationCorrect === true;
      return {
        testId: test.id,
        testName: test.name,
        passed: isPass,
        output: isPass ? test.successMessage : test.failureMessage,
      };
    });

    const allPassed = testResults.every((t) => t.passed);

    // Multi-factor scoring calculation
    const totalEvidenceCount = scenario.evidenceItems.length;
    const discoveredCount = session.discoveredEvidenceIds.length;
    const evidenceScore = totalEvidenceCount > 0 ? Math.round((discoveredCount / totalEvidenceCount) * 25) : 25;
    const diagnosisScore = session.diagnosisCorrect ? 30 : 0;
    const remediationScore = session.remediationCorrect ? 30 : 0;
    const verificationScore = allPassed ? 15 : 0;

    const rawTotal = evidenceScore + diagnosisScore + remediationScore + verificationScore - session.scoreBreakdown.penaltyDeductions;
    const finalScore = Math.max(0, Math.min(100, rawTotal));

    session.scoreBreakdown = {
      evidenceScore,
      diagnosisScore,
      remediationScore,
      verificationScore,
      penaltyDeductions: session.scoreBreakdown.penaltyDeductions,
      totalScore: finalScore,
    };

    session.verificationCompleted = true;
    session.verificationPassed = allPassed;
    session.verificationTestResults = testResults;
    session.passed = allPassed && finalScore >= 70;
    session.currentStage = 'COMPLETED';
    session.completedAt = new Date().toISOString();

    // Persist attempt to database
    await this.persistTroubleshootingResult(identity, scenario, session);

    return {
      session: this.sanitizeSessionResponse(session),
      passed: session.passed,
      score: finalScore,
      testResults,
      postMortemSummary: scenario.postMortem.summary,
    };
  }

  private findAndValidateSessionOwnership(
    identity: LearnerIdentityContext,
    sessionId: string
  ): TroubleshootingSessionState & { userId?: string; anonymousId?: string } {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new NotFoundException(`Troubleshooting session "${sessionId}" not found or has expired.`);
    }

    const { userId, anonymousId } = identity;

    if (userId) {
      if (session.userId && session.userId !== userId) {
        throw new ForbiddenException('Access denied: You do not own this troubleshooting session.');
      }
    } else if (anonymousId) {
      if (session.anonymousId && session.anonymousId !== anonymousId) {
        throw new ForbiddenException('Access denied: Anonymous session mismatch.');
      }
    }

    return session;
  }

  private sanitizeSessionResponse(session: TroubleshootingSessionState): TroubleshootingSessionState {
    return {
      ...session,
    };
  }

  private async persistTroubleshootingResult(
    identity: LearnerIdentityContext,
    scenario: TroubleshootingScenario,
    session: TroubleshootingSessionState
  ) {
    const { userId, anonymousId } = identity;

    try {
      if (anonymousId && !userId) {
        await this.prisma.anonymousLearner.upsert({
          where: { id: anonymousId },
          update: {},
          create: { id: anonymousId },
        }).catch(() => null);
      }

      // Try to find matching LessonLab or create a virtual lab attempt
      let lab = await this.prisma.lessonLab.findFirst({
        where: { slug: scenario.slug },
      });

      if (!lab) {
        // Find default or first lesson to link
        const firstLesson = await this.prisma.lesson.findFirst();
        if (firstLesson) {
          lab = await this.prisma.lessonLab.create({
            data: {
              lessonId: firstLesson.id,
              slug: scenario.slug,
              type: 'TROUBLESHOOTING_INCIDENT',
              title: scenario.title,
              description: scenario.incidentDescription,
              difficulty: scenario.difficulty as any,
              estimatedMinutes: scenario.estimatedMinutes,
              instructions: scenario.incidentDescription,
            },
          }).catch(() => null);
        }
      }

      if (lab) {
        await this.prisma.labAttempt.create({
          data: {
            userId: userId || null,
            anonymousId: anonymousId || null,
            labId: lab.id,
            passed: session.passed,
            score: session.scoreBreakdown.totalScore,
            hintsUsedCount: session.hintsUsedCount,
            attemptsCount: session.attemptsCount,
            commandHistoryJson: session.executedCommands,
            validationResultJson: session.verificationTestResults,
            userSolutionJson: {
              diagnosisId: session.selectedDiagnosisId,
              remediationId: session.selectedRemediationId,
              scoreBreakdown: session.scoreBreakdown,
            },
            status: session.passed ? 'PASSED' : 'FAILED',
            completedAt: new Date(),
          },
        }).catch((err) => this.logger.warn(`Failed to persist labAttempt: ${err.message}`));
      }

      // Award Achievements
      if (session.passed) {
        await this.achievementsService.awardAchievement({ userId, anonymousId }, 'FIRST_LAB').catch(() => null);
        if (session.scoreBreakdown.totalScore >= 90) {
          await this.achievementsService.awardAchievement({ userId, anonymousId }, 'PERFECT_SCORE').catch(() => null);
        }
      }
    } catch (err: any) {
      this.logger.error(`Error persisting troubleshooting result: ${err.message}`);
    }
  }
}
