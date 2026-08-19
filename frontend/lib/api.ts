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
      const errorMsg = errorData.message || `API request failed with status ${res.status}`;
      telemetry.captureApiError(endpoint, res.status, errorMsg, requestId);
      throw new Error(errorMsg);
    }

    return await res.json();
  } catch (err: any) {
    console.warn(`[NetVision API] Fetch failed for ${url}: ${err.message}.`);
    throw err;
  }
}

export async function getTopicsApi(level?: string, category?: string) {
  const params = new URLSearchParams();
  if (level) params.append('level', level);
  if (category) params.append('category', category);
  const queryStr = params.toString() ? `?${params.toString()}` : '';
  return await fetchApi<any[]>(`/courses${queryStr}`);
}

export async function getTopicDetailApi(slug: string) {
  return await fetchApi<any>(`/courses/${slug}`);
}

export async function getLessonDetailApi(slug: string) {
  return await fetchApi<any>(`/lessons/${slug}`);
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
  return await fetchApi<any>(`/certificates/${idOrCode}`);
}

export async function getUserCertificatesApi(): Promise<any[]> {
  try {
    return await fetchApi<any[]>('/certificates');
  } catch {
    return [];
  }
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

export async function getTroubleshootingScenariosApi(): Promise<any[]> {
  return await fetchApi<any[]>('/troubleshooting/scenarios');
}

export async function getTroubleshootingScenarioDetailApi(idOrSlug: string): Promise<any> {
  return await fetchApi<any>(`/troubleshooting/scenarios/${idOrSlug}`);
}

export async function getTroubleshootingPostMortemApi(idOrSlug: string): Promise<any> {
  return await fetchApi<any>(`/troubleshooting/scenarios/${idOrSlug}/post-mortem`);
}

export async function startTroubleshootingSessionApi(scenarioId: string): Promise<any> {
  return await fetchApi<any>('/troubleshooting/session/start', {
    method: 'POST',
    body: JSON.stringify({ scenarioId }),
  });
}

export async function executeTroubleshootingCommandApi(sessionId: string, scenarioId: string, command: string): Promise<any> {
  return await fetchApi<any>('/troubleshooting/session/execute', {
    method: 'POST',
    body: JSON.stringify({ sessionId, scenarioId, command }),
  });
}

export async function submitTroubleshootingDiagnosisApi(sessionId: string, scenarioId: string, diagnosisId: string): Promise<any> {
  return await fetchApi<any>('/troubleshooting/session/diagnose', {
    method: 'POST',
    body: JSON.stringify({ sessionId, scenarioId, diagnosisId }),
  });
}

export async function applyTroubleshootingRemediationApi(sessionId: string, scenarioId: string, remediationId: string): Promise<any> {
  return await fetchApi<any>('/troubleshooting/session/remediate', {
    method: 'POST',
    body: JSON.stringify({ sessionId, scenarioId, remediationId }),
  });
}

export async function runTroubleshootingVerificationApi(sessionId: string, scenarioId: string): Promise<any> {
  return await fetchApi<any>('/troubleshooting/session/verify', {
    method: 'POST',
    body: JSON.stringify({ sessionId, scenarioId }),
  });
}
