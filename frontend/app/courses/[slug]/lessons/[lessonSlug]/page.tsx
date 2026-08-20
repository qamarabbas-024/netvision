'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LessonViewer } from '@/components/learning/LessonViewer';
import { PulsePacketLoader } from '@/components/ui/Loading';
import { getLessonDetailApi, getTopicDetailApi } from '@/lib/api';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';

export default function LessonPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const lessonSlug = params?.lessonSlug as string;
  const stageParam = searchParams?.get('stage') || undefined;

  const [lesson, setLesson] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLessonAndCourse = async () => {
    if (!lessonSlug) return;
    setIsLoading(true);
    setError(null);
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
    } catch (err: any) {
      console.error('Error fetching lesson data:', err);
      setError(err?.message || `Failed to load lesson "${lessonSlug}".`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLessonAndCourse();
  }, [slug, lessonSlug]);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen surface-0 text-[#f4f5f7] flex items-center justify-center font-sans">
          <PulsePacketLoader label="Loading Technical Lesson Environment..." />
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !lesson) {
    const isNotFound = error?.toLowerCase().includes('not found') || !error;
    return (
      <ProtectedRoute>
        <div className="min-h-screen surface-0 text-[#f4f5f7] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto font-sans">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#f4f5f7] mb-2">
            {isNotFound ? 'Lesson Not Found' : 'Failed to Load Lesson'}
          </h2>
          <p className="text-xs sm:text-sm text-[#8e95a5] mb-6 leading-relaxed">
            {isNotFound
              ? `Could not locate lesson "${lessonSlug}" in this course.`
              : error || 'An unexpected connection error occurred.'}
          </p>
          <div className="flex items-center gap-3">
            {!isNotFound && (
              <Button variant="primary" onClick={loadLessonAndCourse} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
                Retry Loading
              </Button>
            )}
            <Link href={`/courses/${slug || 'net-101-digital-foundations'}`}>
              <Button variant={isNotFound ? 'primary' : 'secondary'} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Course Syllabus
              </Button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen surface-0 text-[#f4f5f7] font-sans">
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <LessonViewer
            lesson={lesson}
            initialStage={stageParam}
            onMarkComplete={() => {
              // Local update callback if needed
            }}
          />
        </main>
      </div>
    </ProtectedRoute>
  );
}
