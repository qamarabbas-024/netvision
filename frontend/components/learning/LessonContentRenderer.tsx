'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { VisualRegistry } from '@/components/visuals/VisualRegistry';
import {
  Sparkles,
  AlertTriangle,
  Terminal,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Shield,
  Layers,
  Info,
  Wrench,
  HelpCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export interface LessonContentRendererProps {
  lesson: {
    id: string;
    title: string;
    slug: string;
    type: string;
    durationMinutes: number;
    visualizationType?: string;
    course?: {
      id: string;
      title: string;
      slug: string;
      level: string;
    };
    content?: any;
    components?: Array<{ name: string; detail: string }>;
    howItWorks?: Array<{ stepNumber: number; title: string; action: string }>;
    troubleshooting?: Array<{
      symptom: string;
      possibleCauses: string[];
      diagnosticSteps: string[];
      remediation: string;
    }>;
    security?: {
      threatOrVulnerability: string;
      mitigationStrategy: string;
    };
    practice?: Array<{
      id?: number | string;
      prompt: string;
      expected: string;
      hints?: string;
    }>;
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
      title?: string;
      summary?: string;
      point?: string;
      keyTakeaways?: string[];
    }>;
  };
  onStartLab?: () => void;
  onProceedToQuiz?: () => void;
}

