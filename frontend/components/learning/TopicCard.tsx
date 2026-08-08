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
      <div className="glass-panel p-6 rounded-3xl border border-[#272732] hover:border-[#00f0ff]/40 hover:shadow-glow-cyan transition-all flex flex-col justify-between h-full group relative overflow-hidden">
        <div>
          <div className="flex items-center justify-between mb-4">
            <DifficultyBadge level={topic.level} />

            <div className="flex items-center gap-2">
              {isCompleted && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Completed
                </span>
              )}
              {onToggleBookmark && (
                <button
                  onClick={(e) => onToggleBookmark(topic.id, e)}
                  className="text-zinc-500 hover:text-[#00f0ff] transition-colors p-1"
                  title="Bookmark Topic"
                >
                  <Bookmark
                    className={`w-5 h-5 ${isBookmarked ? 'text-[#00f0ff] fill-[#00f0ff]' : ''}`}
                  />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              {renderIcon(topic.icon)}
            </div>
            <div>
              <span className="text-[11px] font-mono text-zinc-500 block uppercase tracking-wider">
                {topic.category}
              </span>
              <h3 className="text-lg font-bold text-white group-hover:text-[#00f0ff] transition-colors leading-snug">
                {topic.title}
              </h3>
            </div>
          </div>

          <p className="text-xs text-zinc-400 line-clamp-2 mb-6 leading-relaxed">
            {topic.tagline}
          </p>
        </div>

        <div className="pt-4 border-t border-[#272732]/60 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              {topic.estimatedHours}h Total
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
              {topic.lessonsCount} Lessons
            </span>
          </div>

          {(topic.progressPercent ?? 0) > 0 && (
            <Progress value={topic.progressPercent ?? 0} />
          )}
        </div>
      </div>
    </Link>
  );
};
