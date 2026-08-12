'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { VisualRegistry } from '@/components/visuals/VisualRegistry';
import {
  Sparkles,
  AlertTriangle,
  HelpCircle,
  Terminal,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Shield,
  Layers,
  Cpu,
  Info,
  ExternalLink,
} from 'lucide-react';

export interface LessonContentRendererProps {
  lesson: {
    id: string;
    title: string;
    slug: string;
    type: string;
    durationMinutes: number;
    course?: {
      id: string;
      title: string;
      slug: string;
      level: string;
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
    objectives?: Array<{ id: string; text: string }>;
    concepts?: Array<{
      id: string;
      title: string;
      summary?: string;
      explanation?: string;
      technicalDetails?: string;
    }>;
    examples?: Array<{
      id: string;
      title?: string;
      scenario?: string;
      explanation?: string;
    }>;
    commands?: Array<{
      id: string;
      command: string;
      description?: string;
      exampleOutput?: string;
      category?: string;
    }>;
    labs?: Array<{
      id: string;
      type: string;
      title: string;
      instructions: string;
    }>;
    mistakes?: Array<{
      id: string;
      mistake: string;
      whyWrong: string;
      correctApproach: string;
    }>;
    recaps?: Array<{
      id: string;
      title: string;
      summary: string;
      keyTakeaways?: string[];
    }>;
  };
  onStartLab?: () => void;
  onProceedToQuiz?: () => void;
}

export const LessonContentRenderer: React.FC<LessonContentRendererProps> = ({
  lesson,
  onStartLab,
  onProceedToQuiz,
}) => {
  // Check if 12D structured content exists, otherwise fall back to legacy fields gracefully
  const objectivesList =
    lesson.objectives && lesson.objectives.length > 0
      ? lesson.objectives.map((o) => o.text)
      : lesson.content?.keyConcepts || [];

  const conceptsList =
    lesson.concepts && lesson.concepts.length > 0
      ? lesson.concepts
      : lesson.content?.theory
      ? [
          {
            id: 'legacy-concept-1',
            title: 'Core Protocol Mechanism',
            summary: lesson.content.shortExplanation || 'Fundamental networking principle.',
            explanation: lesson.content.theory,
          },
        ]
      : [];

  const examplesList =
    lesson.examples && lesson.examples.length > 0
      ? lesson.examples
      : (lesson.content?.examples || []).map((ex, idx) => ({
          id: `legacy-ex-${idx}`,
          title: `Scenario Example ${idx + 1}`,
          scenario: ex,
          explanation: ex,
        }));

  const commandsList = lesson.commands || [];
  const mistakesList = lesson.mistakes || [];
  const recapsList = lesson.recaps || [];
  const labItem = lesson.labs && lesson.labs.length > 0 ? lesson.labs[0] : null;

  return (
    <div className="flex flex-col gap-8 text-[#f4f4f5]">
      {/* 1. LESSON OVERVIEW & HEADER */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge variant="cyan">THEORY & TECHNICAL BREAKDOWN</Badge>
          <span className="text-xs font-mono text-zinc-500">
            {lesson.durationMinutes || 15} Min Estimated Time
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {lesson.title}
        </h1>

        {lesson.content?.shortExplanation && (
          <div className="p-4 rounded-2xl bg-[#00f0ff]/5 border border-[#00f0ff]/20 text-sm text-[#00f0ff] font-medium leading-relaxed flex items-start gap-3">
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-white font-bold mb-0.5">Core Purpose:</strong>
              {lesson.content.shortExplanation}
            </div>
          </div>
        )}
      </div>

      {/* 2. LEARNING OBJECTIVES */}
      {objectivesList.length > 0 && (
        <Card className="p-6 glass-panel border-[#272732] space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#00f0ff]" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider text-xs font-mono">
              Learning Objectives
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {objectivesList.map((obj, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs text-zinc-300"
              >
                <span className="w-5 h-5 rounded-md bg-[#00f0ff]/10 text-[#00f0ff] font-mono font-bold flex items-center justify-center text-[10px] shrink-0">
                  {idx + 1}
                </span>
                <span className="leading-snug">{obj}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 3. ANALOGY & INTUITION (CARE-DRIVEN) */}
      {lesson.content?.analogy && (
        <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-3xl space-y-3">
          <div className="flex items-center gap-2 text-purple-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
              Intuitive Mental Model (Analogy)
            </h3>
          </div>
          <p className="text-sm text-purple-200 leading-relaxed italic">
            "{lesson.content.analogy}"
          </p>
          <p className="text-[11px] font-mono text-purple-400/80">
            Note: Analogies build initial intuition. Real protocol specifications immediately follow below.
          </p>
        </Card>
      )}

      {/* 4. VISUAL PROTOCOL ANIMATION / DIAGRAM */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#00f0ff]" />
            Technical Architecture & Protocol Flow
          </h2>
        </div>

        {/* VisualRegistry renders interactive visual if topic has one */}
        <VisualRegistry topicSlug={lesson.slug} />
      </div>

      {/* 5. DEEP TECHNICAL CONCEPTS & BREAKDOWN */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Protocol Breakdown & Deep Technical Explanation
        </h2>

        {conceptsList.map((concept, idx) => (
          <Card key={concept.id || idx} className="p-6 glass-panel border-[#272732] space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="font-mono text-xs text-[#00f0ff] font-bold">
                0{idx + 1}.
              </span>
              {concept.title}
            </h3>

            {concept.summary && (
              <p className="text-xs font-semibold text-[#00f0ff]/90 bg-[#00f0ff]/5 p-3 rounded-xl border border-[#00f0ff]/20">
                {concept.summary}
              </p>
            )}

            {concept.explanation && (
              <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line space-y-3">
                {concept.explanation}
              </div>
            )}

            {concept.technicalDetails && (
              <div className="mt-4 p-4 rounded-xl bg-black/40 border border-zinc-800 text-xs font-mono text-zinc-400 space-y-2">
                <span className="text-amber-400 font-bold block uppercase text-[10px]">
                  TECHNICAL SPECIFICATION & HEADER DETAILS
                </span>
                <p className="whitespace-pre-wrap">{concept.technicalDetails}</p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* 6. THEORY-FIRST COMMAND SPECIFICATIONS */}
      {commandsList.length > 0 && (
        <div className="space-y-6">
          <div className="border-t border-[#272732] pt-6">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#00f0ff]" />
              Command Execution & Output Analysis
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Theory-first rule: Always understand the problem and command purpose before observing syntax output.
            </p>
          </div>

          {commandsList.map((cmd) => (
            <Card key={cmd.id} className="p-6 glass-panel border-[#272732] space-y-4">
              {/* Problem / Purpose */}
              <div>
                <span className="text-[10px] font-mono font-bold text-[#00f0ff] uppercase tracking-wider block mb-1">
                  WHAT PROBLEM ARE WE SOLVING?
                </span>
                <p className="text-sm text-zinc-300">{cmd.description}</p>
              </div>

              {/* Command Syntax Block */}
              <div>
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  COMMAND SYNTAX
                </span>
                <div className="p-3.5 rounded-xl bg-[#09090b] border border-[#272732] font-mono text-xs text-[#00f0ff] flex items-center justify-between">
                  <code>{cmd.command}</code>
                  {cmd.category && (
                    <span className="text-[10px] text-zinc-500 uppercase px-2 py-0.5 rounded bg-zinc-800">
                      {cmd.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Example Output & What to Look For */}
              {cmd.exampleOutput && (
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
                    WHAT TO LOOK FOR IN OUTPUT
                  </span>
                  <pre className="p-4 rounded-xl bg-black border border-zinc-800 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                    {cmd.exampleOutput}
                  </pre>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* 7. SCENARIO EXAMPLES */}
      {examplesList.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Real-World Technical Scenarios
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examplesList.map((ex) => (
              <Card key={ex.id} className="p-5 glass-panel border-[#272732] space-y-3">
                <h3 className="text-sm font-bold text-white">{ex.title || 'Scenario'}</h3>
                {ex.scenario && (
                  <p className="text-xs text-zinc-400 leading-relaxed">{ex.scenario}</p>
                )}
                {ex.explanation && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300">
                    <strong className="text-[#00f0ff] block mb-1 font-mono text-[10px]">
                      ANALYSIS & RESOLUTION:
                    </strong>
                    {ex.explanation}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 8. COMMON MISTAKES */}
      {mistakesList.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Common Technical Mistakes to Avoid
            </h2>
          </div>

          <div className="space-y-3">
            {mistakesList.map((m) => (
              <Card
                key={m.id}
                className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-2"
              >
                <h3 className="text-sm font-bold text-amber-300">
                  Mistake: {m.mistake}
                </h3>
                <p className="text-xs text-zinc-300">
                  <strong className="text-rose-400 font-mono">Why Wrong: </strong>
                  {m.whyWrong}
                </p>
                <p className="text-xs text-emerald-300">
                  <strong className="text-emerald-400 font-mono">Correct Approach: </strong>
                  {m.correctApproach}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 9. RECAP & KEY TAKEAWAYS */}
      {recapsList.length > 0 && (
        <Card className="p-6 glass-panel border-[#00f0ff]/30 rounded-3xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#00f0ff]" />
            Lesson Recap & Key Takeaways
          </h2>

          {recapsList.map((r) => (
            <div key={r.id} className="space-y-3">
              <h3 className="text-sm font-bold text-[#00f0ff]">{r.title}</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">{r.summary}</p>
              {r.keyTakeaways && (
                <ul className="space-y-1.5 list-disc list-inside text-xs text-zinc-400">
                  {r.keyTakeaways.map((kt, i) => (
                    <li key={i}>{kt}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Card>
      )}

      {/* 10. PRACTICAL LAB TRANSITION CARD */}
      {labItem && (
        <Card className="p-8 glass-panel-glow border-[#00f0ff]/40 rounded-3xl space-y-6 bg-gradient-to-b from-[#00f0ff]/5 to-transparent">
          <div className="flex items-center justify-between">
            <Badge variant="cyan">PRACTICAL LAB</Badge>
            <span className="text-xs font-mono text-zinc-400">Hands-On Practice</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{labItem.title}</h2>
            <p className="text-xs text-zinc-400 max-w-xl">{labItem.instructions}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
              <span className="font-mono text-[10px] text-zinc-500 uppercase block mb-1">
                ENVIRONMENT
              </span>
              <span className="text-white font-semibold">Simulated CLI & Topology</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
              <span className="font-mono text-[10px] text-zinc-500 uppercase block mb-1">
                OBJECTIVE
              </span>
              <span className="text-white font-semibold">Execute & Validate Commands</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
              <span className="font-mono text-[10px] text-zinc-500 uppercase block mb-1">
                EXPECTED RESULT
              </span>
              <span className="text-white font-semibold">Clean Diagnostic Verification</span>
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-[#272732]">
            <Button
              variant="cyan"
              size="lg"
              onClick={onStartLab}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Start Lab →
            </Button>
          </div>
        </Card>
      )}

      {/* PROCEED TO KNOWLEDGE CHECK BUTTON IF NO LAB */}
      {!labItem && onProceedToQuiz && (
        <div className="flex justify-end pt-4 border-t border-[#272732]">
          <Button
            variant="cyan"
            size="lg"
            onClick={onProceedToQuiz}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Proceed to Knowledge Check →
          </Button>
        </div>
      )}
    </div>
  );
};
