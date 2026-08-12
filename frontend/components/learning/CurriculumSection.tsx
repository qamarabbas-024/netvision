'use client';

import React, { useState } from 'react';
import { CourseCard } from './CourseCard';
import { SearchInput } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Layers, ShieldCheck, Zap, BookOpen, Compass, Filter } from 'lucide-react';

export interface CurriculumSectionProps {
  topics: Array<{
    id: string;
    slug: string;
    code?: string;
    title: string;
    tagline: string;
    category: string;
    description?: string;
    level: 'FOUNDATIONAL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | string;
    icon?: string;
    estimatedHours: number;
    lessonsCount: number;
    labsCount?: number;
    completedLessons?: number;
    progressPercent?: number;
    prerequisites?: string[];
    isLocked?: boolean;
  }>;
}

export const CurriculumSection: React.FC<CurriculumSectionProps> = ({ topics }) => {
  const [activeTier, setActiveTier] = useState<
    'ALL' | 'FOUNDATIONAL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  >('ALL');
  const [activeStatus, setActiveStatus] = useState<
    'ALL' | 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'LOCKED'
  >('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const categories = ['All', 'Foundations', 'Fundamentals', 'TCP/IP', 'Routing', 'Switching', 'Security'];

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredTopics = topics.filter((t) => {
    // Match level tier
    const isFoundational = t.level === 'FOUNDATIONAL' || t.level === 'LEVEL_0';
    const isBeginner = t.level === 'BEGINNER' || t.level === 'LEVEL_1';
    const isIntermediate = t.level === 'INTERMEDIATE' || t.level === 'LEVEL_2';
    const isAdvanced = t.level === 'ADVANCED' || t.level === 'LEVEL_3';

    let matchesTier = true;
    if (activeTier === 'FOUNDATIONAL') matchesTier = isFoundational;
    else if (activeTier === 'BEGINNER') matchesTier = isBeginner;
    else if (activeTier === 'INTERMEDIATE') matchesTier = isIntermediate;
    else if (activeTier === 'ADVANCED') matchesTier = isAdvanced;

    // Match category
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;

    // Match search
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      t.title.toLowerCase().includes(query) ||
      t.tagline.toLowerCase().includes(query) ||
      (t.code && t.code.toLowerCase().includes(query)) ||
      t.category.toLowerCase().includes(query);

    // Match status
    const progress = t.progressPercent ?? 0;
    const isCompleted = progress === 100;
    const isInProgress = progress > 0 && !isCompleted;
    const isNotStarted = progress === 0 && !t.isLocked;
    const isLocked = t.isLocked ?? false;

    let matchesStatus = true;
    if (activeStatus === 'NOT_STARTED') matchesStatus = isNotStarted;
    else if (activeStatus === 'IN_PROGRESS') matchesStatus = isInProgress;
    else if (activeStatus === 'COMPLETED') matchesStatus = isCompleted;
    else if (activeStatus === 'LOCKED') matchesStatus = isLocked;

    return matchesTier && matchesCategory && matchesSearch && matchesStatus;
  });

  const foundationalCount = topics.filter(
    (t) => t.level === 'FOUNDATIONAL' || t.level === 'LEVEL_0'
  ).length;
  const beginnerCount = topics.filter(
    (t) => t.level === 'BEGINNER' || t.level === 'LEVEL_1'
  ).length;
  const intermediateCount = topics.filter(
    (t) => t.level === 'INTERMEDIATE' || t.level === 'LEVEL_2'
  ).length;
  const advancedCount = topics.filter(
    (t) => t.level === 'ADVANCED' || t.level === 'LEVEL_3'
  ).length;

  return (
    <div className="flex flex-col gap-8">
      {/* Catalog Header & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold block mb-1">
            STRUCTURED LEARNING PATHWAYS
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Course Catalog & Curriculum
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Serious technical networking curriculum. Progress step-by-step from digital foundations to advanced network security architecture.
          </p>
        </div>

        <div className="w-full lg:w-80">
          <SearchInput
            placeholder="Search courses, protocols, or NET code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tier Selector Tabs: Level 0 -> Level 1 -> Level 2 -> Level 3 */}
      <div className="flex items-center gap-2.5 p-1.5 glass-panel rounded-2xl border border-[#272732] overflow-x-auto">
        <button
          onClick={() => setActiveTier('ALL')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTier === 'ALL'
              ? 'bg-[#00f0ff] text-black shadow-glow-cyan font-extrabold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          All Levels ({topics.length})
        </button>

        <button
          onClick={() => setActiveTier('FOUNDATIONAL')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTier === 'FOUNDATIONAL'
              ? 'bg-blue-500 text-white shadow-glow-blue font-extrabold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4 text-blue-400" />
          Level 0: Foundations ({foundationalCount})
        </button>

        <button
          onClick={() => setActiveTier('BEGINNER')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTier === 'BEGINNER'
              ? 'bg-[#00f0ff] text-black shadow-glow-cyan font-extrabold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4 text-[#00f0ff]" />
          Level 1: Beginner ({beginnerCount})
        </button>

        <button
          onClick={() => setActiveTier('INTERMEDIATE')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTier === 'INTERMEDIATE'
              ? 'bg-purple-500 text-white shadow-glow-purple font-extrabold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4 text-purple-400" />
          Level 2: Intermediate ({intermediateCount})
        </button>

        <button
          onClick={() => setActiveTier('ADVANCED')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTier === 'ADVANCED'
              ? 'bg-rose-500 text-white shadow-glow-rose font-extrabold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-rose-400" />
          Level 3: Advanced ({advancedCount})
        </button>
      </div>

      {/* Filter Row: Category Pills & Status Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#272732]/80">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-mono text-zinc-500 mr-1 shrink-0">Topic:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-white/15 text-white border border-[#00f0ff]/50 font-bold'
                  : 'bg-[#181820]/60 text-zinc-400 hover:text-white border border-[#272732]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-xs font-mono text-zinc-500">Status:</span>
          <select
            value={activeStatus}
            onChange={(e) => setActiveStatus(e.target.value as any)}
            className="bg-[#121217] text-white border border-[#272732] rounded-xl px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-[#00f0ff]"
          >
            <option value="ALL">All Statuses</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="LOCKED">Locked</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
      {filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTopics.map((topic) => (
            <CourseCard
              key={topic.id}
              course={topic}
              isBookmarked={bookmarkedIds.includes(topic.id)}
              onToggleBookmark={toggleBookmark}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Courses Match Your Criteria"
          description="Try switching the difficulty level tab or resetting your search and status filters."
          actionLabel="Reset Filters"
          onAction={() => {
            setActiveTier('ALL');
            setActiveStatus('ALL');
            setSelectedCategory('All');
            setSearchQuery('');
          }}
        />
      )}
    </div>
  );
};
