import React from 'react';
import Link from 'next/link';
import { DifficultyBadge } from './DifficultyBadge';
import { Progress } from '@/components/ui/Progress';
import { Layers, Router, SwitchCamera, ShieldCheck, Clock, BookOpen, CheckCircle2, Bookmark } from 'lucide-react';

export interface TopicCardProps {
  topic: {
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
  };
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string, e: React.MouseEvent) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  const renderIcon = (name?: string) => {
    switch (name) {
      case 'Router':
      case 'DNSIcon':
        return <Router className="w-6 h-6 text-[#00f0ff]" />;
      case 'Switch':
        return <SwitchCamera className="w-6 h-6 text-purple-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-rose-400" />;
      default:
        return <Layers className="w-6 h-6 text-[#00f0ff]" />;
    }
  };

  const isCompleted = topic.progressPercent === 100;

  return (
    <Link href={`/courses/${topic.slug}`}>
      <div className="surface-2 p-5 rounded-xl border border-[#2a2e39] hover:border-[#38bdf8]/40 hover:bg-[#1f222c] shadow-instrument transition-all flex flex-col justify-between h-full group relative overflow-hidden font-sans">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <DifficultyBadge level={topic.level} />

            <div className="flex items-center gap-2 shrink-0">
              {isCompleted && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded-md border border-[#10b981]/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  COMPLETED
                </span>
              )}
              {onToggleBookmark && (
                <button
                  onClick={(e) => onToggleBookmark(topic.id, e)}
                  className="text-[#646c7d] hover:text-[#38bdf8] transition-colors p-1"
                  title="Bookmark Topic"
                  aria-label="Bookmark Topic"
                >
                  <Bookmark
                    className={`w-4 h-4 ${isBookmarked ? 'text-[#38bdf8] fill-[#38bdf8]' : ''}`}
                  />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[#14151a] border border-[#2a2e39] flex items-center justify-center shrink-0 group-hover:border-[#38bdf8]/40 transition-colors">
              {renderIcon(topic.icon)}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-[#646c7d] block uppercase tracking-wider truncate">
                {topic.category}
              </span>
              <h3 className="text-base font-bold text-[#f4f5f7] group-hover:text-[#38bdf8] transition-colors leading-snug truncate">
                {topic.title}
              </h3>
            </div>
          </div>

          <p className="text-xs text-[#8e95a5] line-clamp-2 mb-5 leading-relaxed">
            {topic.tagline}
          </p>
        </div>

        <div className="pt-3.5 border-t border-[#2a2e39] flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs text-[#8e95a5] font-mono">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#646c7d]" />
              {topic.estimatedHours}h Total
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#646c7d]" />
              {topic.lessonsCount} Lessons
            </span>
          </div>

          {(topic.progressPercent ?? 0) > 0 && (
            <Progress value={topic.progressPercent ?? 0} size="sm" />
          )}
        </div>
      </div>
    </Link>
  );
};
