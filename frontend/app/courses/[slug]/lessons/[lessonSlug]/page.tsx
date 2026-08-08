'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LessonViewer } from '@/components/learning/LessonViewer';
import { PulsePacketLoader } from '@/components/ui/Loading';
import { getLessonDetailApi } from '@/lib/api';

export default function LessonPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const lessonSlug = params?.lessonSlug as string;

  const [lesson, setLesson] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLesson() {
      if (!lessonSlug) return;
      try {
        const data = await getLessonDetailApi(lessonSlug || slug);
        setLesson(data);
      } catch (err) {
        console.error('Error fetching lesson data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadLesson();
  }, [slug, lessonSlug]);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex items-center justify-center">
          <PulsePacketLoader label="Loading Interactive Lesson..." />
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
            <p className="text-sm text-zinc-400">Could not retrieve lesson data for "{lessonSlug}".</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] p-6 bg-net-grid-pattern">
        <div className="max-w-6xl mx-auto">
          <LessonViewer lesson={lesson} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
