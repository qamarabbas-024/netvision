// NetVision Universal Networking Knowledge Model Schema

export type KnowledgeLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type KnowledgeLocale = 'en-US' | 'es-ES' | 'fr-FR' | 'de-DE' | 'zh-CN';

export interface TheoryBlockData {
  id: string;
  title: string;
  markdownContent: string;
  analogy?: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  diagramUrl?: string;
  keyTakeaway?: string;
}

export interface SimulationScenarioData {
  id: string;
  title: string;
  description: string;
  protocol: string;
  initialTopology: {
    nodes: Array<{ id: string; name: string; type: string; ip: string; mac: string; x: number; y: number }>;
    links: Array<{ id: string; source: string; target: string }>;
  };
  expectedPacketSequence: string[];
}

export interface QuizQuestionData {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  points: number;
}

export interface InterviewQuestionData {
  question: string;
  modelAnswer: string;
  difficulty: KnowledgeLevel;
}

export interface UniversalKnowledgeItem {
  id: string;
  slug: string;
  version: string; // e.g. "1.0.0"
  locale: KnowledgeLocale;
  title: string;
  tagline: string;
  level: KnowledgeLevel;
  category: string; // e.g. "TCP/IP Suite", "Cybersecurity", "Routing"
  estimatedMinutes: number;
  prerequisites: string[]; // Slugs of prerequisite items
  learningObjectives: string[];
  theoryBlocks: TheoryBlockData[];
  simulationScenarios: SimulationScenarioData[];
  quizQuestions: QuizQuestionData[];
  commonMistakes: string[];
  interviewQuestions: InterviewQuestionData[];
  glossaryTerms: Array<{ term: string; definition: string }>;
  tags: string[];
  relatedItemSlugs: string[];

  metadata: {
    author: string;
    createdAt: string;
    updatedAt: string;
    checksum: string;
  };
}

export class KnowledgeModelSerializer {
  public static exportToJson(item: UniversalKnowledgeItem): string {
    return JSON.stringify(item, null, 2);
  }

  public static importFromJson(jsonString: string): UniversalKnowledgeItem {
    const parsed = JSON.parse(jsonString);
    if (!parsed.id || !parsed.slug || !parsed.theoryBlocks) {
      throw new Error('Invalid UniversalKnowledgeItem JSON schema structure');
    }
    return parsed as UniversalKnowledgeItem;
  }
}
