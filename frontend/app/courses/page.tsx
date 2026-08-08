'use client';

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { CurriculumSection } from '@/components/learning/CurriculumSection';
import { PulsePacketLoader } from '@/components/ui/Loading';
import { getTopicsApi } from '@/lib/api';

export default function CourseCatalogPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTopics() {
      try {
        const data = await getTopicsApi();
        setTopics(data);
      } catch (err) {
        console.error('Failed to load curriculum topics:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTopics();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar />

          <main className="p-8 flex-1 overflow-y-auto bg-net-grid-pattern">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
              {isLoading ? (
                <div className="py-20 flex justify-center">
                  <PulsePacketLoader label="Loading Curriculum Topics..." />
                </div>
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
