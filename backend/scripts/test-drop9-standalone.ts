import {
  CAPSTONE_V1_ASSESSMENT,
  CapstoneGradingEngine,
  validateAssessmentDefinition,
} from '../src/certifications/capstone-assessment';

console.log('========================================================================');
console.log('NETVISION DROP #9: STANDALONE CERTIFICATION INTEGRITY & INVARIANTS TEST');
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

// 1. Assessment Definition Invariants
const validationResult = validateAssessmentDefinition(CAPSTONE_V1_ASSESSMENT);
check(validationResult.isValid === true, 'validateAssessmentDefinition(CAPSTONE_V1_ASSESSMENT) reports isValid = true');
check(validationResult.errors.length === 0, 'Zero errors in authoritative assessment definition');

// 2. Weight Sum Invariant
const weights = CAPSTONE_V1_ASSESSMENT.scoringWeights;
const totalWeight = weights.theoryWeight + weights.practicalWeight + weights.packetAnalysisWeight;
check(totalWeight === 100, `Weights sum to exactly 100% (40 + 35 + 25 = ${totalWeight}%)`);
check(weights.passingScore === 85, 'Passing threshold is strictly 85%');

// 3. Question IDs Uniqueness Invariant
const idSet = new Set<string>();
let duplicates = 0;

for (const q of CAPSTONE_V1_ASSESSMENT.theorySection.questions) {
  if (idSet.has(q.id)) duplicates++;
  idSet.add(q.id);
}
for (const t of CAPSTONE_V1_ASSESSMENT.incidentSection.scenario.tasks) {
  if (idSet.has(t.taskId)) duplicates++;
  idSet.add(t.taskId);
}
for (const q of CAPSTONE_V1_ASSESSMENT.forensicsSection.scenario.questions) {
  if (idSet.has(q.id)) duplicates++;
  idSet.add(q.id);
}
check(duplicates === 0, 'All question and task IDs across all 3 sections are globally unique');

// 4. Malformed/Malicious Payload Resilience
const malformedSubmission = {
  theoryAnswers: {
    'THEORY-Q1': -999,
    'THEORY-Q2': NaN,
    'THEORY-UNKNOWN-XYZ': 2,
    'THEORY-Q3': 'malicious_string_injection' as any,
  },
  incidentAnswers: {
    'INCIDENT-TASK1': { malicious: 'object' } as any,
    'INCIDENT-FAKE-TASK': 'LAYER_2_DATA_LINK',
  },
  forensicsAnswers: {
    'FORENSICS-Q1': [1, 2, 3] as any,
  },
};

const malformedGrading = CapstoneGradingEngine.gradeAttempt(1, malformedSubmission);
check(malformedGrading.overallScore === 0, 'Malformed payload with invalid types scores 0%');
check(malformedGrading.passed === false, 'Malformed payload receives FAIL status');
check(malformedGrading.componentScores.theoryScore === 0, 'Theory component safely handles malformed types');
check(malformedGrading.componentScores.practicalScore === 0, 'Incident component safely handles malformed types');
check(malformedGrading.componentScores.packetAnalysisScore === 0, 'Forensics component safely handles malformed types');

console.log(`\n========================================================================`);
console.log(`DROP 9 INTEGRITY VERIFICATION: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================================================\n`);

if (failed > 0) process.exit(1);
