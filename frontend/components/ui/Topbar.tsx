'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, Flame, User, BookOpen, Layers, X } from 'lucide-react';
import { Badge } from './Badge';
import { searchApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

export const AppTopbar: React.FC = () => {
  const router = useRouter();
  const { user } = useAuthStore();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ courses: any[]; lessons: any[]; modules: any[] } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  return (
    <header className="w-full glass-panel border-b border-[#272732]/60 px-6 py-3.5 flex items-center justify-between gap-4 relative z-30">
      {/* Interactive Search Bar */}
      <div className="max-w-md w-full relative" ref={searchRef}>
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setIsOpen(true)}
            placeholder="Search courses, lessons, topics..."
            className="w-full bg-[#121217] text-white border border-[#272732] rounded-xl pl-10 pr-9 py-2.5 text-sm transition-all focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] placeholder:text-zinc-500"
          />
          {query ? (
            <button
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="absolute right-3 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        {/* Search Results Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#121217] border border-[#272732] rounded-2xl shadow-2xl overflow-hidden glass-panel p-4 flex flex-col gap-4 max-h-[450px] overflow-y-auto z-50">
            {isLoading ? (
              <p className="text-xs text-zinc-400 p-2 text-center animate-pulse">Searching NetVision curriculum...</p>
            ) : hasResults ? (
              <>
                {/* Courses */}
                {results.courses.length > 0 && (
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#00f0ff] font-bold block mb-2 px-2">
                      Courses & Topics ({results.courses.length})
                    </span>
                    <div className="flex flex-col gap-1">
                      {results.courses.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => handleSelectResult(`/courses/${c.slug}`)}
                          className="p-2.5 rounded-xl hover:bg-white/5 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <BookOpen className="w-4 h-4 text-[#00f0ff]" />
                            <div>
                              <div className="text-xs font-bold text-white">{c.title}</div>
                              <div className="text-[10px] text-zinc-400 line-clamp-1">{c.tagline}</div>
                            </div>
                          </div>
                          <Badge variant="cyan">{c.level}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lessons */}
                {results.lessons.length > 0 && (
                  <div>
                    <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block mb-2 px-2">
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
                          className="p-2.5 rounded-xl hover:bg-white/5 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Layers className="w-4 h-4 text-purple-400" />
                            <div>
                              <div className="text-xs font-bold text-white">{l.title}</div>
                              <div className="text-[10px] text-zinc-400">
                                {l.module?.course?.title} • {l.durationMinutes} mins
                              </div>
                            </div>
                          </div>
                          <Badge variant="purple">{l.type}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-4 text-center">
                <p className="text-xs text-zinc-400">No networking lessons or topics found matching "{query}".</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Progress Stats & Profile */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
          <Flame className="w-4 h-4 fill-amber-400" />
          <span>7 Day Streak</span>
        </div>

        <Badge variant={user?.role === 'ADMIN' ? 'rose' : 'cyan'}>
          {user ? (user.role === 'ADMIN' ? 'Admin Access' : 'Active Learner') : 'Guest'}
        </Badge>

        <button className="w-9 h-9 rounded-xl bg-[#181820] border border-[#272732] hover:border-zinc-500 flex items-center justify-center text-zinc-400 hover:text-white transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00f0ff]" />
        </button>

        <Link href="/profile">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs cursor-pointer shadow-glow-purple">
            <User className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </header>
  );
};
