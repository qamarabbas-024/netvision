import { FLAGSHIP_5_COURSES, FlagshipCourseDefinition } from '@netvision/shared';

export interface FallbackLesson {
  id: string;
  slug: string;
  title: string;
  type: 'LESSON' | 'LAB' | 'QUIZ';
  durationMinutes: number;
  completed?: boolean;
  score?: number | null;
  contentMarkdown?: string;
  visualType?: string;
  labConfig?: any;
}

export interface FallbackModule {
  id: string;
  title: string;
  description: string;
  lessons: FallbackLesson[];
}

export interface FallbackCourse {
  id: string;
  code: string;
  credentialCode?: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  description: string;
  level: 'FOUNDATIONAL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  icon: string;
  estimatedHours: number;
  lessonsCount: number;
  labsCount: number;
  prerequisites: string[];
  modules: FallbackModule[];
  progressPercent?: number;
  isLocked?: boolean;
}

function buildFallbackLessonsForModule(moduleSlug: string, moduleTitle: string): FallbackLesson[] {
  return [
    {
      id: `les-${moduleSlug}-theory`,
      slug: `${moduleSlug}-foundations`,
      title: `${moduleTitle}: Protocol Foundations`,
      type: 'LESSON',
      durationMinutes: 20,
      contentMarkdown: `# ${moduleTitle}\n\nComprehensive exploration of core protocol architecture, framing, and packet telemetry.`,
      visualType: 'packet-dissector',
    },
    {
      id: `les-${moduleSlug}-interactive-lab`,
      slug: `${moduleSlug}-lab`,
      title: `${moduleTitle}: Hands-On Verification Lab`,
      type: 'LAB',
      durationMinutes: 30,
      contentMarkdown: `# Practical Hands-on Lab\n\nVerify interface state, packet routing, and protocol convergence.`,
      visualType: 'topology-sandbox',
    },
    {
      id: `les-${moduleSlug}-assessment-quiz`,
      slug: `${moduleSlug}-quiz`,
      title: `${moduleTitle}: Assessment Check`,
      type: 'QUIZ',
      durationMinutes: 15,
      contentMarkdown: `# Knowledge Check\n\nDemonstrate mastery of protocol mechanisms.`,
    },
  ];
}

export const FALLBACK_COURSES: FallbackCourse[] = FLAGSHIP_5_COURSES.map((fDef: FlagshipCourseDefinition) => {
  const modules: FallbackModule[] = fDef.modules.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    lessons: buildFallbackLessonsForModule(m.slug, m.title),
  }));

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalLabs = modules.reduce((acc, m) => acc + m.lessons.filter((l) => l.type === 'LAB').length, 0);

  return {
    id: `course-${fDef.code.toLowerCase()}`,
    code: fDef.code,
    credentialCode: fDef.credentialCode,
    slug: fDef.slug,
    title: fDef.title,
    tagline: fDef.tagline,
    category: fDef.category,
    description: fDef.description,
    level: fDef.level,
    icon: fDef.icon,
    estimatedHours: fDef.estimatedHours,
    lessonsCount: totalLessons,
    labsCount: totalLabs,
    prerequisites: fDef.prerequisites,
    modules,
    progressPercent: 0,
    isLocked: false,
  };
});

export function getFallbackTopicDetail(slug: string): FallbackCourse {
  const clean = slug.toLowerCase().trim();
  const found = FALLBACK_COURSES.find(
    (c) =>
      c.slug === clean ||
      c.code.toLowerCase() === clean ||
      (c.credentialCode && c.credentialCode.toLowerCase() === clean) ||
      clean.includes(c.code.toLowerCase())
  );
  return found || FALLBACK_COURSES[0];
}

export function getFallbackLessonDetail(lessonSlug: string): FallbackLesson {
  for (const course of FALLBACK_COURSES) {
    for (const mod of course.modules) {
      const lesson = mod.lessons.find((l) => l.slug === lessonSlug);
      if (lesson) return lesson;
    }
  }
  return FALLBACK_COURSES[0].modules[0].lessons[0];
}
