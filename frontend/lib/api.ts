import { GuestProgressService } from '@/services/GuestProgressService';
import { telemetry } from '@/lib/telemetry';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('netvision_token') || sessionStorage.getItem('netvision_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    const anonId = GuestProgressService.getLearnerId();
    if (anonId) {
      headers['X-Anonymous-ID'] = anonId;
    }
  }
  return headers;
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  try {
    const res = await fetch(url, {
      credentials: 'include',
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const requestId = res.headers.get('x-request-id') || undefined;
      let errorMsg = 'An unexpected server error occurred.';
      if (typeof errorData.message === 'string') {
        errorMsg = errorData.message;
      } else if (Array.isArray(errorData.message)) {
        errorMsg = errorData.message.join('. ');
      } else if (res.status === 404) {
        errorMsg = 'The requested resource was not found.';
      } else if (res.status === 401) {
        errorMsg = 'Authentication session expired or invalid.';
      } else if (res.status === 403) {
        errorMsg = 'You do not have permission to access this resource.';
      } else if (res.status >= 500) {
        errorMsg = 'Server temporarily unavailable. Please try again.';
      }
      telemetry.captureApiError(endpoint, res.status, errorMsg, requestId);
      throw new Error(errorMsg);
    }

    return await res.json();
  } catch (err: any) {
    console.warn(`[NetVision API] Fetch failed for ${url}: ${err?.message || 'Network error'}.`);
    throw err;
  }
}

import { FALLBACK_COURSES, getFallbackTopicDetail, getFallbackLessonDetail } from './courseCatalogData';

export async function getTopicsApi(level?: string, category?: string) {
  try {
    const params = new URLSearchParams();
    if (level) params.append('level', level);
    if (category) params.append('category', category);
    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const res = await fetchApi<any[]>(`/courses${queryStr}`);
    if (Array.isArray(res) && res.length > 0) return res;
    return FALLBACK_COURSES;
  } catch (err) {
    console.warn('[NetVision API] Using local course catalog data fallback.');
    return FALLBACK_COURSES;
  }
}

export async function getTopicDetailApi(slug: string) {
  try {
    return await fetchApi<any>(`/courses/${slug}`);
  } catch (err) {
    console.warn(`[NetVision API] Using local course detail fallback for: ${slug}`);
    return getFallbackTopicDetail(slug);
  }
}

export async function getLessonDetailApi(slug: string) {
  try {
    return await fetchApi<any>(`/lessons/${slug}`);
  } catch (err) {
    console.warn(`[NetVision API] Using local lesson detail fallback for: ${slug}`);
    return getFallbackLessonDetail(slug);
  }
}

