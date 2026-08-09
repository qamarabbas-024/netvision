// NetVision Curriculum Engine Types & Structured Lesson Schema

export type BlockType =
  | 'INTRODUCTION'
  | 'OBJECTIVES'
  | 'THEORY'
  | 'ANIMATION'
  | 'SIMULATION'
  | 'PRACTICE'
  | 'SANDBOX'
  | 'CHALLENGE'
  | 'QUIZ'
  | 'SUMMARY';

export interface BaseBlock {
  id: string;
  type: BlockType;
  title?: string;
}

export interface IntroductionBlock extends BaseBlock {
  type: 'INTRODUCTION';
  tagline: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedMinutes: number;
}

export interface ObjectivesBlock extends BaseBlock {
  type: 'OBJECTIVES';
  objectives: string[];
}

export interface TheoryBlock extends BaseBlock {
  type: 'THEORY';
  contentMarkdown: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  keyTakeaway?: string;
}

export interface AnimationBlock extends BaseBlock {
  type: 'ANIMATION';
  description: string;
  protocol: 'TCP' | 'UDP' | 'ARP' | 'DNS' | 'ICMP' | 'HTTP';
}

export interface SimulationBlock extends BaseBlock {
  type: 'SIMULATION';
  instruction: string;
  protocol: 'TCP' | 'UDP' | 'ARP' | 'DNS' | 'ICMP';
}

export interface QuizBlock extends BaseBlock {
  type: 'QUIZ';
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface SummaryBlock extends BaseBlock {
  type: 'SUMMARY';
  xpReward: number;
  nextLessonSlug?: string;
}

export type LessonBlock =
  | IntroductionBlock
  | ObjectivesBlock
  | TheoryBlock
  | AnimationBlock
  | SimulationBlock
  | QuizBlock
  | SummaryBlock;

export interface LessonSchema {
  id: string;
  slug: string;
  courseSlug: string;
  title: string;
  blocks: LessonBlock[];
}

// 16-Pillar Structured Lesson Engine Interfaces
export interface LessonObjectiveItem {
  id: string;
  text: string;
  order: number;
}

export interface LessonConceptItem {
  id: string;
  title: string;
  summary: string;
  explanation?: string | null;
  technicalDetails?: string | null;
  order: number;
}

export interface LessonExampleItem {
  id: string;
  title: string;
  scenario: string;
  explanation: string;
  order: number;
}

export interface LessonCommandItem {
  id: string;
  command: string;
  description: string;
  exampleOutput?: string | null;
  category?: string | null;
  order: number;
}

export interface LessonLabItem {
  id: string;
  type: 'GUIDED' | 'CHALLENGE';
  title: string;
  instructions: string;
  initialTopologyJson?: any;
  targetStateJson?: any;
  order: number;
}

export interface LessonMistakeItem {
  id: string;
  mistake: string;
  whyWrong: string;
  correctApproach: string;
  order: number;
}

export interface LessonRecapItem {
  id: string;
  point: string;
  order: number;
}

export interface StructuredLesson {
  id: string;
  title: string;
  slug: string;
  type: string;
  durationMinutes: number;
  order: number;
  content?: any;

  // 16 Structured Curriculum Engine Components
  introduction?: string | null;
  simpleExplanation?: string | null;
  analogy?: string | null;
  technicalExplanation?: string | null;
  cheatsheet?: any;
  visualizationType?: string | null;
  masteryScoreRequired?: number;

  objectives: LessonObjectiveItem[];
  concepts: LessonConceptItem[];
  examples: LessonExampleItem[];
  commands: LessonCommandItem[];
  labs: LessonLabItem[];
  mistakes: LessonMistakeItem[];
  recaps: LessonRecapItem[];

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
}
