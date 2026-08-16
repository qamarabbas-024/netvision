// NetVision Troubleshooting Engine Domain Model

export type TroubleshootingDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export type TroubleshootingWorkflowStage =
  | 'INCIDENT'
  | 'INVESTIGATION'
  | 'DIAGNOSIS'
  | 'REMEDIATION'
  | 'VERIFICATION'
  | 'COMPLETED';

export interface TopologyNodeSpec {
  id: string;
  name: string;
  type: 'pc' | 'router' | 'switch' | 'server' | 'firewall' | 'cloud' | 'access_point';
  ipAddress?: string;
  macAddress?: string;
  subnetMask?: string;
  defaultGateway?: string;
  dnsServers?: string[];
  status: 'online' | 'degraded' | 'offline';
  position: { x: number; y: number };
  config?: Record<string, any>;
}

export interface TopologyLinkSpec {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourcePort?: string;
  targetPort?: string;
  bandwidthMbps?: number;
  latencyMs?: number;
  packetLossPercent?: number;
  status: 'connected' | 'degraded' | 'blocked' | 'disconnected';
}

export interface ScenarioTopology {
  nodes: TopologyNodeSpec[];
  links: TopologyLinkSpec[];
}

export interface EvidenceItem {
  id: string;
  title: string;
  category: 'CONFIG' | 'LOG' | 'PACKET_TRACE' | 'CLI_OUTPUT' | 'INTERFACE_METRIC';
  description: string;
  data: string;
  discoveredByCommand?: string;
  isUnlocked: boolean;
}

export interface AllowedCommandSpec {
  command: string;
  description: string;
  category: 'DIAGNOSTIC' | 'CONFIGURATION' | 'INSPECTION';
  brokenOutput: string;
  fixedOutput: string;
  unlocksEvidenceId?: string;
}

export interface RootCauseOption {
  id: string;
  description: string;
  isCorrect: boolean;
  explanation: string;
}

export interface RemediationOption {
  id: string;
  title: string;
  commandSyntax?: string;
  actionDescription: string;
  isCorrect: boolean;
  explanation: string;
}

export interface VerificationTest {
  id: string;
  name: string;
  testCommand: string;
  expectedOutputSubstring: string;
  failureMessage: string;
  successMessage: string;
}

export interface TroubleshootingPostMortem {
  summary: string;
  rootCauseAnalysis: string;
  osiLayer:
    | 'Layer 1 (Physical)'
    | 'Layer 2 (Data Link)'
    | 'Layer 1/2 (Physical & Data Link)'
    | 'Layer 3 (Network)'
    | 'Layer 4 (Transport)'
    | 'Layer 3/4 (Network & Transport)'
    | 'Layer 7 (Application)';
  preventionBestPractices: string[];
  recommendedCommands: string[];
}

export interface TroubleshootingScenario {
  id: string;
  slug: string;
  title: string;
  incidentDescription: string;
  category: string;
  difficulty: TroubleshootingDifficulty;
  estimatedMinutes: number;
  networkingConcepts: string[];
  initialSymptoms: string[];
  topology: ScenarioTopology;
  evidenceItems: EvidenceItem[];
  allowedCommands: AllowedCommandSpec[];
  rootCauseOptions: RootCauseOption[];
  hiddenRootCauseId: string;
  remediationOptions: RemediationOption[];
  correctRemediationId: string;
  verificationTests: VerificationTest[];
  postMortem: TroubleshootingPostMortem;
}

export interface TroubleshootingSessionState {
  sessionId: string;
  scenarioId: string;
  scenarioSlug: string;
  currentStage: TroubleshootingWorkflowStage;
  discoveredEvidenceIds: string[];
  executedCommands: Array<{ command: string; output: string; timestamp: string }>;
  selectedDiagnosisId?: string;
  diagnosisSubmitted: boolean;
  diagnosisCorrect?: boolean;
  selectedRemediationId?: string;
  remediationApplied: boolean;
  remediationCorrect?: boolean;
  verificationCompleted: boolean;
  verificationPassed?: boolean;
  verificationTestResults?: Array<{ testId: string; testName: string; passed: boolean; output: string }>;
  attemptsCount: number;
  hintsUsedCount: number;
  scoreBreakdown: {
    evidenceScore: number;
    diagnosisScore: number;
    remediationScore: number;
    verificationScore: number;
    penaltyDeductions: number;
    totalScore: number;
  };
  passed: boolean;
  startedAt: string;
  completedAt?: string;
}

export interface ExecuteScenarioCommandDto {
  sessionId: string;
  scenarioId: string;
  command: string;
}

export interface SubmitDiagnosisDto {
  sessionId: string;
  scenarioId: string;
  diagnosisId: string;
}

export interface ApplyRemediationDto {
  sessionId: string;
  scenarioId: string;
  remediationId: string;
}

export interface RunVerificationDto {
  sessionId: string;
  scenarioId: string;
}
