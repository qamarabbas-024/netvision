// NetVision Block-Based Learning Engine Types & JSON Schema

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
