import {
  TROUBLESHOOTING_SCENARIOS,
  TroubleshootingScenario,
  TroubleshootingSessionState,
} from '@netvision/shared';

export const FALLBACK_TROUBLESHOOTING_SCENARIOS: TroubleshootingScenario[] = TROUBLESHOOTING_SCENARIOS;

export function getFallbackScenarioBySlug(slug: string): TroubleshootingScenario | undefined {
  return FALLBACK_TROUBLESHOOTING_SCENARIOS.find(
    (s) => s.slug === slug || s.id === slug
  );
}

export function createLocalTroubleshootingSession(scenario: TroubleshootingScenario): TroubleshootingSessionState {
  return {
    sessionId: `local-session-${Date.now()}`,
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
  };
}

export function executeLocalCommand(
  scenario: TroubleshootingScenario,
  session: TroubleshootingSessionState,
  command: string
): { output: string; evidenceUnlocked?: string; updatedSession: TroubleshootingSessionState } {
  const cleanCmd = command.trim().toLowerCase();
  const matched = scenario.allowedCommands.find(
    (c) => c.command.toLowerCase().trim() === cleanCmd || cleanCmd.startsWith(c.command.toLowerCase().trim())
  );

  const isFixed = session.currentStage === 'REMEDIATION' || session.currentStage === 'VERIFICATION' || session.currentStage === 'COMPLETED';
  const output = matched
    ? isFixed ? matched.fixedOutput : matched.brokenOutput
    : `bash: ${command}: command not found or not permitted in this diagnostic scenario. Type 'help' to view available diagnostic tools.`;

  const updatedSession: TroubleshootingSessionState = {
    ...session,
    executedCommands: [
      ...session.executedCommands,
      { command, output, timestamp: new Date().toISOString() },
    ],
  };

  let evidenceUnlocked: string | undefined = undefined;
  if (matched?.unlocksEvidenceId && !updatedSession.discoveredEvidenceIds.includes(matched.unlocksEvidenceId)) {
    updatedSession.discoveredEvidenceIds = [...updatedSession.discoveredEvidenceIds, matched.unlocksEvidenceId];
    evidenceUnlocked = matched.unlocksEvidenceId;
  }

  return { output, evidenceUnlocked, updatedSession };
}
