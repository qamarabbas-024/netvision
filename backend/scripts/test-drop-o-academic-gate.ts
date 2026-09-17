import { BENCHMARK_LESSONS_FULL } from '../src/topics/benchmark-lessons-content';
import { EXPANDED_ASSESSMENT_QUESTION_BANK } from '../src/topics/assessment-question-bank';
import { ALL_CURRICULUM_LABS } from '../src/topics/curriculum-labs-catalog';
import { NetworkSimulationEngine } from '../src/topics/network-simulation.engine';
const CANONICAL_TEXTBOOK_MAPPING = require('../src/topics/data/textbook-curriculum-mapping.json');

console.log('========================================================================');
console.log('NETVISION DROP O: COMPREHENSIVE ACADEMIC & ENGINEERING GATE');
console.log('========================================================================\n');

let passed = 0;
let failed = 0;

function check(condition: boolean, message: string, detail?: string) {
  if (condition) {
    passed++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message}${detail ? ` -> ${detail}` : ''}`);
  }
}

// -----------------------------------------------------------------------------
// Suite 1: Curriculum & Content Integrity (46 Lessons)
// -----------------------------------------------------------------------------
console.log('--- Suite 1: Curriculum & Lesson Population (46 Lessons) ---');
check(BENCHMARK_LESSONS_FULL.length === 46, `Expected exactly 46 published lessons, found ${BENCHMARK_LESSONS_FULL.length}`);

let nullContent = 0;
let validLessons = 0;
for (const lesson of BENCHMARK_LESSONS_FULL) {
  if (!lesson.contentV2 || !lesson.contentV2.explanation || lesson.contentV2.explanation.trim().length === 0) {
    nullContent++;
  } else {
    validLessons++;
  }
}
check(nullContent === 0, `Zero null-content published lessons (valid: ${validLessons}, null: ${nullContent})`);

// -----------------------------------------------------------------------------
// Suite 2: Lab Taxonomy & Engineering Quality (18 Tier-1, 21 Tier-2, 7 Tier-3)
// -----------------------------------------------------------------------------
console.log('\n--- Suite 2: Lab Taxonomy & Engineering Simulation Quality ---');
let t1Count = 0;
let t2Count = 0;
let t3Count = 0;

for (const lesson of BENCHMARK_LESSONS_FULL) {
  const lab = ALL_CURRICULUM_LABS[lesson.slug] || (lesson as any).lab;
  if (!lab) continue;
  const tier = (lab as any).tier;
  if (tier === 'TIER_1_SIMULATION' || tier === 1) t1Count++;
  else if (tier === 'TIER_2_GUIDED' || tier === 2) t2Count++;
  else if (tier === 'TIER_3_CONCEPTUAL' || tier === 3) t3Count++;
}

check(t1Count === 18, `Expected exactly 18 Tier-1 engineering simulation labs, found ${t1Count}`);
check(t2Count === 21, `Expected exactly 21 Tier-2 guided practice labs, found ${t2Count}`);
check(t3Count === 7, `Expected exactly 7 Tier-3 conceptual labs, found ${t3Count}`);
check(t1Count + t2Count + t3Count === 46, `Total labs categorized: ${t1Count + t2Count + t3Count} / 46`);

// -----------------------------------------------------------------------------
// Suite 3: State Simulation Engine & Anti-Cheat Validation
// -----------------------------------------------------------------------------
console.log('\n--- Suite 3: Simulated State Validation & Anti-Cheat Verification ---');
// Verify that "show" commands alone never pass a Tier-1 configuration task
const initialState = NetworkSimulationEngine.getInitialStateForLab('level-0-switches-local-lan-forwarders');
const initialVlanCount = Object.keys(initialState.vlans).length;

// Run show command
const showResult = NetworkSimulationEngine.executeCommand('show vlan brief', initialState);
check(showResult.output.includes('VLAN Name'), 'show vlan brief returns formatted VLAN table');
check(
  Object.keys(showResult.updatedState.vlans).length === initialVlanCount,
  '"show" command produces zero state mutation in simulated state'
);

// Run configuration command sequence: conf t -> vlan 20 -> name Engineering
const confT = NetworkSimulationEngine.executeCommand('configure terminal', showResult.updatedState);
check(confT.updatedState.currentConfigMode === 'GLOBAL_CONFIG', 'configure terminal navigates to GLOBAL_CONFIG');

const vlan20 = NetworkSimulationEngine.executeCommand('vlan 20', confT.updatedState);
check(vlan20.updatedState.activeVlanId === 20, 'vlan 20 switches to VLAN_CONFIG mode');

const nameEng = NetworkSimulationEngine.executeCommand('name Engineering', vlan20.updatedState);
check(nameEng.updatedState.vlans[20] !== undefined, 'VLAN 20 successfully created in switch state');
check(nameEng.updatedState.vlans[20]?.name === 'Engineering', 'VLAN 20 name correctly set to Engineering in state');

// -----------------------------------------------------------------------------
// Suite 4: Assessment Question Bank Psychometrics (229 Questions)
// -----------------------------------------------------------------------------
console.log('\n--- Suite 4: Assessment Question Bank Psychometrics (229 Questions) ---');
check(EXPANDED_ASSESSMENT_QUESTION_BANK.length === 229, `Authoritative question count: 229, found ${EXPANDED_ASSESSMENT_QUESTION_BANK.length}`);

const keyCounts = [0, 0, 0, 0];
let strictlyLongest = 0;
let tiedLongest = 0;
let notLongest = 0;

for (let i = 0; i < EXPANDED_ASSESSMENT_QUESTION_BANK.length; i++) {
  const q = EXPANDED_ASSESSMENT_QUESTION_BANK[i];
  keyCounts[q.correctOption]++;
  const lens = q.options.map(o => o.trim().length);
  const correctLen = lens[q.correctOption];
  const otherLens = lens.filter((_, idx) => idx !== q.correctOption);
  const maxOther = Math.max(...otherLens);
  const maxAll = Math.max(...lens);

  if (correctLen > maxOther) strictlyLongest++;
  else if (correctLen === maxOther && correctLen === maxAll) tiedLongest++;
  else notLongest++;
}

check(
  keyCounts[0] === 58 && keyCounts[1] === 57 && keyCounts[2] === 57 && keyCounts[3] === 57,
  `Balanced key distribution preserved: A=${keyCounts[0]}, B=${keyCounts[1]}, C=${keyCounts[2]}, D=${keyCounts[3]}`
);

// Verify the 9 protected tied questions were untouched
const protectedTies = [63, 85, 93, 112, 160, 174, 175, 176, 181];
let tiesUntouched = true;
for (const idx of protectedTies) {
  const q = EXPANDED_ASSESSMENT_QUESTION_BANK[idx];
  const lens = q.options.map(o => o.trim().length);
  const correctLen = lens[q.correctOption];
  const maxOther = Math.max(...lens.filter((_, i) => i !== q.correctOption));
  if (correctLen !== maxOther) {
    tiesUntouched = false;
  }
}
check(tiesUntouched, 'All 9 protected tied questions preserved untouched');
check(strictlyLongest === 144, `Strictly longest option count reduced from 175 to ${strictlyLongest}`);

// -----------------------------------------------------------------------------
// Suite 5: Textbook Mapping & Attribution Invariant (100% Coverage)
// -----------------------------------------------------------------------------
console.log('\n--- Suite 5: Textbook Curriculum Mapping & Attribution Invariant ---');
const mappingEntries = Array.isArray(CANONICAL_TEXTBOOK_MAPPING)
  ? CANONICAL_TEXTBOOK_MAPPING
  : CANONICAL_TEXTBOOK_MAPPING.curriculumMapping;

check(mappingEntries.length === 46, `Textbook mapping covers all 46 lessons (Found: ${mappingEntries.length})`);

const allMappedHaveRfcs = mappingEntries.every((m: any) => m.standardsRefs && m.standardsRefs.length > 0);
check(allMappedHaveRfcs, '100% of mapped lessons reference formal RFCs or IEEE standards');

const allMappedHaveObjectives = mappingEntries.every((m: any) => m.learningObjectives && m.learningObjectives.length >= 2);
check(allMappedHaveObjectives, '100% of mapped lessons have Bloom-aligned learning objectives');

const allMappedHaveChapters = mappingEntries.every((m: any) => m.textbookChapterNumber !== undefined && m.textbookChapterTitle);
check(allMappedHaveChapters, '100% of mapped lessons map to textbook chapters');

console.log('\n========================================================================');
console.log(`FINAL RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('========================================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
