import {
  CapstoneAssessmentDefinition,
  PublicCapstoneAssessment,
} from './capstone-assessment.types';
import { CAPSTONE_V1_ASSESSMENT } from './capstone-v1.content';

export const LATEST_CAPSTONE_VERSION = 1;

const ASSESSMENTS: Record<number, CapstoneAssessmentDefinition> = {
  1: CAPSTONE_V1_ASSESSMENT,
};

/**
 * Returns the authoritative assessment definition for a given version.
 * Contains answer keys, correct rubrics, and scoring points (PRIVATE).
 */
export function getAuthoritativeAssessment(version: number = LATEST_CAPSTONE_VERSION): CapstoneAssessmentDefinition {
  const assessment = ASSESSMENTS[version];
  if (!assessment) {
    throw new Error(`Authoritative Capstone assessment version ${version} not found.`);
  }
  return assessment;
}

/**
 * Returns a public-safe projection of the assessment for candidate rendering.
 * Strips out:
 * - correctOption
 * - correctAnswer
 * - explanation
 * - internal grading rubrics
 */
export function getPublicAssessment(version: number = LATEST_CAPSTONE_VERSION): PublicCapstoneAssessment {
  const auth = getAuthoritativeAssessment(version);

  return {
    version: auth.version,
    examCode: auth.examCode,
    certificationCode: auth.certificationCode,
    title: auth.title,
    durationSeconds: auth.durationSeconds,
    scoringWeights: auth.scoringWeights,
    theorySection: {
      title: auth.theorySection.title,
      description: auth.theorySection.description,
      questions: auth.theorySection.questions.map((q) => ({
        id: q.id,
        category: q.category,
        prompt: q.prompt,
        options: q.options,
        points: q.points,
      })),
    },
    incidentSection: {
      title: auth.incidentSection.title,
      description: auth.incidentSection.description,
      scenario: {
        scenarioCode: auth.incidentSection.scenario.scenarioCode,
        title: auth.incidentSection.scenario.title,
        description: auth.incidentSection.scenario.description,
        topologySummary: auth.incidentSection.scenario.topologySummary,
        syslogSnippet: auth.incidentSection.scenario.syslogSnippet,
        interfaceConfigs: auth.incidentSection.scenario.interfaceConfigs,
        tasks: auth.incidentSection.scenario.tasks.map((t) => ({
          taskId: t.taskId,
          title: t.title,
          prompt: t.prompt,
          type: t.type,
          options: t.options,
          points: t.points,
        })),
      },
    },
    forensicsSection: {
      title: auth.forensicsSection.title,
      description: auth.forensicsSection.description,
      scenario: {
        scenarioCode: auth.forensicsSection.scenario.scenarioCode,
        title: auth.forensicsSection.scenario.title,
        description: auth.forensicsSection.scenario.description,
        frames: auth.forensicsSection.scenario.frames,
        questions: auth.forensicsSection.scenario.questions.map((q) => ({
          id: q.id,
          prompt: q.prompt,
          options: q.options,
          points: q.points,
        })),
      },
    },
  };
}
