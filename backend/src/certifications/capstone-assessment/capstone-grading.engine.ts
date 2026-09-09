import {
  CandidateCapstoneSubmission,
  CapstoneGradingSummary,
  QuestionGradingResult,
  SectionGradingResult,
} from './capstone-assessment.types';
import { getAuthoritativeAssessment } from './capstone-content.registry';

export class CapstoneGradingEngine {
  /**
   * Authoritatively evaluates a candidate's Capstone attempt submission.
   *
   * SECURITY GUARANTEES:
   * 1. The client-provided componentScores, finalScore, passed, or weights are STRICTLY IGNORED.
   * 2. All points and percentages are derived deterministically from the candidate's actual answers.
   * 3. Scoring weights (40% / 35% / 25%) and passing threshold (85%) are enforced from server-side config.
   */
  public static gradeAttempt(
    version: number,
    submission: CandidateCapstoneSubmission
  ): CapstoneGradingSummary {
    const assessment = getAuthoritativeAssessment(version);
    const weights = assessment.scoringWeights;

    // -----------------------------------------------------------------------
    // 1. Grade Section A: Theory & Protocol Reasoning (Weight: 40%)
    // -----------------------------------------------------------------------
    const theoryQuestions = assessment.theorySection.questions;
    const theoryAnswers = submission.theoryAnswers || {};
    const theoryQuestionResults: QuestionGradingResult[] = [];
    let theoryPointsEarned = 0;
    let theoryMaxPoints = 0;

    for (const q of theoryQuestions) {
      theoryMaxPoints += q.points;
      const candidateAnswer = theoryAnswers[q.id];
      let isCorrect = false;

      if (candidateAnswer !== undefined && candidateAnswer !== null) {
        // Can be number index (0..3) or string index ("0".."3") or string answer matching option index
        const numericCandidate =
          typeof candidateAnswer === 'number'
            ? candidateAnswer
            : parseInt(String(candidateAnswer).trim(), 10);

        if (!isNaN(numericCandidate) && numericCandidate === q.correctOption) {
          isCorrect = true;
        }
      }

      const pointsAwarded = isCorrect ? q.points : 0;
      theoryPointsEarned += pointsAwarded;
      theoryQuestionResults.push({
        questionId: q.id,
        pointsEarned: pointsAwarded,
        maxPoints: q.points,
        passed: isCorrect,
      });
    }

    const theoryScorePercent =
      theoryMaxPoints > 0 ? Math.round((theoryPointsEarned / theoryMaxPoints) * 100) : 0;
    const theoryWeighted = (theoryScorePercent * weights.theoryWeight) / 100;

    const theorySectionResult: SectionGradingResult = {
      sectionName: 'Theory & Protocol Reasoning',
      weightPercent: weights.theoryWeight,
      rawPointsEarned: theoryPointsEarned,
      rawMaxPoints: theoryMaxPoints,
      sectionScorePercent: theoryScorePercent,
      weightedScore: theoryWeighted,
      questions: theoryQuestionResults,
    };

    // -----------------------------------------------------------------------
    // 2. Grade Section B: Multi-Layer Topology Incident Challenge (Weight: 35%)
    // -----------------------------------------------------------------------
    const incidentTasks = assessment.incidentSection.scenario.tasks;
    const incidentAnswers = submission.incidentAnswers || {};
    const incidentQuestionResults: QuestionGradingResult[] = [];
    let incidentPointsEarned = 0;
    let incidentMaxPoints = 0;

    for (const task of incidentTasks) {
      incidentMaxPoints += task.points;
      let isCorrect = false;

      // Extract candidate answer based on taskId or map from incidentAnswers object
      let candidateAns: any = incidentAnswers[task.taskId];
      if (candidateAns === undefined) {
        if (task.taskId === 'INCIDENT-TASK1') candidateAns = incidentAnswers.layerDomain;
        else if (task.taskId === 'INCIDENT-TASK2') candidateAns = incidentAnswers.protocolFailure;
        else if (task.taskId === 'INCIDENT-TASK3') candidateAns = incidentAnswers.rootCause;
        else if (task.taskId === 'INCIDENT-TASK4') candidateAns = incidentAnswers.diagnosticOrder;
        else if (task.taskId === 'INCIDENT-TASK5') candidateAns = incidentAnswers.remediationChoice;
      }

      if (task.type === 'CHOICE') {
        if (typeof candidateAns === 'string' && typeof task.correctAnswer === 'string') {
          isCorrect = candidateAns.trim().toUpperCase() === task.correctAnswer.trim().toUpperCase();
        }
      } else if (task.type === 'ORDERING') {
        if (Array.isArray(candidateAns) && Array.isArray(task.correctAnswer)) {
          const cleanCandidate = candidateAns.map((s) => String(s).trim().toUpperCase());
          const cleanCorrect = task.correctAnswer.map((s) => String(s).trim().toUpperCase());
          isCorrect = JSON.stringify(cleanCandidate) === JSON.stringify(cleanCorrect);
        }
      }

      const pointsAwarded = isCorrect ? task.points : 0;
      incidentPointsEarned += pointsAwarded;
      incidentQuestionResults.push({
        questionId: task.taskId,
        pointsEarned: pointsAwarded,
        maxPoints: task.points,
        passed: isCorrect,
      });
    }

    const incidentScorePercent =
      incidentMaxPoints > 0 ? Math.round((incidentPointsEarned / incidentMaxPoints) * 100) : 0;
    const incidentWeighted = (incidentScorePercent * weights.practicalWeight) / 100;

    const incidentSectionResult: SectionGradingResult = {
      sectionName: 'Multi-Layer Topology Incident Challenge',
      weightPercent: weights.practicalWeight,
      rawPointsEarned: incidentPointsEarned,
      rawMaxPoints: incidentMaxPoints,
      sectionScorePercent: incidentScorePercent,
      weightedScore: incidentWeighted,
      questions: incidentQuestionResults,
    };

    // -----------------------------------------------------------------------
    // 3. Grade Section C: Packet-Capture Forensics (Weight: 25%)
    // -----------------------------------------------------------------------
    const forensicsQuestions = assessment.forensicsSection.scenario.questions;
    const forensicsAnswers = submission.forensicsAnswers || {};
    const forensicsQuestionResults: QuestionGradingResult[] = [];
    let forensicsPointsEarned = 0;
    let forensicsMaxPoints = 0;

    for (const q of forensicsQuestions) {
      forensicsMaxPoints += q.points;
      const candidateAnswer = forensicsAnswers[q.id];
      let isCorrect = false;

      if (candidateAnswer !== undefined && candidateAnswer !== null) {
        const numericCandidate =
          typeof candidateAnswer === 'number'
            ? candidateAnswer
            : parseInt(String(candidateAnswer).trim(), 10);

        if (!isNaN(numericCandidate) && numericCandidate === q.correctOption) {
          isCorrect = true;
        }
      }

      const pointsAwarded = isCorrect ? q.points : 0;
      forensicsPointsEarned += pointsAwarded;
      forensicsQuestionResults.push({
        questionId: q.id,
        pointsEarned: pointsAwarded,
        maxPoints: q.points,
        passed: isCorrect,
      });
    }

    const forensicsScorePercent =
      forensicsMaxPoints > 0 ? Math.round((forensicsPointsEarned / forensicsMaxPoints) * 100) : 0;
    const forensicsWeighted = (forensicsScorePercent * weights.packetAnalysisWeight) / 100;

    const forensicsSectionResult: SectionGradingResult = {
      sectionName: 'Packet-Capture Forensics',
      weightPercent: weights.packetAnalysisWeight,
      rawPointsEarned: forensicsPointsEarned,
      rawMaxPoints: forensicsMaxPoints,
      sectionScorePercent: forensicsScorePercent,
      weightedScore: forensicsWeighted,
      questions: forensicsQuestionResults,
    };

    // -----------------------------------------------------------------------
    // 4. Calculate Final Weighted Score & Determine Pass / Fail
    // -----------------------------------------------------------------------
    const overallScore = Math.round(theoryWeighted + incidentWeighted + forensicsWeighted);
    const passed = overallScore >= weights.passingScore;

    return {
      assessmentVersion: assessment.version,
      examCode: assessment.examCode,
      overallScore,
      passed,
      passingThreshold: weights.passingScore,
      componentScores: {
        theoryScore: theoryScorePercent,
        practicalScore: incidentScorePercent,
        packetAnalysisScore: forensicsScorePercent,
      },
      weightedScores: {
        theoryWeighted,
        practicalWeighted: incidentWeighted,
        packetAnalysisWeighted: forensicsWeighted,
      },
      scoringWeights: weights,
      sections: {
        theory: theorySectionResult,
        incident: incidentSectionResult,
        forensics: forensicsSectionResult,
      },
      candidateResponsesSnapshot: {
        theoryAnswersCount: Object.keys(theoryAnswers).length,
        incidentAnswersProvided: Object.keys(incidentAnswers).length > 0,
        forensicsAnswersCount: Object.keys(forensicsAnswers).length,
      },
    };
  }
}
