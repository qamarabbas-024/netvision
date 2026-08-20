'use client';

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { CurriculumSection } from '@/components/learning/CurriculumSection';
import { PulsePacketLoader } from '@/components/ui/Loading';
import { getTopicsApi } from '@/lib/api';

import { ErrorState } from '@/components/ui/ErrorState';

export default function CourseCatalogPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadTopics = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await getTopicsApi();
      setTopics(data || []);
    } catch (err: any) {
      console.error('Failed to load curriculum topics:', err);
      setLoadError(err?.message || 'Failed to connect to course curriculum service.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen surface-0 text-[#f4f5f7] flex font-sans">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-4 sm:p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
              {isLoading ? (
                <div className="py-20 flex justify-center">
                  <PulsePacketLoader label="Loading Curriculum Topics..." />
                </div>
              ) : loadError ? (
                <ErrorState
                  title="Failed to Load Curriculum"
                  message={loadError}
                  errorCode="ERR_CATALOG_UNAVAILABLE"
                  onRetry={loadTopics}
                  className="my-auto"
                />
              ) : (
                <CurriculumSection topics={topics} />
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
