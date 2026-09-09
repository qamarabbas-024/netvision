'use client';

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { CurriculumSection } from '@/components/learning/CurriculumSection';
import { getTopicsApi } from '@/lib/api';
import { FLAGSHIP_5_COURSES } from '@netvision/shared';

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
  const [_isLoading, setIsLoading] = useState(false);

  const loadTopics = async () => {
    try {
      const data = await getTopicsApi();
      if (data && Array.isArray(data) && data.length > 0) {
        setTopics(data);
      }
    } catch (err: any) {
      // Retain instant canonical flagship curriculum fallback
      console.warn('Live topics sync fallback to canonical flagship dataset:', err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen surface-0 text-[#f4f5f7] flex font-sans" suppressHydrationWarning>
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-4 sm:p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
              <CurriculumSection topics={topics} />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