export async function submitQuizApi(quizId: string, answers: Record<string, number>) {
  return await fetchApi<any>(`/quizzes/${quizId}/submit`, {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
}

export async function completeLessonApi(lessonId: string) {
  return await fetchApi<any>('/progress/complete', {
    method: 'POST',
    body: JSON.stringify({ lessonId }),
  });
}

export interface StudentDashboardMetrics {
  totalCourses: number;
  totalLessons: number;
  completedLessons: number;
  overallProgressPercent: number;
  studyStreak: number;
  totalXp: number;
  simulationsRun: number;
  quizAverageScore: number;
  certificatesEarned: number;
  completedCoursesCount: number;
  currentCourse?: {
    title: string;
    slug: string;
    completedLessons: number;
    totalLessons: number;
    progressPercent: number;
    nextLessonSlug: string;
  } | null;
  badges: {
    earned: number;
    total: number;
    items: AchievementItem[];
  };
  recentAttempts: any[];
  recentLessons: any[];
}

export async function getUserProgressApi(): Promise<StudentDashboardMetrics> {
  return await fetchApi<StudentDashboardMetrics>('/progress/dashboard');
}

export async function searchApi(query: string) {
  return await fetchApi<{ courses: any[]; lessons: any[]; modules: any[] }>(`/search?q=${encodeURIComponent(query)}`);
}

export async function executeLabCommandApi(labId: string, command: string, currentTopologyState?: Record<string, any>) {
  return await fetchApi<any>('/labs/execute', {
    method: 'POST',
    body: JSON.stringify({ labId, command, currentTopologyState }),
  });
}

export async function validateLabApi(labId: string, commandHistory?: string[], hintsUsedCount?: number, userSolution?: Record<string, any>) {
  return await fetchApi<any>('/labs/validate', {
    method: 'POST',
    body: JSON.stringify({ labId, commandHistory, hintsUsedCount, userSolution }),
  });
}

export async function getAllCommandsApi(os?: string, category?: string, q?: string) {
  const params = new URLSearchParams();
  if (os) params.append('os', os);
  if (category) params.append('category', category);
  if (q) params.append('q', q);
  const queryStr = params.toString() ? `?${params.toString()}` : '';
  return await fetchApi<any[]>(`/commands${queryStr}`);
}

export async function claimAnonymousProgressApi(anonymousId: string) {
  try {
    return await fetchApi<any>('/learners/claim', {
      method: 'POST',
      body: JSON.stringify({ anonymousId }),
    });
  } catch (err: any) {
    console.warn(`[NetVision API] Claim progress error: ${err.message}`);
    return null;
  }
}

export async function getCertificateByIdApi(idOrCode: string) {
  return await fetchApi<any>(`/certificates/${encodeURIComponent(idOrCode)}`);
}

// =========================================================================
// Certification Architecture & Verification API (Drops #1 - #5)
// =========================================================================

export interface PublicVerifiedCertificateDto {
  credentialId: string;
  status: string;
  issuedAt: string;
  recipientName: string | null;
  certificationTitle: string | null;
  certificationCode: string;
  courseTitle: string | null;
  courseSlug: string | null;
  grade: string;
  score: number | null;
  componentScores: any | null;
  skillsAssessed: string[];
  isVerified: boolean;
}

export interface UserCertificateItem {
  credentialId: string;
  verificationCode?: string;
  status: string;
  issuedAt: string;
  recipientName: string;
  certificationTitle: string;
  certificationCode: string;
  courseCode?: string;
  courseTitle?: string;
  grade?: string;
  score?: number | null;
  componentScores?: any;
  skillsAssessed?: string[];
}

export interface CourseEligibilityResult {
  courseCode: string;
  courseTitle: string;
  credentialCode: string;
  credentialTitle: string;
  eligible: boolean;
  hasCertificate: boolean;
  existingCertificate?: {
    id: string;
    credentialId?: string;
    issuedAt: string;
    status: string;
  };
  blockingRequirements: string[];
  breakdown: {
    lessons: {
      total: number;
      completed: number;
      passed: boolean;
    };
    assessments: {
      requiredCount: number;
      attemptedCount: number;
      averageScore: number;
      minRequiredScore: number;
      passed: boolean;
    };
    labs: {
      total: number;
      passedCount: number;
      passed: boolean;
    };
  };
}

export interface MasteryEligibilityResult {
  credentialCode: string;
  credentialTitle: string;
  eligible: boolean;
  hasCertificate: boolean;
  existingCertificate?: {
    id: string;
    credentialId?: string;
    issuedAt: string;
    status: string;
  };
  blockingRequirements: string[];
  breakdown: {
    courseCertificates: {
      requiredCodes: string[];
      acquiredCodes: string[];
      missingCodes: string[];
      passed: boolean;
    };
    flagshipLessons: {
      total: number;
      completed: number;
      passed: boolean;
    };
    cumulativeAssessments: {
      requiredQuizzes: number;
      attemptedQuizzes: number;
      cumulativeAverage: number;
      minRequiredAverage: number;
      passed: boolean;
    };
    flagshipLabs: {
      total: number;
      passedCount: number;
      passed: boolean;
    };
    masterCapstone: {
      passed: boolean;
      score: number | null;
      attemptId?: string;
      status?: string;
    };
  };
}

export interface ClaimedCertificateResult {
  id: string;
  code?: string;
  credentialId: string;
  verificationCode?: string;
  status: string;
  issuedAt: string;
  recipientName: string;
  certificationTitle: string;
  certificationCode: string;
  grade?: string;
  score?: number;
  componentScores?: any;
  skillsAssessed?: string[];
  isVerified: boolean;
}

export interface CapstoneSpecificationDto {
  examCode: string;
  certificationCode: string;
  title: string;
  durationMinutes: number;
  durationSeconds: number;
  passingScore: number;
  scoringWeights: {
    theoryWeight: number;
    practicalWeight: number;
    packetAnalysisWeight: number;
    passingScore: number;
  };
  policy: {
    maxAttempts: number;
    rollingWindowDays: number;
    cooldownFirstFailureHours?: number;
    cooldownSubsequentFailureHours?: number;
  };
}

export interface CapstoneAttemptSessionDto {
  attemptId: string;
  examCode: string;
  certificationCode: string;
  assessmentVersion?: number;
  status: string;
  startedAt: string;
  expiresAt: string;
  submittedAt?: string | null;
  durationMinutes: number;
  durationSeconds: number;
  remainingSeconds: number;
  attemptNumber: number;
  score?: number | null;
  passed?: boolean | null;
  scoringWeights?: {
    theoryWeight: number;
    practicalWeight: number;
    packetAnalysisWeight: number;
    passingScore: number;
  };
  assessment?: any;
  result?: any;
}

export interface SubmitCapstonePayload {
  theoryAnswers?: Record<string, number | string>;
  incidentAnswers?: {
    layerDomain?: string;
    protocolFailure?: string;
    rootCause?: string;
    diagnosticOrder?: string[];
    remediationChoice?: string;
    [key: string]: any;
  };
  forensicsAnswers?: Record<string, number | string>;
  troubleshootingActions?: Array<{ action: string; target: string; value?: string }>;
  incidentHypothesis?: string;
  packetAnalysisAnswers?: Record<string, string>;
}

export interface CapstoneSubmissionResultDto {
  attemptId: string;
  examCode: string;
  status: string;
  score: number;
  passed: boolean;
  result: {
    overallScore: number;
    passed: boolean;
    passingThreshold: number;
    componentScores: {
      theoryScore: number;
      practicalScore: number;
      packetAnalysisScore: number;
    };
    weightedScores: {
      theoryWeighted: number;
      practicalWeighted: number;
      packetAnalysisWeighted: number;
    };
    scoringWeights: {
      theoryWeight: number;
      practicalWeight: number;
      packetAnalysisWeight: number;
      passingScore: number;
    };
    submittedAt: string;
    durationSecondsUsed: number;
  };
}

/**
 * Publicly verifies a credential ID without authentication headers.
 * Consumes the sanitized public verification DTO from GET /certificates/verify/:credentialId.
 */
export async function verifyCertificatePublicApi(credentialId: string): Promise<PublicVerifiedCertificateDto> {
  const url = `${API_BASE}/certificates/verify/${encodeURIComponent(credentialId)}`;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      const msg = errJson.message || (res.status === 404 ? 'Credential ID not found or invalid.' : 'Verification lookup failed.');
      const error: any = new Error(msg);
      error.status = res.status;
      throw error;
    }

    return await res.json();
  } catch (err: any) {
    console.warn(`[NetVision Verification] Public verify lookup failed: ${err.message}`);
    throw err;
  }
}

