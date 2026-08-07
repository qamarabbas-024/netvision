'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Stepper } from '@/components/ui/Stepper';
import { LessonSchema, LessonBlock } from '@/types/learning';
import { IntroductionBlockComponent } from './blocks/IntroductionBlockComponent';
import { ObjectivesBlockComponent } from './blocks/ObjectivesBlockComponent';
import { TheoryBlockComponent } from './blocks/TheoryBlockComponent';
import { SimulationBlockComponent } from './blocks/SimulationBlockComponent';
import { QuizBlockComponent } from './blocks/QuizBlockComponent';
import { SummaryBlockComponent } from './blocks/SummaryBlockComponent';
import { ArrowLeft, ArrowRight, Bookmark } from 'lucide-react';

export interface LessonEngineContainerProps {
  lesson: LessonSchema;
}

export const LessonEngineContainer: React.FC<LessonEngineContainerProps> = ({ lesson }) => {
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const currentBlock: LessonBlock = lesson.blocks[currentBlockIndex];
  const totalBlocks = lesson.blocks.length;

  const stepperItems = lesson.blocks.map((b, idx) => ({
    id: b.id || `block-${idx}`,
    title: b.type,
  }));

  const renderBlock = (block: LessonBlock) => {
    switch (block.type) {
      case 'INTRODUCTION':
        return <IntroductionBlockComponent block={block} title={lesson.title} />;
      case 'OBJECTIVES':
        return <ObjectivesBlockComponent block={block} />;
      case 'THEORY':
        return <TheoryBlockComponent block={block} />;
      case 'SIMULATION':
      case 'ANIMATION':
        return <SimulationBlockComponent block={block} />;
      case 'QUIZ':
        return <QuizBlockComponent block={block} />;
      case 'SUMMARY':
        return <SummaryBlockComponent block={block} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col justify-between">
      {/* Lesson Navigation Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-[#272732]/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/courses/${lesson.courseSlug}`} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[11px] font-mono text-[#00f0ff] uppercase font-bold">
              {lesson.courseSlug.replace(/-/g, ' ')}
            </span>
            <h1 className="text-base font-bold text-white tracking-tight">{lesson.title}</h1>
          </div>
        </div>

        {/* Stepper Progress */}
        <div className="hidden lg:flex items-center gap-2 max-w-xl w-full">
          <Stepper
            steps={stepperItems}
            currentStepIndex={currentBlockIndex}
            onStepClick={(index) => setCurrentBlockIndex(index)}
          />
        </div>

        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-[#00f0ff] transition-colors"
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? 'text-[#00f0ff] fill-[#00f0ff]' : ''}`} />
        </button>
      </header>

      {/* Main Block Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 flex flex-col justify-center my-auto">
        {renderBlock(currentBlock)}
      </main>

      {/* Footer Navigation Bar */}
      <footer className="glass-panel border-t border-[#272732]/80 px-6 py-4 flex items-center justify-between">
        <Button
          variant="ghost"
          disabled={currentBlockIndex === 0}
          onClick={() => setCurrentBlockIndex((i) => i - 1)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Previous Block
        </Button>

        <span className="text-xs font-mono text-zinc-500">
          Block {currentBlockIndex + 1} of {totalBlocks}
        </span>

        <Button
          variant="cyan"
          disabled={currentBlockIndex === totalBlocks - 1}
          onClick={() => setCurrentBlockIndex((i) => i + 1)}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Next Block
        </Button>
      </footer>
    </div>
  );
};
