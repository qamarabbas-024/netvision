import {
  CAPSTONE_V1_ASSESSMENT,
  CapstoneGradingEngine,
  getPublicAssessment,
} from '../src/certifications/capstone-assessment';

console.log('========================================================================');
console.log('NETVISION DROP #8: STANDALONE CAPSTONE GRADING ENGINE TEST');
console.log('========================================================================\n');

let passed = 0;
let failed = 0;

function check(assertion: boolean, description: string) {
  if (assertion) {
    console.log(`  ✅ PASS: ${description}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${description}`);
    failed++;
  }
}

// 1. Scoring Weights & Duration Security
const weights = CAPSTONE_V1_ASSESSMENT.scoringWeights;
check(CAPSTONE_V1_ASSESSMENT.durationSeconds === 7200, 'Capstone duration is exactly 7200 seconds (120 minutes)');
check(weights.passingScore === 85, 'Authoritative pass threshold is exactly 85%');
check(weights.theoryWeight === 40, 'Theory weight is exactly 40%');
check(weights.practicalWeight === 35, 'Incident weight is exactly 35%');
check(weights.packetAnalysisWeight === 25, 'Forensics weight is exactly 25%');

const publicAssessment = getPublicAssessment();
check(publicAssessment.theorySection.questions.length === 10, 'Public assessment serves 10 theory questions');
check(publicAssessment.incidentSection.scenario.tasks.length === 5, 'Public assessment serves 5 incident tasks');
check(publicAssessment.forensicsSection.scenario.questions.length === 4, 'Public assessment serves 4 forensics questions');

// Verify zero answer key / explanation leakage in public API
let leaks = 0;
for (const q of publicAssessment.theorySection.questions as any[]) {
  if (q.correctOption !== undefined || q.explanation !== undefined || q.explanationsJson !== undefined) {
    leaks++;
  }
}
for (const t of publicAssessment.incidentSection.scenario.tasks as any[]) {
  if (t.correctAnswer !== undefined || t.validationPattern !== undefined) {
    leaks++;
  }
}
for (const q of publicAssessment.forensicsSection.scenario.questions as any[]) {
  if (q.correctOption !== undefined || q.explanation !== undefined) {
    leaks++;
  }
}
check(leaks === 0, 'Zero answer keys or explanations leaked in public assessment payload');

// 2. Deterministic 100% Submission
const perfectAnswers = {
  theoryAnswers: {
    'THEORY-Q1': 2,
    'THEORY-Q2': 0,
    'THEORY-Q3': 1,
    'THEORY-Q4': 0,
    'THEORY-Q5': 1,
    'THEORY-Q6': 1,
    'THEORY-Q7': 1,
    'THEORY-Q8': 0,
    'THEORY-Q9': 1,
    'THEORY-Q10': 1,
  },
  incidentAnswers: {
    'INCIDENT-TASK1': 'LAYER_2_DATA_LINK',
    'INCIDENT-TASK2': 'SWITCHING_LOOP_BPDU_FILTER',
    'INCIDENT-TASK3': 'UNMANAGED_SWITCH_LOOP_WITH_BPDU_FILTER',
    'INCIDENT-TASK4': ['CMD_SYSLOG', 'CMD_MAC_TABLE', 'CMD_CDP_NEIGHBOR', 'CMD_INTERFACE_CONFIG'],
    'INCIDENT-TASK5': 'REMOVE_BPDUFILTER_ENABLE_BPDUGUARD',
  },
  forensicsAnswers: {
    'FORENSICS-Q1': 0,
    'FORENSICS-Q2': 0,
    'FORENSICS-Q3': 1,
    'FORENSICS-Q4': 0,
  },
};

const gradedPerfect = CapstoneGradingEngine.gradeAttempt(1, perfectAnswers);
check(gradedPerfect.overallScore === 100, 'Perfect answers yield exactly 100% score');
check(gradedPerfect.passed === true, '100% score receives PASS status');

// Empty answers
const gradedEmpty = CapstoneGradingEngine.gradeAttempt(1, { theoryAnswers: {}, incidentAnswers: {}, forensicsAnswers: {} });
check(gradedEmpty.overallScore === 0, 'Empty answers yield 0% score');
check(gradedEmpty.passed === false, '0% score receives FAIL status');

// Boundary failure (83% < 85%)
const boundaryFail = CapstoneGradingEngine.gradeAttempt(1, {
  theoryAnswers: perfectAnswers.theoryAnswers,
  incidentAnswers: {
    'INCIDENT-TASK1': 'LAYER_2_DATA_LINK',
    'INCIDENT-TASK2': 'SWITCHING_LOOP_BPDU_FILTER',
    'INCIDENT-TASK3': 'UNMANAGED_SWITCH_LOOP_WITH_BPDU_FILTER',
  },
  forensicsAnswers: {
    'FORENSICS-Q1': 0,
    'FORENSICS-Q2': 0,
    'FORENSICS-Q3': 1,
  },
});
check(boundaryFail.overallScore === 83, `Calculated boundary fail score: ${boundaryFail.overallScore}%`);
check(boundaryFail.passed === false, 'Score of 83% strictly FAILS passing threshold of 85%');

console.log(`\n========================================================================`);
console.log(`DROP 8 ENGINE VERIFICATION: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================================================\n`);

if (failed > 0) process.exit(1);
