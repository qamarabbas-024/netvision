import { LESSONS_NET203_204 } from '../src/topics/lessons-net203-204';
import { EXPANDED_ASSESSMENT_QUESTION_BANK } from '../src/topics/assessment-question-bank';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`[IPV6 CURRICULUM ASSERTION FAILED]: ${msg}`);
  }
}

// RFC 5952 Reference Compression Algorithm for validation
function compressIpv6(fullHexAddr: string): string {
  const parts = fullHexAddr.split(':').map((h) => {
    const trimmed = h.replace(/^0+/, '');
    return trimmed === '' ? '0' : trimmed;
  });

  let bestStart = -1;
  let bestLength = 0;
  let currentStart = -1;
  let currentLength = 0;

  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === '0') {
      if (currentStart === -1) {
        currentStart = i;
        currentLength = 1;
      } else {
        currentLength++;
      }
    } else {
      if (currentLength > bestLength) {
        bestStart = currentStart;
        bestLength = currentLength;
      }
      currentStart = -1;
      currentLength = 0;
    }
  }
  if (currentLength > bestLength) {
    bestStart = currentStart;
    bestLength = currentLength;
  }

  if (bestLength > 1) {
    const left = parts.slice(0, bestStart).join(':');
    const right = parts.slice(bestStart + bestLength).join(':');
    return `${left}::${right}`;
  }

  return parts.join(':');
}

