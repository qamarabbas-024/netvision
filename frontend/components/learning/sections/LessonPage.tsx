'use client';

import React from 'react';
import { StructuredLesson } from '@/types/learning';
import { LessonHeader } from './LessonHeader';
import { LearningObjectives } from './LearningObjectives';
import { LessonIntroduction } from './LessonIntroduction';
import { ConceptSection } from './ConceptSection';
import { RealWorldExample } from './RealWorldExample';
import { Visualization } from './Visualization';
import { CommandPanel } from './CommandPanel';
import { Cheatsheet } from './Cheatsheet';
import { PracticalLab } from './PracticalLab';
import { CommonMistakes } from './CommonMistakes';
import { LessonRecap } from './LessonRecap';
import { LessonQuiz } from './LessonQuiz';

export interface LessonPageProps {
  lesson: StructuredLesson;
  onMarkComplete?: () => void;
  nextLessonSlug?: string;
}

export const LessonPage: React.FC<LessonPageProps> = ({
  lesson,
  onMarkComplete,
  nextLessonSlug: _nextLessonSlug,
}) => {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-12">
      {/* 1. Header Component */}
      <LessonHeader
        courseTitle={lesson.course.title}
        courseSlug={lesson.course.slug}
        courseLevel={lesson.course.level}
        moduleTitle={lesson.module.title}
        lessonTitle={lesson.title}
        durationMinutes={lesson.durationMinutes}
        isBookmarked={false}
      />

      {/* 2. Objectives */}
      <LearningObjectives objectives={lesson.objectives} />

      {/* 3. Introduction & Simple Explanation */}
      <LessonIntroduction
        introduction={lesson.introduction}
        simpleExplanation={lesson.simpleExplanation}
      />

      {/* 4. Concepts & Technical Breakdown */}
      <ConceptSection
        concepts={lesson.concepts}
        technicalExplanation={lesson.technicalExplanation}
      />

      {/* 5. Real World Analogy & Examples */}
      <RealWorldExample
        analogy={lesson.analogy}
        examples={lesson.examples}
      />

      {/* 6. Protocol Visualization & Interactive Controls */}
      <Visualization
        topicSlug={lesson.slug}
        visualizationType={lesson.visualizationType}
      />

      {/* 7. Command Reference Panel */}
      <CommandPanel commands={lesson.commands} />

      {/* 8. Quick Cheatsheet */}
      <Cheatsheet cheatsheet={lesson.cheatsheet} />

      {/* 9. Practical Lab (Guided & Challenge) */}
      <PracticalLab topicSlug={lesson.slug} labs={lesson.labs} />

      {/* 10. Common Mistakes & Pitfalls */}
      <CommonMistakes mistakes={lesson.mistakes} />

      {/* 11. Quick Recap */}
      <LessonRecap recaps={lesson.recaps} />

      {/* 12. Assessment Quiz */}
      <LessonQuiz
        quiz={lesson.quiz}
        onComplete={(score, passed) => {
          if (passed && onMarkComplete) onMarkComplete();
        }}
      />
    </div>
  );
};
