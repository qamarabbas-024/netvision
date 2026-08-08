import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Quiz } from './Quiz';
import { VisualRegistry } from '@/components/visuals/VisualRegistry';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Bookmark,
  Award,
  BookOpen,
  Sparkles,
  Terminal,
  Layers,
} from 'lucide-react';

export interface LessonViewerProps {
  lesson: {
    id: string;
    title: string;
    slug: string;
    type: string;
    durationMinutes: number;
    isCompleted?: boolean;
    score?: number | null;
    course: {
      id: string;
      title: string;
      slug: string;
      level: string;
    };
    module: {
      id: string;
      title: string;
    };
    content?: {
      shortExplanation?: string;
      theory?: string;
      analogy?: string;
      keyConcepts?: string[];
      examples?: string[];
      practicalActivity?: {
        title: string;
        instructions: string;
      };
    };
    quiz?: {
      id: string;
      title: string;
      passingScore?: number;
      questions: Array<{
        id: string;
        questionText: string;
        options: string[];
      }>;
    } | null;
  };
  onMarkComplete?: () => void;
  nextLessonSlug?: string;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson,
  onMarkComplete,
  nextLessonSlug,
}) => {
  const sections = ['theory', 'analogy', 'concepts', 'activity', 'quiz', 'summary'] as const;
  type SectionType = typeof sections[number];

  const [activeSection, setActiveSection] = useState<SectionType>('theory');
  const [completedSections, setCompletedSections] = useState<Set<string>>(
    new Set(lesson.isCompleted ? sections : ['theory'])
  );
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);

  const markSectionDone = (sec: SectionType) => {
    setCompletedSections((prev) => new Set(prev).add(sec));
  };

  const handleNextSection = () => {
    markSectionDone(activeSection);
    if (activeSection === 'theory') setActiveSection('analogy');
    else if (activeSection === 'analogy') setActiveSection('concepts');
    else if (activeSection === 'concepts') setActiveSection('activity');
    else if (activeSection === 'activity') setActiveSection('quiz');
    else if (activeSection === 'quiz') setActiveSection('summary');
  };

  const handlePrevSection = () => {
    if (activeSection === 'summary') setActiveSection('quiz');
    else if (activeSection === 'quiz') setActiveSection('activity');
    else if (activeSection === 'activity') setActiveSection('concepts');
    else if (activeSection === 'concepts') setActiveSection('analogy');
    else if (activeSection === 'analogy') setActiveSection('theory');
  };

  const handleQuizComplete = (score: number, passed: boolean) => {
    setQuizPassed(passed);
    markSectionDone('quiz');
    if (onMarkComplete) onMarkComplete();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Navigation Bar */}
      <header className="glass-panel border-b border-[#272732]/80 p-4 rounded-3xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href={`/courses/${lesson.course.slug}`}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-zinc-500">{lesson.course.title}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-[11px] font-mono text-[#00f0ff] uppercase">{lesson.course.level}</span>
            </div>
            <h1 className="text-base font-bold text-white tracking-tight">{lesson.title}</h1>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="hidden md:flex items-center gap-1.5 glass-panel p-1 rounded-2xl border border-[#272732]">
          {sections.map((sec, idx) => {
            const isDone = completedSections.has(sec);
            const isActive = activeSection === sec;
            return (
              <button
                key={sec}
                onClick={() => setActiveSection(sec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#00f0ff] text-black shadow-glow-cyan font-bold'
                    : isDone
                    ? 'text-emerald-400 hover:text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {isDone && !isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                {idx + 1}. {sec}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-[#00f0ff] transition-colors"
          title="Bookmark Lesson"
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? 'text-[#00f0ff] fill-[#00f0ff]' : ''}`} />
        </button>
      </header>

      {/* Main Section Content */}
      <main className="max-w-4xl mx-auto w-full">
        {/* SECTION 1: DETAILED THEORY */}
        {activeSection === 'theory' && (
          <Card className="p-8 glass-panel-glow border-[#00f0ff]/30 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <Badge variant="cyan">SECTION 1: DETAILED THEORY</Badge>
              <span className="text-xs font-mono text-zinc-500">{lesson.durationMinutes} min read</span>
            </div>

            <h2 className="text-2xl font-extrabold text-white">{lesson.title} Overview</h2>

            {lesson.content?.shortExplanation && (
              <Alert variant="info" title="Core Takeaway">
                {lesson.content.shortExplanation}
              </Alert>
            )}

            <div className="text-sm text-zinc-300 leading-relaxed space-y-4">
              <p>
                {lesson.content?.theory ||
                  `${lesson.title} is a critical topic in networking. Understanding how headers, addressing, and protocols function enables robust architecture.`}
              </p>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#272732]">
              <Button
                variant="cyan"
                size="lg"
                onClick={handleNextSection}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Next: Real-World Analogy
              </Button>
            </div>
          </Card>
        )}

        {/* SECTION 2: REAL-WORLD ANALOGY */}
        {activeSection === 'analogy' && (
          <Card className="p-8 glass-panel-glow border-[#00f0ff]/30 flex flex-col gap-6">
            <Badge variant="purple">SECTION 2: REAL-WORLD ANALOGY</Badge>
            <h2 className="text-2xl font-extrabold text-white">Mental Model & Intuition</h2>

            <div className="p-6 rounded-3xl bg-purple-500/10 border border-purple-500/30 flex items-start gap-4">
              <Sparkles className="w-8 h-8 text-purple-400 shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">Analogy Concept</h3>
                <p className="text-sm text-purple-200 leading-relaxed">
                  {lesson.content?.analogy ||
                    'Think of packet switching like an international mailing system: addresses ensure delivery while routing hubs transfer parcels.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#272732]">
              <Button variant="ghost" onClick={handlePrevSection} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Previous
              </Button>
              <Button variant="cyan" size="lg" onClick={handleNextSection} rightIcon={<ArrowRight className="w-5 h-5" />}>
                Next: Key Concepts
              </Button>
            </div>
          </Card>
        )}

        {/* SECTION 3: KEY CONCEPTS & EXAMPLES */}
        {activeSection === 'concepts' && (
          <Card className="p-8 glass-panel-glow border-[#00f0ff]/30 flex flex-col gap-6">
            <Badge variant="cyan">SECTION 3: KEY CONCEPTS & EXAMPLES</Badge>
            <h2 className="text-2xl font-extrabold text-white">Core Architectural Principles</h2>

            <div className="flex flex-col gap-3">
              {(lesson.content?.keyConcepts || [
                'Layer 3 IP Routing vs Layer 2 Switching.',
                'Encapsulation of headers down the stack.',
                'Reliability state machines and handshakes.'
              ]).map((concept, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00f0ff] shrink-0 mt-0.5" />
                  <span className="text-sm text-zinc-200 leading-snug">{concept}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#272732]">
              <Button variant="ghost" onClick={handlePrevSection} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Previous
              </Button>
              <Button variant="cyan" size="lg" onClick={handleNextSection} rightIcon={<ArrowRight className="w-5 h-5" />}>
                Next: Practical Activity
              </Button>
            </div>
          </Card>
        )}

        {/* SECTION 4: PRACTICAL ACTIVITY */}
        {activeSection === 'activity' && (
          <Card className="p-8 glass-panel-glow border-[#00f0ff]/30 flex flex-col gap-6">
            <Badge variant="amber">SECTION 4: PRACTICAL ACTIVITY</Badge>
            <h2 className="text-2xl font-extrabold text-white">
              {lesson.content?.practicalActivity?.title || 'Hands-On Packet Inspection'}
            </h2>

            {/* Interactive Visual Animation Component */}
            <VisualRegistry topicSlug={lesson.slug} />

            <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4">
              <Terminal className="w-8 h-8 text-amber-400 shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">Terminal Activity Instructions</h3>
                <p className="text-sm text-amber-200 leading-relaxed">
                  {lesson.content?.practicalActivity?.instructions ||
                    'Open your local terminal or command prompt and test network commands like ping or nslookup to inspect live packet headers.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#272732]">
              <Button variant="ghost" onClick={handlePrevSection} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Previous
              </Button>
              <Button variant="cyan" size="lg" onClick={handleNextSection} rightIcon={<ArrowRight className="w-5 h-5" />}>
                Next: Take Topic Quiz
              </Button>
            </div>
          </Card>
        )}

        {/* SECTION 5: REUSABLE QUIZ ENGINE */}
        {activeSection === 'quiz' && (
          <div className="flex flex-col gap-6">
            {lesson.quiz ? (
              <Quiz
                quiz={lesson.quiz}
                onComplete={handleQuizComplete}
                onContinueLesson={() => setActiveSection('summary')}
              />
            ) : (
              <Card className="p-8 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">No Quiz Required for this Lesson</h3>
                <p className="text-xs text-zinc-400">You can proceed directly to lesson completion summary.</p>
                <Button variant="cyan" onClick={() => setActiveSection('summary')}>
                  Proceed to Summary
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* SECTION 6: SUMMARY & LESSON COMPLETION */}
        {activeSection === 'summary' && (
          <Card className="p-8 glass-panel-glow border-[#00f0ff]/30 text-center flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-glow-emerald">
              <Award className="w-10 h-10" />
            </div>

            <div>
              <Badge variant="emerald" className="mb-2">LESSON COMPLETED</Badge>
              <h2 className="text-3xl font-extrabold text-white mb-2">Congratulations!</h2>
              <p className="text-sm text-zinc-400 max-w-md mx-auto">
                You have successfully mastered the concepts and passed the evaluation for{' '}
                <strong className="text-white">{lesson.title}</strong>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-[#272732] w-full justify-center">
              <Link href={`/courses/${lesson.course.slug}`}>
                <Button variant="secondary" leftIcon={<BookOpen className="w-4 h-4" />}>
                  Back to Course Syllabus
                </Button>
              </Link>

              {nextLessonSlug ? (
                <Link href={`/courses/${lesson.course.slug}/lessons/${nextLessonSlug}`}>
                  <Button variant="cyan" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Continue to Next Lesson
                  </Button>
                </Link>
              ) : (
                <Link href="/courses">
                  <Button variant="cyan" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Browse Course Catalog
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};
