'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bookmark, Clock, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export interface LessonHeaderProps {
  courseTitle: string;
  courseSlug: string;
  courseLevel: string;
  moduleTitle: string;
  lessonTitle: string;
  durationMinutes: number;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  courseTitle,
  courseSlug,
  courseLevel,
  moduleTitle,
  lessonTitle,
  durationMinutes,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    if (onToggleBookmark) onToggleBookmark();
  };

  return (
    <header className="glass-panel border-b border-[#272732]/80 p-4 sm:p-6 rounded-3xl flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/courses/${courseSlug}`}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors shrink-0 flex items-center gap-1.5 text-xs font-mono"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Syllabus
        </Link>

        <div className="flex items-center gap-3">
          <Badge variant="cyan">{courseLevel.toUpperCase()}</Badge>
          <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#00f0ff]" /> {durationMinutes} min read
          </span>
          <button
            onClick={handleBookmark}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-[#00f0ff] transition-colors"
            title="Bookmark Lesson"
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'text-[#00f0ff] fill-[#00f0ff]' : ''}`} />
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
          <span>{courseTitle}</span>
          <span>•</span>
          <span className="text-purple-400 flex items-center gap-1">
            <Layers className="w-3 h-3" /> {moduleTitle}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{lessonTitle}</h1>
      </div>
    </header>
  );
};