/**
 * Retrieves all active certificates owned by the authenticated learner (IDOR protected).
 */
export async function getUserCertificatesApi(): Promise<UserCertificateItem[]> {
  try {
    return await fetchApi<UserCertificateItem[]>('/certificates/mine');
  } catch {
    try {
      return await fetchApi<UserCertificateItem[]>('/certificates');
    } catch {
      return [];
    }
  }
}

/**
 * Checks server-authoritative certification eligibility for a flagship course (NV-C01 to NV-C05).
 */
export async function checkCourseEligibilityApi(courseCode: string): Promise<CourseEligibilityResult> {
  return await fetchApi<CourseEligibilityResult>(`/certifications/courses/${encodeURIComponent(courseCode)}/eligibility`);
}

/**
 * Checks server-authoritative 9-point Mastery certification eligibility for NV-NET-MASTERY.
 */
export async function checkMasteryEligibilityApi(): Promise<MasteryEligibilityResult> {
  return await fetchApi<MasteryEligibilityResult>('/certifications/mastery/eligibility');
}

/**
 * Claims an official professional certificate for an eligible course credential or Mastery.
 */
export async function claimCertificationCertificateApi(code: string): Promise<ClaimedCertificateResult> {
  return await fetchApi<ClaimedCertificateResult>(`/certifications/${encodeURIComponent(code)}/claim-certificate`, {
    method: 'POST',
  });
}

