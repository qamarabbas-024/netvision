# Curriculum Content Architecture V2

## Overview & Pedagogical Philosophy

NetVision Curriculum Content Architecture V2 replaces the rigid, one-size-fits-all 18-step lesson template with a flexible, **topic-driven, relevance-first content model**.

Under the V2 architecture:
- **A lesson is complete** when it teaches its intended concept correctly, clearly, at the right depth, with enough practice to demonstrate mastery.
- **Modality is purpose-driven:** Visualizers, CLI tooling, packet/header views, troubleshooting guides, security perspectives, and simulated labs are included **only when they directly enhance comprehension** of that specific topic.
- **Zero phantom containers:** The frontend renderer only mounts populated sections. No empty cards, visual gaps, or placeholder commands are ever rendered.

---

## Content Model V2 Specification

### TypeScript Interface (`LessonContentV2`)

Defined in `backend/src/topics/lesson-content.interface.ts`:

```typescript
export interface LessonContentV2 {
  // --- Core Lesson Metadata (Always Populated) ---
  objective: string;
  prerequisites?: string[];
  whyItMatters?: string;
  analogy?: string;

  // --- Core Pedagogical Content (Always Populated) ---
  explanation: string;
  recap: string[] | { summaryPoints: string[]; nextLessonBridge?: string };

  // --- Optional Topic-Driven Components (Attached Only When Relevant) ---
  components?: Array<{
    name: string;
    detail: string;
  }>;

  howItWorks?: Array<{
    stepNumber: number;
    title: string;
    action: string;
  }>;

  visualizer?: {
    type: string;
    title: string;
    description: string;
  };

  workedExample?: {
    title: string;
    problemStatement: string;
    stepByStepSolution: string[];
    finalResult?: string;
  };

  cliTooling?: Array<{
    command: string;
    description: string;
    expectedOutput?: string;
    proofExplanation?: string;
  }>;

  troubleshooting?: Array<{
    symptom: string;
    possibleCauses: string[];
    diagnosticSteps?: string[];
    remediation: string;
  }>;

  commonMistakes?: Array<{
    misconception: string;
    correction: string;
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
}
```

---

## Backward Compatibility & Normalization Layer

To ensure existing lessons continue working without destructive database migrations:

1. **Storage:** In PostgreSQL / Prisma, `Lesson.contentJson` stores either `LessonContentV2` or legacy `LessonStepMetadata`.
2. **Unified API Normalizer (`TopicsService.getLessonBySlug`):**
   - Automatically detects whether a lesson is formatted in V2 (`contentV2` / `objective`) or V1 (`stepMetadata` / `step1_objective`).
   - Maps both schemas into a unified normalized JSON response.
   - Eliminates synthetic fallback boilerplate (absent commands or mistakes return clean empty arrays `[]` rather than phantom `ping 192.168.1.1` data).
3. **Database Seeder (`backend/prisma/seed.ts`):**
   - Seeds `contentJson` using `contentV2` or `stepMetadata`.
   - Mounts `lab` only when a practical lab is defined on the lesson.

---

## Frontend Rendering Architecture

`frontend/components/learning/LessonContentRenderer.tsx` dynamically evaluates populated properties:

1. **Header & Context:** Displays lesson title, duration, level badge, and "Why It Matters" banner.
2. **Learning Objectives:** Rendered only if `objectivesList.length > 0`.
3. **Mental Model:** Rendered only if `content.analogy` is provided.
4. **Interactive Protocol Visualizer:** Rendered via `VisualRegistry` based on the lesson's unique visualizer type or slug.
5. **Technical Breakdown:** Renders technical components and detailed explanations.
6. **Protocol Workflow:** Renders step-by-step sequences if `howItWorks` is populated.
7. **Worked Engineering Scenarios:** Renders problem statement and step-by-step resolution.
8. **CLI Tooling:** Rendered **only if** `commandsList.length > 0`.
9. **Troubleshooting Scenarios:** Rendered **only if** troubleshooting data exists.
10. **Common Mistakes:** Rendered **only if** common mistakes are populated.
11. **Security Perspective:** Rendered **only if** security threat and mitigation are defined.
12. **Recap & Key Takeaways:** Clean bulleted summary of essential concepts.
13. **Practical Lab Card:** Rendered **only if** a hands-on lab is defined on the lesson. If no lab exists, a "Proceed to Knowledge Check" button is rendered cleanly.

---

## Representative Benchmark Implementations

| Lesson | Code | Modalities Included | Modalities Omitted |
|---|---|---|---|
| **Bits, Bytes, Binary & Hex** | NET-101 | Explanation, Positional weights, Conversions, `BINARY_CONVERTER`, Practice calculations | CLI commands, Packet headers, Security note, Lab |
| **IPv6 Foundations & SLAAC** | NET-203 | 128-bit architecture, RFC 5952 compression, Scopes (GUA/LLA/ULA), `IPV6_COMPRESSOR_ENGINE`, SLAAC RS/RA workflow | CLI commands, Packet capture, Unrelated routing |
| **Multi-Area OSPF & Redistribution** | NET-304 | Hierarchy, ABR/ASBR roles, LSA Types 1-5, `MULTI_AREA_OSPF_ENGINE`, Redistribution E1 vs E2, Hands-on Lab | Unrelated switching commands, Generic templates |
| **Network Automation Foundations** | NET-403 | Idempotency, Imperative vs Declarative, REST APIs, JSON structures, `NETWORK_AUTOMATION_PIPELINE`, Simulated API Lab | Mega-lesson bloat, Unrelated CLI tools |

---

## Content Verification

The content architecture is validated via automated tests:

```bash
# Verify Curriculum Content Architecture V2
pnpm --filter netvision-backend test:curriculum:content-v2

# Verify topic suites
pnpm --filter netvision-backend test:ipv6
pnpm --filter netvision-backend test:ospf:multi-area
pnpm --filter netvision-backend test:network-automation
pnpm --filter netvision-backend test:all
```
