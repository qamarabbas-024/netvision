'use client';

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppSidebar } from '@/components/ui/Sidebar';
import { AppTopbar } from '@/components/ui/Topbar';
import { CurriculumSection } from '@/components/learning/CurriculumSection';
import { PulsePacketLoader } from '@/components/ui/Loading';
import { getTopicsApi } from '@/lib/api';

import { Button } from '@/components/ui/Button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

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
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
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
                <div className="p-12 glass-panel rounded-3xl border border-rose-500/30 text-center flex flex-col items-center gap-4 my-auto">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Failed to Load Curriculum</h3>
                    <p className="text-xs text-zinc-400 max-w-md">{loadError}</p>
                  </div>
                  <Button variant="cyan" size="sm" onClick={loadTopics} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
                    Retry Connection
                  </Button>
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