/**
 * Retrieves Master Capstone examination specification, rules, and scoring weights.
 */
export async function getCapstoneSpecificationApi(): Promise<CapstoneSpecificationDto> {
  return await fetchApi<CapstoneSpecificationDto>('/certifications/capstone/specification');
}

/**
 * Starts or resumes a 120-minute timed Master Capstone examination attempt.
 */
export async function startCapstoneAttemptApi(): Promise<CapstoneAttemptSessionDto> {
  return await fetchApi<CapstoneAttemptSessionDto>('/certifications/capstone/start', {
    method: 'POST',
  });
}

/**
 * Retrieves active Master Capstone examination attempt status with server-calculated remaining seconds.
 */
export async function getCapstoneAttemptStatusApi(attemptId: string): Promise<CapstoneAttemptSessionDto> {
  return await fetchApi<CapstoneAttemptSessionDto>(`/certifications/capstone/${encodeURIComponent(attemptId)}`);
}

/**
 * Submits Master Capstone examination attempt for server-side evaluation (40/35/25 scoring).
 */
export async function submitCapstoneAttemptApi(attemptId: string, payload: SubmitCapstonePayload): Promise<CapstoneSubmissionResultDto> {
  return await fetchApi<CapstoneSubmissionResultDto>(`/certifications/capstone/${encodeURIComponent(attemptId)}/submit`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Downloads official certificate PDF directly from the server (authorized owner only).
 */
export async function downloadCertificatePdfApi(idOrCode: string): Promise<Blob> {
  const url = `${API_BASE}/certificates/${encodeURIComponent(idOrCode)}/download`;
  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to download certificate document.');
  }

  return await res.blob();
}

export async function getSavedLessonsApi(): Promise<any[]> {
  try {
    return await fetchApi<any[]>('/progress/saved-lessons');
  } catch {
    return [];
  }
}

export async function toggleSaveLessonApi(lessonId: string): Promise<any> {
  return await fetchApi<any>('/progress/save-lesson', {
    method: 'POST',
    body: JSON.stringify({ lessonId }),
  });
}

export async function getMyAchievementsApi(): Promise<any> {
  try {
    return await fetchApi<any>('/achievements/me');
  } catch {
    return { achievements: [], unlockedCount: 0, totalPointsEarned: 0 };
  }
}

export interface AchievementItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  badgeIcon: string;
  category: 'LEARNING' | 'ASSESSMENT' | 'PRACTICAL' | 'SKILL' | 'COMPLETION' | 'MILESTONE';
  points: number;
  isActive: boolean;
  unlocked?: boolean;
  unlockedAt?: string | null;
}

// Troubleshooting Engine API Client Methods

import {
  FALLBACK_TROUBLESHOOTING_SCENARIOS,
  getFallbackScenarioBySlug,
  createLocalTroubleshootingSession,
  executeLocalCommand,
} from '@/data/troubleshootingFallbackData';

// Troubleshooting Engine API Client Methods with Robust Offline Fallback

export async function getTroubleshootingScenariosApi(): Promise<any[]> {
  try {
    const data = await fetchApi<any[]>('/troubleshooting/scenarios');
    if (Array.isArray(data) && data.length > 0) return data;
    return FALLBACK_TROUBLESHOOTING_SCENARIOS;
  } catch (err) {
    console.info('[NetVision API] Troubleshooting scenarios endpoint unreachable, using built-in catalog.');
    return FALLBACK_TROUBLESHOOTING_SCENARIOS;
  }
}

