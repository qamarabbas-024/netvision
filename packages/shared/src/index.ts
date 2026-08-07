// NetVision Shared Package Exports

export * from './models/KnowledgeModel';

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
} as const;
