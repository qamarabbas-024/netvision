import React, { useState } from 'react';
import { TopicCard } from './TopicCard';
import { SearchInput } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Layers, ShieldCheck, Zap, BookOpen } from 'lucide-react';

export interface CurriculumSectionProps {
  topics: Array<{
    id: string;
    slug: string;
    title: string;
    tagline: string;
    category: string;
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | string;
    icon?: string;
    estimatedHours: number;
    lessonsCount: number;
    completedLessons?: number;
    progressPercent?: number;
  }>;
}

export const CurriculumSection: React.FC<CurriculumSectionProps> = ({ topics }) => {
  const [activeTier, setActiveTier] = useState<'ALL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const categories = ['All', 'Fundamentals', 'TCP/IP', 'Routing', 'Switching', 'Security'];

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredTopics = topics.filter((t) => {
    const matchesTier = activeTier === 'ALL' || t.level === activeTier;
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tagline.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTier && matchesCategory && matchesSearch;
  });

  const beginnerCount = topics.filter((t) => t.level === 'BEGINNER').length;
  const intermediateCount = topics.filter((t) => t.level === 'INTERMEDIATE').length;
  const advancedCount = topics.filter((t) => t.level === 'ADVANCED').length;

  return (
    <div className="flex flex-col gap-8">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-semibold block mb-1">
            Structured Learning Track
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Networking Curriculum Catalog
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Master networking step-by-step from fundamental protocols to advanced security architecture.
          </p>
        </div>

        <div className="w-full lg:w-80">
          <SearchInput
            placeholder="Search topics, protocols, or concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tier Selector Tabs: Beginner -> Intermediate -> Advanced */}
      <div className="flex items-center gap-3 p-1.5 glass-panel rounded-2xl border border-[#272732] overflow-x-auto">
        <button
          onClick={() => setActiveTier('ALL')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTier === 'ALL'
              ? 'bg-[#00f0ff] text-black shadow-glow-cyan'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          All Topics ({topics.length})
        </button>

        <button
          onClick={() => setActiveTier('BEGINNER')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTier === 'BEGINNER'
              ? 'bg-[#00f0ff] text-black shadow-glow-cyan'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4 text-[#00f0ff]" />
          1. Beginner ({beginnerCount})
        </button>

        <button
          onClick={() => setActiveTier('INTERMEDIATE')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTier === 'INTERMEDIATE'
              ? 'bg-purple-500 text-white shadow-glow-purple'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4 text-purple-400" />
          2. Intermediate ({intermediateCount})
        </button>

        <button
          onClick={() => setActiveTier('ADVANCED')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTier === 'ADVANCED'
              ? 'bg-rose-500 text-white shadow-glow-rose'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-rose-400" />
          3. Advanced ({advancedCount})
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 border-b border-[#272732]/80">
        <span className="text-xs font-mono text-zinc-500 mr-2 shrink-0">Filter Category:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-white/15 text-white border border-[#00f0ff]/50 font-bold'
                : 'bg-[#181820]/60 text-zinc-400 hover:text-white border border-[#272732]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      {filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              isBookmarked={bookmarkedIds.includes(topic.id)}
              onToggleBookmark={toggleBookmark}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Topics Match Your Filter"
          description="Try selecting another difficulty tier or clearing your category and search parameters."
          actionLabel="Reset Filters"
          onAction={() => {
            setActiveTier('ALL');
            setSelectedCategory('All');
            setSearchQuery('');
          }}
        />
      )}
    </div>
  );
};
