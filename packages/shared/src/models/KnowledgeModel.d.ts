export type KnowledgeLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type KnowledgeLocale = 'en-US' | 'es-ES' | 'fr-FR' | 'de-DE' | 'zh-CN';
export type PedagogyStage = 'learn' | 'understand' | 'see' | 'interact' | 'practice' | 'breakfix' | 'quiz' | 'mastery';
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
        nodes: Array<{
            id: string;
            name: string;
            type: string;
            ip: string;
            mac: string;
            x: number;
            y: number;
        }>;
        links: Array<{
            id: string;
            source: string;
            target: string;
        }>;
    };
    expectedPacketSequence: string[];
}
export interface BreakFixScenarioData {
    id: string;
    title: string;
    symptom: string;
    topologySummary: string;
    faultyNodeId: string;
    faultType: 'INCORRECT_IP' | 'WRONG_SUBNET_MASK' | 'WRONG_GATEWAY' | 'PORT_SHUTDOWN' | 'CORRUPTED_ARP_CACHE' | 'FIREWALL_BLOCK';
    options: Array<{
        id: string;
        label: string;
        actionType: string;
        isCorrectFix: boolean;
        explanation: string;
    }>;
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
    version: string;
    locale: KnowledgeLocale;
    title: string;
    tagline: string;
    level: KnowledgeLevel;
    category: string;
    estimatedMinutes: number;
    prerequisites: string[];
    learningObjectives: string[];
    theoryBlocks: TheoryBlockData[];
    simulationScenarios: SimulationScenarioData[];
    breakFixScenarios?: BreakFixScenarioData[];
    quizQuestions: QuizQuestionData[];
    commonMistakes: string[];
    interviewQuestions: InterviewQuestionData[];
    glossaryTerms: Array<{
        term: string;
        definition: string;
    }>;
    tags: string[];
    relatedItemSlugs: string[];
    metadata: {
        author: string;
        createdAt: string;
        updatedAt: string;
        checksum: string;
    };
}
export declare class KnowledgeModelSerializer {
    static exportToJson(item: UniversalKnowledgeItem): string;
    static importFromJson(jsonString: string): UniversalKnowledgeItem;
}
