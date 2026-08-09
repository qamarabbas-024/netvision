// Reusable Client-Side Guest Progress & Anonymous Identity Service

const ANON_ID_KEY = 'netvision_anon_id';
const GUEST_PROGRESS_KEY = 'netvision_guest_progress';

export interface GuestProgressState {
  anonymousId: string;
  completedLessonIds: string[];
  lessonScores: Record<string, number>;
  quizAttempts: Record<string, { score: number; passed: boolean; timestamp: string }>;
  labAttempts: Record<string, { score: number; passed: boolean; timestamp: string }>;
  bookmarkedLessonIds: string[];
  lastLessonSlug: string | null;
  lastActiveTimestamp: string;
}

export class GuestProgressService {
  /**
   * Get or initialize cryptographically strong anonymous learner UUID
   */
  static getLearnerId(): string {
    if (typeof window === 'undefined') return '';
    let id = localStorage.getItem(ANON_ID_KEY);
    if (!id) {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        id = crypto.randomUUID();
      } else {
        id = 'guest-' + Date.now() + '-' + Math.random().toString(36).substring(2, 10);
      }
      localStorage.setItem(ANON_ID_KEY, id);
    }
    return id;
  }

  /**
   * Get complete guest progress state from localStorage
   */
  static getProgress(): GuestProgressState {
    const anonymousId = this.getLearnerId();
    const defaultState: GuestProgressState = {
      anonymousId,
      completedLessonIds: [],
      lessonScores: {},
      quizAttempts: {},
      labAttempts: {},
      bookmarkedLessonIds: [],
      lastLessonSlug: null,
      lastActiveTimestamp: new Date().toISOString(),
    };

    if (typeof window === 'undefined') return defaultState;
    const stored = localStorage.getItem(GUEST_PROGRESS_KEY);
    if (!stored) return defaultState;

    try {
      const parsed = JSON.parse(stored);
      return {
        ...defaultState,
        ...parsed,
        anonymousId,
      };
    } catch (e) {
      return defaultState;
    }
  }

  /**
   * Persist updated guest progress state
   */
  static saveProgress(state: Partial<GuestProgressState>): GuestProgressState {
    const current = this.getProgress();
    const updated: GuestProgressState = {
      ...current,
      ...state,
      lastActiveTimestamp: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(updated));
    }
    return updated;
  }

  /**
   * Record lesson completed state
   */
  static markLessonCompleted(lessonId: string, lessonSlug?: string, score?: number): GuestProgressState {
    const current = this.getProgress();
    const completedSet = new Set(current.completedLessonIds);
    completedSet.add(lessonId);

    const scores = { ...current.lessonScores };
    if (score !== undefined) {
      scores[lessonId] = Math.max(scores[lessonId] || 0, score);
    }

    return this.saveProgress({
      completedLessonIds: Array.from(completedSet),
      lessonScores: scores,
      lastLessonSlug: lessonSlug || current.lastLessonSlug,
    });
  }

  /**
   * Record quiz attempt result
   */
  static saveQuizAttempt(quizId: string, score: number, passed: boolean): GuestProgressState {
    const current = this.getProgress();
    const quizAttempts = {
      ...current.quizAttempts,
      [quizId]: {
        score,
        passed,
        timestamp: new Date().toISOString(),
      },
    };
    return this.saveProgress({ quizAttempts });
  }

  /**
   * Record practical lab attempt result
   */
  static saveLabAttempt(labId: string, score: number, passed: boolean): GuestProgressState {
    const current = this.getProgress();
    const labAttempts = {
      ...current.labAttempts,
      [labId]: {
        score,
        passed,
        timestamp: new Date().toISOString(),
      },
    };
    return this.saveProgress({ labAttempts });
  }

  /**
   * Toggle saved lesson bookmark
   */
  static toggleBookmark(lessonId: string): boolean {
    const current = this.getProgress();
    const bookmarkSet = new Set(current.bookmarkedLessonIds);
    let isBookmarked = false;

    if (bookmarkSet.has(lessonId)) {
      bookmarkSet.delete(lessonId);
      isBookmarked = false;
    } else {
      bookmarkSet.add(lessonId);
      isBookmarked = true;
    }

    this.saveProgress({ bookmarkedLessonIds: Array.from(bookmarkSet) });
    return isBookmarked;
  }

  /**
   * Clear local guest storage after successful account claim merge
   */
  static clearLocalGuestProgress(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(GUEST_PROGRESS_KEY);
  }
}
