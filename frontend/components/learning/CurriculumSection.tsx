'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CourseCard } from './CourseCard';
import { SearchInput } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Layers,
  ShieldCheck,
  Zap,
  BookOpen,
  Compass,
  Filter,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
} from 'lucide-react';

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

  const foundationalTopics = topics.filter(
    (t) => t.level === 'FOUNDATIONAL' || t.level === 'LEVEL_0'
  );
  const beginnerTopics = topics.filter(
    (t) => t.level === 'BEGINNER' || t.level === 'LEVEL_1'
  );
  const intermediateTopics = topics.filter(
    (t) => t.level === 'INTERMEDIATE' || t.level === 'LEVEL_2'
  );
  const advancedTopics = topics.filter(
    (t) => t.level === 'ADVANCED' || t.level === 'LEVEL_3'
  );

  // Identify featured starter course (NET-101 or first foundational course)
  const featuredCourse = topics.find((t) => t.code === 'NET-101') || topics[0];

  return (
    <div id="curriculum-catalog" className="flex flex-col gap-8 font-sans">
      {/* Catalog Header & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-widest font-semibold block mb-1">
            CANONICAL LEARNING PROGRESSION
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#f4f5f7] tracking-tight">
            Course Catalog & Curriculum
          </h1>
          <p className="text-xs sm:text-sm text-[#8e95a5] mt-1 max-w-2xl leading-relaxed">
            Structured computer networking curriculum. Progress step-by-step from digital representation to advanced enterprise routing and security.
          </p>
        </div>

        <div className="w-full lg:w-80">
          <SearchInput
            placeholder="Search courses, protocols, or NET-101..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Featured Starter Course Banner */}
      {featuredCourse && !searchQuery && activeTier === 'ALL' && (
        <div className="surface-2 p-6 sm:p-7 rounded-xl border border-[#2a2e39] shadow-elevated relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="flex flex-col gap-2.5 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#2563eb]/20 text-[#38bdf8] border border-[#2563eb]/30 text-[10px] font-mono font-bold uppercase">
                  <Sparkles className="w-3 h-3" />
                  RECOMMENDED ENTRY POINT
                </span>
                {featuredCourse.code && (
                  <span className="text-xs font-mono font-bold text-[#8e95a5]">
                    {featuredCourse.code}
                  </span>
                )}
                <Badge variant="cyan" dot={true}>Level 0: Foundations</Badge>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-[#f4f5f7] tracking-tight">
                {featuredCourse.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#8e95a5] leading-relaxed">
                {featuredCourse.tagline || featuredCourse.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#8e95a5] pt-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#646c7d]" />
                  {featuredCourse.estimatedHours} Hours
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#646c7d]" />
                  {featuredCourse.lessonsCount} Core Lessons
                </span>
                <span className="flex items-center gap-1.5 text-[#10b981]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Zero Prerequisites Required
                </span>
              </div>
            </div>

            <Link href={`/courses/${featuredCourse.slug}`} className="shrink-0 w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto justify-center font-bold px-6 py-3"
              >
                Start Foundational Track
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Tier Selector Tabs: Level 0 -> Level 1 -> Level 2 -> Level 3 */}
      <div className="flex items-center gap-2 p-1.5 bg-[#14151a] rounded-xl border border-[#2a2e39] overflow-x-auto shadow-inner">
        <button
          onClick={() => setActiveTier('ALL')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap font-mono cursor-pointer ${
            activeTier === 'ALL'
              ? 'bg-[#1b1e26] text-[#38bdf8] border border-[#2a2e39] font-bold shadow-sm'
              : 'text-[#8e95a5] hover:text-[#f4f5f7]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          All Levels ({topics.length})
        </button>

        <button
          onClick={() => setActiveTier('FOUNDATIONAL')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap font-mono cursor-pointer ${
            activeTier === 'FOUNDATIONAL'
              ? 'bg-[#1b1e26] text-[#38bdf8] border border-[#2a2e39] font-bold shadow-sm'
              : 'text-[#8e95a5] hover:text-[#f4f5f7]'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-[#38bdf8]" />
          Level 0: Foundations ({foundationalTopics.length})
        </button>

        <button
          onClick={() => setActiveTier('BEGINNER')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap font-mono cursor-pointer ${
            activeTier === 'BEGINNER'
              ? 'bg-[#1b1e26] text-[#10b981] border border-[#2a2e39] font-bold shadow-sm'
              : 'text-[#8e95a5] hover:text-[#f4f5f7]'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-[#10b981]" />
          Level 1: Beginner ({beginnerTopics.length})
        </button>

        <button
          onClick={() => setActiveTier('INTERMEDIATE')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap font-mono cursor-pointer ${
            activeTier === 'INTERMEDIATE'
              ? 'bg-[#1b1e26] text-[#818cf8] border border-[#2a2e39] font-bold shadow-sm'
              : 'text-[#8e95a5] hover:text-[#f4f5f7]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#818cf8]" />
          Level 2: Intermediate ({intermediateTopics.length})
        </button>

        <button
          onClick={() => setActiveTier('ADVANCED')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap font-mono cursor-pointer ${
            activeTier === 'ADVANCED'
              ? 'bg-[#1b1e26] text-[#ef4444] border border-[#2a2e39] font-bold shadow-sm'
              : 'text-[#8e95a5] hover:text-[#f4f5f7]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#ef4444]" />
          Level 3: Advanced ({advancedTopics.length})
        </button>
      </div>

      {/* Filter Row: Category Pills & Status Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#2a2e39]">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-mono text-[#646c7d] mr-1 shrink-0">Topic:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1b1e26] text-[#38bdf8] border border-[#38bdf8]/40 font-bold'
                  : 'bg-[#14151a] text-[#8e95a5] hover:text-[#f4f5f7] border border-[#2a2e39]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-[#646c7d]" />
          <span className="text-xs font-mono text-[#646c7d]">Status:</span>
          <select
            value={activeStatus}
            onChange={(e) => setActiveStatus(e.target.value as any)}
            className="bg-[#14151a] text-[#f4f5f7] border border-[#2a2e39] rounded-lg px-2.5 py-1 text-xs font-mono font-semibold focus:outline-none focus:border-[#38bdf8]"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
