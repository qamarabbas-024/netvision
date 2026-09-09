/**
 * Public Capstone Assessment types for frontend rendering.
 * Does NOT contain answer keys, solutions, or grading rubrics.
 */

export interface PublicTheoryQuestion {
  id: string;
  category: string;
  prompt: string;
  options: string[];
  points: number;
}

export interface PublicIncidentTask {
  taskId: string;
  title: string;
  prompt: string;
  type: 'CHOICE' | 'ORDERING';
  options: Array<{ id: string; label: string }>;
  points: number;
}

export interface PublicIncidentScenario {
  scenarioCode: string;
  title: string;
  description: string;
  topologySummary: string;
  syslogSnippet: string;
  interfaceConfigs: Record<string, string>;
  tasks: PublicIncidentTask[];
}

export interface PacketFrameTelemetry {
  frameNumber: number;
  timestamp: string;
  sourceIp: string;
  destIp: string;
  protocol: string;
  srcPort?: number;
  dstPort?: number;
  tcpFlags?: string[];
  seqHex: string;
  seqDec: number;
  ackHex?: string;
  ackDec?: number;
  windowSize: number;
  payloadLength: number;
  info: string;
}

export interface PublicForensicsQuestion {
  id: string;
  prompt: string;
  options: string[];
  points: number;
}

export interface PublicForensicsScenario {
  scenarioCode: string;
  title: string;
  description: string;
  frames: PacketFrameTelemetry[];
  questions: PublicForensicsQuestion[];
}

export interface PublicCapstoneAssessment {
  version: number;
  examCode: string;
  certificationCode: string;
  title: string;
  durationSeconds: number;
  scoringWeights: {
    theoryWeight: number;
    practicalWeight: number;
    packetAnalysisWeight: number;
    passingScore: number;
  };
  theorySection: {
    title: string;
    description: string;
    questions: PublicTheoryQuestion[];
  };
  incidentSection: {
    title: string;
    description: string;
    scenario: PublicIncidentScenario;
  };
  forensicsSection: {
    title: string;
    description: string;
    scenario: PublicForensicsScenario;
  };
}

export interface CandidateIncidentAnswers {
  layerDomain?: string;
  protocolFailure?: string;
  rootCause?: string;
  diagnosticOrder?: string[];
  remediationChoice?: string;
  [key: string]: any;
}

export interface SubmitCapstoneAttemptPayload {
  theoryAnswers?: Record<string, number | string>;
  incidentAnswers?: CandidateIncidentAnswers;
  forensicsAnswers?: Record<string, number | string>;
  incidentHypothesis?: string;
  troubleshootingActions?: Array<{ action: string; target: string; value?: string }>;
  packetAnalysisAnswers?: Record<string, any>;
}