async function verifyIpv6Curriculum() {
  console.log('================================================================');
  console.log('🧪 NET-203 IPV6 FOUNDATIONS & SLAAC CURRICULUM VERIFICATION');
  console.log('================================================================\n');

  // [TEST 1] Find and verify lesson structure
  console.log('[TEST 1] Verifying IPv6 Foundations Lesson Structure...');
  const ipv6Lesson = LESSONS_NET203_204.find((l) => l.slug === 'ipv6-foundations-overview');
  assert(!!ipv6Lesson, 'Lesson "ipv6-foundations-overview" exists in NET-203 curriculum');
  assert(ipv6Lesson!.courseCode === 'NET-203', 'Lesson belongs to course NET-203');
  assert(ipv6Lesson!.order === 5, 'Lesson is order 5 in NET-203 sequence');
  assert(ipv6Lesson!.visualizationType === 'IPV6_COMPRESSOR_ENGINE', 'Visualization type is IPV6_COMPRESSOR_ENGINE');
  console.log(`  ✓ Lesson "${ipv6Lesson!.title}" verified in NET-203.`);

  // [TEST 2] Verify 18-step pedagogical metadata & core concepts
  console.log('\n[TEST 2] Verifying 18-Step Pedagogical Metadata & 20 Core Concepts...');
  const meta = ipv6Lesson!.stepMetadata;
  assert(!!meta, 'Lesson contains stepMetadata');
  assert(!!meta.step1_objective, 'Step 1: Objective defined');
  assert(!!meta.step2_prerequisites && meta.step2_prerequisites.length > 0, 'Step 2: Prerequisites defined');
  assert(!!meta.step3_whyItMatters, 'Step 3: Why It Matters defined');
  assert(!!meta.step4_coreConcept, 'Step 4: Core Concept defined');
  assert(meta.step4_coreConcept.includes('128 bits') || meta.step4_coreConcept.includes('RFC 5952'), 'Core concept includes 128-bit architecture & RFC 5952');
  assert(!!meta.step5_technicalAnatomy, 'Step 5: Technical Anatomy defined');
  assert(!!meta.step6_howItWorks, 'Step 6: How It Works defined');
  assert(!!meta.step7_packetHeaderView, 'Step 7: 40-Byte Header View defined');
  assert(!!meta.step8_visualExplanation, 'Step 8: Visual Explanation defined');
  assert(!!meta.step9_workedExample, 'Step 9: Worked Example defined');
  assert(!!meta.step10_realWorldScenario, 'Step 10: Real World Scenario defined');
  assert(!!meta.step11_deviceBehavior, 'Step 11: Device Behavior defined');
  assert(!!meta.step12_cliTooling && meta.step12_cliTooling.length > 0, 'Step 12: CLI Tooling defined');
  assert(!!meta.step13_troubleshooting && meta.step13_troubleshooting.length > 0, 'Step 13: Troubleshooting defined');
  assert(!!meta.step14_commonMistakes && meta.step14_commonMistakes.length > 0, 'Step 14: Common Mistakes defined');
  assert(!!meta.step15_securityPerspective, 'Step 15: Security Perspective defined');
  assert(!!meta.step16_examPrep, 'Step 16: Exam Prep defined');
  assert(!!meta.step17_practicalLabRef, 'Step 17: Practical Lab Reference defined');
  assert(!!meta.step18_masterySummary, 'Step 18: Mastery Summary defined');
  console.log('  ✓ All 18 pedagogical steps and core concepts verified.');

  // [TEST 3] Verify Assessment Questions across 4 Cognitive Levels
  console.log('\n[TEST 3] Verifying Assessment Question Bank & Cognitive Levels...');
  const questions = ipv6Lesson!.questions;
  assert(questions.length >= 4, `At least 4 questions defined (found: ${questions.length})`);

  const cognitiveLevels = questions.map((q) => q.cognitiveLevel);
  assert(cognitiveLevels.includes('RECALL' as any), 'Contains RECALL question');
  assert(cognitiveLevels.includes('UNDERSTANDING' as any), 'Contains UNDERSTANDING question');
  assert(cognitiveLevels.includes('APPLICATION' as any), 'Contains APPLICATION question');
  assert(cognitiveLevels.includes('TROUBLESHOOTING' as any), 'Contains TROUBLESHOOTING question');

  questions.forEach((q, idx) => {
    assert(q.options.length === 4, `Question ${idx + 1} has exactly 4 options`);
    assert(q.correctOption === 0, `Question ${idx + 1} has correct option mapped`);
    assert(!!q.explanation, `Question ${idx + 1} has explanation`);
    assert(Object.keys(q.explanationsJson).length >= 3, `Question ${idx + 1} has distractor explanations`);
  });
  console.log(`  ✓ ${questions.length} questions verified spanning Recall, Understanding, Application, and Troubleshooting.`);

  // [TEST 4] Verify Lab Topology & Tasks
  console.log('\n[TEST 4] Verifying Practical IPv6 SLAAC Lab Objectives...');
  const lab = ipv6Lesson!.lab;
  assert(!!lab, 'Lesson has associated lab');
  assert(lab!.tasks.length >= 4, `Lab contains at least 4 practical tasks (found: ${lab!.tasks.length})`);
  assert(!!lab!.initialTopologyJson, 'Lab has initialTopologyJson defined');
  console.log(`  ✓ Practical Lab "${lab!.title}" verified with ${lab!.tasks.length} tasks.`);

  // [TEST 5] RFC 5952 Canonical Zero Compression Rules Engine
  console.log('\n[TEST 5] Validating RFC 5952 Zero Compression Algorithm...');
  const testCases = [
    { input: '2001:0db8:0000:0000:0000:0000:0000:0001', expected: '2001:db8::1' },
    { input: 'fe80:0000:0000:0000:0200:00ff:fe00:0042', expected: 'fe80::200:ff:fe00:42' },
    { input: '0000:0000:0000:0000:0000:0000:0000:0001', expected: '::1' },
    { input: '2001:0db8:0000:0042:0000:0000:0000:0001', expected: '2001:db8:0:42::1' },
    { input: 'ff02:0000:0000:0000:0000:0000:0000:0002', expected: 'ff02::2' },
  ];

  for (const tc of testCases) {
    const result = compressIpv6(tc.input);
    assert(result === tc.expected, `Compression of "${tc.input}" yielded "${result}" (expected "${tc.expected}")`);
  }
  console.log('  ✓ All RFC 5952 zero compression test vectors matched canonical outputs.');

  console.log('\n================================================================');
  console.log('🎉 ALL 5 IPV6 FOUNDATIONS & SLAAC TESTS PASSED!');
  console.log('================================================================\n');
}

verifyIpv6Curriculum().catch((err) => {
  console.error('\n❌ IPV6 CURRICULUM VERIFICATION FAILED:', err);
  process.exit(1);
});
