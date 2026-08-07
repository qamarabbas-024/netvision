# NetVision Universal Networking Knowledge Model Specification

> **Schema Status**: APPROVED (MILESTONE 4)  
> **Package**: `@netvision/shared`  
> **Schema File**: `packages/shared/src/models/KnowledgeModel.ts`

---

## 🎯 Architectural Intent

In NetVision, **zero lessons or courses are hardcoded**. Every networking concept (from "What is an IP?" to "BGP Route Reflection & Multi-Area OSPF") is represented as a structured, versioned, multilingual JSON payload satisfying the `UniversalKnowledgeItem` interface.

---

## 📐 Data Model Schema Breakdown

```typescript
export interface UniversalKnowledgeItem {
  id: string;                      // Unique ID (e.g., "know-tcp-handshake")
  slug: string;                    // URL Slug (e.g., "tcp-3-way-handshake")
  version: string;                 // SemVer (e.g., "1.0.0")
  locale: KnowledgeLocale;         // Localization ("en-US", "es-ES", "fr-FR", etc.)
  title: string;                   // Display Title
  tagline: string;                 // Bite-sized summary
  level: KnowledgeLevel;           // "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  category: string;                // Category ("TCP/IP Suite", "Routing", "Security")
  estimatedMinutes: number;        // Time commitment
  prerequisites: string[];         // Slugs of prerequisite lessons
  learningObjectives: string[];   // Bulleted goals
  theoryBlocks: TheoryBlockData[]; // Rich text, code snippets, analogies
  simulationScenarios: SimulationScenarioData[]; // Interactive canvas topologies & packet expectations
  quizQuestions: QuizQuestionData[]; // Mastery questions with points & explanations
  commonMistakes: string[];       // Top beginner/engineer mistakes
  interviewQuestions: InterviewQuestionData[]; // Top technical interview questions
  glossaryTerms: Array<{ term: string; definition: string }>;
  tags: string[];
  relatedItemSlugs: string[];
  metadata: {
    author: string;
    createdAt: string;
    updatedAt: string;
    checksum: string;              // SHA-256 integrity hash
  };
}
```

---

## ⚡ Multilingual, Versioning & AI Generation Ready

1. **Multilingual Localization**:
   The `locale` field supports serving lessons in English (`en-US`), Spanish (`es-ES`), French (`fr-FR`), German (`de-DE`), and Chinese (`zh-CN`).
2. **Versioning & Updates**:
   SemVer (`version: "1.2.0"`) allows pushing non-breaking updates or new interactive blocks to existing lessons without breaking student progress tracking.
3. **AI Generation Compatibility**:
   LLMs can generate structured JSON payloads matching `KnowledgeModelSerializer` to instantly synthesize new interactive lessons on emerging networking protocols.
