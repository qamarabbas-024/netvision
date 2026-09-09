/**
 * NetVision Master Capstone Assessment & Grading Engine Types
 * Defines authoritative server-side content, rubrics, and public-safe projections.
 */

export interface CapstoneScoringWeights {
  theoryWeight: number;         // e.g. 40
  practicalWeight: number;      // e.g. 35
  packetAnalysisWeight: number; // e.g. 25
  passingScore: number;         // e.g. 85
}

// ---------------------------------------------------------------------------
// Authoritative Theory Question (Private - contains answer keys)
// ---------------------------------------------------------------------------
export interface AuthoritativeTheoryQuestion {
  id: string;
  category: string;
  prompt: string;
  options: string[];
  correctOption: number;        // Index 0..3 (NEVER sent to client)
  points: number;               // Points awarded for correct answer
  explanation?: string;         // Internal pedagogical rationale (NEVER sent to client)
}

// Public-safe Theory Question (Safe for browser rendering)
export interface PublicTheoryQuestion {
  id: string;
  category: string;
  prompt: string;
  options: string[];
  points: number;
}

// ---------------------------------------------------------------------------
// Authoritative Incident Challenge (Private - contains rubric)
// ---------------------------------------------------------------------------
export interface AuthoritativeIncidentTask {
  taskId: string;
  title: string;
  prompt: string;
  type: 'CHOICE' | 'ORDERING';
  options: Array<{ id: string; label: string }>;
  correctAnswer: string | string[]; // Correct choice ID or array of IDs in order (NEVER sent to client)
  points: number;
}

export interface AuthoritativeIncidentScenario {
  scenarioCode: string;
  title: string;
  description: string;
  topologySummary: string;
  syslogSnippet: string;
  interfaceConfigs: Record<string, string>;
  tasks: AuthoritativeIncidentTask[];
}

// Public-safe Incident Challenge
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

// ---------------------------------------------------------------------------
// Authoritative Packet Forensics Challenge (Private - contains answer keys)
// ---------------------------------------------------------------------------
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

export interface AuthoritativeForensicsQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctOption: number;        // Index 0..3 (NEVER sent to client)
  points: number;
  explanation?: string;
}

export interface AuthoritativeForensicsScenario {
  scenarioCode: string;
  title: string;
  description: string;
  frames: PacketFrameTelemetry[];
  questions: AuthoritativeForensicsQuestion[];
}

// Public-safe Packet Forensics Challenge
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

// ---------------------------------------------------------------------------
// Full Authoritative Assessment Definition
// ---------------------------------------------------------------------------
export interface CapstoneAssessmentDefinition {
  version: number;
  examCode: string;
  certificationCode: string;
  title: string;
  durationSeconds: number;
  scoringWeights: CapstoneScoringWeights;
  theorySection: {
    title: string;
    description: string;
    questions: AuthoritativeTheoryQuestion[];
  };
  incidentSection: {
    title: string;
    description: string;
    scenario: AuthoritativeIncidentScenario;
  };
  forensicsSection: {
    title: string;
    description: string;
    scenario: AuthoritativeForensicsScenario;
  };
}

// Public-safe Assessment Definition
export interface PublicCapstoneAssessment {
  version: number;
  examCode: string;
  certificationCode: string;
  title: string;
  durationSeconds: number;
  scoringWeights: CapstoneScoringWeights;
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

// ---------------------------------------------------------------------------
// Candidate Submission Payload
// ---------------------------------------------------------------------------
export interface CandidateIncidentAnswers {
  layerDomain?: string;
  protocolFailure?: string;
  rootCause?: string;
  diagnosticOrder?: string[];
  remediationChoice?: string;
  [key: string]: any;
}

export interface CandidateCapstoneSubmission {
  theoryAnswers?: Record<string, number | string>;
  incidentAnswers?: CandidateIncidentAnswers;
  forensicsAnswers?: Record<string, number | string>;
  // For backwards compatibility / audit:
  incidentHypothesis?: string;
  troubleshootingActions?: Array<{ action: string; target: string; value?: string }>;
  packetAnalysisAnswers?: Record<string, any>;
  [key: string]: any;
}

// ---------------------------------------------------------------------------
// Authoritative Grading Result
// ---------------------------------------------------------------------------
export interface QuestionGradingResult {
  questionId: string;
  pointsEarned: number;
  maxPoints: number;
  passed: boolean;
}

export interface SectionGradingResult {
  sectionName: string;
  weightPercent: number;
  rawPointsEarned: number;
  rawMaxPoints: number;
  sectionScorePercent: number;
  weightedScore: number;
  questions: QuestionGradingResult[];
}

export interface CapstoneGradingSummary {
  assessmentVersion: number;
  examCode: string;
  overallScore: number;         // 0-100 rounded
  passed: boolean;              // true if overallScore >= passingScore
  passingThreshold: number;     // 85
  componentScores: {
    theoryScore: number;        // 0-100
    practicalScore: number;     // 0-100
    packetAnalysisScore: number;// 0-100
  };
  weightedScores: {
    theoryWeighted: number;
    practicalWeighted: number;
    packetAnalysisWeighted: number;
  };
  scoringWeights: CapstoneScoringWeights;
  sections: {
    theory: SectionGradingResult;
    incident: SectionGradingResult;
    forensics: SectionGradingResult;
  };
  candidateResponsesSnapshot: {
    theoryAnswersCount: number;
    incidentAnswersProvided: boolean;
    forensicsAnswersCount: number;
  };
}
