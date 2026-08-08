'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { PulsePacketLoader } from '@/components/ui/Loading';
import { DifficultyBadge } from '@/components/learning/DifficultyBadge';
import { LessonCard } from '@/components/learning/LessonCard';
import { getTopicDetailApi } from '@/lib/api';
import { PlayCircle, ArrowLeft } from 'lucide-react';

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [topic, setTopic] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTopicDetail() {
      if (!slug) return;
      try {
        const data = await getTopicDetailApi(slug);
        setTopic(data);
      } catch (err) {
        console.error('Error fetching topic detail:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTopicDetail();
  }, [slug]);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AppTopbar />
            <main className="p-8 flex-1 flex justify-center items-center">
              <PulsePacketLoader label="Loading Topic Syllabus..." />
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!topic) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AppTopbar />
            <main className="p-8 flex-1 flex flex-col justify-center items-center text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Topic Not Found</h2>
              <p className="text-sm text-zinc-400 mb-6">The topic slug "{slug}" could not be located.</p>
              <Link href="/courses">
                <Button variant="cyan">Back to Course Catalog</Button>
              </Link>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const firstLessonSlug =
    topic.modules?.[0]?.lessons?.[0]?.slug || topic.slug;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-6xl mx-auto flex flex-col gap-8">
              {/* Back Button */}
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-[#00f0ff] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Course Catalog
              </Link>

              {/* Course Header Banner */}
              <div className="glass-panel p-8 rounded-3xl border border-[#00f0ff]/30 shadow-glow-cyan flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <DifficultyBadge level={topic.level} />
                    <span className="text-xs font-mono text-zinc-400">
                      {topic.estimatedHours || 4} Hours Total
                    </span>
                  </div>

                  <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                    {topic.title}
                  </h1>
                  <p className="text-sm text-zinc-400 max-w-xl mb-6">{topic.tagline}</p>

                  <Progress
                    value={topic.progressPercent || 0}
                    label="Overall Completion"
                    className="max-w-md"
                  />
                </div>

                <Link href={`/courses/${slug}/lessons/${firstLessonSlug}`}>
                  <Button variant="cyan" size="lg" leftIcon={<PlayCircle className="w-5 h-5" />}>
                    {topic.progressPercent > 0 ? 'Resume Active Lesson' : 'Start Topic Lesson'}
                  </Button>
                </Link>
              </div>

              {/* Syllabus Module List */}
              <div className="flex flex-col gap-6">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Course Syllabus & Modules
                </h2>

                {topic.modules?.map((mod: any) => (
                  <Card key={mod.id} className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-white mb-1">{mod.title}</h3>
                      <p className="text-xs text-zinc-400">{mod.description}</p>
                    </div>

                    <div className="flex flex-col gap-3">
                      {mod.lessons?.map((les: any) => (
                        <LessonCard key={les.id} courseSlug={slug} lesson={les} />
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