const PracticeCard: React.FC<{
  item: {
    id?: number | string;
    prompt?: string;
    question?: string;
    task?: string;
    expected?: string;
    answer?: string;
    solution?: string;
    hints?: string;
    hint?: string;
    explanation?: string;
  };
  index: number;
}> = ({ item, index }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const promptText =
    item.prompt ||
    item.question ||
    item.task ||
    (typeof item === 'string' ? (item as string) : `Practice Exercise ${index + 1}`);

  const expectedText = item.expected || item.answer || item.solution || '';
  const hintText = item.hints || item.hint || item.explanation || '';

  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="w-5 h-5 rounded-md bg-[#00f0ff]/10 text-[#00f0ff] font-mono font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
            P{index + 1}
          </span>
          <p className="text-xs sm:text-sm font-medium text-white leading-relaxed">{promptText}</p>
        </div>
        {(expectedText || hintText) && (
          <button
            type="button"
            aria-expanded={showAnswer}
            aria-label={`${showAnswer ? 'Hide' : 'Reveal'} solution for practice exercise P${index + 1}`}
            onClick={() => setShowAnswer(!showAnswer)}
            className="px-2.5 py-1 rounded-lg text-[11px] font-mono border border-[#272732] text-zinc-400 hover:text-white hover:border-[#00f0ff]/40 transition-all shrink-0 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00f0ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]"
          >
            {showAnswer ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
                Hide
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-[#00f0ff]" />
                Reveal
              </>
            )}
          </button>
        )}
      </div>

      {showAnswer && (expectedText || hintText) && (
        <div className="p-3.5 rounded-xl bg-[#0e0e13] border border-[#00f0ff]/30 text-xs space-y-1.5 animate-fadeIn">
          {expectedText && (
            <div className="flex items-start gap-2">
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 shrink-0 mt-0.5">
                Target Value:
              </span>
              <span className="font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded text-xs break-all">
                {expectedText}
              </span>
            </div>
          )}
          {hintText && (
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              <strong className="text-zinc-300">Analysis: </strong> {hintText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export const LessonContentRenderer: React.FC<LessonContentRendererProps> = ({
  lesson,
  onStartLab,
  onProceedToQuiz,
}) => {
  const content = lesson.content || {};

  // Normalize Objectives
  const objectivesList: string[] =
    lesson.objectives && lesson.objectives.length > 0
      ? lesson.objectives.map((o) => o.text)
      : content.objective
      ? [content.objective]
      : content.step1_objective
      ? [content.step1_objective]
      : content.keyConcepts || [];

  // Normalize Concepts / Anatomy
  const rawComponents =
    lesson.components ||
    content.components ||
    content.step5_technicalAnatomy?.components ||
    [];

  const conceptsList =
    lesson.concepts && lesson.concepts.length > 0
      ? lesson.concepts
      : rawComponents.length > 0
      ? rawComponents.map((c: any, idx: number) => ({
          id: `comp-${idx}`,
          title: c.name,
          summary: c.detail,
          explanation: c.detail,
        }))
      : content.explanation || content.step4_coreConcept || content.theory
      ? [
          {
            id: 'concept-core',
            title: 'Core Concept',
            summary: content.shortExplanation || 'Fundamental architectural principle.',
            explanation: content.explanation || content.step4_coreConcept || content.theory,
          },
        ]
      : [];

  // Normalize How It Works Steps
  const howItWorksSteps =
    lesson.howItWorks ||
    content.howItWorks ||
    content.step6_howItWorks?.steps ||
    [];

  // Normalize Examples
  const workedEx = content.workedExample || content.step9_workedExample;
  const examplesList =
    lesson.examples && lesson.examples.length > 0
      ? lesson.examples
      : workedEx
      ? [
          {
            id: 'worked-ex-1',
            title: workedEx.title || 'Worked Engineering Example',
            scenario: workedEx.problemStatement,
            explanation: Array.isArray(workedEx.stepByStepSolution)
              ? workedEx.stepByStepSolution.join('\n') + (workedEx.finalResult ? `\n\nResult: ${workedEx.finalResult}` : '')
              : workedEx.finalResult || '',
          },
        ]
      : (content.examples || []).map((ex: string, idx: number) => ({
          id: `legacy-ex-${idx}`,
          title: `Scenario Example ${idx + 1}`,
          scenario: ex,
          explanation: ex,
        }));

  // Normalize Commands, Troubleshooting, Security, Mistakes, Labs, Recaps
  const commandsList = lesson.commands || [];
  const troubleshootingList =
    lesson.troubleshooting ||
    content.troubleshooting ||
    content.step13_troubleshooting ||
    [];
  const securityItem =
    lesson.security ||
    content.security ||
    content.step15_securityPerspective ||
    null;
  const mistakesList =
    lesson.mistakes ||
    (content.commonMistakes || content.step14_commonMistakes || []).map((m: any, idx: number) => ({
      id: `mistake-${idx}`,
      mistake: m.misconception || m.mistake,
      whyWrong: m.whyWrong || 'Common misconception in networking.',
      correctApproach: m.correction || m.correctApproach,
    }));
  const labItem = lesson.labs && lesson.labs.length > 0 ? lesson.labs[0] : null;

  const practiceList =
    lesson.practice ||
    content.practice ||
    content.step16_guidedPractice?.exercises ||
    [];

  const rawRecap =
    content.recap?.summaryPoints ||
    (Array.isArray(content.recap) ? content.recap : null) ||
    content.step18_masterySummary?.summaryPoints ||
    [];
  const recapsList =
    lesson.recaps && lesson.recaps.length > 0
      ? lesson.recaps
      : rawRecap.length > 0
      ? rawRecap.map((pt: string, idx: number) => ({
          id: `recap-${idx}`,
          point: pt,
        }))
      : [];

  return (
    <div className="flex flex-col gap-6 text-[#f4f4f5] max-w-5xl mx-auto font-sans">
      {/* 1. LESSON TITLE & PURPOSE */}
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
          {lesson.title}
        </h1>

        {(content.shortExplanation || content.whyItMatters || content.step3_whyItMatters) && (
          <div className="p-3.5 rounded-xl bg-[#00f0ff]/5 border border-[#00f0ff]/20 text-xs sm:text-sm text-zinc-300 leading-relaxed flex items-start gap-3">
            <Info className="w-4 h-4 text-[#00f0ff] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-bold block mb-0.5">Why It Matters:</strong>
              {content.whyItMatters || content.step3_whyItMatters || content.shortExplanation}
            </div>
          </div>
        )}
      </div>

      {/* 2. LEARNING OBJECTIVES */}
      {objectivesList.length > 0 && (
        <Card className="p-4 sm:p-5 glass-panel border-[#272732] space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00f0ff]" />
            <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Learning Objectives
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {objectivesList.map((obj, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-start gap-2 text-xs text-zinc-300"
              >
                <span className="w-4 h-4 rounded bg-[#00f0ff]/10 text-[#00f0ff] font-mono font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-snug">{obj}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 3. INTUITIVE ANALOGY */}
      {content.analogy && (
        <Card className="p-4 sm:p-5 bg-purple-500/10 border border-purple-500/30 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-purple-400">
            <Sparkles className="w-4 h-4" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
              Intuitive Mental Model
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-purple-200 leading-relaxed italic">
            "{content.analogy}"
          </p>
        </Card>
      )}

      {/* 4. INTERACTIVE PROTOCOL VISUALIZER */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-sans">
            <Layers className="w-4 h-4 text-[#00f0ff]" />
            Interactive Visual Architecture
          </h2>
        </div>
        <VisualRegistry topicSlug={lesson.slug} />
      </div>

      {/* 5. CORE CONCEPTS BREAKDOWN */}
      {conceptsList.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-sans">
            Technical Architecture & Deep Concepts
          </h2>

          <div className="space-y-3">
            {conceptsList.map((concept: any, idx: number) => (
              <Card key={concept.id || idx} className="p-4 sm:p-5 glass-panel border-[#272732] space-y-2.5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 font-sans">
                  <span className="font-mono text-xs text-[#00f0ff] font-bold">
                    0{idx + 1}.
                  </span>
                  {concept.title}
                </h3>

                {concept.summary && concept.summary !== concept.explanation && (
                  <p className="text-xs font-semibold text-[#00f0ff] bg-[#00f0ff]/5 p-2.5 rounded-lg border border-[#00f0ff]/20">
                    {concept.summary}
                  </p>
                )}

                {concept.explanation && (
                  <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line font-sans">
                    {concept.explanation}
                  </div>
                )}

                {concept.technicalDetails && (
                  <div className="mt-2 p-3 rounded-lg bg-black/40 border border-zinc-800 text-[11px] font-mono text-zinc-400 space-y-1">
                    <span className="text-amber-400 font-bold block uppercase text-[10px]">
                      TECHNICAL SPECIFICATION
                    </span>
                    <p className="whitespace-pre-wrap">{concept.technicalDetails}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 6. HOW IT WORKS STEPS */}
      {howItWorksSteps.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-white tracking-tight font-sans">
            Step-by-Step Protocol Operation
          </h2>
          <div className="space-y-2">
            {howItWorksSteps.map((step: any) => (
              <div
                key={step.stepNumber}
                className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-lg bg-[#00f0ff]/20 text-[#00f0ff] font-mono font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  {step.stepNumber}
                </span>
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-bold text-white font-sans">{step.title}</h4>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">{step.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. WORKED ENGINEERING EXAMPLES */}
      {examplesList.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-white tracking-tight font-sans">
            Worked Engineering Scenarios & Solutions
          </h2>

          <div className="space-y-3">
            {examplesList.map((ex: any) => (
              <Card key={ex.id} className="p-4 sm:p-5 glass-panel border-[#272732] space-y-3">
                <h3 className="text-sm font-bold text-white font-sans">{ex.title || 'Worked Scenario'}</h3>
                {ex.scenario && (
                  <div className="p-3 rounded-lg bg-black/40 border border-zinc-800 text-xs text-zinc-300 font-sans">
                    <strong className="text-[#00f0ff] block mb-1 font-mono text-[10px] uppercase">
                      PROBLEM STATEMENT:
                    </strong>
                    <p className="whitespace-pre-line">{ex.scenario}</p>
                  </div>
                )}
                {ex.explanation && (
                  <div className="p-3 rounded-lg bg-[#00f0ff]/5 border border-[#00f0ff]/20 text-xs text-zinc-300 font-sans">
                    <strong className="text-[#00f0ff] block mb-1 font-mono text-[10px] uppercase">
                      SOLUTION ANALYSIS:
                    </strong>
                    <p className="whitespace-pre-line">{ex.explanation}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 8. CLI COMMAND SPECIFICATIONS */}
      {commandsList.length > 0 && (
        <div className="space-y-3">
          <div className="border-t border-[#272732] pt-4">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-sans">
              <Terminal className="w-4 h-4 text-[#00f0ff]" />
              CLI Diagnostic Commands & Output
            </h2>
          </div>

          <div className="space-y-3">
            {commandsList.map((cmd: any) => (
              <Card key={cmd.id} className="p-4 glass-panel border-[#272732] space-y-2">
                <p className="text-xs text-zinc-300 font-medium font-sans">{cmd.description}</p>
                <div className="p-2.5 rounded-lg bg-[#09090b] border border-[#272732] font-mono text-xs text-[#00f0ff]">
                  <code>{cmd.command}</code>
                </div>
                {cmd.exampleOutput && (
                  <pre className="p-3 rounded-lg bg-black border border-zinc-800 font-mono text-[11px] text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                    {cmd.exampleOutput}
                  </pre>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 9. TROUBLESHOOTING GUIDE */}
      {troubleshootingList.length > 0 && (
        <div className="space-y-3">
          <div className="border-t border-[#272732] pt-4">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-sans">
              <Wrench className="w-4 h-4 text-amber-400" />
              Real-World Diagnostics & Remediation
            </h2>
          </div>

          <div className="space-y-3">
            {troubleshootingList.map((item: any, idx: number) => (
              <Card key={idx} className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-2">
                <h3 className="text-xs sm:text-sm font-bold text-amber-300 font-sans">
                  Symptom: {item.symptom}
                </h3>
                {item.possibleCauses && item.possibleCauses.length > 0 && (
                  <div className="text-xs text-zinc-300 font-sans">
                    <strong className="text-zinc-400 block mb-0.5">Possible Causes:</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-zinc-400 text-[11px]">
                      {item.possibleCauses.map((c: string, i: number) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {item.remediation && (
                  <div className="p-2.5 rounded-lg bg-black/40 border border-amber-500/20 text-xs text-emerald-300 font-sans">
                    <strong className="text-amber-400 block mb-0.5 font-mono text-[10px]">REMEDIATION:</strong>
                    {item.remediation}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 10. COMMON MISTAKES */}
      {mistakesList.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <h2 className="text-base font-bold text-white tracking-tight font-sans">
              Common Mistakes to Avoid
            </h2>
          </div>

          <div className="space-y-2.5">
            {mistakesList.map((m: any) => (
              <Card key={m.id} className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-1.5">
                <h3 className="text-xs sm:text-sm font-bold text-amber-300 font-sans">Mistake: {m.mistake}</h3>
                <p className="text-xs text-zinc-300 font-sans">
                  <strong className="text-rose-400 font-mono">Why Wrong: </strong>
                  {m.whyWrong}
                </p>
                <p className="text-xs text-emerald-300 font-sans">
                  <strong className="text-emerald-400 font-mono">Correct Approach: </strong>
                  {m.correctApproach}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 11. SECURITY PERSPECTIVE */}
      {securityItem && (
        <Card className="p-4 sm:p-5 bg-rose-500/5 border border-rose-500/20 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-rose-400">
            <Shield className="w-4 h-4" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
              Security Considerations
            </h3>
          </div>
          <div className="space-y-1 text-xs text-zinc-300 font-sans">
            <p>
              <strong className="text-rose-300 font-semibold">Threat: </strong>
              {securityItem.threatOrVulnerability}
            </p>
            <p>
              <strong className="text-emerald-300 font-semibold">Mitigation: </strong>
              {securityItem.mitigationStrategy}
            </p>
          </div>
        </Card>
      )}

      {/* 12. GUIDED SELF-PACED PRACTICE */}
      {practiceList.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-sans">
              <HelpCircle className="w-4 h-4 text-[#00f0ff]" />
              Self-Paced Practice & Skill Check
            </h2>
            <span className="text-xs font-mono text-zinc-400">
              {practiceList.length} Questions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {practiceList.map((item: any, idx: number) => (
              <PracticeCard key={item.id || idx} item={item} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* 13. RECAP & KEY TAKEAWAYS */}
      {recapsList.length > 0 && (
        <Card className="p-5 glass-panel border-[#00f0ff]/30 rounded-xl space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2 font-sans">
            <BookOpen className="w-4 h-4 text-[#00f0ff]" />
            Lesson Recap & Key Takeaways
          </h2>
          <div className="space-y-1.5">
            {recapsList.map((r: any, idx: number) => (
              <div key={r.id || idx} className="flex items-start gap-2 text-xs text-zinc-300 font-sans">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00f0ff] shrink-0 mt-0.5" />
                <span>{r.point || r.summary || r.title}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 14. PRACTICAL LAB TRANSITION (ONLY IF LAB EXISTS) */}
      {labItem && (
        <Card className="p-6 glass-panel border-[#00f0ff]/40 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="cyan">PRACTICAL LAB</Badge>
            <span className="text-xs font-mono text-zinc-400">Interactive Terminal Lab</span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-1 font-sans">{labItem.title}</h2>
            <p className="text-xs text-zinc-300 font-sans">{labItem.instructions}</p>
          </div>

          <div className="flex items-center justify-end pt-3 border-t border-[#272732]">
            <Button
              variant="cyan"
              size="md"
              onClick={onStartLab}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Start Lab →
            </Button>
          </div>
        </Card>
      )}

      {/* PROCEED TO QUIZ BUTTON (When no lab is present) */}
      {!labItem && onProceedToQuiz && (
        <div className="flex justify-end pt-4 border-t border-[#272732]">
          <Button
            variant="cyan"
            size="md"
            onClick={onProceedToQuiz}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Proceed to Knowledge Check →
          </Button>
        </div>
      )}
    </div>
  );
};
