// NetVision Shared Package Exports

export * from './models/KnowledgeModel';
export * from './models/SandboxModel';
export * from './models/TroubleshootingModel';
export * from './data/troubleshootingScenarios';

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  COURSES: {
    LIST: '/courses',
    DETAIL: (slug: string) => `/courses/${slug}`,
    LESSONS: (courseSlug: string) => `/courses/${courseSlug}/lessons`,
  },
  USER: {
    PROFILE: '/users/profile',
    PROGRESS: '/users/progress',
  },
  TROUBLESHOOTING: {
    SCENARIOS: '/troubleshooting/scenarios',
    DETAIL: (slug: string) => `/troubleshooting/scenarios/${slug}`,
    START_SESSION: '/troubleshooting/session/start',
    EXECUTE_COMMAND: '/troubleshooting/session/execute',
    DIAGNOSE: '/troubleshooting/session/diagnose',
    REMEDIATE: '/troubleshooting/session/remediate',
    VERIFY: '/troubleshooting/session/verify',
    POST_MORTEM: (slug: string) => `/troubleshooting/scenarios/${slug}/post-mortem`,
  },
} as const;
