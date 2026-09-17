import { BENCHMARK_LESSONS_FULL } from '../src/topics/benchmark-lessons-content';

console.log(`Auditing BENCHMARK_LESSONS_FULL (Total: ${BENCHMARK_LESSONS_FULL.length})...\n`);

let t1 = 0;
let t2 = 0;
let t3 = 0;
let missing = 0;

for (const lesson of BENCHMARK_LESSONS_FULL) {
  if (!lesson.lab) {
    console.error(`❌ MISSING LAB: ${lesson.slug}`);
    missing++;
    continue;
  }

  const lab = lesson.lab;
  const tier = (lab as any).tier || 'UNKNOWN';
  if (tier === 'TIER_1_SIMULATION') t1++;
  else if (tier === 'TIER_2_GUIDED') t2++;
  else if (tier === 'TIER_3_CONCEPTUAL') t3++;

  if (!lab.tasks || lab.tasks.length === 0) {
    console.error(`❌ EMPTY TASKS: ${lesson.slug}`);
  }
}

console.log('--- LAB CLASSIFICATION RESULTS ---');
console.log(`Tier 1 (Engineering Simulation): ${t1}`);
console.log(`Tier 2 (Guided Engineering Practice): ${t2}`);
console.log(`Tier 3 (Conceptual / Analytical Exploration): ${t3}`);
console.log(`Missing Labs: ${missing}`);
console.log(`Total Labs Verified: ${t1 + t2 + t3}`);

if (missing === 0 && t1 === 18 && t2 === 21 && t3 === 7) {
  console.log('\n✅ ALL 46 LABS VERIFIED ACCORDING TO APPROVED TAXONOMY!');
} else {
  console.error('\n❌ Discrepancy in lab count!');
}
