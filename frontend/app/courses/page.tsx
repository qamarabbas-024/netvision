'use client';

import React, { useEffect, useState } from 'react';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { CurriculumSection } from '@/components/learning/CurriculumSection';
import { getTopicsApi } from '@/lib/api';
import { FLAGSHIP_5_COURSES } from '@netvision/shared';
import { SITE_URL } from '@/lib/siteConfig';

// Canonical flagship initial dataset provides instant 0ms render without legacy flash
const INITIAL_TOPICS = FLAGSHIP_5_COURSES.map((course) => ({
  id: `course-${course.code.toLowerCase()}`,
  slug: course.slug,
  code: course.code,
  title: course.title,
  tagline: course.tagline,
  category: course.category,
  description: course.description,
  level: course.level,
  estimatedHours: course.estimatedHours,
  lessonsCount: course.modules.length * 4,
  labsCount: course.modules.length * 2,
  completedLessons: 0,
  progressPercent: 0,
  isLocked: false,
}));

export default function CourseCatalogPage() {
  const [topics, setTopics] = useState<any[]>(INITIAL_TOPICS);
  const [isLoading, setIsLoading] = useState(false);
  const [isBackendUnavailable, setIsBackendUnavailable] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadTopics = async (signal?: AbortSignal) => {
    setIsLoading(true);
    setIsBackendUnavailable(false);
    setErrorMessage(null);
    try {
      const data = await getTopicsApi(undefined, undefined, { signal });
      if (signal?.aborted) return;
      if (Array.isArray(data)) {
        setTopics(data);
      }
    } catch (err: any) {
      if (signal?.aborted || err?.isAborted) return;
      console.warn('Live topics sync fallback to canonical flagship dataset:', err?.message);
      if (err?.isBackendUnavailable) {
        setIsBackendUnavailable(true);
        setErrorMessage(err.message || 'Service temporarily unavailable. Retaining offline curriculum.');
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadTopics(controller.signal);
    return () => {
      controller.abort();
    };
  }, []);

  // Schema.org Course Catalog ItemList Structured Data
  const catalogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'NetVision Canonical Networking Curriculum',
    description: 'Comprehensive 5-tier progressive curriculum covering digital foundations to enterprise engineering.',
    itemListElement: FLAGSHIP_5_COURSES.map((c, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Course',
        name: c.title,
        description: c.description,
        courseCode: c.code,
        url: `${SITE_URL}/courses/${c.slug}`,
        provider: {
          '@type': 'EducationalOrganization',
          name: 'NetVision',
          url: SITE_URL,
        },
      },
    })),
  };

  return (
    <div className="min-h-screen surface-0 text-[#f4f5f7] flex font-sans" suppressHydrationWarning>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogJsonLd) }}
      />
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AppTopbar />

        <main className="p-4 sm:p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <CurriculumSection
              topics={topics}
              isLoading={isLoading}
              isBackendUnavailable={isBackendUnavailable}
              errorMessage={errorMessage}
              onRetry={() => loadTopics()}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
