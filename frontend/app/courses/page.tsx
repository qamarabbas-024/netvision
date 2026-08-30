'use client';

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { CurriculumSection } from '@/components/learning/CurriculumSection';
import { getTopicsApi } from '@/lib/api';
import { CURRICULUM_STEPS } from '@/data/curriculumData';

// Fallback initial dataset to provide instantaneous 0ms page load
const INITIAL_TOPICS = CURRICULUM_STEPS.map((step, idx) => ({
  id: `topic-${step.code.toLowerCase()}`,
  slug: `${step.code.toLowerCase()}-${step.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  code: step.code,
  title: step.title,
  tagline: step.summary,
  category: idx <= 1 ? 'Foundations' : idx <= 3 ? 'Switching' : idx <= 4 ? 'Routing' : 'Security',
  description: step.topics.join(' • '),
  level: idx <= 1 ? 'FOUNDATIONAL' : idx <= 3 ? 'BEGINNER' : idx <= 5 ? 'INTERMEDIATE' : 'ADVANCED',
  estimatedHours: parseInt(step.duration) || 8,
  lessonsCount: step.topics.length * 3,
  labsCount: step.labsCount,
  completedLessons: 0,
  progressPercent: 0,
  isLocked: step.isLocked || false,
}));

export default function CourseCatalogPage() {
  const [topics, setTopics] = useState<any[]>(INITIAL_TOPICS);
  const [isLoading, setIsLoading] = useState(false);

  const loadTopics = async () => {
    try {
      const data = await getTopicsApi();
      if (data && Array.isArray(data) && data.length > 0) {
        setTopics(data);
      }
    } catch (err: any) {
      // Retain instant local curriculum fallback
      console.warn('Live topics sync fallback to local canonical dataset:', err?.message);
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
