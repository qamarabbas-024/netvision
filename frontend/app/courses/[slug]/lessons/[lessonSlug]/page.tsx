'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LessonViewer } from '@/components/learning/LessonViewer';
import { PulsePacketLoader } from '@/components/ui/Loading';
import { getLessonDetailApi, getTopicDetailApi } from '@/lib/api';

export default function LessonPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const lessonSlug = params?.lessonSlug as string;
  const stageParam = searchParams?.get('stage') || undefined;

  const [lesson, setLesson] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLessonAndCourse() {
      if (!lessonSlug) return;
      try {
        const lessonData = await getLessonDetailApi(lessonSlug || slug);
        const courseSlug = lessonData?.course?.slug || slug;

        // Fetch course detail for full sidebar modules if needed
        if (courseSlug && (!lessonData?.course?.modules || lessonData.course.modules.length === 0)) {
          try {
            const courseDetail = await getTopicDetailApi(courseSlug);
            if (courseDetail?.modules) {
              lessonData.course.modules = courseDetail.modules;
            }
          } catch (e) {
            console.warn('Could not fetch additional course modules for sidebar:', e);
          }
        }

        setLesson(lessonData);
      } catch (err) {
        console.error('Error fetching lesson data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadLessonAndCourse();
  }, [slug, lessonSlug]);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex items-center justify-center">
          <PulsePacketLoader label="Loading Technical Lesson Environment..." />
        </div>
      </ProtectedRoute>
    );
  }

  if (!lesson) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex items-center justify-center p-8 text-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Lesson Not Found</h2>
            <p className="text-sm text-zinc-400">
              Could not retrieve lesson data for "{lessonSlug}".
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] p-4 sm:p-6 bg-net-grid-pattern">
        <div className="max-w-7xl mx-auto">
          <LessonViewer lesson={lesson} initialStage={stageParam} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
