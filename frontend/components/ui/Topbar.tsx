'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, Flame, User, BookOpen, Layers, X, Menu, Palette } from 'lucide-react';
import { Badge } from './Badge';
import { searchApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { MobileSidebarDrawer } from './Sidebar';
import { HyperThemeStudio } from './HyperThemeStudio';
import { SoundToggle } from './SoundToggle';
import { CommandPalette } from './CommandPalette';

export const AppTopbar: React.FC = () => {
  const router = useRouter();
  const { user } = useAuthStore();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ courses: any[]; lessons: any[]; modules: any[] } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showThemeStudio, setShowThemeStudio] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await searchApi(query);
        setResults(res);
        setIsOpen(true);
      } catch (e) {
        console.error('Search error:', e);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectResult = (url: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(url);
  };

  const hasResults =
    results &&
    (results.courses.length > 0 || results.lessons.length > 0 || results.modules.length > 0);

  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    import('@/lib/api').then(({ getUserProgressApi }) => {
      getUserProgressApi().then((data) => {
        if (data && typeof data.studyStreak === 'number') {
          setStreak(data.studyStreak);
        }
      }).catch(() => null);
    });
  }, []);

  return (
    <>
      <header className="w-full bg-[#16181f] border-b border-[#2a2e39] px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 relative z-30 font-sans">
        {/* Mobile Menu Hamburger */}
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 rounded-lg bg-[#14151a] border border-[#2a2e39] text-[#8e95a5] hover:text-white shrink-0 cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Interactive Search Bar */}
        <div className="max-w-md w-full relative min-w-0" ref={searchRef}>
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-[#646c7d]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim() && setIsOpen(true)}
              placeholder="Search curriculum..."
              className="w-full bg-[#14151a] text-[#f4f5f7] border border-[#2a2e39] rounded-lg pl-9 pr-8 py-1.5 text-xs sm:text-sm transition-all focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] placeholder:text-[#646c7d]"
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setIsOpen(false);
                }}
                className="absolute right-2.5 text-[#8e95a5] hover:text-white p-1"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="absolute right-2.5 hidden sm:flex items-center gap-0.5 pointer-events-none">
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-zinc-800 text-zinc-400 border border-zinc-700">⌘K</kbd>
              </div>
            )}
          </div>

          {/* Search Results Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1b1e26] border border-[#2a2e39] rounded-xl shadow-elevated overflow-hidden p-3 flex flex-col gap-3 max-h-[380px] overflow-y-auto z-50">
              {isLoading ? (
                <p className="text-xs text-[#8e95a5] p-2 text-center animate-pulse font-mono">Searching NetVision curriculum...</p>
              ) : hasResults ? (
                <>
                  {/* Courses */}
                  {results.courses.length > 0 && (
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#38bdf8] font-bold block mb-1.5 px-2">
                        Courses & Topics ({results.courses.length})
                      </span>
                      <div className="flex flex-col gap-1">
                        {results.courses.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => handleSelectResult(`/courses/${c.slug}`)}
                            className="p-2 rounded-lg hover:bg-[#14151a] cursor-pointer flex items-center justify-between gap-2 transition-colors border border-transparent hover:border-[#2a2e39]"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <BookOpen className="w-4 h-4 text-[#38bdf8] shrink-0" />
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-[#f4f5f7] truncate">{c.title}</div>
                                <div className="text-[10px] text-[#8e95a5] truncate">{c.tagline}</div>
                              </div>
                            </div>
                            <Badge variant="cyan" className="shrink-0">{c.level}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lessons */}
                  {results.lessons.length > 0 && (
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#818cf8] font-bold block mb-1.5 px-2">
                        Interactive Lessons ({results.lessons.length})
                      </span>
                      <div className="flex flex-col gap-1">
                        {results.lessons.map((l) => (
                          <div
                            key={l.id}
                            onClick={() =>
                              handleSelectResult(
                                `/courses/${l.module?.course?.slug || 'networking-fundamentals'}/lessons/${l.slug}`
                              )
                            }
                            className="p-2 rounded-lg hover:bg-[#14151a] cursor-pointer flex items-center justify-between gap-2 transition-colors border border-transparent hover:border-[#2a2e39]"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Layers className="w-4 h-4 text-[#818cf8] shrink-0" />
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-[#f4f5f7] truncate">{l.title}</div>
                                <div className="text-[10px] text-[#8e95a5] truncate">
                                  {l.module?.course?.title} • {l.durationMinutes} mins
                                </div>
                              </div>
                            </div>
                            <Badge variant="purple" className="shrink-0">{l.type}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-3 text-center">
                  <p className="text-xs text-[#8e95a5]">No lessons or topics found matching "{query}".</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Progress Stats & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#14151a] border border-[#2a2e39] text-amber-400 text-xs font-mono font-bold">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>{streak} {streak === 1 ? 'DAY' : 'DAYS'}</span>
          </div>

          <div className="hidden lg:block">
            <Badge variant={user?.role === 'ADMIN' ? 'rose' : 'cyan'}>
              {user ? (user.role === 'ADMIN' ? 'ADMIN' : 'LEARNER') : 'GUEST'}
            </Badge>
          </div>

          <Link href="/workbench" aria-label="Simulation Workbench">
            <div
              className="w-8 h-8 rounded-lg bg-[#14151a] border border-[#2a2e39] hover:border-[#00f0ff] flex items-center justify-center text-[#8e95a5] hover:text-[#00f0ff] transition-colors cursor-pointer"
              title="Open Master Simulation Workbench"
            >
              <Layers className="w-4 h-4" />
            </div>
          </Link>

          <SoundToggle />

          <button
            type="button"
            aria-label="Theme Studio"
            onClick={() => setShowThemeStudio(true)}
            className="w-8 h-8 rounded-lg bg-[#14151a] border border-[#2a2e39] hover:border-[#00f0ff] flex items-center justify-center text-[#8e95a5] hover:text-[#00f0ff] transition-colors"
            title="Open Hyper-Theme Studio (Version 4.3)"
          >
            <Palette className="w-4 h-4" />
          </button>

          <button
            type="button"
            aria-label="Notifications"
            className="w-8 h-8 rounded-lg bg-[#14151a] border border-[#2a2e39] hover:border-zinc-500 flex items-center justify-center text-[#8e95a5] hover:text-[#f4f5f7] transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
          </button>

          <Link href="/profile" aria-label="View user profile">
            <div className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center text-white font-bold text-xs cursor-pointer shadow-sm hover:bg-[#3b82f6] transition-colors">
              <User className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </header>

      {/* Theme Studio Modal */}
      {showThemeStudio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <HyperThemeStudio onClose={() => setShowThemeStudio(false)} />
          </div>
        </div>
      )}

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette />

      {/* Mobile Drawer Overlay */}
      <MobileSidebarDrawer isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};
