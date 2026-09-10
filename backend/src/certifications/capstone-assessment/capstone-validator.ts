import { CapstoneAssessmentDefinition } from './capstone-assessment.types';

export interface AssessmentValidationReport {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  metrics: {
    version: number;
    totalTheoryPoints: number;
    totalIncidentPoints: number;
    totalForensicsPoints: number;
    sumOfSectionWeights: number;
    passingScore: number;
    questionCount: number;
  };
}

/**
 * Validates the structural, mathematical, and cryptographic/answer integrity
 * of an authoritative Capstone Assessment definition before deployment.
 */
export function validateAssessmentDefinition(
  assessment: CapstoneAssessmentDefinition
): AssessmentValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const seenIds = new Set<string>();

  // 1. Version and Identifiers
  if (!assessment.version || assessment.version < 1) {
    errors.push(`Invalid assessment version: ${assessment.version}. Must be >= 1.`);
  }
  if (!assessment.examCode || assessment.examCode.trim() === '') {
    errors.push('Missing or empty examCode.');
  }
  if (!assessment.certificationCode || assessment.certificationCode.trim() === '') {
    errors.push('Missing or empty certificationCode.');
  }
  if (!assessment.durationSeconds || assessment.durationSeconds <= 0) {
    errors.push(`Invalid durationSeconds: ${assessment.durationSeconds}. Must be > 0.`);
  }

  // 2. Scoring Weights Invariant
  const weights = assessment.scoringWeights;
  if (!weights) {
    errors.push('Missing scoringWeights definition.');
  } else {
    const totalWeight =
      weights.theoryWeight + weights.practicalWeight + weights.packetAnalysisWeight;
    if (totalWeight !== 100) {
      errors.push(
        `Section weights must sum exactly to 100%. Current sum: ${totalWeight}% (theory: ${weights.theoryWeight}, practical: ${weights.practicalWeight}, packet: ${weights.packetAnalysisWeight})`
      );
    }
    if (weights.passingScore <= 0 || weights.passingScore > 100) {
      errors.push(`Invalid passingScore: ${weights.passingScore}. Must be between 1 and 100.`);
    }
  }

  // 3. Section A: Theory Questions Validation
  let theoryPointsTotal = 0;
  if (!assessment.theorySection || !Array.isArray(assessment.theorySection.questions)) {
    errors.push('Missing theorySection or questions array.');
  } else {
    for (const q of assessment.theorySection.questions) {
      if (!q.id || q.id.trim() === '') {
        errors.push('Theory question found with missing or empty id.');
      } else if (seenIds.has(q.id)) {
        errors.push(`Duplicate question ID detected: ${q.id}`);
      } else {
        seenIds.add(q.id);
      }

      if (!q.prompt || q.prompt.trim() === '') {
        errors.push(`Theory question [${q.id}] has an empty prompt.`);
      }

      if (!Array.isArray(q.options) || q.options.length < 2) {
        errors.push(`Theory question [${q.id}] must have at least 2 options.`);
      } else if (
        typeof q.correctOption !== 'number' ||
        q.correctOption < 0 ||
        q.correctOption >= q.options.length
      ) {
        errors.push(
          `Theory question [${q.id}] correctOption (${q.correctOption}) is out of bounds (options count: ${q.options.length}).`
        );
      }

      if (typeof q.points !== 'number' || q.points <= 0) {
        errors.push(`Theory question [${q.id}] must have positive points.`);
      } else {
        theoryPointsTotal += q.points;
      }
    }
  }

  // 4. Section B: Incident Tasks Validation
  let incidentPointsTotal = 0;
  if (
    !assessment.incidentSection ||
    !assessment.incidentSection.scenario ||
    !Array.isArray(assessment.incidentSection.scenario.tasks)
  ) {
    errors.push('Missing incidentSection scenario or tasks array.');
  } else {
    for (const t of assessment.incidentSection.scenario.tasks) {
      if (!t.taskId || t.taskId.trim() === '') {
        errors.push('Incident task found with missing or empty taskId.');
      } else if (seenIds.has(t.taskId)) {
        errors.push(`Duplicate task ID detected: ${t.taskId}`);
      } else {
        seenIds.add(t.taskId);
      }

      if (!t.prompt || t.prompt.trim() === '') {
        errors.push(`Incident task [${t.taskId}] has an empty prompt.`);
      }

      if (!Array.isArray(t.options) || t.options.length === 0) {
        errors.push(`Incident task [${t.taskId}] must have options.`);
      }

      if (t.type === 'CHOICE') {
        if (!t.correctAnswer || typeof t.correctAnswer !== 'string') {
          errors.push(`Incident CHOICE task [${t.taskId}] must have a string correctAnswer.`);
        }
      } else if (t.type === 'ORDERING') {
        if (!Array.isArray(t.correctAnswer) || t.correctAnswer.length === 0) {
          errors.push(`Incident ORDERING task [${t.taskId}] must have an array correctAnswer.`);
        }
      }

      if (typeof t.points !== 'number' || t.points <= 0) {
        errors.push(`Incident task [${t.taskId}] must have positive points.`);
      } else {
        incidentPointsTotal += t.points;
      }
    }
  }

  // 5. Section C: Forensics Questions Validation
  let forensicsPointsTotal = 0;
  if (
    !assessment.forensicsSection ||
    !assessment.forensicsSection.scenario ||
    !Array.isArray(assessment.forensicsSection.scenario.questions)
  ) {
    errors.push('Missing forensicsSection scenario or questions array.');
  } else {
    for (const fq of assessment.forensicsSection.scenario.questions) {
      if (!fq.id || fq.id.trim() === '') {
        errors.push('Forensics question found with missing or empty id.');
      } else if (seenIds.has(fq.id)) {
        errors.push(`Duplicate question ID detected: ${fq.id}`);
      } else {
        seenIds.add(fq.id);
      }

      if (!fq.prompt || fq.prompt.trim() === '') {
        errors.push(`Forensics question [${fq.id}] has an empty prompt.`);
      }

      if (!Array.isArray(fq.options) || fq.options.length < 2) {
        errors.push(`Forensics question [${fq.id}] must have at least 2 options.`);
      } else if (
        typeof fq.correctOption !== 'number' ||
        fq.correctOption < 0 ||
        fq.correctOption >= fq.options.length
      ) {
        errors.push(
          `Forensics question [${fq.id}] correctOption (${fq.correctOption}) is out of bounds (options count: ${fq.options.length}).`
        );
      }

      if (typeof fq.points !== 'number' || fq.points <= 0) {
        errors.push(`Forensics question [${fq.id}] must have positive points.`);
      } else {
        forensicsPointsTotal += fq.points;
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    metrics: {
      version: assessment.version,
      totalTheoryPoints: theoryPointsTotal,
      totalIncidentPoints: incidentPointsTotal,
      totalForensicsPoints: forensicsPointsTotal,
      sumOfSectionWeights: weights
        ? weights.theoryWeight + weights.practicalWeight + weights.packetAnalysisWeight
        : 0,
      passingScore: weights?.passingScore ?? 0,
      questionCount: seenIds.size,
    },
  };
}
