'use client';

import React from 'react';
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
    <div className="flex flex-col gap-8 text-[#f4f4f5] max-w-5xl mx-auto">
      {/* 1. LESSON HEADER & METADATA */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="cyan">CURRICULUM TOPIC</Badge>
          <span className="text-xs font-mono text-zinc-400">
            {lesson.durationMinutes || 15} Min Estimated Time
          </span>
          {lesson.course?.level && (
            <Badge variant="purple">{lesson.course.level}</Badge>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {lesson.title}
        </h1>

        {(content.shortExplanation || content.whyItMatters || content.step3_whyItMatters) && (
          <div className="p-4 rounded-2xl bg-[#00f0ff]/5 border border-[#00f0ff]/20 text-sm text-zinc-300 leading-relaxed flex items-start gap-3">
            <Info className="w-5 h-5 text-[#00f0ff] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-bold block mb-1">Why It Matters:</strong>
              {content.whyItMatters || content.step3_whyItMatters || content.shortExplanation}
            </div>
          </div>
        )}
      </div>

      {/* 2. LEARNING OBJECTIVES (Rendered only when defined) */}
      {objectivesList.length > 0 && (
        <Card className="p-6 glass-panel border-[#272732] space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#00f0ff]" />
            <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
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

      {/* 3. INTUITIVE ANALOGY (Rendered only if defined) */}
      {content.analogy && (
        <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-3xl space-y-3">
          <div className="flex items-center gap-2 text-purple-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
              Intuitive Mental Model
            </h3>
          </div>
          <p className="text-sm text-purple-200 leading-relaxed italic">
            "{content.analogy}"
          </p>
        </Card>
      )}

      {/* 4. INTERACTIVE VISUALIZER (Rendered cleanly via VisualRegistry) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#00f0ff]" />
            Interactive Protocol Architecture & Visual Flow
          </h2>
        </div>
        <VisualRegistry topicSlug={lesson.slug} />
      </div>

      {/* 5. CORE EXPLANATION & CONCEPTS BREAKDOWN */}
      {conceptsList.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Technical Architecture & Deep Concepts
          </h2>

          <div className="space-y-4">
            {conceptsList.map((concept: any, idx: number) => (
              <Card key={concept.id || idx} className="p-6 glass-panel border-[#272732] space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="font-mono text-xs text-[#00f0ff] font-bold">
                    0{idx + 1}.
                  </span>
                  {concept.title}
                </h3>

                {concept.summary && concept.summary !== concept.explanation && (
                  <p className="text-xs font-semibold text-[#00f0ff]/90 bg-[#00f0ff]/5 p-3 rounded-xl border border-[#00f0ff]/20">
                    {concept.summary}
                  </p>
                )}

                {concept.explanation && (
                  <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                    {concept.explanation}
                  </div>
                )}

                {concept.technicalDetails && (
                  <div className="mt-3 p-4 rounded-xl bg-black/40 border border-zinc-800 text-xs font-mono text-zinc-400 space-y-1">
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

      {/* 6. HOW IT WORKS / PROCESS STEPS (Rendered only when defined) */}
      {howItWorksSteps.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Step-by-Step Protocol Operation
          </h2>
          <div className="space-y-3">
            {howItWorksSteps.map((step: any) => (
              <div
                key={step.stepNumber}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4"
              >
                <span className="w-8 h-8 rounded-xl bg-[#00f0ff]/20 text-[#00f0ff] font-mono font-bold flex items-center justify-center text-sm shrink-0">
                  {step.stepNumber}
                </span>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">{step.title}</h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">{step.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. WORKED ENGINEERING EXAMPLES (Rendered only when defined) */}
      {examplesList.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Worked Engineering Scenarios & Solutions
          </h2>

          <div className="space-y-4">
            {examplesList.map((ex: any) => (
              <Card key={ex.id} className="p-6 glass-panel border-[#272732] space-y-4">
                <h3 className="text-base font-bold text-white">{ex.title || 'Worked Scenario'}</h3>
                {ex.scenario && (
                  <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 text-xs text-zinc-300">
                    <strong className="text-[#00f0ff] block mb-1 font-mono text-[10px] uppercase">
                      PROBLEM STATEMENT:
                    </strong>
                    <p className="whitespace-pre-line">{ex.scenario}</p>
                  </div>
                )}
                {ex.explanation && (
                  <div className="p-4 rounded-xl bg-[#00f0ff]/5 border border-[#00f0ff]/20 text-xs text-zinc-300">
                    <strong className="text-[#00f0ff] block mb-1 font-mono text-[10px] uppercase">
                      STEP-BY-STEP ANALYSIS & RESOLUTION:
                    </strong>
                    <p className="whitespace-pre-line">{ex.explanation}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 8. CLI COMMAND SPECIFICATIONS (Rendered ONLY when commands exist) */}
      {commandsList.length > 0 && (
        <div className="space-y-4">
          <div className="border-t border-[#272732] pt-6">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#00f0ff]" />
              Relevant CLI Commands & Diagnostic Output
            </h2>
          </div>

          <div className="space-y-4">
            {commandsList.map((cmd: any) => (
              <Card key={cmd.id} className="p-6 glass-panel border-[#272732] space-y-3">
                <p className="text-xs text-zinc-300 font-medium">{cmd.description}</p>
                <div className="p-3.5 rounded-xl bg-[#09090b] border border-[#272732] font-mono text-xs text-[#00f0ff]">
                  <code>{cmd.command}</code>
                </div>
                {cmd.exampleOutput && (
                  <pre className="p-4 rounded-xl bg-black border border-zinc-800 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                    {cmd.exampleOutput}
                  </pre>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 9. TROUBLESHOOTING GUIDE (Rendered ONLY when defined) */}
      {troubleshootingList.length > 0 && (
        <div className="space-y-4">
          <div className="border-t border-[#272732] pt-6">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-400" />
              Real-World Troubleshooting & Diagnostics
            </h2>
          </div>

          <div className="space-y-3">
            {troubleshootingList.map((item: any, idx: number) => (
              <Card key={idx} className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-amber-300">
                  Symptom: {item.symptom}
                </h3>
                {item.possibleCauses && item.possibleCauses.length > 0 && (
                  <div className="text-xs text-zinc-300">
                    <strong className="text-zinc-400 block mb-1">Possible Causes:</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-zinc-400">
                      {item.possibleCauses.map((c: string, i: number) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {item.remediation && (
                  <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 text-xs text-emerald-300">
                    <strong className="text-amber-400 block mb-0.5">Remediation:</strong>
                    {item.remediation}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 10. COMMON MISTAKES (Rendered ONLY when defined) */}
      {mistakesList.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Common Technical Mistakes to Avoid
            </h2>
          </div>

          <div className="space-y-3">
            {mistakesList.map((m: any) => (
              <Card key={m.id} className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-2">
                <h3 className="text-sm font-bold text-amber-300">Mistake: {m.mistake}</h3>
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

      {/* 11. SECURITY PERSPECTIVE (Rendered ONLY when defined) */}
      {securityItem && (
        <Card className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-rose-400">
            <Shield className="w-5 h-5" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
              Security Considerations
            </h3>
          </div>
          <div className="space-y-2 text-xs text-zinc-300">
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

      {/* 12. RECAP & KEY TAKEAWAYS (Rendered only when defined) */}
      {recapsList.length > 0 && (
        <Card className="p-6 glass-panel border-[#00f0ff]/30 rounded-3xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#00f0ff]" />
            Lesson Recap & Key Takeaways
          </h2>
          <div className="space-y-2">
            {recapsList.map((r: any, idx: number) => (
              <div key={r.id || idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-[#00f0ff] shrink-0 mt-0.5" />
                <span>{r.point || r.summary || r.title}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 13. PRACTICAL LAB TRANSITION (Rendered ONLY when a lab exists) */}
      {labItem && (
        <Card className="p-8 glass-panel-glow border-[#00f0ff]/40 rounded-3xl space-y-6 bg-gradient-to-b from-[#00f0ff]/5 to-transparent">
          <div className="flex items-center justify-between">
            <Badge variant="cyan">PRACTICAL LAB</Badge>
            <span className="text-xs font-mono text-zinc-400">Simulated Practice</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{labItem.title}</h2>
            <p className="text-xs text-zinc-400 max-w-xl">{labItem.instructions}</p>
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

      {/* PROCEED TO QUIZ BUTTON (When no lab is present) */}
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