export async function getTroubleshootingScenarioDetailApi(idOrSlug: string): Promise<any> {
  try {
    return await fetchApi<any>(`/troubleshooting/scenarios/${idOrSlug}`);
  } catch (err) {
    console.info(`[NetVision API] Scenario ${idOrSlug} endpoint unreachable, using built-in detail.`);
    const fallback = getFallbackScenarioBySlug(idOrSlug);
    if (fallback) return fallback;
    throw err;
  }
}

export async function getTroubleshootingPostMortemApi(idOrSlug: string): Promise<any> {
  try {
    return await fetchApi<any>(`/troubleshooting/scenarios/${idOrSlug}/post-mortem`);
  } catch (err) {
    const fallback = getFallbackScenarioBySlug(idOrSlug);
    if (fallback?.postMortem) return fallback.postMortem;
    throw err;
  }
}

export async function startTroubleshootingSessionApi(scenarioId: string): Promise<any> {
  try {
    return await fetchApi<any>('/troubleshooting/session/start', {
      method: 'POST',
      body: JSON.stringify({ scenarioId }),
    });
  } catch (err) {
    const fallback = getFallbackScenarioBySlug(scenarioId);
    if (fallback) return createLocalTroubleshootingSession(fallback);
    throw err;
  }
}

export async function executeTroubleshootingCommandApi(sessionId: string, scenarioId: string, command: string): Promise<any> {
  try {
    return await fetchApi<any>('/troubleshooting/session/execute', {
      method: 'POST',
      body: JSON.stringify({ sessionId, scenarioId, command }),
    });
  } catch (err) {
    const fallback = getFallbackScenarioBySlug(scenarioId);
    if (fallback) {
      const mockSession = createLocalTroubleshootingSession(fallback);
      return executeLocalCommand(fallback, mockSession, command);
    }
    throw err;
  }
}

export async function submitTroubleshootingDiagnosisApi(sessionId: string, scenarioId: string, diagnosisId: string): Promise<any> {
  try {
    return await fetchApi<any>('/troubleshooting/session/diagnose', {
      method: 'POST',
      body: JSON.stringify({ sessionId, scenarioId, diagnosisId }),
    });
  } catch (err) {
    const fallback = getFallbackScenarioBySlug(scenarioId);
    const correct = fallback?.hiddenRootCauseId === diagnosisId;
    return {
      isCorrect: correct,
      message: correct ? 'Hypothesis verified! Root cause confirmed.' : 'Diagnosis rejected. Review symptom logs.',
      nextStage: correct ? 'REMEDIATION' : 'DIAGNOSIS',
      score: correct ? 100 : 40,
    };
  }
}

export async function applyTroubleshootingRemediationApi(sessionId: string, scenarioId: string, remediationId: string): Promise<any> {
  try {
    return await fetchApi<any>('/troubleshooting/session/remediate', {
      method: 'POST',
      body: JSON.stringify({ sessionId, scenarioId, remediationId }),
    });
  } catch (err) {
    const fallback = getFallbackScenarioBySlug(scenarioId);
    const correct = fallback?.correctRemediationId === remediationId;
    return {
      isApplied: correct,
      message: correct ? 'Remediation patch applied successfully.' : 'Patch failed or caused regression.',
      nextStage: correct ? 'VERIFICATION' : 'REMEDIATION',
    };
  }
}

export async function runTroubleshootingVerificationApi(sessionId: string, scenarioId: string): Promise<any> {
  try {
    return await fetchApi<any>('/troubleshooting/session/verify', {
      method: 'POST',
      body: JSON.stringify({ sessionId, scenarioId }),
    });
  } catch (err) {
    const fallback = getFallbackScenarioBySlug(scenarioId);
    return {
      allPassed: true,
      testResults: fallback?.verificationTests.map((t) => ({
        testId: t.id,
        name: t.name,
        passed: true,
        output: t.successMessage,
      })) || [],
      isResolved: true,
      score: 100,
    };
  }
}
